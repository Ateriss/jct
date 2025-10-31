#!/usr/bin/env node
import { program } from "commander";
import { versionCommand } from "./commants/version.js";
import { configCommand } from "./commants/configJCT.js";
import { JsonIssuesCollection } from "./models/IssuesCollection.js";
// checkIssues importa `issuesCollection` desde este mismo módulo, lo que
// puede crear una dependencia circular si importamos `checkIssues` aquí.
// Hacemos una importación dinámica dentro del handler por defecto para
// romper la circularidad en tiempo de inicialización.
import { setGlobalStr } from "./helpers/textDictionary.js";
import { lagunajeCommand } from "./commants/lan.js";


export const issuesCollection = new JsonIssuesCollection('db.json')


program.name("jtc")
.version("2.0.0")
.description("JIRA Commit Tool CLI by Ateriss")

.action(async () => {
	// Ejecutar el flujo por defecto (selección de issues) sólo cuando no se haya
	// invocado un subcomando. Importamos dinámicamente para evitar ciclos de
	// importación entre `index.ts` y `promts/selectIssues.ts`.
	const mod = await import("./promts/selectIssues.js");
	if (mod && typeof mod.checkIssues === "function") {
		await mod.checkIssues();
	}
});

versionCommand();
configCommand();
lagunajeCommand();

// parseAsync es preferible cuando los handlers son async (usa Commander v7+).
// No hacemos top-level await aquí, parseAsync devolverá una promesa y el
// runtime esperará a que los prompts/acciones terminen.
program.parseAsync(process.argv);
