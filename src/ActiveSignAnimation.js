/**
 *  @file       ActiveSignAnimation.js
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2016 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

import LightAnimation, {PLAYING_STATES} from "./LightAnimation.js";

/**
 *  @class        ActiveSignAnimation
 *
 *  @classdesc    The animation for a sign as a session is in progress.
 **/
class ActiveSignAnimation extends LightAnimation {
  getNumPixels() {
    return this.params.numPixels;
  }
  render(t) {
    var i,
      x;

    if (this.playingState != PLAYING_STATES.PLAYING) {
      return;
    }

    x = 0.5 * Math.sin((t - this.startTime) * 0.001) + 0.5;
    for (i = 0; i < this.buffer.length; i++) {
      this.buffer.setPixel(i, 0.4, 0.9, 0.6 + 0.4*x);
    }
  }
};

export default ActiveSignAnimation;
