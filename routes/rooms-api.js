'use strict';

let express = require('express');
let router = express.Router();
let ObjectID = require('mongodb').ObjectID;

let Room = require('../models/room');
let Item = require('../models/item');
let Unlisted = require('../models/unlisted');

let checkError = (err, res, room) => {
  if (err) {
    console.log('err: ', err);
    res.status(400).send(err);
  }
  else {
    res.json(room);
  }
}

router.post('/', (req, res) => {
  let room = new Room(req.body);
  console.log('Adding room: ', room);
  room.save((err, room) => {
    checkError(err, res, room);
  });
});

router.post('/unlist/:room/:id', (req, res) => {
  var unlist = {};
  unlist.id = new ObjectID(req.params.id);
  unlist.room = new ObjectID(req.params.room);
  console.log('Unlisting item: ', unlist);
  Room.findOne({_id: unlist.room}, (err, room) => {
      if (err) {
        checkError(err, res);
      }
      else {
        for (var i = 0; i < room.items.length; ++i) {
          if (room.items[i].equals(unlist.id)) {
            room.items.splice(i, 1);
            Room.findByIdAndUpdate({_id: room._id}, room, (err) => {
              if (err) {
                checkError(err, res);
              }
              else {
                let unlisted = new Unlisted();
                unlisted.item = unlist.id;
                unlisted.save((err, room) => {
                  checkError(err, res, unlist);
                });
              }
            });
            return;
          }
        }
        res.status(400).send('item is not listed');
      }
    });
});

router.post('/move/:room/:id', (req, res) => {
  var move = {};
  move.id = new ObjectID(req.params.id);
  move.room = new ObjectID(req.params.room);
  console.log('Moving item: ', move);
  Unlisted.findOneAndRemove({item: move.id}, (err, room) => {
      if (err) {
        checkError(err, res);
      }
      else {
        Room.find({_id: move.room}, (err, rooms) => {
          if (err) {
            checkError(err, res);
          }
          else if (rooms.length === 1) {
            rooms[0].items.push(move.id);
            rooms[0].save((err, room) => {
              checkError(err, res, move);
            });
          }
          else {
            res.status(500).send('no room found');
          }
        });
      }
    });
});

router.get('/:id', (req, res) => {
  var id = req.params.id;
  console.log('Retrieving room: ', id);
  Room.findOne({_id: id}, (err, room) => {
    checkError(err, res, room);
  });
});

router.get('/', (req, res) => {
  console.log('Reading all rooms');
  Room.find({}, null, {sort: '-updated'})
    .populate('items')
    .exec((err, rooms) => {
    checkError(err, res, rooms);
  });
});

router.put('/', (req, res) => {
  let room = req.body;
  console.log('Updating room: ', room);
  Room.findByIdAndUpdate({_id: room._id}, room, (err) => {
    checkError(err, res, room);
  });
});

router.delete('/:id', (req, res) => {
  let id = req.params.id;
  console.log('Deleting room: ', id);
  Room.findOneAndRemove({_id: id}, (err, room) => {
    if (err) {
      checkError(err, res);
    }
    else {
      Item.remove({id: {$in: room.items}}, (err) => {
        checkError(err, res, room);
      });
    }
  });
});

module.exports = router;
