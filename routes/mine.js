/**
 * Created by HanQi on 2017/4/12.
 */
var router = require('express').Router();
var AV = require('leanengine');

var Goods = AV.Object.extend('Goods');
var User = AV.Object.extend('_User');
var Order = AV.Object.extend('Order');
var Comment = AV.Object.extend('Comment');
var Attention = AV.Object.extend('Attention');
var History = AV.Object.extend('History');

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
                    'time' : timeString,
                    'status' : results[i].get('status')
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

router.post('/backForBuy', function(req, res, next) {

    var uid = req.body.uid;

    var query = new AV.Query(User);
    query.get(uid).then(function (user) {

        var query = new AV.Query(Order);
        query.equalTo('status', '5');  //退款 售后

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
                    'time' : timeString,
                    'status' : results[i].get('status')
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
    var content = req.body.content;
    var number = req.body.number;

    var query = new AV.Query(User);
    query.get(uid).then(function (user) {

        var query = new AV.Query(Order);
        query.include('goods');
        query.get(oid).then(function (order) {

            var comment = new Comment();
            comment.set('goods', order.get('goods'));
            comment.set('content', content);
            comment.set('number', number);
            comment.save().then(function (comment) {

                order.set('comment', comment);
                order.save().then(function (order) {

                    var wrap = {

                        'code' : 200,
                        'data' : '',
                        'message' : '操作成功'

                    };

                    res.send(wrap);

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

router.post('/myOrder', function(req, res, next) {

    var uid = req.body.uid;

    var query = new AV.Query(User);
    query.get(uid).then(function (user) {

        var query = new AV.Query(Order);
        query.equalTo('uid', user);

        query.include('goods');
        query.find().then(function (results) {

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

router.post('/attention', function(req, res, next) {

    var uid = req.body.uid;

    var query = new AV.Query(User);
    query.get(uid).then(function (user) {

        var relation = user.relation('attention');
        var query = relation.query();
        query.include('goods');
        query.find().then(function (results) {

            var data = [];

            for (var i = 0; i < results.length; i++) {

                var temp = results[i].get('goods');

                var tempData = {

                    'id' : results[i].get('objectId'),
                    'gid' : temp.get('objectId') == null ? '' : temp.get('objectId'),
                    'cover' : temp.get('topImage') == null ? '' : temp.get('topImage'),
                    'title': temp.get('name') == null ? '' : temp.get('name'),
                    'commentNumber' : temp.get('commentNumber') == null ? '0' : temp.get('commentNumber'),
                    'price' : temp.get('price') == null ? '' : temp.get('price'),
                    'likeCommentNumber' : temp.get('commentLikeNumber') == null ? '0' : temp.get('commentLikeNumber'),
                    'content' : temp.get('content') == null ? '' : temp.get('content')

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

router.post('/cancleAttention', function(req, res, next) {

    var uid = req.body.uid;
    var aid = req.body.aid;

    var query = new AV.Query(Attention);
    query.get(aid).then(function (attention) {

        attention.destroy().then(function (success) {

            var wrap = {

                'code' : 200,
                'data' : '',
                'message' : '操作成功'

            };

            res.send(wrap);

        });


    });


});

router.post('/clearAttention', function(req, res, next) {

    var uid = req.body.uid;

    var query = new AV.Query(User);
    query.get(uid).then(function (user) {

        var relation = user.relation('attention');
        var query = relation.query();
        query.find().then(function (results) {

            delAllData(results, 0, res);

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

router.post('/history', function(req, res, next) {


    var uid = req.body.uid;

    var query = new AV.Query(User);
    query.get(uid).then(function (user) {

        var relation = user.relation('history');
        var query = relation.query();
        query.include('goods');
        query.find().then(function (results) {

            var data = [];

            for (var i = 0; i < results.length; i++) {

                var temp = results[i].get('goods');

                var tempData = {

                    'id' : results[i].get('objectId'),
                    'gid' : temp.get('objectId') == null ? '' : temp.get('objectId'),
                    'cover' : temp.get('topImage') == null ? '' : temp.get('topImage'),
                    'title': temp.get('name') == null ? '' : temp.get('name'),
                    'commentNumber' : temp.get('commentNumber') == null ? '0' : temp.get('commentNumber'),
                    'price' : temp.get('price') == null ? '' : temp.get('price'),
                    'likeCommentNumber' : temp.get('commentLikeNumber') == null ? '0' : temp.get('commentLikeNumber'),
                    'content' : temp.get('content') == null ? '' : temp.get('content')

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

router.post('/clearHishtory', function(req, res, next) {

    var uid = req.body.uid;

    var query = new AV.Query(User);
    query.get(uid).then(function (user) {

        var relation = user.relation('history');
        var query = relation.query();
        query.find().then(function (results) {

            delAllData(results, 0, res);

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

router.post('/orderDetail', function(req, res, next) {

    var oid = req.body.oid;
    var uid = req.body.uid;

    var query = new AV.Query(Order);
    query.include('goods');
    query.get(oid).then(function (order) {

        var goods = order.get('goods');

        var time = goods.get('createdAt');
        var date = new Date(time);
        var localeDateString = date.toLocaleDateString();
        var localeTimeString = date.toLocaleTimeString();
        var timeString = localeDateString + ' ' +localeTimeString;



        var data = {

            'id' : order.get('objectId'),
            'gid' : goods.get('objectId'),
            'cover' : goods.get('topImage') == null ? '' : goods.get('topImage'),
            'title': goods.get('name') == null ? '' : goods.get('name'),
            'price' : goods.get('price') == null ? '' : goods.get('price'),
            'time' : timeString,
            'name' : order.get('recevieName'),
            'phone' : order.get('phone'),
            'area' : order.get('area'),
            'detailAddress' : order.get('detailAddress'),
            'transportId' : order.get('transportId'),
            'status' : order.get('status'),
            'backReason' : order.get('feelback')

        };

        var wrap = {

            'code' : 200,
            'data' : data,
            'message' : ''

        };

        res.send(wrap);

    });


});

router.post('/startSend', function(req, res, next) {

    var uid = req.body.uid;
    var oid = req.body.oid;
    var content = req.body.content;

    var query = new AV.Query(Order);
    query.get(oid).then(function (order) {

        order.set('status', '3');
        order.set('transportId', content);

        order.save().then(function (sucess) {

            var wrap = {

                'code' : 200,
                'data' : '',
                'message' : '操作成功'

            };

            res.send(wrap);

        });

    });


});  //运单号

router.post('/backFinish', function(req, res, next) {

    var uid = req.body.uid;
    var oid = req.body.oid;

    var query = new AV.Query(Order);
    query.get(oid).then(function (order) {

        order.set('status', '6');

        order.save().then(function (sucess) {

            var wrap = {

                'code' : 200,
                'data' : '',
                'message' : '操作成功'

            };

            res.send(wrap);

        });

    });

}); //金额计算

router.post('/sureGet', function(req, res, next) {

    var uid = req.body.uid;
    var oid = req.body.oid;

    var query = new AV.Query(Order);
    query.get(oid).then(function (order) {

        order.set('status', '4');

        order.save().then(function (sucess) {

            var wrap = {

                'code' : 200,
                'data' : '',
                'message' : '操作成功'

            };

            res.send(wrap);

        });

    });

});

router.post('/refund', function(req, res, next) {

    var uid = req.body.uid;
    var oid = req.body.oid;
    var content = req.body.content;

    var query = new AV.Query(Order);
    query.get(oid).then(function (order) {

        order.set('status', '5');
        order.set('feelback', content);

        order.save().then(function (sucess) {

            var wrap = {

                'code' : 200,
                'data' : '',
                'message' : '操作成功'

            };

            res.send(wrap);

        });

    });

});

module.exports = router;

function delAllData(all, index, res) {

    if (index >= all.length) {

        var wrap = {

            'code' : 200,
            'data' : '',
            'message' : '操作成功'

        };

        res.send(wrap);


    } else {

        var temp = all[index];

        temp.destroy().then(function (success) {

            delAllData(all, index+1, res);

        });


    }


}