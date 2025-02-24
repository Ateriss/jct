import { __awaiter } from "tslib";
import { JSONFileSync } from "lowdb/node";
import { LowSync } from 'lowdb';
export class JsonIssuesCollection {
    constructor(dbPath) {
        var _a;
        const adapter = new JSONFileSync(dbPath);
        this.db = new LowSync(adapter, { issues: [] });
        this.db.read();
        (_a = this.db).data || (_a.data = { issues: [] });
    }
    addIssue(issue) {
        return __awaiter(this, void 0, void 0, function* () {
            this.db.data.issues.push(issue);
            yield this.db.write();
        });
    }
    BulkAddIssues(issues) {
        return __awaiter(this, void 0, void 0, function* () {
            this.db.data.issues.push(...issues);
            yield this.db.write();
        });
    }
    getIssues() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.data.issues;
        });
    }
    findIssueByKey(key) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.data.issues.find(issue => issue.value.key === key);
        });
    }
    removeIssueByKey(key) {
        return __awaiter(this, void 0, void 0, function* () {
            this.db.data.issues = this.db.data.issues.filter(issue => issue.value.key !== key);
            yield this.db.write();
        });
    }
    removeAllIssues() {
        return __awaiter(this, void 0, void 0, function* () {
            this.db.data.issues = [];
            yield this.db.write();
        });
    }
    updateIssue(issue) {
        return __awaiter(this, void 0, void 0, function* () {
            const index = this.db.data.issues.findIndex(i => i.value.key === issue.value.key);
            if (index !== -1) {
                this.db.data.issues[index] = issue;
                yield this.db.write();
            }
        });
    }
}
