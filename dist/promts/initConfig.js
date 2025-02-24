import { __awaiter } from "tslib";
import inquirer from 'inquirer';
import { checkEnv } from '../helpers/checkingEnv.js';
import { ENV_KEY } from '../helpers/enum.js';
import { getEnvValue, setEnvKey } from '../helpers/envHandler.js';
import chalk from 'chalk';
import { getCurrentSprint, getIssuesBySprintID, getProjects } from '../services/jira.service.js';
import moment from 'moment';
import { issuesCollection } from '../index.js';
import { srtGlobal } from '../helpers/textDictionary.js';
let envValues = [];
export const initJCT = () => __awaiter(void 0, void 0, void 0, function* () {
    const check = checkEnv();
    if (check.isSuccess)
        return true;
    else {
        console.log(`
        ${srtGlobal.jct_config_start}
        `);
        envValues = check.value;
        for (const env of envValues) {
            yield handleEnvValues(env);
        }
    }
});
export const handleEnvValues = (env) => __awaiter(void 0, void 0, void 0, function* () {
    switch (env.key) {
        case ENV_KEY.JR_TOKEN:
            yield handleToken(env.value);
            break;
        case ENV_KEY.JR_MAIL:
            yield handleUser(env.value);
            break;
        case ENV_KEY.JR_SPACE:
            yield handleSpace(env.value);
            break;
        case ENV_KEY.DEFAULD_PROJECT_NAME:
            yield handleDefaultProject(env.value);
            break;
        case ENV_KEY.CURRENT_SPRINT:
            yield handleCurrentSprint(env.value);
            break;
    }
});
const handleToken = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (value = null) {
    let JR_TOKEN = value;
    if (!JR_TOKEN) {
        console.log(srtGlobal.add_jira_token);
        yield setToken();
    }
    else {
        const resp = yield inquirer.prompt([
            {
                name: "jr_token",
                type: 'confirm',
                message: srtGlobal.jira_token_configured,
                default: false
            }
        ])
            .then();
        console.log(resp.jr_token);
        if (resp.jr_token) {
            yield setToken();
        }
    }
});
const setToken = () => __awaiter(void 0, void 0, void 0, function* () {
    let JR_TOKEN = '';
    console.log(`
        ${srtGlobal.get_jira_token_link}
        https://id.atlassian.com/manage-profile/security/api-tokens
        
        
        `);
    yield inquirer.prompt([
        {
            name: "jr_token",
            type: "password",
            message: srtGlobal.paste_jira_token
        }
    ])
        .then(resp => {
        if (resp.jr_token) {
            setEnvKey(ENV_KEY.JR_TOKEN, resp.jr_token);
            console.log(chalk.green.bold(srtGlobal.token_configured_success));
            console.log(chalk.yellow(srtGlobal.remember_message));
            console.log(chalk.cyan(srtGlobal.dont_share_token));
            console.log(chalk.gray(srtGlobal.security_important));
            console.log('');
            console.log('');
        }
    });
});
const handleUser = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (value = null) {
    if (!value) {
        console.log(srtGlobal.add_jira_email);
        yield setUser();
    }
    else {
        const resp = yield inquirer.prompt([
            {
                name: "jr_token",
                type: 'confirm',
                message: srtGlobal.jira_email_configured,
                default: false
            }
        ])
            .then();
        if (resp.jr_token) {
            yield setUser();
        }
    }
});
const setUser = () => __awaiter(void 0, void 0, void 0, function* () {
    yield inquirer.prompt([
        {
            name: "jr_user",
            type: 'input',
            message: srtGlobal.enter_user_email,
        }
    ])
        .then(resp => {
        if (resp.jr_user) {
            setEnvKey(ENV_KEY.JR_MAIL, resp.jr_user);
            console.log(chalk.green.bold(srtGlobal.user_configured_success));
            console.log('');
            console.log('');
        }
    });
});
const handleSpace = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (value = null) {
    if (!value) {
        yield setSpace();
    }
    else {
        let resp = yield inquirer.prompt([
            {
                name: "jr_space",
                type: 'confirm',
                message: srtGlobal.jira_space_url_configured,
                default: false
            }
        ])
            .then();
        if (resp.jr_space) {
            yield setSpace();
        }
    }
});
const setSpace = () => __awaiter(void 0, void 0, void 0, function* () {
    yield inquirer.prompt([
        {
            name: "jr_space",
            type: 'input',
            message: srtGlobal.enter_jira_space_url,
        }
    ])
        .then(resp => {
        if (resp.jr_space) {
            setEnvKey(ENV_KEY.JR_SPACE, resp.jr_space);
            console.log(chalk.green.bold(srtGlobal.url_configured_success));
            console.log('');
            console.log('');
        }
    });
});
const handleDefaultProject = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (value = null) {
    console.log(value);
    if (!value) {
        yield setProject();
    }
    else {
        let resp = yield inquirer.prompt([
            {
                name: "default_project_name",
                type: 'confirm',
                message: 'Ya tienes el proyecto Jira por defecto configurado ¿Deseas cambiarlo?',
                default: false
            }
        ])
            .then();
        if (resp.default_project_name) {
            yield setProject();
        }
    }
});
const setProject = () => __awaiter(void 0, void 0, void 0, function* () {
    let projects = [];
    try {
        let projectsRequeset = yield getProjects().then();
        if (projectsRequeset.isSuccess) {
            projects = projectsRequeset.value;
            yield inquirer.prompt([
                {
                    name: "current_project",
                    type: 'list',
                    choices: projects,
                    message: srtGlobal.select_project,
                }
            ])
                .then(resp => {
                var _a;
                if (resp.current_project) {
                    let project = resp.current_project;
                    let key = resp.current_project;
                    let name = (_a = projects.find(x => x.value == resp.current_project)) === null || _a === void 0 ? void 0 : _a.name;
                    setEnvKey(ENV_KEY.DEFAULD_PROJECT_NAME, name);
                    setEnvKey(ENV_KEY.DEFAULD_PROJECT_ID, key);
                    console.log(chalk.green.bold(srtGlobal.project_configured_success));
                    console.log('');
                    console.log('');
                }
            });
        }
        else {
            console.log(projectsRequeset.sMessage);
        }
    }
    catch (err) {
        console.log(srtGlobal.error_getting_projects);
    }
});
const handleCurrentSprint = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (value = null) {
    let CURRENT_SPRINT = getEnvValue(ENV_KEY.CURRENT_SPRINT);
    let CURRENT_SPRINT_ID = getEnvValue(ENV_KEY.CURRENT_SPRINT_ID);
    let CURRENT_SPRINT_DATE = getEnvValue(ENV_KEY.CURRENT_SPRNT_DATE);
    if (CURRENT_SPRINT_DATE) {
        let endDate = moment(CURRENT_SPRINT_DATE);
        let today = moment();
        let validateDate = endDate.isBefore(today);
        let resp;
        if (validateDate) {
            resp = yield inquirer.prompt([
                {
                    name: "end_sprint",
                    type: 'confirm',
                    default: true,
                    message: srtGlobal.sprint_ended_update.replace("CURRENT_SPRINT", CURRENT_SPRINT).replace("END_DATE", endDate.format('DD/MM/YYYY')),
                }
            ]).then();
            if (resp.end_sprint)
                yield setCurrentSprint();
        }
        else {
            resp = yield inquirer.prompt([
                {
                    name: "end_sprint",
                    type: 'confirm',
                    default: true,
                    message: srtGlobal.sprint_end_date_update.replace("CURRENT_SPRINT", CURRENT_SPRINT).replace("END_DATE", endDate.format('DD/MM/YYYY')),
                }
            ]).then();
            if (resp.end_sprint)
                yield setCurrentSprint();
        }
    }
    else
        yield setCurrentSprint();
});
const setCurrentSprint = () => __awaiter(void 0, void 0, void 0, function* () {
    let current_sprint;
    let project_id = Number(getEnvValue(ENV_KEY.DEFAULD_PROJECT_ID));
    if (project_id) {
        try {
            let current_sprintRequest = yield getCurrentSprint(project_id).then();
            current_sprint = current_sprintRequest.value;
            if (current_sprintRequest.isSuccess && current_sprint) {
                setEnvKey(ENV_KEY.CURRENT_SPRINT, current_sprint.name);
                setEnvKey(ENV_KEY.CURRENT_SPRINT_ID, String(current_sprint.id));
                setEnvKey(ENV_KEY.CURRENT_SPRNT_DATE, String(current_sprint.endDate));
                setEnvKey(ENV_KEY.CURRENT_SPRNT_GOAL, String(current_sprint.goal));
                console.log(chalk.green.bold(srtGlobal.sprint_configured_success));
                console.log('');
                console.log('');
                yield handleIssues();
            }
            else {
                console.log(current_sprintRequest.sMessage);
            }
        }
        catch (err) {
        }
    }
    else {
        console.log(srtGlobal.must_configurate);
        yield initJCT();
    }
});
export const handleIssues = () => __awaiter(void 0, void 0, void 0, function* () {
    let CURRENT_SPRINT = getEnvValue(ENV_KEY.CURRENT_SPRINT);
    let CURRENT_SPRINT_ID = getEnvValue(ENV_KEY.CURRENT_SPRINT_ID);
    if (CURRENT_SPRINT) {
        let resp = yield getIssuesBySprintID(Number(CURRENT_SPRINT_ID)).then();
        if (resp === null || resp === void 0 ? void 0 : resp.isSuccess) {
            issuesCollection.removeAllIssues();
            issuesCollection.BulkAddIssues(resp.value);
            console.log(chalk.green.bold(`¡Incidencias optenidas con éxito!`));
            console.log('');
            console.log('');
        }
    }
});
