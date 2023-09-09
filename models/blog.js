const mongoose = require('mongoose');

const reactionSchema = new mongoose.Schema({
   objectId: {
    type: mongoose.Types.ObjectId,
    //required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['like', 'dislike'], // You can extend this with other reaction types if needed
    required: true,
  },
  contentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  contentType: {
    type: String,
    enum: ['Blog', 'Comment', 'Reply'], // Add more content types if needed
    required: true,
  },
},
//////// TIME STAMPS -- CREATED AT AND UPDATED //////
{ timestamps: true }
);

const commentSchema = new mongoose.Schema({
  objectId: {
    type: mongoose.Types.ObjectId,
    //required: true,
  },
    text: {
        type: String,
        required: true,
      },
      PostAuthor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      date: {
        type: Date,
        default: Date.now,
      },
      // post: {
      //   type: mongoose.Schema.Types.ObjectId,
      //   ref: 'Blog',
      //  required: true,
      // },
      commentedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
       required: true,
      },
  replies: [
       {
      text: {
        type: String,
       required: true,
      },
      image: {
        type: String,
       // required: true,
      },
      commentAuthor: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the User model
        ref: 'User', // Reference the 'User' model
        //required: true,
      },

      repliedBy: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the User model
        ref: 'User', // Reference the 'User' model
        //required: true,
      },

         date: {
        type: Date,
        default: Date.now,
      },
       reactions: [reactionSchema], 
    },
  ],
  reactions: [reactionSchema], // Array of reactions for comments
},
//////// TIME STAMPS -- CREATED AT AND UPDATED //////
{ timestamps: true }
);

const blogSchema = new mongoose.Schema({
  objectId: {
    type: mongoose.Types.ObjectId,
  // required: true,
  },
  title: {
    type: String,
    required: true,
  },

  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  
  author: {
    type: String,
    required: true,
  },

  date: {
    type: Date,
    default: Date.now,
  },

  
  category: {
    type: String,
  },
  tags: {
    type: [String],
  },
  summary: {
    type: String,
  },
  content: {
    type: String,
  },
  featuredImage: {
    type: String,
  },
  images: [
    {
      url: {
        type: String,
      },
      caption: {
        type: String,
      },
    },
  ],
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
    },
  ],
//   likes: {
//     type: Number,
//   },
  views: {
    type: Number,
  },
  metaDescription: {
    type: String,
  },
  canonicalUrl: {
    type: String,
  },
  publicationStatus: {
    type: String,
    enum: ['approved', 'declined', 'pending'],
    default: 'pending',
  },
  featured: {
    type: Boolean,
  },
  sticky: {
    type: Boolean,
  },
  isPopular: {
    type: Boolean,
  },
  isTrending: {
    type: Boolean,
  },
  
  dateTime: {
    type: Date,
    default: Date.now,
  },

  //////An array of reactions to the blog post. Each reaction is represented by a `reactionSchema` object
  reactions: [reactionSchema], // Array of reactions for the blog post
  // Other blog fields (if any)
},
//////// TIME STAMPS -- CREATED AT AND UPDATED //////
{ timestamps: true }

);
// Virtual property to count the total number of reactions for the entire blog post
blogSchema.virtual('totalBlogReactionsAndViews').get(function() {
  // Count reactions for the blog post itself
  const blogPostReactions = this.reactions.length;

  // Count reactions for comments
  const commentReactions = this.comments.reduce((total, comment) => {
    return total + comment.reactions.length;
  }, 0);

  // Count reactions for replies
  const replyReactions = this.comments.reduce((total, comment) => {
    return total + comment.replies.reduce((replyTotal, reply) => {
      return replyTotal + reply.reactions.length;
    }, 0);
  }, 0);

  // Add the total number of views
  const totalViews = this.views || 0;

  return {
    totalReactions: blogPostReactions + commentReactions + replyReactions,
    totalViews: totalViews,
  };
});




const Blog = mongoose.model('Blog', blogSchema);
const Comment = mongoose.model('Comment', commentSchema);

module.exports = { Blog, Comment };
