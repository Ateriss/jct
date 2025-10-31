import { program } from "commander";
import { sInit_Mensaje } from "../helpers/initMessage.js";
import { getEnvValue } from "../helpers/envHandler.js";
import { ENV_KEY } from "../helpers/enum.js";
import chalk from "chalk";
import { handleEnvValues, initJCT } from "../promts/initConfig.js";
import { srtGlobal } from "../helpers/textDictionary.js";

export const configCommand = () => {

const config = program.command("config")
        .description(srtGlobal.config_commant);
        
  // ---- JIRA ----
  config
    .command("jira")
    .description("Configurar integración con Jira")
    .option("--user <user>", srtGlobal.user_input)
    .option("--token <token>", srtGlobal.token_input)
    .option("--url <url>", srtGlobal.url_input)
    .option("--project <project>", srtGlobal.project_input)
    .option("--sprint <sprint>", srtGlobal.sprint_input)
    .action((options) => {
      if (options.user) {
        handleEnvValues({ key: ENV_KEY.JR_MAIL, value: options.user });
      }
      if (options.token) {
        handleEnvValues({ key: ENV_KEY.JR_TOKEN, value: options.token });
      }
      if (options.url) {
        handleEnvValues({ key: ENV_KEY.JR_SPACE, value: options.url });
      }
      if (options.project) {
        handleEnvValues({ key: ENV_KEY.DEFAULD_PROJECT_ID, value: options.project });
      }
      if (options.sprint) {
        handleEnvValues({ key: ENV_KEY.CURRENT_SPRINT, value: options.sprint });
      }

      console.log("✅ Jira configurado correctamente");
    });

  // ---- SMART ----
//   config
//     .command("smart")
//     .description("Configurar integración con Smart")
//     .option("--url <url>", "URL base del sistema Smart")
//     .option("--token <token>", "Token de acceso al sistema Smart")
//     .option("--user <user>", "Usuario del sistema Smart")
//     .action((options) => {
//       if (options.url) handleEnvValues({ key: ENV_KEY.SMART_URL, value: options.url });
//       if (options.token) handleEnvValues({ key: ENV_KEY.SMART_TOKEN, value: options.token });
//       if (options.user) handleEnvValues({ key: ENV_KEY.SMART_USER, value: options.user });

//       console.log("✅ Smart configurado correctamente");
//     });

}