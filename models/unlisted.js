
'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let unlistedSchema = mongoose.Schema({
    item: {type: Schema.Types.ObjectId, ref: 'items', unique: true},
  }
);

module.exports = mongoose.model('unlisted', unlistedSchema);
