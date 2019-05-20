var client = require('../../db');
var commonUtil = require('../util/CommonUtil');
var PropertiesReader = require('properties-reader');
var properties = PropertiesReader('./security.properties');
var Cryptr = require('cryptr'),
    cryptr = new Cryptr(properties.get('passwordEncrypt'));

module.exports.create = function (jsonBody, callback) {
    if (jsonBody.email && jsonBody.password && jsonBody.name) {
        var encryptPassword = cryptr.encrypt(jsonBody.password);

        const query = {
            text: 'INSERT INTO "user" (name, email, password, is_admin, is_delete) VALUES($1, $2, $3, $4, $5) returning user_id',
            values: [jsonBody.name, jsonBody.email, encryptPassword, false, false]
        }

        client.query(query).then(result => {
            callback({ id: result.rows[0].user_id });
        }).catch(error => {
            callback(error);
        })
    } else {
        callback(commonUtil.ERROR);
    }
};

module.exports.update = function (jsonBody, callback) {
    if (jsonBody.id && jsonBody.name) {
        var selectQuery = {
            name: 'fetch-user',
            text: 'SELECT * FROM "user" WHERE user_id = $1 and is_delete=false',
            values: [jsonBody.id]
        }

        client.query(selectQuery).then(res => {
            var result = res.rows[0];
            if (res.rows[0]) {
                result.name = jsonBody.name;

                var updateQuery = {
                    text: 'update "user" set name = $1 where user_id = $2',
                    values: [jsonBody.name, jsonBody.id]
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

module.exports.getById = function (id, callback) {
    if (id) {
        var sql = 'select * from "user" where is_delete=false and user_id = ' + id;
        console.log(sql);
        client.query(sql).then(result => {
            if(result.rows[0]) {
                callback(result.rows[0]);
            } else {
                callback('{}')
            }
        }).catch(error => {
            callback(error);
        })
    }
};

module.exports.getAll = function (callback) {
    var sql = 'select * from "user" u left outer join "store" s on s.user_id = u.user_id where u.is_delete=false';
    client.query(sql).then(result => {
        callback(result.rows);
    }).catch(error => {
        callback(error);
    })
};

module.exports.makeAdmin = function (jsonBody, callback) {
    console.log(jsonBody);
    if (jsonBody.id) {
        var selectQuery = {
            name: 'fetch-user',
            text: 'SELECT * FROM "user" WHERE user_id = $1',
            values: [jsonBody.id]
        }

        client.query(selectQuery).then(res => {
            var result = res.rows[0];
            if (res.rows[0]) {
                result.is_admin = jsonBody.is_admin;

                var updateQuery = {
                    text: 'update "user" set is_admin = $1 where user_id = $2',
                    values: [jsonBody.is_admin, jsonBody.id]
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

module.exports.remove = function (jsonBody, callback) {
    if (jsonBody.id) {
        var selectQuery = {
            name: 'fetch-user',
            text: 'SELECT * FROM "user" WHERE user_id = $1',
            values: [jsonBody.id]
        }

        client.query(selectQuery).then(res => {
            var result = res.rows[0];
            if (res.rows[0]) {
                
                var updateQuery ={
                    text : 'update "user" set is_delete=true where user_id =$1',
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

module.exports.checkEmail = function (jsonBody, callback) {
    if (jsonBody.email) {

        var loginQuery = {
            name: 'user-login',
            text: 'select * from "user" where email = $1 and is_delete=false',
            values: [jsonBody.email]
        }

        client.query(loginQuery).then(result => {
            if(result.rows[0]) {
                callback(commonUtil.EMAIL_EXIST)
            } else {
                callback(commonUtil.EMAIL_NOT_EXIST)
            }
        }).catch(error => {
            console.log(error);
            callback(error);
        })
    } else {
        callback(commonUtil.ERROR);
    }
};

module.exports.login = function (jsonBody, callback) {
    if (jsonBody.email && jsonBody.password) {

        var loginQuery = {
            name: 'user-login',
            text: 'select * from "user" where email = $1 and is_delete=false',
            values: [jsonBody.email]
        }

        client.query(loginQuery).then(result => {

            var decryptPassword = cryptr.decrypt(result.rows[0].password);
            console.log(decryptPassword);
            if (decryptPassword == jsonBody.password) {
                console.log(result.rows);
                var data = {
                    message: '',
                    info: ''
                }
                if (result.rows[0]) {
                    var res = result.rows[0];
                    data.message = commonUtil.LOGIN_SUCCESS;
                    data.info = {
                        id: res.user_id,
                        name: res.name,
                        email: res.email,
                        is_admin: res.is_admin
                    }
                    callback(data);
                } else {
                    data.message = commonUtil.LOGIN_FAILED;
                    callback(data);
                }
            } else {
                callback(commonUtil.WRONG_PASSWORD);
            }
        }).catch(error => {
            console.log(error);
            callback(error);
        })
    } else {
        callback(commonUtil.ERROR);
    }
};

module.exports.adminLogin = function (jsonBody, callback) {
    if (jsonBody.email && jsonBody.password) {

        var loginQuery = {
            name: 'user-login',
            text: 'select * from "user" where email = $1 and is_delete=false',
            values: [jsonBody.email]
        }

        client.query(loginQuery).then(result => {

            if(result.rows[0].is_admin) {

                var decryptPassword = cryptr.decrypt(result.rows[0].password);
                console.log(decryptPassword);
                if (decryptPassword == jsonBody.password) {
                    console.log(result.rows);
                    var data = {
                        message: '',
                        info: ''
                    }
                    if (result.rows[0]) {
                        var res = result.rows[0];
                        data.message = commonUtil.LOGIN_SUCCESS;
                        data.info = {
                            id: res.user_id,
                            name: res.name,
                            email: res.email,
                            is_admin: res.is_admin
                        }
                        callback(data);
                    } else {
                        data.message = commonUtil.LOGIN_FAILED;
                        callback(data);
                    }
                } else {
                    callback(commonUtil.WRONG_PASSWORD);
                }
            } else {
                callback(commonUtil.NOT_ADMIN);
            }

        }).catch(error => {
            console.log(error);
            callback(error);
        })
    } else {
        callback(commonUtil.ERROR);
    }
};