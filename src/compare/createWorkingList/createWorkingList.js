const createWorkingList = images => {
  const workingList = []

  images.forEach((first, i) =>
    images.forEach((second, j) => {
      if (j <= i) return
      workingList.push({ first, second })
    })
  )

  return workingList
}

module.exports = createWorkingList
