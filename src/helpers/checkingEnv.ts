
import chalk from "chalk";
import { ENV_KEY } from "./enum.js";
import { getEnvValue, setEnvKey } from "./envHandler.js";
import { EnvKey, generalResponse } from "./interfaces.js"
import { initJCT } from "../promts/initConfig.js";
import { srtGlobal } from "./textDictionary.js";

export const requiredKeys = [ENV_KEY.JR_MAIL, ENV_KEY.JR_TOKEN, ENV_KEY.JR_SPACE];



export const checkEnv = ():generalResponse<ENV_KEY[]> =>{

    let res:generalResponse<ENV_KEY[]> = {
        isSuccess: true,
        value: null,
        sMessage: ''
    }
    let envValues:ENV_KEY[] = []
    requiredKeys.forEach((key) => {
        const envValue = getEnvValue(key); 
        if (!envValue) {
            res.isSuccess = false;
        }   
        envValues.push(key as ENV_KEY);
    });
    res.value = envValues
return res
}


export const initCheck = ()=> {
    console.log(`
        ${chalk.blue(srtGlobal.config_validate)}

        `)

        let resp = checkEnv()

        if(!resp.isSuccess){
            console.log(`
                ${chalk.red(srtGlobal.must_configurate)}
                `)
                initJCT()
        }

        return resp

}

