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



module.exports = router;