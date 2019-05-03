/* eslint-disable jsdoc/require-example */
const del = require('del')
const fs = require('fs')
const path = require('path')
const globby = require('globby')
const prompt = require('../prompt')
const Con = require('../../src/helpers/con')
const cli = require('../cli')
const createAction = require('../createAction')
const configAction = require('../configAction')
// const opts = {}
jest.mock('../prompt')
jest.mock('ora')

const projectName = 'testProjectName'
const repoName = 'mick-whats/bo#test'
// const repoName = 'mick-whats/bo#test_v1.0.0'

// eslint-disable-next-line jsdoc/require-example
// eslint-disable-next-line jsdoc/require-param
/**
 * cac.cli.parseを利用した実行test
 * 内部的にactionを呼び出して実行しているのでcli.js-_action()は使っていない
 *
 */
async function exec (args) {
  const opts = cli.parse(args, { run: false })
  const fn = (() => {
    switch (args[2]) {
      case 'create':
        return createAction
      case 'injections':
        opts.args.unshift('injections')
        return configAction
      default:
        throw new Error('Unknown command')
    }
  })()
  const res = await fn(opts.options, ...opts.args)
  return res
}

/**
 * 未使用
 * cli.parse(args)の終了を取得できないのでsetTimeoutで処理。その為に時間がかかる
 *
 * @param {*} args - cliに渡すoptions
 * @param {number} [timeOut=500] - 終了まで待機するミリ秒数
 * @returns {Promise} 処理結果
 */
function _exec (args, timeOut = 500) {
  return new Promise((resolve, reject) => {
    try {
      cli.parse(args)
      setTimeout(() => {
        resolve(0)
      }, timeOut)
    } catch (error) {
      return reject(error)
    }
  })
}
/**
 * 呼び出された回数を返す
 *
 * @returns {Object} mockが呼ばれた回数
 */
function getCalls () {
  return {
    projectName: prompt.inputProjectName.mock.calls.length,
    repoName: prompt.inputRepositoryName.mock.calls.length,
    injectKey: prompt.inputInjectKey.mock.calls.length,
    selectRepo: prompt.selectRepository.mock.calls.length,
    confirm: prompt.confirm.mock.calls.length
  }
}
/**
 * 変換前の値を確認
 *
 * @param {*} _path - 確認するファイルパス
 */
function assertBeforePlace (_path) {
  const sample = fs.readFileSync(_path, 'utf-8')
  expect(sample).toMatch('pascal: {{ text1 : pascal }}')
  expect(sample).toMatch('dot: {{text1 : dot}}')
  expect(sample).toMatch('path: {{text1:path}}')
  expect(sample).toMatch('header: {{ text1: header }}')
}
/**
 * 変換後の値を確認
 *
 * @param {*} _path - 確認するファイルパス
 */
function assertAfterPlace (_path) {
  const sample = fs.readFileSync(_path, 'utf-8')
  expect(sample).toMatch('pascal: HelloWorld')
  expect(sample).toMatch('dot: hello.world')
  expect(sample).toMatch('path: hello/world')
  expect(sample).toMatch('header: Hello-World')
}
beforeEach(async () => {
  const con = Con('injections')
  con('owner', 'mick-whats')
  con('text1', 'helloWorld')
  con('test1', 'delete')
  con('test2', 'delete')
  jest.clearAllMocks()
  prompt.inputProjectName.mockResolvedValue(projectName)
  prompt.inputRepositoryName.mockResolvedValue(repoName)
  prompt.selectRepository.mockResolvedValue(repoName)
  prompt.inputInjectKey.mockImplementation(key => {
    const obj = { owner: 'mick-whats', text1: 'helloWorld' }
    return Promise.resolve(obj[key])
  })
  prompt.confirm.mockResolvedValue(true)
  console.log('cwd: ', process.cwd())
  const _path = path.join(process.cwd(), 'testProjectName')
  await del([`${_path}/**`], { dot: true, onlyFiles: false })
})

test('injections', () => {
  const args = cli.parse(['node', 'boip', 'injections', 'key1', 'val1', '-d'], {
    run: false
  })
  expect(args).toEqual({
    args: ['key1', 'val1'],
    options: { '--': [], d: true }
  })
})
describe('real execute', () => {
  test('create projectName', async () => {
    const args = ['node', 'boip', 'create', projectName, '-r', repoName]
    const opts = cli.parse(args, { run: false })
    expect(opts).toEqual({
      args: ['testProjectName'],
      options: {
        '--': [],
        r: 'mick-whats/bo#test',
        repository: 'mick-whats/bo#test'
      }
    })
    const res = await exec(args)
    expect(res).toBe('created new Project: testProjectName')
    const files = await globby(['testProjectName/**/*'])
    expect(files).toEqual(
      expect.arrayContaining([
        'testProjectName/LICENSE',
        'testProjectName/README.md',
        'testProjectName/nojectSample.md',
        'testProjectName/package.json',
        'testProjectName/sample.md',
        'testProjectName/lib/index.js',
        'testProjectName/test/index.test.js'
      ])
    )
    assertAfterPlace('testProjectName/sample.md')
    assertBeforePlace('testProjectName/nojectSample.md')
    await expect(createAction(opts)).rejects.toThrow(
      'The project "testProjectName" already exists'
    )
  })
  test('noject', async () => {
    const args = [
      'node',
      'boip',
      'create',
      projectName,
      '-r',
      repoName,
      '--noject',
      'sample.md',
      '-o'
    ]
    const opts = cli.parse(args, { run: false })
    expect(opts).toEqual({
      args: ['testProjectName'],
      options: {
        '--': [],
        n: 'sample.md',
        noject: 'sample.md',
        o: true,
        offline: true,
        r: 'mick-whats/bo#test',
        repository: 'mick-whats/bo#test'
      }
    })
    const res = await exec(args)
    // console.log('res: ', res)
    expect(res).toBe('created new Project: testProjectName')
    const files = await globby(['testProjectName/**/*'])
    expect(files).toEqual(
      expect.arrayContaining([
        'testProjectName/LICENSE',
        'testProjectName/README.md',
        'testProjectName/nojectSample.md',
        'testProjectName/package.json',
        'testProjectName/sample.md',
        'testProjectName/lib/index.js',
        'testProjectName/test/index.test.js'
      ])
    )
    const sample = fs.readFileSync('testProjectName/sample.md', 'utf-8')
    expect(sample).toMatch('pascal: {{ text1 : pascal }}')
    expect(sample).toMatch('dot: {{text1 : dot}}')
    expect(sample).toMatch('path: {{text1:path}}')
    expect(sample).toMatch('header: {{ text1: header }}')
  })
})
describe('dry test', () => {
  test('create projectName', () => {
    const args = ['node', 'boip', 'create', projectName, '-r', repoName, '-od']
    const opts = cli.parse(args, { run: false })
    expect(opts).toEqual({
      args: ['testProjectName'],
      options: {
        '--': [],
        r: 'mick-whats/bo#test',
        o: true,
        d: true,
        repository: 'mick-whats/bo#test',
        offline: true,
        dry: true
      }
    })
  })
  test('create nothing projectName', () => {
    const args = ['node', 'boip', 'create', '-r', repoName, '-od']
    const opts = cli.parse(args, { run: false })
    expect(opts).toEqual({
      args: [],
      options: {
        '--': [],
        r: 'mick-whats/bo#test',
        o: true,
        d: true,
        repository: 'mick-whats/bo#test',
        offline: true,
        dry: true
      }
    })
  })
  test('create nothing projectName', async () => {
    const args = ['node', 'boip', 'create', '-r', repoName, '-od']
    const res = await exec(args)
    expect(res).toBe('try remove option "-d" or "--dry"')
    expect(getCalls()).toEqual({
      projectName: 1,
      repoName: 0,
      injectKey: 2,
      selectRepo: 0,
      confirm: 1
    })
  })
  test('create nothing repoName(prompt-> repoName)', async () => {
    const args = ['node', 'boip', 'create', projectName, '-od']
    prompt.selectRepository.mockResolvedValue(repoName)
    const res = await exec(args)
    expect(res).toBe('try remove option "-d" or "--dry"')
    // promptではまずselectRepoが呼ばれる
    expect(getCalls()).toEqual({
      projectName: 0,
      repoName: 0,
      injectKey: 2,
      selectRepo: 1,
      confirm: 1
    })
  })
  test('create nothing repoName(prompt-> false)', async () => {
    const args = ['node', 'boip', 'create', projectName, '-od']
    prompt.selectRepository.mockResolvedValue(false)
    const res = await exec(args)
    expect(res).toBe('try remove option "-d" or "--dry"')
    // promptではまずselectRepoが呼ばれて戻り値がfalsyならinputRepoが呼ばれる
    expect(getCalls()).toEqual({
      projectName: 0,
      repoName: 1,
      injectKey: 2,
      selectRepo: 1,
      confirm: 1
    })
  })
  test('confirm === false', async () => {
    const args = ['node', 'boip', 'create', projectName, '-od']
    prompt.confirm.mockResolvedValue(false)
    const res = await exec(args)
    expect(res).toBe('Come again')
  })
})
describe('create throws', () => {
  it('create nothing projectName', async () => {
    prompt.inputProjectName.mockResolvedValue(null)
    const args = ['node', 'boip', 'create', '-od']
    await expect(exec(args)).rejects.toThrow('required param "opts.name"')
  })
  it('invalidRepoName', async () => {
    const args = ['node', 'boip', 'create', '-r', 'invalidRepoName', '-od']
    await expect(exec(args)).rejects.toThrow(
      'Expected format of repository name is "owner/repo”'
    )
  })
  it('invalidRepoName', async () => {
    prompt.selectRepository.mockResolvedValue(null)
    prompt.inputRepositoryName.mockResolvedValue(null)
    const args = ['node', 'boip', 'create', '-od']
    await expect(exec(args)).rejects.toThrow('required param "opts.repository"')
  })
})

describe('command injections', () => {
  const conf = Con('injections')
  it('set get delete', async () => {
    let state = conf()
    expect(state.test1).toBeUndefined()

    // set
    let res = await exec(['node', 'boip', 'injections', 'test1', 'value1'])
    expect(res).toBeUndefined()
    res = await exec(['node', 'boip', 'injections', 'test2', 'value2'])
    expect(res).toBeUndefined()
    state = conf()
    expect(state.test1).toBe('value1')
    expect(state.test2).toBe('value2')
    // get
    res = await exec(['node', 'boip', 'injections', 'test1'])
    expect(res).toBe('value1')
    res = await exec(['node', 'boip', 'injections', 'test2'])
    expect(res).toBe('value2')
    // get all
    res = await exec(['node', 'boip', 'injections'])
    expect(res).toMatch('test1: value1')
    expect(res).toMatch('test2: value2')
    // delete
    res = await exec(['node', 'boip', 'injections', 'test1', 'delete'])
    res = await exec(['node', 'boip', 'injections', 'test2', 'delete'])
    state = conf()
    expect((() => state.test1)()).toBeUndefined()
    expect((() => state.test2)()).toBeUndefined()
  })
  it('throw', async () => {
    await expect(
      exec(['node', 'boip', 'injections', 'name', 'myName'])
    ).rejects.toThrow('"Name" will be "project name" Can not be set')
  })
})
describe('cli command execute', () => {
  it('injections', async () => {
    const spy = jest.spyOn(console, 'info')
    let cmd = ['node', 'boip', 'injections', 'test1']
    await _exec(cmd, 500)
    expect(spy).not.toHaveBeenCalled()
    cmd = ['node', 'boip', 'injections', 'test1', 'value1']
    await _exec(cmd, 500)
    cmd = ['node', 'boip', 'injections', 'test1']
    await _exec(cmd, 500)
    expect(spy).toHaveBeenCalled()
    expect(spy).toHaveBeenCalledWith(expect.stringMatching(/value1/))
    // delete
    spy.mockClear()
    cmd = ['node', 'boip', 'injections', 'test1', 'delete']
    await _exec(cmd, 500)
    cmd = ['node', 'boip', 'injections', 'test1']
    await _exec(cmd, 500)
    expect(spy).not.toHaveBeenCalled()
  })
  it('path', async () => {
    const spy = jest.spyOn(console, 'info')
    const cmd = ['node', 'boip', 'path']
    await _exec(cmd, 500)
    // console.log('spy: ', spy.mock)
    expect(spy).toHaveBeenCalledWith('config path: ', expect.any(String))
    expect(spy).toHaveBeenCalledWith(
      'data(repository cache) path: ',
      expect.any(String)
    )
  })
})
