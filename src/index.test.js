const { isMaster } = require('cluster')

if (isMaster) {
  const fs = require('fs-extra')
  const path = require('path')

  const { imagesPath } = require('./test/setup')

  const compareAndDelete = require('./index')

  const [first, second] = fs
    .readdirSync(imagesPath)
    .map(img => path.join(imagesPath, img))

  const images = Array(100)
    .fill('')
    .map((_, i) => (i % 2 ? first : second))

  describe('Test compareAndDelete function:', () => {
    it('should return true', async () => {
      const res = await compareAndDelete(imagesPath)
      console.log(res)
    })
  })
}
