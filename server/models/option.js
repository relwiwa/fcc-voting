var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  value: {
    type: String,
    required: true
  },
  votes: {
    type: Number,
    default: 0
  },
  vote: {
    type: Schema.Types.ObjectId,
    ref: 'Poll'
  }
});

module.exports = mongoose.model('Option', schema); 