import * as actions from "./actions.js"
import config from "./config.js";

var supercolliderjs = require("supercolliderjs");

class SCController {
  constructor (store) {
    this.store = store;
    this._apiCallIndex = 0;

    this.store.dispatch(actions.supercolliderInitStarted());
    supercolliderjs.resolveOptions(null, {
      debug: true,
      stdin: false
    }).then((options) => {

      var api = new supercolliderjs.scapi(
        options.host,
        options.langPort
      );

      this.scapi = api;
      api.log.echo = true;

      api.on("error", function (err) {
        console.log("API ERROR: ");
        console.log(err);
      });

      console.log("connecting...");
      api.connect();

      console.log("connected.");

      this.call("taw.init", [this.store.getState()]).then((resp) => {
        if (resp.result.status === "ok") {
          this.store.dispatch(actions.supercolliderReady());
        }
      });
    });   

    // save a reference to knob states so we can handle changes
    let knobStates = {};
    config.KNOB_NAMES.forEach((knobName) => {
      knobStates[knobName] = this.store.getState().knobs[knobName];
    });

    this.store.subscribe(() => {
      var state = this.store.getState();
      if (state.supercolliderIsReady) {
        this.call("taw.setState", [state]);
      }

      // for each knob
      config.KNOB_NAMES.forEach((knobName) => {

        // if state has changed
        let savedKnobState = knobStates[knobName];
        let currentKnobState = state.knobs[knobName];

        if (savedKnobState !== currentKnobState) {
          // update saved knob state
          knobStates[knobName] = currentKnobState;

          // handle changes
          this.handleKnobChanged(knobName, currentKnobState);
        }
      });

    });
  }

  // TODO: this should be in reducers
  handleKnobChanged (knobName, knobState) {
    //console.log(`handleKnobChanged: ${knobName}`);
    var sequencerName = config.KNOB_NAME_TO_SEQUENCE_NAME[knobName];
    var possibleMeters = [1, 2, 3, 4, 5, 6, 8];
    var knobMin = -50.0;
    var knobMax = 50.0;
    var knobRangeSize = (knobMax - knobMin);
    var knobRangeChunkSize = knobRangeSize / (possibleMeters.length - 1);

    var selectedMeterIndex = Math.floor(
      (knobState.position - knobMin) / knobRangeChunkSize
    );

    var selectedMeter = possibleMeters[selectedMeterIndex];

    this.store.dispatch(
      actions.changeSequencerMeter(
        sequencerName,
        selectedMeter,
        4.0 / selectedMeter
      )
    );
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
