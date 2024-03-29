import { findPlaylistsForGenre } from "./utils/find-playlists-for-genre.js";
import { getSpotifyUserId } from "./utils/get-spotify-user-id.js";
import { chunkArray } from "./utils/chunk-array.js";
import { lookupMultipleTrackFeatures } from "./utils/lookup-track-features.js";
import { filterTracksByFeature } from "./utils/filter-features.js";

function createPlaylistDescription({ genres, playlistTypes }) {
  return `Playlist generated by discover-mix.netlify.app. Genres: ${genres.join(
    ", "
  )}. Playlist types: ${playlistTypes.join(", ")}.`;
}

async function getPlaylistData(playlistId, spotifyAccessToken) {
  const responseJson = await fetch(
    `https://api.spotify.com/v1/playlists/${playlistId}`,
    {
      headers: {
        Authorization: `Bearer ${spotifyAccessToken}`,
      },
    }
  ).then((r) => r.json());

  const name = responseJson.name;
  let tracks = responseJson.tracks.items.map((t) => t.track);
  let nextUrl = responseJson.tracks.next;

  while (nextUrl) {
    const tracksResponse = await fetch(nextUrl, {
      headers: {
        Authorization: `Bearer ${spotifyAccessToken}`,
      },
    }).then((r) => r.json());

    tracks = [...tracks, ...tracksResponse.items.map((t) => t.track)];

    nextUrl = tracksResponse.next;
  }

  return { playlistId, name, tracks };
}

async function createPlaylist(
  spotifyUserId,
  spotifyAccessToken,
  name,
  trackIds,
  description
) {
  let tracksToAdd = [...trackIds];

  const createResponse = await fetch(
    `https://api.spotify.com/v1/users/${spotifyUserId}/playlists`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${spotifyAccessToken}`,
      },
      body: JSON.stringify({
        name,
        description,
        public: false,
      }),
    }
  );

  if (createResponse.ok) {
    const createResponseJson = await createResponse.json();

    const newPlaylistId = createResponseJson.id;

    const trackIdChunks = chunkArray(tracksToAdd);

    await Promise.all(
      trackIdChunks.map(async (trackIdChunk) => {
        await fetch(
          `https://api.spotify.com/v1/playlists/${newPlaylistId}/tracks`,
          {
            method: "POST",
            body: JSON.stringify({
              uris: trackIdChunk
                .slice(0, 100)
                .map((id) => `spotify:track:${id}`),
            }),
            headers: {
              Authorization: `Bearer ${spotifyAccessToken}`,
            },
          }
        );
      })
    );

    return newPlaylistId;
  }
}

export default async function (request, context) {
  // read the name and the playlist IDs from the posted data

  const formData = await request.formData();
  const playlistName = formData.get("name");
  const genres = formData.getAll("genre");
  const playlistTypes = formData.getAll("playlist-type");
  const filterJsonStrings = formData.getAll("filter");

  const spotifyAccessToken = context.cookies.get("spotify-access-token");

  try {
    // we need to get the playlist IDs for the genres
    const genrePlaylists = await Promise.all(
      genres.map((genreName) =>
        findPlaylistsForGenre({
          genreName,
          spotifyAccessToken,
        })
      )
    );

    // filter to only include ones that match the type
    const playlistIds = genrePlaylists
      .flat()
      .filter((p) => playlistTypes.includes(p.type))
      .map((p) => p.id);

    const spotifyUserId = await getSpotifyUserId({ spotifyAccessToken });

    // TODO: maybe save user ID in cookie? Does it matter?

    const allData = await Promise.all(
      playlistIds.map((id) => getPlaylistData(id, spotifyAccessToken))
    );

    const allTracks = allData.map((playlistData) => playlistData.tracks);

    const allTrackIds = allTracks.flat().map((t) => t.id);

    const allUniqueTracks = Array.from(new Set(allTrackIds));

    let trackIds = allUniqueTracks;

    if (filterJsonStrings.length > 0) {
      const filters = filterJsonStrings.map(JSON.parse);

      const trackChunks = chunkArray(allUniqueTracks);

      const featureChunks = await Promise.all(
        trackChunks.map((arrayOfIds) =>
          lookupMultipleTrackFeatures({
            arrayOfIds,
            spotifyAccessToken,
          })
        )
      );

      trackIds = featureChunks.flat();

      filters.forEach((filter) => {
        trackIds = filterTracksByFeature(trackIds, filter);
      });

      trackIds = trackIds.map((t) => t.id);
    }

    // return context.json(allUniqueTracks);

    const description = createPlaylistDescription({ genres, playlistTypes });

    const newPlaylistId = await createPlaylist(
      spotifyUserId,
      spotifyAccessToken,
      `🤖 ${playlistName}`,
      trackIds,
      description
    );

    return context.json({
      status: "created",
      playlistName,
      url: `https://open.spotify.com/playlist/${newPlaylistId}`,
    });
  } catch (err) {
    console.log("Caught an error!");
    console.log(err);
    return context.json({
      status: "error",
      message: err,
    });
  }
}
