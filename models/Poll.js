const mongoose = require('mongoose');

const pollSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  categories: [String], // Array of categories for the poll
   description: String,
  sponsor: String,
  
  status: {
    type: String,
    enum: ['free', 'premium'],
    default: 'free',
  },
  candidates: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      votes: [
        {
          voter: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
          },
          votedAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],
    },
  ],
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  tags: [String], // Array of tags associated with the poll
  analytics: {
    totalVotes: {
      type: Number,
      default: 0,
    },
    optionVotes: [
      {
        option: String,
        voteCount: {
          type: Number,
          default: 0,
        },
      },
    ],
  },
  
});


// Method to calculate total votes for an individual candidate
pollSchema.methods.calculateCandidateTotalVotes = async function(candidateUserId) {
    const candidate = this.candidates.find((c) => c.user.equals(candidateUserId));
  
    if (!candidate) {
      throw new Error('Candidate not found in the poll.');
    }
  
    return candidate.votes.length;
  };
  
  // Method to calculate the overall total votes for the poll
  pollSchema.methods.calculateOverallTotalVotes = async function() {
    let totalVotes = 0;
  
    this.candidates.forEach((candidate) => {
      totalVotes += candidate.votes.length;
    });
  
    return totalVotes;
  };

const Poll = mongoose.model('Poll', pollSchema);

module.exports = Poll;
