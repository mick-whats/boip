class Factory {
  constructor (text) {
    this.text = text
  }
  start () {
    return this
  }

  succeed () {
    return this
  }

  fail () {
    return this
  }
  info () {
    return this
  }
}

module.exports = jest.fn(text => new Factory(text))
