import chalk from "chalk";
import { ENV_KEY } from "./enum.js";
import { getEnvValue } from "./envHandler.js";
import { srtGlobal } from "./textDictionary.js";
import { handleEnvValues, setBulkConfig } from "../promts/initConfig.js";
import { getProjectByCurrentPath, handleDefaultProject } from "../promts/projectJira.js";
import { sInit_Mensaje } from "./initMessage.js";
import { Command } from "commander";


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
      console.log(`${chalk.green("jct config")}   → ${srtGlobal.jira_input}`);
      console.log('')
      console.log(`
        ${srtGlobal.intro_comands_help}
           ${chalk.green("jct config --user")}   → ${srtGlobal.user_input}
           ${chalk.green("jct config --token")}  → ${srtGlobal.token_input}
           ${chalk.green("jct config --url")}    → ${srtGlobal.url_input}
           ${chalk.green("jct config --project")}→ ${srtGlobal.project_input}
           ${chalk.green("jct config --sprint")} → ${srtGlobal.sprint_input}

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



export const showAllComands = (base: Command) => {
  console.clear();
  console.log(sInit_Mensaje());
  console.log("");

  console.log(chalk.bold.cyan(`📘 ${srtGlobal.aviable_comands}\n`));

  const commands = base.commands.filter(cmd => cmd.name() !== "*");

  for (const cmd of commands) {
    const name = cmd.name();
    const alias = cmd.aliases().length ? cmd.aliases().join(", ") : "—";
    const description = cmd.description() || srtGlobal.no_description;
    const options = cmd.options || [];

    console.log(chalk.bold("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));
    console.log(chalk.bold(`🔹 ${name}`));
    console.log(chalk.bold("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));

    console.log(`${chalk.green(`jct ${name}`)}  → ${description}`);
    if(alias != '—'){
    console.log(chalk.yellow(alias));
    }
    console.log("");

    if (options.length > 0) {
      console.log(chalk.bold(srtGlobal.op));
      options.forEach(opt => {
        const flags = chalk.green(opt.flags);
        const desc = chalk.white(opt.description || srtGlobal.no_description);
        console.log(`  ${flags}       ${desc}`);
      });
      console.log("");
    }

    console.log(chalk.bold(srtGlobal.ex));
    if (options.length > 0) {
      const sampleFlag = options[0].long || options[0].short || "";
      console.log(chalk.cyan(`  jct ${name} ${sampleFlag}`));
      if(options[0].flags.split(',').length > 1){
      console.log('or')
      console.log(chalk.cyan(`  jct ${alias} ${options[0].flags.split(',')[1]}`));
      }

    } else {
      console.log(chalk.cyan(`  jct ${name}`));
    if(alias != '—'){
      console.log('or')
      console.log(chalk.cyan(`  jct ${alias}`));
      }
    }

    console.log("");
  }

  console.log(chalk.bold("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));
  console.log(chalk.green(srtGlobal.more_help_details));
  console.log(chalk.bold("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));
};
