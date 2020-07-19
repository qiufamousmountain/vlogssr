const express = require('express');
const router = express.Router();
const config = require('../config/config.json');
const article = require('../controller/article');

router.get('/list', async (req, res, next) => {


    let { column } = req.query;
    let list = await article.getlist(column, 20, 'aid rank ctime title keywords description column', 0)
    let olist = await article.getlist(column, 6, 'aid title', 2)
    let hlist = await article.getlist(column, 10, 'aid title', 1)
    let data = {
        domain: '',
        column,
        list: list.code == 200 ? list.data : [],
        olist: olist.code == 200 ? olist.data : [],
        hlist: hlist.code == 200 ? hlist.data : []
    }
    res.render('list', data);
    list = null;
    olist = null;
    hlist = null;
    data = null;
});

router.get('/A-:aid', async (req, res, next) => {
    const aid = req.params.aid;

    let arti = await article.getArticle(aid)
    if (arti.code !== 200) {
        res.render('error', {
            message: arti.msg,
            error: {}
        });

        return
    }
    let olist = await article.getlist(arti.data.column, 6, 'aid title', 0)
    let hlist = await article.getlist(arti.data.column, 10, 'aid title', 1)
    let data = {
        domain: '',
        column: arti.data.column,

        data: arti.data,
        olist: olist.code == 200 ? olist.data : [],
        hlist: hlist.code == 200 ? hlist.data : [],
    }
    res.render('detail', data);
    arti = null;
    olist = null;
    hlist = null;
    data = null;

});

router.get('/', async (req, res, next) => {
    let tg = await article.getlist('APP推广', 16, 'aid ctime title description', 0)
    let dl = await article.getlist('代理业务', 8, 'aid ctime title', 0)
    let yy = await article.getlist('产品运营', 8, 'aid ctime title', 0)
    let xw = await article.getlist('热门新闻', 8, 'aid ctime title', 0)
    let pp = await article.getlist('品牌营销', 8, 'aid ctime title', 0)
    let hlist = await article.getlist(null, 8, 'aid title', 1)
    let data = {
        domain: '',
        type: '',
        data: {
            tg: tg.code == 200 ? tg.data : [],
            dl: dl.code == 200 ? dl.data : [],
            yy: yy.code == 200 ? yy.data : [],
            xw: xw.code == 200 ? xw.data : [],
            pp: pp.code == 200 ? pp.data : [],
            hlist: hlist.code == 200 ? hlist.data : [],

        }

    }

    res.render('index', data);
    tg = null;
    dl = null;
    yy = null;
    xw = null;
    pp = null;
    hlist = null;

    data = null;
});
module.exports = router;
