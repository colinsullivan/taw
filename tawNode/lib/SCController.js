import * as actions from "./actions.js"

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

    let knobA = this.store.getState().knobs.A;
    this.store.subscribe(() => {
      var state = this.store.getState();
      if (state.supercolliderIsReady) {
        this.call("taw.setState", [state]);
      }


      if (state.knobs.A !== knobA) {
        let possibleMeters = [1, 2, 3, 4, 6, 8, 16, 24, 32];
        let knobMin = -50.0;
        let knobMax = 50.0;
        let knobRangeSize = (knobMax - knobMin);
        let knobRangeChunkSize = knobRangeSize / (possibleMeters.length - 1);

        let selectedMeterIndex = Math.floor(
          (state.knobs.A.position - knobMin) / knobRangeChunkSize
        );

        let selectedMeter = possibleMeters[selectedMeterIndex];

        knobA = state.knobs.A;
        /*this.store.dispatch(
          actions.changeSequencerMeter("lead", selectedMeter)
        );*/
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
