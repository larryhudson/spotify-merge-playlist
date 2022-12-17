module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({
    "node_modules/petite-vue/dist/petite-vue.es.js": "petite-vue.es.js",
  });

  return {
    dir: {
      input: "11ty-input",
      output: "11ty-output",
    },
  };
};
