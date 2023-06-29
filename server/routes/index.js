var express = require('express');
var router = express.Router();
const baseControllor = require("../controller/baseControllor");
const pollControllor = require("../controller/pollControllor");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/register', baseControllor.register);
router.post('/login', baseControllor.login);
router.get("/pollList", pollControllor.pollList)

module.exports = router;
