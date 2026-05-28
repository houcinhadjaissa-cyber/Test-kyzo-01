import { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { SYSTEM_PROMPT } from '../utils/promptEngine';

export function useAI(apiKey) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState("");

  const generateProject = async (userPrompt, currentFiles) => {
    setIsGenerating(true);
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // CONTEXT AWARENESS: We send the current file tree so the AI knows the state
    const context = `Current Project Files: ${JSON.stringify(currentFiles)}`;
    
    try {
      const result = await model.generateContent([
        SYSTEM_PROMPT,
        context,
        `User Request: ${userPrompt}`
      ]);
      
      const response = await result.response;
      const text = response.text();
      
      // Attempt to clean and parse the JSON logic
      const jsonResponse = JSON.parse(text.replace(/```json|```/g, ""));
      return jsonResponse;
    } catch (error) {
      console.error("CTO Engine Error:", error);
      return { error: "Failed to synthesize logic." };
    } finally {
      setIsGenerating(false);
    }
  };

  return { generateProject, isGenerating, progress };
}
