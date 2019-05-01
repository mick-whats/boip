const readFile = require('../readFile')

/** @test {readFile} */
test('readFile', async () => {
  const res = await readFile('./.gitignore')
  expect(res).toMatch(/.DS_Store/)
})
/** @test {readFile} */
test('readFile unknown filepath', async () => {
  const res = await readFile('./hogehoge')
  expect(res).toBeNull()
})
