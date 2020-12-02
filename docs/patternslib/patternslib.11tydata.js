module.exports = {
  eleventyComputed: {
    title: data => {
        let url_parts = data.page.filePathStem.split('/');
        return url_parts[url_parts.length - 2].replace('-', ' ').replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));
    },
    permalink: data => {
        let url_parts = data.page.filePathStem.split('/');
        return `patternslib/${url_parts[url_parts.length - 2]}/`;
    }
  },
  layout: "layout_patternslib.liquid"
};
