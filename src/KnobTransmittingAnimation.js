/**
 *  @file       KnobTransmittingAnimation.js
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2016 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

import LightAnimation, {PLAYING_STATES} from "./LightAnimation.js";
import { SESSION_STAGES } from "./actions.js"
import config from "./config.js";

let ANIMATION_STAGES = {
  SPEEDING_UP: 0,
  SLOWING_DOWN: 1,
  PULSING: 2
};


/**
 *  @class        KnobTransmittingAnimation
 *
 *  @classdesc    The animation that happens for each knob when a transmission
 *  is happening.
 **/
class KnobTransmittingAnimation extends LightAnimation {
  getNumPixels() {
    return config.SEQUENCE_NUM_LEDS;
  }
  constructor(params) {
    super(params);

    this.store = params.store;

    /**
     *  The position of the "head" in decimal form
     **/
    this.headPixelPosition = null;
    /**
     *  The length of the tail (in number of pixels)
     **/
    this.tailLength = null;
    this.sessionStage = null;

    this.slowDownStartTime = null;

    this.renderSnake = () => {
     
      var headPixelIndex = (
        Math.floor(this.headPixelPosition) % this.buffer.length
      ),
        // tailPixelIndex is not wrapped
        tailPixelIndex = headPixelIndex + this.tailLength,
        i;

      // head pixel
      this.buffer.setPixel(headPixelIndex, 0.4, 0.8, 0.8);

      // rest of tail
      for (i = headPixelIndex; i < tailPixelIndex; i++) {
        let fadeAmt = (i / tailPixelIndex) * (i / tailPixelIndex);
        this.buffer.setPixel(
          i % this.buffer.length,
          0.4,
          0.7 * fadeAmt + 0.1,
          0.7 * fadeAmt + 0.1
        );
      }
      
    };
    this.renderPulse = (t) => {
      var i,
        x;

      x = 0.5 * Math.sin((t - this.startTime) * 0.0006) + 0.5;
      for (i = 0; i < this.buffer.length; i++) {
        this.buffer.setPixel(i, 0.4, 0.7, 0.2 + 0.1*x);
      }
    };
  }
  play() {
    //console.log("KnobTransmittingAnimation.play");
    this.headPixelPosition = 0.0;
    this.tailLength = 0;
    this.sessionStage = this.store.getState().session.stage;
    super.play();
  }
  render(t) {
    var speedUpElapsedTime = t - this.startTime,
      speedUpProgress,
      speedUpProgressCubic,
      slowDownElapsedTime = t - this.startTime - config.SPEED_UP_DURATION,
      slowDownProgress,
      slowDownElapsedTime,
      increment,
      i,
      newSessionStage = this.store.getState().session.stage;
    
    if (this.playingState != PLAYING_STATES.PLAYING) {
      return;
    }
    
    if (this.sessionStage != newSessionStage) {
      this.sessionStage = newSessionStage;
    }
    
    // clear pallete
    for (i = 0; i < this.buffer.length; i++) {
      this.buffer.setPixel(i, 0, 0, 0);
    }

    // we know transmit is approximately 15 seconds
    speedUpProgress = speedUpElapsedTime / config.SPEED_UP_DURATION;
    slowDownProgress = slowDownElapsedTime / config.SLOW_DOWN_DURATION;

    if (speedUpProgress <= 1.0) {
      speedUpProgressCubic = (
        speedUpProgress * speedUpProgress
      );

      // speed up faster and faster
      increment = speedUpProgressCubic * 2;
      this.tailLength = Math.floor(
        speedUpProgressCubic * 10
      );
      this.headPixelPosition = this.headPixelPosition + increment;
      this.renderSnake();
    } else if (slowDownProgress <= 1.0) {
      // slow down faster and faster
      increment = (1.0 - (slowDownProgress * slowDownProgress)) * 2;
      this.headPixelPosition = this.headPixelPosition + increment;
      this.renderSnake();
    } else {
      // switch to pulsing
      this.renderPulse(t);
    }
  }

};

export default KnobTransmittingAnimation;
