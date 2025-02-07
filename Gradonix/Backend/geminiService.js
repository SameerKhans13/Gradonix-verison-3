import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const generateStudyPlan = async (
  className,
  chapter,
  currentMarks,
  targetMarks,
  totalMarks,
  studyHours
) => {
  const prompt = `Create a detailed study plan for a student in class ${className} studying chapters ${chapter} of NCERT text book. 
    Current marks: ${currentMarks}, target marks: ${targetMarks}, total marks: ${totalMarks}, 
    study hours per day: ${studyHours} and even mention how many days required to complete the chapter as per study hours per day. Provide a paragraph on how to increase marks and a complete study table with heading of Study Table: and column named with day , topic ,Time in hours, Activities and marks.`;
  const result = await model.generateContent(prompt);
  return result.response.text();
};
