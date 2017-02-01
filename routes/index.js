var express = require('express');
var router = express.Router();

var MobileDetect = require('mobile-detect');

/* GET search page. */
router.get('/', function(req, res, next) {
  res.render('search');
});

/* GET video page. */
router.get('/listen', function(req, res, next) {
  var mobileDetect = new MobileDetect(req.headers['user-agent']);
  if (mobileDetect.mobile()) {
    res.render('player', {mobile: true});
  } else {
    res.render('player', {mobile: false});
  }
});

module.exports = router;
