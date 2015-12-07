export const actionTypes = {
  //CLOCK_TICKED: Symbol("The clock has moved forward")
  //SEQUENCER_STEPPED: "SEQUENCER_STEPPED_FORWARD",
  //SEQUENCER_STEP_SCHEDULED: "SEQUENCER_STEP_SCHEDULED",
  SEQUENCER_TRANSPORT_UPDATED: "SEQUENCER_TRANSPORT_UPDATED",
  SEQUENCER_METER_UPDATED: "SEQUENCER_METER_UPDATED",
  SUPERCOLLIDER_READY: "SUPERCOLLIDER_READY",
  SUPERCOLLIDER_INIT_START: "SUPERCOLLIDER_INIT_START",
  SEQUENCERS_QUEUED: "SEQUENCERS_QUEUED",
  SEQUENCE_PLAYING: "SEQUENCE_PLAYING",
  SEQUENCE_STOPPED: "SEQUENCE_STOPPED",
  LIGHTING_INIT_START: "LIGHTING_INIT_START",
  LIGHTING_READY: "LIGHTING_READY",
  KNOB_POS_CHANGED: "KNOB_POS_CHANGED",
  TRANSMIT_STARTED: "TRANSMIT_STARTED",
  SOUND_PLAYING: "SOUND_PLAYING",
  SOUND_STOP_QUEUED: "SOUND_STOP_QUEUED",
  SOUND_STOPPED: "SOUND_STOPPED",
  SESSION_STARTED: "SESSION_STARTED"
};

export const SESSION_STAGES = {
  INIT: "INIT",
  STARTED: "STARTED",
  TRANSMIT: "TRANSMIT"
};

/*export function clockTick (quant) {
  return {
    type: actionTypes.CLOCK_TICKED,
    quant: quant
  };
}
*/

//export function stepSequencerForward (sequencerName) {
  //return {
    //type: actionTypes.SEQUENCER_STEPPED,
    //name: sequencerName
  //};
//}

/*export function scheduleSequencerStep (sequencerName) {
  return {
    type: actionTypes.SEQUENCER_STEP_SCHEDULED,
    name: sequencerName
  };
}*/

export function supercolliderReady () {
  return {
    type: actionTypes.SUPERCOLLIDER_READY
  };
}

export function supercolliderInitStarted () {
  return {
    type: actionTypes.SUPERCOLLIDER_INIT_START
  };
}

export function queueAllSequencers () {
  return {
    type: actionTypes.SEQUENCERS_QUEUED
  };
}

export function lightingInit () {
  return {
    type: actionTypes.LIGHTING_INIT_START
  };
}

export function lightingReady () {
  return {
    type: actionTypes.LIGHTING_READY
  };
}

export function changeSequencerMeter (sequencerName, numBeats, beatDur) {
  return {
    type: actionTypes.SEQUENCER_METER_UPDATED,
    name: sequencerName,
    numBeats,
    beatDur
  };
}

export function knobPosChanged (id, position) {
  return {
    type: actionTypes.KNOB_POS_CHANGED,
    id: id,
    position: position
  };
}
