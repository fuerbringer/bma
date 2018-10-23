const presetGrids = require('./preset-grids.js')

const setStatus = options => {
  if(options.hasOwnProperty('startAndFinish')) {
    document.getElementById('stat-start').innerHTML
      = '`S(' + options.startAndFinish.start.x + ', ' + options.startAndFinish.start.y + ')`'
    document.getElementById('stat-end').innerHTML
      = '`F(' + options.startAndFinish.finish.x + ', ' + options.startAndFinish.finish.y + ')`'
  }
  if(options.hasOwnProperty('distance')) {
    if(options.distance > 0) {
      document.getElementById('stat-distance').innerHTML = '`'
        + options.distance
        + (options.distance == 1 ? '` Zelle' : '` Zellen')
    } else {
      document.getElementById('stat-distance').innerHTML = '`0` Zellen (Weg nicht möglich)'
    }
  }
  if(options.hasOwnProperty('algorithm')) {
    document.getElementById('stat-algorithm').innerHTML = options.algorithm
  }
  if(options.hasOwnProperty('elapsedTime')) {
    if(options.elapsedTime > 0) {
      document.getElementById('stat-elapsed-time').innerHTML = `\`${options.elapsedTime} ms\``
    } else {
      document.getElementById('stat-elapsed-time').innerHTML = '`< 0 ms`'
    }
  }
}

const addPresetGrids = selected => {
  let optionsObj = presetGrids; {
    optionsObj['recbacktracker'] = 'generator'
    optionsObj['random'] = 'generator'
  }
  const options = Object.entries(optionsObj)
  for(let [key, val] of options) {
    const option = document.createElement('option')
    option.setAttribute('value', key)
    if(val != 'generator') {
      option.appendChild(document.createTextNode(`${key} (Vorgefertigt *)`))
    } else {
      option.appendChild(document.createTextNode(`${key} (Generator)`))
    }
    if(selected == key) {
      option.setAttribute('selected', 'selected')
    } else if(!selected && key == 'recbacktracker') {
      option.setAttribute('selected', 'selected')
    }
    document.getElementById('controls-type').appendChild(option)
  }
}

const addAlgorithmTypes = selected => {
  const available = [
    'AStarFinder',
    'DijkstraFinder'
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

module.exports = {
  setStatus,
  addPresetGrids,
  addAlgorithmTypes
}
