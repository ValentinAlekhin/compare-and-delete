const { isMaster } = require('cluster')

if (isMaster) {
  const fs = require('fs-extra')
  const path = require('path')

  const createWorkingList = require('./compare/createWorkingList/createWorkingList')
  const compareImages = require('./compare/compareImages/compareImages')

  module.exports = async (directory, options) => {
    const images = (await fs.readdir(directory)).map(img =>
      path.join(directory, img)
    )

    const deleteList = []
    let workingList = createWorkingList(images)
  }
}
