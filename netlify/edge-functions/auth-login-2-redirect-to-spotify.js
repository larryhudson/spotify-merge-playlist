export default function (request, context) {
  // read the state value from the URL params

  const requestUrl = new URL(request.url);
  const stateValue = requestUrl.searchParams.get("state");

  return Response.redirect(
    "https://accounts.spotify.com/authorize?" +
      new URLSearchParams({
        response_type: "code",
        client_id: Deno.env.get("SPOTIFY_CLIENT_ID"),
        scope: "playlist-modify-private playlist-read-private user-top-read",
        redirect_uri: Deno.env.get("SPOTIFY_REDIRECT_URI"),
        state: stateValue,
      }).toString()
  );
}
