const express = require('express');
const router = express.Router();
//const validateFileds = require('../validator/validate');
const {registerUser, loginUser, requestOTP, verifyOTP, changePassword} = require('../controllers/authController');
const {verifyToken, verifyUser, verifyAdmin, verifyModerator} = require('../middleWare/authMiddleWare')

router.get('/', (req, res)=>{
    res.send(' running here');
})

// User registration route registerUser
router.post('/register', registerUser);

/////// LOGIN-ROUTE loginUser
router.post('/login', loginUser);

//////REQUEST OTP requestOTP
router.post('/requestotp', requestOTP);

////////VERIFY OTP verifyOTP
router.post('/verifyotp', verifyOTP);


///// CHANGE PASSWORD changePassword
router.put('/changePassword', verifyToken, verifyUser, changePassword);









module.exports = router;