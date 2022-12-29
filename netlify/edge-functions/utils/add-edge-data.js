import { getTopGenres } from "./get-top-genres.js";
import { getGenreData } from "./get-genre-data.js";
import {
  lookupArtist,
  lookupRelatedArtists,
  lookupArtistTracks,
} from "./lookup-artist-data.js";

function routeGetTopGenres(request, context) {
  return getTopGenres({
    spotifyAccessToken: context.cookies.get("spotify-access-token"),
    timeRange:
      new URL(request.url).searchParams.get("timeRange") || "medium_term",
    limit: new URL(request.url).searchParams.get("limit") || 25,
  });
}

function routeGetGenreData(request, context) {
  console.log("doing the genre thing?");
  return getGenreData({
    spotifyAccessToken: context.cookies.get("spotify-access-token"),
    genreName: new URL(request.url).searchParams.get("genre"),
  });
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

export function addEdgeData(request, context, eleventyConfig) {
  const path = new URL(request.url).pathname;

  console.log({ path: request.url });

  const dataFunctionsByPath = {
    "/app/top-genres/": {
      func: routeGetTopGenres,
      variableName: "topGenres",
    },
    "/app/genre/": {
      func: routeGetGenreData,
      variableName: "genre",
    },
    "/app/artist/": {
      func: routeGetArtistData,
      variableName: "artist",
    },
  };

  const dataFunction = dataFunctionsByPath[path];

  if (dataFunction) {
    eleventyConfig.addGlobalData(dataFunction.variableName, () => {
      return dataFunction.func(request, context);
    });
  }
}
