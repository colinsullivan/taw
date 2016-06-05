import { combineReducers  } from 'redux'
import moment from "moment"

import { actionTypes, SESSION_STAGES } from "./actions.js"

import config from "./config.js"



export var PLAYING_STATES = {
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
  ["dark_bass_lukebeats.wav", "darklukebeats"],
  ["2014-09-30_mis-studio-jam_sample.wav", "misjam"],
  ["deep-forest-lounge_sample.wav", "deepforest"],
  ["determinism_sample.wav", "determinism"],
  ["homebrew_sample.wav", "homebrew"],
  ["luke_kick.wav", "lukekick"],
  ["luke_snare.wav", "lukesnare"]
];

let possibleResponses = [
  "darklukebeats",
  "misjam",
  "deepforest",
  "determinism",
  "homebrew"
];
function bufferList (state = initialBufs, action) {
  return state;
}

/**
 * TODO: These are really one shot "events", which could be generative modules
 * or just playback buffers as they are currently.
 **/
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

      // TODO: think about what is actually happening here, the oneshots are
      // triggering other sounds.  This should be part of the session flow?
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

function sequencers (state = initialSequencers, action, session) {
  var seq;
  switch (action.type) {
    case actionTypes.KNOB_POS_CHANGED:
      seq = state[config.KNOB_NAME_TO_SEQUENCE_NAME[action.id]];

      if (
          session.stage == SESSION_STAGES.STARTED
          && seq.playingState == PLAYING_STATES.STOPPED
      ) {
        console.log("queueing sequencers");
        seq.playingState = PLAYING_STATES.QUEUED;
      }

      return state;
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
  },
  "C": {
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

//let initialTransmitButton = {
  //ledactive: 0
//};
//function transmitButton (state = initialTransmitButton, action) {
  //switch (action.type) {
    //case actionTypes.TRANSMIT_BUTTON_ACTIVATED:
      //state = Object.assign({}, state);
      //state.ledactive = 1;
      //break;
    //case actionTypes.TRANSMIT_BUTTON_DEACTIVATED:
      //state = Object.assign({}, state);
      //state.ledactive = 0;
      //break;
    //default:
      //break;
  //}

  //return state;
//}

let createNewSession = function () {
  return {
    stage: SESSION_STAGES.INIT,
    stageStartTime: moment(),
  };
};
let defaultSession = createNewSession();
function session (state = defaultSession, action) {
  let now = moment();
  let timeSinceStageStart = now.diff(state.stageStartTime, 'seconds');
  let newState = state;
  switch (action.type) {
    case actionTypes.SUPERCOLLIDER_READY:
      newState = createNewSession();
      break;

    case actionTypes.LIGHTING_READY:
      newState = createNewSession();
      break;
    
    case actionTypes.KNOB_POS_CHANGED:
      if (state.stage == SESSION_STAGES.INIT) {
      
        if (timeSinceStageStart < 8) {
          console.log("not starting during init cooldown period...");
        } else {
          newState = Object.assign({}, state);
          newState.stage = SESSION_STAGES.STARTED;
          newState.stageStartTime = moment();
        }
 
      }
      break;
    
    case actionTypes.TRANSMIT_STARTED:
      newState = Object.assign({}, state);
      newState.stage = SESSION_STAGES.TRANSMIT_STARTED;
      newState.stageStartTime = moment();
      break;
    
    case actionTypes.SOUND_STOPPED:

      // if transmitting sound just finished
      if (action.name == "transmitting") {
        newState = Object.assign({}, state);
        newState.stage = SESSION_STAGES.RESPONSE;
        newState.stageStartTime = moment();
      } else if (action.name == "response") {
        newState = createNewSession();
      }

      break;
    default:
      break;
  }

  return newState;
}

//export default combineReducers({
  //bufferList,
  //sounds,
  //sequencers,
  //supercolliderIsReady,
  //supercolliderInitializationStarted,
  //lightingInitializationStarted,
  //lightingIsReady,
  //knobs,
  //tempo,
  //session
//});

export default function (state = {}, action) {
  state.bufferList = bufferList(state.bufferList, action);
  state.supercolliderIsReady = supercolliderIsReady(state.supercolliderIsReady, action);
  state.supercolliderInitializationStarted = supercolliderInitializationStarted(state.supercolliderInitializationStarted, action);
  state.lightingInitializationStarted = lightingInitializationStarted(state.lightingInitializationStarted, action);
  state.lightingIsReady = lightingIsReady(state.lightingIsReady, action);
  state.knobs = knobs(state.knobs, action);
  state.tempo = tempo(state.tempo, action);
  state.session = session(state.session, action);

  state.sequencers = sequencers(state.sequencers, action, state.session);
  
  state.sounds = sounds(state.sounds, action);
  return state;
}
