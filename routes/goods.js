/**
 * Created by HanQi on 2017/4/12.
 */

var router = require('express').Router();
var AV = require('leanengine');

var User = AV.Object.extend('_User');
var Goods = AV.Object.extend('Goods');
var Comment = AV.Object.extend('Comment');
var History = AV.Object.extend('History');
var Attention = AV.Object.extend('Attention');

router.post('/goodsList', function(req, res, next) {

    var cid = req.body.cid;

    var query = new AV.Query(Goods);
    query.equalTo('classfiy', cid);
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

router.post('/goodsDetail', function(req, res, next) {

    var gid = req.body.gid;
    var uid = req.body.uid;

    var query = new AV.Query(User);
    query.get(uid).then(function (user) {

        var query = new AV.Query(Goods);
        query.get(gid).then(function (result) {

            var query = new AV.Query(Comment);
            query.equalTo('goods', result);
            query.limit(10);
            query.find().then(function (comments) {

                var attentionRelation = user.relation('attention');
                var query = attentionRelation.query();
                query.include('goods');
                query.find().then(function (attentions) {

                    var isAttention = '0';

                    for (var i = 0; i < attentions.length; i++) {

                        if (attentions[i].get('goods').get('objectId') == gid) {

                            isAttention = '1';
                            break;

                        }

                    }



                    var comment = [];

                    for (var i = 0; i < comments.length; i++) {

                        var time = comments[i].get('createdAt');
                        var date = new Date(time);
                        var localeDateString = date.toLocaleDateString();
                        var localeTimeString = date.toLocaleTimeString();
                        var timeString = localeDateString + ' ' +localeTimeString;

                        var temp = {

                            'id' : comments[i].get('objectId'),
                            'number' : comments[i].get('number'),
                            'content' : comments[i].get('content'),
                            'time' : timeString

                        };

                        comment.push(temp);

                    }



                    var imageArray = [];

                    // imageArray.push(result.get('topImage'));

                    var imageString = result.get('imageDetail');

                    if (imageString != null) {

                        var tempArray = imageString.split(",");

                        for (var i = 0; i < tempArray.length; i++) {

                            imageArray.push(tempArray[i]);

                        }

                    }

                    var data = {

                        'id' : result.get('objectId'),
                        'title' : result.get('name'),
                        'content' : result.get('content'),
                        'commtentLikeNumber' : result.get('commentNumber'),
                        'laterNumber' : result.get('laterNum'),
                        'arriveType' : result.get('arriveType'),
                        'cover' : result.get('topImage'),
                        'choseType' : result.get('choseType'),
                        'status' : result.get('status'),
                        'commentNumber' : result.get('commentNumber'),
                        'price' : result.get('price'),
                        'comment' : comment,
                        'imageUrls' : imageArray,
                        'isAttention' : isAttention


                    };

                    var relation = user.relation('history');
                    var query = relation.query();
                    query.include('goods');
                    query.find().then(function (historys) {

                        var flag = 0;

                        for (var i = 0; i < historys.length; i++) {

                            if (historys[i].get('goods').get('objectId') == gid) {

                                flag ++;
                                break;
                            }

                        }


                        if (flag == 0) {

                            console.log(0);

                            var history = new History();
                            history.set('goods', result);
                            history.save().then(function (historySaved) {

                                relation.add(historySaved);

                                user.save().then(function (success) {

                                    var wrap = {

                                        'code' : 200,
                                        'data' : data,
                                        'message' : ''

                                    };

                                    res.send(wrap);

                                });




                            });


                        } else {
                            console.log(flag);

                            var wrap = {

                                'code' : 200,
                                'data' : data,
                                'message' : ''

                            };

                            res.send(wrap);

                        }

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

router.post('/getComment', function(req, res, next) {

    var gid = req.body.gid;
    var uid = req.body.uid;

    var query = new AV.Query(Goods);
    query.get(gid).then(function (result) {

        var query = new AV.Query(Comment);
        query.equalTo('goods', result);
        query.limit(100);
        query.find().then(function (comments) {


            var data = [];

            for (var i = 0; i < comments.length; i++) {

                var time = comments[i].get('createdAt');
                var date = new Date(time);
                var localeDateString = date.toLocaleDateString();
                var localeTimeString = date.toLocaleTimeString();
                var timeString = localeDateString + ' ' + localeTimeString;

                var temp = {

                    'id': comments[i].get('objectId'),
                    'number': comments[i].get('number'),
                    'content': comments[i].get('content'),
                    'time': timeString

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


    });






});

router.post('/attention', function(req, res, next) {

    var gid = req.body.gid;
    var uid = req.body.uid;

    var query = new AV.Query(User);
    query.get(uid).then(function (user) {

        var relation = user.relation('attention');
        var query = relation.query();
        query.include('goods');
        query.find().then(function (attentions) {

            var query = new AV.Query(Goods);
            query.get(gid).then(function (goods) {

                var flag = 0;

                for (var i = 0; i < attentions.length; i++) {

                    if (attentions[i].get('goods').get('objectId') == gid) {

                        flag ++;
                        break;

                    }


                }

                if (flag == 0) {

                    var attention = new Attention();
                    attention.set('goods', goods);

                    attention.save().then(function (attention) {

                        relation.add(attention);

                        user.save().then(function (success) {

                            var wrap = {

                                'code' : 200,
                                'data' : '',
                                'message' : '操作成功'

                            };

                            res.send(wrap);

                        })

                    });


                } else {

                    var wrap = {

                        'code' : 100,
                        'data' : '',
                        'message' : '您已经关注了该商品'

                    };

                    res.send(wrap);

                }


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

router.post('/cancleAttention', function(req, res, next) {

    var gid = req.body.gid;
    var uid = req.body.uid;

    var query = new AV.Query(User);
    query.get(uid).then(function (user) {

        var relation = user.relation('attention');
        var query = relation.query();
        query.include('goods');
        query.find().then(function (attentions) {

            var query = new AV.Query(Goods);
            query.get(gid).then(function (goods) {

                var flag = 0;

                for (var i = 0; i < attentions.length; i++) {

                    if (attentions[i].get('goods').get('objectId') == gid) {

                        flag ++;

                        attentions[i].destroy().then(function (success) {

                            var wrap = {

                                'code' : 200,
                                'data' : '',
                                'message' : '操作成功'

                            };

                            res.send(wrap);

                        });

                        break;

                    }


                }

                if (flag == 0) {

                    var wrap = {

                        'code' : 100,
                        'data' : '',
                        'message' : '您没有关注该商品'

                    };

                    res.send(wrap);



                }


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

module.exports = router;