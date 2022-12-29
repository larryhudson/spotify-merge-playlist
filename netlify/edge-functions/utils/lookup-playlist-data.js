export async function lookupPlaylist({ playlistId, spotifyAccessToken }) {
  const playlistResponse = await fetch(
    `https://api.spotify.com/v1/playlists/${playlistId}`,
    {
      headers: {
        Authorization: `Bearer ${spotifyAccessToken}`,
      },
    }
  );

  if (playlistResponse.ok) {
    const playlistJson = await playlistResponse.json();
    return playlistJson;
  } else {
    console.log("Error while looking up playlist", playlistId);
    console.log("status code", playlistResponse.status);
    console.log("status text", playlistResponse.statusText);
    const errorText = await playlistResponse.text();
    throw {
      status: playlistResponse.status,
      statusText: playlistResponse.statusText,
      message: errorText,
    };
  }
}

export async function lookupPlaylistTracks({
  playlistId,
  spotifyAccessToken,
  offset,
  limit,
  fields,
}) {
  const searchParams = new URLSearchParams({
    offset,
    limit,
    fields,
  });

  const playlistResponse = await fetch(
    `https://api.spotify.com/v1/playlists/${playlistId}/tracks?${searchParams.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${spotifyAccessToken}`,
      },
    }
  );

  if (playlistResponse.ok) {
    const playlistJson = await playlistResponse.json();
    return playlistJson.items.map((t) => ({
      name: t.track.name,
      id: t.track.id,
      artists: t.track.artists.map((a) => ({
        name: a.name,
        id: a.id,
      })),
      artistStr: t.track.artists.map((a) => a.name).join(", "),
      imageUrl: t.track.album.images.at(-1).url,
      imageWidth: t.track.album.images.at(-1).width,
      mp3Url: t.track.preview_url,
    }));
  } else {
    console.log("Error while looking up playlist tracks", playlistId);
    console.log("status code", playlistResponse.status);
    console.log("status text", playlistResponse.statusText);
    const errorText = await playlistResponse.text();
    throw {
      status: playlistResponse.status,
      statusText: playlistResponse.statusText,
      message: errorText,
    };
  }
}
