#!/usr/bin/env node

const cli = require('./cli')

cli.parse()
/*

// TODO: 各オプションテスト()
const cli = require('cac')()
const { red, green } = require('kleur')
const Conf = require('conf')
const conf = new Conf()
const newAction = require('./newAction')
const createAction = require('./createAction')
const configAction = require('./configAction')
const { DATA_DIR } = require('../src/settings')

async function action (fn, options) {
  try {
    const res = await fn(options)
    console.info(green(res))
    process.exit(0)
  } catch (error) {
    if (options.debug) throw error

    console.error(red(error.message))
    process.exit(1)
  }
}
async function _action (fn, options, ...args) {
  try {
    const res = await fn(options, ...args)
    if (res) console.info(green(res))
    process.exit(0)
  } catch (error) {
    if (options.debug) throw error

    console.error(red(error.message))
    process.exit(1)
  }
}

cli
  .command('injections [key] [newValue]', 'inject key and value settings')
  .alias('in')
  .option('-b, --debug', 'debug mode')
  .action(async (k, v, options) =>
    _action(configAction, {}, 'injections', k, v)
  )
// .action((k, v) => {
//   configAction('injections', k, v)
// })
cli
  .command('create', 'create new project')
  .alias('new')
  .option('-o, --offline', 'use downloaded repository')
  .option('-p, --project <project>', 'new project name')
  .option('-r, --repository <repository>', 'Repository to use')
  .option('-n, --noject [temjectIgnore]', 'ignore template inject')
  .option('-d, --dry', 'dry-run')
  .option('-b, --debug', 'debug mode')
  .action(async options => action(createAction, options))
// cli
//   .command('new <projectName>', 'build new project')
//   .option('-f, --forceDownLoad', 'Force download repository')
//   .option('-i, --temjectIgnore [temjectIgnore]', 'ignore template inject')
//   .action(async (projectName, options) => {
//     try {
//       const res = await newAction(projectName, options)
//       console.info(green(res))
//       process.exit(0)
//     } catch (error) {
//       console.error(red(error.message))
//       process.exit(1)
//     }
//   })

cli.command('path', 'see config path').action(() => {
  console.log('config path: ', conf.path)
  console.log('data(repository cache) path: ', DATA_DIR)
})
cli // TODO: 開発用
  .command('test', 'dev test')
  .option('--arr [...arr]', 'array test')
  .action(o => {
    // console.log('f: ', f)
    console.log('o: ', o)
  })
cli.help()
cli.version('0.0.1')
cli.parse()
*/
