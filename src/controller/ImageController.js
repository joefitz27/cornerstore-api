var PropertiesReader = require('properties-reader');
var properties = PropertiesReader('./security.properties');
var multer = require('multer');
var fs = require('fs');
const jwt = require('jsonwebtoken');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/product_image/')
    },
    filename: function (req, file, cb) {
        cb(null, req.params.id + '.jpg')
    }
})

var upload = multer({ storage: storage }).single('product_image');

exports.upload = function (req, resp, next) {
    jwt.verify(req.token, properties.get('secretKey'), (err, authData) => {
        if (err) {
            resp.sendStatus(403);
        } else {
            upload(req, resp, function (err) {
                console.log(err);
                if (err) {
                    resp.status('500');
                    resp.json({
                        message: 'Something went wrong.'
                    });
                } else {
                    resp.status('200');
                    resp.json({
                        message: 'Image uploaded.'
                    });
                }
            })
        }
    });

    return resp;
}

exports.getImage = function (req, resp, next) {
    jwt.verify(req.token, properties.get('secretKey'), (err, authData) => {
        if (err) {
            resp.sendStatus(403);
        } else {
            fs.readFile('public/product_image/' + req.params.id + '.jpg', function (err, content) {
                if (err) {
                    resp.writeHead(400, { 'Content-type': 'text/html' })
                    console.log(err);
                    resp.end("No such image");
                } else {
                    resp.writeHead(200, { 'Content-type': 'image/jpg' });
                    resp.end(content);
                }
            });
        }
    });

    return resp;
}

exports.deleteImage = function (req, resp, next) {
    jwt.verify(req.token, properties.get('secretKey'), (err, authData) => {
        if (err) {
            resp.sendStatus(403);
        } else {
            console.log(req.params.id);
            fs.unlink('public/product_image/' + req.params.id + '.jpg', function (error) {
                if (error) {
                    console.log(error);
                    resp.end(error);
                } else {
                    resp.end(req.params.id + " image deleted.");
                }
            });
        }
    });

    return resp;
}