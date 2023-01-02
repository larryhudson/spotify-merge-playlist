const EleventyFetch = require("@11ty/eleventy-fetch");
const cheerio = require("cheerio");

async function main() {
  const everyNoiseUrl =
    "https://everynoise.com/everynoise1d.cgi?scope=all&vector=popularity";

  let options = {
    duration: "1d",
    type: "text",
  };

  if (process.env.ELEVENTY_SERVERLESS) {
    // Infinite duration (until the next build)
    options.duration = "*";
    // Instead of ".cache" default because files/directories
    // that start with a dot are not bundled by default
    options.directory = "cache";
  }

  const html = await EleventyFetch(everyNoiseUrl, options);

  const $ = cheerio.load(html);

  let genres = [];

  $("tr").each((i, rowTag) => {
    const soundPlaylistId = $(rowTag)
      .find('a[href^="https://embed.spotify.com"]')
      .first()
      .attr("href")
      .split(":")
      .at(-1);

    const name = $(rowTag).find("td").eq(2).text();

    genres.push({ name, soundPlaylistId });
  });

  return genres;
}

module.exports = main;
