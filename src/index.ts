
import { program } from "commander";
import { versionCommand } from "./commants/version.js";
import { configCommand } from "./commants/configJCT.js";
import { JsonIssuesCollection } from "./models/IssuesCollection.js";
import { checkIssues } from "./promts/selectIssues.js";
import { setGlobalStr } from "./helpers/textDictionary.js";


export const issuesCollection = new JsonIssuesCollection('db.json')

// Información del CLI
program.name("jtc")
.version("1.0.0")
.description("JIRA Commit Tool CLI by Ateriss")
.action(()=>{
});

checkIssues();

versionCommand();
configCommand();

program.parse(process.argv);
