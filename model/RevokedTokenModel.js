const mongoose = require('mongoose');


const revokedTokenSchema = new mongoose.Schema({
  access_token: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const RevokedToken = mongoose.model('RevokedToken', revokedTokenSchema);

module.exports = RevokedToken;
