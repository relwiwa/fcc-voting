var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Option = new Schema({
  value: {
    type: String,
    required: true
  },
  votes: {
    type: Number,
    required: true,
    default: 0,
  }
});

var Voter = new Schema({
  voterId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  optionId: {
    type: Schema.Types.ObjectId,
    ref: 'Option'
  },
  voteDate: {
    type: Date,
    default: Date.now()
  }
});

var schema = new Schema({
  question: {
    type: String,
    required: true
  },
  options: [Option],
  voters: [Voter],
  created: {
    type: Date,
    default: Date.now()
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});

/*  Mongoose will create collection based on 'Message'
    collection's name will be in lower-case and pluralized */
module.exports = mongoose.model('Poll', schema); 