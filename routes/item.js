
'use strict';

let express = require('express');
let router = express.Router();

let Item = require('../models/item');

router.get('/', (req, res) => {
  let item = {};
  item._id = '';
  item.name = '';
  item.description = '';
  item.picture = '';
  item.value = '';
  res.render('item', {item: item});
});

router.get('/:id', (req, res) => {
  var id = req.params.id;
  console.log('Editting item: ', id);
  Item.findOne({_id: id}, (err, item) => {
    if (!err) {
      res.render('item', {item: item});
    }
    else {
      res.status(400);
    }
  });
});

module.exports = router;
