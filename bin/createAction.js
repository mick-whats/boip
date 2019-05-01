const Boip = require('../src/boip')
const pickupRepos = require('../src/helpers/pickupRepos')
const prompt = require('./prompt')
const _ = require('xza').lodash

module.exports = async (options, projectName) => {
  let repository = options.repository
  const offLine = options.offline
  const boipOptions = {
    forceDownLoad: !offLine,
    temjectIgnore: options.noject ? _.flatten([options.noject]) : []
  }
  if (!projectName) {
    projectName = await prompt.inputProjectName()
  }
  const boip = new Boip(projectName, boipOptions)
  // repository
  // options.repositoryが無い(コマンドで指定していない)場合
  //  pickupReposが存在する -> select
  //  存在しない -> input
  //  pickupReposが存在するがother選択 -> input
  // options.repositoryが有る場合 -> 次へ

  if (repository) {
    const validateRepoName = Boip.validateRepoName(repository)
    if (validateRepoName !== true) {
      throw new Error(validateRepoName)
    }
  } else {
    const repositorys = await pickupRepos()
    if (repositorys.length) {
      repository = await prompt.selectRepository()
    }
    if (!repository) {
      repository = await prompt.inputRepositoryName()
    }
  }
  boip.repoName = repository
  await boip.init()

  // 必要なinject keyの入力を求める
  const requiredInjectKey = boip.requiredInjectKey()
  if (requiredInjectKey.length > 0) {
    for (const ex of requiredInjectKey) {
      const injectValue = await prompt.inputInjectKey(ex.key, ex.initial)
      boip.setInjectValue(ex.key, injectValue)
    }
  }
  const finalAnswer = await prompt.confirm(boip, options.dry)
  if (finalAnswer) {
    if (options.dry) {
      const res = await boip.dryRun()
      return res
    } else {
      const res = await boip.execute()
      return res
    }
  } else {
    // no execute
    return 'Come again'
  }
}
