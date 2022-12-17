import { readJson } from "https://deno.land/std/fs/mod.ts";

export default async function (request, context) {
  const genres = await readJson("./generated/genres.json");

  const genreName = new URL(request.url).searchParams.get("genre");

  const foundGenre = genres.find((g) => g.name === genreName);

  return context.json(foundGenre);
}
