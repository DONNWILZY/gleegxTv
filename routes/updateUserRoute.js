const express = require('express');
const router = express.Router();
const User = require('../models/User')
const { updateUser} = require('../controllers/updateUserController')
const {verifyToken, verifyUser, verifyAdmin, verifyModerator, } = require('../middleWare/authMiddleWare')
//const {validate} = require('../validator/validate') ////registerValidator
//const authValidator = require('../validator/authValidator,js')


router.put('/updateUser', verifyToken, verifyUser, updateUser);





module.exports = router;