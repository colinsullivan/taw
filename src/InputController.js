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
import KnobActivityController from "./KnobActivityController.js"

const INPUT_TYPES = {
  "KNOB": "R",
  "BUTTON": "B"
};

/**
 *  @class        InputController
 *
 *  @classdesc    Takes input from knobs, connected to the Arduino with a
 *  serial connection over USB.  Translates input messages to state changes.
 *  Arduino is running this script: `controls/controls.ino`.
 **/

class InputController {
  constructor (store) {
    this.store = store;

    // set up serial port connection to Arduino
    this.arduinoPort = new serialport.SerialPort(
      getOrError("INPUT_ARDUINO_SERIALPORT"),
      {
        parser: serialport.parsers.readline("\n")
      }
    );

    this.arduinoPort.on("data", (data) => {
      this.handleIncomingData(data);
    });

    // these handlers will be throttled so they can only be called once every
    // x milliseconds
    this.throttledDeviceHandlers = {
    };

    // cache some state so we can determine if it changes
    this.currentSessionStage = store.getState().session.stage;

    //this.currentTransmitButtonState = store.getState().transmitButton;

    // when state changes
    store.subscribe(() => {

      let newSessionStage = store.getState().session.stage;
      //let newTransmitButtonState = store.getState().transmitButton;

      // if session stage has changed
      if (this.currentSessionStage !== newSessionStage) {
        if (newSessionStage == actions.SESSION_STAGES.STARTED) {
          this.handleSessionStarted();
        } else if (newSessionStage == actions.SESSION_STAGES.TRANSMIT_STARTED) {
          this.handleTransmitStarted();
        }
      }

      this.currentSessionStage = newSessionStage;
      //this.currentTransmitButtonState = newTransmitButtonState;
    });

    // set up controllers to determine when knobs become inactive
    this.knobActivityControllers = {};
    var knobs = this.store.getState().knobs;
    for (var knobId in knobs) {
      this.knobActivityControllers[knobId] = new KnobActivityController(
        this.store,
        knobId
      );
    }

  }

  // when session starts, send message to Arduino to turn on button light.
  // TODO: This could be in lighting controller
  // TODO: This should be a separate session stage (when ready to transmit)
  handleSessionStarted () {
    setTimeout(() => {
      //this.store.dispatch({
        //type: actions.actionTypes.TRANSMIT_BUTTON_ACTIVATED
      //});
      if (this.currentSessionStage == actions.SESSION_STAGES.STARTED) {
        this.arduinoPort.write("TL1\n");
      }
    }, 5000);
  }

  /**
   *  When transmit starts, turn off light.
   *  TOOD: This could also be in lighting controller.
   **/
  handleTransmitStarted () {
    this.arduinoPort.write("TL0\n");
    //this.store.dispatch({
      //type: actions.actionTypes.TRANSMIT_BUTTON_DEACTIVATED
    //});
  }

  /**
   *  When knobs are turned, handle them here.
   **/
  handleKnobMessage (data) {
    var knobId = data[1];
    var knobPos = Number(data.slice(2));
    //console.log("knobId");
    //console.log(knobId);
    //console.log("knobPos");
    //console.log(knobPos);
    if (!this.throttledDeviceHandlers[knobId]) {

      this.throttledDeviceHandlers[knobId] = _.debounce((knobId, knobPos) => {

        var currentState = this.store.getState().knobs[knobId];

        // and the knob's position was changed
        this.store.dispatch(actions.knobPosChanged(knobId, knobPos));

      }, 25);

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
    //console.log("buttonId");
    //console.log(buttonId);
    //console.log("buttonSwitchPos");
    //console.log(buttonSwitchPos);
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
