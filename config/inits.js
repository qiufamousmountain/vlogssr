const fs = require("fs"); //进入fs模块
const path = require('path');
const uuid = require('uuid');
const filePath = path.resolve('./config');

console.log(path.join(filePath, '1.json'))
const rujs = () => {
    let content = fs.readFileSync(path.join(filePath, '1.json'), 'utf-8');


    content = JSON.parse(content)
    content = content.map(m => {

        let bb = {
            "title": m.title,
            "keywords": m.title,
            "description": m.description,
            "column": "代理业务",
            "editor": "飞享喜悦",
            "content": m.content,
            "source": "",
            "ctime":m.ctime,
            "etime": m.ctime,
            "tag": m.title,
            "rank": parseInt(Math.random() * (50000 - 30000 + 1) + 30000, 10),
            "aid": m._id.$oid
        };

        
        return bb

    })
    content = JSON.stringify(content)

    fs.writeFileSync(path.join(filePath, '2.json'), content, (e,) => {
        if (e) {
            console.log(`write file fail`);
            return
        }




    })
}

rujs()
