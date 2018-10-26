const chai = require('chai')
const expect = chai.expect
const maze = require('../src/maze.js')
const helper = require('../src/helper.js')
const pathFinding = require('../src/pathfinding.js')

describe('generatePseudoRandomMaze', () => {
  it('generatePseudoRandomMaze() should generate a 2d array in dimensions equal to its function parameters', () => {
    const width = 28
    const height = 12
    const testMaze = maze.generatePseudoRandomMaze(width, height)
    expect(testMaze.length).to.equal(height)
    expect(testMaze[0].length).to.equal(width)
  })
})

describe('markStartAndFinish', () => {
  it('markStartAndFinish() should add a start and finish element to a grid when possible', () => {
    const unmarkedGrid = [
      [ 0, 0, 0, 1, 1, 1 ],
      [ 0, 0, 0, 1, 0, 1 ],
      [ 0, 0, 0, 0, 0, 1 ],
      [ 0, 0, 1, 1, 1, 1 ]
    ]
    const markedGrid = maze.markStartAndFinish(unmarkedGrid)
    const startAndFinish = helper.findStartAndFinish(markedGrid)
    expect(startAndFinish.start.x).to.not.equal(undefined)
    expect(startAndFinish.start.y).to.not.equal(undefined)
    expect(startAndFinish.finish.x).to.not.equal(undefined)
    expect(startAndFinish.finish.y).to.not.equal(undefined)
  })
})


describe('generateRecBacktrackerMaze', () => {
  it('generateRecBacktrackerMaze() should generate a recursive backtracker maze with the same dimensions as the function parameters', () => {
    const width = 8
    const height = 5
    const rbtMaze = maze.generateRecBacktrackerMaze(width, height)
    const rbtMazeWidth = rbtMaze[0].length - 1  // adjustfor walls
    const rbtMazeHeight = rbtMaze.length - 1    // adjust for walls
    expect(rbtMazeWidth).to.equal(width)
    expect(rbtMazeHeight).to.equal(height)
  })
})


describe('generateRecBacktrackerMaze', () => {
  it('generateRecBacktrackerMaze() should generate a recursive backtracker maze which is always solveable', () => {
    const width = 8
    const height = 5
    const rbtMaze = maze.generateRecBacktrackerMaze(width, height)
    const startAndFinish = helper.findStartAndFinish(rbtMaze)
    const pfGrid = new pathFinding.Grid(helper.sanitizeMatrix(rbtMaze))
    const finder = new pathFinding.AStarFinder()
    const path = finder.findPath(
      startAndFinish.start.x, startAndFinish.start.y,
      startAndFinish.finish.x, startAndFinish.finish.y, pfGrid)
    expect(path).to.not.equal(false)
  })
})
