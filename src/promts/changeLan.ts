import inquirer from "inquirer";
import { setEnvKey } from "../helpers/envHandler.js";
import { ENV_KEY } from "../helpers/enum.js";
import { setGlobalStr } from "../helpers/textDictionary.js";

const lanChoices = [
  { name: "English", value: "EN" },
  { name: "Español", value: "ES" },
];

export async function changeLan() {
  console.log("🌐 Language Configuration\n");

  // Nuevo estilo: uso directo de `inquirer.confirm`
  const { confirmChange } = await inquirer.prompt({
    name: "confirmChange",
    type: "confirm",
    message: "Do you want to change the language?",
    default: false,
  });

  if (!confirmChange) {
    console.log("❌ You selected not to change the language.");
    return;
  }

  const { selectedLan } = await inquirer.prompt({
    name: "selectedLan",
    type: "select",
    message: "Select a language",
    choices: lanChoices.map(({ name, value }) => ({
      name,
      value,
    })),
  });

  setEnvKey(ENV_KEY.LAN, selectedLan);
  setGlobalStr();
  const chosen = lanChoices.find(l => l.value === selectedLan);
  console.log(`✅ Language successfully changed to: ${chosen?.name} ${chosen?.value}\n`);
}
