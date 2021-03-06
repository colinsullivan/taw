#ifndef _TRANSMITBUTTON_H_
#define _TRANSMITBUTTON_H_

#include <Arduino.h>

class TransmitButton
{
  private:
    unsigned int _ledPin;
    unsigned int _switchPin;

    unsigned int _lastSwitchRead;

    float _ledBrightness;
    float _ledBrightnessMultiplier;
    void sendSwitchUpdate();

    int _ledIsOn;
public:
  TransmitButton();
  ~TransmitButton();

  void tick();

  void ledPin(unsigned int thePin);
  void switchPin(unsigned int thePin);
  void ledIsOn(int val) { _ledIsOn = val; }
};

#endif
