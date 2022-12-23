const fetch = require("node-fetch");
const { builder } = require("@netlify/functions");
const cheerio = require("cheerio");
const fs = require("fs");

async function getSimilarGenres(genreNames) {
  const everyNoiseParams = new URLSearchParams({
    scope: "all",
  });

  genreNames.forEach((genre) => everyNoiseParams.append("root", genre));

  const everyNoiseHtml = await fetch(
    `https://everynoise.com/everynoise1d.cgi?${everyNoiseParams.toString()}`
  ).then((r) => r.text());

  const $ = cheerio.load(everyNoiseHtml);

  console.log(everyNoiseHtml);

  const genres = [];

  $("tr:not(.current)")
    .slice(0, 10)
    .each((i, rowTag) => {
      const name = $(rowTag).find("td").eq(2).find("a").first().text();

      const dataString = $(rowTag).find("td").eq(0).attr("title");

      const [overlapStr, distanceStr] = dataString.split(",");
      const overlap = overlapStr.split(":").at(-1).trim();
      const distance = distanceStr.split(":").at(-1).trim();

      const soundPlaylistId = $(rowTag)
        .find("td")
        .eq(1)
        .find("a")
        .first()
        .attr("href")
        .split(":")
        .at(-1);

      genres.push({
        name,
        overlap,
        distance,
        soundPlaylistId,
      });
    });

  return genres;
}

async function handler(event) {
  // example path: /similar-genres/indie%20rock/pop
  const rootGenres = event.path.split("/").slice(2).map(decodeURIComponent); // turn indie%20rock into indie rock

  const genres = await getSimilarGenres(rootGenres);

  // logic to generate the required content
  return {
    statusCode: 200,
    body: JSON.stringify({ genres, fetched: new Date() }),
    headers: {
      "Content-Type": "application/json",
    },
    ttl: 60 * 60 * 24 * 7, // 7 days
  };
}

exports.handler = builder(handler);
