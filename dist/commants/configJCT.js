import { program } from "commander";
import { getEnvValue } from "../helpers/envHandler.js";
import { ENV_KEY } from "../helpers/enum.js";
import { handleEnvValues, initJCT } from "../promts/initConfig.js";
import { srtGlobal } from "../helpers/textDictionary.js";
export const configCommand = () => {
    const config = program.command("config")
        .description(srtGlobal.config_commant);
    config
        .option("--user", srtGlobal.user_input)
        .option("--token", srtGlobal.token_input)
        .option("--url", srtGlobal.url_input)
        .option("--project", srtGlobal.project_input)
        .option("--sprint", srtGlobal.sprint_input)
        .action((options) => {
        if (options.user) {
            handleEnvValues({ key: ENV_KEY.JR_MAIL, value: getEnvValue(ENV_KEY.JR_MAIL) });
        }
        else if (options.token) {
            handleEnvValues({ key: ENV_KEY.JR_TOKEN, value: getEnvValue(ENV_KEY.JR_TOKEN) });
        }
        else if (options.url) {
            handleEnvValues({ key: ENV_KEY.JR_SPACE, value: getEnvValue(ENV_KEY.JR_SPACE) });
        }
        else if (options.project) {
            handleEnvValues({ key: ENV_KEY.DEFAULD_PROJECT_ID, value: getEnvValue(ENV_KEY.DEFAULD_PROJECT_ID) });
        }
        else if (options.sprint) {
            handleEnvValues({ key: ENV_KEY.CURRENT_SPRINT, value: getEnvValue(ENV_KEY.CURRENT_SPRINT) });
        }
        else {
            initJCT();
        }
    });
};
