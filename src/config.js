var config = {};
config.KNOB_NAMES = ["A", "B", "C"];
config.SEQUENCE_NAMES = ["zaps", "orgperc", "pad"];
config.SEQUENCE_NUM_LEDS = 4;
config.INSTRUCTION_SIGN_NUM_LEDS = 16;
config.TAW_SIGN_NUM_LEDS = 24;
config.PIXEL_ADDRESSES = {
  "A": [2, 6],
  //"B": [16, 32],
  //"C": [32, 48],
  //"INSTRUCTION_SIGN": [48, 64],
  //"TAW_SIGN": [64, 88]
};
config.KNOB_NAME_TO_SEQUENCE_NAME = {};
config.KNOB_NAMES.forEach(function (knobName, i) {
  config.KNOB_NAME_TO_SEQUENCE_NAME[knobName] = config.SEQUENCE_NAMES[i];
});

config.POSSIBLE_METERS = [1, 2, 3, 4, 5, 6, 8, 16];
config.SPEED_UP_DURATION = 8000;
config.SLOW_DOWN_DURATION = 4000;

let knobMin = -50.0;
let knobMax = 50.0;
let knobRangeSize = knobMax - knobMin;
config.KNOB_SPEC = {
  MIN: knobMin,
  MAX: knobMax,
  RANGE: knobRangeSize,
  METER_CHUNK_SIZE: knobRangeSize / (config.POSSIBLE_METERS.length - 1)
};
export default config;
