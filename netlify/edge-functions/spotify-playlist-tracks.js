import { lookupPlaylistTracks } from "./utils/lookup-playlist-data.js";

export default async function (request, context) {
  // read the name and the playlist IDs from the posted data

  const urlSearchParams = new URL(request.url).searchParams;

  const playlistId = urlSearchParams.get("playlistId");
  if (playlistId === null) return context.json([]);

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

  return context.json(playlistTracks);
}
