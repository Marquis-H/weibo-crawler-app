const sql = require("./db.js");

const Posts = function () {
};

Posts.getUser = _ => {
    // 返回一个 Promise
    return new Promise((resolve, reject) => {
        sql.query("SELECT * FROM user where id = 2015316631", (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            }

            console.log("customers: ", res);
            resolve(res)
        });
    })
};

Posts.getPosts = _ => {
    return new Promise((resolve, reject) => {
        sql.query("SELECT * FROM weibo order by created_at desc", (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            }

            console.log("customers: ", res);
            resolve(res)
        });
    })
};

module.exports = Posts;
