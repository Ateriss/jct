
import inquirer from 'inquirer'
import axios from 'axios'
import { EnvKey, generalResponse, OptionsPromt, Sprint } from '../helpers/interfaces.js'
import { checkEnv } from '../helpers/checkingEnv.js'
import { ENV_KEY } from '../helpers/enum.js'
import { getEnvValue, setEnvKey } from '../helpers/envHandler.js'
import chalk from 'chalk'
import { getCurrentSprint, getIssuesBySprintID, getProjects } from '../services/jira.service.js';
import moment from 'moment'
import { JsonIssuesCollection } from '../models/IssuesCollection.js'
import { issuesCollection } from '../index.js'


let envValues: EnvKey[] = []

export const initJCT = async () => {
    const check: generalResponse<EnvKey[]> = checkEnv()
    if (check.isSuccess) return true
    else {
        console.log(`
        
      ...Iniciando configuración de JCT
      
      `)
        envValues = check.value as EnvKey[]
        for (const env of envValues) {
            await handleEnvValues(env) 
        }
    }
}

export const handleEnvValues = async (env: EnvKey) => {
    switch (env.key) {
      case ENV_KEY.JR_TOKEN:
        await handleToken(env.value)
        break
      case ENV_KEY.JR_MAIL:
        await handleUser(env.value)
        break
      case ENV_KEY.JR_SPACE:
        await handleSpace(env.value)
        break
      case ENV_KEY.DEFAULD_PROJECT_NAME:
        await handleDefaultProject(env.value)
        break
      case ENV_KEY.CURRENT_SPRINT:
        await handleCurrentSprint(env.value)
        break
    }
  }

const handleToken = async (value:string | null = null)=>{
    let JR_TOKEN = value

    if(!JR_TOKEN){
        console.log(`Agrega el token para que puedas acceder a tu Jira`)
        await setToken()
    }else{
        const resp = await inquirer.prompt([
            {
              name: "jr_token",
              type: 'confirm',  
              message: 'Ya tienes un token de Jira configurado ¿Deseas configurar otro?', 
              default: false 
            }
          ])
          .then();
          console.log(resp.jr_token)
          if(resp.jr_token){
           await setToken()
          }
    }
 
}

const setToken = async () => {
    let JR_TOKEN = ''
    console.log(`
        Haz click en este link para obtener tu token de Jira
        https://id.atlassian.com/manage-profile/security/api-tokens
        
        
        `)
    await inquirer.prompt([
        {
          name: "jr_token",
          type: "password",  
          message: 'Por favor pega el token de jira aquí:'  
        }
      ])
      .then(resp => {
        if(resp.jr_token){
          setEnvKey(ENV_KEY.JR_TOKEN,resp.jr_token)
          console.log(chalk.green.bold('¡Token configurado con éxito!'));
          console.log(chalk.yellow('Recuerda:'));
          console.log(chalk.cyan('No compartas tu token con nadie.'));
          console.log(chalk.gray('Tu seguridad es importante.'));
          console.log('');
          console.log('');
        }
      });
}

const handleUser = async (value:string | null = null) => {
        
    if(!value){
        console.log(`Agrega el email de tu usuario para que puedas acceder a tu Jira`)
        await setUser()
    }else{
        const resp = await inquirer.prompt([
            {
              name: "jr_token",
              type: 'confirm',  
              message: 'Ya tienes un email de usuario de Jira configurado ¿Deseas cambiarlo?', 
              default: false 
            }
          ])
          .then();
          if(resp.jr_token){
           await setUser()
        }
    }
}

const setUser = async()=>{
    await inquirer.prompt([
        {
          name: "jr_user",
          type: 'input',  
          message: 'Ingresa tu email de usuario', 
        }
      ])
      .then(resp => {
        if(resp.jr_user){
            setEnvKey(ENV_KEY.JR_MAIL,resp.jr_user)
            console.log(chalk.green.bold('¡Usuario configurado con éxito!'));
            console.log('');
            console.log('');
        }
      });
}

const handleSpace = async (value: string | null = null) => {
    if (!value) {
      await setSpace()
    } else {
      let resp =  await inquirer.prompt([
        {
          name: "jr_space",
          type: 'confirm',
          message: 'Ya tienes la URL de tu espacio de Jira configurada ¿Deseas cambiarla?',
          default: false
        }
      ])
        .then();

        if (resp.jr_space) {
           await setSpace()
          }
    }
  }
  
  const setSpace = async() => {
    await inquirer.prompt([
      {
        name: "jr_space",
        type: 'input',
        message: 'Ingresa la URL de tu espacio de Jira',
      }
    ])
      .then(resp => {
        if (resp.jr_space) {
          setEnvKey(ENV_KEY.JR_SPACE, resp.jr_space)
          console.log(chalk.green.bold('¡URL configurado con éxito!'));
          console.log('');
          console.log('');
        }
      });
  }
  
 const handleDefaultProject = async (value: string | null = null) => {
    console.log(value)
    if (!value) {
      await setProject()
    } else {
     let resp =  await inquirer.prompt([
        {
          name: "default_project_name",
          type: 'confirm',
          message: 'Ya tienes el proyecto Jira por defecto configurado ¿Deseas cambiarlo?',
          default: false
        }
      ])
        .then();
        if (resp.default_project_name) {
           await  setProject()
          }
    }
  }
  
  const setProject = async () => {
    let projects:OptionsPromt<string>[] =[]
    try{
        let projectsRequeset = await getProjects().then()
        if(projectsRequeset.isSuccess){
            projects = projectsRequeset.value as OptionsPromt<string>[]
            await inquirer.prompt([
                {
                  name: "current_project",
                  type: 'list',
                  choices: projects,
                  message: 'Selecciona un proyecto',
                }
              ])
                .then(resp => {
                  if (resp.current_project) {
                    let project = resp.current_project
                    let key = resp.current_project
                    let name = projects.find(x => x.value == resp.current_project)?.name
                    setEnvKey(ENV_KEY.DEFAULD_PROJECT_NAME, name!)
                    setEnvKey(ENV_KEY.DEFAULD_PROJECT_ID, key)
                    console.log(chalk.green.bold(`Proyecto ${name} configurado con éxito!`));
                    console.log('');
                    console.log('');
                  }
                });
        }else{
            console.log(projectsRequeset.sMessage)
        }


    }catch(err){
        console.log('Ocurrió un error al obtener proyectos')
    }
  }
  
  
  const handleCurrentSprint = async (value: string | null = null) => {
    let CURRENT_SPRINT = getEnvValue(ENV_KEY.CURRENT_SPRINT)
    let CURRENT_SPRINT_ID = getEnvValue(ENV_KEY.CURRENT_SPRINT_ID)
    let CURRENT_SPRINT_DATE = getEnvValue(ENV_KEY.CURRENT_SPRNT_DATE)

    if(CURRENT_SPRINT_DATE){
        console.log(`
        
            ...Verificando sprint actual
    
            `)
    
        let endDate = moment(CURRENT_SPRINT_DATE)
        let today = moment()
        let validateDate  = today.isBefore(endDate)
        let resp
        if(validateDate){
         resp =  await inquirer.prompt([
                {
                  name: "end_sprint",
                  type: 'confirm',
                  default: true,
                  message: `Según la planificación el sprint ${CURRENT_SPRINT} finalizó el día ${endDate.format('DD/MM/YYYY')}
                  ¿Desea actualizarlo?`,
                }
              ]).then()
        if(resp.end_sprint) await setCurrentSprint()
        }else{
            resp =  await inquirer.prompt([
                {
                  name: "end_sprint",
                  type: 'confirm',
                  default: true,
                  message: `El sprint ${CURRENT_SPRINT} tiene fecha de finalización planeada para el día ${endDate.format('DD/MM/YYYY')}
                  ¿Desea actualizarlo?`,
                }
              ]).then()
        if(resp.end_sprint) await setCurrentSprint()
        }
    }else await setCurrentSprint()
  }
  
  const setCurrentSprint = async () => {
    let current_sprint:Sprint | null
    let project_id = Number(getEnvValue(ENV_KEY.DEFAULD_PROJECT_ID))

    if(project_id){
        try{
            let  current_sprintRequest = await getCurrentSprint(project_id).then()
            current_sprint = current_sprintRequest.value
            if(current_sprintRequest.isSuccess && current_sprint){
                setEnvKey(ENV_KEY.CURRENT_SPRINT, current_sprint.name)
                setEnvKey(ENV_KEY.CURRENT_SPRINT_ID, String(current_sprint.id))
                setEnvKey(ENV_KEY.CURRENT_SPRNT_DATE, String(current_sprint.endDate))
                setEnvKey(ENV_KEY.CURRENT_SPRNT_GOAL, String(current_sprint.goal))
                console.log(chalk.green.bold('¡Sprint configurado con éxito!'));
                console.log('');
                console.log('');
                await handleIssues()
            }else{
                console.log(current_sprintRequest.sMessage)
            }
    
        }catch(err){

        }
    }else{
       let resp = await inquirer.prompt([
            {
              name: "prj",
              type: 'confirm',
              default: true,
              message: 'No tienes un proyecto configurado ¿Deseas hacerlo?',
            }
          ]).then()

        if(resp.prj){
            await await setProject()
        }
    }

  }




export const handleIssues = async ()=> {
    let CURRENT_SPRINT = getEnvValue(ENV_KEY.CURRENT_SPRINT)
    let CURRENT_SPRINT_ID = getEnvValue(ENV_KEY.CURRENT_SPRINT_ID)
    if(CURRENT_SPRINT){
      let resp =  await getIssuesBySprintID(Number(CURRENT_SPRINT_ID)).then()
      if(resp?.isSuccess){
        issuesCollection.removeAllIssues()
        issuesCollection.BulkAddIssues(resp.value)
        console.log(chalk.green.bold(`¡Incidencias optenidas con éxito!`));
        console.log('');
        console.log('');
      }
    }
}

export const setIssuesDB = async()=>{

}

