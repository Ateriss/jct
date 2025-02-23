import { JSONFileSync } from "lowdb/node";
import { LowSync } from 'lowdb';
import { FormattedIssue, OptionsPromt } from "../helpers/interfaces.js";

interface Data {
    issues: OptionsPromt<FormattedIssue>[];
}

export class JsonIssuesCollection {
    private db: LowSync<Data>;

    constructor(dbPath: string) {
        const adapter = new JSONFileSync<Data>(dbPath);
        this.db = new LowSync<Data>(adapter, { issues: [] });
        this.db.read();
        this.db.data ||= { issues: [] };
    }

    public async addIssue(issue: OptionsPromt<FormattedIssue>): Promise<void> {
        this.db.data.issues.push(issue);
        await this.db.write();
    }

    public async BulkAddIssues(issues: OptionsPromt<FormattedIssue>[]): Promise<void> {
        this.db.data.issues.push(...issues);
        await this.db.write();
    }

    async getIssues(): Promise<OptionsPromt<FormattedIssue>[]> {
        return this.db.data.issues;
    }

    async findIssueByKey(key: string): Promise<OptionsPromt<FormattedIssue> | undefined> {
        return this.db.data.issues.find(issue => issue.value.key === key);
    }

    async removeIssueByKey(key: string): Promise<void> {
        this.db.data.issues = this.db.data.issues.filter(issue => issue.value.key !== key);
        await this.db.write();
    }

    public async removeAllIssues(): Promise<void> {
        this.db.data.issues = [];
        await this.db.write();
    }

    async updateIssue(issue: OptionsPromt<FormattedIssue>): Promise<void> {
        const index = this.db.data.issues.findIndex(i => i.value.key === issue.value.key);
        if (index !== -1) {
            this.db.data.issues[index] = issue;
            await this.db.write();
        }
    }
}