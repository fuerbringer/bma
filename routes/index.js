var express = require('express')
var router = express.Router()

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'BMA' })
})

router.get('/pathfinder/a-star', function(req, res) {
  res.render('a-star', { title: 'A* Pathfinder', query: req.query })
})

router.get('/pathfinder/dijkstra', function(req, res) {
  res.render('dijkstra', { title: 'Dijkstra Pathfinder', query: req.query })
})

router.get('/credits', function(req, res) {
  res.render('credits', { title: 'Autoren' })
})

module.exports = router
