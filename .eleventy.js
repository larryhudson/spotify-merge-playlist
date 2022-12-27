module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({
    "node_modules/petite-vue/dist/petite-vue.es.js": "petite-vue.es.js",
    "node_modules/alpinejs/dist/module.esm.js": "alpine.es.js",
    css: "css",
  });

  return {
    dir: {
      input: "11ty-input",
      output: "11ty-output",
      layouts: "_layouts",
    },
  };
};
