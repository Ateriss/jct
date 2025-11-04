import { program } from "commander";
import chalk from "chalk";
import { validateSmartConnection } from "../services/smart.service.js";

export const validateCommand = () => {
  program
    .command("validate")
    .description("Validar conexión con Smart")
    .action(async () => {
      console.clear();
      console.log(chalk.bold.cyan(" Validación de Token - Smart\n"));
      
      const isValid = await validateSmartConnection();
      
      if (isValid) {
        console.log(chalk.green("La conexión con Smart es válida"));
        console.log(chalk.gray("   Puedes usar JCT para registrar tareas\n"));
      } else {
        console.log(chalk.red("No se pudo validar la conexión"));
        console.log(chalk.yellow("   Verifica tu configuración con: jct config\n"));
      }
    });
};
