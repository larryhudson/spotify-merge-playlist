import cheerio from "https://esm.sh/cheerio";
import { readJson } from "https://deno.land/std/fs/mod.ts";

export default async function (request, context) {
  const genresJson = await readJson("./generated/genres.json");

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

      genres.push({
        name,
        overlap,
        distance,
      });
    });

  // fetch the sound playlist

  return context.json(genres);
}
