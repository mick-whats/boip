const PJ = 'boip'
const envPaths = require('env-paths')
module.exports.DATA_DIR = envPaths(PJ).data
module.exports.REPO_NAME_RGX = /^[^:/]*\/[^:/]*$/
