const fs = require('fs')

/**
 * fs.readFileのpromise version
 * 指定fileが存在しない場合(ENOENT)はnullを返す
 *
 * @param {string} _path - filepath
 * @return {Promise<string>}
 * @example
 * const res = await readFile('./.gitignore')
 */
module.exports = function readFile (_path) {
  return new Promise((resolve, reject) => {
    fs.readFile(_path, 'utf8', (err, data) => {
      if (err) {
        if (err.code === 'ENOENT') resolve(null)
        reject(err)
      }
      resolve(data)
    })
  })
}
