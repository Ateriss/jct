import moment from "moment";
import { ENV_KEY } from "./enum.js";
import { getEnvValue } from "./envHandler.js";
import chalk from "chalk";
import { toCapitalize } from "./toCapitalize.js";
import { srtGlobal } from "./textDictionary.js";
export const sInit_Mensaje = () => {
    let sProject = getEnvValue(ENV_KEY.DEFAULD_PROJECT_NAME);
    let sSprint = getEnvValue(ENV_KEY.CURRENT_SPRINT);
    let dDate = getEnvValue(ENV_KEY.CURRENT_SPRNT_DATE);
    let sGoal = getEnvValue(ENV_KEY.CURRENT_SPRNT_GOAL);
    const sMessage = `
    JCT V1.0
    ░▀▀█░▀█▀░█▀▄░█▀█░░░█▀▀░█▀█░█▄█░█▄█░▀█▀░▀█▀░░░▀█▀░█▀█░█▀█░█░░
    ░░░█░░█░░█▀▄░█▀█░░░█░░░█░█░█░█░█░█░░█░░░█░░░░░█░░█░█░█░█░█░░
    ░▀▀░░▀▀▀░▀░▀░▀░▀░░░▀▀▀░▀▀▀░▀░▀░▀░▀░▀▀▀░░▀░░░░░▀░░▀▀▀░▀▀▀░▀▀▀
                                            by Ateriss
    ${sProject ? sProject : srtGlobal.project_not_defined}     ${sSprint ? sSprint : srtGlobal.sprint_not_defined}
    
    ${srtGlobal.goal}
    ${toCapitalize(sGoal ? sGoal : srtGlobal.goal_not_defined)}
    ${chalk.gray(`${srtGlobal.finalizes_on} ${dDate ? moment(dDate).format('DD/MM/YYYY') : srtGlobal.date_not_defined}`)}
    
    `;
    return sMessage;
};
