import { combineReducers  } from 'redux'

import { actionTypes } from "./actions.js"

function sequencers (state = {}, action) {
  switch (action.type) {
    /*case actionTypes.SEQUENCER_STEP_SCHEDULED:
      // copy sequencer
      let seq = Object.assign({}, state[action.name]);
      seq.updateScheduled = true;
      // update sequencer
      state[action.name] = seq;
      return state;*/
    case actionTypes.SEQUENCER_STEPPED:
      let seq = state[action.name];
      let currentBeat = Object.assign({}, seq.currentBeat);
      // step forward
      currentBeat.value = (currentBeat.value + 1) % seq.quant.value;
      seq.currentBeat = currentBeat;

      return state;
    default:
      return state;
  }
};

export default combineReducers({
  sequencers
});
