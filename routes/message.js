/**
 * Created by HanQi on 2017/4/6.
 */
var router = require('express').Router();
var AV = require('leanengine');

var Goods = AV.Object.extend('Goods');
var User = AV.Object.extend('_User');
var Message = AV.Object.extend('Message');

router.post('/getMessage', function(req, res, next) {

    var messageType = req.body.type;
    var uid = req.body.uid;

    if (messageType == 1) {

        var query = new AV.Query(Message);
        query.equalTo('type', messageType);
        query.find().then(function (results) {


            var data = [];

            for (var i = 0; i < results.length; i++) {

                var time = results[i].get('createdAt');
                var date = new Date(time);
                var localeDateString = date.toLocaleDateString();
                var localeTimeString = date.toLocaleTimeString();
                var timeString = localeDateString + ' ' +localeTimeString;

                var temp = {

                    'id' : results[i].get('objectId') == null ? '' : results[i].get('objectId'),
                    'idRead' : results[i].get('isRead') == null ? '' : results[i].get('isRead'),
                    'title' : results[i].get('title') == null ? '' : results[i].get('title'),
                    'content' : results[i].get('content') == null ? '' : results[i].get('content'),
                    'time' : timeString == null ? '' : timeString


                };

                data.push(temp);

            }

            var wrap = {

                'code' : 200,
                'data' : data,
                'message' : ''

            };

            res.send(wrap);


        }, function (error) {

            console.log(error)

        });


    } else if (messageType == 2) {

        var query = new AV.Query(User);
        query.get(uid).then(function (user) {

            var relation = user.relation('message');
            var query = relation.query();
            query.find().then(function (results) {

                var data = [];

                for (var i = 0; i < results.length; i++) {

                    var time = results[i].get('createdAt');
                    var date = new Date(time);
                    var localeDateString = date.toLocaleDateString();
                    var localeTimeString = date.toLocaleTimeString();
                    var timeString = localeDateString + ' ' +localeTimeString;

                    var temp = {

                        'id' : results[i].get('objectId') == null ? '' : results[i].get('objectId'),
                        'isRead' : results[i].get('isRead') == null ? '' : results[i].get('isRead'),
                        'title' : results[i].get('title') == null ? '' : results[i].get('title'),
                        'content' : results[i].get('content') == null ? '' : results[i].get('content'),
                        'time' : timeString == null ? '' : timeString


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

    } else {

        var wrap = {

            'code' : 101,
            'data' : '',
            'message' : 'type参数有误'

        };

        res.send(wrap);

    }

});

module.exports = router;