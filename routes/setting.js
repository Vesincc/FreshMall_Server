/**
 * Created by HanQi on 2017/4/8.
 */
var router = require('express').Router();
var AV = require('leanengine');

var Goods = AV.Object.extend('Goods');
var User = AV.Object.extend('_User');
var Address = AV.Object.extend('Address');
var FeelBack = AV.Object.extend('FeelBack');

router.post('/getAddress', function(req, res, next) {

    var uid = req.body.uid;

    var query = new AV.Query(User);
    query.get(uid).then(function (user) {

        var relation = user.relation('address');
        var query = relation.query();
        query.find().then(function (results) {

            var data = [];

            for (var i = 0 ; i < results.length; i++) {

                var temp = {

                    'id' : results[i].get('objectId') == null ? '' : results[i].get('objectId'),
                    'name' : results[i].get('receiveName') == null ? '' : results[i].get('receiveName'),
                    'phone' : results[i].get('phoneNumber') == null ? '' : results[i].get('phoneNumber'),
                    'area' : results[i].get('chooseArea') == null ? '' : results[i].get('chooseArea'),
                    'detail' : results[i].get('detailAddress') == null ? '' : results[i].get('detailAddress'),
                    'isDefault' : results[i].get('isDefault') == null ? '' : results[i].get('isDefault')

                };

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

router.post('/getAddressDetail', function(req, res, next) {

    var uid = req.body.uid;
    var aid = req.body.aid;

    var query = new AV.Query(Address);
    query.get(aid).then(function (address) {

        var data = {

            'id' : address.get('objectId') == null ? '' : address.get('objectId'),
            'name' : address.get('receiveName') == null ? '' : address.get('receiveName'),
            'phone' : address.get('phoneNumber') == null ? '' : address.get('phoneNumber'),
            'area' : address.get('chooseArea') == null ? '' : address.get('chooseArea'),
            'detail' : address.get('detailAddress') == null ? '' : address.get('detailAddress'),
            'isDefault' : address.get('isDefault') == null ? '' : address.get('isDefault')

        }


        var wrap = {

            'code' : 200,
            'data' : data,
            'message' : ''

        };

        res.send(wrap);


    });


});

router.post('/setDefaultAddress', function(req, res, next) {

    var uid = req.body.uid;
    var aid = req.body.aid;

    var query = new AV.Query(User);
    query.get(uid).then(function (user) {

        var relation = user.relation('address');
        var query = relation.query();
        query.find().then(function (results) {

            var flag = 0;

            for (var i = 0; i < results.length; i++) {

                if (results[i].get('objectId') == aid) {

                    flag ++;

                }


            }

            if (flag == 0) {

                var wrap = {

                    'code' : 200,
                    'data' : '',
                    'message' : '未找到该地址'

                };

                res.send(wrap);

            } else {


                    for (var i = 0; i < results.length; i++) {

                        if (results[i].get('objectId') == aid) {

                            results[i].set('isDefault', '1');

                            results[i].save().then(function (success) {

                                for (var j = 0; j < results.length; j++) {

                                    if (results[j].get('isDefault') == '1' && results[j].get('objectId') != aid) {

                                        results[j].set('isDefault', '0');

                                        results[j].save().then(function (success) {

                                            var wrap = {

                                                'code': 200,
                                                'data': '',
                                                'message': '操作成功'

                                            };

                                            res.send(wrap);

                                        });

                                    }

                                }

                                var wrap = {

                                    'code': 200,
                                    'data': '',
                                    'message': '操作成功'

                                };

                                res.send(wrap);

                            });

                        }

                    }


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

router.post('/editAddress', function(req, res, next) {

    var aid = req.body.aid;
    var uid = req.body.uid;

    var name = req.body.name;
    var phone = req.body.phone;
    var area = req.body.area;
    var detailAddress = req.body.detailAddress;

    var query = new AV.Query(User);
    query.get(uid).then(function (user) {


        var relation = user.relation('address');
        var query = relation.query();
        query.find().then(function (results) {

            var flag = 0;

            for (var i = 0; i < results.length; i++) {

                if (results[i].get('objectId') == aid) {

                    flag ++;

                }

            }

            if (flag == 0) {

                var wrap = {

                    'code' : 103,
                    'data' : '',
                    'message' : '未找到地址'

                };

                res.send(wrap);

            } else {

                var query = new AV.Query(Address);
                query.get(aid).then(function (address) {

                    address.set('receiveName', name);
                    address.set('phoneNumber', phone);
                    address.set('chooseArea', area);
                    address.set('detailAddress', detailAddress);

                    address.save().then(function (success) {

                        var wrap = {

                            'code' : 200,
                            'data' : '',
                            'message' : '操作成功'

                        };

                        res.send(wrap);

                    });

                });



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

router.post('/delAddress', function(req, res, next) {

    var aid = req.body.aid;
    var uid = req.body.uid;

    var query = new AV.Query(User);
    query.get(uid).then(function (user) {

        var relation = user.relation('address');
        var query = relation.query();
        query.find().then(function (results) {

            var flag = 0;

            for (var i = 0; i < results.length; i++) {

                if (results[i].get('objectId') == aid) {

                    flag ++;

                }


            }

            if (flag == 0) {

                var wrap = {

                    'code' : 200,
                    'data' : '',
                    'message' : '未找到该地址'

                };

                res.send(wrap);

            } else {

                var query = new AV.Query(Address);
                query.get(aid).then(function (address) {

                    address.destroy().then(function (success) {

                        var wrap = {

                            'code' : 200,
                            'data' : '',
                            'message' : '操作成功'

                        };

                        res.send(wrap);

                    });

                });



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

router.post('/addAddress', function(req, res, next) {

    var uid = req.body.uid;

    var name = req.body.name;
    var phone = req.body.phone;
    var area = req.body.area;
    var detailAddress = req.body.detailAddress;

    var query = new AV.Query(User);
    query.get(uid).then(function (user) {

        var relation = user.relation('address');
        var query = relation.query();
        query.find().then(function (results) {

            var address = new Address();
            address.set('receiveName', name);
            address.set('phoneNumber', phone);
            address.set('chooseArea', area);
            address.set('detailAddress', detailAddress);
            address.set('isDefault', '0');

            address.save().then(function (address) {

                relation.add(address);
                user.save().then(function (success) {

                    var wrap = {

                        'code' : 200,
                        'data' : '',
                        'message' : '操作成功'

                    };

                    res.send(wrap);

                }, function (error) {

                    console.log(error);

                });

            }, function (error) {

                console.log(error);

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

router.post('/getDefaultAddress', function(req, res, next) {

    var uid = req.body.uid;

    var query = new AV.Query(User);
    query.get(uid).then(function (user) {

        var relation = user.relation('address');
        var query = relation.query();
        query.find().then(function (results) {

            if (results.length == 0) {

                var wrap = {

                    'code' : 106,
                    'data' : '',
                    'message' : '没有地址'

                };

                res.send(wrap);

            }

            var flag = 0;

            for (var i = 0; i < results.length; i++) {

                if (results[i].get('isDefault') == '1') {

                    flag ++;

                    var data = {

                        'id' : results[i].get('objectId') == null ? '' : results[i].get('objectId'),
                        'name' : results[i].get('receiveName') == null ? '' : results[i].get('receiveName'),
                        'phone' : results[i].get('phoneNumber') == null ? '' : results[i].get('phoneNumber'),
                        'area' : results[i].get('chooseArea') == null ? '' : results[i].get('chooseArea'),
                        'detail' : results[i].get('detailAddress') == null ? '' : results[i].get('detailAddress'),
                        'isDefault' : results[i].get('isDefault') == null ? '' : results[i].get('isDefault')

                    };

                    var wrap = {

                        'code' : 200,
                        'data' : data,
                        'message' : ''

                    };

                    res.send(wrap);

                }

            }

            if (flag == 0) {

                var data = {

                    'id' : results[0].get('objectId') == null ? '' : results[0].get('objectId'),
                    'name' : results[0].get('receiveName') == null ? '' : results[0].get('receiveName'),
                    'phone' : results[0].get('phoneNumber') == null ? '' : results[0].get('phoneNumber'),
                    'area' : results[0].get('chooseArea') == null ? '' : results[0].get('chooseArea'),
                    'detail' : results[0].get('detailAddress') == null ? '' : results[0].get('detailAddress'),
                    'isDefault' : results[0].get('isDefault') == null ? '' : results[0].get('isDefault')

                };

                var wrap = {

                    'code' : 200,
                    'data' : data,
                    'message' : ''

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

router.post('/changePassword', function(req, res, next) {

    var uid = req.body.uid;
    var oldPassword = req.body.oldPassword;
    var newPassword = req.body.newPassword;

    var query = new AV.Query(User);
    query.get(uid).then(function (user) {

        console.log(user.get('password'));

        if (user.get('password') == oldPassword) {

            user.set('password', newPassword);
            user.save().then(function (success) {

                var wrap = {

                    'code' : 200,
                    'data' : '',
                    'message' : '操作成功'

                };

                res.send(wrap);

            });

        } else {

            var wrap = {

                'code' : 200,
                'data' : '',
                'message' : '密码错误'

            };

            res.send(wrap);

        }

    }, function (error) {

        var wrap = {

            'code' : 100,
            'data' : '',
            'message' : '未找到该用户'

        };

        res.send(wrap);

    });

});

router.post('/feelBack', function(req, res, next) {

    var uid = req.body.uid;
    var content = req.body.content;

    var feelback = new FeelBack();
    feelback.set('uid', uid);
    feelback.set('content', content);
    feelback.save().then(function (success) {

        var wrap = {

            'code' : 200,
            'data' : '',
            'message' : '操作成功'

        };

        res.send(wrap);

    });


});

module.exports = router;