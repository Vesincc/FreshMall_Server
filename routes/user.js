/**
 * Created by HanQi on 2017/4/6.
 */


var router = require('express').Router();
var AV = require('leanengine');

var User = AV.Object.extend('_User');

router.post('/getUserInfo', function(req, res, next) {

    var uid = req.body.uid;

    var query = new AV.Query(User);
    query.get(uid).then(function (user) {

        var data = {

            'uid':user.get('objectId'),
            'cover':user.get('imageUrl') == null ? '' : user.get('imageUrl'),
            'money':user.get('accountMoney') == null ? '0' : user.get('accountMoney'),
            'nickname':user.get('nickname') == null ? '' : user.get('nickname'),
            'realname':user.get('username') == null ? '' : user.get('username'),
            'sex':user.get('sex') == null ? '0' : user.get('sex'),
            'age':user.get('age') == null ? '0' : user.get('age'),
            'point':user.get('point') == null ? '0' : user.get('point')

        };

        var wrap = {

            'code' : 200,
            'data' : data,
            'message' : ''

        };

        res.send(wrap);


    }, function (error) {

        var wrap = {

            'code' : 100,
            'data' : '',
            'message' : '未找到该用户'

        };

        res.send(wrap);

    });

});

router.post('/saveUserInfo', function(req, res, next) {

    var uid = req.body.uid;
    var nickname = req.body.nickname;
    var realname = req.body.realname;
    var sex = req.body.sex;
    var age = req.body.age;

    console.log(nickname);
    console.log(realname);
    console.log(sex);
    console.log(age);

    var query = new AV.Query(User);
    query.get(uid).then(function (user) {

        user.set('nickname', nickname);
        user.set('username', realname);
        user.set('sex', sex);
        user.set('age', age);

        user.save().then(function (result) {

            var wrap = {

                'code' : 200,
                'data' : '',
                'message' : '保存成功'

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

router.post('/login', function(req, res, next) {

    var phone = req.body.phone;
    var psw = req.body.psw;

    var query = new AV.Query(User);
    query.equalTo('phone', phone);
    query.find().then(function (results) {

        if (results.length == 0) {

            var wrap = {

                'code' : 101,
                'data' : '',
                'message' : '该用户未注册'

            };

            res.send(wrap);

        } else {

            var user = results[0];

            if (user.get('psw') == psw) {

                var data = {

                    'uid':user.get('objectId'),
                    'cover':user.get('imageUrl') == null ? '' : user.get('imageUrl'),
                    'money':user.get('accountMoney') == null ? '0' : user.get('accountMoney'),
                    'nickname':user.get('nickname') == null ? '' : user.get('nickname'),
                    'realname':user.get('username') == null ? '' : user.get('username'),
                    'sex':user.get('sex') == null ? '0' : user.get('sex'),
                    'age':user.get('age') == null ? '0' : user.get('age'),
                    'point':user.get('point') == null ? '0' : user.get('point')

                }

                var wrap = {

                    'code' : 200,
                    'data' : data,
                    'message' : '登录成功'

                };

                res.send(wrap);

            } else {

                var wrap = {

                    'code' : 102,
                    'data' : '',
                    'message' : '用户名或密码错误'

                };

                res.send(wrap);

            }

        }






    });


});

router.post('/regist', function(req, res, next) {

    var phone = req.body.phone;
    var psw = req.body.psw;

    var query = new AV.Query(User);
    query.equalTo('phone', phone);
    query.find().then(function (results) {

        if (results.length == 0) {

            var user = new AV.User();

            user.setUsername(phone);
            user.setPassword(psw);

            user.set('phone', phone);
            user.set('psw', psw);

            console.log(user);

            user.save().then(function (user) {

                var data = {

                    'uid':user.get('objectId')

                }

                var wrap = {

                    'code' : 200,
                    'data' : data,
                    'message' : ''

                };

                res.send(wrap);

            });

        } else {

            var wrap = {

                'code' : 101,
                'data' : '',
                'message' : '该用户已注册'

            };

            res.send(wrap);



        }






    });



});

router.post('/findpsw', function(req, res, next) {

    var phone = req.body.phone;
    var psw = req.body.psw;

    var query = new AV.Query(User);
    query.equalTo('phone', phone);
    query.find().then(function (results) {

        if (results.length == 0) {

            var wrap = {

                'code' : 101,
                'data' : '',
                'message' : '该用户未注册'

            };

            res.send(wrap);

        } else {

            var user = results[0];

            user.set('psw', psw);
            user.save().then(function (user) {

                var wrap = {

                    'code' : 200,
                    'data' : '',
                    'message' : '操作成功'

                };

                res.send(wrap);

            })

        }






    });

});

router.post('/userhead', function(req, res, next) {

    var uid = req.body.uid;
    var headerUrl = req.body.headerUrl;

    var query = new AV.Query(User);
    query.get(uid).then(function (user) {

        user.set('imageUrl', headerUrl);

        user.save().then(function (result) {

            var wrap = {

                'code' : 200,
                'data' : '',
                'message' : '保存成功'

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

module.exports = router;