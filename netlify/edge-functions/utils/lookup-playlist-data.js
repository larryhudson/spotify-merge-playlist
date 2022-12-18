export async function lookupPlaylist({ playlistId, spotifyAccessToken }) {
  const playlistJson = await fetch(
    `https://api.spotify.com/v1/playlists/${playlistId}`,
    {
      headers: {
        Authorization: `Bearer ${spotifyAccessToken}`,
      },
    }
  )
    .then((r) => r.json())
    .catch((err) => {
      console.log("Error while looking up playlist", playlistId);
      console.log(err);
      throw err;
    });

  return playlistJson;
}
