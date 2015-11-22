var config = {};
config.KNOB_NAMES = ["A", "B"];
config.SEQUENCE_NAMES = ["zaps", "orgperc"];
config.KNOB_NAME_TO_SEQUENCE_NAME = {};
config.KNOB_NAMES.forEach(function (knobName, i) {
  config.KNOB_NAME_TO_SEQUENCE_NAME[knobName] = config.SEQUENCE_NAMES[i];
});
config.SEQUENCE_NAME_TO_LED_PIN = {
  "zaps": 6,
  "orgperc": 5
};
export default config;
