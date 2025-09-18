const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const OpenAI = require("openai");

dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

// System prompt (trimmed for readability)
const SYSTEM_PROMPT = `
You are a friendly, helpful cooking assistant. Generate at least 3 recipes from the user's ingredients.
For each recipe return a JSON object with fields:
title, description, ingredients (array), instructions (array), time, serving_suggestion, dietary_labels (array), shopping_list (array), category.
Return the full response as a JSON object: { recipes: [...], feedback_prompt: "..." }.
Keep language simple and friendly.
`;

app.post("/generate-recipe", async (req, res) => {
  try {
    const { ingredients = [], dietaryPreference = "" } = req.body;
    const userPrompt = `
Ingredients: ${Array.isArray(ingredients) ? ingredients.join(", ") : ingredients}
Dietary Preference: ${dietaryPreference || "None"}
Please respond in JSON only.
`;

    // Call OpenAI Chat Completions
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.8,
      max_tokens: 800,
    });

    const text = completion.choices[0].message.content;
    // Try to parse JSON - AI should return JSON
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (e) {
      // If parsing fails, wrap the plain text in a simple JSON
      parsed = { recipes: [], raw: text, feedback_prompt: "Could not parse AI output as JSON." };
    }

    res.json(parsed);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Recipe generation failed!", details: String(error) });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Smart Recipe Generator running on http://localhost:${PORT}`);
});