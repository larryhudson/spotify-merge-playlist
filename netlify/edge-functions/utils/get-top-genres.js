import genresJson from "../generated/genres.json" assert { type: "json" };

async function getTopArtists({ spotifyAccessToken, timeRange }) {
  const spotifyResponse = await fetch(
    `https://api.spotify.com/v1/me/top/artists?limit=50&time_range=${timeRange}`,
    {
      headers: {
        Authorization: `Bearer ${spotifyAccessToken}`,
      },
    }
  );

  const responseJson = await spotifyResponse.json();

  if (!spotifyResponse.ok) {
    console.log("no good!");
    console.log(spotifyResponse.statusText);
    console.log(responseJson);
    throw responseJson;
  }

  return responseJson;
}

export async function getTopGenres({
  spotifyAccessToken,
  timeRange,
  limit = 20,
}) {
  const topArtists = await getTopArtists({ spotifyAccessToken, timeRange });

  const genres = topArtists.items.map((artist) => artist.genres).flat();

  const countsForGenre = {};

  genres.forEach((genre) => {
    if (genre in countsForGenre) {
      countsForGenre[genre] = countsForGenre[genre] + 1;
    } else {
      countsForGenre[genre] = 1;
    }
  });

  const sortedGenres = Object.keys(countsForGenre)
    .map((key) => {
      return {
        name: key,
        count: countsForGenre[key],
        soundPlaylistId: genresJson.find((g) => g.name === key).soundPlaylistId,
      };
    })
    .sort((a, b) => {
      return b.count - a.count;
    });

  const topTwenty = sortedGenres.slice(0, limit);

  return topTwenty;
}
