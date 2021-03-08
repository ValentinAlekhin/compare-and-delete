const createWorkingList = require('./createWorkingList')

const images = ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg']
const expectedResult = [
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

describe('Test createWorkingList:', () => {
  it('should return right result', () => {
    const result = createWorkingList(images)

    expect(result).toEqual(expectedResult)
  })
})
