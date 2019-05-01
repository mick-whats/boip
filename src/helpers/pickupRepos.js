const globby = require('globby')
const { DATA_DIR } = require('../settings')
/**
 * pickupRepos
 * 保存済のtemplateを集める
 *
 * @return {Promise<Array>}
 * @example
 * await pickupRepos()
 * // -> [ 'mick-whats/pg-mick', 'mick-whats/pg-mick#sample' ]
 */
function pickupFiles () {
  return new Promise((resolve, reject) => {
    globby(DATA_DIR, { expandDirectories: true })
      .then(arr => {
        arr = arr
          .map(p => {
            return p.replace(DATA_DIR, '').match(/^\/?(.*?\/.*?)\//)[1]
          })
          .filter((x, i, me) => me.indexOf(x) === i)
        return resolve(arr)
      })
      .catch(reject)
  })
}

module.exports = pickupFiles
