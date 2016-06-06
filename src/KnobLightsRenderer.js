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
import {PLAYING_STATES} from "./reducers.js";


/**
 *  @class        KnobLightsRenderer
 *
 *  @classdesc    Translate state changes into light colors, switch between
 *  animations as appropriate.
 **/
class KnobLightsRenderer {
  constructor(params) {

    console.log("[KnobLightsRenderer] constructor");

    this.store = params.store;

    // which sequence is this knob controlling
    // TODO: In the future this may be multiple sequencers
    this.sequencerName = params.sequencerName;

    // cache some state so we can handle when it changes
    this.lastState = {
      // playing state of our sequencer
      playingState: null,
      session: null
    }

    // the animation that will happen as the sequencer is playing
    this.playbackAnimation = new SequencerLightsPlaybackAnimation({
      store: this.store,
      sequencerName: this.sequencerName
    });

    // the animation that will happen as the sequencer is queued
    this.queuedAnimation = new QueuedSequencerAnimation();

    this.currentAnimation = this.playbackAnimation;

    this.store.subscribe(() => {this.handleStateChange()});
    
  }

  handleStateChange() {
    var newState = this.store.getState();
    var sequencerState = newState.sequencers[this.sequencerName];

    console.log("[KnobLightsRenderer] handleStateChange");

    // if sequencer playingState has changed, need to switch view
    if (sequencerState.playingState !== this.lastState.playingState) {
      // if queued, start the queued animation and switch to it
      if (sequencerState.playingState == PLAYING_STATES.QUEUED) {
        this.queuedAnimation.play();
        this.currentAnimation = this.queuedAnimation;
      } else {
        // if playing, start the playback renderer and switch to it
        this.currentAnimation = this.playbackAnimation;
      }
    }


    // cache latest state
    this.lastState.playingState = sequencerState.playingState;
    this.lastState.session = newState.session;
  }

  render(t) {
    this.playbackAnimation.render(t);
    this.queuedAnimation.render(t);
  }

  getOutputBuffer() {
    return this.currentAnimation.buffer;
  }
};

export default KnobLightsRenderer;
