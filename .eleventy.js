const { EleventyEdgePlugin } = require("@11ty/eleventy");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({
    "node_modules/petite-vue/dist/petite-vue.es.js": "petite-vue.es.js",
    "node_modules/alpinejs/dist/module.esm.js": "alpine.es.js",
    "node_modules/@11ty/is-land/is-land.js": "is-land.js",
    css: "css",
  });

  eleventyConfig.addPlugin(EleventyEdgePlugin);

  return {
    dir: {
      input: "11ty-input",
      output: "11ty-output",
      layouts: "_layouts",
    },
  };
};
