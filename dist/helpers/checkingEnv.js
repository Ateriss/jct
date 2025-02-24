import { __awaiter } from "tslib";
import chalk from "chalk";
import { ENV_KEY } from "./enum.js";
import { getEnvValue } from "./envHandler.js";
import { initJCT } from "../promts/initConfig.js";
import { srtGlobal } from "./textDictionary.js";
const envKeys = Object.values(ENV_KEY).map((key) => ({
    key: key,
    value: '',
}));
export const checkEnv = () => {
    let res = {
        isSuccess: true,
        value: null,
        sMessage: ''
    };
    let envValues = [];
    envKeys.map(env => {
        const envValue = getEnvValue(env.key);
        if (!envValue) {
            res.isSuccess = false;
        }
        envValues.push(env);
    });
    res.value = envValues;
    return res;
};
export const initCheck = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`
        ${chalk.blue(srtGlobal.config_validate)}

        `);
    let resp = checkEnv();
    if (!resp.isSuccess) {
        console.log(`
                ${chalk.red(srtGlobal.must_configurate)}
                `);
        initJCT();
    }
});
