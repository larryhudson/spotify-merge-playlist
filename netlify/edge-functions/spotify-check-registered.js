import { lookupPlaylist } from "./utils/lookup-playlist-data.js";
import genresJson from "./generated/genres.json" assert { type: "json" };

export default async function (_request, context) {
  const spotifyAccessToken = context.cookies.get("spotify-access-token");

  // to check whether the user is registered, we're going to load the tracks of a playlist ID

  //  we'll get the first soundPlaylistId from our genres list.
  const playlistId = genresJson[0].soundPlaylistId;

  try {
    await lookupPlaylist({
      playlistId,
      spotifyAccessToken,
    });

    // if we get here, we should be ok
    return context.json({
      status: "ok",
    });
  } catch (err) {
    // if we get here, lookupPlaylist has thrown an error
    return context.json({
      status: "error",
      error: err,
    });
  }
}
