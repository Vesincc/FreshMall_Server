/**
 * Created by HanQi on 2017/4/12.
 */

var router = require('express').Router();
var AV = require('leanengine');

var Goods = AV.Object.extend('Goods');

router.post('/goodsList', function(req, res, next) {


});

router.post('/goodsDetail', function(req, res, next) {


});

router.post('/attention', function(req, res, next) {


});

router.post('/delAttention', function(req, res, next) {


});

module.exports = router;