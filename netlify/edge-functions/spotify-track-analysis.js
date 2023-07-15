import { lookupTrackAnalysis } from "./utils/lookup-track-features.js";

export default async function (request, context) {
  // read the name and the playlist IDs from the posted data

  const trackId = new URL(request.url).searchParams.get("trackId");

  const spotifyAccessToken = context.cookies.get("spotify-access-token");

  const trackAnalysis = await lookupTrackAnalysis({
    trackId,
    spotifyAccessToken,
  });

  return context.json(trackAnalysis);
}
