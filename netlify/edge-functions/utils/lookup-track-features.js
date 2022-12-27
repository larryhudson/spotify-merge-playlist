export async function lookupTrackFeatures({ trackId, spotifyAccessToken }) {
  const featuresResponse = await fetch(
    `https://api.spotify.com/v1/audio-features/${trackId}`,
    {
      headers: {
        Authorization: `Bearer ${spotifyAccessToken}`,
      },
    }
  );

  if (featuresResponse.ok) {
    const featuresJson = await featuresResponse.json();
    return featuresJson;
  } else {
    console.log("Error while looking up features", featuresId);
    console.log("status code", featuresResponse.status);
    console.log("status text", featuresResponse.statusText);
    const errorText = await featuresResponse.text();
    throw {
      status: featuresResponse.status,
      statusText: featuresResponse.statusText,
      message: errorText,
    };
  }
}

export async function lookupMultipleTrackFeatures({
  arrayOfIds,
  spotifyAccessToken,
}) {
  const paramsString = new URLSearchParams({
    ids: arrayOfIds.join(","),
  }).toString();

  const featuresResponse = await fetch(
    `https://api.spotify.com/v1/audio-features?${paramsString}`,
    {
      headers: {
        Authorization: `Bearer ${spotifyAccessToken}`,
      },
    }
  );

  if (featuresResponse.ok) {
    const featuresJson = await featuresResponse.json();
    return featuresJson.audio_features;
  } else {
    console.log("Error while looking up features", featuresId);
    console.log("status code", featuresResponse.status);
    console.log("status text", featuresResponse.statusText);
    const errorText = await featuresResponse.text();
    throw {
      status: featuresResponse.status,
      statusText: featuresResponse.statusText,
      message: errorText,
    };
  }
}
