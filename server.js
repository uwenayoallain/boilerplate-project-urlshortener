const urls = require("./urls");
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

function random(start, end) {
  return Math.floor(Math.random() * (end - start + 1) + start);
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(`/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

app.post("/api/shorturl", function (req, res) {
  const url = req.body.url;
  if (url.includes("http://") || url.includes("https://")) {
    let shortUrl = random(0, 10000);
    let urlObj = urls.find((obj) => obj.original_url === url);
    if (urlObj) {
      shortUrl = urlObj.short_url;
    } else {
      urls.push({ original_url: url, short_url: shortUrl });
    }

    res.status(200).json({ original_url: url, short_url: shortUrl });
    console.log(urls);
  } else {
    return res.status(400).json({
      error: "invalid URL",
    });
  }
});

app.get("/api/shorturl/:shortUrl", function (req, res) {
  console.log(urls);
  const shortUrl = req.params.shortUrl;
  const urlObj = urls.find((obj) => obj.short_url === parseInt(shortUrl));
  if (urlObj) {
    res.redirect(urlObj.original_url);
  } else {
    return res.status(400).json({
      error: "invalid URL",
    });
  }
});

// listen for requests :)
app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});