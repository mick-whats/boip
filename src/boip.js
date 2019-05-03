const _ = require('xza').lodash
const path = require('path')
const globby = require('globby')
const minimatch = require('minimatch')
const ora = require('ora')
const temjectCopy = require('temject.copy')
const settings = require('./settings')
const errors = require('./errors')
const download = require('./helpers/download')
const pickupFiles = require('./helpers/pickupFiles')
const Con = require('./helpers/con')
/**
 * Boip
 */
class Boip {
  /**
   *Creates an instance of Boip.
   *
   * @param {string} projectName - new Project name
   * @param {Object} [opts={}] - options
   * @param {string} [opts.repoName=''] - "owner/repoName"
   * @param {boolean} [opts.forceDownLoad=false] - force download
   * @param {Array} [opts.temjectIgnore=undefined] - template inject ignore
   * @memberof Boip
   * @example
   * const boip = new Boip('newProject', repoName, opts)
   * await boip.init()
   * await boip.execute()
   */
  constructor (projectName, opts = {}) {
    if (!projectName) {
      throw new Error(errors.projectNameNotSet)
    }
    this.projectName = projectName
    this.projectDir = path.join(process.cwd(), projectName)
    this.injections = {
      name: projectName
    }
    this.opts = opts
  }
  set repoName (name) {
    if (name) {
      if (Boip.validateRepoName(name) !== true) {
        throw new Error(Boip.validateRepoName(name))
      }
    } else {
      throw new Error(errors.requiredRepoName)
    }
    this._repoName = name
  }
  get repoName () {
    return this._repoName
  }
  async init () {
    const isExistDirectory = await globby(this.projectName)
    if (isExistDirectory.length) {
      throw new Error(errors.existProject(this.projectName))
    }
    this.isExistDirectory = !!isExistDirectory.length
    let templatePaths = await pickupFiles(this.repoName)

    if (this.opts.forceDownLoad || !templatePaths.length) {
      const spinner = ora(`download ${this.repoName}`).start()
      try {
        await download(this.repoName)
        spinner.succeed()
      } catch (error) {
        spinner.fail()
        throw error
      }

      templatePaths = await pickupFiles(this.repoName)
    }
    this.templateDir = path.join(settings.DATA_DIR, this.repoName)
    if (!templatePaths.length) {
      throw new Error(errors.fileNotExist)
    }
    // TODO: 拡張子なしnoject対応test
    this.temjectIgnore = this.opts.temjectIgnore
      ? ['**/*.noject.*', '**/*.noject'].concat(
        _.flatten([this.opts.temjectIgnore]).map(str => {
          if (str.startsWith('*')) {
            return str
          } else {
            return `**/${str}`
          }
        })
      )
      : ['**/*.noject.*', '**/*.noject']

    const doubleUnderScoreFiles = templatePaths
      .filter(_path => {
        return /^__/.test(path.basename(_path))
      })
      .map(_path => path.basename(_path))
    const removeDoubleUnderScore = _path => {
      const basename = path.basename(_path)
      const replaceBasename = basename.replace(/^__/, '')
      return _path.replace(basename, replaceBasename)
    }
    const doubleUnderScoreReplaceFiles = doubleUnderScoreFiles.map(_path => {
      return removeDoubleUnderScore(_path)
    })
    this.paths = templatePaths
      .map(_path => {
        let basename = path.basename(_path)
        let plain = false
        if (doubleUnderScoreFiles.includes(basename)) {
          basename = basename.replace(/^__/, '')
        } else if (doubleUnderScoreReplaceFiles.includes(basename)) {
          basename = null
        }
        if (/\.noject\./.test(basename)) {
          basename = basename.replace(/\.noject\./, '.')
          plain = true
        }
        if (/\.ignore\.?/.test(basename)) {
          basename = null
        }
        let _newFilePath = _path.replace(this.templateDir, this.projectDir)
        _newFilePath = basename
          ? path.join(path.dirname(_newFilePath), basename)
          : null
        return !basename
          ? null
          : {
            templatePath: _path,
            newFilePath: _newFilePath,
            plain: plain
          }
      })
      .filter(o => o)
    const omitPlainPaths = this.paths
      .map(item => {
        return item.plain ? null : item.templatePath
      })
      .filter(v => v)
    this.expressions = await temjectCopy.expressionFiles(omitPlainPaths, {
      ignore: this.temjectIgnore
    })
    this.size = this.paths.length
  }

  requiredInjectKey () {
    const _keys = this.expressions.filter(key => {
      if (/^__/.test(key)) return false
      if (this.injections[key]) return false
      return true
    })
    const con = Con('injections')
    return _keys.map(key => {
      return {
        key,
        initial: con(key)
      }
    })
  }
  setInjectValue (key, value) {
    this.injections[key] = value
    const con = Con('injections')
    con(key, value)
  }
  async execute () {
    if (this.requiredInjectKey().length) {
      throw new Error(errors.unsetInjectValue)
    }
    for (let o of this.paths) {
      const spinner = ora(`create ${o.newFilePath}`).start()

      const plain = this.temjectIgnore
        ? this.temjectIgnore.some(item => {
          return minimatch(o.templatePath, item, { dot: true })
        }) || !!o.plain
        : false
      // const plain = this.temjectIgnore
      //   ? this.temjectIgnore.some(item => {
      //     return minimatch(o.templatePath, item, {dot: true})
      //   })
      //   : !!o.plain
      try {
        await temjectCopy.temjectCopy(
          o.templatePath,
          o.newFilePath,
          this.injections,
          {
            plain
          }
        )
        spinner.succeed()
      } catch (error) {
        spinner.fail()
        throw error
      }
    }
    return `created new Project: ${this.projectName}`
  }
  async dryRun () {
    if (this.requiredInjectKey().length) {
      throw new Error(errors.unsetInjectValue)
    }
    for (let o of this.paths) {
      const spinner = ora(`create ${o.newFilePath}`).start()
      spinner.info()
    }
    return 'try remove option "-d" or "--dry"'
  }
  static validateRepoName (repoName) {
    const RGX = /^[^:/]*\/[^:/]*$/
    return RGX.test(repoName) ? true : errors.repoNameInvalidFormat
  }
}

module.exports = Boip
