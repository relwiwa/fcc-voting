var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  question: {
    type: String,
    required: true
  },
  options: [Option],
  created: {
    type: Date,
    default: Date.now()
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});

/*  Mongoose will create collection based on 'Message'
    collection's name will be in lower-case and pluralized */
module.exports = mongoose.model('Poll', schema); 