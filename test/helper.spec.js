const chai = require('chai')
const expect = chai.expect
const helper = require('../src/helper.js')

describe('findStartAndFinish', () => {
  it('findStartAndFinish() should find both the start and the finish and return its coordinates', () => {
    const expected = {
      start: { x: 2, y: 1 },
      finish: { x: 4, y: 3 },
    }
    let matrix = [
      [ 0, 0, 1, 1, 1 ],
      [ 0, 0, 0, 1, 1 ],
      [ 1, 0, 1, 1, 1 ],
      [ 1, 0, 0, 0, 0 ],
    ]
    matrix[expected.start.y][expected.start.x] = 's'
    matrix[expected.finish.y][expected.finish.x] = 'f'

    const startAndFinish = helper.findStartAndFinish(matrix)
    expect(startAndFinish.start.x).to.equal(expected.start.x)
    expect(startAndFinish.start.y).to.equal(expected.start.y)
    expect(startAndFinish.finish.x).to.equal(expected.finish.x)
    expect(startAndFinish.finish.y).to.equal(expected.finish.y)
  })

  it('findStartAndFinish() should find the start even without a finish defined and return its coordinates', () => {
    const expected = {
      start: { x: 2, y: 1 },
      finish: { x: undefined, y: undefined },
    }
    let matrix = [
      [ 0, 0, 1, 1, 1 ],
      [ 0, 0, 0, 1, 1 ],
      [ 1, 0, 1, 1, 1 ],
      [ 1, 0, 0, 0, 0 ],
    ]
    matrix[expected.start.y][expected.start.x] = 's'
    // We do not define a finish 

    const startAndFinish = helper.findStartAndFinish(matrix)
    expect(startAndFinish.start.x).to.equal(expected.start.x)
    expect(startAndFinish.start.y).to.equal(expected.start.y)
    expect(startAndFinish.finish.x).to.equal(expected.finish.x) // Should be undefined
    expect(startAndFinish.finish.y).to.equal(expected.finish.y) // Should be undefined

  })
  it('findStartAndFinish() should find the finish even without a start defined and return its coordinates', () => {
    const expected = {
      start: { x: undefined, y: undefined },
      finish: { x: 4, y: 3 },
    }
    let matrix = [
      [ 0, 0, 1, 1, 1 ],
      [ 0, 0, 0, 1, 1 ],
      [ 1, 0, 1, 1, 1 ],
      [ 1, 0, 0, 0, 0 ],
    ]
    // We do not define a start 
    matrix[expected.finish.y][expected.finish.x] = 'f'

    const startAndFinish = helper.findStartAndFinish(matrix)
    expect(startAndFinish.start.x).to.equal(expected.start.x) // Should be undefined
    expect(startAndFinish.start.y).to.equal(expected.start.y) // Should be undefined
    expect(startAndFinish.finish.x).to.equal(expected.finish.x)
    expect(startAndFinish.finish.y).to.equal(expected.finish.y)

  })
  it('findStartAndFinish() should return both coordinate pairs as undefined if there is no start and finish', () => {
    const expected = {
      start: { x: undefined, y: undefined },
      finish: { x: undefined, y: undefined },
    }
    let matrix = [
      [ 0, 0, 1, 1, 1 ],
      [ 0, 0, 0, 1, 1 ],
      [ 1, 0, 1, 1, 1 ],
      [ 1, 0, 0, 0, 0 ],
    ]
    // We do not define a start or finish 

    const startAndFinish = helper.findStartAndFinish(matrix)
    expect(startAndFinish.start.x).to.equal(expected.start.x)
    expect(startAndFinish.start.y).to.equal(expected.start.y)
    expect(startAndFinish.finish.x).to.equal(expected.finish.x)
    expect(startAndFinish.finish.y).to.equal(expected.finish.y)

  })
})


describe('sanitizeMatrix', () => {
  it('sanitizeMatrix() should remove any non "0" and "1" values', () => {
    const matrix = [
      [ 0, 1, -1, 0 ],
      [ 0, 1, 1, undefined ],
      [ 0, 1, 1, new Object() ],
      [ 0, 'hello', 2, 0 ]
    ]
    const expected = [
      [ 0, 1, 0, 0 ],
      [ 0, 1, 1, 0 ],
      [ 0, 1, 1, 0 ],
      [ 0, 0, 0, 0 ]
    ]
    expect(helper.sanitizeMatrix(matrix)).to.deep.equal(expected)
  })
})
