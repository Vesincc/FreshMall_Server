/**
 * Created by HanQi on 2017/5/31.
 */

var router = require('express').Router();
var AV = require('leanengine');

var Goods = AV.Object.extend('Goods');

router.post('/', function(req, res, next) {

    console.log('支付成功post');

});

router.get('/', function(req, res, next) {

    console.log('支付成功get');

});

module.exports = router;