import genresJson from "../generated/genres.json" assert { type: "json" };

// get playlists for genre
import { findPlaylistsForGenre } from "./find-playlists-for-genre.js";

// get artists for genre
import { lookupSearch } from "./lookup-search.js";

// get similar genres
import { getSimilarGenres } from "./find-similar-genres.js";
import { lookupPlaylistTracks } from "./lookup-playlist-data.js";

export function getArtistsForGenre({ spotifyAccessToken, genreName }) {
  return lookupSearch({
    searchType: "artist",
    searchQuery: `genre:"${genreName}"`,
    spotifyAccessToken,
  });
}

export async function getGenreData({ spotifyAccessToken, genreName }) {
  const soundPlaylistId = genresJson.find(
    (g) => g.name === genreName
  ).soundPlaylistId;

  const [playlists, artists, soundPlaylistTracks, similarGenres] =
    await Promise.all([
      findPlaylistsForGenre({ spotifyAccessToken, genreName }),
      getArtistsForGenre({ spotifyAccessToken, genreName }),
      lookupPlaylistTracks({
        playlistId: soundPlaylistId,
        spotifyAccessToken,
        offset: 0,
        limit: 24,
        fields:
          "items(track(name,id,artists(name,id),album(images),preview_url))",
      }),
      getSimilarGenres({ spotifyAccessToken, genreName }),
    ]);

  return {
    playlists,
    artists,
    soundPlaylistTracks,
    similarGenres,
    soundPlaylistId,
    name: genreName,
  };
}
