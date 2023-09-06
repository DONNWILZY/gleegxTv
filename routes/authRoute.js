const express = require('express');
const router = express.Router();
//const validateFileds = require('../validator/validate');
const {registerUser, loginUser, requestOTP, verifyOTP, changePassword, resetPassword, verifyPasswordOtp, newPassword} = require('../controllers/authController');
const {verifyToken, verifyUser, verifyAdmin, verifyModerator, } = require('../middleWare/authMiddleWare')

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
router.put('/changePassword', verifyToken, changePassword);

////////RESET PASSWORD restPassword
router.post('/resetPasswordRequest',  resetPassword);

//////// VERIFY PASSWORD RESET OTP verifyPasswordOtp
router.post('/verifyPasswordOTP',  verifyPasswordOtp);

////// new pssword newPassword
router.put('/newPassword',  newPassword);











module.exports = router;