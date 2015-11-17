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

/*#define PIN_ENCODER_A      2*/
/*#define PIN_ENCODER_B      4*/
/*#define PIN_ENCODER_SWITCH 4*/

RotaryEncoder knobOne("1");
RotaryEncoder knobTwo("2");

void setup()
{
  // set pins as input with internal pull-up resistors enabled
  /*pinMode(PIN_ENCODER_SWITCH, INPUT_PULLUP);*/

  Serial.begin(9600);
  

  knobOne.attach(2, 3);
  knobTwo.attach(4, 5);

}

void loop()
{

  knobOne.tick();
  knobTwo.tick();

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
