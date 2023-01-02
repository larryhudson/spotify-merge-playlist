const cookieParser = require("cookie");
const { pathToRegexp } = require("path-to-regexp");
const getArtistData = require("./get-artist-data.js");
const debug = require("debug")("DiscoverMix:Serverless");

function getParamFromPath(pattern, path) {
  const regexp = pathToRegexp(pattern);

  debug(regexp.exec(path));

  return regexp.exec(path)[1];
}

function getGenreData({ genreName, spotifyAccessToken }) {
  // to implement
  return {};
}

function getArtistSearch({ q, spotifyAccessToken }) {
  // to implement
  return {};
}

function getMatchingPattern(patterns, path) {
  return patterns.find((pattern) => {
    debug("pattern: ", pattern);
    debug("path: ", path);
    const regexp = pathToRegexp(pattern);
    debug(regexp.exec(path));
    return regexp.exec(path) !== null;
  });
}

function addServerlessData({ eleventyConfig, event }) {
  const dataFunctionByPattern = {
    "/app/artist/:id/": {
      func: getArtistData,
      variableName: "artist",
    },
    "/app/genre/:name": {
      func: getGenreData,
      variableName: "genre",
    },
    "/app/search/artist/:q": {
      func: getArtistSearch,
      variableName: "searchData",
    },
  };

  const patterns = Object.keys(dataFunctionByPattern);
  const path = new URL(event.rawUrl).pathname;

  const matchingPattern = getMatchingPattern(patterns, path);

  const dataFunction = dataFunctionByPattern[matchingPattern];

  const pathParam = getParamFromPath(matchingPattern, path);

  const cookies = cookieParser.parse(event.headers.cookie);
  const spotifyAccessToken = cookies["spotify-access-token"];

  eleventyConfig.addGlobalData(dataFunction.variableName, function () {
    return dataFunction.func({
      pathParam,
      spotifyAccessToken,
    });
  });
}

module.exports = {
  addServerlessData,
};
