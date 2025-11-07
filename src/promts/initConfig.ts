

import inquirer from 'inquirer'
import axios from 'axios'
import { EnvKey, FormattedIssue, generalResponse, JiraProject, OptionsPromt, Sprint } from '../helpers/interfaces.js'
import { checkEnv } from '../helpers/checkingEnv.js'
import { ENV_KEY } from '../helpers/enum.js'
import { getEnvValue, setEnvKey } from '../helpers/envHandler.js'
import chalk from 'chalk'
import { getCurrentSprint, getIssuesBySprintID, getProjects } from '../services/jira.service.js';
import moment from 'moment'
import { JsonIssuesCollection } from '../models/IssuesCollection.js'
import { issuesCollection } from '../index.js'
import { spawn } from 'child_process';
import { srtGlobal } from '../helpers/textDictionary.js'
import { handleDefaultProject } from './projectJira.js'
import { promptConfirm } from './shared/promtBase.js'





export const initJCT = async () => {
    const check: generalResponse<ENV_KEY[]> = checkEnv()
    if (check.isSuccess) return true
    else {
      console.log(`
        ${srtGlobal.jct_config_start}
        `);
        await setBulkConfig(check.value!)
    }
}

export const setBulkConfig = async (config: ENV_KEY[]) => {
  try {
    for (const key of config) {
      console.log(chalk.blue.bold(`${srtGlobal.configuring_value}: ${key}`));

      try {
        await handleEnvValues({ key, value: '' });
      } catch (err: any) {
        if (err.name === "ExitPromptError" || err.code === "SIGINT") {
          console.log(chalk.yellow(`\n⚠️ ${srtGlobal.canceled} ${key}`));
          return;
        } else {
          console.error(chalk.red(`❌ ${srtGlobal.config_error} ${key} -- `), err);
        }
      }
    }

    console.log(chalk.green.bold(srtGlobal.config_success));
  } catch (err: any) {
    console.error(chalk.red.bold(srtGlobal.no_control_error), err);
  }
};


export const handleEnvValues = async (env: EnvKey) => {
    switch (env.key) {
      case ENV_KEY.JR_TOKEN:
        await handleToken()
        break
      case ENV_KEY.JR_MAIL:
        await handleUser()
        break
      case ENV_KEY.JR_SPACE:
        await handleSpace()
        break
      case ENV_KEY.DEFAULD_PROJECT_NAME:
        await handleDefaultProject()
        break
      case ENV_KEY.CURRENT_SPRINT:
        await handleCurrentSprint()
        break
      case ENV_KEY.SMART_URL:
        // await handleSmartUrl(env.value)
        break
      case ENV_KEY.SMART_TOKEN:
        // await handleSmartToken(env.value)
        break
      case ENV_KEY.SMART_USER_ID:
        // await handleSmartUser(env.value)
        break
      case ENV_KEY.SMART_DEFAULD_PROJECT_ID:
        // await handleSmartDefaultProject(env.value)
        break
      case ENV_KEY.SMART_DEFAULD_RQ_ID:
        // await handleSmartDefaultRQ(env.value)
        break
      case ENV_KEY.SMART_DEFAULD_CAT_ID:
        // await handleSmartDefaultCat(env.value)
        break
      default:
        break
    }
  }

const handleToken = async ()=>{
    let JR_TOKEN = getEnvValue(ENV_KEY.JR_TOKEN)

    if(!JR_TOKEN){
      console.log(srtGlobal.add_jira_token);        
      await setToken()
    }else{
        const resp = await promptConfirm(srtGlobal.jira_token_configured, false);
          console.log(resp)
          if(resp){
           await setToken()
          }
    }
 
}

const setToken = async () => {
    let JR_TOKEN = ''
    console.log(`
        ${srtGlobal.get_jira_token_link}
        https://id.atlassian.com/manage-profile/security/api-tokens
        
        
        `)
    await inquirer.prompt([
        {
          name: "jr_token",
          type: "password",  
          message: srtGlobal.paste_jira_token  
        }
      ])
      .then(resp => {
        if(resp.jr_token){
          setEnvKey(ENV_KEY.JR_TOKEN,resp.jr_token)
          console.log(chalk.green.bold(srtGlobal.token_configured_success));
          console.log(chalk.yellow(srtGlobal.remember_message));
          console.log(chalk.cyan(srtGlobal.dont_share_token));
          console.log(chalk.gray(srtGlobal.security_important));
          console.log('');
          console.log('');
        }
      });
}

const handleUser = async () => {
    let user = getEnvValue(ENV_KEY.JR_MAIL)
    if(!user){
      console.log(srtGlobal.add_jira_email);       
      await setUser()
    }else{
        const resp = await promptConfirm(srtGlobal.jira_email_configured, false);
          if(resp){
           await setUser()
        }
    }
}

const setUser = async()=>{
    await inquirer.prompt([
        {
          name: "jr_user",
          type: 'input',  
          message: srtGlobal.enter_user_email,
        }
      ])
      .then(resp => {
        if(resp.jr_user){
            setEnvKey(ENV_KEY.JR_MAIL,resp.jr_user)
            console.log(chalk.green.bold(srtGlobal.user_configured_success));
            console.log('');
            console.log('');
        }
      });
}

const handleSpace = async () => {
    let JR_SPACE = getEnvValue(ENV_KEY.JR_SPACE)
    if (!JR_SPACE) {
      await setSpace()
    } else {
      let resp =  await promptConfirm(srtGlobal.jira_space_url_configured, false);

        if (resp) {
           await setSpace()
          }
    }
  }
  
  const setSpace = async() => {
    const currentSpace = getEnvValue(ENV_KEY.JR_SPACE);
    if (currentSpace) {
      await inquirer.prompt([
        {
          name: "change_space",
          type: 'confirm',
          message: srtGlobal.jira_space_current.replace("JIRA_SPACE_URL", currentSpace),
          default: false
        }
      ]).then((r)=>{
        if(r.change_space){
          addNewJiraSpace();
        }
      })
    }else{
      addNewJiraSpace();
    }
  }

  const addNewJiraSpace = async (current_space?:string) => {
    await inquirer.prompt([
      {
        name: "jr_space",
        type: 'input',
        message: srtGlobal.enter_jira_space_url,
      }
    ])
      .then(resp => {
        if (resp.jr_space) {
          console.log(chalk.yellow.bold(srtGlobal.current_value_changed.replace("NEW_VALUE_ENV", resp.jr_space)));
          setEnvKey(ENV_KEY.JR_SPACE, resp.jr_space)
          console.log(chalk.green.bold(srtGlobal.url_configured_success));
          
          console.log('');
          console.log('');
        }
      });
  }
  



  ///--SPRINTS ----
  
  const handleCurrentSprint = async () => {
    let CURRENT_SPRINT = getEnvValue(ENV_KEY.CURRENT_SPRINT)
    let CURRENT_SPRINT_ID = getEnvValue(ENV_KEY.CURRENT_SPRINT_ID)
    let CURRENT_SPRINT_DATE = getEnvValue(ENV_KEY.CURRENT_SPRNT_DATE)

    if(CURRENT_SPRINT_DATE){
        let endDate = moment(CURRENT_SPRINT_DATE)
        let today = moment()
        let validateDate  = endDate.isBefore(today)
        let resp
        if(validateDate){
         resp =  await inquirer.prompt([
                {
                  name: "end_sprint",
                  type: 'confirm',
                  default: true,
                  message: srtGlobal.sprint_ended_update.replace("CURRENT_SPRINT", CURRENT_SPRINT!).replace("END_DATE", endDate.format('DD/MM/YYYY')),

                }
              ]).then()
        if(resp.end_sprint) await setCurrentSprint()
        }else{
            resp =  await inquirer.prompt([
                {
                  name: "end_sprint",
                  type: 'confirm',
                  default: true,
                  message: srtGlobal.sprint_end_date_update.replace("CURRENT_SPRINT", CURRENT_SPRINT!).replace("END_DATE", endDate.format('DD/MM/YYYY')),
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
                console.log(chalk.green.bold(srtGlobal.sprint_configured_success));                console.log('');
                console.log('');
                await handleIssues()
            }else{
                console.log(current_sprintRequest.sMessage)
            }
    
        }catch(err){

        }
    }else{
       console.log(srtGlobal.must_configurate)

            await initJCT()
        
    }

  }




export const handleIssues = async ()=> {
    let CURRENT_SPRINT = getEnvValue(ENV_KEY.CURRENT_SPRINT)
    let CURRENT_SPRINT_ID = getEnvValue(ENV_KEY.CURRENT_SPRINT_ID)
    if(CURRENT_SPRINT){
      let resp =  await getIssuesBySprintID(Number(CURRENT_SPRINT_ID)).then()
      if(resp?.isSuccess){
       // issuesCollection.removeAllIssues()
       // issuesCollection.BulkAddIssues(resp.value)
        console.log(chalk.green.bold(`¡Incidencias optenidas con éxito!`));
        console.log('');
        console.log('');
      }
    }
}


