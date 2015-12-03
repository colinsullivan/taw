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
    Encoder* _e;
    const char* _uid;
    int _uidLen;

    long _lastRead;
    long _newRead;

    void sendUpdate(long value);
    int constrainValue(int in);

  public:
  RotaryEncoder () {
    _lastRead = INFINITY;
  }
  ~RotaryEncoder () {
    delete _e;
  }
  void uid(const char* theuid) {
    _uid = theuid;
    _uidLen = strlen(_uid);
  }
  void rotaryPins (int aPin, int bPin);
  void tick ();

};

#endif
