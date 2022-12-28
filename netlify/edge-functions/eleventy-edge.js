import {
  EleventyEdge,
  precompiledAppData,
} from "./_generated/eleventy-edge-app.js";

import { addEdgeData } from "./utils/add-edge-data.js";

export default async (request, context) => {
  try {
    let edge = new EleventyEdge("edge", {
      request,
      context,
      precompiled: precompiledAppData,

      // default is [], add more keys to opt-in e.g. ["appearance", "username"]
      cookies: [],
    });

    edge.config((eleventyConfig) => {
      addEdgeData(request, context, eleventyConfig);

      eleventyConfig.addFilter("jsonToJs", function (value) {
        return JSON.stringify(value, null).replace(/</g, "\\u003c");
      });

      eleventyConfig.addFilter("arrSlice", (arr, start, end) =>
        arr.slice(start, end)
      );

      // Add some custom Edge-specific configuration
      // e.g. Fancier json output
      // eleventyConfig.addFilter("json", obj => JSON.stringify(obj, null, 2));
    });

    return await edge.handleResponse();
  } catch (e) {
    console.log("ERROR", { e });
    return context.next(e);
  }
};
