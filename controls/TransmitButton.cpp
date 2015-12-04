#include "TransmitButton.h"

unsigned int newSwitchRead;

TransmitButton::TransmitButton() {
  _lastSwitchRead = INFINITY;

  _ledBrightness = 1;
  _ledBrightnessMultiplier = 0.05;
}

TransmitButton::~TransmitButton() {
  
}

void TransmitButton::ledPin(unsigned int thePin) {
  _ledPin = thePin;

  pinMode(_ledPin, OUTPUT);
}

void TransmitButton::switchPin(unsigned int thePin) {
  _switchPin = thePin;
  pinMode(_switchPin, INPUT_PULLUP);
}
void TransmitButton::tick() {
  _ledBrightness += _ledBrightnessMultiplier;
  if (_ledBrightness > 254) {
    _ledBrightnessMultiplier *= -1.0;
    _ledBrightness = 254.0;
  } else if (_ledBrightness < 0) {
    _ledBrightnessMultiplier *= -1.0 ;
    _ledBrightness = 0;
  }
  analogWrite(_ledPin, floor(_ledBrightness));    

  newSwitchRead = digitalRead(_switchPin);
  if (_lastSwitchRead != newSwitchRead) {
    _lastSwitchRead = newSwitchRead;
    sendSwitchUpdate();
  }

}

//static int switchUpdateNum = 0;
void TransmitButton::sendSwitchUpdate() {

  // TODO: This message gets sent very quickly with the current switch
  // I am using.
  
  // BT<0|1>
  char msg[3];
  //Serial.println("switchupdate");
  //Serial.println(switchUpdateNum);
  sprintf(msg, "BT%i\n", _lastSwitchRead);
  Serial.write(msg);
  //Serial.println("endswitchupdate");
  //switchUpdateNum++;
}
