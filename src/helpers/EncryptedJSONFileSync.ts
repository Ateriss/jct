import fs from "fs";
import path from "path";
import crypto from "crypto";
import os from "os";
import { getMasterKey } from "./envHandler.js";

const JCT_DIR = path.join(os.homedir(), ".jct");
const MASTER_KEY = path.join(JCT_DIR, "master.key");

/* ------------------------- Helpers ------------------------- */



function encrypt(text: string, key: Buffer): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
    const encrypted = Buffer.concat([cipher.update(text, "utf8"), cipher.final()]);
    return iv.toString("hex") + ":" + encrypted.toString("hex");
}

function decrypt(data: string, key: Buffer): string {
    const [ivHex, encryptedHex] = data.split(":");
    const iv = Buffer.from(ivHex, "hex");
    const encrypted = Buffer.from(encryptedHex, "hex");

    const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
    return decrypted.toString("utf8");
}

/* ------------------------- Adapter ------------------------- */

export class EncryptedJSONFileSync<T> {
    private file: string;
    private key: Buffer;

    constructor(filename: string) {
        this.file = filename;
        this.key = getMasterKey();
    }

    read(): T | null {
        if (!fs.existsSync(this.file)) return null;

        const encrypted = fs.readFileSync(this.file, "utf8").trim();
        if (!encrypted) return null;

        try {
            const json = decrypt(encrypted, this.key);
            return JSON.parse(json);
        } catch (e) {
            console.error("⚠ Error decrypting DB:", e);
            return null;
        }
    }

    write(obj: T): void {
        const json = JSON.stringify(obj, null, 2);
        const encrypted = encrypt(json, this.key);
        fs.writeFileSync(this.file, encrypted);
    }
}
