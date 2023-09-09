const express = require('express');
const router = express.Router();
const {verifyToken, verifyUser, verifyAdmin, verifyModerator, } = require('../middleWare/authMiddleWare')
const {inviteCandidates, createPoll} = require('../controllers/pollService')
const pollService = require('../controllers/pollService');







router.get('/', (req, res)=>{
    res.send('our polls will be happening here. we can vote ideas, vote performances')
})

// Route for creating a poll
// Route to create a poll
router.post('/createpoll/:userId', verifyToken, verifyAdmin || verifyModerator,  async (req, res) => {
    try {
      // Extract poll data from the request body
      const { title, description, startDate, endDate, tags, sponsor, status, categories } = req.body;
  
      // Create the poll
      const poll = await pollService.createPoll(
        title,
        description,
        startDate,
        endDate,
        tags,
        sponsor,
        status,
        categories,
        req.user._id
      );
  
      return res.status(201).json({ message: 'Poll created successfully.', poll });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'An error occurred while creating the poll.' });
    }
  });
  
  
  
  
  // Route for inviting candidates to a poll
  router.post('/invite/:pollId', verifyToken, verifyAdmin || verifyModerator,  async (req, res) => {
    try {
      // Extract candidate data from the request body
      const { candidates } = req.body;
      const pollId = req.params.pollId;
  
      // Invite candidates to the poll
      await pollService.inviteCandidates(pollId, candidates);
  
      return res.status(200).json({ message: 'Candidates invited successfully.' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'An error occurred while inviting candidates.' });
    }
  });


module.exports = router;