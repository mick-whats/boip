const cli = require('cac')()
const { red, green } = require('kleur')
const Conf = require('conf')
const conf = new Conf()
const createAction = require('./createAction')
const configAction = require('./configAction')
const { DATA_DIR } = require('../src/settings')
const PG = require('../package')
/**
 * cliから呼び出すアクションの内容
 *
 * @param {Function} fn - アクション関数
 * @param {Object} options - cliオプション
 * @param {string} args - cliの引数
 * @example
 * _action(createAction, options, projectName)
 */
async function _action (fn, options, ...args) {
  try {
    const res = await fn(options, ...args)
    if (res) console.info(green(res))
    // process.exit(0)
  } catch (error) {
    if (options.debug) throw error

    console.error(red(error.message))
    // process.exit(1)
  }
}
cli
  .command('create [projectName]', 'create new project')
  .alias('new')
  .option('-o, --offline', 'use downloaded repository')
  .option('-r, --repository <repository>', 'Repository to use')
  .option('-n, --noject [temjectIgnore]', 'ignore template inject')
  .option('-d, --dry', 'dry-run')
  .option('-b, --debug', 'debug mode')
  .action(async (projectName, options) =>
    _action(createAction, options, projectName)
  )
cli
  .command('injections [key] [newValue]', 'inject key and value settings')
  .alias('in')
  .option('-b, --debug', 'debug mode')
  .action(async (k, v, options) =>
    _action(configAction, options, 'injections', k, v)
  )

cli.command('path', 'see config path').action(() => {
  console.info('config path: ', conf.path)
  console.info('data(repository cache) path: ', DATA_DIR)
})

cli.help()
cli.version(PG.version)
module.exports = cli
