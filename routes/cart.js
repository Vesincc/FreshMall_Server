/**
 * Created by HanQi on 2017/3/31.
 */

var router = require('express').Router();
var AV = require('leanengine');

var Goods = AV.Object.extend('Goods');
var User = AV.Object.extend('_User');
var Cart = AV.Object.extend('ShopCart');

router.post('/getCart', function(req, res, next) {

    var uid = req.body.uid;

    var query = new AV.Query(User);
    query.get(uid).then(function (user) {

        var relation = user.relation('cart');
        var query = relation.query();
        query.include('goods');
        query.find().then(function (results) {

            var data = [];

            for (var i = 0; i < results.length; i++) {

                var tempGoods = results[i].get('goods');

                var temp = {

                    'cid':results[i].get('objectId'),
                    'gid':tempGoods.get('objectId'),
                    'content':tempGoods.get('content'),
                    'price':tempGoods.get('price'),
                    'number':results[i].get('number')

                };

                data.push(temp);

            }

            return data;

        }).then(function (data) {

            var wrap = {

                'code' : 200,
                'data' : data,
                'message' : ''

            };

            res.send(wrap);

        });

    });



});

router.post('/moveFromCart', function(req, res, next) {

    var cid = req.body.cid;
    var uid = req.body.uid;

    var query = new AV.Query(User);
    query.get(uid).then(function (user) {

        var relation = user.relation('cart');
        var query = relation.query();
        query.include('goods');
        query.find().then(function (results) {

            var flag = 0;

            for (var i = 0; i < results.length; i++) {

                var tempId = results[i].get('objectId');

                console.log(tempId == cid);

                if (tempId == cid) {

                    flag ++;

                }

            }

            if (flag != 0) {

                var query = new AV.Query(Cart);
                query.get(cid).then(function (cart) {

                    cart.destroy().then(function (success) {

                        var wrap = {

                            'code' : 200,
                            'data' : '',
                            'message' : '操作成功'

                        };

                        res.send(wrap);

                    }, function (error) {

                        var wrap = {

                            'code' : 102,
                            'data' : '',
                            'message' : '操作失败'

                        };

                        res.send(wrap);

                    });

                });



            } else {

                var wrap = {

                    'code' : 101,
                    'data' : '',
                    'message' : '没有该数据'

                };

                res.send(wrap);


            }



        });

    });

});

router.post('/changeNumber', function(req, res, next) {

    var cid = req.body.cid;
    var uid = req.body.uid;
    var number = req.body.number;

    var query = new AV.Query(User);
    query.get(uid).then(function (user) {

        var relation = user.relation('cart');
        var query = relation.query();
        query.include('goods');
        query.find().then(function (results) {

            var flag = 0;

            for (var i = 0; i < results.length; i++) {

                var tempId = results[i].get('objectId');

                console.log(tempId == cid);

                if (tempId == cid) {

                    flag ++;

                }

            }

            if (flag != 0) {

                var query = new AV.Query(Cart);
                query.get(cid).then(function (cart) {

                    cart.set('number', number);
                    cart.save().then(function (success) {

                        var wrap = {

                            'code' : 200,
                            'data' : '',
                            'message' : '操作成功'

                        };

                        res.send(wrap);

                    }, function (error) {

                        var wrap = {

                            'code' : 102,
                            'data' : '',
                            'message' : '操作失败'

                        };

                        res.send(wrap);

                    });

                });



            } else {

                var wrap = {

                    'code' : 101,
                    'data' : '',
                    'message' : '没有该数据'

                };

                res.send(wrap);


            }



        });

    });

});

router.post('/addToCart', function(req, res, next) {

    var uid = req.body.uid;
    var number = req.body.number;
    var gid = req.body.gid;

    var query = new AV.Query(User);
    query.get(uid).then(function (user) {

        var relation = user.relation('cart');
        var query = relation.query();
        query.include('goods');
        query.find().then(function (results) {

            var flag = 0;

            for (var i = 0; i < results.length; i++) {

                var goods = results[i].get('goods');
                var tempId = goods.get('objectId');

                if (tempId == gid) {

                    flag ++;

                }

            }


            if (flag == 0) {

                var cart = new Cart;

                var goods = AV.Object.createWithoutData('Goods', gid);

                cart.set('goods', goods);
                cart.set('number', number);

                cart.save().then(function (cart) {

                    relation.add(cart);
                    user.save().then(function (relation) {

                        var wrap = {

                            'code' : 200,
                            'data' : '',
                            'message' : '操作成功'

                        };

                        res.send(wrap);

                    }, function (error) {

                        console.log(error);

                    });

                });



            } else {

                var wrap = {

                    'code' : 101,
                    'data' : '',
                    'message' : '购物车中已存在该商品'

                };

                res.send(wrap);


            }


        });



    }, function (error) {

        var wrap = {

            'code' : 100,
            'data' : '',
            'message' : '未找到该用户'

        };

        res.send(wrap);

    });



});

module.exports = router;