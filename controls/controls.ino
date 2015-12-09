/**************************************************************************/
/*!
    @file     ProTrinketVolumeKnobPlus.ino
    @author   Mike Barela for Adafruit Industries
    @license  MIT

    This is an example of using the Adafruit Pro Trinket with a rotary
    encoder as a USB HID Device.  Turning the knob controls the sound on 
    a multimedia computer, pressing the knob mutes/unmutes the sound

    Adafruit invests time and resources providing this open source code,
    please support Adafruit and open-source hardware by purchasing
    products from Adafruit!

    @section  HISTORY

    v1.0  - First release 1/26/2015  Mike Barela based on code by Frank Zhou
*/
/**************************************************************************/

/*#include <ProTrinketHidCombo.h>*/

#include "RotaryEncoder.h"
#include "TransmitButton.h"

/*#define PIN_ENCODER_A      2*/
/*#define PIN_ENCODER_B      4*/
/*#define PIN_ENCODER_SWITCH 4*/

// apparently not using pointers is much more efficient for the 
// arduino
RotaryEncoder knobs[3];

TransmitButton tbutton;

String inputString = "";
boolean stringComplete = false;


unsigned int i;

void setup()
{
  // set pins as input with internal pull-up resistors enabled
  /*pinMode(PIN_ENCODER_SWITCH, INPUT_PULLUP);*/

  Serial.begin(9600);


  knobs[0].uid("A");
  knobs[0].rotaryPins(22, 23);
  knobs[0].switchPin(28);

  knobs[1].uid("B");
  knobs[1].rotaryPins(24, 25);
  knobs[1].switchPin(29);

  knobs[2].uid("C");
  knobs[2].rotaryPins(26, 27);
  knobs[2].switchPin(30);

  tbutton.ledPin(11);
  tbutton.switchPin(31);

  inputString.reserve(200);


}
void loop()
{

  /*for (i = 0; i < sizeof(knobs); i++) {
    knobs[i].tick();
  }*/

  knobs[0].tick();
  knobs[1].tick();
  knobs[2].tick();

  tbutton.tick();

  serialEvent();

  if (stringComplete) {
    // handle turning on and off the transmit button LED (TL0, TL1)
    if (inputString[0] == 'T' && inputString[1] == 'L') {
      tbutton.ledIsOn(atoi(&inputString[2]));
    }
    inputString = "";
    stringComplete = false;
  }

  // remember that the switch is active low 
  /*if (bit_is_clear(TRINKET_PINx, PIN_ENCODER_SWITCH)) */
  /*{*/
    /*if (sw_was_pressed == 0) // only on initial press, so the keystroke is not repeated while the button is held down*/
    /*{*/
      /*TrinketHidCombo.pressMultimediaKey(MMKEY_MUTE); // Encoder pushed down, toggle mute or not*/
      /*delay(5); // debounce delay*/
    /*}*/
    /*sw_was_pressed = 1;*/
  /*}*/
  /*else*/
  /*{*/
    /*if (sw_was_pressed != 0) {*/
      /*delay(5); // debounce delay*/
    /*}*/
    /*sw_was_pressed = 0;*/
  /*}*/

  /*TrinketHidCombo.poll(); // check if USB needs anything done, do every 10 ms or so*/
}

void serialEvent() {
  while (Serial.available()) {
    // get the new byte:
    char inChar = (char)Serial.read();
    // add it to the inputString:
    inputString += inChar;
    // if the incoming character is a newline, set a flag
    // so the main loop can do something about it:
    if (inChar == '\n') {
      stringComplete = true;
    }
  }
}
