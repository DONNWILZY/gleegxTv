const express = require('express');
const router = express.Router();
const cors = require('cors')
router.use(cors());
const {verifyToken, verifyUser, verifyAdmin, verifyModerator, } = require('../middleWare/authMiddleWare')
const { createBlogPost, createComment, createReply} = require('../controllers/blogController');
const { addReactionToBlog, addReactionToComment, addReactionToReply} = require('../controllers/blogController');



//// DEFAULT ROUTE
router.get('/', (req, res)=>{
    res.send('BLOG CONNECT');
})

// CREATE BLOG POST
router.post('/createpost/:userId', verifyToken, verifyAdmin || verifyModerator , createBlogPost)  ;

// CREATE COMMENT FOR POST
router.post('/comment/:blogId', verifyToken, createComment)  ;

/// CREATE REPLY FOR COMMENT
router.post('/reply/:commentId', verifyToken, createReply)  ;

// REACT TO POST
router.post('/post/reaction', async (req, res) => {
    const { blogId, userId, reactionType } = req.body;
  
    try {
      const updatedBlogPost = await addReactionToBlog(blogId, userId, reactionType);
      res.status(200).json({ message: 'Reaction added successfully', blogPost: updatedBlogPost });
    } catch (error) {
      console.error('Error adding reaction:', error.message);
      res.status(500).json({ error: 'An error occurred while adding the reaction' });
    }
  });


router.post('/post/reaction', addReactionToBlog);

//// REACT TO COMMENT
router.post('/comment/reaction/:commentId', verifyToken,  addReactionToComment);

// REACT TO REPLY




module.exports = router;