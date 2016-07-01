/**
 *  @file       IdleInstructionSignAnimation.js
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
 *  @class        IdleInstructionSignAnimation
 *
 *  @classdesc    Lights when instruction sign is inviting us to play
 **/
class IdleInstructionSignAnimation extends LightAnimation {
  getNumPixels() {
    return config.INSTRUCTION_SIGN_NUM_LEDS;    
  }
  render(t) {
    var i;
      //x;

    if (this.playingState != PLAYING_STATES.PLAYING) {
      return;
    }

    //x = 0.5 * Math.sin((t - this.startTime) * 0.001) + 0.5;
    for (i = 0; i < this.buffer.length; i++) {
      this.buffer.setPixel(i, 0.0, 0.0, 0.7);
    }
  }
};

export default IdleInstructionSignAnimation;
