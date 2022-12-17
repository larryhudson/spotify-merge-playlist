export default async function (_request, context) {
  const spotifyAccessToken = context.cookies.get("spotify-access-token");

  console.log({ spotifyAccessToken });

  async function getTopArtists() {
    const spotifyResponse = await fetch(
      "https://api.spotify.com/v1/me/top/artists?limit=50",
      {
        headers: {
          Authorization: `Bearer ${spotifyAccessToken}`,
        },
      }
    );

    if (spotifyResponse.ok) {
      const responseJson = await spotifyResponse.json();
      console.log(responseJson);
      return responseJson;
    } else {
      console.log("no good!");
      const responseText = await spotifyResponse.text();
      console.log(spotifyResponse.statusText);
      console.log(responseText);
    }
  }

  const topArtists = await getTopArtists();

  console.log(JSON.stringify(topArtists));

  const genres = topArtists.items.map((artist) => artist.genres).flat();

  const countsForGenre = {};

  genres.forEach((genre) => {
    if (countsForGenre.hasOwnProperty(genre)) {
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
      };
    })
    .sort((a, b) => {
      return b.count - a.count;
    });

  return context.json(sortedGenres);

  // work out the top genres...
}
