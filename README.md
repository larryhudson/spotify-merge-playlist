# `spotify-merge-playlist`

The goal of this is to:

- create a mega playlist that includes other playlists
- 'sync' the mega playlist so that it stays up to date with the included playlist changes

## Example

Every Noise at Once has playlists for different genres. I like [garage psych](https://everynoise.com/playlistprofile.cgi?id=1R6gkpoaA4kCNsTX2HAeDD&comp=spotify:playlist:4g9yZYKmNU8fsEDXfpISbM&comp=spotify:playlist:2xnSf5Eq18Dpg8Jhan2m3G&comp=spotify:playlist:3g3iChwNlPGH8f8ZPLHhIA), [small room](https://everynoise.com/playlistprofile.cgi?id=2rPwi4IFhoc2r1MMvY0ZI5&comp=spotify:playlist:4PaNeu1tSPAG6PiSwFQ05v&comp=spotify:playlist:6bKXFJqys3w4b0pGhkRW4k&comp=spotify:playlist:045POYG6AWatzWyqZ3rl3W), [melbourne indie](https://everynoise.com/playlistprofile.cgi?id=2V5cDE76iiL5Gm8vdbHePQ&comp=spotify:playlist:1Wb44bAb8ALG98zDbQkJG6&comp=spotify:playlist:0efIg1qwegIZvdbKxVh8Rq&comp=spotify:playlist:2tcDsdLBZtr5pNbtdIHVhL).

I want to have a playlist that includes [The Pulse of Garage Psych](https://everynoise.com/playlistprofile.cgi?id=2xnSf5Eq18Dpg8Jhan2m3G&comp=spotify:playlist:1R6gkpoaA4kCNsTX2HAeDD&comp=spotify:playlist:4g9yZYKmNU8fsEDXfpISbM&comp=spotify:playlist:3g3iChwNlPGH8f8ZPLHhIA), [the Pulse of Small Room](https://everynoise.com/playlistprofile.cgi?id=6bKXFJqys3w4b0pGhkRW4k&comp=spotify:playlist:2rPwi4IFhoc2r1MMvY0ZI5&comp=spotify:playlist:4PaNeu1tSPAG6PiSwFQ05v&comp=spotify:playlist:045POYG6AWatzWyqZ3rl3W), and [the Pulse of Melbourne Indie](https://everynoise.com/playlistprofile.cgi?id=0efIg1qwegIZvdbKxVh8Rq&comp=spotify:playlist:2V5cDE76iiL5Gm8vdbHePQ&comp=spotify:playlist:1Wb44bAb8ALG98zDbQkJG6&comp=spotify:playlist:2tcDsdLBZtr5pNbtdIHVhL).

So how would that work? I'm imagining:

- I create a playlist that starts with a certain emoji, eg. 🤖
- In the playlist description, I would put in some playlist hyperlinks
- When I run the thing, it checks for playlists that starts with the robot emoji
- For each playlist, check the hyperlinks and sync the tracks.

## To do list

- Get authentication working - you click an 'authenticate' button and it gets an access token, which is then saved in the user's browser cookies
- Use Eleventy Edge to render content for them if they have the cookie set
- Once you're logged, should be able to 'create' a new playlist, where you give it a name and a bunch of playlist IDs. Then it'll fetch the track IDs, and create that new playlist.
- It'll render a nice HTML description which links through to the included playlists.

### Authentication

- I need to generate random state, save that in the user's browser, and submit it when we submit to the `/authorize` endpoint

Edge functions to write

- Authenticate
- Create playlist

HTML templates to write

- New playlist

- Get similar genres

- Get playlist tracks
