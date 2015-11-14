
'use strict';

let express = require('express');
let morgan = require('morgan');
let bodyParser = require('body-parser');
var mongoose = require('mongoose');

let itemsApi = require('./routes/items-api');
let roomsApi = require('./routes/rooms-api');
let index = require('./routes/index');
let rooms = require('./routes/rooms');
let unlisted = require('./routes/unlisted');
let room = require('./routes/room');
let item = require('./routes/item');

let database = process.env.MONGOLAB_URI || 'mongodb://localhost/inventory';
console.log('Connecting to mongodb: ', database);
mongoose.connect(database);

let app = express();

app.set('view engine', 'jade');
app.use(express.static('public'));
app.use(express.static('bower_components'));
app.use(morgan('combined'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use('/api/items', itemsApi);
app.use('/api/rooms', roomsApi);
app.use('/', index);
app.use('/rooms', rooms);
app.use('/unlisted', unlisted);
app.use('/room', room);
app.use('/item', item);

let port = process.env.PORT || 3000;
let listener = app.listen(port);

console.log('express in listening on port: ' + listener.address().port);

process.on('exit', function(code) {
  mongoose.disconnect();
  console.log('About to exit with code:', code);
});
