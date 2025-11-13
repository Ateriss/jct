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
        project: getEnvValue(ENV_KEY.DEFAULD_PROJECT_NAME) || chalk.gray(srtGlobal.no_configure),
        sprint: getEnvValue(ENV_KEY.CURRENT_SPRINT) || chalk.gray(srtGlobal.no_configure),
      };

      const smartConfig = {
        email: getEnvValue(ENV_KEY.SMART_EMAIL) || chalk.gray(srtGlobal.no_configure),
        token: getEnvValue(ENV_KEY.SMART_TOKEN) ? chalk.green(srtGlobal.save) : chalk.gray(srtGlobal.no_configure),
        url: getEnvValue(ENV_KEY.SMART_URL) || chalk.gray(srtGlobal.no_configure),
        acceso: getEnvValue(ENV_KEY.SMART_ACCESS) || chalk.gray(srtGlobal.no_configure),
      //  proyecto: getEnvValue(ENV_KEY.SMART_PROJECT) || chalk.gray("No configurado"),
      };

      console.log(chalk.yellow("🔸 Jira"));
      console.log(`   ${srtGlobal.user_label}:      ${jiraConfig.user}`);
      console.log(`   Token:    ${jiraConfig.token}`);
      console.log(`   URL:      ${jiraConfig.url}`);
      console.log(`   ${srtGlobal.project_label}:      ${jiraConfig.project}`);
      //console.log(`   Sprint:   ${jiraConfig.sprint}\n`);

      console.log(chalk.yellow("🔹 Smart"));
      console.log(`   Email:    ${smartConfig.email}`);
      console.log(`   Token:    ${smartConfig.token}`);
      console.log(`   URL:      ${smartConfig.url}`);
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
           ${chalk.green("jct config smart --token")}   → Configurar token de Smart
           ${chalk.green("jct config smart --url")}     → Configurar URL de Smart
           ${chalk.green("jct config smart --access")}  → ${srtGlobal.smart_access_input}
        `)
      console.log();
    });

  // ---- JIRA ----
  config
    .command("jira")
    .description(srtGlobal.jira_input)
    .option("--user", '-u', srtGlobal.user_input)
    .option("--token", '-t', srtGlobal.token_input)
    .option("--url", '-ur', srtGlobal.url_input)
    .option("--project", '-p', srtGlobal.project_input)
    .option("--sprint", '-s', srtGlobal.sprint_input)
    .option("--issues", 'i', srtGlobal.issues_input)
    .action((options) => {
      if (options.user) handleEnvValues({ key: ENV_KEY.JR_MAIL, value: options.user });
      if (options.token) handleEnvValues({ key: ENV_KEY.JR_TOKEN, value: options.token });
      if (options.url) handleEnvValues({ key: ENV_KEY.JR_SPACE, value: options.url });
      if (options.project) handleEnvValues({ key: ENV_KEY.DEFAULD_PROJECT_NAME, value: options.project });
      if (options.sprint) handleEnvValues({ key: ENV_KEY.CURRENT_SPRINT, value: options.sprint });
      if (options.issues) handleEnvValues({ key: ENV_KEY.ISSUES, value: options.issues });
    });

  // ---- SMART ----
  config
    .command("smart")
    .description(`${srtGlobal.smart_input}`)
    .option("--email <email>", `${srtGlobal.smart_email_input}`)
    .option("--url <url>", `Configurar URL de Smart`)
    .option("--access <acc>", `${srtGlobal.smart_access_input}`)
    .option("--token", `Configurar token de Smart`)
    .action(async (options) => {
      // Si no se proporcionó ninguna opción, mostrar configuración actual
      if (!options.email && !options.url && !options.token && !options.access) {
        console.clear();
        console.log(chalk.bold.cyan("⚙️  Configuración Smart Tareo\n"));
        
        const smartConfig = {
          email: getEnvValue(ENV_KEY.SMART_EMAIL) || chalk.gray(srtGlobal.no_configure),
          token: getEnvValue(ENV_KEY.SMART_TOKEN) ? chalk.green(srtGlobal.save) : chalk.gray(srtGlobal.no_configure),
          url: getEnvValue(ENV_KEY.SMART_URL) || chalk.gray(srtGlobal.no_configure),
          acceso: getEnvValue(ENV_KEY.SMART_ACCESS) || chalk.gray(srtGlobal.no_configure),
        };

        console.log(chalk.yellow("🔹 Smart"));
        console.log(`   Email:    ${smartConfig.email}`);
        console.log(`   Token:    ${smartConfig.token}`);
        console.log(`   URL:      ${smartConfig.url}`);
        console.log(`   ${srtGlobal.access_label}:   ${smartConfig.acceso}\n`);

        console.log(chalk.bold.cyan(`📘 Comandos disponibles:\n`));
        console.log(`   ${chalk.green("jct config smart --email <email>")}   → ${srtGlobal.smart_email_input}`);
        console.log(`   ${chalk.green("jct config smart --token")}           → Configurar token de Smart`);
        console.log(`   ${chalk.green("jct config smart --url <url>")}       → Configurar URL de Smart`);
        console.log(`   ${chalk.green("jct config smart --access <tipo>")}   → ${srtGlobal.smart_access_input}\n`);
        
        return;
      }

      // Si se proporcionaron opciones, configurarlas
      if (options.email) await handleEnvValues({ key: ENV_KEY.SMART_EMAIL, value: options.email });
      if (options.url) await handleEnvValues({ key: ENV_KEY.SMART_URL, value: options.url });
      if (options.token) await handleEnvValues({ key: ENV_KEY.SMART_TOKEN, value: null });
      if (options.access) await handleEnvValues({ key: ENV_KEY.SMART_ACCESS, value: options.access });
    });
};
