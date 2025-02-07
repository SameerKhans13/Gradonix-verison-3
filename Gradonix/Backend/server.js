import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { generateStudyPlan } from "./geminiService.js";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// API Route to generate study plan
app.post("/generate-study-plan", async (req, res) => {
  const {
    className,
    chapter,
    currentMarks,
    targetMarks,
    totalMarks,
    studyHours,
  } = req.body;

  if (!GEMINI_API_KEY) {
    return res.status(500).json({ error: "API key is missing!" });
  }

  console.log(
    className,
    chapter,
    currentMarks,
    targetMarks,
    totalMarks,
    studyHours
  );

  if (
    !className ||
    !chapter ||
    !currentMarks ||
    !targetMarks ||
    !totalMarks ||
    !studyHours
  ) {
    return res.status(400).json({ error: "All fields are required!" });
  }

  try {
    const response = await generateStudyPlan(
      className,
      chapter,
      currentMarks,
      targetMarks,
      totalMarks,
      studyHours
    );
    // console.log(response);

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
