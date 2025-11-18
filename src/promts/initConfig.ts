

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
import { getProjectByCurrentPath, handleDefaultProject } from './projectJira.js'
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
        console.error(err)
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

const handleToken = async () => {
  let JR_TOKEN = getEnvValue(ENV_KEY.JR_TOKEN);

  if (!JR_TOKEN) {
    console.log(srtGlobal.add_jira_token);
    await setToken();
  } else {
    const resp = await promptConfirm(srtGlobal.jira_token_configured, false);

    if (resp) {
      await setToken();
    }
  }
};

const setToken = async () => {
  console.log(`
${srtGlobal.get_jira_token_link}
https://id.atlassian.com/manage-profile/security/api-tokens
  `);

  const resp = await inquirer.prompt([
    {
      name: "jr_token",
      type: "password",
      message: srtGlobal.paste_jira_token
    }
  ]);

  if (resp.jr_token) {
    setEnvKey(ENV_KEY.JR_TOKEN, resp.jr_token);

    console.log(chalk.green.bold(srtGlobal.token_configured_success));
    console.log(chalk.yellow(srtGlobal.remember_message));
    console.log(chalk.cyan(srtGlobal.dont_share_token));
    console.log(chalk.gray(srtGlobal.security_important));
    console.log('');
  }
};

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
  await setSpace();
};

  
const setSpace = async () => {
  const currentSpace = getEnvValue(ENV_KEY.JR_SPACE);

  if (currentSpace) {
    const r = await inquirer.prompt([
      {
        name: "change_space",
        type: "confirm",
        message: srtGlobal.jira_space_current.replace("JIRA_SPACE_URL", currentSpace),
        default: false
      }
    ]);

    if (r.change_space) {
      await addNewJiraSpace();
    }
  } else {
    await addNewJiraSpace();
  }
};


const addNewJiraSpace = async () => {
  const resp = await inquirer.prompt([
    {
      name: "jr_space",
      type: "input",
      message: srtGlobal.enter_jira_space_url
    }
  ]);

  if (resp.jr_space) {
    console.log(chalk.yellow.bold(
      srtGlobal.current_value_changed.replace("NEW_VALUE_ENV", resp.jr_space)
    ));

    setEnvKey(ENV_KEY.JR_SPACE, resp.jr_space);

    console.log(chalk.green.bold(srtGlobal.url_configured_success));
    console.log('');
  }
};

  

//NO AGILE ISSUES

  ///--SPRINTS ----
  
  export const handleCurrentSprint = async () => {
    const current_prj = getProjectByCurrentPath()
    const current_sprint = current_prj?.board![0]
    let CURRENT_SPRINT = current_sprint?.name
    let CURRENT_SPRINT_DATE = current_sprint?.endDate

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
    const current_prj = getProjectByCurrentPath()
    const project_id = current_prj?.id

    if (!project_id) {
        console.log(srtGlobal.must_configurate);
        await initJCT();
        return;
    }

    try {
        const current_sprintRequest = await getCurrentSprint(String(project_id), true);
        const current_sprint = current_sprintRequest.value;

        if (current_sprintRequest.isSuccess && current_sprint) {
            issuesCollection.addCurrentSprint(current_sprint, Number(project_id));

            setEnvKey(ENV_KEY.CURRENT_SPRINT, current_sprint.name);
            setEnvKey(ENV_KEY.CURRENT_SPRINT_ID, String(current_sprint.id));
            setEnvKey(ENV_KEY.CURRENT_SPRNT_DATE, String(current_sprint.endDate));
            setEnvKey(ENV_KEY.CURRENT_SPRNT_GOAL, String(current_sprint.goal));

            console.log(chalk.green.bold(srtGlobal.sprint_configured_success));
            console.log('');

            await handleIssues();
        } else {
            console.log(current_sprintRequest.sMessage);
        }
    } catch (err) {
        console.log(err);
    }
};





export const handleIssues = async ()=> {
    const current_prj = getProjectByCurrentPath();
    const sprint =  current_prj?.board ?? []
    let CURRENT_SPRINT_ID = sprint[0].id
    let CURRENT_PRJ_ID = current_prj?.id
    if(CURRENT_SPRINT_ID){
      let resp =  await getIssuesBySprintID(Number(CURRENT_SPRINT_ID)).then()
      if(resp?.isSuccess){
       // issuesCollection.removeAllIssues()
       // issuesCollection.BulkAddIssues(resp.value)
       issuesCollection.addSprintIssues(Number(CURRENT_PRJ_ID),Number(CURRENT_SPRINT_ID),resp.value)
        console.log(chalk.green.bold(`¡Incidencias optenidas con éxito!`));
        console.log('');
        console.log('');
      }
    }

}


