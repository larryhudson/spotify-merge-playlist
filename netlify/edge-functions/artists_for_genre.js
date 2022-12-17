import cheerio from "https://esm.sh/cheerio";
import genresJson from "./generated/genres.json" assert { type: "json" };

export default async function (request, context) {
  const genreName = new URL(request.url).searchParams.get("genre");

  const foundGenre = genresJson.find((g) => g.name === genreName);

  // fetch the ENAO page with artists
  const everyNoiseHtml = await fetch(
    `https://everynoise.com/research.cgi?mode=genre&name=${foundGenre.name}`
  ).then((r) => r.text());

  const $ = cheerio.load(everyNoiseHtml);

  let artists = [];

  $(".box")
    .slice(0, 5)
    .each((i, divTag) => {
      const name = $(divTag)
        .find(".artistname")
        .first()
        .find("a")
        .first()
        .text();

      const artistId = $(divTag)
        .find(".artistname")
        .first()
        .find("a")
        .first()
        .attr("href")
        .split("=")
        .at(-1);

      artists.push({
        name,
        artistId,
      });
    });

  // fetch the sound playlist

  return context.json(artists);
}
