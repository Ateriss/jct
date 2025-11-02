import { program } from "commander";
import chalk from "chalk";
import { ENV_KEY } from "../helpers/enum.js";
import { getEnvValue } from "../helpers/envHandler.js";
import { srtGlobal } from "../helpers/textDictionary.js";
import { handleEnvValues } from "../promts/initConfig.js";

export const configCommand = () => {
  const config = program
    .command("config")
    .description("Configurar integración con Jira o Smart")
    .action(() => {
      console.clear();
      console.log(chalk.bold.cyan("⚙️  Configuración actual\n"));

      // Mostrar configuraciones actuales
      const jiraConfig = {
        user: getEnvValue(ENV_KEY.JR_MAIL) || chalk.gray(srtGlobal.no_configure),
        token: getEnvValue(ENV_KEY.JR_TOKEN) ? chalk.green(srtGlobal.save) : chalk.gray(srtGlobal.no_configure),
        url: getEnvValue(ENV_KEY.JR_SPACE) || chalk.gray(srtGlobal.no_configure),
        project: getEnvValue(ENV_KEY.DEFAULD_PROJECT_ID) || chalk.gray(srtGlobal.no_configure),
        sprint: getEnvValue(ENV_KEY.CURRENT_SPRINT) || chalk.gray(srtGlobal.no_configure),
      };

      const smartConfig = {
        email: getEnvValue(ENV_KEY.SMART_EMAIL) || chalk.gray(srtGlobal.no_configure),
        acceso: getEnvValue(ENV_KEY.SMART_ACCESS) || chalk.gray(srtGlobal.no_configure),
      //  proyecto: getEnvValue(ENV_KEY.SMART_PROJECT) || chalk.gray("No configurado"),
      };

      console.log(chalk.yellow("🔸 Jira"));
      console.log(`   ${srtGlobal.user_label}:  ${jiraConfig.user}`);
      console.log(`   Token:    ${jiraConfig.token}`);
      console.log(`   URL:      ${jiraConfig.url}`);
      console.log(`   ${srtGlobal.project_label}: ${jiraConfig.project}`);
      console.log(`   Sprint:   ${jiraConfig.sprint}\n`);

      console.log(chalk.yellow("🔹 Smart"));
      console.log(`   Email:    ${smartConfig.email}`);
      console.log(`   ${srtGlobal.access_label}:   ${smartConfig.acceso}`);
    //  console.log(`   Proyecto: ${smartConfig.proyecto}\n`);

      // Mostrar ayuda de subcomandos
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
      console.log(`${chalk.green("jct config smart")}  → ${srtGlobal.smart_input}`);
      console.log(`
        ${srtGlobal.intro_comands_help}
           ${chalk.green("jct config smart --email")}   → ${srtGlobal.smart_email_input}
           ${chalk.green("jct config smart --access")}  → ${srtGlobal.smart_access_input}
        `)
      console.log();
    });

  // ---- JIRA ----
  config
    .command("jira")
    .description(srtGlobal.jira_input)
    .option("--user <user>", srtGlobal.user_input)
    .option("--token <token>", srtGlobal.token_input)
    .option("--url <url>", srtGlobal.url_input)
    .option("--project <project>", srtGlobal.project_input)
    .option("--sprint <sprint>", srtGlobal.sprint_input)
    .action((options) => {
      if (options.user) handleEnvValues({ key: ENV_KEY.JR_MAIL, value: options.user });
      if (options.token) handleEnvValues({ key: ENV_KEY.JR_TOKEN, value: options.token });
      if (options.url) handleEnvValues({ key: ENV_KEY.JR_SPACE, value: options.url });
      if (options.project) handleEnvValues({ key: ENV_KEY.DEFAULD_PROJECT_ID, value: options.project });
      if (options.sprint) handleEnvValues({ key: ENV_KEY.CURRENT_SPRINT, value: options.sprint });

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
