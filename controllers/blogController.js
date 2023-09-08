const { Blog, Comment } = require('../models/blog');
const User = require('../models/User');

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
    const reply = {
      text,
      author: req.user.userId, // Store the user ID of the reply creator
    };

    // Find the comment and add the reply to its replies array
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({
        status: 'failed',
        message: 'Comment not found.',
      });
    }
    comment.replies.push(reply);
    await comment.save();

    return res.status(201).json({
      status: 'success',
      message: 'Reply created successfully.',
      reply,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 'failed',
      message: 'An error occurred while creating the reply.',
    });
  }
};

// More routes and functionality can be added based on the requirements.


const blogController = {
    createBlogPost,
    createComment,
    createReply

  };

  module.exports = blogController;