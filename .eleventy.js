const { EleventyEdgePlugin } = require("@11ty/eleventy");
const { EleventyServerlessBundlerPlugin } = require("@11ty/eleventy");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({
    "node_modules/petite-vue/dist/petite-vue.es.js": "petite-vue.es.js",
    "node_modules/alpinejs/dist/module.esm.js": "alpine.es.js",
    "node_modules/@11ty/is-land/is-land.js": "is-land.js",
    css: "css",
  });

  eleventyConfig.addPlugin(EleventyServerlessBundlerPlugin, {
    name: "serverless", // The serverless function name from your permalink object
    functionsDir: "./netlify/functions/",
    redirects: "netlify-toml-builders",
    copy: [".cache", "utils"],
  });

  eleventyConfig.addPlugin(EleventyEdgePlugin);

  eleventyConfig.addFilter("jsonToJs", function (value) {
    return JSON.stringify(value, null).replace(/</g, "\\u003c");
  });

  eleventyConfig.addFilter("arrSlice", (arr, start, end) =>
    arr.slice(start, end)
  );

  eleventyConfig.addFilter("arrAt", (arr, at) => arr.at(at));

  return {
    dir: {
      input: "11ty-input",
      output: "11ty-output",
      layouts: "_layouts",
    },
  };
};
