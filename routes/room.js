
'use strict';

let express = require('express');
let router = express.Router();

let Room = require('../models/room');

router.get('/', (req, res) => {
  let room = {};
  room._id = '';
  room.name = '';
  room.description = '';
  room.location = '';
  room.picture = '';
  room.size = '';
  room.items = [];
  res.render('room', {room: room});
});

router.get('/:id', (req, res) => {
  var id = req.params.id;
  console.log('Editting room: ', id);
  Room.findOne({_id: id}, (err, room) => {
    if (!err) {
      res.render('room', {room: room});
    }
    else {
      res.status(400);
    }
  });
});

module.exports = router;
