import { changeLan } from "../promts/changeLan.js";
import { base } from "../index.js";


export const lagunajeCommand = () => {
  let command = base.command("lan")
  .description('Change the language of the CLI')
    command
    .action(() => {
      changeLan()
    });
}


