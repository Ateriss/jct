import { srtGlobal } from "../helpers/textDictionary.js";
import { base } from "../index.js";

export const unknowCommand = () => {
  base.on("command:*", (operands) => {
    console.error(`❌ ${srtGlobal.unknow_command}`);
    console.log(`${srtGlobal.unknow_command_help}`);

    if (operands && operands.length) {
      console.log(`Received invalid command: ${operands.join(" ")}`);
    }

    process.exit(1);
  });
};
