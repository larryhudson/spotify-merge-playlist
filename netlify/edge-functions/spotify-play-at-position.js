import { playAtPosition } from "./utils/play-at-position.js";

export default async function (request, context) {
  // read the name and the playlist IDs from the posted data

  const urlSearchParams = new URL(request.url).searchParams;

  const trackId = urlSearchParams.get("trackId");
  const seconds = parseFloat(urlSearchParams.get("position"));

  const spotifyAccessToken = context.cookies.get("spotify-access-token");

  const playResponse = await playAtPosition({
    trackId,
    positionMs: seconds * 1000,
    spotifyAccessToken,
  });

  return context.json(playResponse);
}
