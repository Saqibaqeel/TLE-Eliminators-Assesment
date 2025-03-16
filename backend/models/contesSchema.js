const mongoose = require('mongoose');

const contestSchema = new mongoose.Schema({
  platform: {
    type: String,
    required: true,
    enum: ['Codeforces', 'CodeChef', 'Leetcode']
  },
  contestId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  duration: {
    type: Number,  // in seconds
    required: true
  },
  url: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['upcoming', 'past'],
    required: true
  },
  solutionUrl: {
    type: String,
    default: ''
  },
 
}, {
  timestamps: true  
});
const Contest = mongoose.model('Contest', contestSchema);

module.exports = Contest;