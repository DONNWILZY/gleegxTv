const express = require('express');
const router = express.Router();
const {verifyToken, verifyUser, verifyAdmin, verifyModerator, } = require('../middleWare/authMiddleWare')





router.get('/', (req, res)=>{
    res.send('SPECIAL AWARD TO DESERVING FOLLOWERS')
})



module.exports = router;