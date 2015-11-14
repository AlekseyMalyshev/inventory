
'use strict';

let express = require('express');
let router = express.Router();

let Room = require('../models/room');

router.get('/', (req, res) => {
  Room.find({}, null, {sort: '-updated'})
    .populate('items')
    .exec((err, rooms) => {
    if (!err) {
      res.render('rooms', {rooms: rooms});
    }
    else {
      res.status(400);
    }
  });
});

module.exports = router;
