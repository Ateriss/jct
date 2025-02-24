import { __awaiter } from "tslib";
import { spawn } from 'child_process';
import { srtGlobal } from './textDictionary.js';
const runCommand = (command, args) => {
    return new Promise((resolve, reject) => {
        const child = spawn(command, args);
        let output = '';
        let errorOutput = '';
        child.stdout.on('data', (data) => {
            output += data.toString();
        });
        child.stderr.on('data', (data) => {
            errorOutput += data.toString();
        });
        child.on('close', (code) => {
            if (code === 0) {
                resolve(output.trim());
            }
            else {
                reject(new Error(`Command failed with code ${code}: ${errorOutput.trim()}`));
            }
        });
    });
};
const runGitCommand = (args) => {
    return runCommand('git', args);
};
const runGitCommit = (title, description) => {
    let commit = ['commit', '-m', title];
    if (description) {
        commit.push('-m');
        commit.push(description);
    }
    return runCommand('git', commit);
};
const runGitAdd = () => {
    return runCommand('git', ['add', '.']);
};
const runGitStatus = () => {
    return runCommand('git', ['status', '--porcelain']);
};
const runGitBranch = () => {
    return runCommand('git', ['branch']);
};
const runGitCheckout = (branch, create = false) => {
    const args = ['checkout'];
    if (create)
        args.push('-b');
    args.push(branch);
    return runCommand('git', args);
};
const runGitLog = () => {
    return runCommand('git', ['log', '-1', '--pretty=%B']);
};
export const handleCommit = (commitInfo) => __awaiter(void 0, void 0, void 0, function* () {
    let title = commitInfo.title;
    let description = commitInfo.mesasge;
    let branchName = commitInfo.branch;
    try {
        const status = yield runGitStatus();
        if (!status) {
            console.log(srtGlobal.no_changes_for_commits);
            return;
        }
        const branches = (yield runGitBranch()).split('\n').map(b => b.trim().replace('* ', ''));
        const branchExists = branches.includes(branchName);
        if (branchExists) {
            // La rama existe, hacer checkout
            yield runGitCheckout(branchName);
        }
        else {
            // La rama no existe, crearla y hacer checkout
            yield runGitCheckout(branchName, true);
        }
        yield runGitAdd();
        yield runGitCommit(title, description);
        const lastCommit = yield runGitLog();
        console.log(srtGlobal.last_commit, lastCommit);
    }
    catch (error) {
        console.error(srtGlobal.commit_error, error);
    }
});
