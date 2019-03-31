var client = require('../../db');
var commonUtil = require('../util/CommonUtil');

module.exports.create = function (jsonBody, callback) {
    if (jsonBody.name && jsonBody.cost && jsonBody.created_by && jsonBody.description) {
        const query = {
            text: 'INSERT INTO "product" (name, description, cost, created_by) VALUES($1, $2, $3, $4) returning product_id',
            values: [jsonBody.name, jsonBody.description, jsonBody.cost, jsonBody.created_by]
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
    var sql = 'select * from "product" order by created_on desc';
    client.query(sql).then(result => {
        callback(result.rows);
    }).catch(error => {
        callback(error);
    })
};

module.exports.search = function (searchData, callback) {
    var sql = "select * from product where name ILIKE '%" + searchData + "%' or description ILIKE '%"+ searchData + "%' order by created_on desc";
    console.log(sql);
    client.query(sql).then(result => {
        callback(result.rows);
    }).catch(error => {
        callback(error);
    })
};