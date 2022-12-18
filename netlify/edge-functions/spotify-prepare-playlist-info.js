import { findPlaylistsForGenre } from "./utils/find-playlists-for-genre.js";
import { lookupPlaylist } from "./utils/lookup-playlist-data.js";

export default async function (request, context) {
  // read the name and the playlist IDs from the posted data

  const formData = await request.formData();
  const genres = formData.getAll("genre");
  const playlistTypes = formData.getAll("playlist-type");

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

  // filter to only include ones that match the type
  const playlistIds = genrePlaylists
    .flat()
    .filter((p) => playlistTypes.includes(p.type))
    .map((p) => p.id);

  const playlists = await Promise.all(
    playlistIds.map(async (playlistId) => {
      const playlistData = await lookupPlaylist({
        playlistId,
        spotifyAccessToken,
      });

      return {
        playlistId,
        name: playlistData.name,
        numTracks: playlistData.tracks.total,
      };
    })
  );

  return context.json(playlists);
}
