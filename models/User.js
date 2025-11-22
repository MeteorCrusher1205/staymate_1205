const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  number: {
    type: String,
    required: true,
    unique: true,
    match: /^[0-9]{10}$/  // Validates a 10-digit phone number
  },
  password: {
    type: String,
    required: true,
    minlength: 6  // You can increase this as per security standards
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  role:{
    type  : String,
    required: true,
    trim: true,
    Enum:["owner","customer", "admin"]
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
