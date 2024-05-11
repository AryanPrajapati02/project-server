require('dotenv').config();
const mongoose = require('mongoose')
const url = process.env.DB_URI;

const dbConnection =async()=>{
      try{
        await mongoose.connect(url);
        console.log('connected to db');
      }catch(error){
        console.log('not connected to db:' ,error);
        process.exit(0)
      }
}

module.exports = dbConnection;