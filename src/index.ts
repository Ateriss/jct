#!/usr/bin/env node
import { program } from "commander";
import { versionCommand } from "./commants/version.js";
import { configCommand } from "./commants/configJCT.js";
import { validateCommand } from "./commants/validate.js";
import { JsonIssuesCollection } from "./models/IssuesCollection.js";
import { checkIssues } from "./promts/selectIssues.js";
import { setGlobalStr } from "./helpers/textDictionary.js";
import { lagunajeCommand } from "./commants/lan.js";
import { sInit_Mensaje } from "./helpers/initMessage.js";
import { unknowCommand } from "./commants/unknow.js";


export const issuesCollection = new JsonIssuesCollection('db.json')


program
.name("jct")
.version("1.0.0")
.description("🧩 JIRA Commit Tool CLI by Ateriss");

setGlobalStr();
//versionCommand();
configCommand();
validateCommand();
//lagunajeCommand();
//unknowCommand(); //TODO: NO CAPTA EL ERROR, REVISAR.


program.action(async () => {
    console.clear();
    console.log(sInit_Mensaje());
    //await checkIssues(); 
  })

program.parse(process.argv);



