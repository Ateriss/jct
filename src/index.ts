import inquirer from 'inquirer'
import { sInit_Mensaje } from './helpers/initMessage.js'
import axios from 'axios'

const jira_token:string = ''
const jira_space:string = ''
const jira_email:string = ''

const authString = `${jira_email}:${jira_token}`;
const encodedAuth = Buffer.from(authString).toString('base64');

const instance = axios.create({
    baseURL: jira_space,
    headers: {
      Authorization: `Basic ${encodedAuth}`,
      'Content-Type': 'application/json',
    },
  });

  async function getProjects() {
    try {
      const response = await instance.get('/rest/api/2/project');
      const projects = response.data;
      console.log('Proyectos de Jira:');
      projects.forEach((project:any) => {
        console.log(`- ${project.name} (${project.key})`);
      });
    } catch (error:any) {
      console.error('Error al obtener proyectos:', error.message);
    }
  }
  

console.log(sInit_Mensaje)

getProjects()