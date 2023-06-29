const jwt = require("jsonwebtoken");
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const dbcon = require("../db/dbcon");

const tokenWhiteList = ["/login", "/register"];
const secret = "1sidkf023229safj";
const createToken = function (info) {
  return jwt.sign(info, secret, {
    expiresIn: 60*60*2
  });
}
const verifyToken = function (token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (error, result) => {
      if (error) reject (error);
      else resolve (result)
    })
  })
}
exports.verifyToken = (req,res,next) => {
  if (!tokenWhiteList.includes(req.url)) {
    verifyToken(req.headers.token).then(()=>{
        next()
    }).catch(info => {
        res.send({
            code: 9000,
            msg: "登录过期",
            info
        })
    })
  }
  else next()
};

exports.register = [
    body("account", "帐号太短了").isLength({min: 3}).trim(),
    sanitizeBody("account").trim().escape(),
    (req, res) => {
        const errors = validationResult(req);
        console.log(errors);
        res.send("为实现：登录")
    }
]

exports.login = [
    body("account", "帐号太短了").isLength({min: 3}).trim(),
    sanitizeBody("account").trim().escape(),
    (req, res) => {
        const {account, pwd} = req.body;
        const sql = `
            select
                r.account,
                u.id,
                u.nick,
                u.mobile,
                u.state,
                case when r.pwd<>'${pwd}' then 0 else 1 end as fine
            from t_register r
            left join t_user u
            on u.id = r.u_id
            where r.account='${account}';
        `;
        dbcon.query(sql, (err, list) => {
            if (err) console.warn(err);
            else {
                if (!list.length) {
                    res.send({
                        code: 2999,
                        msg: "用户不存在"
                    })
                }

                else {
                    item = list.find(({fine}) => !!fine);
                    console.log(item);
                    if (item) {
                        res.send({
                            code: 2000,
                            data: {
                                ...item,
                                fine: undefined,
                            },
                            token: createToken({
                                id: item.id
                            })
                        })
                    }

                    else {
                        res.send({
                            code: 2998,
                            msg: "密码错误"
                        })
                    }
                }
            }
        });
    }
]