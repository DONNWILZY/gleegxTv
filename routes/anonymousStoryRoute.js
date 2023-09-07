const express = require('express');
const router = express.Router();
const {verifyToken, verifyUser, verifyAdmin, verifyModerator, } = require('../middleWare/authMiddleWare')





router.get('/', (req, res)=>{
    res.send('HIDE MY IDENTITY SIDE. LOL')
})



module.exports = router;