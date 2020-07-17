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
            message: data.msg,
            error: {}
        });
        return
    }
    let olist = await article.getlist(data.column, 6, 'aid title', 1)
    let hlist = await article.getlist(column, 10, 'aid title', 1)
    let data = {
        domain: '',
        data: arti.data,
        olist: olist.code == 200 ? olist.data : [],
        hlist: hlist.code == 200 ? hlist.data : []
    }
    res.render('detail', data);
    arti = null;
    olist = null;
    hlist = null;
    data = null;

});

router.get('/', async (req, res, next) => {
    let tg = await article.getlist('APP推广', 16, 'aid ctime title description', 0)
    let dl = await article.getlist('代理业务', 16, 'aid ctime title description', 0)
    let tj = await article.getlist('APP推广', 10, 'aid title', 1)
    let jr = await article.getlist('代理业务', 10, 'aid title', 1)
    let data = {
        domain: '',
        type: '',
        data: {
            tg: tg.code == 200 ? tg.data : [],
            dl: dl.code == 200 ? dl.data : [],
            tj: tj.code == 200 ? tj.data : [],
            jr: jr.code == 200 ? jr.data : [],
        }

    }

    res.render('index', data);
    tg = null;
    dl = null;
    tj = null;
    jr = null;
    data = null;
});
module.exports = router;
