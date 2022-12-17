export default async function (request, context) {
  // read the name and the playlist IDs from the posted data

  const playlistId = new URL(request.url).searchParams.get("playlistId");

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
      let tracks = responseJson.tracks.items.map((t) => t.track);
      let nextUrl = responseJson.tracks.next;

      while (nextUrl) {
        console.log({ nextUrlAtStart: nextUrl });
        const tracksResponse = await fetch(nextUrl, {
          headers: {
            Authorization: `Bearer ${spotifyAccessToken}`,
          },
        }).then((r) => r.json());

        console.log(tracksResponse);

        tracks = [...tracks, ...tracksResponse.items.map((t) => t.track)];

        console.log({ nextUrl: tracksResponse.next });
        nextUrl = tracksResponse.next;
      }

      return tracks;
    } else {
      const responseText = await spotifyResponse.text();

      console.log({ responseText });
    }
  }

  const playlistData = await getPlaylistData(playlistId);
  return context.json(playlistData);

  // delete the cookie
}
