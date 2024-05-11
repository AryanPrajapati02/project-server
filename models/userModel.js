const mongoose = require('mongoose');
const { Schema } = mongoose;
const jwt = require('jsonwebtoken')
const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 4 
  },
  phone: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        // Regular expression for validating phone numbers
        return /^[6-9]\d{9}$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function(v) {
        // Regular expression for validating email addresses
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: props => `${props.value} is not a valid email address!`
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6, // Minimum password length
    validate: {
      validator: function(v) {
        // Regular expression for validating password strength
        return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/.test(v);
      },
      message: props => `Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, one digit, and one special character (!@#$%^&*)`
    }
  },
  isAdmin: {
    type: Boolean,
   
    default: false
}
});

// userSchema.methods.generateToken = async () =>{
//     // Generate an auth token for the user
// try{
//     return jwt.sign({
//       userId: this._id,
//         name: this.name,
//         phone: this.phone,
//         email: this.email,
//         isAdmin: this.isAdmin
//     } , "process.env.JWT_KEY", {expiresIn : '7d'})
// }catch(error){
//     console.log(error)
//     return res.status(400).json({
//         message : "token error"
       
//     })
// }
// }
userSchema.methods.generateToken = async function(){
  try{
   return jwt.sign({
       userId: this.id,
       name: this.name,
       email: this.email,
       phone: this.phone,
       isAdmin: this.isAdmin
   } , "secret" , {expiresIn: '15d'})
  }catch(e){
   console.log(e);
  }
}

const User = mongoose.model('User', userSchema);

module.exports = User;
