import { __awaiter } from "tslib";
import axios from "axios";
import { getEnvValue } from "../helpers/envHandler.js";
import { jiraRequestError } from "../helpers/jiraRequestError.js";
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
            value: [{ name: 'Debes configurar JCT', value: 'initConfig' }],
            sMessage: 'Hay un error al optener proyectos'
        };
        let headers = getHeaders();
        const maxResult = 10;
        if (headers) {
            const instance = axios.create(headers);
            try {
                console.log(headers);
                const response = yield instance.get(`/rest/agile/1.0/board?startAt=${startAt}&maxResults=${maxResult}`);
                const projects = response.data;
                let optionsProjects = [];
                projects.values.map(prj => {
                    optionsProjects.push({
                        name: prj.location.displayName,
                        value: prj.id
                    });
                });
                if (projects.startAt !== 0) {
                    optionsProjects.push({
                        name: 'Proyectos anteriores',
                        value: maxResult - startAt
                    });
                }
                if (!projects.isLast) {
                    optionsProjects.push({
                        name: 'Siguientes proyectos',
                        value: maxResult + startAt
                    });
                }
                resp.isSuccess = true;
                resp.sMessage = 'Elige tu proyecto principal';
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
                    console.log(sprints.values);
                    resp.isSuccess = true;
                    resp.value = sprints.values[0];
                    return resp;
                }
                resp.sMessage = 'No hay sprints activos en este momento';
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
    });
}
