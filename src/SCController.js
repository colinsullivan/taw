/**
 *  @file       SCController.js
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2016 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

import * as actions from "./actions.js"
import config from "./config.js";

var supercolliderjs = require("supercolliderjs");

/**
 *  @class        SCController
 *
 *  @classdesc    Send and receive actions to the state store running in
 *  a separate [`sclang`](taw.awakening.io/docs/supercollider) process.
 **/
class SCController {
  constructor (store) {
    this.store = store;
    this._apiCallIndex = 0;

    // we're starting our journey!
    this.store.dispatch(actions.supercolliderInitStarted());

    // reads config file located at: ./.supercollider.yaml
    supercolliderjs.resolveOptions(null, {
      debug: true,
      stdin: false
    }).then((options) => {

      var api = new supercolliderjs.scapi.SCAPI(
        options.host,
        options.langPort
      );

      this.scapi = api;
      api.log.echo = true;

      api.on("error", function (err) {
        console.log("API ERROR: ");
        console.log(err);
      });

      console.log("sc api connecting...");
      api.connect();

      // send init message to the sc process
      this.call("taw.init", [this.store.getState()]).then((resp) => {
        if (resp.result.status === "ok") {
          console.log("sc api connected.");
          this.store.dispatch(actions.supercolliderReady());
        } else {
          console.error("ERROR: [SCController] Unable to connect to SuperCollider process.");
        }
      });
    });   

    // save a reference to knob states so we can handle changes
    let knobStates = {};
    config.KNOB_NAMES.forEach((knobName) => {
      knobStates[knobName] = this.store.getState().knobs[knobName];
    });

    // when state changes
    this.store.subscribe(() => {
      var state = this.store.getState();

      // send all state changes to sclang process
      if (state.supercolliderIsReady) {
        //console.log("calling taw.setState with");
        //console.log("state");
        //console.log(JSON.stringify(state, " ", 4));
        this.call("taw.setState", [state]);
      }


    });
  }

  getAPICallIndex () {
    if (this._apiCallIndex < Number.MAX_SAFE_INTEGER - 1) {
      this._apiCallIndex++;
    } else {
      this._apiCallIndex = 0;
    }
    return this._apiCallIndex;
  }
  call (apiMethodName, args) {
    return this.scapi.call(this.getAPICallIndex(), apiMethodName, args);
  }
}
export default SCController;
