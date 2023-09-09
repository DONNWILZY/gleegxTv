// Assuming you have a poll instance
const pollInstance = new Poll(/* ... */);

// Calculate total votes for a specific candidate
const candidateUserId = /* Candidate's user ID */;
const candidateTotalVotes = await pollInstance.calculateCandidateTotalVotes(candidateUserId);

// Calculate overall total votes for the poll
const overallTotalVotes = await pollInstance.calculateOverallTotalVotes();

console.log(`Total votes for candidate: ${candidateTotalVotes}`);
console.log(`Overall total votes for the poll: ${overallTotalVotes}`);
