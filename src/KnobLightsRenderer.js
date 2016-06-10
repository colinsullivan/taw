/**
 *  @file       KnobLightsRenderer.js
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2016 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

import SequencerLightsPlaybackAnimation from "./SequencerLightsPlaybackAnimation.js";
import QueuedSequencerAnimation from "./QueuedSequencerAnimation.js";
import KnobActiveAnimation from "./KnobActiveAnimation.js";
import {PLAYING_STATES} from "./reducers.js";


/**
 *  @class        KnobLightsRenderer
 *
 *  @classdesc    Render lights for a single knob.  Translate state changes
 *  into light colors, switch between animations as appropriate.
 **/
class KnobLightsRenderer {
  constructor(params) {

    //console.log("[KnobLightsRenderer] constructor");

    this.store = params.store;


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

    // the animation that will happen as the sequencer is queued
    this.queuedAnimation = new QueuedSequencerAnimation();

    // the animation that will happen as the knob is actively being turned
    this.knobActiveAnimation = new KnobActiveAnimation({
      store: this.store,
      knobId: this.knobId
    });

    this.currentAnimation = this.playbackAnimation;

    this.store.subscribe(() => {this.handleStateChange()});

  }

  handleStateChange() {
    var newState = this.store.getState();
    var sequencerState = newState.sequencers[this.sequencerName];
    var knobState = newState.knobs[this.knobId];
    var newCurrentAnimation = this.currentAnimation;

    //console.log("[KnobLightsRenderer] handleStateChange");

    // if sequencer playingState has changed need to switch view
    if (sequencerState.playingState !== this.lastState.playingState) {

      // if queued, start the queued animation and switch to it
      if (sequencerState.playingState == PLAYING_STATES.QUEUED) {
        newCurrentAnimation = this.queuedAnimation;
      } else {

        // if playing, start the playback renderer and switch to it
        newCurrentAnimation = this.playbackAnimation;

      }
    }

    // if we're playing
    if (sequencerState.playingState == PLAYING_STATES.PLAYING) {
      // and the knob activity has changed
      if (knobState.active !== this.lastState.knobActive) {

          // if knob has become active
          if (knobState.active) {
            // show knob active animation
            newCurrentAnimation = this.knobActiveAnimation;
          } else {
            // knob just became inactive, switch back to playback animation
            newCurrentAnimation = this.playbackAnimation;
          }
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

  render(t) {
    this.playbackAnimation.render(t);
    this.queuedAnimation.render(t);
    this.knobActiveAnimation.render(t);
  }

  getOutputBuffer() {
    return this.currentAnimation.buffer;
  }
};

export default KnobLightsRenderer;
