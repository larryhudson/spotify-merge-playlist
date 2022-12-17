import cheerio from "npm:cheerio";

export default async function (request, context) {
  const genres = await import("./generated/genres.json", {
    assert: { type: "json" },
  });

  const genreName = new URL(request.url).searchParams.get("genre");

  const foundGenre = genres.default.find((g) => g.name === genreName);

  // fetch the sound playlist

  const spotifyAccessToken = context.cookies.get("spotify-access-token");

  async function getPlaylistData(playlistId) {
    const spotifyResponse = await fetch(
      `https://api.spotify.com/v1/playlists/${playlistId}`,
      {
        headers: {
          Authorization: `Bearer ${spotifyAccessToken}`,
        },
      }
    );

    if (spotifyResponse.ok) {
      const responseJson = await spotifyResponse.json();
      console.log(responseJson);
      return {
        name: responseJson.name,
        description: responseJson.description,
      };
    } else {
      const responseText = await spotifyResponse.text();

      console.log({ responseText });
    }
  }

  const playlistData = await getPlaylistData(foundGenre.soundPlaylistId);

  const $ = cheerio.load(`<p>${playlistData.description}</p>`);

  let playlists = [
    {
      label: "Sound",
      id: foundGenre.soundPlaylistId,
    },
  ];

  const labels = ["Edge", "Pulse", "♀Filter", "2022"];

  $("a").each((_i, aTag) => {
    if (labels.includes($(aTag).text())) {
      playlists.push({
        label: $(aTag).text(),
        id: $(aTag).attr("href").split(":").at(-1),
      });
    }
  });

  return context.json(playlists);
}
