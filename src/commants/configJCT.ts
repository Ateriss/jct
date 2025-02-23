import { program } from "commander";
import { sInit_Mensaje } from "../helpers/initMessage.js";
import { getEnvValue } from "../helpers/envHandler.js";
import { ENV_KEY } from "../helpers/enum.js";
import chalk from "chalk";
import { handleEnvValues, initJCT } from "../promts/initConfig.js";

export const configCommand = () => {
    console.log('entra al comando');

    const config = program.command("config")
        .description("Configura JCT");
        
    config
        .option("--user", "Configura el usuario de Jira")
        .option("--token", "Configura el token de Jira")
        .option("--url", "Configura la URL de Jira")
        .option("--project", "Configura el proyecto Jira por defecto")
        .option("--sprint", "Configura el ID del sprint actual")
        .action((options) => {
            console.log('ejecucion 1');
            if (options.user) {
                handleEnvValues({ key: ENV_KEY.JR_MAIL, value: getEnvValue(ENV_KEY.JR_MAIL) });
            } else if (options.token) {
                handleEnvValues({ key: ENV_KEY.JR_TOKEN, value: getEnvValue(ENV_KEY.JR_TOKEN) });
            } else if (options.url) {
                handleEnvValues({ key: ENV_KEY.JR_SPACE, value: getEnvValue(ENV_KEY.JR_SPACE) });
            } else if (options.project) {
                handleEnvValues({ key: ENV_KEY.DEFAULD_PROJECT_ID, value: getEnvValue(ENV_KEY.DEFAULD_PROJECT_ID) });
            } else if (options.sprint) {
                handleEnvValues({ key: ENV_KEY.CURRENT_SPRINT, value: getEnvValue(ENV_KEY.CURRENT_SPRINT) });
            } else {
                initJCT();
            }
        });
};
