export default async function (request, context) {
  const requestUrl = new URL(request.url);
  const spotifyCode = requestUrl.searchParams.get("code");

  // fetch our token using the code
  // make a POST request to /api/token

  const SPOTIFY_CLIENT_ID = Deno.env.get("SPOTIFY_CLIENT_ID");
  const SPOTIFY_CLIENT_SECRET = Deno.env.get("SPOTIFY_CLIENT_SECRET");

  console.log({ SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET });

  const authString = `Basic ${btoa(
    SPOTIFY_CLIENT_ID + ":" + SPOTIFY_CLIENT_SECRET
  )}`;

  console.log({ toEncode: SPOTIFY_CLIENT_ID + ":" + SPOTIFY_CLIENT_SECRET });

  console.log({ authString });

  const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code: spotifyCode,
      redirect_uri: Deno.env.get("SPOTIFY_REDIRECT_URI"),
    }),
    method: "POST",
    headers: {
      Authorization: authString,
    },
  });

  if (tokenResponse.ok) {
    const tokenResponseJson = await tokenResponse.json();
    const accessToken = tokenResponseJson.access_token;

    context.cookies.set({
      name: "spotify-access-token",
      value: accessToken,
    });

    return new Response(null, {
      status: 301,
      headers: {
        Location: "/app/",
      },
    });
  } else {
    const responseText = await tokenResponse.text();
    console.log(responseText);
    // handle this later
  }
}
