import chalk from "chalk";
import { ENV_KEY } from "./enum.js";
import { getEnvValue } from "./envHandler.js";
import { srtGlobal } from "./textDictionary.js";
import { handleEnvValues, setBulkConfig } from "../promts/initConfig.js";
import { getProjectByCurrentPath, handleDefaultProject } from "../promts/projectJira.js";


export const jira_keys = [ENV_KEY.JR_TOKEN, ENV_KEY.JR_MAIL, ENV_KEY.JR_SPACE];

export const showJiraCurrentConfig = () => {
  const current_project = getProjectByCurrentPath() 
        const jiraConfig = {
        user: getEnvValue(ENV_KEY.JR_MAIL) || chalk.gray(srtGlobal.no_configure),
        token: getEnvValue(ENV_KEY.JR_TOKEN) ? chalk.green(srtGlobal.save) : chalk.gray(srtGlobal.no_configure),
        url: getEnvValue(ENV_KEY.JR_SPACE) || chalk.gray(srtGlobal.no_configure),
        project: current_project?.name || chalk.gray(srtGlobal.no_configure),
       // sprint: getEnvValue(ENV_KEY.CURRENT_SPRINT) || chalk.gray(srtGlobal.no_configure),
      };

      console.log(chalk.yellow("🔸 Jira"));
      console.log(`   ${srtGlobal.user_label}:      ${jiraConfig.user}`);
      console.log(`   Token:    ${jiraConfig.token}`);
      console.log(`   URL:      ${jiraConfig.url}`);
      console.log(`   ${srtGlobal.project_label}:      ${jiraConfig.project}`);
      console.log();
}

export const showJiraComandsHelp = () => {
      console.log(chalk.bold.cyan(`📘${srtGlobal.aviable_comands}\n`));
      console.log(`${chalk.green("jct config jira")}   → ${srtGlobal.jira_input}`);
      console.log(`
        ${srtGlobal.intro_comands_help}
           ${chalk.green("jct config jira --user")}   → ${srtGlobal.user_input}
           ${chalk.green("jct config jira --token")}  → ${srtGlobal.token_input}
           ${chalk.green("jct config jira --url")}    → ${srtGlobal.url_input}
           ${chalk.green("jct config jira --project")}→ ${srtGlobal.project_input}
           ${chalk.green("jct config jira --sprint")} → ${srtGlobal.sprint_input}

        `)
}


/**
 * 
 * @param options - Opciones del comando (pasadas por commander)
 * @param fallback - Método a ejecutar si no se detectan opciones 
 */
export const handleJiraConfigOptions = async (options: Record<string, any> ) => {
  const envMap = {
    user: ENV_KEY.JR_MAIL,
    token: ENV_KEY.JR_TOKEN,
    url: ENV_KEY.JR_SPACE,
  };

  let hasOption = false;
  for (const [optionKey, envKey] of Object.entries(envMap)) {
    const value = options[optionKey];
    if (value && typeof value === 'boolean') {
      hasOption = true;
      console.log(`${srtGlobal.configuring_value}: ${optionKey}`);
      handleEnvValues({ key: envKey, value });
    }
  }

  if (!hasOption) {
    await setBulkConfig(jira_keys);
  }

  const current_project =  getProjectByCurrentPath()
  if(!current_project){
    await handleDefaultProject()
  }
};


