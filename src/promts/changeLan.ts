import inquirer from "inquirer"
import { OptionsPromt } from "../helpers/interfaces.js"
import { setEnvKey } from "../helpers/envHandler.js"
import { ENV_KEY } from "../helpers/enum.js"
import { setGlobalStr } from "../helpers/textDictionary.js"
import { sInit_Mensaje } from "../helpers/initMessage.js"

export const changeLan = () =>  {
    inquirer.prompt([{
        type: 'confirm',
        name: 'changeLan',
        message: 'Do you want to change the language?',
    }]).then((answers) => {
        if (answers.changeLan) {
            inquirer.prompt([{
                type: 'list',
                name: 'language',
                message: 'Select a language',
                choices: lanChoices,
            }]).then((answers) => {
                console.log(`You selected ${answers.language.name}`)
                setEnvKey(ENV_KEY.LAN, answers.language.value)
                setGlobalStr()
                console.log(sInit_Mensaje())
            })
        } else {
            console.log('You selected not to change the language')
        }
    })
}   

const lanChoices:OptionsPromt<string>[] = [
    {name: 'English', value: 'EN'},
    {name: 'Español', value: 'ES'}
]