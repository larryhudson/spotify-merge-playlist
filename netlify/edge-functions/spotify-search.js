import { lookupSearch } from "./utils/lookup-search.js";

export default async function (request, context) {
  // read the name and the playlist IDs from the posted data

  const searchType = new URL(request.url).searchParams.get("type");
  const searchQuery = new URL(request.url).searchParams.get("q");

  const spotifyAccessToken = context.cookies.get("spotify-access-token");

  const searchResults = await lookupSearch({
    searchType,
    searchQuery,
    spotifyAccessToken,
  });

  return context.json(searchResults);
}
