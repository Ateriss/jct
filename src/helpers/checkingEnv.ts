
import chalk from "chalk";
import { ENV_KEY } from "./enum.js";
import { getEnvValue, setEnvKey } from "./envHandler.js";
import { EnvKey, generalResponse } from "./interfaces.js"
import { initJCT } from "../promts/initConfig.js";
import { srtGlobal } from "./textDictionary.js";



export const checkEnv = ():generalResponse<EnvKey[]> =>{

    let res:generalResponse<EnvKey[]> = {
        isSuccess: true,
        value: null,
        sMessage: ''
    }
    let envValues:EnvKey[] = []
    const requiredKeys = [ENV_KEY.JR_MAIL, ENV_KEY.JR_TOKEN, ENV_KEY.JR_SPACE];
    requiredKeys.forEach((key) => {
        const envValue = getEnvValue(key); 
        if (!envValue) {
            res.isSuccess = false;
        }   
        envValues.push({ key: key as ENV_KEY, value: envValue || '' });
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