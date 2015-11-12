import { combineReducers  } from 'redux'

import { actionTypes } from "./actions.js"

function sequencers (state = [], action) {
  switch (action.type) {
    /*case actionTypes.SEQUENCER_STEP_SCHEDULED:
      // copy sequencer
      let seq = Object.assign({}, state[action.name]);
      seq.updateScheduled = true;
      // update sequencer
      state[action.name] = seq;
      return state;*/
    /*case actionTypes.SEQUENCER_STEPPED:
      let seq = state[action.name];
      let currentBeat = Object.assign({}, seq.currentBeat);
      // step forward
      currentBeat.value = (currentBeat.value + 1) % seq.quant.value;
      seq.currentBeat = currentBeat;

      return state;*/
    case actionTypes.SEQUENCERS_QUEUED:
      Object.keys(state).forEach(function (sequencerName) {
        let seq = state[sequencerName];
        seq.playingState = "QUEUED";
      });
      return state;
    default:
      return state;
  }
};

function supercolliderIsReady (state = false, action) {
  switch (action.type) {
    case actionTypes.SUPERCOLLIDER_READY:
      return true;
    default:
      return state;
  }
}

function supercolliderInitializationStarted (state = false, action) {
  switch (action.type) {
    case actionTypes.SUPERCOLLIDER_INIT_START:
      return true;
    default:
      return state;
  }
}

function supercolliderInitializationComplete (state = false, action) {
  switch (action.type) {
    case actionTypes.SUPERCOLLIDER_INIT_COMPLETE:
      return true;
    default:
      return state;
  }
}

function tempo (state = {}, action) {
  return state;
}

export default combineReducers({
  sequencers,
  supercolliderIsReady,
  supercolliderInitializationStarted,
  supercolliderInitializationComplete,
  tempo
});
