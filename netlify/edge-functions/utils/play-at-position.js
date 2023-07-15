export async function playAtPosition({
  trackId,
  positionMs,
  spotifyAccessToken,
}) {
  const playResponse = await fetch(
    `https://api.spotify.com/v1/me/player/play`,
    {
      method: "PUT",
      body: JSON.stringify({
        uris: [`spotify:track:${trackId}`],
        position_ms: parseInt(positionMs),
      }),
      headers: {
        Authorization: `Bearer ${spotifyAccessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (playResponse.ok) {
    return "ok";
  } else {
    console.log("Error while playing", trackId);
    console.log("status code", playResponse.status);
    console.log("status text", playResponse.statusText);
    const errorText = await playResponse.text();
    throw {
      status: playResponse.status,
      statusText: playResponse.statusText,
      message: errorText,
    };
  }
}
