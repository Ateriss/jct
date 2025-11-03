import axios from "axios";
import { getEnvValue } from "../helpers/envHandler.js";
import { FormattedIssue, generalResponse, GetProjectsResponse, Issue, issueName, JiraProject, OptionsPromt, Sprint } from "../helpers/interfaces.js";
import { jiraRequestError } from "../helpers/jiraRequestError.js";
import chalk from "chalk";
import { toCapitalize } from "../helpers/toCapitalize.js";
import { srtGlobal } from "../helpers/textDictionary.js";
import { ENV_KEY } from "../helpers/enum.js";

//TODO: AÑADIR FUNCIONALIDAD PARA PROYECTOS CLASICOS DE JIRA


const getHeaders = () =>{
    let JR_MAIL = getEnvValue(ENV_KEY.JR_MAIL)
    let JR_TOKEN = getEnvValue(ENV_KEY.JR_TOKEN)
    let JR_SPACE = getEnvValue(ENV_KEY.JR_SPACE)

    if(JR_MAIL && JR_TOKEN && JR_SPACE){
        const authString = `${JR_MAIL}:${JR_TOKEN}`;
        const encodedAuth = Buffer.from(authString).toString('base64');
        return {
            baseURL: JR_SPACE,
            headers: {
            Authorization: `Basic ${encodedAuth}`,
            'Content-Type': 'application/json',
            },
        }
    }
    return null
}

export async function getProjects(startAt:number = 0):Promise<generalResponse<{options: OptionsPromt<string>[], prjs:JiraProject[], total:number}>> {

    let resp: generalResponse<{ options: OptionsPromt<string>[]; prjs: JiraProject[], total:number }> = {
    isSuccess: false,
    value: { options: [], prjs: [], total: 0 },
    sMessage: srtGlobal.error_getting_projects,
    };
    let headers = getHeaders()
    const maxResult:number = 3

    if(headers){
        const instance = axios.create(headers);
        try {
          const response = await instance.get(`/rest/api/3/project/search?startAt=${startAt}&maxResults=${maxResult}&orderBy=lastIssueUpdatedTime`);
          const projects:GetProjectsResponse = response.data;
          let optionsProjects:OptionsPromt<string>[] = []
          let prjs:JiraProject[] = []
            projects.values.map(prj => {
                optionsProjects.push({
                    name: `${prj.name} (${prj.key})`,
                    value: String(prj.id)
                })
                prjs.push({
                    ...prj,
                    space: headers.baseURL,
                    nameFormatted: `${prj.name} (${prj.key})`
                })
            })

            if(projects.startAt !== 0){
                optionsProjects.push ({
                    name: chalk.cyan(srtGlobal.previous_projects),
                    value: `page_${Math.max(0, startAt - maxResult)}`
                })
            }
            if(!projects.isLast){
                optionsProjects.push ({
                    name: chalk.cyan(srtGlobal.next_projects),
                    value: `page_${startAt + maxResult}`
                })
            }
            resp.isSuccess = true
            resp.sMessage = srtGlobal.choose_main_project;
            resp.value = {options: optionsProjects, prjs, total: projects.total}
            return resp;

        } catch (error:any) {
            jiraRequestError()
            return resp;
        }
    }else{
        jiraRequestError()

    }

    return resp;
  }



export async function getCurrentSprint(proyectId:number, onlyActive:boolean = false):Promise<generalResponse<Sprint | null>> {
    let resp:generalResponse<Sprint | null> = {
        isSuccess: false,
        sMessage: '',
        value: null
    }
    let headers = getHeaders()
    if(headers){
        const instance = axios.create(headers);
        try{
            const response = await instance.get(`/rest/agile/1.0/board/${proyectId}/sprint?$state=${onlyActive ? 'active' : 'future'}`);
            const sprints = response.data
            if(sprints.values.length){
                resp.isSuccess = true
                resp.value = sprints.values[0]
                return resp
            }
            resp.sMessage = srtGlobal.no_active_sprints

        }catch(err){
            console.log(err)
            jiraRequestError()
        }
    }
    return resp
}

export async function completeJiraAgilePrj(proyect: JiraProject) {
    if(proyect.projectTypeKey && proyect.projectTypeKey.toUpperCase() === 'SOFTWARE'){
    let resp:generalResponse<Sprint | null> = {
        isSuccess: false,
        sMessage: '',   
        value: null
    }
    let newPrj = {...proyect}
    let headers = getHeaders()  
    if(headers){
        const instance = axios.create(headers);
        try{
            console.log(chalk.blue.bold(srtGlobal.check_scrum_managed.replace("PROJECT_NAME", proyect.name)));
            const response = await instance.get(`/rest/agile/1.0/board?projectKeyOrId=${proyect.key}`);
            if(response.data.values){
            newPrj.board_id = response.data.values[0].id
            newPrj.isScrumManaged = true
            await instance.get(`/rest/agile/1.0/board/${newPrj.board_id}/sprint`).catch(err => {
            newPrj.isScrumManaged = false
            });
            console.log(chalk.green.bold(srtGlobal.project_type_check.replace("METHOD_NAME", newPrj.isScrumManaged ? 'Scrum' : 'Kanvan')));
            return newPrj
            }else{
                console.log(chalk.yellow.bold(srtGlobal.project_type_check.replace("METHOD_NAME", srtGlobal.clasic)));
                return proyect
            }

        }catch(err){
            console.log(err)
            jiraRequestError()
        }        
    }
    else {
        jiraRequestError()
    }

}else{
    console.log(chalk.yellow.bold(srtGlobal.project_type_check.replace("METHOD_NAME", srtGlobal.clasic)));
    return proyect
}}

export async function getIssuesBySprintID(sprintID: number) {
    let resp:generalResponse<any | null> = {
        isSuccess: false,
        sMessage: '',
        value: null
    }
    let headers = getHeaders()
    if(headers){
        const instance = axios.create(headers);
        try{
            const response = await instance.get(`rest/agile/1.0/sprint/${sprintID}/issue`);
            const issuesRequest = response.data
            if(issuesRequest && issuesRequest.issues.length){
                const issues = issuesRequest.issues
                const issuesFormated:OptionsPromt<FormattedIssue>[] = []
                 issues.map((issue:Issue) =>{
                    let formated:FormattedIssue = {
                        key: issue.key,
                        type: issue.fields.issuetype.name,
                        icon: getIconIssueByName(issue.fields.issuetype.name),
                        status: issue.fields.status.name,
                        name: issue.fields.summary
                    }
                    let option:OptionsPromt<FormattedIssue> = {
                        name: `${formated.icon} ${formated.key} || ${toCapitalize(formated.name)} || (${toCapitalize(formated.status)})`,
                        value: formated
                    }
                    issuesFormated.push(option)
                })
                resp.isSuccess = true
                resp.value = issuesFormated
                return resp
            }
            resp.sMessage = srtGlobal.no_issues_available;
            return resp
        }catch(err){
            console.log(err)
            jiraRequestError()
        }
    }
}



export const  getIconIssueByName = (issueName:issueName):string => {
    let icon:string = ''
    switch(issueName.toUpperCase()){
        case 'HISTORIA':
        case 'HISTORY':
            icon =  chalk.green('🠶')
            break
        case 'ERROR':
        case 'BUG':
            icon = chalk.red('🐞')
            break
        case 'TAREA':
        case 'TASK':
            icon = chalk.blue('🗹')
            break
        default:
            icon = '🌟'
    }
    return icon
};