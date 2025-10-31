#!/usr/bin/env node
import { __awaiter } from "tslib";
import { program } from "commander";
import { versionCommand } from "./commants/version.js";
import { configCommand } from "./commants/configJCT.js";
import { JsonIssuesCollection } from "./models/IssuesCollection.js";
import { lagunajeCommand } from "./commants/lan.js";
export const issuesCollection = new JsonIssuesCollection('db.json');
program.name("jtc")
    .version("2.0.0")
    .description("JIRA Commit Tool CLI by Ateriss")
    .action(() => __awaiter(void 0, void 0, void 0, function* () {
    // Ejecutar el flujo por defecto (selección de issues) sólo cuando no se haya
    // invocado un subcomando. Importamos dinámicamente para evitar ciclos de
    // importación entre `index.ts` y `promts/selectIssues.ts`.
    const mod = yield import("./promts/selectIssues.js");
    if (mod && typeof mod.checkIssues === "function") {
        yield mod.checkIssues();
    }
}));
versionCommand();
configCommand();
lagunajeCommand();
// parseAsync es preferible cuando los handlers son async (usa Commander v7+).
// No hacemos top-level await aquí, parseAsync devolverá una promesa y el
// runtime esperará a que los prompts/acciones terminen.
program.parseAsync(process.argv);
