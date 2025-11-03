import { JSONFileSync } from "lowdb/node";
import { LowSync } from 'lowdb';
import { FormattedIssue, JiraProject, OptionsPromt } from "../helpers/interfaces.js";
import { DB_NAME } from "../helpers/enum.js";

interface Data {
    [DB_NAME.JIRA_PROJECTS]: OptionsPromt<JiraProject>[],
    [DB_NAME.SMART_PROJECTS]: OptionsPromt<any>[], //TODO: DEFINIR INTERFAZ
    [DB_NAME.JIRA_SPACES]: OptionsPromt<string>[],
}

export class JsonIssuesCollection {
    private db: LowSync<Data>;

    constructor(dbPath: string) {
        const adapter = new JSONFileSync<Data>(dbPath);
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

    public async addJiraProject(project: JiraProject): Promise<void> {
        const exists = this.db.data[DB_NAME.JIRA_PROJECTS].some(prj => prj.value.id === project.id);
        if (!exists) {
            this.db.data[DB_NAME.JIRA_PROJECTS].push({
                name: project.name,
                value: project
            });
            await this.db.write();
        }
    }

    // public async addIssue(issue: OptionsPromt<FormattedIssue>): Promise<void> {
    //     this.db.data[DB_NAME.JIRA_PROJECTS].push(issue);
    //     await this.db.write();
    // }

    // public async BulkAddIssues(issues: OptionsPromt<FormattedIssue>[]): Promise<void> {
    //     this.db.data.issues.push(...issues);
    //     await this.db.write();
    // }

    // async getIssues(): Promise<OptionsPromt<FormattedIssue>[]> {
    //     return this.db.data.issues;
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