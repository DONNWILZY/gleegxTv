const express = require('express');
const router = express.Router();
const {verifyToken, verifyUser, verifyAdmin, verifyModerator, } = require('../middleWare/authMiddleWare')
const { createBlogPost, createComment, createReply} = require('../controllers/blogController');





router.get('/', (req, res)=>{
    res.send('BLOG CONNECT')
})

router.post('/createpost/:userId', verifyToken, verifyAdmin || verifyModerator , createBlogPost)  
/////
router.post('/comment/:blogId', verifyToken, createComment)  

///
router.post('/reply/:commentId', verifyToken, createReply)  




module.exports = router;