export default async function (request, context) {
  const genres = await import("./generated/genres.json", {
    assert: { type: "json" },
  });

  const genreName = new URL(request.url).searchParams.get("genre");

  const foundGenre = genres.default.find((g) => g.name === genreName);

  return context.json(foundGenre);
}
