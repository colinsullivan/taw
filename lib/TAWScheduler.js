import * as actions from "./actions.js";


class TAWScheduler {
  constructor (store) {
    this.store = store;
    this._currentBeatCache = {};

  }
  getCurrentBeatFromCache (instrName, current) {
    if (!this._currentBeatCache[instrName]) {
      this._currentBeatCache[instrName] = current;
    }
    return this._currentBeatCache[instrName];
  }

  supercolliderReady () {
    console.log("supercolliderReady");
/*
    var incrementStripPositionQuantized;

    var incrementStripPosition = function () {
      state.sequence.currentStep = (state.sequence.currentStep + 1) % state.sequence.numSteps;
    };
    incrementStripPositionQuantized = function () {
      api.call(this.getAPICallIndex(), "taw.playNote", []).then(function (resp) {
        console.log("resp");
        console.log(resp);
        if (state.clock.beats != resp.beats) {
          state.clock.beats = resp.beats;
          incrementStripPosition();
          console.log("state.sequence.currentStep");
          console.log(state.sequence.currentStep);
        }
        incrementStripPositionQuantized();
      });
    };
    incrementStripPositionQuantized();*/

    /*var scheduleTickUpdate;
    var tickUpdate = function (resp) {
      console.log("tickUpdate.resp");
      console.log(resp);
    };
    scheduleTickUpdate = () => {
      this.scapi.call(this.getAPICallIndex(), "taw.onNextTick", []).then(function (resp) {
        tickUpdate(resp);
        scheduleTickUpdate();
      });
    };
    scheduleTickUpdate();*/

    this.store.subscribe(() => {
     this.scheduleSequencerUpdatesIfNeeded();
    });

    // and now to start
    //this.scheduleSequencerUpdatesIfNeeded();

    // schedule updates for all sequencers to start
    /*var state = this.store.getState();
    Object.keys(state.sequencers).forEach((sequencerName) => {
      var sequencer = state.sequencers[sequencerName];
      this._currentBeatCache[sequencerName] = sequencer.currentBeat;
      var action = actions.stepSequencerForward(sequencerName);
      this.scheduleAction(action, sequencer.quant);
    });
    */
  }

  scheduleSequencerUpdatesIfNeeded () {
    var state = this.store.getState();
    
    Object.keys(state.sequencers).forEach((sequencerName) => {
      var sequencer = state.sequencers[sequencerName];
      // if beat has changed
      if (
        sequencer.currentBeat !== this.getCurrentBeatFromCache(
          sequencerName,
          sequencer.currentBeat
        )
      ) {
        // schedule update for the sequencer
        this.scheduleAction(actions.stepSequencerForward(sequencerName), sequencer.quant);
      }
    });
  }


  scheduleAction (action, quantization) {
    // TODO
    this.scController.call(
      "taw.scheduleAction",
      [action, quantization]
    ).then((resp) => {
      this.store.dispatch(action);
    });
  }
}
export default TAWScheduler;
