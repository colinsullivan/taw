/**
 *  @file       SequencerLightsPlaybackAnimation.js
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2016 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

import LightAnimation from "./LightAnimation.js";
import config from "./config.js";
import PixelBuffer from "./PixelBuffer.js";


/**
 *  @class        SequencerLightsPlaybackAnimation
 *
 *  @classdesc    This animation is used for a single sequencer as it is
 *  playing.  It depends on the state of the sequencer.
 **/
class SequencerLightsPlaybackAnimation extends LightAnimation {
  getNumPixels() {
    return config.SEQUENCE_NUM_LEDS;
  }
  constructor(params) {
    super(params);

    this.store = params.store;

    this.sequencerName = params.sequencerName;

    // cache some state so we can handle when it changes
    this.lastState = {
      // meter and transport for our sequencer
      meter: null,
      transport: null,
    };
    
    this.store.subscribe(() => {this.handleStateChange()});
  }

  handleMeterChanged(sequencerState) {
    var numBeats = sequencerState.meter.numBeats,
      i,
      ledsPerBeat;

    // number of LEDs per beat (if less than one, there are more beats than
    // LEDS in the strip)
    ledsPerBeat = 1.0 * this.buffer.length / numBeats;

    // fill all leds with same color (pretty dim)
    for (i = 0; i < this.buffer.length; i++) {
      this.buffer.setPixel(i, 0.72, 0.2, 0.2);
    }

    // for each beat
    for (i = 0; i < numBeats; i++) {
      let ledIndex = Math.floor(ledsPerBeat * i) % this.buffer.length;

      // make it brighter
      this.buffer.setPixel(ledIndex, {
        s: 0.5,
        v: 0.5
      });

      // if this is the current beat
      if (i === sequencerState.transport.beat) {
        // it is the brightest
        this.buffer.setPixel(ledIndex, {
          s: 0.5,
          v: 1.0
        });
      }

    }
  }

  handleStateChange() {
    var newState = this.store.getState();
    var sequencerState = newState.sequencers[this.sequencerName];

    // if transport or meter have changed
    if (sequencerState.meter !== this.lastState.meter
    || sequencerState.transport !== this.lastState.transport) {
      this.handleMeterChanged(sequencerState);
    }
    
    // cache latest state
    this.lastState.meter = sequencerState.meter;
    this.lastState.transport = sequencerState.transport;
  }

};

export default SequencerLightsPlaybackAnimation;
