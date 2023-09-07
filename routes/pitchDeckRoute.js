const express = require('express');
const router = express.Router();
const {verifyToken, verifyUser, verifyAdmin, verifyModerator, } = require('../middleWare/authMiddleWare')





router.get('/', (req, res)=>{
    res.send('PITCH DECK ROUTE... SELL YOURSELF HERE AND BUISNESS FOR SPPORT')
})



module.exports = router;