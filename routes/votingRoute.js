const express = require('express');
const router = express.Router();
const {verifyToken, verifyUser, verifyAdmin, verifyModerator, } = require('../middleWare/authMiddleWare')





router.get('/', (req, res)=>{
    res.send('our voting will be happening here. we can vote ideas, vote performances')
})



module.exports = router;