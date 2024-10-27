const express = require("express");
const mongoose = require("mongoose");
const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect("mongodb+srv://megathon:megathon@cluster-megathon.ttspl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster-megathon")
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

// Define the Chat Schema
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
  question: { type: String, required: true },
  answer: { type: String, required: true },
  polarity: { type: Number, required: true },
  data: { type: Object, default: {} },
  timestamp: { type: Date, default: Date.now },
});

// Define the Session Schema
const SessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  sessionStart: { type: Date, default: Date.now },
  sessionEnd: { type: Date },
  polarity: { type: Number, required: false },
  keywords: { type: [String], required: false },
  classified: { type: String, required: false },
  severity: { type: Number, required: false },
  improvement: { type: String, required: false },
  chatHistory: [ChatSchema],
});

// Define the User Schema
const UserSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  sessions: [SessionSchema],
});

// Models
const User = mongoose.model("User", UserSchema);
const Session = mongoose.model("Session", SessionSchema);
const Chat = mongoose.model("Chat", ChatSchema);

/*
  Start a New Session
  POST /api/sessions/start
  
  Input:
    - userId (String): ID of the user starting the session
  
  Output:
    - sessionId (String): ID of the new session created
*/
app.post("/api/sessions/start", async (req, res) => {
  try {
    const { userId } = req.body;
    const newSession = { userId, sessionStart: new Date(), chatHistory: [] };
    const user = await User.findOneAndUpdate(
      { userId },
      { $push: { sessions: newSession } },
      { new: true, upsert: true }
    );
    const sessionId = user.sessions[user.sessions.length - 1]._id;
    res.status(201).json({ sessionId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/*
  Add Chat Message to Session
  POST /api/sessions/:sessionId/chats
  
  Input:
    - sessionId (String, URL parameter): ID of the session to add chat to
    - userId (String): ID of the user sending the chat
    - question (String): Question asked by the user
    - answer (String): Response given
    - polarity (Number): Polarity score of the chat
    - data (Object, optional): Additional metadata
  
  Output:
    - message (String): Status message
    - session (Object): Updated session data with added chat
*/
app.post("/api/sessions/:sessionId/chats", async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { userId, question, answer, polarity, data } = req.body;
    const chatMessage = {
      sessionId,
      userId,
      question,
      answer,
      polarity,
      data,
      timestamp: new Date(),
    };
    const user = await User.findOneAndUpdate(
      { "sessions._id": sessionId },
      { $push: { "sessions.$.chatHistory": chatMessage } },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: "Session not found" });
    {
      console.log({ message: "Chat added", session: user.sessions.id(sessionId) })
      res
      .status(200)
      .json({ message: "Chat added", session: user.sessions.id(sessionId) });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/*
  End a Session with Summary Data
  PUT /api/sessions/:sessionId/end
  
  Input:
    - sessionId (String, URL parameter): ID of the session to end
    - polarity (Number): Overall polarity score for the session
    - keywords (Array of Strings): Keywords summarizing the session
    - classified (String): Classification status of the session
    - severity (Number): Severity level
    - improvement (String): Improvement description
  
  Output:
    - message (String): Status message
    - session (Object): Updated session with summary data
*/
app.put("/api/sessions/:sessionId/end", async (req, res) => {
  try {
    console.log('/api/sessions/:sessionId/end api called at line 149')
    const { sessionId } = req.params;
    const { polarity, keywords, classified, severity, improvement } = req.body;
    const sessionUpdate = {
      "sessions.$.sessionEnd": new Date(),
      "sessions.$.polarity": polarity,
      "sessions.$.keywords": keywords,
      "sessions.$.classified": classified,
      "sessions.$.severity": severity,
      "sessions.$.improvement": improvement,
    };
    const user = await User.findOneAndUpdate(
      { "sessions._id": sessionId },
      { $set: sessionUpdate },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: "Session not found" });
    res
      .status(200)
      .json({ message: "Session ended", session: user.sessions.id(sessionId) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/*
  Retrieve All Sessions for a User
  GET /api/users/:userId/sessions
  
  Input:
    - userId (String, URL parameter): ID of the user
  
  Output:
    - sessions (Array of Objects): List of all sessions for the user
*/
app.get("/api/users/:userId/sessions", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findOne({ userId });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ sessions: user.sessions });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/*
  Retrieve Specific Session Details
  GET /api/sessions/:sessionId
  
  Input:
    - sessionId (String, URL parameter): ID of the session to retrieve
  
  Output:
    - session (Object): Details of the specified session
*/
app.get("/api/sessions/:sessionId", async (req, res) => {
  try {
    const { sessionId } = req.params;
    const user = await User.findOne({ "sessions._id": sessionId });
    if (!user) return res.status(404).json({ message: "Session not found" });
    const session = user.sessions.id(sessionId);
    res.status(200).json({ session });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

///these are the aips for the ui

// 1. User Session Overview (Recent Sessions)
app.get("/get/api/sessions/recent", async (req, res) => {
  try {
    console.log('api entered line 222')
    const recentSessions = await Session.find()
      .sort({ sessionStart: -1 })
      .limit(10)
      .populate("userId", "userId");
    res.json(recentSessions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Average Session Duration
app.get("/get/api/sessions/average-duration", async (req, res) => {
  try {
    const avgSessionDuration = await Session.aggregate([
      { $match: { sessionEnd: { $exists: true } } },
      {
        $project: {
          duration: { $subtract: ["$sessionEnd", "$sessionStart"] },
        },
      },
      {
        $group: {
          _id: null,
          avgDuration: { $avg: "$duration" },
        },
      },
    ]);
    res.json(avgSessionDuration);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Keyword Analysis
app.get("/get/api/sessions/keywords", async (req, res) => {
  try {
    const keywordAnalysis = await Session.aggregate([
      { $unwind: "$keywords" },
      {
        $group: {
          _id: "$keywords",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);
    res.json(keywordAnalysis);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. Chat History Insights
app.get("/get/api/sessions/:sessionId/chat-history", async (req, res) => {
  const { sessionId } = req.params;
  try {
    const chatHistory = await Chat.find({ sessionId }).populate(
      "userId",
      "userId"
    );
    res.json(chatHistory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 5. Classification Breakdown
app.get("/get/api/sessions/classification", async (req, res) => {
  try {
    const classificationBreakdown = await Session.aggregate([
      {
        $group: {
          _id: "$classified",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);
    res.json(classificationBreakdown);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 6. Total Number of Sessions
app.get("/get/api/sessions/total", async (req, res) => {
  try {
    const totalSessions = await Session.countDocuments();
    res.json({ totalSessions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 7. Average Polarity Score
app.get("/get/api/sessions/average-polarity", async (req, res) => {
  try {
    const avgPolarity = await Session.aggregate([
      {
        $match: {
          polarity: { $exists: true },
        },
      },
      {
        $group: {
          _id: null,
          avgPolarity: { $avg: "$polarity" },
        },
      },
    ]);
    res.json(avgPolarity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//api to create a new user
// Create new userd
// Create new user
app.post("/api/addusers", async (req, res) => {
  console.log("Received request to add user:", req.body); // Log the incoming request
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }
    // Check if the user already exists
    const existingUser = await User.findOne({ userId });
    if (existingUser) {
      return res.status(409).json({ error: "User already exists" });
    }
    // Create and save the new user
    const newUser = new User({ userId, sessions: [] });
    await newUser.save();

    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    console.error("Error creating user:", error); // Log the error
    res
      .status(500)
      .json({ error: "An error occurred while creating the user" });
  }
});

// Run the server
const PORT = 3003;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
