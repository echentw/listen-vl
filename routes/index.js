var express = require('express');
var router = express.Router();

/* GET search page. */
router.get('/', function(req, res, next) {
  res.render('search');
});

/* GET video page. */
router.get('/listen', function(req, res, next) {
  res.render('player');
});

module.exports = router;
