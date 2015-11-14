'use strict';

let express = require('express');
let router = express.Router();

let Item = require('../models/item');
let Unlisted = require('../models/unlisted');

let checkError = (err, res, item) => {
  if (err) {
    console.log('err: ', err);
    res.status(400).send(err);
  }
  else {
    res.json(item);
  }
}

router.post('/', (req, res) => {
  let item = new Item(req.body);
  console.log('Adding item: ', item);
  item.save((err, item) => {
    if (err) {
      checkError(err, res);
    }
    else {
      let unlisted = new Unlisted();
      unlisted.item = item;
      unlisted.save((err, unlisted) => {
        checkError(err, res, item);
      });
    }
  });
});

router.get('/:id', (req, res) => {
  var id = req.params.id;
  console.log('Retrieving item: ', id);
  Item.findOne({_id: id}, (err, item) => {
    checkError(err, res, item);
  });
});

router.get('/', (req, res) => {
  console.log('Reading all items');
  Item.find((err, items) => {
    checkError(err, res, items);
  });
});

router.put('/', (req, res) => {
  let item = req.body;
  console.log('Updating item: ', item);
  Item.findByIdAndUpdate({_id: item._id}, item, (err) => {
    checkError(err, res, item);
  });
});

router.delete('/:id', (req, res) => {
  let id = req.params.id;
  console.log('Deleting item: ', id);
  Item.findOneAndRemove({_id: id}, (err, item) => {
    checkError(err, res, item);
  });
});

module.exports = router;
