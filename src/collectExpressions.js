const readfile = require('./helpers/readFile')
const { expressions } = require('temject')
/**
 * collectExpressions
 * paths(フルパスのstringが入ったArray)から
 * 中のtextを走査してexpressionsを集める
 *
 * @param {Array} paths
 * @return {Promise<Array>}
 * @example
 * const paths = await pickupFiles('mick-whats/pg-mick#sample')
 * const res = await collectExpressions(paths)
 * // -> [ '__year', 'owner', 'name' ]
 */
module.exports = function collectExpressions (paths) {
  return new Promise((resolve, reject) => {
    // TODO: 指定ファイルのexpを収集しないignore設定
    Promise.all(
      paths.map(p => {
        return readfile(p)
      })
    )
      .then(arr => {
        const str = arr.join()
        return resolve(expressions(str))
      })
      .catch(reject)
  })
}
