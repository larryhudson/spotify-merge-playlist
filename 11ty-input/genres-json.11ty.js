class GenresJson {
  data() {
    return {
      permalink: "netlify/edge-functions/generated/genres.json",
      permalinkBypassOutputDir: true,
    };
  }

  render(data) {
    return JSON.stringify(data.genres, null, 2);
  }
}

module.exports = GenresJson;
