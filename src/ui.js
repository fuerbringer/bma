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
  const available = config.selectedPathfinderNames
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
  let pfOperations = []
  let pfElapsedTimes = []
  let pfPathsStr = ''
  let pfOperationsStr = ''
  let pfElapsedTimesStr = ''
  let individualResults = []
  let individualResultsStrArr = []

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
    let runs = []
    for(let ip = 0; ip < paths.length; ip++) {
      const path = options.results[i].paths[ip]
      runs.push({
        pathFinder: path.pathFinder.name,
        pathLength: path.path.length,
        operations: path.performance.operations,
        elapsedTime: path.elapsedTime
      })
      if(pfPaths[path.pathFinder.name]) {
        pfPaths[path.pathFinder.name] += path.path.length
      } else {
        pfPaths[path.pathFinder.name] = path.path.length
      }
      if(pfOperations[path.pathFinder.name]) {
        pfOperations[path.pathFinder.name] += path.performance.operations
      } else {
        pfOperations[path.pathFinder.name] = path.performance.operations
      }
      if(pfElapsedTimes[path.pathFinder.name]) {
        pfElapsedTimes[path.pathFinder.name] += path.elapsedTime
      } else {
        pfElapsedTimes[path.pathFinder.name] = path.elapsedTime
      }
    }
    individualResults.push(runs)
  }

  for(let key in pfPaths) {
    let keyStr = key + ':'
    pfPathsStr += `${keyStr.padEnd(16, ' ')}\t${pfPaths[key]} Zellen\n`
  }
  for(let key in pfOperations) {
    let keyStr = key + ':'
    pfOperationsStr += `${keyStr.padEnd(16, ' ')}\t${pfOperations[key]} Operationen\n`
  }
  for(let key in pfElapsedTimes) {
    let keyStr = key + ':'
    pfElapsedTimesStr += `${keyStr.padEnd(16, ' ')}\t${pfElapsedTimes[key]} ms\n`
  }
  for(let i = 0; i < individualResults.length; i++) {
    let resultStr = []
    for(let p = 0; p < config.selectedPathfinders.length; p++) {
      if(individualResults[i].length) {
        const line = individualResults[i][p]
        resultStr.push({name:`${line.pathFinder}`, result: `${line.pathLength} Zellen, ${line.operations} Operationen, ${line.elapsedTime} ms`})
      } 
    }
    if(resultStr.length == 0) {
      resultStr = []
    }
    individualResultsStrArr.push(resultStr)
  }
  for(let i = 0; i < individualResultsStrArr.length; i++) {
    const line = individualResultsStrArr[i]
    const wrapper = document.createElement('div')
    wrapper.setAttribute('id', `grid-result-${i}`)
    const inner = document.createElement('pre')
    //inner.innerHTML = line.name + line.result
    for(let pf = 0; pf < line.length; pf++) {
      const span = document.createElement('span')
      span.style.color = config.grid.pathFinderColors[pf]
      span.innerHTML = `${line[pf].name}`
      const result = document.createElement('span')
      result.innerHTML = `: ${line[pf].result}`
      inner.appendChild(span)
      inner.appendChild(result)
      inner.appendChild(document.createElement('br'))
    }
    wrapper.appendChild(inner)
    if(i) {
      // Only display the first one, leave the rest to the ui buttons
      wrapper.style.display = 'none'
    }
    document.getElementById('grid-results').appendChild(wrapper)
  }

  document.getElementById('stat-count-runs').innerHTML = options.results.length
  document.getElementById('stat-grid-type').innerHTML = options.gridType
  document.getElementById('stat-total-distance').innerHTML = pfPathsStr
  document.getElementById('stat-total-operations').innerHTML = pfOperationsStr
  document.getElementById('stat-elapsed-times').innerHTML = pfElapsedTimesStr

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
    const currentResultStr = document.getElementById(`grid-result-${currentSlide}`)
    const nextResultStr = document.getElementById(`grid-result-${nextSlide}`)
    currentResultStr.style.display = 'none'
    nextResultStr.style.display = '' // unhide
  }

  // Inits ////////////////////////////////////////////////////////////
  document.getElementById('grid-slider-control').classList.toggle('d-none')

  for(let i = 1; i < containerChildren.length; i++) {
    containerChildren[i].style.display = 'none'
  }
  statusTotal.innerHTML = (containerChildren.length)
  statusCurrent.innerHTML = 1

  changeSlides(0, 0)

  // TODO Logic for +(total/10) elems arrows
  
  // Callbacks ////////////////////////////////////////////////////////////
  const callbackLeftClick = function() {
    const currentSlide = getCurrentSlide(leftButton, rightButton)
    const nextSlide = currentSlide - 1
    if(nextSlide >= 0) {
      container.setAttribute(containerSlideNrId, nextSlide)
      changeSlides(currentSlide, nextSlide)
      statusCurrent.innerHTML = (nextSlide + 1) 
    }
  }
  const callbackRightClick = function() {
    const currentSlide = getCurrentSlide(leftButton, rightButton)
    const nextSlide = currentSlide + 1
    if(nextSlide < container.childElementCount) {
      container.setAttribute(containerSlideNrId, nextSlide)
      changeSlides(currentSlide, nextSlide)
      statusCurrent.innerHTML = (nextSlide + 1) 
    }
  }
  document.getElementById(leftButton).addEventListener('click', callbackLeftClick)
  document.getElementById(rightButton).addEventListener('click', callbackRightClick)
  document.addEventListener("keypress", function(event) {
    switch(event.keyCode) {
      case 37: callbackLeftClick(); break;
      case 39: callbackRightClick(); break;
    }
  })
}

const handleCustomAlgoDemo = (dimensions, originalOptions, originalWaypoints, rawMatrixData) => {
  const submitFormDataNewWaypointsId = 'custom-selected-waypoints'
  const submitFormDataMatrixId = 'matrix-data-b64'
  const submitFormDataWaypointsId = 'matrix-data-original-waypoints'
  const submitFormId = 'custom-selected-waypoints-form'
  const selectedId = 'custom-selected-waypoint'

  if(originalOptions.algorithmType) {
    document.getElementById('custom-controls-algorithm').value = originalOptions.algorithmType
  }
  if(originalOptions.heuristic) {
    document.getElementById('custom-controls-heuristic').value = originalOptions.heuristic
  }
  if(originalOptions.diagonals) {
    document.getElementById('custom-controls-diagonal').value = originalOptions.diagonals
  }

  for(let y = 0; y < dimensions.height; y++) {
    for(let x = 0; x < dimensions.width; x++) {
      const gridBoxId = `coord-${y}-${x}`
      const gridBox = document.getElementById(gridBoxId)
      gridBox.addEventListener('click', function(e){
        const target = e.target
        if(target.getAttribute('data-type') === 'corridor') {
          const id = target.id
          const selected = document.getElementsByClassName(selectedId)
          if(id) {
            const submitForm = document.getElementById(submitFormId)
            submitForm.classList.add('d-none')
            if(target.getAttribute('fill') == config.grid.boxCustomWaypoint) {
              target.classList.toggle(selectedId)
              target.setAttribute('fill', config.grid.boxFill)
            } else {
              if(selected.length < 2) {
                // Keep amount of waypoints <= 2 (start and finish)
                target.setAttribute('fill', config.grid.boxCustomWaypoint)
                target.classList.toggle(selectedId)
              }
            }
          }
          if(selected.length === 2) {
            const currentlySelected = document.getElementsByClassName(selectedId)
            const submitForm = document.getElementById(submitFormId)
            submitForm.classList.remove('d-none')

            document.getElementById(submitFormDataMatrixId).value = rawMatrixData
            document.getElementById(submitFormDataWaypointsId).value = `${originalWaypoints.start.x}-${originalWaypoints.start.y}-${originalWaypoints.finish.x}-${originalWaypoints.finish.y}`

            for(let i = 0; i < currentlySelected.length && i < 2; i++) {
              const curr = currentlySelected[i]
              if(i) document.getElementById(submitFormDataNewWaypointsId).value += '-' + curr.getAttribute('data-x') + '-' + curr.getAttribute('data-y')
              else document.getElementById(submitFormDataNewWaypointsId).value += curr.getAttribute('data-x') + '-' + curr.getAttribute('data-y')
            }
          }
        }
      }, false );
    }
  }
}

module.exports = {
  setStatus,
  addPresetGrids,
  addAlgorithmTypes,
  addHeuristics,
  setComparisonResults,
  handleGridSlider,
  handleCustomAlgoDemo
}
