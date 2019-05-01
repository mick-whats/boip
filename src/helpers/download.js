const path = require('path')
const dl = require('download-git-repo')
const errors = require('../errors')
const { DATA_DIR, REPO_NAME_RGX } = require('../settings')
function dlAsync (repo, dist) {
  return new Promise((resolve, reject) => {
    dl(repo, dist, err => {
      if (err) return reject(err)
      return resolve(dist)
    })
  })
}
/**
 * Githubからdownloadする
 * 保存ディレクトリはTMPDIRまたはユーザー指定場所.
 *
 * @param {string} repo
 * @return {Promise<string>}
 * @example
 * const res = await download('mick-whats/pg-mick')
 * console.log('download-directory:', res)
 *
 */
async function download (repo) {
  if (!REPO_NAME_RGX.test(repo)) {
    throw new Error(errors.repoNameInvalidFormat)
  } else {
    const _d = path.join(DATA_DIR, repo)
    const res = await dlAsync(repo, _d)
    return res
  }
}

module.exports = download
