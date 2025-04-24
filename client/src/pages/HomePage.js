import React, { useState, useEffect } from "react";
import axios from "axios";
import ImageUploader from "../components/ImageUploader";
import ImageFilters from "../components/ImageFilters";

const HomePage = () => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [imagePath, setImagePath] = useState(null);
  const [caption, setCaption] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  const handleImageUpload = async (file) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setError("Please upload a JPEG, PNG, or WebP image.");
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      setError("Image too large (max 4MB)");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      setError(null);
      const response = await axios.post(`${BASE_URL}/api/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setImagePath(response.data.imagePath);
      setPreviewUrl(URL.createObjectURL(file));
    } catch (error) {
      console.error("Upload Error:", error);
      setError(
        `Upload failed: ${error.response?.data?.error || error.message}`
      );
    }
  };

  const generateCaption = async () => {
    if (!imagePath) {
      setError("Please upload an image first");
      return;
    }

    setIsLoading(true);
    setError(null);
    setCaption("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/generate-caption",
        { imagePath },
        { timeout: 40000 } // 40 seconds timeout
      );

      setCaption(response.data.caption);
    } catch (error) {
      console.error("Caption Error:", error);

      let errorMessage = "Caption generation failed";
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.code === "ECONNABORTED") {
        errorMessage = "Request timed out - the model might be loading";
      } else if (error.response?.data?.details) {
        errorMessage += `: ${JSON.stringify(error.response.data.details)}`;
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <h1>AI Image Caption Generator</h1>
      <p>Upload an image and get an AI-generated caption</p>

      {error && (
        <div
          style={{
            color: "red",
            padding: "10px",
            margin: "20px 0",
            border: "1px solid red",
            borderRadius: "4px",
            backgroundColor: "#fff0f0",
          }}
        >
          {error}
        </div>
      )}

      <ImageUploader onImageUpload={isLoading ? null : handleImageUpload} />

      {previewUrl && (
        <div style={{ margin: "20px 0" }}>
          <ImageFilters image={previewUrl} />
        </div>
      )}

      <button
        onClick={generateCaption}
        disabled={isLoading || !previewUrl}
        style={{
          padding: "12px 24px",
          background: isLoading || !previewUrl ? "#cccccc" : "#3f51b5",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: isLoading || !previewUrl ? "not-allowed" : "pointer",
          marginTop: "20px",
          fontSize: "16px",
          fontWeight: "bold",
          transition: "background 0.3s",
        }}
      >
        {isLoading ? (
          <>
            <span className="spinner" style={{ marginRight: "8px" }}>
              🌀
            </span>
            Generating...
          </>
        ) : (
          "Generate Caption"
        )}
      </button>

      {caption && (
        <div
          style={{
            marginTop: "30px",
            padding: "20px",
            background: "#f8f9fa",
            borderRadius: "8px",
            border: "1px solid #e0e0e0",
          }}
        >
          <h3 style={{ marginTop: 0 }}>Generated Caption:</h3>
          <p style={{ fontSize: "18px", lineHeight: "1.6" }}>{caption}</p>
        </div>
      )}
    </div>
  );
};

export default HomePage;
