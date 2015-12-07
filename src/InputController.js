/**
 *  @file       InputController.js
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2015 Colin Sullivan
 *  @license    Licensed under the MIT license.
 **/

import serialport from "serialport"
import _ from "underscore"

import * as actions from "./actions.js"

import getOrError from "./EnvUtils.js"

const INPUT_TYPES = {
  "KNOB": "R",
  "BUTTON": "B"
};

class InputController {
  constructor (store) {
    this.store = store;

    this.arduinoPort = new serialport.SerialPort(
      getOrError("INPUT_ARDUINO_SERIALPORT"),
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
    var state = this.store.getState();

    if (buttonId == "T") {
      if (buttonSwitchPos == 0) {

        if (state.session.stage == actions.SESSION_STAGES.STARTED) {
          this.store.dispatch({
            type: actions.actionTypes.TRANSMIT_STARTED
          });
        }
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
