/**
 * Created by HanQi on 2017/3/31.
 */

var router = require('express').Router();
var AV = require('leanengine');

var Goods = AV.Object.extend('Goods');
var User = AV.Object.extend('_User');
var Cart = AV.Object.extend('ShopCart');
var Order = AV.Object.extend('Order');

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
                    'title' : tempGoods.get('name'),
                    'cover' : tempGoods.get('topImage'),
                    'content':tempGoods.get('content'),
                    'price':tempGoods.get('price'),
                    'number':results[i].get('number'),
                    'isSelected' : results[i].get('isSelected')

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

router.post('/getAddress', function(req, res, next) {

    var uid = req.body.uid;

    var query = new AV.Query(User);
    query.get(uid).then(function (user) {

        var relation = user.relation('address');
        var query = relation.query();
        query.find().then(function (results) {



            for (var i = 0 ; i < results.length; i++) {

                if (results[i].get('isDefault') == '1') {

                    var temp = {

                        'id' : results[i].get('objectId') == null ? '' : results[i].get('objectId'),
                        'name' : results[i].get('receiveName') == null ? '' : results[i].get('receiveName'),
                        'phone' : results[i].get('phoneNumber') == null ? '' : results[i].get('phoneNumber'),
                        'area' : results[i].get('chooseArea') == null ? '' : results[i].get('chooseArea'),
                        'detail' : results[i].get('detailAddress') == null ? '' : results[i].get('detailAddress'),
                        'isDefault' : results[i].get('isDefault') == null ? '' : results[i].get('isDefault')

                    };

                    var wrap = {

                        'code' : 200,
                        'data' : temp,
                        'message' : ''

                    };

                    res.send(wrap);


                }



            }

            var i = results.length - 1;

            var temp = {

                'id' : results[i].get('objectId') == null ? '' : results[i].get('objectId'),
                'name' : results[i].get('receiveName') == null ? '' : results[i].get('receiveName'),
                'phone' : results[i].get('phoneNumber') == null ? '' : results[i].get('phoneNumber'),
                'area' : results[i].get('chooseArea') == null ? '' : results[i].get('chooseArea'),
                'detail' : results[i].get('detailAddress') == null ? '' : results[i].get('detailAddress'),
                'isDefault' : results[i].get('isDefault') == null ? '' : results[i].get('isDefault')

            };

            var wrap = {

                'code' : 200,
                'data' : temp,
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

router.post('/getGoods', function(req, res, next) {

    var gid = req.body.gid;
    var uid = req.body.uid;

    var query = new AV.Query(User);
    query.get(uid).then(function (user) {

        var query = new AV.Query(Goods);
        query.get(gid).then(function (result) {

            var data = {

                'id' : result.get('objectId'),
                'title' : result.get('name'),
                'content' : result.get('content'),
                'cover' : result.get('topImage'),
                'price' : result.get('price')

            };


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

                // console.log(tempId == cid);

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

                // console.log(tempId == cid);

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

router.post('/changeSelected', function(req, res, next) {

    var cid = req.body.cid;
    var uid = req.body.uid;
    var isSelected = req.body.isSelected;

    var query = new AV.Query(User);
    query.get(uid).then(function (user) {

        var relation = user.relation('cart');
        var query = relation.query();
        query.include('goods');
        query.find().then(function (results) {

            var flag = 0;

            for (var i = 0; i < results.length; i++) {

                var tempId = results[i].get('objectId');

                // console.log(tempId == cid);

                if (tempId == cid) {

                    flag ++;

                }

            }

            if (flag != 0) {

                var query = new AV.Query(Cart);
                query.get(cid).then(function (cart) {

                    cart.set('isSelected', isSelected);
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

router.post('/allPick', function(req, res, next) {

    var uid = req.body.uid;
    var type = req.body.type; //1:全选 0：全部取消

    var query = new AV.Query(User);
    query.get(uid).then(function (user) {

        var relation = user.relation('cart');
        var query = relation.query();
        query.include('goods');
        query.find().then(function (results) {

            allPick(results, 0, res, type);

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
//生成订单
router.post('/getOrder', function(req, res, next) {

    var uid = req.body.uid;

    var recevieName = req.body.recevieName;
    var phone = req.body.phone;
    var area = req.body.area;
    var detail = req.body.detailAddress;

    var type = req.body.type;    //type == 1 单件购买   其他 购物车购买
    var gid = req.body.gid;

    if (type == 1) {

        var query = new AV.Query(Goods);
        query.get(gid).then(function (goods) {

            var query = new AV.Query(User);
            query.get(uid).then(function (user) {

                var query = new AV.Query(User);
                query.get('58e091c6da2f60005fcd0fee').then(function (suser) {

                    var date = new Date();
                    var orderId = date.getTime()+'11'+parseInt(Math.random()*10)+parseInt(Math.random()*10)+parseInt(Math.random()*10)+parseInt(Math.random()*10);


                    var order = new Order();
                    order.set('number', '1');
                    order.set('phone', phone);
                    order.set('uid', user);
                    order.set('goods', goods);
                    order.set('recevieName', recevieName);
                    order.set('orderId', orderId);
                    order.set('suid', suser);
                    order.set('area', area);
                    order.set('status', '1');
                    order.set('detailAddress', detail);
                    order.save().then(function (success) {


                        var wrap = {

                            'code' : 200,
                            'data' : {

                                "orderId":orderId

                            },
                            'message' : ''

                        };

                        res.send(wrap);


                    });

                });


            });

        });


    } else {

        var query = new AV.Query(User);
        query.get(uid).then(function (user) {

            var query = new AV.Query(User);
            query.get('58e091c6da2f60005fcd0fee').then(function (suser) {


                var relation = user.relation('cart');
                var query = relation.query();
                query.equalTo('isSelected', '1');
                query.include('goods');
                query.find().then(function (results) {

                    var date = new Date();
                    var orderId = date.getTime()+'11'+parseInt(Math.random()*10)+parseInt(Math.random()*10)+parseInt(Math.random()*10)+parseInt(Math.random()*10);
                    cartToOrder(user, recevieName, orderId, phone, suser, area, detail, results, 0, function () {

                        delAllData(results, 0, function () {

                            var wrap = {

                                'code' : 200,
                                'data' : {

                                    'orderId':orderId

                                },
                                'message' : '操作成功'

                            };

                            res.send(wrap);

                        })


                    });


                });


            });



        });

    }

});

router.post('/paysuccess', function(req, res, next) {

    var uid = req.body.uid;
    var oid = req.body.oid;

    var query = new AV.Query(Order);
    query.equalTo('orderId', oid);
    query.find().then(function (results) {

        statusChange(results, 0, res, '2');

    });


});

module.exports = router;

function statusChange(all, index, res, type) {

    if (index >= all.length) {

        var wrap = {

            'code' : 200,
            'data' : '',
            'message' : '操作成功'

        };

        res.send(wrap);


    } else {

        var temp = all[index];

        temp.set('status', type);
        temp.save().then(function (temp) {

            statusChange(all, index+1, res, type);

        });


    }

}

function cartToOrder(user, recevieName, orderId, phone, suid ,area ,detail , all, index, callback) {

    if (index >= all.length) {

        callback();

    } else {

        var temp = all[index];

        var order = new Order();
        order.set('number', temp.get('number'));
        order.set('phone', phone);
        order.set('uid', user);
        order.set('goods', temp.get('goods'));
        order.set('recevieName', recevieName);
        order.set('orderId', orderId);
        order.set('suid', suid);
        order.set('area', area);
        order.set('status', '1');
        order.set('detailAddress', detail);
        order.save().then(function (success) {

            cartToOrder(user, recevieName, orderId, phone, suid, area, detail, all, index+1, callback);

        });

    }

}

function delAllData(all, index, callback) {

    if (index >= all.length) {

        callback();


    } else {

        var temp = all[index];

        temp.destroy().then(function (success) {

            delAllData(all, index+1, callback);

        });


    }


}

function allPick(all, index, res, type) {

    if (index >= all.length) {

        var wrap = {

            'code' : 200,
            'data' : '',
            'message' : '操作成功'

        };

        res.send(wrap);


    } else {

        var temp = all[index];

        temp.set('isSelected', type);
        temp.save().then(function (temp) {

            allPick(all, index+1, res, type);

        });


    }



}