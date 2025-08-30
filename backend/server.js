const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch"); // Make sure to install: npm i node-fetch
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const UNSPLASH_KEY = process.env.UNSPLASH_ACCESS_KEY;

// Optional: root route to check if backend is running
app.get("/", (req, res) => {
  res.send("AI Image Generator Backend is running!");
});

// POST endpoint to generate image from Unsplash
app.post("/generate-image", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "Prompt is required" });

    if (!UNSPLASH_KEY)
      return res.status(500).json({ error: "Unsplash API key is missing" });

    // Fetch image from Unsplash API
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
        prompt
      )}&per_page=1&client_id=${UNSPLASH_KEY}`
    );

    if (!response.ok) {
      return res.status(response.status).json({ error: "Unsplash API error" });
    }

    const data = await response.json();
    if (data.results && data.results.length > 0) {
      res.json({ imageUrl: data.results[0].urls.regular });
    } else {
      res.json({ imageUrl: null });
    }
  } catch (error) {
    console.error("Error generating image:", error.message);
    res.status(500).json({ error: "Failed to generate image" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);
