import chai from "chai";

import configureStore from "../src/configureStore.js";
import InputController from "../src/InputController";
import config from "../src/config";

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

  describe("level_4 controls", function() {
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
  });

  
});
