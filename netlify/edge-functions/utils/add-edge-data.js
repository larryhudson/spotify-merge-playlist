import { getTopGenres } from "./get-top-genres.js";

function routeGetTopGenres(request, context) {
  return getTopGenres({
    spotifyAccessToken: context.cookies.get("spotify-access-token"),
    timeRange:
      new URL(request.url).searchParams.get("timeRange") || "medium_term",
    limit: new URL(request.url).searchParams.get("limit") || 25,
  });
}

export function addEdgeData(request, context, eleventyConfig) {
  const path = new URL(request.url).pathname;

  const dataFunctionsByPath = {
    "/app/top-genres/": {
      func: routeGetTopGenres,
      variableName: "topGenres",
    },
  };

  const dataFunction = dataFunctionsByPath[path];

  if (dataFunction) {
    eleventyConfig.addGlobalData(dataFunction.variableName, () => {
      return dataFunction.func(request, context);
    });
  }
}
