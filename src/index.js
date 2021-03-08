const Cluster = require('cluster')

if (Cluster.isMaster) {
  const fs = require('fs-extra')
  const path = require('path')

  const numCPUs = require('os').cpus()

  const createWorkingList = require('./compare/createWorkingList/createWorkingList')
  const compareHandler = require('./compare/handler/handler')

  const compareAndDelete = async (directory, options) => {
    const images = (await fs.readdir(directory)).map(img =>
      path.join(directory, img)
    )

    if (images.length === 1) return

    let data = { workingList: createWorkingList(images), deleteList: [] }

    const sendMsgToWorker = worker => worker.send(data.workingList[0])

    const createWorker = () => {
      if (!data.workingList.length) return

      worker = Cluster.fork()
      sendMsgToWorker(worker)
    }

    for (const _ of numCPUs) {
      createWorker()
    }

    Cluster.on('exit', (_, code) => {
      if (code === 1) {
        createWorker()
      }
    })

    Cluster.on('message', (worker, msg) => {
      const { status } = msg
      if (status === 'error') {
        console.log(msg.error)
        return
      }

      data = compareHandler(msg.result, data)

      if (!data.workingList) {
        for (var id in Cluster.workers) {
          Cluster.workers[id].kill()
        }

        return data
      }

      sendMsgToWorker(worker)
    })
  }

  const { imagesPath } = require('./test/setup')
  compareAndDelete(imagesPath).then(res => console.log(res))

  module.exports = compareAndDelete
} else {
  const compareImages = require('./compare/compareImages/compareImages')

  process.on('message', async work => {
    console.log('🚀 ~ file: index.js ~ line 69 ~ work', work)
    try {
      const result = await compareImages(work)

      process.send({ status: 'success', result })
    } catch (e) {
      process.send({ status: 'error', error: e })
      process.kill(0)
    }
  })
}
