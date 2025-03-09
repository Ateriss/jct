#!/usr/bin/env node
import { program } from "commander";

import { setGlobalStr } from "./helpers/textDictionary";

import { JsonIssuesCollection } from "./models/IssuesCollection";

import { checkIssues } from "./promts/selectIssues";

import { versionCommand } from "./commants/version";
import { configCommand } from "./commants/configJCT";
import { lagunajeCommand } from "./commants/lan";
import { executionerCommand } from "./commants/executioner.command";


export const issuesCollection = new JsonIssuesCollection('db.json')


program
  .name("jtc")
  .version("1.0.0")
  .description("JIRA Commit Tool CLI by Ateriss")
  .action(() => {
  });

// program
//   .command('ex')
//   .action((options) => {
//     console.log('ajua')
//   });


// versionCommand();
configCommand();
// lagunajeCommand();
executionerCommand()

// Prevents error while testing
// checkIssues();

program.parse(process.argv);
