const mongoose = require("mongoose");

// Schema for individual chat data within a session
const ChatSchema = new mongoose.Schema({
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Session",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
  polarity: {
    type: Number,
    required: true,
  },
  data: {
    type: Object, // Additional metadata related to this chat message
    default: {},
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Schema for each session data, including chat history and session summary
const SessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  sessionStart: {
    type: Date,
    default: Date.now,
  },
  sessionEnd: {
    type: Date,
  },
  chatHistory: [ChatSchema], // Array of chat messages within the session

  // Summary details provided by ML at the end of the session
  polarity: {
    type: Number,
    required: function () {
      return !!this.sessionEnd;
    }, // Only required if the session has ended
  },
  keywords: {
    type: [String],
    required: function () {
      return !!this.sessionEnd;
    },
  },
  classified: {
    type: Boolean,
    required: function () {
      return !!this.sessionEnd;
    },
  },
  severity: {
    type: Number,
    required: function () {
      return !!this.sessionEnd;
    },
  },
  improvement: {
    type: String,
    required: function () {
      return !!this.sessionEnd;
    },
  },
});

// Main schema for the user, referencing all sessions
const UserSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  sessions: [SessionSchema], // Array of sessions for the user
});

const User = mongoose.model("User", UserSchema);
module.exports = { User };
