
import { ENV_KEY } from "./enum.js";
import { getEnvValue } from "./envHandler.js";
import { EnvKey, generalResponse } from "./interfaces.js"

const envKeys: EnvKey[] = Object.values(ENV_KEY).map((key) => ({
    key: key as ENV_KEY,
    value: '',
  }));

export const checkEnv = ():generalResponse<EnvKey[]> =>{
    let res:generalResponse<EnvKey[]> = {
        isSuccess: false,
        value: null,
        sMessage: ''
    }
    let envValues:EnvKey[] = []
    envKeys.map(env => {
        const envValue = getEnvValue(env.key)
        if(!envValue){ 
            res.isSuccess = false
        }
        envValues.push(env)
    })
    res.value = envValues
return res
}