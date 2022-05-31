import inquirer from 'inquirer'
import 'colors'
import { IMapboxFeature } from 'src/interfaces'

export const mainMenu = async (): Promise<string> => {
  const questions: inquirer.QuestionCollection<inquirer.Answers> = {
    type: 'list',
    name: 'option',
    message: 'Select an option:',
    choices: [
      {
        value: '1',
        name: `${'1.'.green} Search city`,
      },
      {
        value: '2',
        name: `${'2.'.green} History`,
      },
      {
        value: '0',
        name: `${'0.'.green} Exit`,
      },
    ],
  }

  console.log('==============================='.green)
  console.log('Weather CMD'.white)
  console.log('===============================\n'.green)

  const { option } = await inquirer.prompt(questions)

  return option
}

export const listPlaces = async (places: IMapboxFeature[]): Promise<string> => {
  const choices = places.map(({ id, place_name }, idx) => ({
    value: id,
    name: `${idx + 1}. `.blue + place_name,
  }))
  choices.unshift({
    value: '0',
    name: '0. '.blue + 'Cancel',
  })

  const questions: inquirer.QuestionCollection<inquirer.Answers> = {
    type: 'list',
    name: 'selectedPlace',
    message: 'Select one of the places showed:',
    choices,
  }

  const { selectedPlace } = await inquirer.prompt(questions)
  return selectedPlace
}

export const readInput = async (message: string): Promise<string> => {
  const questions: inquirer.QuestionCollection<inquirer.Answers> = {
    type: 'input',
    name: 'input',
    message,
    validate(value) {
      if (!value) throw 'Please type a city name.'
      return true
    },
  }

  const { input } = await inquirer.prompt(questions)
  return input
}

export const pause = async (): Promise<string> => {
  const questions: inquirer.QuestionCollection<inquirer.Answers> = {
    type: 'input',
    name: 'input',
    message: `Press ${'ENTER'.green} to continue.`,
  }

  const { input } = await inquirer.prompt(questions)
  return input
}
