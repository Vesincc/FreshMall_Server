/**
 * Created by HanQi on 2017/3/27.
 */
'use strict';
var router = require('express').Router();
var AV = require('leanengine');

var Banner = AV.Object.extend('Banner');
var HotGoods = AV.Object.extend('HotGoods');
var Goods = AV.Object.extend('Goods');
var HotItem = AV.Object.extend('HotItem');

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
                'content':temp.get('content'),
                'cover' : temp.get('topImage')

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

router.post('/search', function(req, res, next) {

    var keywords = req.body.keywords;

    // var priorityQuery = new AV.Query(Goods);
    // priorityQuery.contains('content',keywords);
    //
    // var statusQuery = new AV.Query(Goods);
    // priorityQuery.contains('name',keywords);
    //
    // var query = AV.Query.or(priorityQuery, statusQuery);
    // query.find().then(function (results) {
    //
    //     var data = [];
    //
    //     for (var i = 0; i < results.length; i++) {
    //
    //         var temp = results[i];
    //
    //         var tempData = {
    //
    //             'id' : temp.get('objectId') == null ? '' : temp.get('objectId'),
    //             'cover' : temp.get('topImage') == null ? '' : temp.get('topImage'),
    //             'content' : temp.get('content') == null ? '' : temp.get('content'),
    //             'title': temp.get('name') == null ? '' : temp.get('name'),
    //             'commentNumber' : temp.get('commentNumber') == null ? '0' : temp.get('commentNumber'),
    //             'price' : temp.get('price') == null ? '' : temp.get('price'),
    //             'likeCommentNumber' : temp.get('commentLikeNumber') == null ? '0' : temp.get('commentLikeNumber')
    //
    //
    //         }
    //
    //         data.push(tempData);
    //
    //     }
    //
    //     var wrap = {
    //
    //         'code' : 200,
    //         'data' : data,
    //         'message' : ''
    //
    //     };
    //
    //     res.send(wrap);
    //
    // });


    var query = new AV.Query(Goods);
    query.contains('name', keywords);
    query.find().then(function (results) {

        var data = [];

            for (var i = 0; i < results.length; i++) {

                var temp = results[i];

                var tempData = {

                    'id' : temp.get('objectId') == null ? '' : temp.get('objectId'),
                    'cover' : temp.get('topImage') == null ? '' : temp.get('topImage'),
                    'content' : temp.get('content') == null ? '' : temp.get('content'),
                    'title': temp.get('name') == null ? '' : temp.get('name'),
                    'commentNumber' : temp.get('commentNumber') == null ? '0' : temp.get('commentNumber'),
                    'price' : temp.get('price') == null ? '' : temp.get('price'),
                    'likeCommentNumber' : temp.get('commentLikeNumber') == null ? '0' : temp.get('commentLikeNumber')


                }

                data.push(tempData);

            }

            var wrap = {

                'code' : 200,
                'data' : data,
                'message' : ''

            };

            res.send(wrap);

    });



});

router.post('/searchhot', function(req, res, next) {

    var query = new AV.Query(HotItem);
    query.find().then(function (results) {

        var data = [];

        for (var i = 0; i < results.length; i++) {

            var temp = {

                'goodsName' : results[i].get('goodsName')

            }

            data.push(temp);

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