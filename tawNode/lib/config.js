var config = {};
config.KNOB_NAMES = ["A", "B"];
config.SEQUENCE_NAMES = ["zaps", "orgperc", "pad"];
config.SEQUENCE_NUM_LEDS = 16;
config.SEQUENCE_NAME_TO_PIXEL_ADDRESSES = {
  "zaps": [0, 16],
  "orgperc": [16, 32],
  "pad": [32, 48]
};
config.KNOB_NAME_TO_SEQUENCE_NAME = {};
config.KNOB_NAMES.forEach(function (knobName, i) {
  config.KNOB_NAME_TO_SEQUENCE_NAME[knobName] = config.SEQUENCE_NAMES[i];
});
export default config;
