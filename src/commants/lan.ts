import { program } from "commander";
import { changeLan } from "../promts/changeLan.js";


export const lagunajeCommand = () => {
  let command = program.command("lan")
  .description('Change the language of the CLI')
    command
    .action(() => {
      changeLan()
    });
}


