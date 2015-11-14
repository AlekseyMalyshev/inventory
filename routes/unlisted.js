
'use strict';

let express = require('express');
let router = express.Router();

let Room = require('../models/room');
let Unlisted = require('../models/unlisted');

router.get('/', (req, res) => {
  Room.find({}, null, {sort: '-updated'})
    .populate('items')
    .exec((err, rooms) => {
    if (!err) {
      Unlisted.find({})
        .populate('item')
        .exec((err, unlisted) => {
          console.log(unlisted);
        if (!err) {
          res.render('unlisted', {rooms: rooms, unlisted: unlisted});
        }
        else {
          res.status(400);
        }
      });
    }
    else {
      res.status(400);
    }
  });
});

module.exports = router;
