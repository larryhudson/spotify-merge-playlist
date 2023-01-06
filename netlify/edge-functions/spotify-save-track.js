import { saveTrack } from "./utils/save-track.js";

export default async function (request, context) {
  // read the name and the playlist IDs from the posted data

  const trackId = new URL(request.url).searchParams.get("trackId");

  const spotifyAccessToken = context.cookies.get("spotify-access-token");

  const savedTrack = await saveTrack({
    trackId,
    spotifyAccessToken,
  });

  return context.json({ status: savedTrack });
}
