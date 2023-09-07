const express = require('express');
const router = express.Router();
const {verifyToken, verifyUser, verifyAdmin, verifyModerator, } = require('../middleWare/authMiddleWare')





router.get('/', (req, res)=>{
    res.send('MEET SOMEONE. POST A PICTURE OF YOU, ABOUT YOU AND WHAT YOU WANT')
})



module.exports = router;