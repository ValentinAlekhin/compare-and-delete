const { compare } = require('resemblejs')

const defaultOptions = {
  returnEarlyThreshold: 5,
}

module.exports = ({ first, second, options = defaultOptions }) =>
  new Promise((response, reject) => {
    options = { ...defaultOptions, ...options }

    compare(first, second, options, (err, data) => {
      if (err) {
        reject(err)
      } else {
        response({ first, second, ...data })
      }
    })
  })
