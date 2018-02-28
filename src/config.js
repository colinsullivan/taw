var config = {};
config.KNOB_NAMES = ["A", "B", "C"];
config.KNOB_NAME_TO_LEVEL_NAME = {
  "A": "level_4"
};

config.KNOB_INACTIVITY_TIMEOUT_DURATION = 2000;

config.SEQUENCE_NAMES = ["zaps", "orgperc", "pad"];
config.SEQUENCE_NUM_LEDS = 4;
config.INSTRUCTION_SIGN_NUM_LEDS = 16;
config.TAW_SIGN_NUM_LEDS = 24;
config.MENU_NUM_LEDS = 10;
config.PIXEL_ADDRESS_MENU_NAMES = ['level_4_menu_0', 'level_4_menu_1', 'level_6_menu_0', 'level_6_menu_1'];
config.PIXEL_ADDRESSES = {
  "level_4_sequencer": [0, 3],
  "level_6_sequencer": [4, 9],
  "level_4_menu_0": [10, 19],
  "level_4_menu_1": [20, 29],
  "level_6_menu_0": [30, 39],
  "level_6_menu_1": [40, 49],
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

config.RHYTHMIC_CONTROL_NAMES = ["offset", "balance"];
config.CONTROL_SPECS = {
  offset: {
    options: [0, 1.0/16.0, 1.0/8.0, 1.0/4.0, 1.0/3.0, 1.0/2.0]
  },
  balance: {
    min: 0.0,
    max: 1.0,
    warp: 'lin'
  }
};
export default config;
