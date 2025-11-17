import { JSONFileSync } from "lowdb/node";
import { LowSync } from 'lowdb';
import { FormattedIssue, JiraProject, OptionsPromt, Sprint } from "../helpers/interfaces.js";
import { DB_NAME } from "../helpers/enum.js";
import path from "path";
import os from "os";
import { EncryptedJSONFileSync } from "../helpers/EncryptedJSONFileSync.js";


interface Data {
    [DB_NAME.JIRA_PROJECTS]: OptionsPromt<JiraProject>[],
    [DB_NAME.SMART_PROJECTS]: OptionsPromt<any>[], //TODO: DEFINIR INTERFAZ
    [DB_NAME.JIRA_SPACES]: OptionsPromt<string>[],
}

export class JsonIssuesCollection {
    private db: LowSync<Data>;

    constructor() {
        const dbPath = path.join(os.homedir(), ".jct", "db.enc");

        const adapter = new EncryptedJSONFileSync<Data>(dbPath);
        this.db = new LowSync<Data>(adapter, {  [DB_NAME.JIRA_PROJECTS]: [],
                                                [DB_NAME.SMART_PROJECTS]: [],
                                                [DB_NAME.JIRA_SPACES]: [] });
        this.db.read();
        this.db.data ||= {  [DB_NAME.JIRA_PROJECTS]: [],
                            [DB_NAME.SMART_PROJECTS]: [],
                            [DB_NAME.JIRA_SPACES]: [] };
    }

    public getJiraProjects():JiraProject[] {
        return this.db.data[DB_NAME.JIRA_PROJECTS].map(prj => prj.value);
    }

    public getJiraProjectById(pry:number):JiraProject | undefined {
        return this.db.data[DB_NAME.JIRA_PROJECTS].find(prj => prj.value.id === pry)?.value;
    }

    public async addJiraProject(project: JiraProject): Promise<void> {
        const projects = this.db.data[DB_NAME.JIRA_PROJECTS];

        const index = projects.findIndex(prj => Number(prj.value.id) === Number(project.id));

        if (index >= 0) {
            projects[index] = {
                name: project.name,
                value: project
            };
        } else {
            projects.push({
                name: project.name,
                value: project
            });
        }

        await this.db.write();
    }
    

public async addCurrentSprint(sprint: Sprint, pry_id: number): Promise<void> {
    const index = this.db.data[DB_NAME.JIRA_PROJECTS]
        .findIndex(prj => Number(prj.value.id) === pry_id);
    if (index === -1) return;

    const project = this.db.data[DB_NAME.JIRA_PROJECTS][index].value;

    const boards = project.board ? [...project.board] : [];

    const updatedBoards = boards.filter(b => b.id !== sprint.id);
    updatedBoards.push({...sprint, issues:[]});
    this.db.data[DB_NAME.JIRA_PROJECTS][index] = {
        ...this.db.data[DB_NAME.JIRA_PROJECTS][index],
        value: {
            ...project,
            board: updatedBoards
        }
    };

    await this.db.write();
}




    public async addSprintIssues(pry: number, sprint: number, issues:FormattedIssue[]):Promise<void>{
        const exists_pry = this.db.data[DB_NAME.JIRA_PROJECTS].find(prj => Number(prj.value.id) === pry)?.value;
        const exists_sprint = exists_pry?.board?.find(x => x.id === sprint)
        if(exists_pry && exists_sprint){
            let newIssues:FormattedIssue[] = issues
            exists_sprint.issues = newIssues
            this.db.data[DB_NAME.JIRA_PROJECTS].forEach((x,i,a)=> {
                if(x.value.id === pry){
                    a[i].value.board?.forEach((y,z,w)=> {
                if(y.id === exists_sprint.id) w[z].issues = newIssues
            })
                }
            })

            this.db.write()
        }

    }

    async getIssuesAgile(pry: number, sprint: number): Promise<OptionsPromt<FormattedIssue | null>[]> {
        const exists_pry = this.db.data[DB_NAME.JIRA_PROJECTS].find(prj => Number(prj.value.id) === Number(pry))?.value;
        const exists_sprint = exists_pry?.board?.find(x => Number(x.id) === Number(sprint))
        if(exists_pry && exists_sprint){
        let issues = exists_sprint.issues.map(x => {
            return {name: x.name, value:x}
        })
        return issues
        }
        return [{name: '', value: null}]
    }

    // public async addIssue(issue: OptionsPromt<FormattedIssue>): Promise<void> {
    //     this.db.data[DB_NAME.JIRA_PROJECTS].push(issue);
    //     await this.db.write();
    // }

    // public async BulkAddIssues(issues: OptionsPromt<FormattedIssue>[]): Promise<void> {
    //     this.db.data.issues.push(...issues);
    //     await this.db.write();
    // }



    // async findIssueByKey(key: string): Promise<OptionsPromt<FormattedIssue> | undefined> {
    //     return this.db.data.issues.find(issue => issue.value.key === key);
    // }

    // async removeIssueByKey(key: string): Promise<void> {
    //     this.db.data.issues = this.db.data.issues.filter(issue => issue.value.key !== key);
    //     await this.db.write();
    // }

    // public async removeAllIssues(): Promise<void> {
    //     this.db.data.issues = [];
    //     await this.db.write();
    // }

    // async updateIssue(issue: OptionsPromt<FormattedIssue>): Promise<void> {
    //     const index = this.db.data.issues.findIndex(i => i.value.key === issue.value.key);
    //     if (index !== -1) {
    //         this.db.data.issues[index] = issue;
    //         await this.db.write();
    //     }
    // }

    
}