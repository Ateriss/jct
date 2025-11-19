import inquirer from 'inquirer';
import chalk from 'chalk';
import { OptionsPromt } from '../../helpers/interfaces.js';


export async function promptList<T = string>(
  name: string,
  message: string,
  choices: OptionsPromt<T>[],
  defaultValue?: T
): Promise<OptionsPromt<T> | null | string> {
  try {
    const resp = await inquirer.prompt([
      {
        name,
        type: "list",
        message: chalk.cyan(message),
        choices,
        default: defaultValue,
        pageSize: 10,
      },
    ]);

    return resp[name] as OptionsPromt<T>;
  } catch (err) {
    console.log(chalk.yellow("\n⚠️  Operación cancelada por el usuario."));
    return null;
  }
}



export async function promptConfirm(
  message: string,
  defaultValue = false
): Promise<boolean> {
  const resp = await inquirer.prompt([
    {
      name: 'confirm',
      type: 'confirm',
      message: chalk.yellow(message),
      default: defaultValue,
    },
  ]);
  return resp.confirm;
}

export async function promptPassword(
  message: string
): Promise<string | null> {
  try {
    const resp = await inquirer.prompt([
      {
        name: "password",
        type: "password",
        mask: "*",
        message: chalk.magenta(message),
        validate: (val: string) => val.trim().length > 0 ,
      },
    ]);

    return resp.password as string;
  } catch {
    console.log(chalk.yellow("\n⚠️  Operación cancelada por el usuario."));
    return null;
  }
}


export async function promptInput(
  message:string,
  defaultValue?:string,
  validator?: (input: string) => true | string
): Promise<string | null> {
  try {
    const resp = await inquirer.prompt([
      {
        name: "input",
        type: "input",
        message: chalk.green(message),
        default: defaultValue,
        validate: (val: string) => {
          if (validator) return validator(val);
          return val.trim().length > 0 ;
        },
      },
    ]);

    return resp.input as string;
  } catch {
    console.log(chalk.yellow("\n⚠️  Operación cancelada por el usuario."));
    return null;
  }
}


