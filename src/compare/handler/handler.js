const handler = (result, data) => {
  const { first, second, isSame } = result
  const { workingList: oldWorkingList, deleteList: oldDeleteList } = data

  const response = {
    workingList: oldWorkingList.filter(
      work => first !== work.first || second !== work.second
    ),
    deleteList: [...oldDeleteList],
  }

  if (isSame) {
    response.workingList = response.workingList.filter(
      work => second !== work.second
    )
    response.deleteList.push(second)
  }

  return response
}

module.exports = handler
