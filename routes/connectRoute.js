const express = require('express');
const router = express.Router();
const { followUser, unfollowUser } = require('../controllers/connectControllers');
const { verifyAdmin, verifyUser, verifyToken, verifyModerator } = require('../middleWare/authMiddleWare');


router.get('/', (req, res)=>{
    res.send('connect  ROUTE GOING THROUGH FOLLOWE , UNFOLLOWE')
})



// Follow a user
router.post('/follow/:userId', verifyToken, verifyUser, followUser);

// Unfollow a user
router.post('/unfollow/:userId', verifyToken, verifyUser, unfollowUser);




module.exports = router;