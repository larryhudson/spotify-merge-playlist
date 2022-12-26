import { findPlaylistsForGenre } from "./utils/find-playlists-for-genre.js";
import { lookupPlaylist } from "./utils/lookup-playlist-data.js";

export default async function (request, context) {
  // read the name and the playlist IDs from the posted data

  const genres = new URL(request.url).searchParams.getAll("genre");

  const spotifyAccessToken = context.cookies.get("spotify-access-token");

  // we need to get the playlist IDs for the genres
  const genrePlaylists = await Promise.all(
    genres.map((genreName) =>
      findPlaylistsForGenre({
        genre: genreName,
        spotifyAccessToken,
      })
    )
  );

  return context.json(genrePlaylists);
}
