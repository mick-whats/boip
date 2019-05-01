// confのラッパークラス

const Conf = require('conf')
const conf = new Conf()

const _con = (rootKey, key, newValue) => {
  key = key ? `${rootKey}.${key}` : ''
  if (key && newValue) {
    if (newValue.toLowerCase() === 'delete') {
      // delete
      conf.delete(key)
    } else {
      // set
      conf.set(key, newValue)
    }
  } else if (key) {
    // get
    return conf.get(key)
  } else {
    // list
    return conf.get(rootKey)
  }
}
module.exports = root => _con.bind(null, root)
