/**
 * Created by HanQi on 2017/3/27.
 */
'use strict';
var router = require('express').Router();
var AV = require('leanengine');

var Banner = AV.Object.extend('Banner');
var HotGoods = AV.Object.extend('HotGoods');
var Goods = AV.Object.extend('Goods');

router.post('/getBannerList', function(req, res, next) {

    var query = new AV.Query(Banner);
    query.find().then(function (results) {

        var data = [];

        for (var i = 0; i < results.length; i++) {

            var banner = {

                'id':results[i].get('objectId'),
                'linkType':results[i].get('linkType') == null ? '' : results[i].get('linkType'),
                'linkId':results[i].get('linkId') == null ? '' : results[i].get('linkId'),
                'linkUrl':results[i].get('linkUrl') == null ? '' : results[i].get('linkUrl'),
                'imageUrl':results[i].get('imageUrl') == null ? '' : results[i].get('imageUrl')

            };

            data.push(banner);

        }

        var wrap = {

            'code' : 200,
            'data' : data,
            'message' : ''

        };

        res.send(wrap);

    });

});

router.post('/getHotGoodsList', function(req, res, next) {

    var query = new AV.Query(HotGoods);
    query.include('goods');
    query.find().then(function (results) {

        var data = [];

        for (var i = 0; i < results.length; i++) {

            var temp = results[i].get('goods');

            var goods = {

                'id':temp.get('objectId'),
                'title':temp.get('name'),
                'price':temp.get('price'),
                'content':temp.get('content')

            };

            data.push(goods);

        }

        var wrap = {

            'code' : 200,
            'data' : data,
            'message' : ''

        };

        res.send(wrap);

    });

});

module.exports = router;