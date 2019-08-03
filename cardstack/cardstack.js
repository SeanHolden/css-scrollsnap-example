import awesomeScroll from "../lib/awesomescroll";

const init = () => {
  window.onload = () => main();
};


const main = () => {
  awesomeScroll([
    ".carousel__section--one",
    ".carousel__section--two",
    ".carousel__section--three",
    ".carousel__section--four",
    ".carousel__section--five"
  ]);
};

init();
