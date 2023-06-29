const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const dbcon = require("../db/dbcon");

exports.pollList = [
    (req, res) => {
        const {pageNo, pageSize} = req.query;
        console.log(req);
        const sql = `
            select SQL_CALC_FOUND_ROWS
                *
            from
                t_poll limit ${pageSize*(pageNo-1)}, ${pageSize};
            select FOUND_ROWS() as count;
        `;
        dbcon.query(sql, (err, list) => {
            if (err) console.warn(err);
            else {
                res.send({
                    code: 2000,
                    data: list[0],
                    count: list[1][0].count
                })
                
            }
        });
    }
]