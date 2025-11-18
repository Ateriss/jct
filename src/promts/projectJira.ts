  /// ---- PROYECTOS ----

import { srtGlobal } from "../helpers/textDictionary.js";
import { JiraProject, OptionsPromt } from "../helpers/interfaces.js";
import { issuesCollection } from "../index.js";
import { setEnvKey } from "../helpers/envHandler.js";
import { ENV_KEY } from "../helpers/enum.js";
import chalk from "chalk";
import { completeJiraAgilePrj, getProjects } from "../services/jira.service.js";
import { promptList } from "./shared/promtBase.js";
import { handleCurrentSprint } from "./initConfig.js";
import { getCurrentPath } from "../helpers/handlePaths.js";

export const handleDefaultProject = async () => {
  await setProject()
};
  

  const setProject = async () => {
    let projects_options:OptionsPromt<string>[] =[]
    let projects_list:JiraProject[] = []
    projects_list = issuesCollection.getJiraProjects()
    if(projects_list.length){
      projects_options = projects_list.map(prj => ({
        name: prj.nameFormatted,
        value: String(prj.id)
      }))
      projects_options.push({
        name: srtGlobal.change_project,
        value: 'change_project'})

      const resp = await promptList('current_project',srtGlobal.select_project,projects_options )
      //@ts-expect-error
      if(resp === 'change_project'){
          getNewProjects(0)
          return
      }
      //@ts-expect-error
      setCurrentProject(projects_list.find(prj => String(prj.id) === resp)!)
        
    }else{
      getNewProjects(0)
    }
  }

  const setCurrentProject =(project:JiraProject, isScrumManaged?: boolean)=>{

          const current_path = getCurrentPath()
          issuesCollection.addProjectPath(project.id,current_path)
          console.log(chalk.green.bold(srtGlobal.project_configured_success));
          console.log('');
          console.log('');
          
  }

  export const getProjectByCurrentPath = (): JiraProject | null => {
          const current_path = getCurrentPath()
          return issuesCollection.getProjectByPath(current_path)
  }

  const getNewProjects = async (page_init: number = 0) => {
    try{
    console.log(chalk.blue.bold(srtGlobal.get_new_project));
    console.log('');
    let page = page_init
    const resp = await getProjects(page).then().catch(err => {console.error(err); throw err})
      if(resp.isSuccess && resp.value){
          let projects_options = resp.value.options
          let projects_list = resp.value.prjs

          const inq = await promptList('current_project',`${srtGlobal.select_project}`,projects_options )
          if (inq){
            //@ts-expect-error
                if (inq.startsWith('page_')) {
                   //@ts-expect-error
                  let new_page = Number(inq.split('_')[1])
                  getNewProjects(new_page)
                }else{
                  //@ts-expect-error
                  let newPrj = projects_list.find(prj => String(prj.id) == inq)
                  newPrj! = await checkScrumManaged(newPrj!)
                  await issuesCollection.addJiraProject(newPrj!)
                  setCurrentProject(newPrj!)

                  if(newPrj.isScrumManaged){
                  await handleCurrentSprint(); 

                  }
                }
                }

      }
    }catch(err){
      console.log(err);
    }

  }

  const checkScrumManaged = async (project: JiraProject):Promise<JiraProject>=>{
    return await completeJiraAgilePrj(project).then()

  }