import genresJson from "./generated/genres.json" assert { type: "json" };

export default function (request, context) {
  const genreName = new URL(request.url).searchParams.get("genre");

  const foundGenre = genresJson.find((g) => g.name === genreName);

  return context.json(foundGenre);
}
