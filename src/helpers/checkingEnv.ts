
import chalk from "chalk";
import { ENV_KEY } from "./enum.js";
import { getEnvValue, setEnvKey } from "./envHandler.js";
import { EnvKey, generalResponse } from "./interfaces.js"
import { initJCT } from "../promts/initConfig.js";
import { srtGlobal } from "./textDictionary.js";

const envKeys: EnvKey[] = Object.values(ENV_KEY).map((key) => ({
    key: key as ENV_KEY,
    value: '',
  }));

export const checkEnv = ():generalResponse<EnvKey[]> =>{

    let res:generalResponse<EnvKey[]> = {
        isSuccess: true,
        value: null,
        sMessage: ''
    }
    let envValues:EnvKey[] = []
    envKeys.map((env:any) => {
        const envValue = getEnvValue(env.key)
        if(!envValue){ 
            res.isSuccess = false
        }
        envValues.push(env)
    })
    res.value = envValues
return res
}


export const initCheck = async ()=> {
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

}