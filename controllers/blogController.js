const { Blog, Comment } = require('../models/blog');
const User = require('../models/User');
const mongoose = require('mongoose');

// Create a Blog Post (Only for admin and moderator)
const createBlogPost = async (req, res) => {
    const { title, content, author, publicationStatus,featuredImage, tags, summary, canonicalUrl, metaDescription , isPopular, isTrending, featured} = req.body;
    const userId = req.params.userId; // Get the userId from the route params 
    
    
  
    try {
      // Fetch the user to check their role
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({
          status: 'failed',
          message: 'User not found.',
        });
      }
  
      // Check if the user is an admin or moderator
      if (user.role !== 'isAdmin' && user.role !== 'isModerator') {
        return res.status(403).json({
          status: 'failed',
          message: 'Only admin and moderator can create blog posts.',
        });
      }
  
      const blog = new Blog({
        title,
        featuredImage,
        content,
        author,
        tags,
        summary,
        metaDescription,
        canonicalUrl,
        isPopular,
        isTrending,
        featured,        
        publicationStatus,
        postedBy: userId, // Store the user ID of the creator
      });
  
      await blog.save();
  
      return res.status(201).json({
        status: 'success',
        message: 'Blog post created successfully.',
        blog,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: 'failed',
        message: 'An error occurred while creating the blog post.',
      });
    }
  };
  

// Create a Comment on a Blog Post
const createComment = async (req, res) => {
    const { text } = req.body;
    const blogId = req.params.blogId; // ID of the blog post
  
    try {
      const comment = new Comment({
        text,
        author: req.user.userId, // Store the user ID of the comment creator
        post: blogId, // Reference to the associated blog post
        commentedBy: req.user.userId, // Reference to the user who commented
      });
      await comment.save();
  
      // Add the comment to the blog post's comments array
      const blog = await Blog.findById(blogId);
      if (!blog) {
        return res.status(404).json({
          status: 'failed',
          message: 'Blog post not found.',
        });
      }
      blog.comments.push(comment);
      await blog.save();
  
      return res.status(201).json({
        status: 'success',
        message: 'Comment created successfully.',
        comment,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: 'failed',
        message: 'An error occurred while creating the comment.',
      });
    }
  };
  

// Create a Reply to a Comment
const createReply = async (req, res) => {
    const { text } = req.body;
    const commentId = req.params.commentId; // ID of the comment being replied to
  
    try {
      // Find the comment to which the reply belongs
      const comment = await Comment.findById(commentId);
      if (!comment) {
        return res.status(404).json({
          status: 'failed',
          message: 'Comment not found.',
        });
      }
  
      const reply = {
        text,
        author: req.user.userId, // Store the user ID of the reply creator
        comment, // Remove the 'comment' property
        post: comment.post, // Store the associated blog post ID
        repliedBy: req.user.userId, // Store the user who replied
      };
  
      // Add the reply to the replies array of the comment
      comment.replies.push(reply);
      await comment.save();
  
      // Get the newly created reply's _id
      const replyId = reply._id;
  
      // Return the reply and replyId in the response
      return res.status(201).json({
        status: 'success',
        message: 'Reply created successfully.',
        reply,
        replyId, // Include replyId in the response
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: 'failed',
        message: 'An error occurred while creating the reply.',
      });
    }
  };
  


    /// REACTION TO POST
   // Define a function to add a reaction to a blog post
async function addReactionToBlog(blogId, userId, reactionType) {
    try {
      // Validate ObjectIDs
      if (!mongoose.Types.ObjectId.isValid(blogId) || !mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('Invalid ObjectID');
      }
  
      // Find the blog post by its ID
      const blogPost = await Blog.findById(blogId);
  
      if (!blogPost) {
        throw new Error('Blog post not found');
      }
  
      // Check if the user has already reacted to this blog post
      const existingReaction = blogPost.reactions.find(
        (reaction) => reaction.userId.toString() === userId.toString()
      );
  
      if (existingReaction) {
        // If the user has already reacted, update the reaction type
        existingReaction.type = reactionType;
      } else {
        // If the user has not reacted yet, create a new reaction object
        blogPost.reactions.push({
          userId: userId,
          type: reactionType,
          contentId: blogId,
          contentType: 'Blog', // Set the content type to 'Blog'
        });
      }
  
      // Save the updated blog post
      await blogPost.save();
  
      return blogPost;
    } catch (error) {
      throw new Error(`Error adding reaction: ${error.message}`);
    }
  }
  
    /////// REACTION TO COMMENT
    async function addReactionToComment(commentId, userId, reactionType) {
        try {
          // Validate ObjectIDs
          if (!mongoose.Types.ObjectId.isValid(commentId) || !mongoose.Types.ObjectId.isValid(userId)) {
            throw new Error('Invalid ObjectID');
          }
      
          // Find the comment by its ID
          const comment = await Comment.findById(commentId);
      
          if (!comment) {
            throw new Error('Comment not found');
          }
      
          // Check if the user has already reacted to this comment
          const existingReaction = comment.reactions.find(
            reaction => reaction.userId === userId
          );
      
          if (existingReaction) {
            // If the user has already reacted, update the reaction type
            existingReaction.type = reactionType;
          } else {
            // If the user has not reacted yet, create a new reaction object
            comment.reactions.push({
              userId,
              reactionType,
              contentId: commentId,
              contentType: 'Comment', // Set the content type to 'Comment'
            });
          }
      
          // Save the updated comment
          await comment.save();
      
          return comment;
        } catch (error) {
          throw new Error(`Error adding reaction to comment: ${error.message}`);
        }
      }


  //// REACTION TO REPLY 
  // Define a function to add a reaction to a reply
async function addReactionToReply(replyId, userId, reactionType) {
  try {
    // Validate ObjectIDs
    if (!mongoose.Types.ObjectId.isValid(replyId) || !mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid ObjectID');
    }

    // Find the reply by its ID
    const reply = await Comment.findById(replyId);

    if (!reply) {
      throw new Error('Reply not found');
    }

    // Check if the user has already reacted to this reply
    const existingReaction = reply.reactions.find(
      (reaction) => reaction.userId.toString() === userId.toString()
    );

    if (existingReaction) {
      // If the user has already reacted, update the reaction type
      existingReaction.type = reactionType;
    } else {
      // If the user has not reacted yet, create a new reaction object
      reply.reactions.push({
        userId: userId,
        type: reactionType,
        contentId: replyId,
        contentType: 'Reply', // Set the content type to 'Reply'
      });
    }

    // Save the updated reply
    await reply.save();

    return reply;
  } catch (error) {
    throw new Error(`Error adding reaction to reply: ${error.message}`);
  }
}
  
  


const blogController = {
    createBlogPost,
    createComment,
    createReply,
    addReactionToBlog,
    addReactionToComment,
    addReactionToReply


  };

  module.exports = blogController;