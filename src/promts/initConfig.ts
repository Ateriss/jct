

import inquirer from 'inquirer'
import { EnvKey, generalResponse } from '../helpers/interfaces.js'
import { checkEnv } from '../helpers/checkingEnv.js'
import { ENV_KEY } from '../helpers/enum.js'
import { getEnvValue, setEnvKey } from '../helpers/envHandler.js'
import chalk from 'chalk'
import { getCurrentSprint, getIssuesBySprintID } from '../services/jira.service.js';
import moment from 'moment'
import { issuesCollection } from '../index.js'
import { srtGlobal } from '../helpers/textDictionary.js'
import { getProjectByCurrentPath } from './projectJira.js'
import { promptConfirm, promptInput } from './shared/promtBase.js'





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
    const resp = await promptConfirm(srtGlobal.jira_token_configured, false).then();

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
        const resp = await promptConfirm(srtGlobal.jira_email_configured, false).then();
          if(resp){
           await setUser()
        }
    }
}






const setUser = async()=>{

    await promptInput(srtGlobal.enter_user_email)
      .then(resp => {
        if(resp){
            setEnvKey(ENV_KEY.JR_MAIL,resp)
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
    const r = await promptConfirm(srtGlobal.jira_space_current.replace("JIRA_SPACE_URL", currentSpace), false).then()
    
  

    if (r) {
      await addNewJiraSpace();
    }
  } else {
    await addNewJiraSpace();
  }
};


const addNewJiraSpace = async () => {
  const resp = await promptInput(srtGlobal.enter_jira_space_url).then()
  


  if (resp) {
    console.log(chalk.yellow.bold(
      srtGlobal.current_value_changed.replace("NEW_VALUE_ENV", resp)
    ));

    setEnvKey(ENV_KEY.JR_SPACE, resp);

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
         resp =  await promptConfirm(
          srtGlobal.sprint_ended_update.replace("CURRENT_SPRINT", CURRENT_SPRINT!).replace("END_DATE", endDate.format('DD/MM/YYYY')),
          true
         ).then()
         
        if(resp) await setCurrentSprint()
        }else{
            resp =  await promptConfirm(
              srtGlobal.sprint_end_date_update.replace("CURRENT_SPRINT", CURRENT_SPRINT!).replace("END_DATE", endDate.format('DD/MM/YYYY')),
              true
            ).then()
            
        if(resp) await setCurrentSprint()
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
            issuesCollection.addCurrentSprint(current_sprint, Number(project_id))

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

       issuesCollection.addSprintIssues(Number(CURRENT_PRJ_ID),Number(CURRENT_SPRINT_ID),resp.value)
        console.log(chalk.green.bold(`¡Incidencias optenidas con éxito!`));
        console.log('');
        console.log('');
      }
    }

}


