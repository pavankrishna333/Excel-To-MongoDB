const mongoose = require("mongoose");

const CandidateSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  mobile: {
    type: Number,
  },
  dob: {
    type: String,
  },
  experience: {
    type: String,
  },
  resumeTitle: {
    type: String,
  },
  currLocation: {
    type: String,
  },
  postalAdd: {
    type: String,
  },
  currEmployer: {
    type: String,
  },
  currDesignation: {
    type: String,
  },
});

module.exports = mongoose.model("CandidateModel", CandidateSchema);
