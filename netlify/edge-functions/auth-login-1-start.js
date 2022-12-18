import { v4 } from "https://deno.land/std@0.136.0/uuid/mod.ts";

export default async function (request, context) {
  // set a state cookie with a random string

  var randomVal = v4.generate();

  context.cookies.set({
    name: "spotify-auth-state",
    value: randomVal,
  });

  return new Response(null, {
    status: 301,
    headers: {
      Location:
        "/auth-redirect?" +
        new URLSearchParams({ state: randomVal }).toString(),
    },
  });
}
