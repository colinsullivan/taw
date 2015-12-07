import { combineReducers  } from 'redux'

import { actionTypes } from "./actions.js"

import config from "./config.js"

var PLAYING_STATES = {
  STOPPED: "STOPPED",
  QUEUED: "QUEUED",
  PLAYING: "PLAYING",
  STOP_QUEUED: "STOP_QUEUED"
};

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
    playingState: PLAYING_STATES.STOPPED
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
    case actionTypes.TRANSMIT_BUTTON_UNPRESSED:
      Object.keys(state).forEach(function (sequencerName) {
        let seq = state[sequencerName];
        seq.playingState = PLAYING_STATES.STOP_QUEUED;
      })
      return state;
    
    case actionTypes.SEQUENCERS_QUEUED:
      Object.keys(state).forEach(function (sequencerName) {
        let seq = state[sequencerName];
        seq.playingState = PLAYING_STATES.QUEUED;
        seq.transport.beat = 0;
      });
      return state;
    case actionTypes.SEQUENCE_PLAYING:
      seq = state[action.name];
      seq.playingState = PLAYING_STATES.PLAYING;
      seq.transport.beat = 1;
      return state;
    case actionTypes.SEQUENCE_STOPPED:
      seq = state[action.name];
      seq.playingState = PLAYING_STATES.STOPPED;
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

let initialBufs = [
  ["transmitting.wav", "transmitting"]
];
function bufferList (state = initialBufs, action) {
  return state;
}

let initialSoundscape = {
  elements: [
    {
      name: "transmitting",
      repeat: false,
      playingState: PLAYING_STATES.STOPPED,
      bufs: ["transmitting"]
    }
  ]
};
function soundscape (state = initialSoundscape, action) {
  switch (action.type) {
    default:
      break;
  }

  return state;
}

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

let defaultSession = {
  stage: "START"
};
function session (state = defaultSession, action) {
  switch (action.type) {
    case actionTypes.TRANSMIT_BUTTON_PRESSED:
      state.stage = "TRANSMIT";
      break;
    
    default:
      break;
  }

  return state;
}

export default combineReducers({
  bufferList,
  sequencers,
  soundscape,
  supercolliderIsReady,
  supercolliderInitializationStarted,
  lightingInitializationStarted,
  lightingIsReady,
  knobs,
  tempo,
  session
});
