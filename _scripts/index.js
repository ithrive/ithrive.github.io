import "../_scss/main.scss";
import "./photoSwipe";

const SmoothScroll = require("smooth-scroll/dist/smooth-scroll.polyfills.js");

new SmoothScroll('a[href*="#"]', {
  header: "[data-scroll-header]",
  speed: 400,
  speedAsDuration: true
});