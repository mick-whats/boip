const download = require('../download')

test.skip('downloadtest', async () => {
  const res = await download('mick-whats/pg-mick#sample')
  // const res = await download('mick-whats/pg-mick#sample')
  console.log('download:', res)
  expect(res).toMatch(/boip-nodejs\/mick-whats\/pg-mick#jest$/)
})
test.skip('download test throw', async () => {
  return download('gitlab:mick-whats/pg-mick').catch(err => {
    expect(err.message).toBe('need the format "owner/repo"')
  })
})
test.skip('download test unknown', async () => {
  return download('mick-whats/hogehogenumberone').catch(err => {
    expect(err.message).toBe('Response code 404 (Not Found)')
    expect(err.statusCode).toBe(404)
  })
})
