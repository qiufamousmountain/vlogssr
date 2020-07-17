const express = require('express');
const router = express.Router();
const config = require('../config/config.json');
const article = require('../controller/article');

router.get('/list', async (req, res, next) => {

    let { column, page, lid } = req.query;
    let data = await article.getlist(column, 20, '_id counts ctime title keywords description column', 1)
    let olist = await article.getlist(column, 12, '_id title', 2)
    if (data.code !== 200) {
        res.render('error', {
            message: data.msg,
            error: {}
        });
        return
    }
    data = data.data
    olist = olist.data
    data.pre = {};
    data.nex = {};
    data.domain = '';
    res.render('list', {
        domain: '',
        title: data[0] ? data[0]['column'] + '列表' : '列表',
        keywords: data[0] ? data[0]['keywords'] : '抖音技巧去哪学,抖音运营,抖音赚钱秘诀,抖音蓝v认证,抖音引流技巧,抖音营销',
        description: data[0] ? data[0]['description'] : '飞享喜悦，当下最受关注的创业服务平台。它的运作是否走的是拉人头、割韭菜模式？它的项目是否正规合法？加入飞享喜悦的人是否能赚钱？如果你也关心这些问题，请看联系我们。',
        column: data[0] ? data[0]['column'] : '抖音',
        list: data,
        olist: olist.length >= 12 ? olist.slice(0, 6) : olist,
        hlist: olist.length >= 12 ? olist.slice(6, olist.length) : olist
    }
    );
});
router.get('/A-:aid', async (req, res, next) => {
    const aid = req.params.aid;

    let data = await article.getArticle(aid)
    let olist = await article.getlist(data.column, 12, 'aid title', 1)
    let split_array = (arr, len) => {
        let a_len = arr.length;
        let result = [];
        for (var i = 0; i < a_len; i += len) {
            result.push(arr.slice(i, i + len));
        }
        return result;
    }
    let pre = await article.getpre(_id, 1)
    let nex = await article.getpre(_id, -1)

    if (data.code !== 200) {
        res.render('error', {
            message: data.msg,
            error: {}
        });
        return
    }
    data = data.data
    olist = olist.data
    data.pre = pre.data && pre.data[0] || {};
    data.nex = nex.data && nex.data[0] || {};
    data.domain = '';
    data.olist = olist.length >= 12 ? olist.slice(0, 6) : olist
    data.hlist = olist.length >= 12 ? olist.slice(6, olist.length) : olist;

    res.render('detail', data);
});

router.get('/', async (req, res, next) => {
    let dy = await article.getlist('抖音', 12, '_id ctime title description', 1)
    let zq = await article.getlist('赚钱', 12, '_id ctime title description', 1)
    dy = dy.data;
    zq = zq.data;

    res.render('index', {
        domain: '',
        // title: '飞享喜悦-抖音技巧,抖音运营,抖音赚钱秘诀,抖音蓝v认证,短视频，小程序,抖音营销',
        // keywords: '抖音技巧,抖音运营,抖音赚钱秘诀,抖音蓝v认证,短视频，小程序,抖音营销',
        // description: '抖音技巧,抖音运营,抖音赚钱秘诀,抖音蓝v认证,短视频，小程序,抖音营销',
         title: 'web前端-涛哥大神，HTML,CSS,JS,NODE,小程序，短视频',
        keywords: 'web前端，涛哥大神，HTML,CSS,JS,NODE,小程序，短视频',
        description: 'web前端-涛哥大神，HTML,CSS,JS,NODE,小程序，短视频',
        type: '',
        data: {
            dy: dy.length >= 6 ? dy.slice(0, 6) : dy,
            zq: zq.length >= 6 ? zq.slice(0, 6) : zq,
            dy1: dy.length >= 6 ? dy.slice(6, dy.length) : dy,
            zq1: zq.length >= 6 ? zq.slice(6, zq.length) : zq,
        },


    });
});
module.exports = router;
