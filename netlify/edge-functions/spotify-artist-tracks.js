import { lookupArtistTracks } from "./utils/lookup-artist-data.js";

export default async function (request, context) {
  // read the name and the playlist IDs from the posted data

  const urlSearchParams = new URL(request.url).searchParams;

  const artistId = urlSearchParams.get("artistId");
  if (artistId === null) return context.json([]);

  const spotifyAccessToken = context.cookies.get("spotify-access-token");

  const artistTracks = await lookupArtistTracks({
    artistId,
    spotifyAccessToken,
  });

  // return context.json(artistTracks);

  const formattedTracks = artistTracks.map((t) => ({
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

  return context.json(formattedTracks);
}
