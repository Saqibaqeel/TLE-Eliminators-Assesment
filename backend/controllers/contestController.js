const Contest = require('../models/contesSchema'); // Adjust path to your Contest model
const axios = require('axios');
const cron = require('node-cron');

const fetchAndSaveContests = async () => {
  try {
    console.log('Fetching and updating contests...');

    // Fetch data from all APIs
    const [leetcode, codechef, codeforces] = await Promise.all([
      axios.post('https://leetcode.com/graphql', {
        query: `{ upcomingContests { title startTime duration }}`,
      }),
      axios.get('https://www.codechef.com/api/list/contests/all', {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
        },
      }),
      axios.get('https://codeforces.com/api/contest.list'),
    ]);

    // Process LeetCode contests
    const leetcodeContests = leetcode.data.data.upcomingContests.map((contest) => ({
      platform: 'Leetcode',
      contestId: `lc-${contest.startTime}`,
      name: contest.title,
      startTime: new Date(contest.startTime * 1000),
      duration: contest.duration,
      url: 'https://leetcode.com/contest/', // Add contest-specific URL if available
      status: new Date(contest.startTime * 1000) > new Date() ? 'upcoming' : 'past',
      solutionUrl: '',
    }));

    // Process CodeChef contests
    const codechefContests = [...codechef.data.future_contests, ...codechef.data.past_contests].map((contest) => ({
      platform: 'Codechef',
      contestId: `cc-${contest.contest_code}`,
      name: contest.contest_name,
      startTime: new Date(contest.contest_start_date_iso),
      duration: parseInt(contest.contest_duration) * 60, // Convert minutes to seconds
      url: `https://www.codechef.com/${contest.contest_code}`,
      status: new Date(contest.contest_start_date_iso) > new Date() ? 'upcoming' : 'past',
      solutionUrl: '',
    }));

    // Process Codeforces contests
    const codeforcesContests = codeforces.data.result.map((contest) => ({
      platform: 'Codeforces',
      contestId: `cf-${contest.id}`,
      name: contest.name,
      startTime: new Date(contest.startTimeSeconds * 1000),
      duration: contest.durationSeconds,
      url: `https://codeforces.com/contest/${contest.id}`,
      status: contest.phase === 'BEFORE' ? 'upcoming' : 'past',
      solutionUrl: '',
    }));

    // Combine all contests
    const allContests = [...leetcodeContests, ...codechefContests, ...codeforcesContests];

    // Bulk upsert to database
    const bulkOps = allContests.map((contest) => ({
      updateOne: {
        filter: { contestId: contest.contestId },
        update: { $set: contest },
        upsert: true,
      },
    }));

    await Contest.bulkWrite(bulkOps);

    console.log(`${allContests.length} contests updated successfully.`);
  } catch (error) {
    console.error('Error fetching or saving contests:', error.message);
  }
};

// Schedule to run every 1 hour
cron.schedule('0 * * * *', fetchAndSaveContests, {
  scheduled: true,
  timezone: 'UTC',
});

const getAllContests = async (req, res) => {
  try {
    const contests = await Contest.find();
    res.status(200).json({
      success: true,
      data: contests
    });
  } catch (error) {
    console.error('Error fetching contests:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
    
  }
}
const getContesByPlatForm = async (req, res) => {
  try {
    const{platform} = req.params;
    if(!platform){
      return res.status(400).json({
        success: false,
        message: 'Platform is required'
      });
    }
   const contests = await Contest.find({platform});
    res.status(200).json({
      success: true,
      data: contests
    });
    
  } catch (error) {
    console.error('Error fetching contests:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
    
  }
}
const getContesById=async(req,res)=>{
  try {
    const{contestId} = req.params;
    if(!contestId){
      return res.status(400).json({
        success: false,
        message: 'ContestId is required'
      });
    }
   const contests = await Contest.find({contestId});
    res.status(200).json({
      success: true,
      data: contests
    });
    
  } catch (error) {
    console.error('Error fetching contests:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
    
  }
}
const updateUrl = async (req, res) => {
  try {
    const { contestId } = req.params;
    const { solutionUrl } = req.body;
    
    if (!contestId) {
      return res.status(400).json({
        success: false,
        message: 'ContestId is required'
      });
    }
    
    if (!solutionUrl) {
      return res.status(400).json({
        success: false,
        message: 'SolutionUrl is required'
      });
    }
    
    const updatedContest = await Contest.findOneAndUpdate(
      { contestId: contestId },
      { $set: { solutionUrl: solutionUrl } },
      { new: true }
    );
    
    if (!updatedContest) {
      return res.status(404).json({
        success: false,
        message: 'Contest not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: updatedContest
    });
    
  } catch (error) {
    console.error('Error updating contest:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
const solutionUrl=async(req,res)=>{
  try {
    const {id}=req.params;
    if(!id){
      return res.status(400).json({
        success: false,
        message: 'ContestId is required'
      });
    }
    const contest = await Contest.findById(id);
    if(!contest){
      return res.status(404).json({
        success: false,
        message: 'Contest not found'
      });
    }
    res.status(200).json({
      success: true,
      data: contest.solutionUrl
    });
    
  } catch (error) {
    console.error('Error fetching contests:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
    
  }
}
cron.schedule('0 * * * *', fetchAndSaveContests, {
  scheduled: true,
  timezone: 'UTC',
});


module.exports = { fetchAndSaveContests, getAllContests, getContesByPlatForm ,updateUrl,solutionUrl};