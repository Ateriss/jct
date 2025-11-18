
import moment from "moment";
import { ENV_KEY } from "./enum.js";
import { getEnvValue } from "./envHandler.js";
import chalk from "chalk";
import { toCapitalize } from "./toCapitalize.js";
import { srtGlobal } from "./textDictionary.js";
import { getProjectByCurrentPath } from "../promts/projectJira.js";


export const sInit_Mensaje = ():string => {
    const current_project = getProjectByCurrentPath()

    let sProject = current_project?.name 
    let sSprint = current_project?.board![0].name
    let dDate = current_project?.board![0].endDate
    let sGoal = current_project?.board![0].goal
    
    const sMessage = `
    JCT V2.0
    ░▀▀█░▀█▀░█▀▄░█▀█░░░█▀▀░█▀█░█▄█░█▄█░▀█▀░▀█▀░░░▀█▀░█▀█░█▀█░█░░
    ░░░█░░█░░█▀▄░█▀█░░░█░░░█░█░█░█░█░█░░█░░░█░░░░░█░░█░█░█░█░█░░
    ░▀▀░░▀▀▀░▀░▀░▀░▀░░░▀▀▀░▀▀▀░▀░▀░▀░▀░▀▀▀░░▀░░░░░▀░░▀▀▀░▀▀▀░▀▀▀
                                            by Ateriss
    ${sProject ? sProject : srtGlobal.project_not_defined}     ${sSprint ? sSprint : srtGlobal.sprint_not_defined}
    
    ${srtGlobal.goal}
    ${toCapitalize(sGoal ? sGoal : srtGlobal.goal_not_defined)}
    ${chalk.gray(`${srtGlobal.finalizes_on} ${dDate ? moment(dDate).format('DD/MM/YYYY'): srtGlobal.date_not_defined}`)}
    
    `;
    
    return sMessage
}





