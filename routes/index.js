var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

/* GET video page. */
router.get('/listen', function(req, res, next) {
  res.render('player');
});

module.exports = router;
