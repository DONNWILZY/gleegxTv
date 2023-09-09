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



//// REACT TO COMMENT
router.post('/comment/reaction', async (req, res) => {
    const { commentId, userId, reactionType } = req.body;
  
    try {
      const updatedComment = await addReactionToComment(commentId, userId, reactionType);
      res.status(200).json({ message: 'Reaction added to comment successfully', comment: updatedComment });
    } catch (error) {
      console.error('Error adding reaction to comment:', error.message);
      res.status(500).json({ error: 'An error occurred while adding the reaction to comment' });
    }
  });

// REACT TO REPLY
router.post('/reply/reaction', async (req, res) => {
    try {
      const { replyId, userId, reactionType } = req.body;
  
      // Call the function to add a reaction to the reply
      const updatedReply = await addReactionToReply(replyId, userId, reactionType);
  
      // Return a success response with the updated reply
      res.status(200).json({ message: 'Reaction added to reply', reply: updatedReply });
    } catch (error) {
      // Handle any errors and return an error response
      res.status(500).json({ error: error.message });
    }
  });




module.exports = router;