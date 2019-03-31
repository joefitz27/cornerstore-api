var userDao = require('../dao/UserDao');
var commonUtil = require('../util/CommonUtil');
var PropertiesReader = require('properties-reader');
var properties = PropertiesReader('./security.properties');

const jwt = require('jsonwebtoken');

exports.create = function (req, resp, next) {
    userDao.create(req.body, function (result, error) {
        if (error) {
            resp.status('500');
            resp.send(error);
        }

        if (result) {
            console.log(result);
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
    });

    return resp;
};

exports.update = function(req, resp, next) {
    jwt.verify(req.token, properties.get('secretKey'), (err, authData) => {
        if (err) {
            resp.sendStatus(403);
        } else {
            userDao.update(req.body, function (result, error) {
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

exports.update = function (req, resp, next) {
    jwt.verify(req.token, properties.get('secretKey'), (err, authData) => {
        if (err) {
            resp.sendStatus(403);
        } else {
            userDao.update(req.body, function (result, error) {
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
                            message: commonUtil.UPDATE_SUCCESS
                        });
                    }
                }
            });
        }
    });

    return resp;
}

exports.getById = function(req, resp, next) {
    jwt.verify(req.token, properties.get('secretKey'), (err, authData) => {
        if (err) {
            resp.sendStatus(403);
        } else {
            userDao.getById(req.params.id, function(result, error) {
                if(error) {
                    resp.status('500');
                    resp.send(error);
                }
        
                if(result) {
                    resp.status('200');
                    resp.send(result);
                }
            });
        }
    });

    return resp;
};

exports.getAll = function (req, resp, next) {
    jwt.verify(req.token, properties.get('secretKey'), (err, authData) => {
        if (err) {
            resp.sendStatus(403);
        } else {
            userDao.getAll(function(result, error) {
                if(error) {
                    resp.status('500');
                    resp.send(error);
                }
        
                if(result) {
                    resp.status('200');
                    resp.send(result);
                }
            });
        }
    });

    return resp;
}

exports.makeAdmin = function (req, resp, next) {
    jwt.verify(req.token, properties.get('secretKey'), (err, authData) => {
        if (err) {
            resp.sendStatus(403);
        } else {
            userDao.makeAdmin(req.body, function (result, error) {
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
                            message: commonUtil.UPDATE_SUCCESS
                        });
                    }
                }
            });
        }
    });

    return resp;
}

exports.remove = function (req, resp, next) {
    jwt.verify(req.token, properties.get('secretKey'), (err, authData) => {
        if (err) {
            resp.sendStatus(403);
        } else {
            userDao.remove(req.params, function (result, error) {
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


exports.checkEmail = function (req, resp, next) {
    userDao.checkEmail(req.params, function (result, error) {
        if (error) {
            resp.status('500');
            resp.send(error);
        }

        if (result) {
            if (result == commonUtil.ERROR || result == commonUtil.EMAIL_EXIST) {
                resp.status('400');
                resp.send(result);
            } else {
                resp.send(result);
            }
        }
    });

    return resp;
};

exports.login = function (req, resp, next) {
    userDao.login(req.body, function (result, error) {
        if (error) {
            resp.status('500');
            resp.send(error);
        }

        if (result) {
            if (result.message == commonUtil.LOGIN_FAILED) {
                resp.status('403');
                resp.send(result);
            } else if (result == commonUtil.ERROR || result == commonUtil.WRONG_PASSWORD || result == commonUtil.NOT_ADMIN) {
                resp.status('400');
                resp.send(result);
            } else if (result.message == commonUtil.LOGIN_SUCCESS) {
                jwt.sign({ user_name: req.body.email }, properties.get('secretKey'), { expiresIn: properties.get('expireIn') }, (err, token) => {
                    if (err) {

                        resp.status('500');
                        resp.send(error);
                    }
                    if (token) {
                        resp.setHeader('x-token', token);
                        resp.json({
                            'message': commonUtil.LOGIN_SUCCESS,
                            'info': result.info
                        });
                    }
                });
            }
        }
    });

    return resp;
};

exports.adminLogin = function (req, resp, next) {
    userDao.adminLogin(req.body, function (result, error) {
        if (error) {
            resp.status('500');
            resp.send(error);
        }

        if (result) {
            if (result.message == commonUtil.LOGIN_FAILED) {
                resp.status('403');
                resp.send(result);
            } else if (result.message == commonUtil.LOGIN_SUCCESS) {
                jwt.sign({ user_name: req.body.email }, properties.get('secretKey'), { expiresIn: properties.get('expireIn') }, (err, token) => {
                    if (err) {

                        resp.status('500');
                        resp.send(error);
                    }
                    if (token) {
                        resp.setHeader('x-token', token);
                        resp.json({
                            'message': commonUtil.LOGIN_SUCCESS,
                            'info': result.info
                        });
                    }
                });
            } else {
                resp.status('400');
                resp.send(result);
            }
        }
    });

    return resp;
};