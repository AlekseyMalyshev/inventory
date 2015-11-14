
'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let itemSchema = mongoose.Schema({
    name: {type: String, required: true},
    description: {type: String},
    picture: {type: String},
    value: {type: Number, min: 0},
    updated: {type: Date, default: Date.now}
  }
);

module.exports = mongoose.model('items', itemSchema);
