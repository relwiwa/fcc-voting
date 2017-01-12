var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Option = new Schema({
  value: {
    type: String,
    required: true
  },
  votes: {
    type: Number,
    default: 0
  }
});

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
  creator: {
    //type: Schema.Types.ObjectId,
    //ref: 'User'
    type: String
  }
});

/*  Mongoose will create collection based on 'Message'
    collection's name will be in lower-case and pluralized */
module.exports = mongoose.model('Poll', schema); 