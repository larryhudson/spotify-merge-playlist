export default async (request, context) => {
  const url = new URL(request.url);

  // we only want the URL after the 'origin', eg. /app/top-genres/
  const pathWithSearch = url.pathname + url.search;

  // helpers for calculating number of seconds
  const oneDay = 60 * 60 * 24;
  const oneWeek = oneDay * 7;
  const twoWeeks = oneDay * 14;

  const cacheDurationByPath = {
    "/app/top-genres/?timeRange=short_term": oneDay,
    "/app/top-genres/?timeRange=medium_term": oneWeek,
    "/app/top-genres/": oneWeek, // same as medium term
    "/app/top-genres/?timeRange=long_term": twoWeeks,
  };

  const ageForThisUrl = cacheDurationByPath[pathWithSearch];

  const response = await context.next();

  if (ageForThisUrl) {
    // add the cache header
    console.log(
      "adding the cache header for url",
      pathWithSearch,
      "max age",
      ageForThisUrl
    );
    response.headers.set("Cache-Control", `private, max-age=${ageForThisUrl}`);
  } else {
    response.headers.set("Cache-Control", `public, s-maxage=${oneDay}`);
  }
  return response;
};
