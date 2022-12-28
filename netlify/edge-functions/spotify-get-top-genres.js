import { getTopGenres } from "./utils/get-top-genres.js";

export default async function (request, context) {
  const timeRange =
    new URL(request.url).searchParams.get("time_range") || "medium_term";

  const spotifyAccessToken = context.cookies.get("spotify-access-token");

  try {
    const topTwentyGenres = await getTopGenres({
      spotifyAccessToken,
      timeRange,
    });

    return context.json(topTwentyGenres);
  } catch (err) {
    console.log("should be returning error");
    console.log({ err: JSON.stringify(err) });
    return new Response(
      JSON.stringify({
        error: err.error.message,
      }),
      {
        status: err.error.status,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
