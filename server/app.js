const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); // CORS added for cross-origin requests
const app = express();
app.use(cors());
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
app.post("/api/sessions/start", async (req, res, next) => {
  try {
    const { userId } = req.body;
    const newSession = { userId, sessionStart: new Date(), chatHistory: [] };
    const user = await findUserById(userId);

    if (!user) {
      const newUser = new User({ userId, sessions: [newSession] });
      await newUser.save();
      const sessionId = newUser.sessions[0]._id;
      return res.status(201).json({ sessionId });
    }

    user.sessions.push(newSession);
    await user.save();
    const sessionId = user.sessions[user.sessions.length - 1]._id;
    res.status(201).json({ sessionId });
  } catch (err) {
    next(err);
  }
});

// In your Express app file
app.post("/api/chat", async (req, res) => {
  const { message } = req.body; // No sessionId from body

  if (!message || !sessionId) {
    return res
      .status(400)
      .json({ error: "Message and sessionId are required" });
  }

  try {
    const chatResponse = await fetch("http://127.0.0.1:8080/output", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    if (!chatResponse.ok) {
      throw new Error("Failed to fetch response from chat API");
    }

    const chatData = await chatResponse.json();
    const { response } = chatData;

    const chatLogData = {
      userId: "671dac335809f9a6aea0d4dd",
      question: message,
      answer: response,
      polarity: 0,
    };

    const logResponse = await fetch(
      `http://127.0.0.1:3000/api/sessions/${sessionId}/chats`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(chatLogData),
      }
    );

    if (!logResponse.ok) {
      throw new Error("Failed to save chat log");
    }

    const result = await logResponse.json();

    return res.json({ response }); // Use res.json to send response
  } catch (error) {
    console.error("Error handling chat request:", error);
    return res.status(500).json({ error: "An error occurred" }); // Send error response
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

    const formattedContext = "\n"+`User: ${question}\nAI: ${answer}`+
    "\n";

    const user = await User.findOne({ "sessions._id": sessionId });
    if (!user) return res.status(404).json({ message: "Session not found" });

    const newContext = (user.context || "") + formattedContext;

    await User.updateOne(
      { "sessions._id": sessionId },
      {
        $push: { "sessions.$.chatHistory": chatMessage },
        $set: { context: newContext },
      }
    );

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

app.get("/get/api/sessions/average-duration", async (req, res, next) => {
  try {
    const avgSessionDuration = await Session.aggregate([
      { $match: { sessionEnd: { $exists: true } } },
      {
        $project: { duration: { $subtract: ["$sessionEnd", "$sessionStart"] } },
      },
      { $group: { _id: null, avgDuration: { $avg: "$duration" } } },
    ]);
    res.json(avgSessionDuration);
  } catch (error) {
    next(error);
  }
});

app.get("/get/api/sessions/keywords", async (req, res, next) => {
  try {
    const keywordAnalysis = await Session.aggregate([
      { $unwind: "$keywords" },
      { $group: { _id: "$keywords", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    res.json(keywordAnalysis);
  } catch (error) {
    next(error);
  }
});

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

app.get("/get/api/sessions/classification", async (req, res, next) => {
  try {
    const classificationBreakdown = await Session.aggregate([
      { $group: { _id: "$classified", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    res.json(classificationBreakdown);
  } catch (error) {
    next(error);
  }
});

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
const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
