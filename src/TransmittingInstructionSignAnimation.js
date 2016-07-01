/**
 *  @file       TransmittingInstructionSignAnimation.js
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2016 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

import LightAnimation, {PLAYING_STATES} from "./LightAnimation.js";
import config from "./config.js";

/**
 *  @class        TransmittingInstructionSignAnimation
 *
 *  @classdesc    Instruction sign as a transmission is happening!
 **/
class TransmittingInstructionSignAnimation extends LightAnimation {
  constructor(params) {
    super(params);

    this.currentSaturation = null;
  }
  play() {
    this.currentSaturation = 0.0;
    super.play();
  }
  getNumPixels() {
    return config.INSTRUCTION_SIGN_NUM_LEDS;    
  }
  render(t) {
    var i,
      speedUpElapsedTime = t - this.startTime,
      speedUpProgress,
      speedUpProgressCubic,
      hue,
      value,
      x;

    if (this.playingState != PLAYING_STATES.PLAYING) {
      return;
    }
    
    speedUpProgress = speedUpElapsedTime / config.SPEED_UP_DURATION;

    if (speedUpProgress <= 1.0) {
      speedUpProgressCubic = speedUpProgress * speedUpProgress * speedUpProgress;

      hue = speedUpProgressCubic * 0.7;
      value = 0.7 - (speedUpProgressCubic * 0.4);

      //x = 0.5 * Math.sin((t - this.startTime) * 0.001) + 0.5;
      for (i = 0; i < this.buffer.length; i++) {
        this.buffer.setPixel(i, 0.4, hue, value);
      }
    } else {
      // we've moved onto pulsing stage
      x = 0.5 * Math.sin((t - this.startTime) * 0.0006) + 0.5;
      for (i = 0; i < this.buffer.length; i++) {
        this.buffer.setPixel(i, 0.4, 0.7, 0.2 + 0.1*x);
      }
    }
  }
};

export default TransmittingInstructionSignAnimation;
