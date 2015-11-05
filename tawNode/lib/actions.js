export const actionTypes = {
  //CLOCK_TICKED: Symbol("The clock has moved forward")
  SEQUENCER_STEPPED: "SEQUENCER_STEPPED_FORWARD"
  //SEQUENCER_STEP_SCHEDULED: "SEQUENCER_STEP_SCHEDULED"
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
