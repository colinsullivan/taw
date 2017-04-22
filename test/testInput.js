import chai from "chai";

import configureStore from "../src/configureStore.js";
import InputController from "../src/InputController";
import config from "../src/config";
import * as actions from "../src/actions.js"

var assert = chai.assert;
var expect = chai.expect;

import serialport from "serialport"
import fs from "fs";
class FakeArduino {
  constructor(portOpenedCallback) {

    var serialPortAddress = "./FakeArduino_serialport";
    // clear file
    fs.closeSync(fs.openSync(serialPortAddress, 'w'));
    process.env.INPUT_ARDUINO_SERIALPORT = serialPortAddress;

    this.knobPositions = {
      'A': 0
    };

    this.port = new serialport.SerialPort(
      serialPortAddress,
      {},
      portOpenedCallback
    );
  }

  knobTurn(knobName, clockwise) {
    for (var i = 0; i < 3; i++) {
      if (clockwise) {
        this.knobPositions[knobName]++;
      } else {
        this.knobPositions[knobName]--;
      }
      let writing = `R${knobName}${this.knobPositions[knobName]}\n`;
      this.port.write(writing);
    }
  }
};

export default FakeArduino;

describe("reset statestore", function () {
  var store;

  beforeEach(function () {
    console.log("calling configureStore");
    store = configureStore();
  });

  it("should init state", function (done) {
    let state = store.getState();
    expect(state.knobs.A.position).to.equal(0);
    store.dispatch(actions.knobPosChanged("A", 50));
    done();
  });

  it("should init state again", function (done) {
    let state = store.getState();
    expect(state.knobs.A.position).to.equal(0);
    done();
  });
})

describe("input tests", function() {

  var store,
    inputController,
    fakeArduino,
    unsub;

  var setup = function (done) {
    if (unsub) {
      unsub();
    }
    store = configureStore();
    fakeArduino = new FakeArduino((err) => {
      if (err) {
        console.log("ERROR setting up FakeArduino");
        throw err;
      }
      inputController = new InputController(store, (err) => {
        if (err) {
          console.log("ERROR setting up InputController");
          throw err;
        }
        done();
      });
    });
  };

  beforeEach(setup);

  describe("InputController", function() {
    it("should update position when knob is turned", function (done) {

      unsub = store.subscribe(() => {
        console.log("subscription");
        let state = store.getState();
        expect(state.knobs.A.position).to.equal(3);
        done();
      });
      fakeArduino.knobTurn("A", true);

    });

    it("should update position when knob is turned counterclockwise", function (done) {
      unsub = store.subscribe(() => {
        let state = store.getState();
        expect(state.knobs.A.position).to.equal(-3);
        done();
      });
      fakeArduino.knobTurn("A", false);
    });
  });

  describe("level_4 control menu", function() {
    it("when turned clockwise, control menu 0 should be active", function (done) {
      unsub = store.subscribe(() => {
        let state = store.getState();
        expect(state.rhythmicControls.level_4.controlMenus[0].isActive).to.be.true;
        done();
      });
      fakeArduino.knobTurn("A", true);
    });

    it("when turned counter, control menu 1 should be active", function (done) {
      unsub = store.subscribe(() => {
        let state = store.getState();
        expect(state.rhythmicControls.level_4.controlMenus[1].isActive).to.be.true;
        done();
      });
      fakeArduino.knobTurn("A", false);
    });

    it("should become inactive after timeout", function (done) {
      fakeArduino.knobTurn("A", false);
      setTimeout(() => {
        let state = store.getState();

        expect(state.rhythmicControls.level_4.controlMenus[1].isActive).to.be.false;
        done();

      }, config.KNOB_INACTIVITY_TIMEOUT_DURATION + 500);
    }).timeout(config.KNOB_INACTIVITY_TIMEOUT_DURATION + 1000);

    it("should update cursor position and proper control value", function (done) {
      let state = store.getState();
      unsub = store.subscribe(() => {
        let state = store.getState();
        let controlMenu = state.rhythmicControls.level_4.controlMenus[0];
        let control = state.rhythmicControls.level_4.controls[controlMenu.currentControlName];
        let controlSpec = config.CONTROL_SPECS[controlMenu.currentControlName];
        expect(controlSpec).to.have.property('options')
        expect(controlMenu.cursorPosition).to.equal(0.03 * controlSpec.options.length);
        done();
      });
      fakeArduino.knobTurn("A", true);
    });

    it("should update other cursor position", function (done) {
      let state = store.getState();
      unsub = store.subscribe(() => {
        let state = store.getState();
        let controlMenu = state.rhythmicControls.level_4.controlMenus[1];
        let control = state.rhythmicControls.level_4.controls[controlMenu.currentControlName];
        let controlSpec = config.CONTROL_SPECS[controlMenu.currentControlName];
        expect(controlSpec).to.have.property('min')
        expect(controlSpec).to.have.property('max')
        expect(controlMenu.cursorPosition).to.equal(0.03);
        done();
      });
      fakeArduino.knobTurn("A", false);
    });

  });

  
});
