import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Box, Typography, Paper } from "@mui/material";

// Define TypeScript interfaces for your data structures
interface Session {
  _id: string;
  userId: string;
  sessionStart: string; // or Date if you prefer
  sessionEnd: string | null; // can be null if the session hasn't ended
  polarity: number; // Assuming polarity is stored in the session
  intensity: number; // Assuming intensity is stored in the session
}

interface KeywordAnalysis {
  _id: string;
  count: number;
}

interface ClassificationBreakdown {
  _id: string;
  count: number;
}

interface SentimentOverTime {
  _id: string; // date
  avgPolarity: number;
}

interface IntensityOverTime {
  _id: string; // date
  avgIntensity: number;
}

const StatsPage: React.FC = () => {
  const [recentSessions, setRecentSessions] = useState<Session[]>([]);
  const [avgDuration, setAvgDuration] = useState<number | null>(null);
  const [keywordAnalysis, setKeywordAnalysis] = useState<KeywordAnalysis[]>([]);
  const [classificationBreakdown, setClassificationBreakdown] = useState<
    ClassificationBreakdown[]
  >([]);
  const [totalSessions, setTotalSessions] = useState<number>(0);
  const [avgPolarity, setAvgPolarity] = useState<number | null>(null);
  const [sentimentOverTime, setSentimentOverTime] = useState<
    SentimentOverTime[]
  >([]);
  const [intensityOverTime, setIntensityOverTime] = useState<
    IntensityOverTime[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch recent sessions
        const recentRes = await axios.get<Session[]>("/api/sessions/recent");
        setRecentSessions(recentRes.data);

        // Fetch average duration
        const durationRes = await axios.get<{ avgDuration: number }[]>(
          "/api/sessions/average-duration"
        );
        setAvgDuration(durationRes.data[0]?.avgDuration || 0);

        // Fetch keyword analysis
        const keywordsRes = await axios.get<KeywordAnalysis[]>(
          "/api/sessions/keywords"
        );
        setKeywordAnalysis(keywordsRes.data);

        // Fetch classification breakdown
        const classificationRes = await axios.get<ClassificationBreakdown[]>(
          "/api/sessions/classification"
        );
        setClassificationBreakdown(classificationRes.data);

        // Fetch total sessions
        const totalRes = await axios.get<{ totalSessions: number }>(
          "/api/sessions/total"
        );
        setTotalSessions(totalRes.data.totalSessions);

        // Fetch average polarity
        const polarityRes = await axios.get<{ avgPolarity: number }[]>(
          "/api/sessions/average-polarity"
        );
        setAvgPolarity(polarityRes.data[0]?.avgPolarity || 0);

        // Fetch sentiment over time
        const sentimentRes = await axios.get<SentimentOverTime[]>(
          "/api/sessions/sentiment-over-time"
        );
        setSentimentOverTime(sentimentRes.data);

        // Fetch intensity over time
        const intensityRes = await axios.get<IntensityOverTime[]>(
          "/api/sessions/intensity-over-time"
        );
        setIntensityOverTime(intensityRes.data);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Box
      sx={{
        backgroundColor: "#121212", // Dark background
        color: "white", // Text color for better contrast
        minHeight: "100vh",
        padding: 3,
      }}
    >
      <Typography variant="h1" gutterBottom>
        Statistics Dashboard
      </Typography>

      <Paper sx={{ padding: 2, backgroundColor: "#1e1e1e", marginBottom: 3 }}>
        <Typography variant="h2">Recent Sessions</Typography>
        <table style={{ width: "100%", marginTop: 10, color: "white" }}>
          <thead>
            <tr>
              <th>User ID</th>
              <th>Session Start</th>
              <th>Session End</th>
              <th>Duration</th>
            </tr>
          </thead>
          <tbody>
            {recentSessions.map((session) => (
              <tr key={session._id}>
                <td>{session.userId}</td>
                <td>{new Date(session.sessionStart).toLocaleString()}</td>
                <td>
                  {session.sessionEnd
                    ? new Date(session.sessionEnd).toLocaleString()
                    : "N/A"}
                </td>
                <td>
                  {session.sessionEnd
                    ? Math.round(
                        (new Date(session.sessionEnd).getTime() -
                          new Date(session.sessionStart).getTime()) /
                          1000
                      )
                    : "N/A"}{" "}
                  seconds
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Paper>

      <Paper sx={{ padding: 2, backgroundColor: "#1e1e1e", marginBottom: 3 }}>
        <Typography variant="h2">Average Session Duration</Typography>
        <p>
          {avgDuration
            ? `${Math.round(avgDuration / 1000)} seconds`
            : "Loading..."}
        </p>
      </Paper>

      <Paper sx={{ padding: 2, backgroundColor: "#1e1e1e", marginBottom: 3 }}>
        <Typography variant="h2">Keyword Analysis</Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={keywordAnalysis}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="_id" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </Paper>

      <Paper sx={{ padding: 2, backgroundColor: "#1e1e1e", marginBottom: 3 }}>
        <Typography variant="h2">Classification Breakdown</Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={classificationBreakdown}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="_id" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </Paper>

      <Paper sx={{ padding: 2, backgroundColor: "#1e1e1e", marginBottom: 3 }}>
        <Typography variant="h2">Sentiment Over Time</Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={sentimentOverTime}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="_id" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="avgPolarity" fill="#ff7300" />
          </BarChart>
        </ResponsiveContainer>
      </Paper>

      <Paper sx={{ padding: 2, backgroundColor: "#1e1e1e", marginBottom: 3 }}>
        <Typography variant="h2">Intensity Over Time</Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={intensityOverTime}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="_id" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="avgIntensity" fill="#00c49f" />
          </BarChart>
        </ResponsiveContainer>
      </Paper>

      <Paper sx={{ padding: 2, backgroundColor: "#1e1e1e", marginBottom: 3 }}>
        <Typography variant="h2">Total Sessions</Typography>
        <p>{totalSessions}</p>
      </Paper>

      <Paper sx={{ padding: 2, backgroundColor: "#1e1e1e", marginBottom: 3 }}>
        <Typography variant="h2">Average Polarity Score</Typography>
        <p>{avgPolarity !== null ? avgPolarity.toFixed(2) : "Loading..."}</p>
      </Paper>
    </Box>
  );
};

export default StatsPage;
