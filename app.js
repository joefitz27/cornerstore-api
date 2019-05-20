var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var userRouter = require('./src/routes/UserRouter');
var productRouter = require('./src/routes/ProductRouter');
var imageRouter = require('./src/routes/ImageRouter');
var categoryRouter = require('./src/routes/categoryRouter');
var storeRouter = require('./src/routes/storeRouter');

var app = express();
let PORT = 4000;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-token, authorization");
  res.header("Access-Control-Expose-Headers", "x-token, authorization");
  res.header("Access-Control-Allow-Methods", "PUT, POST, DELETE, GET, OPTION");
  next();
});

app.get('/', (req, resp) => {
  resp.send('Cornerstore API');
});

app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/image', imageRouter);
app.use('/api/category', categoryRouter);
app.use('/api/store', storeRouter);

// app.listen(process.env.PORT || PORT, ()=> {
//   console.log(`listening on ${PORT}`);
// });

app.listen(process.env.PORT || PORT, ()=> {
  console.log(`listening on ${process.env.PORT}`);
});

module.exports = app;
