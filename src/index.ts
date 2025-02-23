
import { program } from "commander";
import { sInit_Mensaje } from "./helpers/initMessage.js";
import { versionCommand } from "./commants/version.js";
import { configCommand } from "./commants/configJCT.js";


// Información del CLI
program.name("jtc")
.version("1.0.0")
.description("JIRA Commit Tool CLI by Ateriss")
.action(()=>{
  console.log(sInit_Mensaje)
});



// Registrar comandos
versionCommand()
configCommand()

program.parse(process.argv);
