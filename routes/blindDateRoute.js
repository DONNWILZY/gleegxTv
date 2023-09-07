const express = require('express');
const router = express.Router();
const {verifyToken, verifyUser, verifyAdmin, verifyModerator, } = require('../middleWare/authMiddleWare')





router.get('/', (req, res)=>{
    res.send('BLINE DATE PEOPLE WANT TO MEET AND GET CONNETED. POST THEIR PROFILE WITHOUT FACE. NO NAME, NO CHAT, JUST GOT THROUG PROFILE AND MATCH THEN BOOK TIME FOR LIFE STOR')
})



module.exports = router;