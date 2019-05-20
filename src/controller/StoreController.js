var storeDao = require('../dao/StoreDao');
var commonUtil = require('../util/CommonUtil');
var PropertiesReader = require('properties-reader');
var properties = PropertiesReader('./security.properties');

const jwt = require('jsonwebtoken');

exports.create = function (req, resp, next) {
    storeDao.create(req.body, function (result, error) {
        if (error) {
            console.log(error)
            resp.status('500');
            resp.send(error);
        }

        if (result) {
            if (result.id) {
                resp.status('200');
                resp.json({
                    id: result.id,
                    message: commonUtil.INSERT_SUCCESS
                });
            } else {
                resp.status('400');
                resp.send(result);
            }
        }
    })

    return resp;
};

exports.update = function(req, resp, next) {
    jwt.verify(req.token, properties.get('secretKey'), (err, authData) => {
        if (err) {
            resp.sendStatus(403);
        } else {
            storeDao.update(req.body, function (result, error) {
                if (error) {
                    resp.status('500');
                    resp.send(error);
                }

                if (result) {
                    console.log(result);
                    if (result == 'UPDATE') {
                        resp.status('200');
                        resp.json({
                            message: commonUtil.UPDATE_SUCCESS
                        });
                    } else {
                        resp.status('400');
                        resp.send(result);
                    }
                }
            });
        }
    });

    return resp;
};

exports.getAll = function (req, resp, next) {
    storeDao.getAll(function(result, error) {
        if(error) {
            resp.status('500');
            resp.send(error);
        }

        if(result) {
            resp.status('200');
            resp.send(result);
        }
    });

    return resp;
}

exports.getById = function (req, resp, next) {
    storeDao.getById(req.params.id, function(result, error) {
        if(error) {
            resp.status('500');
            resp.send(error);
        }

        if(result) {
            resp.status('200');
            resp.send(result);
        }
    });

    return resp;
}

exports.getByUserId = function (req, resp, next) {
    storeDao.getByUserId(req.params.id, function(result, error) {
        if(error) {
            resp.status('500');
            resp.send(error);
        }

        if(result) {
            resp.status('200');
            resp.send(result);
        }
    });

    return resp;
}

exports.remove = function (req, resp, next) {
    jwt.verify(req.token, properties.get('secretKey'), (err, authData) => {
        if (err) {
            resp.sendStatus(403);
        } else {
            storeDao.remove(req.params, function (result, error) {
                if (error) {
                    resp.status('500');
                    resp.send(error);
                }

                if (result) {
                    console.log(result);
                    if (result == commonUtil.ERROR) {
                        resp.status('400');
                        resp.send(result);
                    } else {
                        resp.status('200');
                        resp.json({
                            message: commonUtil.DELETE_SUCCESS
                        });
                    }
                }
            });
        }
    });

    return resp;
}