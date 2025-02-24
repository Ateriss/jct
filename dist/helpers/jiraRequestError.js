import { srtGlobal } from "./textDictionary.js";
export const jiraRequestError = () => {
    console.log(`
        ${srtGlobal.jira_config_error}:

        ${'jct --me'}

        ${srtGlobal.change_config_message}

        ${'jct --config'}

        ${srtGlobal.help_message}

        ${'jct --help'}`);
};
