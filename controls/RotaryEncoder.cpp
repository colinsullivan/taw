#include "RotaryEncoder.h"

int msgLen;
long _newRead;
unsigned int _newSwitchRead;

int RotaryEncoder::constrainValue(int in) {
  return min(50, max(-50, in));
}

void RotaryEncoder::rotaryPins (int aPin, int bPin) {
  _aPin = aPin;
  _bPin = bPin;

  _e = new Encoder(aPin, bPin);
}
void RotaryEncoder::switchPin (int sPin) {
  _sPin = sPin;
  pinMode(_sPin, INPUT_PULLUP);
}
void RotaryEncoder::tick () {
  // read encoder state
  _newRead = constrainValue(_e->read());
  _e->write(_newRead);

  if (_newRead != _lastRead) {
    _lastRead = _newRead;
    sendUpdate(_newRead);
  }

  // read button state
  _newSwitchRead = digitalRead(_sPin);
  if (_newSwitchRead != _lastSwitchRead) {
    _lastSwitchRead = _newSwitchRead;
    sendSwitchUpdate();
  }
}

void RotaryEncoder::sendSwitchUpdate() {

  unsigned int switchIsPressed = _lastSwitchRead;

  // B<_uid><0|1>
  msgLen = 1 + _uidLen + 1;
  
  char msg[msgLen];
  sprintf(msg, "B%s%i\n", _uid, switchIsPressed);
  Serial.write(msg);
}

void RotaryEncoder::sendUpdate(long value) {

  // R<_uid>
  msgLen = 1 + _uidLen;

  if (value == 0) {
    msgLen += 1;
  } else {
    
    // - sign 
    if (value < 0) {
      msgLen += 1;
    }

    msgLen += floor(log10(abs(value))) + 1;

  }

  char msg[msgLen];
  sprintf(msg, "R%s%ld\n", _uid, value);
  Serial.write(msg);
}
