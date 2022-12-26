import {
  lookupArtist,
  lookupRelatedArtists,
} from "./utils/lookup-artist-data.js";

export default async function (request, context) {
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

  const toReturn = {
    name: artistData.name,
    id: artistData.id,
    images: artistData.images,
    genres: artistData.genres,
    related: relatedArtists.map((a) => ({
      name: a.name,
      id: a.id,
    })),
  };

  return context.json(toReturn);
}
