/*
 *
 * Awesome Scroll by Sean Holden
 *
 * Makes for a cool scroll effect by having elements fly in at an angle from bottom left and bottom right of the screen, like pages.
 *
 * Rules for this to work:
 * - Each element height must be 100% of the screen.
 * - Each element width must be 100% of the screen.
 *
 * If these rules aren't met, there may be unexpected results.
 *
 * */
import TweenMax from "TweenMax";
import ScrollMagic from "ScrollMagic";
import "animation.gsap";
import "debug.addIndicators";
import { Linear } from "gsap";

const DURATION = {
  FOREVER: 0
};

const defaultElementPosition = () => ({
  x: 0,
  y: 0,
  scale: 1,
  rotation: 0,
  ease: Linear.easeNone
});

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

  // set document body to combined height of all elements.
  document.body.style.height =
    elements.map(el => el.clientHeight).reduce((acc, height) => acc + height) +
    "px";

  const c = new ScrollMagic.Controller();

  // pin everything except the first two items.
  // pin each item for the sum of all previous elements (except first).

  // create copy of selectors & elements.
  // remove first two.
  let selectorsCopy = [...selectors].slice(2);
  let elementsCopy = [...elements].slice(2);

  // convert elements to just their height values.
  const elHeights = elementsCopy.map(element => element.clientHeight);
  // reverse them.
  selectorsCopy.reverse();
  elHeights.reverse();

  // commence pinning for correct durations.
  selectorsCopy.forEach(selector => {
    const sumOfAllElementHeights = elHeights.reduce(
      (acc, height) => acc + height
    );
    scene(c)
      .from(0)
      .duration(sumOfAllElementHeights)
      .pin(selector);
    elHeights.pop();
  });

  // move elements in right, left, right left.
  // pin when in correct position.
  // remove first element as that does not need to move.
  let selectorsCopy2 = [...selectors].slice(1);
  let elementsCopy2 = [...elements].slice(1);

  // loop through each element and set their move and pin attributes.
  selectorsCopy2.forEach((selector, i) => {
    // move
    scene(c)
      .from(elementsCopy2[i].clientHeight * i)
      .duration(elementsCopy2[i].clientHeight)
      .move(selector)
      [i % 2 === 0 ? "fromRight" : "fromLeft"]();

    // pin once in position
    scene(c)
      .from(elementsCopy2[i].clientHeight * (i + 1))
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

export default awesomeScroll;
