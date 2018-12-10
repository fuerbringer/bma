const config = require('./config.js')
const grid = require('./grid.js')
const pathFinding = require('./pathfinding.js')
const presetGrids = require('./preset-grids.js')


/**
 * Update text status in the #stat-* elements
 * @param {Object} options - Object containing key->values for status
 */
const setStatus = options => {
  if(options.hasOwnProperty('startAndFinish')) {
    document.getElementById('stat-start').innerHTML
      = 'S(' + options.startAndFinish.start.x + ', ' + options.startAndFinish.start.y + ')'
    document.getElementById('stat-end').innerHTML
      = 'F(' + options.startAndFinish.finish.x + ', ' + options.startAndFinish.finish.y + ')'
  }
  if(options.hasOwnProperty('distance')) {
    if(options.distance > 0) {
      document.getElementById('stat-distance').innerHTML = options.distance + (options.distance == 1 ? ' Zelle' : ' Zellen')
    } else {
      document.getElementById('stat-distance').innerHTML = '0 Zellen (Weg nicht möglich)'
    }
  }
  if(options.hasOwnProperty('algorithm')) {
    document.getElementById('stat-algorithm').innerHTML = options.algorithm
    if(options.hasOwnProperty('heuristics')) {
      const heuristic = options.heuristics.charAt(0).toUpperCase() + options.heuristics.slice(1)
      document.getElementById('stat-algorithm').innerHTML += ` (${heuristic} Heuristik)`
    }
  }
  if(options.hasOwnProperty('operations')) {
    document.getElementById('stat-operations').innerHTML = options.operations >= 0 ? options.operations : '?'
  }
  if(options.hasOwnProperty('elapsedTime')) {
    if(options.elapsedTime > 0) {
      document.getElementById('stat-elapsed-time').innerHTML = `${options.elapsedTime} ms`
    } else {
      document.getElementById('stat-elapsed-time').innerHTML = '< 0 ms'
    }
  }
}


/**
 * Add preset grids as option to the select/dropdown field of grid generators
 * @param {String} selected - name of the already selected option
 */
const addPresetGrids = selected => {
  let optionsObj = presetGrids; {
    optionsObj['recbacktracker'] = 'generator'
    optionsObj['random'] = 'generator'
  }
  const options = Object.entries(optionsObj)
  for(let [key, val] of options) {
    const option = document.createElement('option')
    option.setAttribute('value', key)
    const keyTxt = key.charAt(0).toUpperCase() + key.slice(1)
    if(val != 'generator') {
      option.appendChild(document.createTextNode(`${keyTxt} (Vorgefertigt ²)`))
    } else {
      option.appendChild(document.createTextNode(`${keyTxt} (Generator)`))
    }
    if(selected == key) {
      option.setAttribute('selected', 'selected')
    } else if(!selected && key == 'recbacktracker') {
      option.setAttribute('selected', 'selected')
    }
    document.getElementById('controls-type').appendChild(option)
  }
}


/**
 * Add algorithm (pathfinder) types as option to the select/dropdown field of pathfinders
 * @param {String} selected - name of the already selected option
 */
const addAlgorithmTypes = selected => {
  const available = [
    'AStarFinder',
    'BestFirstFinder',
    'BreadthFirstFinder'
  ]
  for(let i = 0; i < available.length; i++) {
    const algo = available[i]
    const option = document.createElement('option')
    option.setAttribute('value', algo)
    option.appendChild(document.createTextNode(algo))
    if(selected == algo) {
      option.setAttribute('selected', 'selected')
    }
    document.getElementById('controls-algorithm').appendChild(option)
  }
}

/**
 * Append Heuristic methods provided by PathFinding.js as options to dropdown
 */
const addHeuristics = selected => {
  let heuristics = [ 'keine' ]
  for(let property in pathFinding.Heuristic) {
    if(property && pathFinding.Heuristic.hasOwnProperty(property)) {
      heuristics.push(property)
    }
  }
  for(let i = 0; i < heuristics.length; i++) {
    const heuristic = heuristics[i]
    const option = document.createElement('option')
    option.setAttribute('value', heuristic)
    option.appendChild(document.createTextNode(heuristic.charAt(0).toUpperCase() + heuristic.slice(1)))
    if(selected == heuristic) {
      option.setAttribute('selected', 'selected')
    }
    document.getElementById('controls-heuristic').appendChild(option)
  }
}


const setComparisonResults = (options = {}) => {
  let pfPaths = []
  let pfPathsStr = ''
  //let pfStr = ''
  for(let i = 0; i < options.pathFinders.length; i++) {
    const pfStr = options.pathFinders[i].name
    const pfTextParent = document.createElement('span')
    pfTextParent.style.color = config.grid.pathFinderColors[i]
    const pfText = document.createTextNode(pfStr)
    pfTextParent.appendChild(pfText)
    document.getElementById('stat-pathfinders').appendChild(pfTextParent)
    document.getElementById('stat-pathfinders').appendChild(document.createElement('br'))
  }
  for(let i = 0; i < options.results.length; i++) {
    const paths = options.results[i].paths
    for(let ip = 0; ip < paths.length; ip++) {
      const path = options.results[i].paths[ip]
      if(pfPaths[path.pathFinder.name]) {
        pfPaths[path.pathFinder.name] += path.path.length
      } else {
        pfPaths[path.pathFinder.name] = path.path.length
      }
    }
  }
  for(let key in pfPaths) {
    let keyStr = key + ':'
    pfPathsStr += `${keyStr.padEnd(16, ' ')}\t${pfPaths[key]} Zellen\n`
  }

  document.getElementById('stat-count-runs').innerHTML = options.results.length
  document.getElementById('stat-grid-type').innerHTML = options.gridType
  document.getElementById('stat-total-distance').innerHTML = pfPathsStr

  for(let ri = 0; ri < options.results.length; ri++) {
    const svgId = `comparison-${ri}`
    const container = document.getElementById('container')
    container.appendChild(grid.generateGridFromMatrix(options.results[ri].maze, 10, svgId))

    for(let pi = 0 /* pathIndex */; pi < options.results[ri].paths.length; pi++) {
      const path = options.results[ri].paths[pi].path
      let polyLine = []
      for(let i = 0; i < path.length; i++) {
        polyLine.push(grid.getRealBoxCoords(path[i][0], path[i][1], { x: 2 + pi, y: 2 + pi }))
      }
      grid.drawVisualPath(polyLine, `comparison-poly-${ri}`, config.grid.pathFinderColors[pi], svgId)
    }
  }
}


/**
 * UI code for the slider buttons on the comparison page
 * @param {String} leftButton - id of the left button
 * @param {String} rightButton - id of the right button
 */
const handleGridSlider = (leftButton, rightButton) => {
  const containerSlideNrId = 'data-slide'
  const containerId = 'container'
  const container = document.getElementById(containerId)
  const containerChildren = Array.from(container.children)
  const statusCurrent = document.getElementById('grid-status-current')
  const statusTotal = document.getElementById('grid-status-total')
  const getCurrentSlide = (leftButton, rightButton) => {
    const currentSlide = container.getAttribute(containerSlideNrId) ? container.getAttribute(containerSlideNrId) : 0
    if(!container.getAttribute(containerSlideNrId)) {
      container.setAttribute(containerSlideNrId, currentSlide)
    }
    return parseInt(currentSlide)
  }
  const changeSlides = (currentSlide, nextSlide) => {
    const current = document.getElementById(`comparison-${currentSlide}`)
    const next = document.getElementById(`comparison-${nextSlide}`)
    current.style.display = 'none'
    next.style.display = '' // unhide
  }

  // Inits ////////////////////////////////////////////////////////////
  document.getElementById('grid-slider-control').classList.toggle('d-none')

  for(let i = 1; i < containerChildren.length; i++) {
    containerChildren[i].style.display = 'none'
  }
  statusTotal.innerHTML = (containerChildren.length - 1)
  statusCurrent.innerHTML = 1

  changeSlides(0, 0)

  // TODO Logic for +(total/10) elems arrows
  
  // Callbacks ////////////////////////////////////////////////////////////
  document.getElementById(leftButton).addEventListener('click', function() {
    const currentSlide = getCurrentSlide(leftButton, rightButton)
    const nextSlide = currentSlide - 1
    if(nextSlide >= 0) {
      container.setAttribute(containerSlideNrId, nextSlide)
      changeSlides(currentSlide, nextSlide)
      statusCurrent.innerHTML = (nextSlide + 1) 
    }
  })
  document.getElementById(rightButton).addEventListener('click', function() {
    const currentSlide = getCurrentSlide(leftButton, rightButton)
    const nextSlide = currentSlide + 1
    if(nextSlide < container.childElementCount - 1) {
      container.setAttribute(containerSlideNrId, nextSlide)
      changeSlides(currentSlide, nextSlide)
      statusCurrent.innerHTML = (nextSlide + 1) 
    }
  })
}


module.exports = {
  setStatus,
  addPresetGrids,
  addAlgorithmTypes,
  addHeuristics,
  setComparisonResults,
  handleGridSlider
}
