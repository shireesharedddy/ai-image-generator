// src/Components/ImageGenerator/ImageGenerator.jsx
import React, { useRef, useState } from "react";
import "./ImageGenerator.css";
import default_image from "../Assets/default_image.svg";

const ImageGenerator = () => {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  // Call backend POST endpoint instead of using Unsplash key in frontend
  const imageGenerator = async () => {
    const prompt = inputRef.current.value.trim();
    if (!prompt) return;

    setLoading(true);
    setError("");
    setImageUrl(null);

    try {
      const response = await fetch("/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error(`Backend error (status: ${response.status})`);
      }

      const data = await response.json();
      console.log("Backend response:", data);

      if (data.imageUrl) {
        setImageUrl(data.imageUrl);
      } else {
        setError("No image found. Try another keyword.");
      }
    } catch (err) {
      console.error("Error fetching image:", err);
      setError(err.message || "Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !loading) {
      imageGenerator();
    }
  };

  return (
    <div className="ai-image-generator">
      <div className="header">
        AI <span>Image Generator</span>
      </div>

      <div className="img-loading">
        <div className="image">
          <img src={imageUrl || default_image} alt="Generated result" />
        </div>

        {loading && (
          <div className="loading">
            <div className="loading-bar-full"></div>
            <div className="loading-text">Fetching image...</div>
          </div>
        )}

        {error && <div className="error-message">{error}</div>}
      </div>

      <div className="search-box">
        <input
          type="text"
          ref={inputRef}
          className="search-input"
          placeholder="Search Unsplash images..."
          onKeyDown={handleKeyDown}
          disabled={loading}
        />
        <button
          className="generate-btn"
          onClick={imageGenerator}
          disabled={loading}
        >
          {loading ? "Fetching..." : "Search"}
        </button>
      </div>
    </div>
  );
};

export default ImageGenerator;
