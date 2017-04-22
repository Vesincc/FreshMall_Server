/**
 * Created by HanQi on 2017/4/20.
 */
var router = require('express').Router();
var AV = require('leanengine');

var Goods = AV.Object.extend('Goods');

router.post('/', function(req, res, next) {


});

module.exports = router;