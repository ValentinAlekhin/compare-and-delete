const Cluster = require('cluster')

if (Cluster.isMaster) {
  const fs = require('fs-extra')
  const path = require('path')

  const numCPUs = require('os').cpus()

  const createWorkingList = require('./compare/createWorkingList/createWorkingList')
  const compareHandler = require('./compare/handler/handler')

  const compareAndDelete = (directory, options) =>
    new Promise(async (res, rej) => {
      const images = (await fs.readdir(directory)).map(img =>
        path.join(directory, img)
      )

      if (images.length === 1) return

      let data = { workingList: createWorkingList(images), deleteList: [] }

      let worksLength = data.workingList.length

      const forksNum = numCPUs > worksLength ? numCPUs : worksLength

      const sendMsgToWorker = worker => {
        if (!worksLength) return

        worksLength--

        worker.send(data.workingList.pop())
      }

      const createWorker = () => {
        if (!data.workingList.length) return

        worker = Cluster.fork()
        sendMsgToWorker(worker)
      }

      for (let i = 0; i < forksNum; i++) {
        createWorker()
      }

      Cluster.on('message', (worker, msg) => {
        const { status } = msg
        console.log(msg)
        if (status === 'error') {
          console.log(msg.error)
          rej(msg.error)
        }

        const { second, isSame } = msg.result

        if (isSame) {
          if (data.deleteList.find(el => el === second)) return
          data.deleteList.push(second)
        }

        console.log(data)

        if (!data.workingList.length) {
          for (var id in Cluster.workers) {
            Cluster.workers[id].kill()
          }

          res(data)
        }

        sendMsgToWorker(worker)
      })
    })

  const { imagesPath } = require('./test/setup')
  compareAndDelete(imagesPath).then(res => console.log(res))

  module.exports = compareAndDelete
} else {
  const compareImages = require('./compare/compareImages/compareImages')

  console.log(`[${process.pid}] Worker started`)

  process.on('message', async work => {
    try {
      const result = await compareImages(work)

      process.send({ status: 'success', result })
    } catch (e) {
      process.send({ status: 'error', error: e })
      process.kill(0)
    }
  })
}
