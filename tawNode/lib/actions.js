export const actionTypes = {
  //CLOCK_TICKED: Symbol("The clock has moved forward")
  //SEQUENCER_STEPPED: "SEQUENCER_STEPPED_FORWARD",
  //SEQUENCER_STEP_SCHEDULED: "SEQUENCER_STEP_SCHEDULED",
  SEQUENCER_CLOCK_UPDATE: "SEQUENCER_CLOCK_UPDATE",
  SEQUENCER_CLOCK_METER_CHANGED: "SEQUENCER_CLOCK_METER_CHANGED",
  SUPERCOLLIDER_READY: "SUPERCOLLIDER_READY",
  SUPERCOLLIDER_INIT_START: "SUPERCOLLIDER_INIT_START",
  SUPERCOLLIDER_INIT_COMPLETE: "SUPERCOLLIDER_INIT_COMPLETE",
  SEQUENCERS_QUEUED: "SEQUENCERS_QUEUED",
  SEQUENCE_PLAYING: "SEQUENCE_PLAYING",
  ARDUINO_INIT_START: "ARDUINO_INIT_START",
  ARDUINO_READY: "ARDUINO_READY"
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

export function supercolliderInitCompleted () {
  return {
    type: actionTypes.SUPERCOLLIDER_INIT_COMPLETE
  };
}

export function queueAllSequencers () {
  return {
    type: actionTypes.SEQUENCERS_QUEUED
  };
}

export function startArduinoInit () {
  return {
    type: actionTypes.ARDUINO_INIT_START
  };
}

export function arduinoReady () {
  return {
    type: actionTypes.ARDUINO_READY
  };
}

export function changeSequencerMeter (sequencerName, beatsPerBar) {
  return {
    type: actionTypes.SEQUENCER_CLOCK_METER_CHANGED,
    name: sequencerName,
    beatsPerBar: beatsPerBar
  };
}
