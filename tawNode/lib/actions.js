export const actionTypes = {
  //CLOCK_TICKED: Symbol("The clock has moved forward")
  SEQUENCER_STEPPED: "SEQUENCER_STEPPED_FORWARD",
  //SEQUENCER_STEP_SCHEDULED: "SEQUENCER_STEP_SCHEDULED",
  SUPERCOLLIDER_READY: "SUPERCOLLIDER_READY",
  SUPERCOLLIDER_INIT_START: "SUPERCOLLIDER_INIT_START",
  SUPERCOLLIDER_INIT_COMPLETE: "SUPERCOLLIDER_INIT_COMPLETE",
  SEQUENCERS_QUEUED: "SEQUENCERS_QUEUED"
};

/*export function clockTick (quant) {
  return {
    type: actionTypes.CLOCK_TICKED,
    quant: quant
  };
}
*/

export function stepSequencerForward (sequencerName) {
  return {
    type: actionTypes.SEQUENCER_STEPPED,
    name: sequencerName
  };
}

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
