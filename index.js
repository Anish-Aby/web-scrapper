// IMPORTS
const axios = require("axios");
const cheerio = require("cheerio");
const express = require("express");
const PORT = 8000;
const http = require("http");

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
  timeout: 60000,
  httpAgent: new http.Agent({ keepAlive: true }),
});

peopleEmojiInstance.get("people/").then((response) => {
  const peopleHTML = response.data;
  const people$ = cheerio.load(peopleHTML);
  const peopleEmojiArray = [];

  people$(".emoji-list li", peopleHTML).each(function () {
    const emoji = people$(this).find(".emoji").text();
    const innerURL = people$(this).find("a").attr("href");

    // AXIOS SECOND PAGE (DESCRIPTION)

    peopleEmojiInstance.get(innerURL).then((response) => {
      const peopleEmojiHTML = response.data;
      const peopleEmoji$ = cheerio.load(peopleEmojiHTML);

      peopleEmoji$(".description", peopleEmojiHTML).each(function () {
        const description = peopleEmoji$(this).find("p:first").text();

        peopleEmojiArray.push({
          emoji,
          description,
          innerURL,
        });
      });
      console.log(peopleEmojiArray);
      console.log(peopleEmojiArray.length);
    });
    // SECOND PAGE OVER
  });
});
