import chalk from "chalk";
import { ENV_KEY } from "../helpers/enum.js";
import { getEnvValue } from "../helpers/envHandler.js";
import { srtGlobal } from "../helpers/textDictionary.js";
import { handleEnvValues, initJCT } from "../promts/initConfig.js";
import { base } from "../index.js";
import { handleJiraConfigOptions, showJiraComandsHelp, showJiraCurrentConfig } from "../helpers/jiraConfig.js";



export const configCommand = () => {
  const config = base
    .command("config")
    .alias("c")
    .description(srtGlobal.config_command)
    .action(() => {
      console.clear();
      console.log(chalk.bold.cyan(srtGlobal.config_title));

      showJiraCurrentConfig()
      showJiraComandsHelp()
      // Mostrar configuraciones actuales


    //   const smartConfig = {
    //     email: getEnvValue(ENV_KEY.SMART_EMAIL) || chalk.gray(srtGlobal.no_configure),
    //     acceso: getEnvValue(ENV_KEY.SMART_ACCESS) || chalk.gray(srtGlobal.no_configure),
    //   //  proyecto: getEnvValue(ENV_KEY.SMART_PROJECT) || chalk.gray("No configurado"),
    //   };


      //console.log(`   Sprint:   ${jiraConfig.sprint}\n`);
    //   console.log('')
    //   console.log(chalk.yellow("🔹 Smart"));
    //   console.log(`   Email:    ${smartConfig.email}`);
    //   console.log(`   ${srtGlobal.access_label}:   ${smartConfig.acceso}`);
    //  console.log(`   Proyecto: ${smartConfig.proyecto}\n`);

      // Mostrar ayuda de subcomandos

    //   console.log(`${chalk.green("jct config smart")}  → ${srtGlobal.smart_input}`);
    //   console.log(`
    //     ${srtGlobal.intro_comands_help}
    //        ${chalk.green("jct config smart --email")}   → ${srtGlobal.smart_email_input}
    //        ${chalk.green("jct config smart --access")}  → ${srtGlobal.smart_access_input}
    //     `)
    //   console.log();
    });

  // ---- JIRA ----
  config
    .command("jira")
    .alias("j")
    .description(srtGlobal.jira_input)
    .option("--user, -u", srtGlobal.user_input)
    .option("--token", '-t', srtGlobal.token_input)
    .option("--url", '-ur', srtGlobal.url_input)
    .option("--project, -p", srtGlobal.project_input)
    .option("--sprint", '-s', srtGlobal.sprint_input)
    .option("--issues", 'i', srtGlobal.issues_input)
    .action( async (options) => {
   
        handleJiraConfigOptions(options);
    });

  // ---- SMART ----
  config
    .command("smart")
    .description(`${srtGlobal.smart_input}`)
    .option("--email <email>", `${srtGlobal.smart_email_input}`)
    .option("--access <acc>", `${srtGlobal.smart_access_input}`)
   // .option("--proyecto <pry>", "Proyecto de Smart")
    .action((options) => {
      if (options.email) handleEnvValues({ key: ENV_KEY.SMART_EMAIL, value: options.email });
      if (options.acceso) handleEnvValues({ key: ENV_KEY.SMART_ACCESS, value: options.acceso });
    //  if (options.proyecto) handleEnvValues({ key: ENV_KEY.SMART_PROJECT, value: options.proyecto });

    });
};

export const initJiraConfig = async () => {
    

}