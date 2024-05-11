const express = require("express")
const router = express.Router();
const {user , login , register ,logout ,sendOtp } = require('../controller/userController')
const authMiddleware =require('../middleware/authMiddleware')
router.get('/user' , authMiddleware, user)
router.get('/login', login )
router.post('/login', login)
router.get('/register', register)
router.post('/register', register)
router.post('/user/logout' , authMiddleware , logout)


router.post('/sendOtp' , sendOtp)
// router.post('/otpVerify' ,optVerify)

module.exports = router;