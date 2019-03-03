import "../_scss/main.scss";

const SmoothScroll = require("smooth-scroll/dist/smooth-scroll.polyfills.js");

new SmoothScroll('a[href*="#"]', {
  header: "[data-scroll-header]"
});