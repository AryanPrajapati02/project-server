const mongoose = require('mongoose');
const { Schema } = mongoose;

const otpSchema = new Schema({
//   userId: {
//     type: Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
email:{
    type: String,
    required: true
  },

  otp: {
    type: String,
    // required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600000 // OTP expires after 5 minutes (300 seconds)
  }
});

const OTP = mongoose.model('OTP', otpSchema);

module.exports = OTP;