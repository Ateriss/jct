import chalk from "chalk";
import { ENV_KEY } from "../helpers/enum.js";
import { getEnvValue } from "../helpers/envHandler.js";
import { srtGlobal } from "../helpers/textDictionary.js";
import { handleEnvValues, initJCT } from "../promts/initConfig.js";
import { base } from "../index.js";
import { handleJiraConfigOptions, showJiraComandsHelp, showJiraCurrentConfig } from "../helpers/jiraConfig.js";



export const configCommand = () => {
  base
    .command("config")
    .alias("c")
    .description(srtGlobal.config_command)
    .option("--user,-u", srtGlobal.user_input)
    .option("--token,-t", srtGlobal.token_input)
    .option("--url,-r", srtGlobal.url_input)
    .option("--project,-p", srtGlobal.project_input)
    .option("--sprint,-s", srtGlobal.sprint_input)
    .option("--issues,-i", srtGlobal.issues_input)
    .action((options) => {
      console.clear();
      console.log(chalk.bold.cyan(srtGlobal.config_title));

      showJiraCurrentConfig()
      showJiraComandsHelp()
      handleJiraConfigOptions(options);

      });

};
