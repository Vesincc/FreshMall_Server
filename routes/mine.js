/**
 * Created by HanQi on 2017/4/12.
 */
var router = require('express').Router();
var AV = require('leanengine');

var Goods = AV.Object.extend('Goods');
var User = AV.Object.extend('_User');
var Order = AV.Object.extend('Order');

router.post('/mineShopInfo', function(req, res, next) {

    var uid = req.body.uid;

    var query = new AV.Query(User);
    query.get(uid).then(function (user) {

        var query = new AV.Query(Goods);
        query.equalTo('createdBy', user);
        query.find().then(function (allGoodsResults) {

            var query = new AV.Query(Order);
            query.equalTo('status', '2');  //待处理

            var query2 = new AV.Query(Order);
            query2.equalTo('suid', user);

            var query3 = AV.Query.and(query, query2);

            query3.find().then(function (pendingResults) {

                console.log(pendingResults);

                var query = new AV.Query(Order);
                query.equalTo('status', '3');  //配送中

                var query2 = new AV.Query(Order);
                query2.equalTo('suid', user);

                var query3 = AV.Query.and(query, query2);

                query3.find().then(function (sendResults) {

                    var query = new AV.Query(Order);
                    query.equalTo('status', '4');  //已完成

                    var query2 = new AV.Query(Order);
                    query2.equalTo('suid', user);

                    var query3 = AV.Query.and(query, query2);

                    query3.find().then(function (finishResults) {


                        var query = new AV.Query(Order);
                        query.equalTo('status', '5');  //退款 售后

                        var query2 = new AV.Query(Order);
                        query2.equalTo('suid', user);

                        var query3 = AV.Query.and(query, query2);

                        query3.find().then(function (backResults) {


                            var data = {

                                'allNumber' : allGoodsResults.length,
                                'penddingNumber' : pendingResults.length,
                                'penddedNumber' : sendResults.length + finishResults.length,
                                'backNumber' : backResults.length


                            };

                            var wrap = {

                                'code' : 200,
                                'data' : data,
                                'message' : ''

                            };

                            res.send(wrap);


                        });


                    });



                });



            });


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

router.post('/allGoods', function(req, res, next) {

    var uid = req.body.uid;

    var query = new AV.Query(User);
    query.get(uid).then(function (user) {

        var query = new AV.Query(Goods);
        query.equalTo('createdBy', user);
        query.find().then(function (results) {

            var data = [];

            for (var i = 0; i < results.length; i++) {

                var temp = results[i];

                var tempData = {

                    'id' : temp.get('objectId') == null ? '' : temp.get('objectId'),
                    'cover' : temp.get('topImage') == null ? '' : temp.get('topImage'),
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


    }, function (error) {

        var wrap = {

            'code' : 100,
            'data' : '',
            'message' : '未找到该用户'

        };

        res.send(wrap);

    });



});

router.post('/pendding', function(req, res, next) {

    var uid = req.body.uid;

    var query = new AV.Query(User);
    query.get(uid).then(function (user) {

        var query = new AV.Query(Order);
        query.equalTo('status', '2');  //待处理

        var query2 = new AV.Query(Order);
        query2.equalTo('suid', user);

        var query3 = AV.Query.and(query, query2);
        query3.include('goods');
        query3.find().then(function (results) {

            console.log(results);

            var data = [];

            for (var i = 0; i < results.length; i++) {

                var goods = results[i].get('goods');

                var time = results[i].get('createdAt');
                var date = new Date(time);
                var localeDateString = date.toLocaleDateString();
                var localeTimeString = date.toLocaleTimeString();
                var timeString = localeDateString + ' ' +localeTimeString;

                var temp = {

                    'oid' : results[i].get('objectId'),
                    'cover' : goods.get('topImage') == null ? '' : goods.get('topImage'),
                    'title': goods.get('name') == null ? '' : goods.get('name'),
                    'price' : goods.get('price') == null ? '' : goods.get('price'),
                    'time' : timeString

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



    }, function (error) {

        var wrap = {

            'code' : 100,
            'data' : '',
            'message' : '未找到该用户'

        };

        res.send(wrap);

    });


});

router.post('/pended', function(req, res, next) {

    var uid = req.body.uid;

    var query = new AV.Query(User);
    query.get(uid).then(function (user) {

        var query = new AV.Query(Order);
        query.equalTo('status', '3');  //配送中

        var query2 = new AV.Query(Order);
        query2.equalTo('suid', user);

        var query3 = AV.Query.and(query, query2);
        query3.include('goods');
        query3.find().then(function (results) {

            var query = new AV.Query(Order);
            query.equalTo('status', '4');  //已完成

            var query2 = new AV.Query(Order);
            query2.equalTo('suid', user);

            var query3 = AV.Query.and(query, query2);
            query3.include('goods');
            query3.find().then(function (results2) {


                var data = [];

                for (var i = 0; i < results.length; i++) {

                    var goods = results[i].get('goods');

                    var time = results[i].get('createdAt');
                    var date = new Date(time);
                    var localeDateString = date.toLocaleDateString();
                    var localeTimeString = date.toLocaleTimeString();
                    var timeString = localeDateString + ' ' +localeTimeString;

                    var temp = {

                        'oid' : results[i].get('objectId'),
                        'cover' : goods.get('topImage') == null ? '' : goods.get('topImage'),
                        'title': goods.get('name') == null ? '' : goods.get('name'),
                        'price' : goods.get('price') == null ? '' : goods.get('price'),
                        'time' : timeString,
                        'status' : results[i].get('status')

                    }

                    data.push(temp);

                }

                for (var i = 0; i < results2.length; i++) {

                    var goods = results2[i].get('goods');

                    var time = results2[i].get('createdAt');
                    var date = new Date(time);
                    var localeDateString = date.toLocaleDateString();
                    var localeTimeString = date.toLocaleTimeString();
                    var timeString = localeDateString + ' ' +localeTimeString;

                    var temp = {

                        'oid' : results2[i].get('objectId'),
                        'cover' : goods.get('topImage') == null ? '' : goods.get('topImage'),
                        'title': goods.get('name') == null ? '' : goods.get('name'),
                        'price' : goods.get('price') == null ? '' : goods.get('price'),
                        'time' : timeString,
                        'status' : results2[i].get('status')

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



    }, function (error) {

        var wrap = {

            'code' : 100,
            'data' : '',
            'message' : '未找到该用户'

        };

        res.send(wrap);

    });

});

router.post('/back', function(req, res, next) {

    var uid = req.body.uid;

    var query = new AV.Query(User);
    query.get(uid).then(function (user) {

        var query = new AV.Query(Order);
        query.equalTo('status', '5');  //退款 售后

        var query2 = new AV.Query(Order);
        query2.equalTo('suid', user);

        var query3 = AV.Query.and(query, query2);
        query3.include('goods');
        query3.find().then(function (results) {

            console.log(results);

            var data = [];

            for (var i = 0; i < results.length; i++) {

                var goods = results[i].get('goods');

                var time = results[i].get('createdAt');
                var date = new Date(time);
                var localeDateString = date.toLocaleDateString();
                var localeTimeString = date.toLocaleTimeString();
                var timeString = localeDateString + ' ' +localeTimeString;

                var temp = {

                    'oid' : results[i].get('objectId'),
                    'cover' : goods.get('topImage') == null ? '' : goods.get('topImage'),
                    'title': goods.get('name') == null ? '' : goods.get('name'),
                    'price' : goods.get('price') == null ? '' : goods.get('price'),
                    'time' : timeString

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



    }, function (error) {

        var wrap = {

            'code' : 100,
            'data' : '',
            'message' : '未找到该用户'

        };

        res.send(wrap);

    });

});

router.post('/willGet', function(req, res, next) {

    var uid = req.body.uid;

    var query = new AV.Query(User);
    query.get(uid).then(function (user) {

        var query = new AV.Query(Order);
        query.equalTo('status', '3');  //待收货3

        var query2 = new AV.Query(Order);
        query2.equalTo('uid', user);

        var query3 = AV.Query.and(query, query2);
        query3.include('goods');
        query3.find().then(function (results) {

            console.log(results);

            var data = [];

            for (var i = 0; i < results.length; i++) {

                var goods = results[i].get('goods');

                var time = results[i].get('createdAt');
                var date = new Date(time);
                var localeDateString = date.toLocaleDateString();
                var localeTimeString = date.toLocaleTimeString();
                var timeString = localeDateString + ' ' +localeTimeString;

                var temp = {

                    'oid' : results[i].get('objectId'),
                    'cover' : goods.get('topImage') == null ? '' : goods.get('topImage'),
                    'title': goods.get('name') == null ? '' : goods.get('name'),
                    'price' : goods.get('price') == null ? '' : goods.get('price'),
                    'time' : timeString

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



    }, function (error) {

        var wrap = {

            'code' : 100,
            'data' : '',
            'message' : '未找到该用户'

        };

        res.send(wrap);

    });

});

router.post('/comment', function(req, res, next) {

    var uid = req.body.uid;

    var query = new AV.Query(User);
    query.get(uid).then(function (user) {

        var query = new AV.Query(Order);
        query.equalTo('status', '4');  //待收货3

        var query2 = new AV.Query(Order);
        query2.equalTo('uid', user);

        var query3 = AV.Query.and(query, query2);
        query3.include('goods');
        query3.find().then(function (results) {

            var data = [];

            for (var i = 0; i < results.length; i++) {

                console.log(results[i].get('comment'));

                if (!results[i].get('comment')) {

                    var goods = results[i].get('goods');

                    var time = results[i].get('createdAt');
                    var date = new Date(time);
                    var localeDateString = date.toLocaleDateString();
                    var localeTimeString = date.toLocaleTimeString();
                    var timeString = localeDateString + ' ' +localeTimeString;

                    var temp = {

                        'oid' : results[i].get('objectId'),
                        'cover' : goods.get('topImage') == null ? '' : goods.get('topImage'),
                        'title': goods.get('name') == null ? '' : goods.get('name'),
                        'price' : goods.get('price') == null ? '' : goods.get('price'),
                        'time' : timeString

                    }

                    data.push(temp);

                }



            }

            var wrap = {

                'code' : 200,
                'data' : data,
                'message' : ''

            };

            res.send(wrap);

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

router.post('/addComment', function(req, res, next) {

    var oid = req.body.oid;
    var uid = req.body.uid;

    

});

router.post('/myOrder', function(req, res, next) {


});

router.post('/point', function(req, res, next) {


});

router.post('/attention', function(req, res, next) {


});

router.post('/history', function(req, res, next) {


});

module.exports = router;