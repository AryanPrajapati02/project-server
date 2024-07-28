const express = require('express')
const app = express();
require('dotenv').config();
const cors = require('cors')
const port = 5000;
const dbConnection = require('./utils/db')
const userRouter = require('./routes/userRoute')
app.use(express.json())
app.use(cors({
    origin: process.env.FRONTEND_URL || process.env.FRONTEND_URL3 ,
    credentials: true,
   methods: "GET , POST , PATCH ,DELETE ,PUT , HEAD",
   optionsSuccessStatus:200
}))
app.use('/api/auth' , userRouter)
app.get('/', (req,res)=>{
    res.send('testing')
})

app.listen(port, ()=>{
    dbConnection();
    console.log(`server is running on port http://localhost:${port}`)
})
