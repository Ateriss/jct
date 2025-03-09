import inquirer from "inquirer"

import { ENV_KEY } from "../helpers/enum"

import type { OptionsPromt } from "../helpers/interfaces"

import { setEnvKey } from "../helpers/envHandler"
import { setGlobalStr } from "../helpers/textDictionary"
import { sInit_Mensaje } from "../helpers/initMessage"

export const changeLan = () => {
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

const lanChoices: OptionsPromt<string>[] = [
    { name: 'English', value: 'EN' },
    { name: 'Español', value: 'ES' }
]
