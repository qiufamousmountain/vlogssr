/**
 * Created by saiteluo on 2018/6/1.
 */
const config = require('../config/config.json');
const mongoose = require('mongoose');
const { Schema } = require('mongoose');


const mongoClient = (db) => {
    // let a = 'mongodb://user:pass@localhost:port,anotherhost:port,yetanother:port/database'
    let { user, pass, host, port, hostanother, dbName } = config.mongodb;
    let a = `${host}:${port}`;
    // if (hostanother) a += `,${hostanother}:${port}`;
    // let url = `mongodb://${a}/${db || dbName}`;
    let url = `mongodb://${user}:${pass}@${a}`;

    // if (hostanother) url += '?replicaSet=mongo-7cjatou3'
    console.log(url);

    let mongoClient = mongoose.createConnection(url, {
        poolSize: 5,
        reconnectTries: Number.MAX_VALUE,
        useNewUrlParser: true,
        user: user,
        pass: pass,
        // "replset": {"rs_name": "mongo-7cjatou3"},
    }).useDb(db || dbName);

    mongoClient.on('connected', () => {
        console.log('mongodb connected')
    });

    mongoClient.on('error', (error) => {
        console.log(error);
        console.log('mongodb connect error')
    });

    mongoClient.on('disconnected', () => {
        console.log('mongodb disconnected,---------------------')
    });
    return mongoClient
}


let close = () => {
    mongoClient.close();
};

const ArticleSchema = new Schema(
    {
        title: String,
        keywords: String,
        description: String,
        column: String,
        editor: String,
        content: String,
        source: String,
        ctime: String,
        etime: String,
        tag: String,
        rank: String,
        aid: String
    },
);


module.exports = {
    mongoClient, ArticleSchema,
    close,
};