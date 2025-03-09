
import chalk from "chalk";

import type { EnvKey, GeneralResponse } from "./interfaces"

import { ENV_KEY } from "./enum";

import { initJCT } from "../promts/initConfig";
import { srtGlobal } from "./textDictionary";
import { getEnvValue, setEnvKey } from "./envHandler";


const envKeys: EnvKey[] = Object.values(ENV_KEY).map((key) => ({
    key: key as ENV_KEY,
    value: '',
}));

export const checkEnv = (): GeneralResponse<EnvKey[]> => {

    let res: GeneralResponse<EnvKey[]> = {
        isSuccess: true,
        value: null,
        sMessage: ''
    }
    let envValues: EnvKey[] = []
    envKeys.map(env => {
        const envValue = getEnvValue(env.key)
        if (!envValue) {
            res.isSuccess = false
        }
        envValues.push(env)
    })
    res.value = envValues
    return res
}


export const initCheck = async () => {
    console.log(`
        ${chalk.blue(srtGlobal.config_validate)}

        `)

    let resp = checkEnv()

    if (!resp.isSuccess) {
        console.log(`
                ${chalk.red(srtGlobal.must_configurate)}
                `)
        initJCT()
    }
}
