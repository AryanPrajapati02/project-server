const User = require('../models/userModel')
const express = require('express')
const bcrypt = require('bcryptjs')
const nodemailer = require("nodemailer");
const OTP = require('../models/otpVerification')

const register = async(req ,res)=>{
   try{
   
    const {name , email ,phone ,password ,otp}= req.body;
 
   
    console.log("reuested user:", name)

    if( !name || !email || !phone || !password){
        
        return res.status(400).json({message : 'please fill all the fields'})
    }
    const isUserExist = await User.findOne({email , phone});
    if(isUserExist){
        return res.status(400).json({message : "Already registered user"})
    }
    
    
   

    
  

    // if (!otpDocument) {
    //   return res.status(400).json({ message: "Invalid OTP." });
    // }
    // const otpExpirationTime = otpDocument.createdAt.getTime() + 300000; // OTP expires after 5 minutes (300000 milliseconds)
    // const currentTime = new Date().getTime();
    // if (currentTime > otpExpirationTime) {
    //   return res.status(400).json({ message: "OTP has expired." });
    // }
  const findOtp = await OTP.findOne({email})
  const generateOtp = findOtp.otp
  console.log(generateOtp)
 
  // if( generateOtp == otp){
  
    const salt = 10;
    const hashPassword = await bcrypt.hash(password , salt) 
   
   
    const user = await User.create({name , email ,phone ,password:hashPassword})
    // await otpDocument.remove();
    return res.status(201).json({
        message : "user created successfully",
        token: await user.generateToken(user)

    })
  // }

    


   }catch(error){
       console.log('error in register',error)
      return res.status(500).json({message : error.message})
   }
     
}
const user = async( req ,res)=>{
  try{
    console.log(req.body)
    
     const userData = req.user;
     res.status(200).send(userData)
  }catch(e){
    res.status(400).send({error: e.message})
  }
}


const sendOtp = async(req, res)=>{
  const {email} = req.body
  const name = req.body.name
  const otp = Math.floor(1000 + Math.random() * 9000);
 try{
  const newOtp = new OTP({
    email : email,
    otp: otp
  });
  await newOtp.save();
  const transporter = nodemailer.createTransport({
      service: 'gmail',
      
    
      port: 587,
      secure: false, // Use `true` for port 465, `false` for all other ports
      auth: {
        user: "boolean985@gmail.com",
        pass: process.env.MAILER_PASSWORD,
      },
    });
    const info = await transporter.sendMail({
      from: '"Chat GPT"', // sender address
      to: email , // list of receivers
      subject: "Verify OTP", // Subject line
      text: `otp for verification : ${otp}`, // plain text body
      html: `Dear,
<br>
You're one step away from completing your registration with us!
<br>
Please use the following One-Time Password (OTP) to verify your email address:

<h1  style="font-size: 24px; color: #ff6600;">${otp}</h1>
<br>
This OTP is valid for the next 5 minutes.
<br>
If you did not request this OTP, please disregard this email.
<br>
Thank you for choosing us.
<br>
Best regards,
API DOC :)`, // html body  
    })


  await transporter.sendMail(info)
  console.log( "Otp sent successfully", info.messageId);
 
  return res.status(200).json({
    message: "Otp sent successfully",
    otp: otp

  })
 
 }catch(e){
  console.log("otp not sent" ,e)
 
 }
}

const login = async(req ,res)=>{
   try{
    const {email ,password} = req.body;
    if(!email || !password){
        return res.status(400).json({message : "please fill all the fields"})
    }
    const user = await User.findOne({email})
     if(!user){
        return res.status(400).json({message : "user not found"})
     }
     const checkPassword = await bcrypt.compare(password , user.password)
     if(!checkPassword){
        return res.status(400).json({message : "invalid password"})
     }
     return res.status(200).json({
        message : "user logged in successfully",
        token: await user.generateToken({email:email , password:password })
     })

   }catch(errror){
    return res.status(400).json({
        message: "Internal Server error"
    })
   }
}
const logout = async (req,res)=>{
    
    res.status(200).json({
        message: "Logged out successfully"
    })
}

// const sendOtp = async ({email , name}, res)=>{
//     try{
       
//         if(!email){
//             // return res.status(400).json({message : "please fill all the fields"})
//             console.log("msii")
//         }
       
//         const otp = Math.floor(1000 + Math.random() * 9000);
//         // const salt = 10;
//         // const hashedOtp = await bcrypt.hash(otp, salt);
//         const Otpsave =  new otpVerification({email: email , otp})
//         await Otpsave.save();
       
//     const transporter = nodemailer.createTransport({
//         service: 'gmail',
        
      
//         port: 587,
//         secure: false, // Use `true` for port 465, `false` for all other ports
//         auth: {
//           user: "boolean985@gmail.com",
//           pass: "yndn zogb lkpf yham",
//         },
//       });
//       const info = await transporter.sendMail({
//         from: '"Chat GPT"', // sender address
//         to: email , // list of receivers
//         subject: "Verify with otp", // Subject line
//         text: `otp for verification : ${otp}`, // plain text body
//         html: `Dear ${name},
// <br>
// You're one step away from completing your registration with us!
// <br>
// Please use the following One-Time Password (OTP) to verify your email address:

// <h1  style="font-size: 24px; color: #ff6600;">${otp}</h1>
// <br>
// This OTP is valid for the next 5 minutes.
// <br>
// If you did not request this OTP, please disregard this email.
// <br>
// Thank you for choosing us.
// <br>
// Best regards,
// API DOC :)`, // html body  
//       })

  
//     await transporter.sendMail(info)
//     console.log("Message sent: %s", info.messageId);
//     res.status(200).json({
//         message: "Otp sent successfully"
//     })

//     }catch(error){
//         console.log(error)
//         res.status(400).json({
//             message: "Internal Server error"
//         })
//     }
// }


module.exports ={
    user,
    login,
    register,
    logout,
    sendOtp
   
}