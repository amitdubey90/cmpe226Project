var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/adminDashBoard', function(req, res, next) {
  res.send('adminDashBoard');
});

module.exports = router;
