import TweenMax from "TweenMax";
import ScrollMagic from "ScrollMagic";
import "animation.gsap";
import "debug.addIndicators";
import { Linear } from "gsap";

const DURATION = {
  FOREVER: 0
};

const init = () => {
  window.onload = () => main();
};

const defaultElementPosition = () => ({
  x: 0,
  y: 0,
  scale: 1,
  rotation: 0,
  ease: Linear.easeNone
});

const main = () => {
  awesomeScroll([
    ".carousel__section--one",
    ".carousel__section--two",
    ".carousel__section--three",
    ".carousel__section--four",
    ".carousel__section--five"
  ]);
};

const awesomeScroll = selectors => {
  // first item is fixed, rest are absolute
  const elements = selectors.map((selector, i) => {
    const el = window.document.querySelector(selector);
    if (i === 0) {
      el.style.position = "fixed";
    } else {
      el.style.position = "absolute";
    }
    return el;
  });

  const c = new ScrollMagic.Controller();
  // pin everything except the first two items.
  // pin each item for the sum of all previous elements (except first).

  // create copy of selectors & elements.
  let selectorsClone = [...selectors];
  let elementsClone = [...elements];
  // remove first two.
  selectorsClone = selectorsClone.slice(2);
  elementsClone = elementsClone.slice(2);
  // convert elements to just their height values.
  const elHeights = elementsClone.map(element => element.clientHeight);
  // reverse them.
  selectorsClone.reverse();
  elHeights.reverse();

  // commence pinning for correct durations.
  selectorsClone.forEach(selector => {
    const sumOfAllElementHeights = elHeights.reduce((acc, val) => acc + val);
    scene(c)
      .from(0)
      .duration(sumOfAllElementHeights)
      .pin(selector);
    elHeights.pop();
  });

  // move elements in right, left, right left.
  // pin when in correct position.
  let selectorsClone2 = [...selectors];
  let elementsClone2 = [...elements];

  // remove first element as that does not need to move.
  selectorsClone2 = selectorsClone2.slice(1);
  elementsClone2 = elementsClone2.slice(1);

  // loop through each element and set their move and pin attributes.
  selectorsClone2.forEach((selector, i) => {
    let from = elementsClone2[i].clientHeight * i; // assumes all elements are exact same height
    const duration = elementsClone2[i].clientHeight;
    const direction = i % 2 === 0 ? "fromRight" : "fromLeft";
    // move
    scene(c)
      .from(from)
      .duration(duration)
      .move(selector)
      [direction]();

    // pin once in position
    from = elementsClone2[i].clientHeight * (i+1);
    scene(c)
      .from(from)
      .duration(DURATION.FOREVER)
      .pin(selector);
  });
};

const scene = controller => {
  const angleDeg = 50;
  const scale = 3;
  const angle = (angleDeg * Math.PI) / 180;

  return {
    from: offset => ({
      duration: duration => ({
        pin: el => {
          controller.addScene(
            new ScrollMagic.Scene({ duration, offset }).setPin(el)
          );
        },
        move: el => {
          const element = document.querySelector(el);
          const originalWidth = element.clientWidth * scale;
          const originalHeight = element.clientHeight * scale;
          const widthAfterRotation =
            originalWidth * Math.cos(angle) + originalHeight * Math.sin(angle);
          const heightAfterRotation =
            originalWidth * Math.sin(angle) + originalHeight * Math.cos(angle);

          // Work out x position.
          const xDifferenceAfterRotation = widthAfterRotation - originalWidth;
          const xDifferenceBetweenScreenAndRect =
            originalWidth - window.innerWidth;
          const correctXPosition =
            originalWidth +
            xDifferenceAfterRotation / 2 -
            xDifferenceBetweenScreenAndRect / 2;

          // Work out y position.
          const yDifferenceAfterRotation = heightAfterRotation - originalHeight;
          const topOfRotatedShapeToLeftPoint = originalWidth * Math.sin(angle); // right triangle vertical leg, given angle & hypotenuse
          const pointPositionFromBottom =
            topOfRotatedShapeToLeftPoint - window.innerHeight * scale;
          const yDifferenceBetweenScreenAndRect =
            originalHeight - window.innerHeight;
          const correctYPosition =
            yDifferenceAfterRotation / 2 -
            pointPositionFromBottom -
            yDifferenceBetweenScreenAndRect / 2;

          return {
            fromRight: () => {
              controller.addScene(
                new ScrollMagic.Scene({ duration, offset })
                  .setTween(
                    TweenMax.fromTo(
                      el,
                      1,
                      {
                        x: correctXPosition,
                        y: correctYPosition,
                        scale,
                        rotation: -angleDeg
                      },
                      defaultElementPosition()
                    )
                  )
                  .setPin(el)
              );
            },
            fromLeft: () => {
              controller.addScene(
                new ScrollMagic.Scene({ duration, offset })
                  .setTween(
                    TweenMax.fromTo(
                      el,
                      1,
                      {
                        x: -correctXPosition,
                        y: correctYPosition,
                        scale,
                        rotation: angleDeg
                      },
                      defaultElementPosition()
                    )
                  )
                  .setPin(el)
              );
            }
          };
        }
      })
    })
  };
};

init();
