import { lookupPlaylistTracks } from "./utils/lookup-playlist-data.js";
import { lookupMultipleTrackFeatures } from "./utils/lookup-track-features.js";

export default async function (request, context) {
  // read the name and the playlist IDs from the posted data

  const urlSearchParams = new URL(request.url).searchParams;

  const playlistId = urlSearchParams.get("playlistId");
  if (playlistId === null) return context.json([]);

  const tempo = parseFloat(urlSearchParams.get("tempo"));
  const key = parseInt(urlSearchParams.get("key"));

  const limit = urlSearchParams.get("limit") || 100;
  const offset = urlSearchParams.get("offset") || 0;
  const fields =
    urlSearchParams.get("fields") ||
    "items(track(name,id,artists(name,id),album(images),preview_url))";

  const spotifyAccessToken = context.cookies.get("spotify-access-token");

  const playlistTracks = await lookupPlaylistTracks({
    playlistId,
    spotifyAccessToken,
    limit,
    offset,
    fields,
  });

  // return context.json(playlistTracks);

  const trackIds = playlistTracks.map((t) => t.id);

  const trackFeatures = await lookupMultipleTrackFeatures({
    arrayOfIds: trackIds,
    spotifyAccessToken,
  });

  // return context.json(trackFeatures);

  const matchingFeatures = trackFeatures.filter((f) => {
    if (f.key !== key) return false;
    if (Math.abs(f.tempo - tempo) > 10) return false;
    return true;
  });

  return context.json(matchingFeatures);
}
