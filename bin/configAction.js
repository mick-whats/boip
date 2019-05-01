const Con = require('../src/helpers/con')

module.exports = (options, ...args) => {
  const [rootKey, key, newValue] = args
  if (key && key.toLowerCase() === 'name') {
    throw new Error('"Name" will be "project name" Can not be set')
  }
  const con = Con(rootKey)
  const res = con(key, newValue)
  if (typeof res === 'object') {
    return Object.keys(res)
      .map(key => `${key}: ${res[key]}`)
      .join('\n')
  }
  return res
}
