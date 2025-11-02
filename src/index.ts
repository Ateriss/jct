#!/usr/bin/env node
import { program } from "commander";
import { versionCommand } from "./commants/version.js";
import { configCommand } from "./commants/configJCT.js";
import { JsonIssuesCollection } from "./models/IssuesCollection.js";
import { checkIssues } from "./promts/selectIssues.js";
import { setGlobalStr } from "./helpers/textDictionary.js";
import { lagunajeCommand } from "./commants/lan.js";
import { sInit_Mensaje } from "./helpers/initMessage.js";


export const issuesCollection = new JsonIssuesCollection('db.json')


program
.name("jct")
.version("1.0.0")
.description("🧩 JIRA Commit Tool CLI by Ateriss");

setGlobalStr();
//versionCommand();
//configCommand();
lagunajeCommand();

program.parse(process.argv);

if (process.argv.length <= 2) {
  console.log(sInit_Mensaje())
  checkIssues();
}



