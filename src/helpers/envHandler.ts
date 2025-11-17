import fs from "fs";
import path from "path";
import os from "os";
import crypto from "crypto";

// ---------------------------------------------------------
// Rutas globales (~/.jct/)
// ---------------------------------------------------------

const GLOBAL_DIR = path.join(os.homedir(), ".jct");
const KEY_PATH = path.join(GLOBAL_DIR, "master.key");
const CONFIG_PATH = path.join(GLOBAL_DIR, "config.enc");


const ensureEnvironment = () => {
  if (!fs.existsSync(GLOBAL_DIR)) {
    fs.mkdirSync(GLOBAL_DIR, { recursive: true });
  }

  if (!fs.existsSync(KEY_PATH)) {
    const key = crypto.randomBytes(32); // 32 bytes AES-256
    fs.writeFileSync(KEY_PATH, key.toString("base64"), "utf8");
  }

  if (!fs.existsSync(CONFIG_PATH)) {
    fs.writeFileSync(CONFIG_PATH, "");
  }
};

export const getMasterKey = () => {
  ensureEnvironment();

  const base64Key = fs.readFileSync(KEY_PATH, "utf8").trim();
  const key = Buffer.from(base64Key, "base64");

  if (key.length !== 32) {
    throw new Error("Master key inválida. Debe tener 32 bytes.");
  }

  return key;
};



// ---------------------------------------------------------
// AES-256-GCM Encrypt / Decrypt
// ---------------------------------------------------------

const encrypt = (plainText: string, key: Buffer) => {
  const iv = crypto.randomBytes(12); 
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);

  const encrypted = Buffer.concat([
    cipher.update(plainText, "utf8"),
    cipher.final()
  ]);

  const tag = cipher.getAuthTag();

  return Buffer.concat([iv, tag, encrypted]).toString("base64");
};

const decrypt = (encryptedBase64: string, key: Buffer) => {
  const raw = Buffer.from(encryptedBase64, "base64");

  const iv = raw.subarray(0, 12);
  const tag = raw.subarray(12, 28);
  const encrypted = raw.subarray(28);

  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);

  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final()
  ]);

  return decrypted.toString("utf8");
};

// ---------------------------------------------------------
// Cargar / Guardar config cifrada
// ---------------------------------------------------------

const loadConfig = () => {
  ensureEnvironment();

  const key = getMasterKey();
  const content = fs.readFileSync(CONFIG_PATH, "utf8").trim();

  if (!content) return {};

  try {
    const json = decrypt(content, key);
    return JSON.parse(json);
  } catch {
    return {}; 
  }
};

const saveConfig = (config: any) => {
  ensureEnvironment();

  const key = getMasterKey();
  const json = JSON.stringify(config, null, 2);
  const encrypted = encrypt(json, key);
  fs.writeFileSync(CONFIG_PATH, encrypted);
};


export const getEnvValue = (key: number) => {
  const config = loadConfig();
  return config[key] ?? null;
};

export const setEnvKey = (key: number, value: string) => {
  const config = loadConfig();
  config[key] = value;
  saveConfig(config);
  return value;
};
