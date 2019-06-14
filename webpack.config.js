const path = require("path");

module.exports = {
  entry: {
    scrollsnaphorizontal: "./scrollsnaphorizontal/scrollsnaphorizontal.js",
    scrollsnapvertical: "./scrollsnapvertical/scrollsnapvertical.js",
    cardstack: "./cardstack/cardstack.js"
  },
  resolve: {
    modules: ["node_modules"],
    alias: {
      TweenLite: "gsap/src/minified/TweenLite.min.js",
      TweenMax: "gsap/src/minified/TweenMax.min.js",
      TimelineLite: "gsap/src/minified/TimelineLite.min.js",
      TimelineMax: "gsap/src/minified/TimelineMax.min.js",
      ScrollMagic: "scrollmagic/scrollmagic/minified/ScrollMagic.min.js",
      "animation.gsap":
        "scrollmagic/scrollmagic/minified/plugins/animation.gsap.min.js",
      "debug.addIndicators":
        "scrollmagic/scrollmagic/minified/plugins/debug.addIndicators.min.js"
    }
  },
  mode: "development",
  output: {
    filename: "[name]/[name].min.js",
    path: path.resolve(__dirname)
  },
  devtool: "inline-source-map",
  devServer: {
    contentBase: path.resolve(__dirname),
    useLocalIp: true,
    host: "0.0.0.0"
  }
};
