import axios from "axios";
import { getEnvValue } from "../helpers/envHandler.js";
import { FormattedIssue, generalResponse, GetProjectsResponse, Issue, issueName, JiraProject, OptionsPromt, Sprint } from "../helpers/interfaces.js";
import { jiraRequestError } from "../helpers/jiraRequestError.js";
import chalk from "chalk";



const getHeaders = () =>{
    let JR_MAIL = getEnvValue('JR_MAIL')
    let JR_TOKEN = getEnvValue('JR_TOKEN')
    let JR_SPACE = getEnvValue('JR_SPACE')

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

export async function getProjects(startAt:number = 0):Promise<generalResponse<OptionsPromt<string>[]>> {

    let resp:generalResponse<OptionsPromt<string>[]> = {
        isSuccess:false,
        value: [{name:'Debes configurar JCT', value: 'initConfig'}],
        sMessage: 'Hay un error al optener proyectos'
    }
    let headers = getHeaders()
    const maxResult:number = 10

    if(headers){
        const instance = axios.create(headers);
        try {
            console.log(headers)
          const response = await instance.get(`/rest/agile/1.0/board?startAt=${startAt}&maxResults=${maxResult}`);
          const projects:GetProjectsResponse = response.data;
          let optionsProjects:OptionsPromt<number>[] = []
            projects.values.map(prj => {
                optionsProjects.push({
                    name: prj.location.displayName,
                    value: prj.id
                })
            })

            if(projects.startAt !== 0){
                optionsProjects.push ({
                    name: 'Proyectos anteriores',
                    value: maxResult - startAt
                })
            }
            if(!projects.isLast){
                optionsProjects.push ({
                    name: 'Siguientes proyectos',
                    value: maxResult + startAt
                })
            }
            resp.isSuccess = true
            resp.sMessage = 'Elige tu proyecto principal'
            resp.value = optionsProjects
            return resp

        } catch (error:any) {
            jiraRequestError()
                }
    }

    return resp

  }

export async function getCurrentSprint(proyectId:number):Promise<generalResponse<Sprint | null>> {
    let resp:generalResponse<Sprint | null> = {
        isSuccess: false,
        sMessage: '',
        value: null
    }
    let headers = getHeaders()
    if(headers){
        const instance = axios.create(headers);
        try{
            const response = await instance.get(`/rest/agile/1.0/board/${proyectId}/sprint?state=active`);
            const sprints = response.data
            if(sprints.values.length){
                resp.isSuccess = true
                resp.value = sprints.values[0]
                return resp
            }
            resp.sMessage = 'No hay sprints activos en este momento'

        }catch(err){
            console.log(err)
            jiraRequestError()
        }
    }
    return resp
}

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
                        name: `${formated.icon} - ${formated.name.toUpperCase()} - (${formated.status.toUpperCase()})`,
                        value: formated
                    }
                    issuesFormated.push(option)
                })
                resp.isSuccess = true
                resp.value = issuesFormated
                return resp
            }
            resp.sMessage = 'No hay incidencias disponibles'
            return resp
        }catch(err){
            console.log(err)
            jiraRequestError()
        }
    }
}



export const  getIconIssueByName = (issueName:issueName):string => {
    let icon:string = ''
    switch(issueName){
        case 'HISTORIA':
            icon =  chalk.green('🠶')
            break
        case 'ERROR':
            icon = chalk.red('🐞')
            break
        case 'TAREA':
            icon = chalk.blue('🗹')
            break
        default:
            icon = '🌟'
    }
    return icon
}