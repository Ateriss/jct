import { __awaiter } from "tslib";
import axios from "axios";
import { getEnvValue } from "../helpers/envHandler.js";
import { jiraRequestError } from "../helpers/jiraRequestError.js";
import chalk from "chalk";
import { toCapitalize } from "../helpers/toCapitalize.js";
import { srtGlobal } from "../helpers/textDictionary.js";
//TODO: AÑADIR FUNCIONALIDAD PARA PROYECTOS CLASICOS DE JIRA
const getHeaders = () => {
    let JR_MAIL = getEnvValue('JR_MAIL');
    let JR_TOKEN = getEnvValue('JR_TOKEN');
    let JR_SPACE = getEnvValue('JR_SPACE');
    if (JR_MAIL && JR_TOKEN && JR_SPACE) {
        const authString = `${JR_MAIL}:${JR_TOKEN}`;
        const encodedAuth = Buffer.from(authString).toString('base64');
        return {
            baseURL: JR_SPACE,
            headers: {
                Authorization: `Basic ${encodedAuth}`,
                'Content-Type': 'application/json',
            },
        };
    }
    return null;
};
export function getProjects() {
    return __awaiter(this, arguments, void 0, function* (startAt = 0) {
        let resp = {
            isSuccess: false,
            value: [],
            sMessage: srtGlobal.error_getting_projects
        };
        let headers = getHeaders();
        const maxResult = 10;
        if (headers) {
            const instance = axios.create(headers);
            try {
                const response = yield instance.get(`/rest/agile/1.0/board?startAt=${startAt}&maxResults=${maxResult}`);
                const projects = response.data;
                let optionsProjects = [];
                projects.values.map(prj => {
                    optionsProjects.push({
                        name: prj.location.displayName,
                        value: String(prj.id)
                    });
                });
                if (projects.startAt !== 0) {
                    optionsProjects.push({
                        name: srtGlobal.previous_projects,
                        value: String(maxResult - startAt)
                    });
                }
                if (!projects.isLast) {
                    optionsProjects.push({
                        name: srtGlobal.next_projects,
                        value: String(maxResult + startAt)
                    });
                }
                resp.isSuccess = true;
                resp.sMessage = srtGlobal.choose_main_project;
                resp.value = optionsProjects;
                return resp;
            }
            catch (error) {
                jiraRequestError();
            }
        }
        return resp;
    });
}
export function getCurrentSprint(proyectId) {
    return __awaiter(this, void 0, void 0, function* () {
        let resp = {
            isSuccess: false,
            sMessage: '',
            value: null
        };
        let headers = getHeaders();
        if (headers) {
            const instance = axios.create(headers);
            try {
                const response = yield instance.get(`/rest/agile/1.0/board/${proyectId}/sprint?state=active`);
                const sprints = response.data;
                if (sprints.values.length) {
                    resp.isSuccess = true;
                    resp.value = sprints.values[0];
                    return resp;
                }
                resp.sMessage = srtGlobal.no_active_sprints;
            }
            catch (err) {
                console.log(err);
                jiraRequestError();
            }
        }
        return resp;
    });
}
export function getIssuesBySprintID(sprintID) {
    return __awaiter(this, void 0, void 0, function* () {
        let resp = {
            isSuccess: false,
            sMessage: '',
            value: null
        };
        let headers = getHeaders();
        if (headers) {
            const instance = axios.create(headers);
            try {
                const response = yield instance.get(`rest/agile/1.0/sprint/${sprintID}/issue`);
                const issuesRequest = response.data;
                if (issuesRequest && issuesRequest.issues.length) {
                    const issues = issuesRequest.issues;
                    const issuesFormated = [];
                    issues.map((issue) => {
                        let formated = {
                            key: issue.key,
                            type: issue.fields.issuetype.name,
                            icon: getIconIssueByName(issue.fields.issuetype.name),
                            status: issue.fields.status.name,
                            name: issue.fields.summary
                        };
                        let option = {
                            name: `${formated.icon} ${formated.key} || ${toCapitalize(formated.name)} || (${toCapitalize(formated.status)})`,
                            value: formated
                        };
                        issuesFormated.push(option);
                    });
                    resp.isSuccess = true;
                    resp.value = issuesFormated;
                    return resp;
                }
                resp.sMessage = srtGlobal.no_issues_available;
                return resp;
            }
            catch (err) {
                console.log(err);
                jiraRequestError();
            }
        }
    });
}
export const getIconIssueByName = (issueName) => {
    let icon = '';
    switch (issueName.toUpperCase()) {
        case 'HISTORIA':
        case 'HISTORY':
            icon = chalk.green('🠶');
            break;
        case 'ERROR':
        case 'BUG':
            icon = chalk.red('🐞');
            break;
        case 'TAREA':
        case 'TASK':
            icon = chalk.blue('🗹');
            break;
        default:
            icon = '🌟';
    }
    return icon;
};
