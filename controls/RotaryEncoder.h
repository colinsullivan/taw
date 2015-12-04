#ifndef RotaryEncoder_h
#define RotaryEncoder_h

#include <Arduino.h>
#include <string.h>
#include <Encoder.h>
#include <Math.h>

class RotaryEncoder {

  private:
    int _aPin;
    int _bPin;
    // pin number for the switch
    int _sPin;

    // last known state of the switch
    unsigned int _lastSwitchRead;

    Encoder* _e;
    const char* _uid;
    int _uidLen;

    long _lastRead;

    void sendUpdate(long value);
    void sendSwitchUpdate();
    int constrainValue(int in);

  public:
  RotaryEncoder () {
    _lastRead = INFINITY;
    _lastSwitchRead = INFINITY;
  }
  ~RotaryEncoder () {
    delete _e;
  }
  void uid(const char* theuid) {
    _uid = theuid;
    _uidLen = strlen(_uid);
  }
  void rotaryPins (int aPin, int bPin);
  void switchPin (int sPin);
  void tick ();

};

#endif
