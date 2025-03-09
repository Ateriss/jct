import inquirer from 'inquirer'
import chalk from 'chalk'
import moment from 'moment'


import { ENV_KEY } from '../helpers/enum'
import type { EnvKey, GeneralResponse, OptionsPromt, Sprint } from '../helpers/interfaces'

import { issuesCollection } from '../index'
import { checkEnv } from '../helpers/checkingEnv'
import { srtGlobal } from '../helpers/textDictionary'
import { getEnvValue, setEnvKey } from '../helpers/envHandler'
import { getCurrentSprint, getIssuesBySprintID, getProjects } from '../services/jira.service';


let envValues: EnvKey[] = []

export const initJCT = async () => {
  const check: GeneralResponse<EnvKey[]> = checkEnv()
  if (check.isSuccess) return true
  else {
    console.log(`
        ${srtGlobal.jct_config_start}
        `);
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

const handleToken = async (value: string | null = null) => {
  let JR_TOKEN = value

  if (!JR_TOKEN) {
    console.log(srtGlobal.add_jira_token);
    await setToken()
  } else {
    const resp = await inquirer.prompt([
      {
        name: "jr_token",
        type: 'confirm',
        message: srtGlobal.jira_token_configured,
        default: false
      }
    ])
      .then();
    console.log(resp.jr_token)
    if (resp.jr_token) {
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
      if (resp.jr_token) {
        setEnvKey(ENV_KEY.JR_TOKEN, resp.jr_token)
        console.log(chalk.green.bold(srtGlobal.token_configured_success));
        console.log(chalk.yellow(srtGlobal.remember_message));
        console.log(chalk.cyan(srtGlobal.dont_share_token));
        console.log(chalk.gray(srtGlobal.security_important));
        console.log('');
        console.log('');
      }
    });
}

const handleUser = async (value: string | null = null) => {

  if (!value) {
    console.log(srtGlobal.add_jira_email);
    await setUser()
  } else {
    const resp = await inquirer.prompt([
      {
        name: "jr_token",
        type: 'confirm',
        message: srtGlobal.jira_email_configured,
        default: false
      }
    ])
      .then();
    if (resp.jr_token) {
      await setUser()
    }
  }
}

const setUser = async () => {
  await inquirer.prompt([
    {
      name: "jr_user",
      type: 'input',
      message: srtGlobal.enter_user_email,
    }
  ])
    .then(resp => {
      if (resp.jr_user) {
        setEnvKey(ENV_KEY.JR_MAIL, resp.jr_user)
        console.log(chalk.green.bold(srtGlobal.user_configured_success));
        console.log('');
        console.log('');
      }
    });
}

const handleSpace = async (value: string | null = null) => {
  if (!value) {
    await setSpace()
  } else {
    let resp = await inquirer.prompt([
      {
        name: "jr_space",
        type: 'confirm',
        message: srtGlobal.jira_space_url_configured,
        default: false
      }
    ])
      .then();

    if (resp.jr_space) {
      await setSpace()
    }
  }
}

const setSpace = async () => {
  await inquirer.prompt([
    {
      name: "jr_space",
      type: 'input',
      message: srtGlobal.enter_jira_space_url,
    }
  ])
    .then(resp => {
      if (resp.jr_space) {
        setEnvKey(ENV_KEY.JR_SPACE, resp.jr_space)
        console.log(chalk.green.bold(srtGlobal.url_configured_success));
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
    let resp = await inquirer.prompt([
      {
        name: "default_project_name",
        type: 'confirm',
        message: 'Ya tienes el proyecto Jira por defecto configurado ¿Deseas cambiarlo?',
        default: false
      }
    ])
      .then();
    if (resp.default_project_name) {
      await setProject()
    }
  }
}

const setProject = async () => {
  let projects: OptionsPromt<string>[] = []
  try {
    let projectsRequeset = await getProjects().then()
    if (projectsRequeset.isSuccess) {
      projects = projectsRequeset.value as OptionsPromt<string>[]
      await inquirer.prompt([
        {
          name: "current_project",
          type: 'list',
          choices: projects,
          message: srtGlobal.select_project,
        }
      ])
        .then(resp => {
          if (resp.current_project) {
            let project = resp.current_project
            let key = resp.current_project
            let name = projects.find(x => x.value == resp.current_project)?.name
            setEnvKey(ENV_KEY.DEFAULD_PROJECT_NAME, name!)
            setEnvKey(ENV_KEY.DEFAULD_PROJECT_ID, key)
            console.log(chalk.green.bold(srtGlobal.project_configured_success));
            console.log('');
            console.log('');
          }
        });
    } else {
      console.log(projectsRequeset.sMessage)
    }


  } catch (err) {
    console.log(srtGlobal.error_getting_projects)
  }
}

const handleCurrentSprint = async (value: string | null = null) => {
  let CURRENT_SPRINT = getEnvValue(ENV_KEY.CURRENT_SPRINT)
  let CURRENT_SPRINT_ID = getEnvValue(ENV_KEY.CURRENT_SPRINT_ID)
  let CURRENT_SPRINT_DATE = getEnvValue(ENV_KEY.CURRENT_SPRNT_DATE)

  if (CURRENT_SPRINT_DATE) {
    let endDate = moment(CURRENT_SPRINT_DATE)
    let today = moment()
    let validateDate = endDate.isBefore(today)
    let resp
    if (validateDate) {
      resp = await inquirer.prompt([
        {
          name: "end_sprint",
          type: 'confirm',
          default: true,
          message: srtGlobal.sprint_ended_update.replace("CURRENT_SPRINT", CURRENT_SPRINT!).replace("END_DATE", endDate.format('DD/MM/YYYY')),

        }
      ]).then()
      if (resp.end_sprint) await setCurrentSprint()
    } else {
      resp = await inquirer.prompt([
        {
          name: "end_sprint",
          type: 'confirm',
          default: true,
          message: srtGlobal.sprint_end_date_update.replace("CURRENT_SPRINT", CURRENT_SPRINT!).replace("END_DATE", endDate.format('DD/MM/YYYY')),
        }
      ]).then()
      if (resp.end_sprint) await setCurrentSprint()
    }
  } else await setCurrentSprint()
}

const setCurrentSprint = async () => {
  let current_sprint: Sprint | null
  let project_id = Number(getEnvValue(ENV_KEY.DEFAULD_PROJECT_ID))

  if (project_id) {
    try {
      let current_sprintRequest = await getCurrentSprint(project_id).then()
      current_sprint = current_sprintRequest.value
      if (current_sprintRequest.isSuccess && current_sprint) {
        setEnvKey(ENV_KEY.CURRENT_SPRINT, current_sprint.name)
        setEnvKey(ENV_KEY.CURRENT_SPRINT_ID, String(current_sprint.id))
        setEnvKey(ENV_KEY.CURRENT_SPRNT_DATE, String(current_sprint.endDate))
        setEnvKey(ENV_KEY.CURRENT_SPRNT_GOAL, String(current_sprint.goal))
        console.log(chalk.green.bold(srtGlobal.sprint_configured_success)); console.log('');
        console.log('');
        await handleIssues()
      } else {
        console.log(current_sprintRequest.sMessage)
      }

    } catch (err) {

    }
  } else {
    console.log(srtGlobal.must_configurate)

    await initJCT()

  }

}

export const handleIssues = async () => {
  let CURRENT_SPRINT = getEnvValue(ENV_KEY.CURRENT_SPRINT)
  let CURRENT_SPRINT_ID = getEnvValue(ENV_KEY.CURRENT_SPRINT_ID)
  if (CURRENT_SPRINT) {
    let resp = await getIssuesBySprintID(Number(CURRENT_SPRINT_ID)).then()
    if (resp?.isSuccess) {
      issuesCollection.removeAllIssues()
      issuesCollection.BulkAddIssues(resp.value)
      console.log(chalk.green.bold(`¡Incidencias optenidas con éxito!`));
      console.log('');
      console.log('');
    }
  }
}
