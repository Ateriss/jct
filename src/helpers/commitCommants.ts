import { spawn } from 'child_process';
import { Commit } from './interfaces.js';
import { srtGlobal } from './textDictionary.js';


const runCommand = (command: string, args: string[]): Promise<string> => {
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
        } else {
          reject(new Error(`Command failed with code ${code}: ${errorOutput.trim()}`));
        }
      });
    });
  };

  const runGitCommand = (args: string[]): Promise<string> => {
    return runCommand('git', args);
  };

  const runGitCommit = (title: string, description: string | null): Promise<string> => {
    let commit = ['commit', '-m', title]
    if(description){
        commit.push('-m')
        commit.push(description)
    } 
    return runCommand('git', commit);
  };

  const runGitAdd = (): Promise<string> => {
    return runCommand('git', ['add', '.']);
  };

  const runGitStatus = (): Promise<string> => {
    return runCommand('git', ['status', '--porcelain']);
  };

  const runGitBranch = (): Promise<string> => {
    return runCommand('git', ['branch']);
  };

  const runGitCheckout = (branch: string, create: boolean = false): Promise<string> => {
    const args = ['checkout'];
    if (create) args.push('-b');
    args.push(branch);
    return runCommand('git', args);
  }

  const runGitLog = (): Promise<string> => {
    return runCommand('git', ['log', '-1', '--pretty=%B']);
  };


export const handleCommit = async (commitInfo:Commit) => {
    let title:string = commitInfo.title
    let description = commitInfo.mesasge
    let branchName = commitInfo.branch

    try {
      const status = await runGitStatus();
      if (!status) {
        console.log(srtGlobal.no_changes_for_commits);
        return;
      }

      const branches = (await runGitBranch()).split('\n').map(b => b.trim().replace('* ', ''));
      const branchExists = branches.includes(branchName);

      if (branchExists) {
        // La rama existe, hacer checkout
        await runGitCheckout(branchName);
      } else {
        // La rama no existe, crearla y hacer checkout
        await runGitCheckout(branchName, true);
      }

      await runGitAdd();
      await runGitCommit(title, description);

      const lastCommit = await runGitLog();
      console.log(srtGlobal.last_commit, lastCommit);
    } catch (error) {
        console.error(srtGlobal.commit_error, error);
    }

};