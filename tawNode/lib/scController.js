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
          this.store.dispatch(actions.supercolliderInitCompleted());
        }
      });


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
