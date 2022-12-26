export async function lookupArtist({ artistId, spotifyAccessToken }) {
  const artistResponse = await fetch(
    `https://api.spotify.com/v1/artists/${artistId}`,
    {
      headers: {
        Authorization: `Bearer ${spotifyAccessToken}`,
      },
    }
  );

  if (artistResponse.ok) {
    const artistJson = await artistResponse.json();
    return artistJson;
  } else {
    console.log("Error while looking up artist", artistId);
    console.log("status code", artistResponse.status);
    console.log("status text", artistResponse.statusText);
    const errorText = await artistResponse.text();
    throw {
      status: artistResponse.status,
      statusText: artistResponse.statusText,
      message: errorText,
    };
  }
}

export async function lookupRelatedArtists({ artistId, spotifyAccessToken }) {
  const artistResponse = await fetch(
    `https://api.spotify.com/v1/artists/${artistId}/related-artists`,
    {
      headers: {
        Authorization: `Bearer ${spotifyAccessToken}`,
      },
    }
  );

  if (artistResponse.ok) {
    const artistJson = await artistResponse.json();
    return artistJson.artists;
  } else {
    console.log("Error while looking up related artists for artist", artistId);
    console.log("status code", artistResponse.status);
    console.log("status text", artistResponse.statusText);
    const errorText = await artistResponse.text();
    throw {
      status: artistResponse.status,
      statusText: artistResponse.statusText,
      message: errorText,
    };
  }
}
