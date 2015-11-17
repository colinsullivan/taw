#include "RotaryEncoder.h"

void RotaryEncoder::attach (int aPin, int bPin) {
  _aPin = aPin;
  _bPin = bPin;

  _e = new Encoder(aPin, bPin);
  
}
void RotaryEncoder::tick () {
  _newRead = _e->read();


  if (_newRead != _lastRead) {
    _lastRead = _newRead;
    sendUpdate(_newRead);
  }
}

void RotaryEncoder::sendUpdate(long value) {
  int msgLength = 1 + strlen(_uid) + 1;
  char msg[msgLength];
  sprintf(msg, "R%s%ld\n", _uid, value);
  Serial.write(msg);
}
