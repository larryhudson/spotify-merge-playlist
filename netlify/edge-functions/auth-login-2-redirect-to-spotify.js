export default function (request, context) {
  // read the state value from the URL params

  const isDev = Deno.env.get("NETLIFY_DEV") === "true";

  const SPOTIFY_REDIRECT_URI = isDev
    ? "http://localhost:8888/callback"
    : "https://caching--discover.mix.netlify.app/callback"; // CHANGE BACK BEFORE MERGING
  // : Deno.env.get("SPOTIFY_REDIRECT_URI");

  const requestUrl = new URL(request.url);
  const stateValue = requestUrl.searchParams.get("state");

  const spotifyUrl =
    "https://accounts.spotify.com/authorize?" +
    new URLSearchParams({
      response_type: "code",
      client_id: Deno.env.get("SPOTIFY_CLIENT_ID"),
      scope: "playlist-modify-private playlist-read-private user-top-read",
      redirect_uri: SPOTIFY_REDIRECT_URI,
      state: stateValue,
    }).toString();

  return Response.redirect(spotifyUrl);
}
