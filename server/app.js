require("dotenv").config();
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Upload endpoint
app.post("/api/upload", upload.single("image"), (req, res) => {
  try {
    res.json({
      imagePath: `/uploads/${req.file.filename}`,
      imageType: req.file.mimetype,
    });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ error: "Failed to upload image" });
  }
});

// Generate caption endpoint
app.post("/api/generate-caption", async (req, res) => {
  try {
    const { imagePath } = req.body;
    const fullPath = path.join(__dirname, imagePath);

    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({ error: "Image file not found" });
    }

    // Read the image file
    const imageBuffer = fs.readFileSync(fullPath);
    const imageBase64 = imageBuffer.toString("base64");

    const response = await axios.post(
        "https://api-inference.huggingface.co/models/nlpconnect/vit-gpt2-image-captioning",
        { inputs: imageBase64 },
        {
          headers: {
            Authorization: `Bearer ${process.env.HF_API_KEY}`,
            "Content-Type": "application/json",
          },
          timeout: 30000,
        }
      );
      

    if (!response.data || !response.data[0]?.generated_text) {
      return res.status(502).json({
        error: "Invalid response from Hugging Face",
        details: response.data,
      });
    }

    res.json({ caption: response.data[0].generated_text });
  } catch (error) {
    console.error("Caption Generation Error:", {
      message: error.message,
      stack: error.stack,
      response: error.response?.data,
    });

    let errorMessage = "Failed to generate caption";
    if (error.response?.data?.error) {
      errorMessage = error.response.data.error;
    } else if (error.message.includes("timeout")) {
      errorMessage = "Request timed out - model may be loading";
    }

    res.status(500).json({
      error: errorMessage,
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
