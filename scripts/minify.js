// scripts/minify.js
// Uso: node scripts/minify.js [carpeta] [concurrencia]

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { minify } from "terser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = process.argv[2] || "dist";
const CONCURRENCY = parseInt(process.argv[3], 10) || 4;

// Configuración de Terser
const terserOptions = {
  compress: true,
  mangle: { toplevel: true },
  format: {
    comments: false,
    beautify: false,
    ecma: 2020,
    ascii_only: true
  }
};

function walk(dir, fileList = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const ent of entries) {
    const full = path.join(dir, ent.name);

    if (ent.isDirectory()) {
      walk(full, fileList);
    } else if (ent.isFile() && full.endsWith(".js")) {
      fileList.push(full);
    }
  }
  return fileList;
}

async function processFile(file) {
  try {
    const code = fs.readFileSync(file, "utf8");
    const res = await minify(code, terserOptions);

    if (!res?.code) {
      console.error(`❌ Terser no devolvió código para: ${file}`);
      return;
    }

    fs.writeFileSync(file, res.code, "utf8");
    console.log(`✓ Minificado: ${file}`);
  } catch (err) {
    console.error(`✗ Error procesando ${file}:`, err?.message || err);
  }
}

async function run() {
  if (!fs.existsSync(ROOT)) {
    console.error(`Carpeta no encontrada: ${ROOT}`);
    process.exit(1);
  }

  const files = walk(ROOT);

  if (files.length === 0) {
    console.log("No hay archivos .js para minificar.");
    return;
  }

  console.log(`Procesando ${files.length} archivos con concurrencia ${CONCURRENCY}`);

  let index = 0;

  const workers = Array.from({ length: CONCURRENCY }, async () => {
    while (index < files.length) {
      const file = files[index++];
      await processFile(file);
    }
  });

  await Promise.all(workers);
  console.log("✔ Minificación completa.");
}

run();
