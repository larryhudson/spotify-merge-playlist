export default function (_request, context) {
  const spotifyAccessToken = context.cookies.get("spotify-access-token");

  if (!spotifyAccessToken) {
    return new Response(null, {
      status: 301,
      headers: {
        Location: "/?message=unauthenticated",
      },
    });
  }

  return context.next();
}
