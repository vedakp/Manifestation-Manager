import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
const PORT = 3000;

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// API Route: Generate Roadmap
app.post("/api/generate-roadmap", async (req, res) => {
  try {
    const { goal, price } = req.body;
    
    if (!goal) {
      return res.status(400).json({ error: "Goal is required" });
    }

    const prompt = `As a friendly, supportive manifestation coach, break down this goal into 3 to 5 actionable steps. Keep it simple, encouraging, and somewhat playful. 
    Goal: ${goal}
    ${price ? `Target Price: $${price}` : ''}
    
    Format the response as a JSON array of strings, where each string is a step. Return ONLY the JSON array, no markdown formatting or extra text. Example: ["Step 1 description", "Step 2 description"]`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const roadmapText = response.text;
    if (!roadmapText) {
       return res.status(500).json({ error: "No response from AI" });
    }
    
    const steps = JSON.parse(roadmapText);
    res.json({ steps });
  } catch (error) {
    console.error("Error generating roadmap:", error);
    res.status(500).json({ error: "Failed to generate roadmap" });
  }
});

// API Route: Generate Daily Affirmation
app.post("/api/generate-affirmation", async (req, res) => {
    try {
      const { goals } = req.body;
      let prompt = "Generate a short, powerful, positive daily affirmation for a manifestation journal. Keep it kid-friendly, uplifting, and under 15 words.";
      if (goals && goals.length > 0) {
          const goalTitles = goals.map((g: any) => g.title).join(", ");
          prompt = `Generate a short, powerful, positive daily affirmation tailored to someone working towards these goals: ${goalTitles}. Keep it kid-friendly, playful, uplifting, and under 15 words.`;
      }
  
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
  
      res.json({ affirmation: response.text?.replace(/["']/g, '').trim() });
    } catch (error) {
      console.error("Error generating affirmation:", error);
      res.status(500).json({ error: "Failed to generate affirmation" });
    }
  });

// API Route: Reframe Goal Intention
app.post("/api/reframe-goal", async (req, res) => {
  try {
    const { text } = req.body;
    const prompt = `You are a manifestation coach. Analyze this goal text for limiting language or scarcity mindset (e.g. "I hope to afford", "I wish I had", "Not be broke"). If it has limiting language, rewrite it into a positive, empowered, present-tense abundance statement (e.g. "I am an open channel for wealth and easily manifest..."). If it's already good, return the original text. Return ONLY a JSON object: {"reframedText": "..."}`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });
    
    const data = JSON.parse(response.text || '{"reframedText": ""}');
    res.json({ reframedText: data.reframedText || text });
  } catch (error) {
    console.error("Error reframing goal:", error);
    res.status(500).json({ error: "Failed to reframe goal" });
  }
});



async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
