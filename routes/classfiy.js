/**
 * Created by HanQi on 2017/3/27.
 */
var router = require('express').Router();
var AV = require('leanengine');

var Goods = AV.Object.extend('Goods');
var Classfiy = AV.Object.extend('Classfiy');
var ClassfiyRecommend = AV.Object.extend('ClassfiyRecommend');

router.post('/getClassfiyList', function(req, res, next) {

    var query = new AV.Query(ClassfiyRecommend);
    query.include('goods');
    query.include('classfiy');
    query.find().then(function (results) {

        var classfiy1 = [];
        var classfiy2 = [];
        var classfiy3 = [];
        var classfiy4 = [];
        var classfiy5 = [];

        var classfiyImage1 = '';
        var classfiyImage2 = '';
        var classfiyImage3 = '';
        var classfiyImage4 = '';
        var classfiyImage5 = '';

        for (var i = 0; i < results.length; i ++) {

            var goods = results[i].get('goods');
            var classfiy = results[i].get('classfiy');

            var temp = {

                'id' : goods.get('objectId'),
                'imageUrl' : goods.get('topImage'),
                'name' : goods.get('name'),
                'price' : goods.get('price')

            }

            if (classfiy.get('classfiyId') == '1') {

                classfiyImage1 = classfiy.get('imageUrl');
                classfiy1.push(temp);

            } else if (classfiy.get('classfiyId') == '2') {

                classfiyImage2 = classfiy.get('imageUrl');
                classfiy2.push(temp);

            } else if (classfiy.get('classfiyId') == '3') {

                classfiyImage3 = classfiy.get('imageUrl');
                classfiy3.push(temp);

            } else if (classfiy.get('classfiyId') == '4') {

                classfiyImage4 = classfiy.get('imageUrl');
                classfiy4.push(temp);

            } else if (classfiy.get('classfiyId') == '5') {

                classfiyImage5 = classfiy.get('imageUrl');
                classfiy5.push(temp);

            }


        }

        var data = [];

        data.push({

            'title' : '海鲜水果',
            'id' : '1',
            'imageUrl' : classfiyImage1,
            'list' : classfiy1

        });

        data.push({

            'title' : '蔬菜蛋类',
            'id' : '2',
            'imageUrl' : classfiyImage2,
            'list' : classfiy2

        });

        data.push({

            'title' : '精品肉类',
            'id' : '3',
            'imageUrl' : classfiyImage3,
            'list' : classfiy3

        });

        data.push({

            'title' : '海鲜水产',
            'id' : '4',
            'imageUrl' : classfiyImage4,
            'list' : classfiy4

        });

        data.push({

            'title' : '冷饮冻食',
            'id' : '5',
            'imageUrl' : classfiyImage5,
            'list' : classfiy5

        });

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

module.exports = router;