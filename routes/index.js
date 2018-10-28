var express = require('express')
var router = express.Router()

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'BMA' })
})

router.get('/intro', function(req, res) {
  res.render('introduction', { title: 'Einführung in die Berufsmaturitätsarbeit' })
})

router.get('/pathfinder', function(req, res) {
  res.render('pathfinder', { title: 'Visualisierung der Pathfinder', query: req.query })
})

router.get('/comparison', function(req, res) {
  res.render('comparison', { title: 'Vergleich der pathfinder', query: req.query })
})

router.get('/credits', function(req, res) {
  res.render('credits', { title: 'Autoren' })
})

module.exports = router
