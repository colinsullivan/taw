/**
 *  @file       KnobActiveAnimation.js
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2016 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

import LightAnimation, {PLAYING_STATES} from "./LightAnimation.js";
import PixelBuffer from "./PixelBuffer.js"
import config from "./config.js";

/**
 *  @class        KnobActiveAnimation
 *
 *  @classdesc    This is the animation for the lights around a single knob
 *  as it is being actively turned to switch the sequencer meter.
 **/
class KnobActiveAnimation extends LightAnimation {
  getNumPixels() {
    return config.SEQUENCE_NUM_LEDS;
  }
  constructor(params) {
    super(params);

    this.store = params.store;
    this.knobId = params.knobId;
  }
  render(t) {
    var i,
      x;

    if (this.playingState != PLAYING_STATES.PLAYING) {
      return;
    }

    x = 0.5 * Math.sin((t - this.startTime) * 0.01) + 0.5;
    for (i = 0; i < this.buffer.length; i++) {
      this.buffer.setPixel(i, 0.8, 0.7, 0.2 + 0.3*x);
    }
  }
};

export default KnobActiveAnimation;
