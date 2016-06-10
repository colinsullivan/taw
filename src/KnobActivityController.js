/**
 *  @file       KnobActivityController.js
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2016 Colin Sullivan
 *  @license    Licensed under the MIT license.
 **/

import * as actions from "./actions.js"

/**
 *  @class        KnobActivityController
 *
 *  @classdesc    Handles keeping track of activity for a single knob to
 *  determine when it has become inactive.
 **/
class KnobActivityController {
  constructor(store, knobId) {
    this.store = store;
    this.knobId = knobId;

    // get the current state of our knob
    this.knobState = this.store.getState().knobs[knobId];

    // a timeout to determine when the knob becomes inactive
    this.inactiveTimeout = null;

    // when any state changes
    this.store.subscribe(() => {
      // if our knob's state has changed
      var newKnobState = this.store.getState().knobs[knobId];

      if (this.knobState !== newKnobState) {

        this.knobState = newKnobState;
        this.handleKnobStateChanged();

      }
    });

  }

  handleKnobStateChanged() {
    // clear any existing inactive timeout
    if (this.inactiveTimeout) {
      clearTimeout(this.inactiveTimeout);
    }

    // if the knob is active
    if (this.knobState.active) {

      // start new timeout to detect when this knob becomes inactive
      this.inactiveTimeout = setTimeout(() => {
        // when the knob is inactive, update state
        this.store.dispatch(actions.knobInactive(this.knobId));
      }, 1000);

    }


  }
};

export default KnobActivityController;
