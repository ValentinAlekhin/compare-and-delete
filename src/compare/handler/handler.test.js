const handler = require('./handler')

const defaultWorkingList = [
  { first: '1.jpg', second: '2.jpg' },
  { first: '1.jpg', second: '3.jpg' },
  { first: '1.jpg', second: '4.jpg' },
  { first: '1.jpg', second: '5.jpg' },
  { first: '2.jpg', second: '3.jpg' },
  { first: '2.jpg', second: '4.jpg' },
  { first: '2.jpg', second: '5.jpg' },
  { first: '3.jpg', second: '4.jpg' },
  { first: '3.jpg', second: '5.jpg' },
  { first: '4.jpg', second: '5.jpg' },
]

describe('Test handler function:', () => {
  const response = { first: '1.jpg', second: '4.jpg', isSameDimensions: true }

  it(`should remove ${response.second} from list and return new working & delete lists`, () => {
    const { workingList, deleteList } = handler(response, {
      workingList: defaultWorkingList,
      deleteList: [],
    })

    const res = workingList.find(
      ({ first, second }) =>
        second === response.second && first === response.second
    )

    expect(res).toBeUndefined()
    expect(deleteList).toEqual([response.second])
  })
})
