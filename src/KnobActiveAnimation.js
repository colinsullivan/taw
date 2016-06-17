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
      currentState = this.store.getState(),
      numPossibleMeters = config.POSSIBLE_METERS.length,
      knobState;

    if (this.playingState != PLAYING_STATES.PLAYING) {
      return;
    }

    knobState = currentState.knobs[this.knobId];
     
    //selectedMeter = config.POSSIBLE_METERS[knobState.selectedMeterIndex];

    // fill all pixels with the same color (pretty dim)
    for (i = 0; i < this.buffer.length; i++) {
      this.buffer.setPixel(i, 0.4, 0.2, 0.2);
    }

    // for each possible meter
    for (i = 0; i < numPossibleMeters; i++) {
      // LED that indicates a possible selection
      let possibleSelectionIndicatorIndex = Math.floor(
        (i / numPossibleMeters) * this.buffer.length
      );

      this.buffer.setPixel(possibleSelectionIndicatorIndex, 0.1, 0.5, 0.4);
    }

    // now show actual selection
    let actualSelectionLEDIndex = Math.floor(
      knobState.selectedMeterIndex / numPossibleMeters * this.buffer.length
    );

    // for each led up to that one
    for (i = 0; i <= actualSelectionLEDIndex; i++) {
      this.buffer.setPixel(i, 0.1, 0.9, 0.9);
    }

  }
};

export default KnobActiveAnimation;
