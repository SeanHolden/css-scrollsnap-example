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
  scene(c)
    .from(0)
    .duration(elOne.clientHeight)
    .pin(".carousel__section--three");
  scene(c)
    .from(0)
    .duration(elOne.clientHeight)
    .move(".carousel__section--two")
    .fromRight();
  scene(c)
    .from(elOne.clientHeight)
    .duration(DURATION.FOREVER)
    .pin(".carousel__section--two");
  scene(c)
    .from(elOne.clientHeight)
    .duration(elOne.clientHeight)
    .move(".carousel__section--three")
    .fromLeft();
  scene(c)
    .from(elOne.clientHeight * 2)
    .duration(DURATION.FOREVER)
    .pin(".carousel__section--three");
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
          const scaleBy = 0.5;
          controller.addScene(
            new ScrollMagic.Scene({ duration, offset })
              .setTween(
                TweenMax.fromTo(
                  el,
                  1,
                  {
                    x: duration * 0.7,
                    y: duration * (1 + scaleBy / 2),
                    scale: 1 + scaleBy,
                    rotation: -45
                  },
                  defaultElementPosition()
                )
              )
              .setPin(el)
          );
        },
        fromLeft: () => {
          const scaleBy = 0.5;
          controller.addScene(
            new ScrollMagic.Scene({ duration, offset })
              .setTween(
                TweenMax.fromTo(
                  el,
                  1,
                  {
                    x: -duration * 0.7,
                    y: duration * (1 + scaleBy / 2),
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
