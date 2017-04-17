import { combineReducers  } from 'redux'
import moment from "moment"
import _ from "underscore"

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
    // if something is set here, it means meter will change very soon.
    queuedMeter: false,
    playingState: PLAYING_STATES.STOPPED
  };
};

let initialSequencers = {};
//let initialSequencers = {
  //"zaps": createSequencerFromTemplate("zaps")
//};
//initialSequencers.zaps.playingState = PLAYING_STATES.QUEUED;

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


function sequencers (state = initialSequencers, action, session, knobs) {
  var seq;
  switch (action.type) {
    // if a knob changed
    case actionTypes.KNOB_POS_CHANGED:

      // get sequencer associated with that knob
      seq = state[config.KNOB_NAME_TO_SEQUENCE_NAME[action.id]];

      if (
        // if session is running and this sequencer is stopped
          session.stage == SESSION_STAGES.STARTED
          && seq.playingState == PLAYING_STATES.STOPPED
      ) {
        // time to queue sequencer
        seq.playingState = PLAYING_STATES.QUEUED;
      }


      return state;
    case actionTypes.KNOB_INACTIVE:
      // get sequencer associated with that knob
      seq = state[config.KNOB_NAME_TO_SEQUENCE_NAME[action.id]];

      // if this sequencer is playing, lets queue the meter
      if (seq.playingState == PLAYING_STATES.PLAYING) {
        // copy the knob's `selectedMeter` into our sequencer's `queuedMeter`,
        // SuperCollider will actually queue the meter change.
        seq.queuedMeter = Object.assign({}, knobs[action.id].selectedMeter);
      }


      return state;

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
      seq.queuedMeter = false;
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

let createKnobState = function () {
  return {
    // The current position of the knob from [-50.0, 50.0]
    position: 0,

    // change in position from last update
    positionDelta: 0,

    // when knob is actively being touched, this will be true
    active: false,

    // when user is selecting a meter, this will be the meter index from our
    // list of possible meters
    selectedMeterIndex: false,

    // when user is selecting a meter, this will be the meter state currently
    // selected
    selectedMeter: false
  }
};
let create_default_knobs = function () {
  return {
    "A": createKnobState(),
    "B": createKnobState(),
    "C": createKnobState()
  };
}
function knobs (state = create_default_knobs(), action) {
  var knob,
    selectedMeterIndex,
    selectedMeter;

  switch (action.type) {
    case actionTypes.KNOB_POS_CHANGED:
      knob = state[action.id]
      knob = Object.assign({}, knob);
      knob.positionDelta = action.position - knob.position;
      knob.positionDeltaPercent = knob.positionDelta / config.KNOB_SPEC.RANGE;
      knob.position = action.position;

      // this knob is definitely active
      // NOTE: An entity outside the state store needs to determine when the
      // knob has stopped being active.
      knob.active = true;

      // update selected meter

      // determine what meter should be
      //selectedMeterIndex = Math.floor(
        //(action.position - config.KNOB_SPEC.MIN)
          /// config.KNOB_SPEC.METER_CHUNK_SIZE
      //);

      //selectedMeter = config.POSSIBLE_METERS[selectedMeterIndex];

      // update currently selected meter for this knob
      //knob.selectedMeterIndex = selectedMeterIndex;
      //knob.selectedMeter = {
        //numBeats: selectedMeter,
        //beatDur: 4.0 / selectedMeter
      //};

      state[action.id] = knob;
      return state;
    case actionTypes.KNOB_INACTIVE:
      knob = state[action.id]
      knob = Object.assign({}, knob);
      knob.active = false;
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

        if (timeSinceStageStart < 3) {
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

function create_control () {
  return {
    unmappedValue: 0,
    value: 0
  };
}

function create_rhythmic_level_controls () {
  return {
    offset: create_control(),
    balance: create_control()
  };
}

function create_control_menu (currentControlName) {
  return {
    currentControlName: currentControlName,
    isActive: false,
    cursorPosition: 0.0
  };
}

function create_rhythmic_control_menus () {
  return config.RHYTHMIC_CONTROL_NAMES.map((controlName) => {
    return create_control_menu(controlName);
  });
}

let create_rhythmic_controls = function () {
  return {
    level_4: {
      name: 'level_4',
      controls: create_rhythmic_level_controls(),
      controlMenus: create_rhythmic_control_menus(),
      //sequencer: null
    }
  };
};

function controlMenu (state, action, knob, controls) {
  switch (action.type) {
    case actionTypes.KNOB_POS_CHANGED:
      // this reducer assumes it is only called when
      // knob_pos_changed is this menu's knob
      state = Object.assign({}, state);
      state.isActive = true;

      let currentControl = controls[state.currentControlName];
      let controlSpec = config.CONTROL_SPECS[state.currentControlName];

      // if this control is discrete
      let absDeltaPercent = Math.abs(knob.positionDeltaPercent);
      if (controlSpec.options) {
        let numOptions = controlSpec.options.length;
        state.cursorPosition += absDeltaPercent * numOptions;
      } else if (!_.isUndefined(controlSpec.min) && !_.isUndefined(controlSpec.max)) {
        let range = controlSpec.max - controlSpec.min;
        state.cursorPosition += absDeltaPercent * range;
      } else {
        throw new Error(`Don't know how to handle controlspec: ${JSON.stringify(controlSpec)}`);
      }

        
      break;
    
    default:
      break
  }
  return state;
}
function rhythmicLevel (state, action, knobs) {

  switch (action.type) {
    case actionTypes.KNOB_POS_CHANGED:

      // if it is our knob
      if (config.KNOB_NAME_TO_LEVEL_NAME[action.id] == state.name) {
        let knob = knobs[action.id];
        // if turn was clockwise
        if (knob.positionDelta > 0) {

          // TODO: we can make this immutable if we want
          //state.controlMenus[0] = create_control_menu(state.controlMenus[0].currentControlName);
          //state.controlMenus[0].isActive = true;
          state.controlMenus[0] = controlMenu(state.controlMenus[0], action, knob, state.controls);

          // current control

        } else {
          //state.controlMenus[1] = create_control_menu(state.controlMenus[1].currentControlName);
          //state.controlMenus[1].isActive = true;
          state.controlMenus[1] = controlMenu(state.controlMenus[1], action, knob, state.controls);
        }
      }
      
      break;

    case actionTypes.KNOB_INACTIVE:
      // if it is our knob
      if (config.KNOB_NAME_TO_LEVEL_NAME[action.id] == state.name) {
        // make our menus inactive
        state.controlMenus[0].isActive = false
        state.controlMenus[1].isActive = false
      }
      break;
    
    default:
      break;
  }
  return state;
}
function rhythmicControls (state = create_rhythmic_controls(), action, knobs) {
  return {
    level_4: rhythmicLevel(state.level_4, action, knobs)
  }
}

export default function (state = {}, action) {
  state.bufferList = bufferList(state.bufferList, action);
  state.supercolliderIsReady = supercolliderIsReady(state.supercolliderIsReady, action);
  state.supercolliderInitializationStarted = supercolliderInitializationStarted(state.supercolliderInitializationStarted, action);
  state.lightingInitializationStarted = lightingInitializationStarted(state.lightingInitializationStarted, action);
  state.lightingIsReady = lightingIsReady(state.lightingIsReady, action);
  state.knobs = knobs(state.knobs, action);
  state.tempo = tempo(state.tempo, action);
  state.session = session(state.session, action);

  state.sequencers = sequencers(state.sequencers, action, state.session, state.knobs);

  state.sounds = sounds(state.sounds, action);

  state.rhythmicControls = rhythmicControls(state.rhythmicControls, action, state.knobs);

  return state;
}
