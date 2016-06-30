/**
 *  @file       KnobLightsRenderer.js
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2016 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

import LightRenderer from "./LightRenderer.js";
import SequencerLightsPlaybackAnimation from "./SequencerLightsPlaybackAnimation.js";
import QueuedSequencerAnimation from "./QueuedSequencerAnimation.js";
import KnobActiveAnimation from "./KnobActiveAnimation.js";
import KnobMeterQueuedAnimation from "./KnobMeterQueuedAnimation.js";
import KnobTransmittingAnimation from "./KnobTransmittingAnimation.js";
import {PLAYING_STATES} from "./reducers.js";
import { SESSION_STAGES } from "./actions.js"


/**
 *  @class        KnobLightsRenderer
 *
 *  @classdesc    Render lights for a single knob.  Translate state changes
 *  into light colors, switch between animations as appropriate.
 **/
class KnobLightsRenderer extends LightRenderer {
  constructor(params) {
    super(params);

    //console.log("[KnobLightsRenderer] constructor");
    // which sequence is this knob controlling
    // TODO: In the future this may be multiple sequencers
    this.sequencerName = params.sequencerName;

    // which knob
    this.knobId = params.knobId;

    // cache some state so we can handle when it changes
    this.lastState = {
      // playing state of our sequencer
      playingState: null,
      session: null,
      knobActive: null
    };

    // the animation that will happen as the sequencer is playing
    this.playbackAnimation = new SequencerLightsPlaybackAnimation({
      store: this.store,
      sequencerName: this.sequencerName
    });
    this.allAnimations.push(this.playbackAnimation);

    // the animation that will happen as the sequencer is queued
    this.queuedAnimation = new QueuedSequencerAnimation();
    this.allAnimations.push(this.queuedAnimation);

    // the animation that will happen as the knob is actively being turned
    this.knobActiveAnimation = new KnobActiveAnimation({
      store: this.store,
      knobId: this.knobId
    });
    this.allAnimations.push(this.knobActiveAnimation);

    // the animation that will happen when a meter change is queued
    this.meterQueuedAnimation = new KnobMeterQueuedAnimation({
      store: this.store,
      knobId: this.knobId
    });
    this.allAnimations.push(this.meterQueuedAnimation);

    // when the system is transmitting
    this.knobTransmittingAnimation = new KnobTransmittingAnimation({
      store: this.store
    });
    this.allAnimations.push(this.knobTransmittingAnimation);

    this.currentAnimation = this.playbackAnimation;

    this.store.subscribe(() => {this.handleStateChange()});
  }

  handleStateChange() {
    var newState = this.store.getState();
    var sequencerState = newState.sequencers[this.sequencerName];
    var knobState = newState.knobs[this.knobId];
    var newCurrentAnimation = this.currentAnimation;

    //console.log("[KnobLightsRenderer] handleStateChange");

    // if system is in transmit mode or response mode
    if (
      newState.session.stage == SESSION_STAGES.TRANSMIT_STARTED
    || newState.session.stage == SESSION_STAGES.RESPONSE
    ) {
      newCurrentAnimation = this.knobTransmittingAnimation;
    } else {
      // if we're playing
      if (sequencerState.playingState == PLAYING_STATES.PLAYING) {

        // if a meter change is queued
        if (sequencerState.queuedMeter) {
          newCurrentAnimation = this.meterQueuedAnimation;
        } else if (knobState.active) {
        // if knob is currently active
          newCurrentAnimation = this.knobActiveAnimation;
        }
        else {
          // just plain old playback
          newCurrentAnimation = this.playbackAnimation;
        }

      } else if (sequencerState.playingState == PLAYING_STATES.QUEUED) {
        // if queued, start the queued animation and switch to it
        newCurrentAnimation = this.queuedAnimation;
      } else {
        newCurrentAnimation = this.playbackAnimation;
      }
    }


    // if animation is changing
    if (newCurrentAnimation !== this.currentAnimation) {
      // stop old
      this.currentAnimation.stop();
      // start the new!
      newCurrentAnimation.play();
      this.currentAnimation = newCurrentAnimation;
    }



    // cache latest state
    this.lastState.playingState = sequencerState.playingState;
    this.lastState.session = newState.session;
  }

};

export default KnobLightsRenderer;
