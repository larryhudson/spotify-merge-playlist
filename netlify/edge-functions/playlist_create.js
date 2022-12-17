export default async function (request, context) {
  // read the name and the playlist IDs from the posted data

  const formData = await request.formData();
  const playlistName = formData.get("name");
  const idString = formData.get("ids");
  const ids = idString.split("\n");

  const spotifyAccessToken = context.cookies.get("spotify-access-token");

  async function getCurrentUserId() {
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

  const userId = await getCurrentUserId();

  context.cookies.set({
    name: "spotify-user-id",
    value: userId,
  });

  async function getPlaylistTracks(playlistId) {
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

  const allTracks = await Promise.all(ids.map(getPlaylistTracks));

  const allTrackIds = allTracks.flat().map((t) => t.id);

  const allUniqueTracks = Array.from(new Set(allTrackIds));

  // return context.json(allUniqueTracks);

  //   create the playlist
  async function createPlaylist(name, trackIds) {
    let tracksToAdd = [...trackIds];
    const createResponse = await fetch(
      `https://api.spotify.com/v1/users/${userId}/playlists`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${spotifyAccessToken}`,
        },
        body: JSON.stringify({
          name,
          description: "Automatically generated rollup playlist",
          public: false,
        }),
      }
    );

    if (createResponse.ok) {
      const createResponseJson = await createResponse.json();
      console.log(createResponseJson);

      const newPlaylistId = createResponseJson.id;

      while (tracksToAdd.length > 0) {
        const addTracksResponse = await fetch(
          `https://api.spotify.com/v1/playlists/${newPlaylistId}/tracks`,
          {
            method: "POST",
            body: JSON.stringify({
              uris: tracksToAdd
                .slice(0, 100)
                .map((id) => `spotify:track:${id}`),
            }),
            headers: {
              Authorization: `Bearer ${spotifyAccessToken}`,
            },
          }
        );

        tracksToAdd = tracksToAdd.slice(100);
      }

      //   add the tracks to the playlist
  }

  createPlaylist(`🤖 ${playlistName}`, allUniqueTracks);
  
  // delete the cookie
}
