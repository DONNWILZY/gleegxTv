// pollService.js

const Poll = require('../models/Poll');
const User = require('../models/User');

async function createPoll(
    title,
    description,
    startDate,
    endDate,
    tags,
    sponsor,
    status,
    categories,
  ) {
    try {
      const poll = new Poll({
        title,
        description,
        startDate,
        endDate,
        tags,
        sponsor,
        status,
        categories
        
      });
  
      await poll.save();
      return poll;
    } catch (error) {
      throw error;
    }
  }
  
  






//// invitew candidate  to poll
async function inviteCandidates(pollId, candidateInfos) {
  try {
    const poll = await Poll.findById(pollId);

    if (!poll) {
      throw new Error('Poll not found.');
    }

    for (const candidateInfo of candidateInfos) {
      const candidateUser = await User.findOne({
        $or: [{ username: candidateInfo }, { email: candidateInfo }],
      });

      if (candidateUser) {
        // Add the candidate to the poll's candidates array
        poll.candidates.push({
          user: candidateUser._id,
          votes: [],
        });

        await poll.save();
      }
    }
  } catch (error) {
    throw error;
  }
}



const pollService = {
    inviteCandidates,
    createPoll
  };

  module.exports = pollService;
