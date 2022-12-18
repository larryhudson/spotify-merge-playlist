export async function getSpotifyUserId({ spotifyAccessToken }) {
  const spotifyResponse = await fetch("https://api.spotify.com/v1/me", {
    headers: {
      Authorization: `Bearer ${spotifyAccessToken}`,
    },
  });

  if (spotifyResponse.ok) {
    const responseJson = await spotifyResponse.json();
    return responseJson.id;
  }
}
