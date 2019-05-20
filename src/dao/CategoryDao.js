var client = require('../../db');
var commonUtil = require('../util/CommonUtil');

module.exports.create = function(jsonaData, callback) {
    console.log(jsonaData);
    if(jsonaData.category_name && jsonaData.created_by) {
        const query = {
            text: 'INSERT INTO "category" (category_name, created_by, is_delete) VALUES($1, $2, $3) returning category_id',
            values: [jsonaData.category_name, jsonaData.created_by, false]
        }
        client.query(query).then(result => {
            callback({ id: result.rows[0].category_id });
        }).catch(error => {
            console.log(error);
            callback(error);
        })
    } else {
        callback(commonUtil.ERROR);
    }
}

module.exports.update = function (jsonBody, callback) {
    if (jsonBody.id && jsonBody.category_name) {
        var selectQuery = {
            name: 'fetch-category1',
            text: 'SELECT * FROM "category" WHERE category_id = $1 and is_delete=false',
            values: [jsonBody.id]
        }

        client.query(selectQuery).then(res => {
            var result = res.rows[0];
            if (res.rows[0]) {
                result.category_name = jsonBody.category_name;

                var updateQuery = {
                    text: 'update "category" set category_name = $1 where category_id = $2',
                    values: [jsonBody.category_name, jsonBody.id]
                };

                client.query(updateQuery).then(result => {
                    callback(result.command);
                }).catch(error => {
                    callback(error);
                })
            } else {
                callback(commonUtil.ERROR);
            }
        }).catch(error => {
            callback(error);
        })
    } else {
        callback(commonUtil.ERROR);
    }
};

module.exports.getAll = function (callback) {
    var sql = 'select * from "category" where is_delete=false order by category_name asc';
    client.query(sql).then(result => {
        callback(result.rows);
    }).catch(error => {
        callback(error);
    })
};

module.exports.getById = function(id, callback) {
    var sql = 'select * from "category" where category_id=' + id + ' and is_delete=false order by created_on desc';
    client.query(sql).then(result => {
        callback(result.rows);
    }).catch(error => {
        callback(error);
    })
};

module.exports.remove = function (jsonBody, callback) {
    if (jsonBody.id) {
        var selectQuery = {
            name: 'fetch-category2',
            text: 'SELECT * FROM "category" WHERE category_id = $1',
            values: [jsonBody.id]
        }

        client.query(selectQuery).then(res => {
            var result = res.rows[0];
            if (res.rows[0]) {
                
                var updateQuery ={
                    text : 'update "category" set is_delete=true where category_id =$1',
                    values: [jsonBody.id]
                }
               
                client.query(updateQuery).then(result => {
                    callback(result.command);
                }).catch(error => {
                    callback(error);
                })
            } else {
                callback(commonUtil.ERROR);
            }
        }).catch(error => {
            callback(error);
        })
    } else {
        callback(commonUtil.ERROR);
    }
};