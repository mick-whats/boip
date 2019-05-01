const path = require('path')
const globby = require('globby')
const { DATA_DIR } = require('../settings')
/**
 * pickupFiles
 * 指定のdirectoryに含まれるfilePathをarrayで返す
 *
 * @param {string} dir - fileListを集めるdirectory
 * @return {Promise<Array>}
 * @example
 * const repoDir = path.join(DEFAULT_TMPDIR, 'mick-whats/pg-mick')
 * const res = await pickupFiles(repoDir)
 */
function pickupFiles (dir) {
  const _d = path.join(DATA_DIR, dir)
  return new Promise((resolve, reject) => {
    globby(_d, { expandDirectories: true, dot: true })
      .then(arr => {
        return resolve(arr)
      })
      .catch(reject)
  })
}

module.exports = pickupFiles
