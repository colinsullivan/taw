export const actionTypes = {
  //CLOCK_TICKED: Symbol("The clock has moved forward")
  //SEQUENCER_STEPPED: "SEQUENCER_STEPPED_FORWARD",
  //SEQUENCER_STEP_SCHEDULED: "SEQUENCER_STEP_SCHEDULED",
  SEQUENCER_CLOCK_UPDATE: "SEQUENCER_CLOCK_UPDATE",
  SEQUENCER_CLOCK_METER_CHANGED: "SEQUENCER_CLOCK_METER_CHANGED",
  SUPERCOLLIDER_READY: "SUPERCOLLIDER_READY",
  SUPERCOLLIDER_INIT_START: "SUPERCOLLIDER_INIT_START",
  SEQUENCERS_QUEUED: "SEQUENCERS_QUEUED",
  SEQUENCE_PLAYING: "SEQUENCE_PLAYING",
  LIGHTING_INIT_START: "LIGHTING_INIT_START",
  LIGHTING_READY: "LIGHTING_READY"
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

export function changeSequencerMeter (sequencerName, beatsPerBar) {
  return {
    type: actionTypes.SEQUENCER_CLOCK_METER_CHANGED,
    name: sequencerName,
    beatsPerBar: beatsPerBar
  };
}
