import { program } from "commander";
import { sInit_Mensaje } from "../helpers/initMessage.js";
import { getEnvValue } from "../helpers/envHandler.js";
import { ENV_KEY } from "../helpers/enum.js";
import chalk from "chalk";
import { srtGlobal } from "../helpers/textDictionary.js";


export const versionCommand = () => {
  let command = program.command("me")
  .description(srtGlobal.me_command)

    command
    .action(() => {
      const user = getEnvValue(ENV_KEY.JR_MAIL);
      const url = getEnvValue(ENV_KEY.JR_SPACE);
      const token = getEnvValue(ENV_KEY.JR_TOKEN);

      let versionMessage = `${sInit_Mensaje()}\n\n`;

      versionMessage += `${chalk.bold("User:")} ${user ? user : chalk.red(srtGlobal.user_no_configure)}\n`;
      versionMessage += `${chalk.bold("Url:")} ${url ? url : chalk.red(srtGlobal.url_not_configured)}\n`;
      versionMessage += `${chalk.bold("Token:")} ${token ? chalk.gray("[hidden information]") : chalk.red(srtGlobal.token_not_configured)}\n`;

      if (!user || !url || !token) {
        versionMessage += `\n${chalk.yellow(srtGlobal.config_message)}\n\n${chalk.cyan("jct --config")}\n`;
      }

      console.log(versionMessage);
    });
}

