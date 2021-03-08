const { compare } = require('resemblejs')

const defaultOptions = {
  returnEarlyThreshold: 1,
}

const compareImages = (work, options = defaultOptions) =>
  new Promise((response, reject) => {
    options = { ...defaultOptions, ...options }
    const { first, second } = work

    compare(first, second, options, (err, { rawMisMatchPercentage }) => {
      if (err) {
        reject(err)
      } else {
        response({
          ...work,
          isSame: rawMisMatchPercentage > 0.1 ? false : true,
        })
      }
    })
  })

module.exports = compareImages
