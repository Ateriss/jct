import inquirer from "inquirer";
import { setEnvKey } from "../helpers/envHandler.js";
import { ENV_KEY } from "../helpers/enum.js";
import { setGlobalStr } from "../helpers/textDictionary.js";
import { promptConfirm, promptList } from "./shared/promtBase.js";

const lanChoices = [
  { name: "English", value: "EN" },
  { name: "Español", value: "ES" },
];

export async function changeLan() {
  console.log("🌐 Language Configuration\n");

  const  confirmChange  = await promptConfirm("Do you want to change the language?", false).then()

  if (!confirmChange) {
    console.log("❌ You selected not to change the language.");
    return;
  }

  const  selectedLan  = await promptList(
    'selectedLan',
    "Select a language",
    lanChoices.map(({ name, value }) => ({
      name,
      value,
    })),
    'EN'
  )
  setEnvKey(ENV_KEY.LAN, selectedLan as string);
  setGlobalStr();
  const chosen = lanChoices.find(l => l.value === selectedLan);
  console.log(`✅ Language successfully changed to: ${chosen?.name} ${chosen?.value}\n`);
}
