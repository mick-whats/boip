const os = require('os')
const prompts = require('prompts')
const pickupRepos = require('../src/helpers/pickupRepos')
const Boip = require('../src/boip')
const { cyan, bold } = require('kleur')

module.exports.selectRepository = function () {
  return new Promise(async (resolve, reject) => {
    const repos = await pickupRepos().catch(reject)
    const choices = repos.map(r => {
      return { title: r }
    })
    choices.push({ title: 'other' })
    let selectedRepository = await prompts({
      type: 'autocomplete',
      name: 'value',
      message: 'Pick github repository',
      choices: choices
    }).catch(reject)
    if (
      selectedRepository.value === 'other' ||
      selectedRepository.value == null
    ) {
      resolve(null)
    } else {
      resolve(selectedRepository.value)
    }
  })
}

module.exports.inputRepositoryName = function () {
  return new Promise(async (resolve, reject) => {
    const repoName = await prompts({
      type: 'text',
      name: 'value',
      message: 'please input github repository “owner/repo"',
      validate: Boip.validateRepoName
    }).catch(reject)
    resolve(repoName.value)
  })
}
module.exports.inputProjectName = async function () {
  try {
    const ProjectName = await prompts({
      type: 'text',
      name: 'value',
      message: 'please input new project name'
    })
    return ProjectName.value
  } catch (error) {
    throw error
  }
}
module.exports.inputInjectKey = async function (key, initial) {
  try {
    const res = await prompts({
      type: 'text',
      name: 'value',
      message: `What is the "${key}" injection value?`,
      initial: initial
    })
    return res.value
  } catch (error) {
    throw error
  }
}

module.exports.confirm = function (boip, dry) {
  return new Promise(async (resolve, reject) => {
    const messages = [
      '',
      `📁 New project directory: ${boip.projectDir}`,
      `📙 boilerplate: ${boip.repoName}`,
      `🖌️ injections: ${JSON.stringify(boip.injections, null, 2)}`,
      `📌 Number of new files: ${boip.size}`,
      `${bold().cyan('?')} Do you want to execute?`
    ]
    if (dry) {
      messages.unshift(
        `💡 ${cyan('This is dry-run. file will not be created')}`
      )
    }
    const repoName = await prompts({
      type: 'toggle',
      name: 'value',
      message: messages.join(os.EOL),
      initial: false,
      active: 'yes',
      inactive: 'no'
    }).catch(reject)
    resolve(repoName.value)
  })
}
