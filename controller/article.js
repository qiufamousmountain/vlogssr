/**
 * Created by saiteluo on 2018/10/9.
 */
const uuid = require('uuid/v4');
const { mongoClient, ArticleSchema } = require('../models/mongodb');
const { resolveInclude } = require('ejs');

// const utils = require('./utils');

module.exports = {
    getArticle: async (_id) => {
        // const headers = utils.getHeader(req);
        let db = mongoClient('siteluo');
        let ArticleModel = db.model('ArticleSchema', ArticleSchema, 'Article');
        if (!_id) {
            return res.json({ code: 400, msg: 'aid is required' })
        }
        console.log(_id)
        let findRes = await new Promise((resolve, reject) => {
            ArticleModel.findOne({ _id }, (error, data) => {
                if (error) {
                    return reject({
                        code: 500,
                        msg: 'db error'
                    })
                }
                if (data) {
                    return resolve({
                        code: 200,
                        data: data,
                    });
                } else {
                    return resolve({
                        code: 404,
                        msg: 'no article'
                    });
                }
            })
        });
        return findRes
        // res.json(findRes);
    },
    getlist: async (column = '抖音', len = 20, keys = '_id counts ctime title keywords description column', hot = 0) => {
        let db = mongoClient('siteluo');
        let ArticleModel = db.model('ArticleSchema', ArticleSchema, 'Article');
        let config = {}
        if (hot == 1) {
            config = { column:column }
        } else if (hot == 2) {
            config = { column: { $ne: column } }
        }
        console.log()
        let findhot = await new Promise((resolve, reject) => {
            ArticleModel
                .find( config , keys)
                .limit(len)
                .sort({ _id: -1 })
                .exec((error, data) => {
                    if (error) {
                        return reject({ code: 500, msg: 'db error' });
                    }
                    if (data) {
                        resolve({ code: 200, data: data });
                    } else {
                        resolve({ code: 400, msg: 'no list' });
                    }
                })

        });
        // console.log(findhot)
        return findhot
        // res.json(findRes);
    },


    getpre: async (lid, pre = 1) => {
        let db = mongoClient('siteluo');
        let ArticleModel = db.model('ArticleSchema', ArticleSchema, 'Article');
        let findhot = await new Promise((resolve, reject) => {
            if (pre == 1) {
                ArticleModel.find({ '_id': { '$gt': lid } }, '_id title ')
                    .limit(1)
                    .sort({ _id: pre })
                    .exec((error, data) => {
                        if (error) {
                            return reject({ code: 500, msg: 'db error' });
                        }
                        if (data) {
                            resolve({ code: 200, data: data });
                        } else {
                            resolve({ code: 400, msg: 'no list' });
                        }
                    })
            } else {
                ArticleModel.find({ '_id': { '$lt': lid } }, '_id title ')
                    .limit(1)
                    .sort({ _id: pre })
                    .exec((error, data) => {
                        if (error) {
                            return reject({ code: 500, msg: 'db error' });
                        }
                        if (data) {
                            resolve({ code: 200, data: data });
                        } else {
                            resolve({ code: 400, msg: 'no list' });
                        }
                    })
            }



        });
        // console.log(findhot)
        return findhot
        // res.json(findRes);
    },
    // //新建页面
    // newArticle: async (req, res) => {
    //     const args = req.body;
    //     const projectId = args.projectId;
    //     const pid = args.pid || "0";
    //     const name = args.name || '';
    //     const url = args.url || '';
    //     const type = args.type;
    //     const blank = args.blank;
    //     const id = uuid();
    //     const headers = utils.getHeader(req);
    //     const _sid = headers['C-Cs-Id'] + '_' + headers['C-Instance-Id'];
    //     const _INSTANCEID=headers['C-Instance-Id'];
    //     if (!headers['C-Cs-Id'] || !headers['C-Instance-Id']) {
    //         return res.json({"code": 403, "data": [], "msg": "403 forbidden"})
    //     }
    //     let db = mongoClient(_sid);

    //     let ProjectModel = db.model('projectSchema', projectSchema, 'project');
    //     let ArticleModel = db.model('ArticleSchema', ArticleSchema, 'Article');


    //     let findRes = await new Promise((resolve, reject) => {
    //         ArticleModel.findOne({
    //             uuid: id,
    //             // _sid: _sid
    //         }, (error, data) => {
    //             if (error) {
    //                 return reject({status: 500, msg: 'db error'});
    //             }
    //             if (data) {
    //                 resolve({status: 501, msg: 'uuid already exists'});
    //             } else {
    //                 resolve({status: 200});
    //             }
    //         })
    //     });
    //     if (findRes.status !== 200) {
    //         return res.json({status: 400, msg: 'create Article error', detail: findRes.msg});
    //     }
    //     let Article;
    //     if (type == 'Article') {
    //         Article = new ArticleModel({
    //             uuid: id,
    //             projectId: projectId,
    //             // pid: pid,
    //             // _sid: _sid,
    //             version: 0,
    //             type: type,
    //             blank: blank,
    //             url: url,
    //             urlName: name,

    //             data: []
    //         });
    //     }


    //     let saveRes = await new Promise((resolve, reject) => {
    //         Article.save((err) => {
    //             if (err) {
    //                 reject({
    //                     status: 500,
    //                     msg: err,
    //                 });
    //             } else {
    //                 resolve({
    //                     status: 200,
    //                     msg: 'new Article success!',
    //                 });
    //             }
    //         });
    //     });

    //     //更新nav
    //     let newUrl = {
    //         children: [],
    //         id: id,
    //         name: name,
    //         open: true,
    //         pid: pid,
    //         type: type
    //     };
    //     let findNavRes = await new Promise((resolve, reject) => {
    //         ProjectModel.findOne({
    //             uuid: projectId,
    //             // _sid: _sid,
    //         }, (error, data) => {
    //             if (error) {
    //                 return reject({
    //                     status: 500,
    //                     msg: 'db error'
    //                 })
    //             }
    //             if (data) {
    //                 resolve({
    //                     status: 200,
    //                     data: data,
    //                 });
    //             } else {
    //                 resolve({
    //                     status: 404,
    //                     msg: 'no row'
    //                 });
    //             }
    //         });
    //     });
    //     if (findNavRes.status !== 200) {
    //         return res.json(findNavRes)
    //     }
    //     let body = {};
    //     body.navs = mapAppend(findNavRes.data.navs, pid, newUrl);
    //     let updateNavRes = await new Promise((resolve, reject) => {
    //         ProjectModel.updateOne({
    //             uuid: projectId,
    //             // _sid: _sid,
    //         }, {$set: body}, (error, data) => {
    //             if (error) {
    //                 return reject({
    //                     status: 500,
    //                     msg: 'db error'
    //                 })
    //             }
    //             resolve({
    //                 status: 200,
    //                 msg: 'add success'
    //             });
    //         });
    //     });

    //     if (updateNavRes.status == 200) {
    //         res.json({
    //             status: 200,
    //             id: id,
    //             msg: 'save success!',

    //         });

    //     } else {
    //         res.json({
    //             status: 500,
    //             msg: 'db error'
    //         });
    //     }

    // },
    // delArticle: async (req, res) => {
    //     const args = req.body;
    //     const ArticleId = args.ArticleId;
    //     const projectId = args.projectId;
    //     const headers = utils.getHeader(req);
    //     const _sid = headers['C-Cs-Id'] + '_' + headers['C-Instance-Id'];
    //     const _INSTANCEID=headers['C-Instance-Id'];
    //     if (!headers['C-Cs-Id'] || !headers['C-Instance-Id']) {
    //         return res.json({"code": 403, "data": [], "msg": "403 forbidden"})
    //     }
    //     let db = mongoClient(_sid);
    //     let ProjectModel = db.model('projectSchema', projectSchema, 'project');
    //     let ArticleModel = db.model('ArticleSchema', ArticleSchema, 'Article');
    //     if (!projectId) {
    //         return res.json({code: 400, msg: 'projectId is required'})
    //     }
    //     if (!ArticleId) {
    //         return res.json({code: 400, msg: 'ArticleId is required'})
    //     }
    //     let removeRes = await new Promise((resolve, reject) => {
    //         ArticleModel.remove({
    //             projectId: projectId,
    //             // _sid: _sid,
    //             uuid: ArticleId
    //         }, (error, data) => {
    //             if (error) {
    //                 return reject({
    //                     status: 500,
    //                     msg: 'db error'
    //                 })
    //             }
    //             resolve({
    //                 status: 200,
    //                 msg: 'delete success'
    //             });
    //         });
    //     });


    //     let findNavRes = await new Promise((resolve, reject) => {
    //         ProjectModel.findOne({
    //             uuid: projectId,
    //             // _sid: _sid,
    //         }, (error, data) => {
    //             if (error) {
    //                 return reject({status: 500, msg: 'db error'});
    //             }
    //             if (data) {
    //                 resolve({status: 200, data: data});
    //             } else {
    //                 resolve({status: 404});
    //             }
    //         })
    //     });
    //     if (findNavRes.status === 200) {
    //         let body = {};
    //         body.navs = filterNot(findNavRes.data.navs, ArticleId);
    //         let updateNavRes = await new Promise((resolve, reject) => {
    //             ProjectModel.updateOne({
    //                 uuid: projectId,
    //                 // _sid: _sid,
    //             }, {$set: body}, (error, data) => {
    //                 if (error) {
    //                     return reject({
    //                         status: 500,
    //                         msg: 'db error'
    //                     })
    //                 }
    //                 resolve({
    //                     status: 200,
    //                     msg: 'update success'
    //                 });
    //             });
    //         });
    //     }

    //     res.json(removeRes)
    // },
    // updateArticle: async (req, res) => {
    //     const args = req.body;
    //     const projectId = args.projectId;
    //     const id = args.id;
    //     const type = args.type;
    //     const blank = args.blank;
    //     // const pid = args.pid;
    //     const name = args.name;
    //     const url = args.url;
    //     const headers = utils.getHeader(req);
    //     const _sid = headers['C-Cs-Id'] + '_' + headers['C-Instance-Id'];
    //     const _INSTANCEID=headers['C-Instance-Id'];
    //     if (!headers['C-Cs-Id'] || !headers['C-Instance-Id']) {
    //         return res.json({"code": 403, "data": [], "msg": "403 forbidden"})
    //     }
    //     let db = mongoClient(_sid);
    //     let ProjectModel = db.model('projectSchema', projectSchema, 'project');
    //     let ArticleModel = db.model('ArticleSchema', ArticleSchema, 'Article');


    //     if (!projectId) {
    //         return res.json({code: 400, msg: 'projectId is required'})
    //     }
    //     if (!id) {
    //         return res.json({code: 400, msg: 'ArticleId is required'})
    //     }
    //     if (!name) {
    //         return res.json({code: 400, msg: 'urlName is required'})
    //     }
    //     let body = {};
    //     body.urlName = name;
    //     if (type == 'url') {
    //         if (!url) {
    //             return res.json({code: 400, msg: 'url is required'})
    //         }
    //         body.blank = blank;
    //         body.url = url;
    //     }
    //     // console.log(args, body)


    //     let findNavRes = await new Promise((resolve, reject) => {
    //         ProjectModel.findOne({
    //             uuid: projectId,
    //             // _sid: _sid,
    //         }, (error, data) => {
    //             if (error) {
    //                 return reject({status: 500, msg: 'db error'});
    //             }
    //             if (data) {
    //                 resolve({status: 200, data: data});
    //             } else {
    //                 resolve({status: 404});
    //             }
    //         })
    //     });
    //     if (findNavRes.status === 200) {
    //         let body = {};
    //         body.navs = mapReplace(findNavRes.data.navs, id, args);
    //         // console.log(body, '--------------');
    //         let updateNavRes = await new Promise((resolve, reject) => {
    //             ProjectModel.updateOne({
    //                 uuid: projectId,
    //                 // _sid: _sid,
    //             }, {$set: body}, (error, data) => {
    //                 if (error) {
    //                     return reject({
    //                         status: 500,
    //                         msg: 'db error'
    //                     })
    //                 }
    //                 resolve({
    //                     status: 200,
    //                     msg: 'update success'
    //                 });
    //             });
    //         });
    //     }

    //     let updateRes = await new Promise((resolve, reject) => {
    //         ArticleModel.updateOne({
    //             projectId: projectId,
    //             // _sid: _sid,
    //             uuid: id,
    //             // pid: pid
    //         }, {$set: body}, (error, data) => {
    //             if (error) {
    //                 return reject({
    //                     status: 500,
    //                     msg: 'db error'
    //                 })
    //             }
    //             resolve({
    //                 status: 200,
    //                 msg: 'update success'
    //             });
    //         });
    //     });
    //     res.json(updateRes);
    // },
    // typeListasync: (req, res) => {
    //     const args = req.body;
    //     const projectId = args.projectId;
    //     const id = args.id;
    //     const type = args.type;
    //     const blank = args.blank;
    //     // const pid = args.pid;
    //     const name = args.name;
    //     const url = args.url;
    //     const headers = utils.getHeader(req);
    //     const _sid = headers['C-Cs-Id'] + '_' + headers['C-Instance-Id'];
    //     const _INSTANCEID = headers['C-Instance-Id'];
    //     if (!headers['C-Cs-Id'] || !headers['C-Instance-Id']) {
    //         return res.json({ "code": 403, "data": [], "msg": "403 forbidden" })
    //     }
    //     let db = mongoClient(_sid);
    //     let ProjectModel = db.model('projectSchema', projectSchema, 'project');
    //     let ArticleModel = db.model('ArticleSchema', ArticleSchema, 'Article');


    //     if (!projectId) {
    //         return res.json({ code: 400, msg: 'projectId is required' })
    //     }
    //     if (!id) {
    //         return res.json({ code: 400, msg: 'ArticleId is required' })
    //     }
    //     if (!name) {
    //         return res.json({ code: 400, msg: 'urlName is required' })
    //     }
    //     let body = {};
    //     body.urlName = name;
    //     if (type == 'url') {
    //         if (!url) {
    //             return res.json({ code: 400, msg: 'url is required' })
    //         }
    //         body.blank = blank;
    //         body.url = url;
    //     }
    //     // console.log(args, body)


    //     let findNavRes = await new Promise((resolve, reject) => {
    //         ProjectModel.findOne({
    //             uuid: projectId,
    //             // _sid: _sid,
    //         }, (error, data) => {
    //             if (error) {
    //                 return reject({ status: 500, msg: 'db error' });
    //             }
    //             if (data) {
    //                 resolve({ status: 200, data: data });
    //             } else {
    //                 resolve({ status: 404 });
    //             }
    //         })
    //     });
    //     if (findNavRes.status === 200) {
    //         let body = {};
    //         body.navs = mapReplace(findNavRes.data.navs, id, args);
    //         // console.log(body, '--------------');
    //         let updateNavRes = await new Promise((resolve, reject) => {
    //             ProjectModel.updateOne({
    //                 uuid: projectId,
    //                 // _sid: _sid,
    //             }, { $set: body }, (error, data) => {
    //                 if (error) {
    //                     return reject({
    //                         status: 500,
    //                         msg: 'db error'
    //                     })
    //                 }
    //                 resolve({
    //                     status: 200,
    //                     msg: 'update success'
    //                 });
    //             });
    //         });
    //     }

    //     let updateRes = await new Promise((resolve, reject) => {
    //         ArticleModel.updateOne({
    //             projectId: projectId,
    //             // _sid: _sid,
    //             uuid: id,
    //             // pid: pid
    //         }, { $set: body }, (error, data) => {
    //             if (error) {
    //                 return reject({
    //                     status: 500,
    //                     msg: 'db error'
    //                 })
    //             }
    //             resolve({
    //                 status: 200,
    //                 msg: 'update success'
    //             });
    //         });
    //     });
    //     res.json(updateRes);
    // },
};