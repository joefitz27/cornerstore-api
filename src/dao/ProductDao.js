var client = require('../../db');
var commonUtil = require('../util/CommonUtil');

module.exports.create = function (jsonBody, callback) {
    if (jsonBody.name && jsonBody.cost && jsonBody.created_by && jsonBody.description && jsonBody.category_id) {
        const query = {
            text: 'INSERT INTO "product" (name, description, cost, created_by, category_id) VALUES($1, $2, $3, $4, $5) returning product_id',
            values: [jsonBody.name, jsonBody.description, jsonBody.cost, jsonBody.created_by, jsonBody.category_id]
        }
        client.query(query).then(result => {
            console.log(result);
            callback({ id: result.rows[0].product_id });
        }).catch(error => {
            
            callback(error);
        })
    } else {
        callback(commonUtil.ERROR);
    }
};

module.exports.getAll = function (callback) {
    var sql = 'select p.*, s.store_id, s.store_name, s.store_address from product p inner join public.user u on u.user_id = p.created_by inner join store s on s.user_id=u.user_id order by p.created_on desc';
    client.query(sql).then(result => {
        callback(result.rows);
    }).catch(error => {
        callback(error);
    })
};

module.exports.search = function (searchData, callback) {
    var sql = "select p.*, s.store_id, s.store_name, s.store_address from product p inner join public.user u on u.user_id = p.created_by inner join store s on s.user_id=u.user_id where p.name ILIKE '%" + searchData + "%' or p.description ILIKE '%"+ searchData + "%' order by p.created_on desc";
    console.log(sql);
    client.query(sql).then(result => {
        callback(result.rows);
    }).catch(error => {
        callback(error);
    })
};