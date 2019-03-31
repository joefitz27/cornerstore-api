var productDao = require('../dao/ProductDao');
var commonUtil = require('../util/CommonUtil');
var PropertiesReader = require('properties-reader');
var properties = PropertiesReader('./security.properties');

const jwt = require('jsonwebtoken');

exports.create = function (req, resp, next) {
    jwt.verify(req.token, properties.get('secretKey'), (err, authData) => {
        if (err) {
            resp.sendStatus(403);
        } else {
            productDao.create(req.body, function (result, error) {
                if (error) {
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
        }
    });

    return resp;
};

exports.getAll = function (req, resp, next) {
    productDao.getAll(function(result, error) {
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

exports.search = function (req, resp, next) {
    productDao.search(req.params.searchText, function(result, error) {
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