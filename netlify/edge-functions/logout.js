export default function (_request, context) {
  // delete the cookie
  context.cookies.delete("spotify-access-token");

  return new Response(null, {
    status: 301,
    headers: {
      Location: "/",
    },
  });
}
