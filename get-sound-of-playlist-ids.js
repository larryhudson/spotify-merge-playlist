const EleventyFetch = require("@11ty/eleventy-fetch");
const cheerio = require("cheerio");
const fs = require("fs");

async function main() {
  const everyNoiseUrl =
    "https://everynoise.com/everynoise1d.cgi?scope=all&vector=popularity";

  const html = await EleventyFetch(everyNoiseUrl, {
    duration: "1d",
    type: "text",
  });

  console.log(html);

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

  await fs.promises.writeFile(
    "./genres.json",
    JSON.stringify(genres, null, 2),
    { encoding: "utf-8" }
  );
}

main();
