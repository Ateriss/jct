import { EnvKey } from '../helpers/interfaces.js';
import { program } from "commander";
import { getEnvValue } from "../helpers/envHandler.js";
import { checkEnv } from "../helpers/checkingEnv.js";
import { generalResponse } from "../helpers/interfaces.js";


// export const initJCT = () => {
//   const check:generalResponse = checkEnv()
//   if(check.isSuccess) return true
//   // program
//   // .name("jtc")
//   // .version("1.0.0")
//   // .description(sInit_Mensaje);
// }
