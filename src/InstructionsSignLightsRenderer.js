/**
 *  @file       InstructionsSignLightsRenderer.js
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2016 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

import LightRenderer from "./LightRenderer.js";
import ActiveSignAnimation from "./ActiveSignAnimation.js";
import IdleInstructionSignAnimation from "./IdleInstructionSignAnimation.js";
import TransmittingInstructionSignAnimation from "./TransmittingInstructionSignAnimation.js";
import config from "./config.js";
import { SESSION_STAGES } from "./actions.js"

/**
 *  @class        InstructionsSignLightsRenderer
 *
 *  @classdesc    Renders lighting animations for the instructions sign based
 *  on state.
 **/
class InstructionsSignLightsRenderer extends LightRenderer {
  constructor(params) {
    super(params);

    this.activeSignAnimation = new ActiveSignAnimation({
      store: this.store,
      numPixels: config.INSTRUCTION_SIGN_NUM_LEDS
    });
    this.allAnimations.push(this.activeSignAnimation);

    this.idleAnimation = new IdleInstructionSignAnimation({
      store: this.store
    });
    this.allAnimations.push(this.idleAnimation);

    this.transmittingAnimation = new TransmittingInstructionSignAnimation({
      store: this.store
    });
    this.allAnimations.push(this.transmittingAnimation);

    this.currentAnimation = this.idleAnimation;
    this.currentAnimation.play();
    
    this.store.subscribe(() => {this.handleStateChange()});
  }
  handleStateChange() {
    var state = this.store.getState(),
      newCurrentAnimation = this.currentAnimation;

    if (state.session.stage == SESSION_STAGES.INIT) {
      newCurrentAnimation = this.idleAnimation;
    } else if (state.session.stage == SESSION_STAGES.TRANSMIT_STARTED) {
      newCurrentAnimation = this.transmittingAnimation;
    } else if (state.session.stage == SESSION_STAGES.RESPONSE) {
      newCurrentAnimation = this.transmittingAnimation;
    } else {
      console.log("WARNING: InstructionsSignLightsRenderer default to idleAnimation");
      newCurrentAnimation = this.idleAnimation;
    }
    
    // if animation is changing
    if (newCurrentAnimation !== this.currentAnimation) {
      // stop old
      this.currentAnimation.stop();
      // start the new!
      newCurrentAnimation.play();
      this.currentAnimation = newCurrentAnimation;
    }
  }
};

export default InstructionsSignLightsRenderer;
