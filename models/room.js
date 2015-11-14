
'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let roomSchema = mongoose.Schema({
    name: {type: String, required: true},
    description: {type: String},
    location: {type: String},
    picture: {type: Buffer},
    size: {type: String},
    items: [{type: Schema.Types.ObjectId, ref: 'items', unique: true}],
    updated: {type: Date, default: Date.now}
  }
);

module.exports = mongoose.model('rooms', roomSchema);
