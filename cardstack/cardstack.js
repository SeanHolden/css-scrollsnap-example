import TweenMax from "TweenMax";
import ScrollMagic from "ScrollMagic";
import "animation.gsap";
import "debug.addIndicators";
import { Linear } from "gsap";

const DURATION = {
  FOREVER: 0
};

const init = (w, d) => {
  w.onload = () => main(d);
};

const defaultElementPosition = () => ({
  x: 0,
  y: 0,
  scale: 1,
  rotation: 0,
  ease: Linear.easeNone
});

const main = d => {
  const elOne = d.querySelector(".carousel__section--one");

  const c = new ScrollMagic.Controller();
  // scene(c)
  //   .from(0)
  //   .duration(elOne.clientHeight)
  //   .pin(".carousel__section--three");
  scene(c)
    .from(0)
    .duration(elOne.clientHeight)
    .move(".carousel__section--two")
    .fromRight();
  scene(c)
    .from(elOne.clientHeight)
    .duration(DURATION.FOREVER)
    .pin(".carousel__section--two");
  // scene(c)
  //   .from(elOne.clientHeight)
  //   .duration(elOne.clientHeight)
  //   .move(".carousel__section--three")
  //   .fromLeft();
  // scene(c)
  //   .from(elOne.clientHeight * 2)
  //   .duration(DURATION.FOREVER)
  //   .pin(".carousel__section--three");
};

const scene = controller => ({
  from: offset => ({
    duration: duration => ({
      pin: el => {
        controller.addScene(
          new ScrollMagic.Scene({ duration, offset }).setPin(el)
        );
      },
      move: el => ({
        fromRight: () => {
          const angleDeg = 30;
          const scale = 2;
          const element = document.querySelector(el);
          const angle = angleDeg * Math.PI / 180;
          const originalWidth = element.clientWidth * scale;
          const originalHeight = element.clientHeight * scale;
          const widthAfterRotation = ((originalWidth * Math.cos(angle)) + (originalHeight * Math.sin(angle)));
          const heightAfterRotation = ((originalWidth * Math.sin(angle)) + (originalHeight * Math.cos(angle)));

          // Work out x position.
          const xDifferenceAfterRotation = (widthAfterRotation - originalWidth);
          const xDifferenceBetweenScreenAndRect = originalWidth - window.innerWidth;
          const correctXPosition = (originalWidth + ((xDifferenceAfterRotation/2))) - (xDifferenceBetweenScreenAndRect/2);

          // Work out y position.
          const yDifferenceAfterRotation = heightAfterRotation - originalHeight;
          const topOfRotatedShapeToLeftPoint = originalWidth * Math.sin(angle); // right triangle vertical leg given angle & hypotenuse

          const pointPositionFromBottom = topOfRotatedShapeToLeftPoint - (window.innerHeight * scale);
          const yDifferenceBetweenScreenAndRect = originalHeight - window.innerHeight;
          const correctYPosition = ((yDifferenceAfterRotation/2) - pointPositionFromBottom) - (yDifferenceBetweenScreenAndRect/2);

            controller.addScene(
            new ScrollMagic.Scene({ duration, offset })
              .setTween(
                TweenMax.fromTo(
                  el,
                  1,
                  {
                    x: correctXPosition - (window.innerWidth/2),
                    y: correctYPosition - (window.innerHeight/2),
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
                    x: 0,
                    y: duration * 1.25,
                    scale: 1.5,
                    rotation: 45
                  },
                  defaultElementPosition()
                )
              )
              .setPin(el)
          );
        }
      })
    })
  })
});

init(window, document);
