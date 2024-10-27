const express = require("express");
const mongoose = require("mongoose");
const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://megathon:megathon@cluster-megathon.ttspl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster-megathon"
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

// Define Schemas
const ChatSchema = new mongoose.Schema({
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Session",
  },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  question: { type: String, required: true },
  answer: { type: String, required: true },
  polarity: { type: Number, required: true },
  data: { type: Object, default: {} },
  timestamp: { type: Date, default: Date.now },
});

const SessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  sessionStart: { type: Date, default: Date.now },
  sessionEnd: { type: Date },
  polarity: { type: Number },
  keywords: { type: [String] },
  classified: { type: String },
  severity: { type: Number },
  improvement: { type: String },
  chatHistory: [ChatSchema],
});

const UserSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  sessions: [SessionSchema],
  context: { type: String, default: "" },
});

// Models
const User = mongoose.model("User", UserSchema);
const Session = mongoose.model("Session", SessionSchema);
const Chat = mongoose.model("Chat", ChatSchema);

// Middleware for error handling
const errorHandler = (err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "An error occurred", error: err.message });
};

// Helper function to find user
const findUserById = async (userId) => {
  return await User.findOne({ userId });
};

// Start a New Session
app.post("/api/sessions/start", async (req, res) => {
  try {
    const { userId } = req.body;
    const newSession = { userId, sessionStart: new Date(), chatHistory: [] };
    const user = await findUserById(userId);

    // If user doesn't exist, create a new one
    if (!user) {
      const newUser = new User({ userId, sessions: [newSession] });
      await newUser.save();
      const sessionId = newUser.sessions[0]._id;
      return res.status(201).json({ sessionId });
    }

    // Update existing user with a new session
    user.sessions.push(newSession);
    await user.save();
    const sessionId = user.sessions[user.sessions.length - 1]._id;

    res.status(201).json({ sessionId });
  } catch (err) {
    next(err);
  }
});

// Add Chat Message to Session
app.post("/api/sessions/:sessionId/chats", async (req, res, next) => {
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

    // Format the new entry for context
    const formattedContext = `\nUser: ${question}\nAI: ${answer}\n`;

    // Find the user by session and retrieve the context
    const user = await User.findOne({ "sessions._id": sessionId });
    if (!user) return res.status(404).json({ message: "Session not found" });

    // Update the chat history and context
    await User.updateOne(
      { "sessions._id": sessionId },
      {
        $push: { "sessions.$.chatHistory": chatMessage },
        $set: { context: (user.context || "") + formattedContext },
      }
    );

    // Retrieve the updated session to send back in the response
    const updatedUser = await User.findOne({ "sessions._id": sessionId });
    const updatedSession = updatedUser.sessions.id(sessionId);

    res.status(200).json({ message: "Chat added", session: updatedSession });
  } catch (err) {
    next(err);
  }
});

// End a Session with Summary Data
app.put("/api/sessions/:sessionId/end", async (req, res, next) => {
  try {
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
    next(err);
  }
});

// Retrieve All Sessions for a User
app.get("/api/users/:userId/sessions", async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await findUserById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ sessions: user.sessions });
  } catch (err) {
    next(err);
  }
});

// Retrieve Specific Session Details
app.get("/api/sessions/:sessionId", async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const user = await User.findOne({ "sessions._id": sessionId });
    if (!user) return res.status(404).json({ message: "Session not found" });
    const session = user.sessions.id(sessionId);
    res.status(200).json({ session });
  } catch (err) {
    next(err);
  }
});

// UI APIs

// 1. User Session Overview (Recent Sessions)
app.get("/get/api/sessions/recent", async (req, res, next) => {
  try {
    const recentSessions = await Session.find()
      .sort({ sessionStart: -1 })
      .limit(10)
      .populate("userId", "userId");
    res.json(recentSessions);
  } catch (error) {
    next(error);
  }
});

// 2. Average Session Duration
app.get("/get/api/sessions/average-duration", async (req, res, next) => {
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
    next(error);
  }
});

// 3. Keyword Analysis
app.get("/get/api/sessions/keywords", async (req, res, next) => {
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
    next(error);
  }
});

// 4. Chat History Insights
app.get("/get/api/sessions/:sessionId/chat-history", async (req, res, next) => {
  const { sessionId } = req.params;
  try {
    const chatHistory = await Chat.find({ sessionId }).populate(
      "userId",
      "userId"
    );
    res.json(chatHistory);
  } catch (error) {
    next(error);
  }
});

// 5. Classification Breakdown
app.get("/get/api/sessions/classification", async (req, res, next) => {
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
    next(error);
  }
});

// 6. Total Number of Sessions
app.get("/get/api/sessions/total", async (req, res, next) => {
  try {
    const totalSessions = await Session.countDocuments();
    res.json({ totalSessions });
  } catch (error) {
    next(error);
  }
});

// Error handling middleware
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 3007;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
