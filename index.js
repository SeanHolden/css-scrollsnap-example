import scrollSnapPolyfill from 'css-scroll-snap-polyfill'

window.onload = () => {
    // Needed for scroll-snap to work on Firefox, IE and other unsupported browsers.
    scrollSnapPolyfill();
};
