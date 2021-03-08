const fs = require('fs-extra')
const path = require('path')

const { imagesPath } = require('../../test/setup')

const [first, second] = fs
  .readdirSync(imagesPath)
  .map(img => path.join(imagesPath, img))

const compareImages = require('./compareImages')

describe('Test compareImages function:', () => {
  it('should return true', async () => {
    const { isSame } = await compareImages({ first, second: first })

    expect(isSame).toBe(true)
  })

  it('should return false', async () => {
    const { isSame } = await compareImages({ first, second })

    expect(isSame).toBe(false)
  })
})
