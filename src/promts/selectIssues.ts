
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

export const checkIssues = async ()=> {
  try{
    // await  setGlobalStr()
    // let endDate = getEnvValue(ENV_KEY.CURRENT_SPRNT_DATE)
    // let today = moment()
    // let issues:OptionsPromt<FormattedIssue>[] = await issuesCollection.getIssues().then()
    // let CURRENT_SPRINT = getEnvValue(ENV_KEY.CURRENT_SPRINT)

    // let valid = initCheck()
    // if(valid.isSuccess){
    //   if(endDate){
    //       let validate = moment(endDate).isBefore(today)
    //       if(validate){
    //           await handleEnvValues({key:ENV_KEY.CURRENT_SPRINT, value:null})
    //       }
    //   }
    //   else if(!issues.length) await handleEnvValues({key:ENV_KEY.CURRENT_SPRINT, value:null})

    //   await selectIssueToCommit()
    // }

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
    // let issues:OptionsPromt<FormattedIssue>[] = await issuesCollection.getIssues().then()
    // if(issues.length){
    //     let resp = await inquirer.prompt([
    //         {
    //           name: "select_issue",
    //           type: 'list',
    //           choices: issues,
    //           message: srtGlobal.working_on_issue,
    //         }
    //       ]).then()
    //     if(resp.select_issue){
    //         await handleCommitChoices(resp.select_issue)
    //     }
    // }else{

    // }
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
        title: `${issues.key}: ${prefix.prefix} / ${title.title}`,
        mesasge: description.descrip,
        branch: issues.key
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