export async function lookupSearch({
  searchType,
  searchQuery,
  spotifyAccessToken,
}) {
  const searchResponse = await fetch(
    `https://api.spotify.com/v1/search?${new URLSearchParams({
      q: searchQuery,
      type: searchType,
    }).toString()}`,
    {
      headers: {
        Authorization: `Bearer ${spotifyAccessToken}`,
      },
    }
  );

  if (searchResponse.ok) {
    const searchJson = await searchResponse.json();

    if (searchType === "artist") {
      return searchJson.artists.items.map((a) => ({
        name: a.name,
        id: a.id,
        genres: a.genres,
        images: a.images,
        popularity: a.popularity,
      }));
    }

    if (searchType === "track") {
      return searchJson.tracks.items.map((t) => ({
        name: t.name,
        artists: t.artists.map((a) => a.name).join(", "),
        id: t.id,
      }));
    }
  } else {
    console.log("Error while looking up search", searchType, searchQuery);
    console.log("status code", searchResponse.status);
    console.log("status text", searchResponse.statusText);
    const errorText = await searchResponse.text();
    throw {
      status: searchResponse.status,
      statusText: searchResponse.statusText,
      message: errorText,
    };
  }
}
