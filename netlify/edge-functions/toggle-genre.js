export default function (request, context) {
  const chosenGenresJson = context.cookies.get("chosenGenres") || "[]";
  const chosenGenres = JSON.parse(chosenGenresJson);

  const thisGenre = new URL(request.url).searchParams.get("genre");
  const action = new URL(request.url).searchParams.get("action");

  let newGenres;

  if (action === "add") {
    newGenres = Array.from(new Set([...chosenGenres, thisGenre])).filter(
      (g) => g !== ""
    );
  } else {
    newGenres = chosenGenres.filter((g) => g !== thisGenre && g !== "");
  }

  context.cookies.set({
    name: "chosenGenres",
    value: JSON.stringify(newGenres),
  });

  const returnTo = new URL(request.url).searchParams.get("return_to");

  return new Response(null, {
    status: 307,
    headers: {
      Location: returnTo,
    },
  });
}
