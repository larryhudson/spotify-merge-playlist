import genresJson from "./generated/genres.json" assert { type: "json" };

export default async function (_request, context) {
  const spotifyAccessToken = context.cookies.get("spotify-access-token");

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
      const responseJson = await spotifyResponse.json();
      console.log(spotifyResponse.statusText);
      console.log(responseJson);
      throw responseJson;
    }
  }

  try {
    const topArtists = await getTopArtists();

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
          soundPlaylistId: genresJson.find((g) => g.name === key)
            .soundPlaylistId,
        };
      })
      .sort((a, b) => {
        return b.count - a.count;
      });

    return context.json(sortedGenres);
  } catch (err) {
    console.log("should be returning error");
    console.log({ err: JSON.stringify(err) });
    return new Response(
      JSON.stringify({
        error: err.error.message,
      }),
      {
        status: err.error.status,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  // work out the top genres...
}
