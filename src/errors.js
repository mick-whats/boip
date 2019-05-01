module.exports.projectNameNotSet = 'required param "opts.name"'
module.exports.repoNameInvalidFormat =
  'Expected format of repository name is "owner/repo”'
module.exports.requiredRepoName = 'required param "opts.repository"'
module.exports.unsetInjectValue = 'There is an unset injectValue'
module.exports.existProject = projectName =>
  `The project "${projectName}" already exists`
module.exports.fileNotExist = 'File does not exist in specified repository'
