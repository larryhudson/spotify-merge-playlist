export async function saveTrack({ trackId, spotifyAccessToken }) {
  const saveTrackResponse = await fetch(
    `https://api.spotify.com/v1/me/tracks`,
    {
      method: "PUT",
      body: JSON.stringify({
        ids: [trackId],
      }),
      headers: {
        Authorization: `Bearer ${spotifyAccessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (saveTrackResponse.ok) {
    return "ok";
  } else {
    console.log("Error while saving track", trackId);
    console.log("status code", saveTrackResponse.status);
    console.log("status text", saveTrackResponse.statusText);
    const errorText = await saveTrackResponse.text();
    throw {
      status: saveTrackResponse.status,
      statusText: saveTrackResponse.statusText,
      message: errorText,
    };
  }
}
