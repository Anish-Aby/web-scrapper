// IMPORTS
const axios = require("axios");
const cheerio = require("cheerio");
const express = require("express");
const PORT = 8000;
const http = require("http");

const fs = require("fs");

// EXPRESS APP

const app = express();

app.listen(PORT, () => {
  console.log(`Server is up in port ${PORT}`);
});

// URLS

const baseURL = "https://emojipedia.org/";
const peopleURL = "https://emojipedia.org/people/";

// AXIOS FIRST PAGE

const peopleEmojiInstance = axios.create({
  baseURL: "https://emojipedia.org/",
  timeout: 0,
  httpAgent: new http.Agent({ keepAlive: true, keepAliveMsecs: 1000000 }),
});

peopleEmojiInstance
  .get("flags/")
  .then((response) => {
    const peopleHTML = response.data;
    const people$ = cheerio.load(peopleHTML);
    const peopleEmojiArray = [];

    people$(".emoji-list li", peopleHTML).each(function () {
      const emoji = people$(this).find(".emoji").text();
      let emojiName = people$(this).find("a").text().substring(3);
      const innerURL = people$(this).find("a").attr("href");

      peopleEmojiArray.push({
        emoji,
        emojiName,
        innerURL,
      });
    });
    fs.writeFile("./flags.json", JSON.stringify(peopleEmojiArray), (err) => {
      console.log(err);
    });
    console.log("Done writing.");
  })
  .catch((err) => {
    console.log(err);
  });
