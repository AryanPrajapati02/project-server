const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

const authMiddleware = async( req ,res ,next)=>{
//   const token = req.header('Authorization');
  const token = req.headers.authorization.split(' ')[1];
  if(!token){
    return res.status(400).send({error: 'Please provide token'})
  }
//    const jwtToken = token.replace("Bearer" , " ").trim();
 
    try{
     const decode = jwt.verify(token , process.env.JWT_KEY )
    //  req.user = decode
   const userData = await User.findOne({email :decode.email}).select({
    password: 0,
   })
   req.user = userData;
  //  req.token= token;
//    req.userID = userData.id;

     next()
    }catch(e){
      console.log(e)
      return res.status(400).send({message: 'nvalid token'})
    }
 
 
}
module.exports = authMiddleware