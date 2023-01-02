import {
  lookupArtist,
  lookupRelatedArtists,
  lookupArtistTracks,
} from "./lookup-artist-data.js";

export async function lookupArtist({ artistId, spotifyAccessToken }) {
  const artistResponse = await fetch(
    `https://api.spotify.com/v1/artists/${artistId}`,
    {
      headers: {
        Authorization: `Bearer ${spotifyAccessToken}`,
      },
    }
  );

  if (artistResponse.ok) {
    const artistJson = await artistResponse.json();
    return artistJson;
  } else {
    console.log("Error while looking up artist", artistId);
    console.log("status code", artistResponse.status);
    console.log("status text", artistResponse.statusText);
    const errorText = await artistResponse.text();
    throw {
      status: artistResponse.status,
      statusText: artistResponse.statusText,
      message: errorText,
    };
  }
}

export async function lookupRelatedArtists({ artistId, spotifyAccessToken }) {
  const artistResponse = await fetch(
    `https://api.spotify.com/v1/artists/${artistId}/related-artists`,
    {
      headers: {
        Authorization: `Bearer ${spotifyAccessToken}`,
      },
    }
  );

  if (artistResponse.ok) {
    const artistJson = await artistResponse.json();
    return artistJson.artists;
  } else {
    console.log("Error while looking up related artists for artist", artistId);
    console.log("status code", artistResponse.status);
    console.log("status text", artistResponse.statusText);
    const errorText = await artistResponse.text();
    throw {
      status: artistResponse.status,
      statusText: artistResponse.statusText,
      message: errorText,
    };
  }
}

export async function lookupArtistTracks({ artistId, spotifyAccessToken }) {
  const tracksResponse = await fetch(
    `https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=AU`, // TODO: don't hardcode the AU market?
    {
      headers: {
        Authorization: `Bearer ${spotifyAccessToken}`,
      },
    }
  );

  if (tracksResponse.ok) {
    const tracksJson = await tracksResponse.json();

    const formattedTracks = tracksJson.tracks.map((t) => ({
      name: t.name,
      id: t.id,
      artists: t.artists.map((a) => ({
        name: a.name,
        id: a.id,
      })),
      artistStr: t.artists.map((a) => a.name).join(", "),
      imageUrl: t.album.images.at(-1).url,
      imageWidth: t.album.images.at(-1).width,
      mp3Url: t.preview_url,
    }));

    return formattedTracks;
  } else {
    console.log("Error while looking up tracks for artist", artistId);
    console.log("status code", tracksResponse.status);
    console.log("status text", tracksResponse.statusText);
    const errorText = await tracksResponse.text();
    throw {
      status: tracksResponse.status,
      statusText: tracksResponse.statusText,
      message: errorText,
    };
  }
}

export async function routeGetArtistData(request, context) {
  // read the name and the playlist IDs from the posted data

  const artistId = new URL(request.url).searchParams.get("artistId");

  const spotifyAccessToken = context.cookies.get("spotify-access-token");

  const artistData = await lookupArtist({
    artistId,
    spotifyAccessToken,
  });

  const relatedArtists = await lookupRelatedArtists({
    artistId,
    spotifyAccessToken,
  });

  const topTracks = await lookupArtistTracks({
    artistId,
    spotifyAccessToken,
  });

  return {
    name: artistData.name,
    id: artistData.id,
    images: artistData.images,
    genres: artistData.genres,
    related: relatedArtists.map((a) => ({
      name: a.name,
      id: a.id,
    })),
    topTracks,
  };
}
