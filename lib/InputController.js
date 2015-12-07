import serialport from "serialport"
import _ from "underscore"

import * as actions from "./actions.js"

const INPUT_TYPES = {
  "KNOB": "R",
  "BUTTON": "B"
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

    this.throttledDeviceHandlers = { 
    };

  }

  handleKnobMessage (data) {
    var knobId = data[1];
    var knobPos = Number(data.slice(2));
    //console.log("knobId");
    //console.log(knobId);
    //console.log("knobPos");
    //console.log(knobPos);
    if (!this.throttledDeviceHandlers[knobId]) {
      this.throttledDeviceHandlers[knobId] = _.debounce((knobId, knobPos) => {
        this.store.dispatch(actions.knobPosChanged(knobId, knobPos));
      }, 150);
    }

    this.throttledDeviceHandlers[knobId](knobId, knobPos);
  }

  handleButtonMessage (data) {
    var buttonId = data[1];
    var buttonSwitchPos = Number(data.slice(2));

    if (buttonId == "T") {
      if (buttonSwitchPos) {
        this.store.dispatch({
          type: actions.actionTypes.TRANSMIT_BUTTON_PRESSED
        });
        
      } else {
        this.store.dispatch({
          type: actions.actionTypes.TRANSMIT_BUTTON_UNPRESSED
        });
      }
    }

    //if (!this.throttledDeviceHandlers[buttonId]) {
      //this.throttledDeviceHandlers[buttonId] = _.debounce((buttonId, buttonSwitchPos) => {
      //}, 100);
    //}

    //this.throttledDeviceHandlers[buttonId](buttonId, buttonSwitchPos);
    console.log("buttonId");
    console.log(buttonId);
    console.log("buttonSwitchPos");
    console.log(buttonSwitchPos);
  }

  handleIncomingData (data) {
    var inputType = data[0];
    //console.log("handleIncomingData");
    //console.log("data");
    //console.log(data);
    switch (inputType) {
      case INPUT_TYPES.KNOB:
        this.handleKnobMessage(data);
        break;

      case INPUT_TYPES.BUTTON:
        this.handleButtonMessage(data);
        break;
      
      default:
        console.warn(`Don't know how to handle input type '${inputType}'.  Ignoring message.`);
    }

  }
}
export default InputController;