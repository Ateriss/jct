import { showAllComands, showJiraComandsHelp } from "../helpers/jiraConfig.js";
import { srtGlobal } from "../helpers/textDictionary.js";
import { base } from "../index.js";

export const helpCommand = () => {
  base.command("help")
  .alias('h')
  .description(srtGlobal.help_command)
  .action(() => {
            showAllComands(base)
      
    });
}