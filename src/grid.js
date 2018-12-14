const config = require('./config.js')
const helper = require('./helper.js')
const pathFinding = require('./pathfinding.js')

/**
 * Create SVG element to be used for grid / matrix
 */
document.createSvg = function(tagName) {
  const svgNS = 'http://www.w3.org/2000/svg'
  return this.createElementNS(svgNS, tagName)
}

/**
 * @param {Array} pathMatrix - 2d Matrix with start and finish
 * @param {String} polyId - HTML id of the element in which the svg grid is stored
 * @param {String} color - SVG color
 * @param {String} id - HTML id of the polyLine
 */
const drawVisualPath = (pathMatrix, polyId, color = config.grid.polyLineColor, id = 'main-grid', strokeWidth = 1) => {
  const svg = document.getElementById(id)
  const polyLine = document.createSvg('polyline')
  let points = ''
  for (let i = 0; i < pathMatrix.length; i++){
    if (pathMatrix[i] instanceof Array){
      if(pathMatrix[i].length == 2) {
        points += pathMatrix[i].join(',')
        points += ' '
      }
    }
  }
  polyLine.setAttribute('points', points)
  polyLine.setAttribute('fill', 'none')
  polyLine.setAttribute('stroke', color)
  polyLine.setAttribute('stroke-width', strokeWidth)
  polyLine.setAttribute('class', 'grid-path')
  if(polyId) {
    polyLine.setAttribute('id', polyId)
  }
  svg.appendChild(polyLine)
}


/**
 * Delete all paths. See drawVisualPath()
 */
const clearVisualPaths = () => {
  const polys = document.getElementsByClassName('grid-path')
  while(polys[0]) {
    polys[0].parentNode.removeChild(polys[0])
  }
}


/**
 * Given a rect#coord-N-N returns the parents <g> translate/transform x and y in an array
 * Example: [0, 16]
 * @param {String} id - HTML id of the element
 */
const getSvgBoxCoord = id => {
  // Assuming base element with id `id` has a parent with an attribute `transform`
  const translate = document.getElementById(id).parentNode.getAttribute('transform')
  const parts = /translate\(\s*([^\s,)]+)[ , ]([^\s,)]+)/.exec(translate)
  return [ parts[1], parts[2] ]
}


/**
 * Provides exact SVG pixel coordinates for a given box' <g> parent element
 * Example:
 *  let f(x) = x
 *  f(5) = x <=> getRealBoxCoords(5,5)
 *  Returns exact pixel coordinates for 5,5
 *
 * @param {Number} x - Cartesian x coordinate
 * @param {Number} y - Cartesian y coordinate
 */
const getRealBoxCoords = (x, y, centeringOffset = { x: 0, y: 0 }) => {
  const id = 'coord-' + x + '-' + y
  // Assuming base element with id `id` has a parent with an attribute `transform`
  const translate = document.getElementById(id).parentNode.getAttribute('transform')
  const parts = /translate\(\s*([^\s,)]+)[ , ]([^\s,)]+)/.exec(translate)
  return [ parseInt(parts[1]) + centeringOffset.x, parseInt(parts[2]) + centeringOffset.y ]
}


/**
 * Example:
 *  // Fills box at 1,1 with red color
 *  setRectAttribute(1, 1, "fill", "red");
 *
 * @param {Number} x - Point on the x axis (not pixel coordinate)
 * @param {Number} y - Point on the y axis (not pixel coordinate)
 * @param {String} name - attribute name (key)
 * @param {String} value - attribute value (val)
 */
const setRectAttribute = (x, y, name, value) => {
  const rect = document.getElementById('coord-' + x + '-' + y)
  rect.setAttribute(name, value)
}


/**
 * Resets all boxes in the coordinate system with class coord-rect to default
 * Example:
 *  // Set rect at 1,1 to filled red ...
 *  setRectAttribute(1, 1, "fill", "red");
 *  // And reset it again (the whole grid)
 *  resetAllCoordRects();
 */
const resetAllCoordRects = () => {
  const rects = document.getElementsByClassName('coord-rect')
  for(let i = 0; i < rects.length; i++) {
    rects[i].setAttribute('fill', config.grid.boxFill)
    rects[i].setAttribute('stroke', config.grid.boxStroke) 
    rects[i].setAttribute('stroke-width', config.grid.boxStrokeWidth) 
  }
}


/**
 * Resets rect at x,y to its initial state
 * @param {Number} x - Cartesian x coordinate
 * @param {Number} y - Cartesian y coordinate
 */
const resetCoordRect = (x, y) => {
  const rect = document.getElementById('coord-' + x + '-' + y)
  rect.setAttribute('fill', config.grid.boxFill)
  rect.setAttribute('stroke', config.grid.boxStroke) 
  rect.setAttribute('stroke-width', config.grid.boxStrokeWidth) 
}


/**
 * @param {Array} matrix - 2d array
 * @param {Number} size - Height / width attribute for inner boxes
 * @param {String} id - HTML id
 */
const generateGridFromMatrix = (matrix, size = 10, id) => {
  const gridId = id ? id : 'main-grid'
  const svg = document.createSvg('svg')
  svg.setAttribute('class', 'grid-generated')
  svg.setAttribute('id', gridId)
  svg.setAttribute('viewBox', [0, 0, matrix[0].length * size, matrix.length * size].join(' '))

  for(let y = 0; y < matrix.length; y++) {
    for(let x = 0; x < matrix[y].length; x++) {
      const boxId = 'coord-' + x + '-' + y
      const g = document.createSvg('g') // Group element we want to act as parent
      g.setAttribute('transform', [ 'translate(', x * size, ',', y * size, ')' ].join(''))

      // Create individual cell so we can display it and modify it later
      const box = document.createSvg('rect') 
      box.setAttribute('width', size)
      box.setAttribute('height', size)
      if(matrix[y][x] == 1) {
        box.setAttribute('fill', config.grid.boxFillWall)
        box.setAttribute('data-type', 'wall')
      } else if(matrix[y][x] == 's') {
        box.setAttribute('fill', config.grid.boxFillStart)
        box.setAttribute('data-type', 'start')
      } else if(matrix[y][x] == 'f') {
        box.setAttribute('fill', config.grid.boxFillFinish)
        box.setAttribute('data-type', 'finish')
      } else {
        box.setAttribute('fill', config.grid.boxFill)
        box.setAttribute('data-type', 'corridor')
      }
      box.setAttribute('id', boxId) 
      box.setAttribute('class', 'coord-rect')
      box.setAttribute('stroke', config.grid.boxStroke) 
      box.setAttribute('stroke-width', config.grid.boxStrokeWidth)
      box.setAttribute('data-x', x)
      box.setAttribute('data-y', y)
      g.appendChild(box)
      if(y == 0) {
        const txtForY = document.createSvg('text') 
        txtForY.setAttribute('x', 0)
        txtForY.setAttribute('y', size)
        txtForY.setAttribute('font-family', config.grid.textFontFamily)
        txtForY.setAttribute('font-size', config.grid.textFontSize)
        txtForY.setAttribute('fill', config.grid.textFontColor)
        txtForY.textContent = x
        g.appendChild(txtForY)
      } else if(x == 0) {
        const txtForX = document.createSvg('text') 
        txtForX.setAttribute('x', 0)
        txtForX.setAttribute('y', size)
        txtForX.setAttribute('font-family', config.grid.textFontFamily)
        txtForX.setAttribute('font-size', config.grid.textFontSize)
        txtForX.setAttribute('fill', config.grid.textFontColor)
        txtForX.textContent = y
        g.appendChild(txtForX)
      }
      svg.appendChild(g)
    }  
  }
  return svg
}


/**
 * @param {Array} cells - Array of cells (objects with {x, y}). Cells to be marked.
 */
const markCellHeuristics = (cells = []) => {
  for(let i = 0; i < cells.length; i++) {
    setRectAttribute(cells[i].x, cells[i].y, 'filter', config.grid.heuristicFilter)
    setRectAttribute(cells[i].x, cells[i].y, 'stroke-width', config.grid.heuristicStrokeWidth)
  }
}

/**
 * Undo cells marked as heuristically analyzed
 * See markCellHeuristics()
 * @param {Array} matrix - 2d matrix
 */
const unmarkCellHeuristics = (matrix = []) => {
  for(let y = 0; y < matrix.length; y++) {
    for(let x = 0; x < matrix[y].length; x++) {
      setRectAttribute(x, y, 'filter', '')
      setRectAttribute(x, y, 'stroke-width', config.grid.boxStrokeWidth)
    }
  }
}

const isGridSolvable = grid => {
  const startAndFinish = helper.findStartAndFinish(grid)
  const pfGrid = new pathFinding.Grid(helper.sanitizeMatrix(grid))
  const finder = new pathFinding.AStarFinder()
  const path = finder.findPath(
    startAndFinish.start.x, startAndFinish.start.y,
    startAndFinish.finish.x, startAndFinish.finish.y, pfGrid)
  return (path.length !== 0)
}

module.exports = {
  drawVisualPath,
  clearVisualPaths,
  getSvgBoxCoord,
  getRealBoxCoords,
  setRectAttribute,
  resetAllCoordRects,
  resetCoordRect,
  generateGridFromMatrix,
  markCellHeuristics,
  unmarkCellHeuristics,
  isGridSolvable
}
