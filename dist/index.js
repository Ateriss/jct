import { __awaiter } from "tslib";
import { sInit_Mensaje } from './helpers/initMessage.js';
import axios from 'axios';
const jira_token = '';
const jira_space = '';
const jira_email = '';
const authString = `${jira_email}:${jira_token}`;
const encodedAuth = Buffer.from(authString).toString('base64');
const instance = axios.create({
    baseURL: jira_space,
    headers: {
        Authorization: `Basic ${encodedAuth}`,
        'Content-Type': 'application/json',
    },
});
function getProjects() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield instance.get('/rest/api/2/project');
            const projects = response.data;
            console.log('Proyectos de Jira:');
            projects.forEach((project) => {
                console.log(`- ${project.name} (${project.key})`);
            });
        }
        catch (error) {
            console.error('Error al obtener proyectos:', error.message);
        }
    });
}
console.log(sInit_Mensaje);
getProjects();
