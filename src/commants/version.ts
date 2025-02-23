import { program } from "commander";
import { sInit_Mensaje } from "../helpers/initMessage.js";
import { getEnvValue } from "../helpers/envHandler.js";
import { ENV_KEY } from "../helpers/enum.js";
import chalk from "chalk";


export const versionCommand = () => {
    program
    .option("-M, --me", "Muestra la información de configuración de JCT")
    .action(() => {
      const user = getEnvValue(ENV_KEY.JR_MAIL);
      const url = getEnvValue(ENV_KEY.JR_SPACE);
      const token = getEnvValue(ENV_KEY.JR_TOKEN);

      let versionMessage = `${sInit_Mensaje}\n\n`;

      versionMessage += `${chalk.bold("User:")} ${user ? user : chalk.red("Usuario no configurado")}\n`;
      versionMessage += `${chalk.bold("Url:")} ${url ? url : chalk.red("Url no configurada")}\n`;
      versionMessage += `${chalk.bold("Token:")} ${token ? chalk.gray("[hidden information]") : chalk.red("Token no configurado")}\n`;

      if (!user || !url || !token) {
        versionMessage += `\n${chalk.yellow("Por favor ejecuta el siguiente comando para configurar JCT:")}\n\n${chalk.cyan("jct --config")}\n`;
      }

      console.log(versionMessage);
    });
}


