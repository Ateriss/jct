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

      if(resp?.value === 'change_project'){
          getNewProjects(0)
          return
      }
      setCurrentProject(projects_list.find(prj => String(prj.id) == resp?.value)!)
        
    }else{
      getNewProjects(0)
    }
  }

  const setCurrentProject =(project:JiraProject, isScrumManaged?: boolean)=>{
          let key = String(project.id)
          let name = project.name
          let type = isScrumManaged || project.isScrumManaged ? 'scrum' : 'clasic'
          setEnvKey(ENV_KEY.DEFAULD_PROJECT_NAME, name)
          setEnvKey(ENV_KEY.DEFAULD_PROJECT_ID, key)
          setEnvKey(ENV_KEY.DEFAULD_PROJECT_TYPE, type)
          console.log(chalk.green.bold(srtGlobal.project_configured_success));
          console.log('');
          console.log('');
          
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
                if (inq.value.startsWith('page_')) {
                  let new_page = Number(inq.value.split('_')[1])
                  getNewProjects(new_page)
                }else{
                  let newPrj = projects_list.find(prj => String(prj.id) == inq.value)
                  newPrj! = await checkScrumManaged(newPrj!)
                  setCurrentProject(newPrj!)
                  issuesCollection.addJiraProject(newPrj!)

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