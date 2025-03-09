import { program } from "commander";

import { srtGlobal } from "../helpers/textDictionary.js";

export const executionerCommand = () => {

  const executioner = program.command("ex")
    .description(srtGlobal.config_commant);

  executioner
    .action((options) => {

      console.log('ajua')


    });
};
