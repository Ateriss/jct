import inquirer from 'inquirer';
import chalk from 'chalk';
import { OptionsPromt } from '../../helpers/interfaces.js';

//TODO: MIGRAR TODOS LOS INQUIRER COÑO

export async function promptList<T = string>(
  name: string,
  message: string,
  choices: OptionsPromt<T>[],
  defaultValue?: T
): Promise<T> {
  try{
  const resp = await inquirer.prompt([
    {
      name,
      type: 'list',
      message: chalk.cyan(message),
      choices,
      default: defaultValue,
      pageSize: 10,
    },
  ]);
  return resp[name];
  }catch(err){
    console.log(chalk.yellow("\n⚠️  Operación cancelada por el usuario."));

    return  null as unknown as T;
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


// export async function promptPaginatedList<T = string>(
//   name: string,
//   message: string,
//   fetchPage: (page: number) => Promise<{ choices: Choice<T>[]; hasNext: boolean; hasPrev: boolean }>,
//   startPage = 0
// ): Promise<T | null> {
//   let currentPage = startPage;

//   while (true) {
//     const { choices, hasNext, hasPrev } = await fetchPage(currentPage);

//     const extendedChoices = [
//       ...(hasPrev ? [{ name: '⬅️ Página anterior', value: '__prev' }] : []),
//       ...choices,
//       ...(hasNext ? [{ name: '➡️ Página siguiente', value: '__next' }] : []),
//       { name: '❌ Cancelar', value: '__cancel' },
//     ];

//     const resp = await promptList(name, `${message} (página ${currentPage + 1})`, extendedChoices);
//     if (resp === '__next') {
//       currentPage++;
//     } else if (resp === '__prev') {
//       currentPage--;
//     } else if (resp === '__cancel') {
//       return null;
//     } else {
//       return resp;
//     }
//   }
// }
