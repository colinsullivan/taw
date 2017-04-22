/**
 *  @file       LevelMenuLightRenderer.js
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2017 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

import LightRenderer from "./LightRenderer"
import IdleMenuAnimation from "./IdleMenuAnimation"

/**
 *  @class        LevelMenuLightRenderer
 *
 *  @classdesc    Render lights for a single menu.
 **/
class LevelMenuLightRenderer extends LightRenderer {
  constructor(params) {
    super(params);

    this.levelName = params.levelName;
    this.controlMenuIndex = params.controlMenuIndex;

    this.idleAnimation = new IdleMenuAnimation(params);
    this.idleAnimation.play()

    this.currentAnimation = this.idleAnimation;

  }
}

export default LevelMenuLightRenderer;
