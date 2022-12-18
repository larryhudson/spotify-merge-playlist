import cheerio from "https://esm.sh/cheerio";
import genresJson from "./generated/genres.json" assert { type: "json" };

export default async function (request, context) {
  const genreName = new URL(request.url).searchParams.get("genre");

  const foundGenre = genresJson.find((g) => g.name === genreName);

  // fetch the ENAO page with sorted genres
  const everyNoiseHtml = await fetch(
    `https://everynoise.com/everynoise1d.cgi?root=${foundGenre.name}&scope=all`
  ).then((r) => r.text());

  const $ = cheerio.load(everyNoiseHtml);

  let genres = [];

  $("tr")
    .slice(0, 10)
    .each((i, rowTag) => {
      if ($(rowTag).hasClass("current")) return;

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

  // fetch the sound playlist

  return context.json(genres);
}
