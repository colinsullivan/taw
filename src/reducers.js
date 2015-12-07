import { combineReducers  } from 'redux'

import { actionTypes, SESSION_STAGES } from "./actions.js"

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

let createSoundFromTemplate = function (name) {
  return {
    name: name,
    playingState: PLAYING_STATES.STOPPED
  };
};

let initialSounds = {
  "transmitting": {
    name: "transmitting",
    playingState: PLAYING_STATES.STOPPED,
    bufName: "transmitting",
    delay: 0
  },
  "response": {
    name: "response",
    playingState: PLAYING_STATES.STOPPED,
    delay: 0
  }
};

let initialBufs = [
  ["transmitting.wav", "transmitting"],
  ["dark_bass_lukebeats.wav", "darklukebeats"]
];
let possibleResponses = [
  "darklukebeats"
];
function bufferList (state = initialBufs, action) {
  return state;
}

function sounds (state = initialSounds, action) {
  switch (action.type) {
    case actionTypes.TRANSMIT_STARTED:
      state.transmitting.playingState = PLAYING_STATES.QUEUED;

      // choose random response
      state.response.bufName = possibleResponses[Math.floor(Math.random() * possibleResponses.length)];

      break;
    case actionTypes.SOUND_QUEUED:
      state[action.name].playingState = PLAYING_STATES.QUEUED;
      break;
    case actionTypes.SOUND_PLAYING:
      state[action.name].playingState = PLAYING_STATES.PLAYING;
      break;
    case actionTypes.SOUND_STOP_QUEUED:
      state[action.name].playingState = PLAYING_STATES.STOP_QUEUED;

      if (action.name == "transmitting") {
        // queue response with delay
        state.response.playingState = PLAYING_STATES.QUEUED;
        state.response.delay = action.delay - 6;
      }
      break;
    case actionTypes.SOUND_STOPPED:
      state[action.name].playingState = PLAYING_STATES.STOPPED;
      break;
    default:
      break;
  }
  return state;
}

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
    case actionTypes.TRANSMIT_STARTED:
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
  stage: SESSION_STAGES.INIT
};
function session (state = defaultSession, action) {
  switch (action.type) {
    case actionTypes.SESSION_STARTED:
      state.stage = SESSION_STAGES.STARTED;
      break;
    
    case actionTypes.TRANSMIT_STARTED:
      state.stage = SESSION_STAGES.TRANSMIT_STARTED;
      break;
    
    case actionTypes.SOUND_STOPPED:

      // if transmitting sound just finished
      if (action.name == "transmitting") {
        state.stage = SESSION_STAGES.RESPONSE;
      } else if (action.name == "response") {
        state.stage = SESSION_STAGES.INIT;
      }

      break;
    default:
      break;
  }

  return state;
}

export default combineReducers({
  bufferList,
  sounds,
  sequencers,
  supercolliderIsReady,
  supercolliderInitializationStarted,
  lightingInitializationStarted,
  lightingIsReady,
  knobs,
  tempo,
  session
});

/*export default function (state, action) {
  state.bufferList = bufferList(state.bufferList, action);
  state.sequencers = sequencers(state.sequencers, action);
  state.supercolliderIsReady = supercolliderIsReady(state.supercolliderIsReady, action);
  state.supercolliderInitializationStarted = supercolliderInitializationStarted(state.supercolliderInitializationStarted, action);
  state.lightingInitializationStarted = lightingInitializationStarted(state.lightingInitializationStarted, action);
  state.lightingIsReady = lightingIsReady(state.lightingIsReady, action);
  state.knobs = knobs(state.knobs, action);
  state.tempo = tempo(state.tempo, action);
  state.session = session(state.session, action);
  
  state.sounds = sounds(state.sounds, action, state.session);
  return state;
}*/
