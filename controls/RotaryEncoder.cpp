#include "RotaryEncoder.h"

/*bool bitIsClearRegisterForPin(int pinNum) {
  if (pinNum < 8) {
    return bit_is_clear(PIND, pinNum);
  } else {
    return bit_is_clear(PINB, pinNum);
  }
}*/
bool bitIsClearRegisterForPin(int pinNum) {
  if (pinNum < 6) {
    return bit_is_clear(PINE, pinNum);
  } else if (pinNum < 10) {
    return bit_is_clear(PINH, pinNum);
  } else if (pinNum < 14) {
    return bit_is_clear(PINB, pinNum);
  } else if (pinNum < 16) {
    return bit_is_clear(PINJ, pinNum);
  } else if (pinNum < 18) {
    return bit_is_clear(PINH, pinNum);
  } else if (pinNum < 22) {
    return bit_is_clear(PIND, pinNum);
  } else if (pinNum < 30) {
    return bit_is_clear(PINA, pinNum);
  } else if (pinNum < 38) {
    return bit_is_clear(PINC, pinNum);
  } else if (pinNum < 39) {
    return bit_is_clear(PIND, pinNum);
  } else if (pinNum < 42) {
    return bit_is_clear(PING, pinNum);
  } else if (pinNum < 50) {
    return bit_is_clear(PINL, pinNum);
  } else if (pinNum < 54) {
    return bit_is_clear(PINB, pinNum);
  } else {
    return 0;
  }
}


void RotaryEncoder::attach (int aPin, int bPin) {
  _aPin = aPin;
  _bPin = bPin;

  pinMode(aPin, INPUT_PULLUP);
  pinMode(bPin, INPUT_PULLUP);
  
  // get an initial reading on the encoder pins
  if (digitalRead(aPin) == LOW) {
    enc_prev_pos |= (1 << 0);
  }
  if (digitalRead(bPin) == LOW) {
    enc_prev_pos |= (1 << 1);
  }
}
void RotaryEncoder::tick () {
  
  int8_t enc_action = 0; // 1 or -1 if moved, sign is direction

  // note: for better performance, the code will use
  // direct port access techniques
  // http://www.arduino.cc/en/Reference/PortManipulation
  uint8_t enc_cur_pos = 0;
  // read in the encoder state first
  if (bitIsClearRegisterForPin(_aPin)) {
    enc_cur_pos |= (1 << 0);
  }
  if (bitIsClearRegisterForPin(_bPin)) {
    enc_cur_pos |= (1 << 1);
  }

  // if any rotation at all
  if (enc_cur_pos != enc_prev_pos)
  {
    if (enc_prev_pos == 0x00)
    {
      // this is the first edge
      if (enc_cur_pos == 0x01) {
        enc_flags |= (1 << 0);
      }
      else if (enc_cur_pos == 0x02) {
        enc_flags |= (1 << 1);
      }
    }

    if (enc_cur_pos == 0x03)
    {
      // this is when the encoder is in the middle of a "step"
      enc_flags |= (1 << 4);
    }
    else if (enc_cur_pos == 0x00)
    {
      // this is the final edge
      if (enc_prev_pos == 0x02) {
        enc_flags |= (1 << 2);
      }
      else if (enc_prev_pos == 0x01) {
        enc_flags |= (1 << 3);
      }

      // check the first and last edge
      // or maybe one edge is missing, if missing then require the middle state
      // this will reject bounces and false movements
      if (bit_is_set(enc_flags, 0) && (bit_is_set(enc_flags, 2) || bit_is_set(enc_flags, 4))) {
        enc_action = 1;
      }
      else if (bit_is_set(enc_flags, 2) && (bit_is_set(enc_flags, 0) || bit_is_set(enc_flags, 4))) {
        enc_action = 1;
      }
      else if (bit_is_set(enc_flags, 1) && (bit_is_set(enc_flags, 3) || bit_is_set(enc_flags, 4))) {
        enc_action = -1;
      }
      else if (bit_is_set(enc_flags, 3) && (bit_is_set(enc_flags, 1) || bit_is_set(enc_flags, 4))) {
        enc_action = -1;
      }

      enc_flags = 0; // reset for next time
    }
  }

  enc_prev_pos = enc_cur_pos;

  if (enc_action > 0) {
    /*TrinketHidCombo.pressMultimediaKey(MMKEY_VOL_UP);  // Clockwise, send multimedia volume up*/
    sendUpdate(1);
  }
  else if (enc_action < 0) {
    sendUpdate(0);
    /*TrinketHidCombo.pressMultimediaKey(MMKEY_VOL_DOWN); // Counterclockwise, is multimedia volume down*/
  }
}

void RotaryEncoder::sendUpdate(int direction) {
  int msgLength = 1 + strlen(_uid) + 1;
  char msg[msgLength];
  sprintf(msg, "R%s%d\n", _uid, direction);
  Serial.write(msg);
}
