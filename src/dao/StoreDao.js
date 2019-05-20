var client = require('../../db');
var commonUtil = require('../util/CommonUtil');

module.exports.create = function(jsonaData, callback) {
    if(jsonaData.store_name && jsonaData.store_address && jsonaData.user_id) {
        const query = {
            text: 'INSERT INTO "store" (user_id, store_name, store_address, is_delete) VALUES($1, $2, $3, $4) returning store_id',
            values: [jsonaData.user_id, jsonaData.store_name, jsonaData.store_address, false]
        }
        client.query(query).then(result => {
            callback({ id: result.rows[0].store_id });
        }).catch(error => {
            console.log(error);
            callback(error);
        })
    } else {
        callback(commonUtil.ERROR);
    }
}

module.exports.update = function (jsonBody, callback) {
    if (jsonBody.id) {
        var selectQuery = {
            name: 'fetch-store1',
            text: 'SELECT * FROM "store" WHERE store_id = $1 and is_delete=false',
            values: [jsonBody.id]
        }

        client.query(selectQuery).then(res => {
            var result = res.rows[0];
            if (res.rows[0]) {
                if(jsonBody.store_name) {
                    result.store_name = jsonBody.store_name;
                }

                if(jsonBody.store_address) {
                    result.store_address = jsonBody.store_address;
                }

                var updateQuery = {
                    text: 'update "store" set store_name = $1, store_address = $2 where store_id = $2',
                    values: [jsonBody.store_name, jsonBody.store_address, jsonBody.id]
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
    var sql = 'select * from "store" where is_delete=false order by store_name asc';
    client.query(sql).then(result => {
        callback(result.rows);
    }).catch(error => {
        callback(error);
    })
};

module.exports.getById = function(id, callback) {
    var sql = 'select * from "store" where store_id=' + id + ' and is_delete=false';
    client.query(sql).then(result => {
        callback(result.rows);
    }).catch(error => {
        callback(error);
    })
};

module.exports.getByUserId = function(id, callback) {
    var sql = 'select * from "store" where user_id=' + id;
    client.query(sql).then(result => {
        callback(result.rows);
    }).catch(error => {
        callback(error);
    })
};

module.exports.remove = function (jsonBody, callback) {
    if (jsonBody.id) {
        var selectQuery = {
            name: 'fetch-store2',
            text: 'SELECT * FROM "store" WHERE store_id = $1',
            values: [jsonBody.id]
        }

        client.query(selectQuery).then(res => {
            var result = res.rows[0];
            if (res.rows[0]) {
                
                var updateQuery ={
                    text : 'update "store" set is_delete=true where store_id =$1',
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