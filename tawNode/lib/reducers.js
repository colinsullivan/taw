import { combineReducers  } from 'redux'

import { actionTypes } from "./actions.js"

let initialSequencers = {
  lead: {
    name: "lead",
    clock: {
      beats: 0,
      beatInBar: 0
    },
    playingState: "STOPPED"
  }
};

function sequencers (state = initialSequencers, action) {
  var seq;
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
    case actionTypes.SEQUENCE_PLAYING:
      seq = state[action.name];
      seq.playingState = "PLAYING";
      return state;
    case actionTypes.SEQUENCER_CLOCK_UPDATE:
      seq = state[action.name];
      seq.clock = Object.assign({}, seq.clock);
      seq.clock.beats = action.beats;
      seq.clock.beatInBar = action.beatInBar;
      return state;
    case actionTypes.SEQUENCER_CLOCK_METER_CHANGED:
      seq = state[action.name];
      seq.clock = Object.assign({}, seq.clock);
      seq.clock.beatsPerBar = action.beatsPerBar;
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

function tempo (state = {value: 96}, action) {
  return state;
}

function lightingInitializationStarted (state = false, action) {
  if (action.type === actionTypes.LIGHTING_INIT_START) {
    return true;
  } else {
    return state;
  }
}

function lightingIsReady (state = false, action) {
  if (action.type === actionTypes.LIGHTING_READY) {
    return true;
  } else {
    return state;
  }
}

export default combineReducers({
  sequencers,
  supercolliderIsReady,
  supercolliderInitializationStarted,
  supercolliderInitializationComplete,
  lightingInitializationStarted,
  lightingIsReady,
  tempo
});
