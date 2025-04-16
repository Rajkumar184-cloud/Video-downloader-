const express = require("express");
const bodyParser = require("body-parser");
const youtubedl = require("youtube-dl-exec");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static("public"));

app.post("/download", async (req, res) => {
  const { videoUrl, resolution } = req.body;
  const output = `downloads/video-${Date.now()}.mp4`;

  let format = "best";
  if (resolution === "4k") format = "bestvideo[height<=2160]+bestaudio/best";
  else if (resolution === "1080p") format = "bestvideo[height<=1080]+bestaudio/best";
  else if (resolution === "720p") format = "bestvideo[height<=720]+bestaudio/best";
  else if (resolution === "480p") format = "bestvideo[height<=480]+bestaudio/best";
  else if (resolution === "360p") format = "bestvideo[height<=360]+bestaudio/best";
  else if (resolution === "audio") format = "bestaudio";

  try {
    await youtubedl(videoUrl, {
      output,
      format,
      mergeOutputFormat: "mp4",
    });

    res.json({ downloadUrl: `/${output}` });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.use("/downloads", express.static(path.join(__dirname, "downloads")));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});