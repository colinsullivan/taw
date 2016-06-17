/**
 *  @file       KnobMeterQueuedAnimation.js
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2016 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

import {PLAYING_STATES} from "./LightAnimation.js";
import KnobActiveAnimation from "./KnobActiveAnimation.js";
import config from "./config.js";

/**
 *  @class        KnobMeterQueuedAnimation
 *
 *  @classdesc    This animation is for the time between when the knob
 *  becomes inactive (and the meter changes is queued) and when the meter
 *  actually changes.  It looks similar to `KnobActiveAnimation` except with
 *  an additional pulsing animation.
 **/
class KnobMeterQueuedAnimation extends KnobActiveAnimation {
  render(t) {
    // do the `KnobActiveAnimation` as a starting point
    super.render(t);

    var i,
      currentState = this.store.getState(),
      numPossibleMeters = config.POSSIBLE_METERS.length,
      knobState,
      x;
    
    if (this.playingState != PLAYING_STATES.PLAYING) {
      return;
    }

    // Assuming this animation comes after a `KnobActiveAnimation` and thus
    // not clearing the pixels first

    knobState = currentState.knobs[this.knobId];
    x = 0.5 * Math.sin((t - this.startTime) * 0.01) + 0.5;
    
    let actualSelectionLEDIndex = Math.floor(
      knobState.selectedMeterIndex / numPossibleMeters * this.buffer.length
    );

    // for each led up to that one
    for (i = 0; i <= actualSelectionLEDIndex; i++) {
      // pulse
      this.buffer.setPixel(i, {
        v: 0.4 + 0.5*x
      });
    }

  }
};

export default KnobMeterQueuedAnimation;
