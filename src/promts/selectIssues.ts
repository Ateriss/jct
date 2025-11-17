
import inquirer from "inquirer"
import { Commit, FormattedIssue, OptionsPromt } from "../helpers/interfaces.js"
import { issuesCollection } from "../index.js"
import { getEnvValue } from "../helpers/envHandler.js"
import { ENV_KEY } from "../helpers/enum.js"
import moment from "moment"
import { handleEnvValues } from "./initConfig.js"
import { handleCommit } from "../helpers/commitCommants.js"
import { sInit_Mensaje } from "../helpers/initMessage.js"
import { setGlobalStr, srtGlobal } from "../helpers/textDictionary.js"
import { jiraRequestError } from "../helpers/jiraRequestError.js"
import { initCheck } from "../helpers/checkingEnv.js"
import { promptList } from "./shared/promtBase.js"

export const checkIssues = async ()=> {
  try{
     let endDate = getEnvValue(ENV_KEY.CURRENT_SPRNT_DATE)
     let today = moment()
     let CURRENT_SPRINT = getEnvValue(ENV_KEY.CURRENT_SPRINT)
     let CURRENT_PRJ_ID = getEnvValue(ENV_KEY.DEFAULD_PROJECT_ID)
     let CURRENT_SPRINT_ID = getEnvValue(ENV_KEY.CURRENT_SPRINT_ID)
     if(CURRENT_SPRINT_ID){
     let issues:OptionsPromt<FormattedIssue>[] = await issuesCollection.getIssuesAgile(CURRENT_PRJ_ID, CURRENT_SPRINT_ID).then()
     //let valid = initCheck()
    // console.log(valid)
     if(true){
      // if(endDate){
      //     let validate = moment(endDate).isBefore(today)
      //     if(validate){
      //         await handleEnvValues({key:ENV_KEY.CURRENT_SPRINT, value:null})
      //     }
      // }
      //else if(!issues.length) await handleEnvValues({key:ENV_KEY.CURRENT_SPRINT, value:null})

      await selectIssueToCommit()
    }
     }



  }catch(err){

  }
 

}

const validateJiraConfig = async ()=> {
  let TOKEN = getEnvValue(ENV_KEY.JR_TOKEN)

  if(!TOKEN){
    jiraRequestError()
  }
   return !!TOKEN
}


export const selectIssueToCommit = async () => {
     let CURRENT_PRJ_ID = getEnvValue(ENV_KEY.DEFAULD_PROJECT_ID)
     let CURRENT_SPRINT_ID = getEnvValue(ENV_KEY.CURRENT_SPRINT_ID)
     if(CURRENT_SPRINT_ID){
    let issues:OptionsPromt<FormattedIssue>[] = await issuesCollection.getIssuesAgile(CURRENT_PRJ_ID,CURRENT_SPRINT_ID).then()
    if(issues.length){

        let resp = await promptList<FormattedIssue>(
            'select_issue',
            srtGlobal.working_on_issue,
            issues
        ). then()
        
        if(resp){
            await handleCommitChoices(resp)
        }
    }else{

    }      
     }

}


 const handleCommitChoices = async (issues:FormattedIssue) => {
    let prefix = await inquirer.prompt([
        {
          name: "prefix",
          type: 'list',
          choices: gitFlowOptions(),
          message: srtGlobal.select_commit_type,
        }
      ]).then()

    let title = await inquirer.prompt([
        {
          name: "title",
          type: 'input',
          message: srtGlobal.commit_title_question,
        }
      ]).then()

      let description = await inquirer.prompt([
        {
          name: "descrip",
          type: 'input',
          message: srtGlobal.commit_description_question,
        }
      ]).then()


      let commit:Commit = {
        //@ts-ignore
        title: `${issues.value.key}: ${prefix.prefix} / ${title.title}`,
        mesasge: description.descrip,
                //@ts-ignore
        branch: issues.value.key
      } 

      await  handleCommit(commit)

}





export const gitFlowOptions = (): OptionsPromt<string>[] => {
  return [
  { name: srtGlobal.feat, value: 'feat' },
  { name: srtGlobal.fix, value: 'fix' },
  { name: srtGlobal.docs, value: 'docs' },
  { name: srtGlobal.style, value: 'style' },
  { name: srtGlobal.refactor, value: 'refactor' },
  { name: srtGlobal.perf, value: 'perf' },
  { name: srtGlobal.test, value: 'test' }
]
};