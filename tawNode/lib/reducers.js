import { combineReducers  } from 'redux'

import { actionTypes } from "./actions.js"

import config from "./config.js"

let createSequencerFromTemplate = function (name) {
  return {
    name: name,
    transport: {
      beat: 0
    },
    meter: {
      numBeats: 8,
      beatDur: 1
    },
    playingState: "STOPPED"
  };
};

let initialSequencers = {};

config.SEQUENCE_NAMES.forEach(function (sequencerName) {
  initialSequencers[sequencerName] = createSequencerFromTemplate(sequencerName);
});

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
      seq.transport.beat = 1;
      return state;
    case actionTypes.SEQUENCER_TRANSPORT_UPDATED:
      seq = state[action.name];
      seq.transport = Object.assign({}, seq.transport);
      seq.transport.beat = action.beat;
      return state;
    case actionTypes.SEQUENCER_METER_UPDATED:
      seq = state[action.name];
      seq.meter = Object.assign({}, seq.meter);
      seq.meter.numBeats = action.numBeats;
      seq.meter.beatDur = action.beatDur;
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

function tempo (state = 96, action) {
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

let defaultKnobs = {
  "A": {
    position: 0
  },
  "B": {
    position: 0
  }
};
function knobs (state = defaultKnobs, action) {
  var knob;
  switch (action.type) {
    case actionTypes.KNOB_POS_CHANGED:
      knob = state[action.id]
      knob = Object.assign({}, knob);
      knob.position = action.position;
      state[action.id] = knob;
      return state;
    default:
      return state;
  }
}

export default combineReducers({
  sequencers,
  supercolliderIsReady,
  supercolliderInitializationStarted,
  lightingInitializationStarted,
  lightingIsReady,
  knobs,
  tempo
});
