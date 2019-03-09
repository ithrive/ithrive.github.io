import PhotoSwipe from "photoswipe/dist/photoswipe";
import PhotoSwipeUI_Default from "photoswipe/dist/photoswipe-ui-default";

var pswpElement = document.querySelectorAll('.pswp')[0];

var initPhotoSwipe = function (el) {

  var thumbElements = el.getElementsByTagName("A"),
    numNodes = thumbElements.length,
    items = [],
    linkEl,
    size,
    item;

  for (var i = 0; i < numNodes; i++) {
    const index = i;

    linkEl = thumbElements[i]; // <a> element

    size = linkEl.getAttribute('data-size').split('x');

    // create slide object
    item = {
      src: linkEl.getAttribute('href'),
      w: parseInt(size[0], 10),
      h: parseInt(size[1], 10)
    };

    if (linkEl.children.length > 0) {
      // <img> thumbnail element, retrieving thumbnail url
      item.msrc = linkEl.children[0].getAttribute('src');
    }

    item.el = linkEl; // save link to element for getThumbBoundsFn
    items.push(item);

    linkEl.onclick = function (e) {

      e = e || window.event;
      e.preventDefault ? e.preventDefault() : e.returnValue = false;
      openPhotoSwipe(index);
    }
  }

  var openPhotoSwipe = function (index, disableAnimation) {
    console.log(index);

    // define options (if needed)
    var options = {
      index: index,
      showAnimationDuration: disableAnimation ? 0 : 500,
      getThumbBoundsFn: function (index) {
        // See Options -> getThumbBoundsFn section of documentation for more info
        var thumbnail = items[index].el.getElementsByTagName('img')[0], // find thumbnail
          pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
          rect = thumbnail.getBoundingClientRect();

        return {
          x: rect.left,
          y: rect.top + pageYScroll,
          w: rect.width
        };
      }
    };

    // exit if index not found
    if (isNaN(options.index)) {
      return;
    }

    // Pass data to PhotoSwipe and initialize it
    const gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
    gallery.init();
  };
};

// execute above function
const galleries = document.getElementsByClassName("photoSwipe-gallery");
for (var i = 0; i < galleries.length; i++) {
  initPhotoSwipe(galleries[i]);
}