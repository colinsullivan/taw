import serialport from "serialport"

import * as actions from "./actions.js"

const INPUT_TYPES = {
  KNOB: "R"
};

class InputController {
  constructor (store) {
    this.store = store;

    this.arduinoPort = new serialport.SerialPort(
      process.env.INPUT_ARDUINO_SERIALPORT,
      {
        parser: serialport.parsers.readline("\n")
      }
    );

    this.arduinoPort.on("data", (data) => {
      this.handleIncomingData(data);
    });
  }

  handleKnobMessage (data) {
    var knobId = data[1];
    var knobPos = Number(data.slice(2));
    //console.log("knobId");
    //console.log(knobId);
    //console.log("knobPos");
    //console.log(knobPos);
    this.store.dispatch(actions.knobPosChanged(knobId, knobPos));
  }

  handleIncomingData (data) {
    var inputType = data[0];
    //console.log("handleIncomingData");

    if (inputType === INPUT_TYPES.KNOB) {

      this.handleKnobMessage(data);
      
    } else {
      console.warn(`Don't know how to handle input type '${inputType}'.  Ignoring message.`);
    }
  }
}
export default InputController;
