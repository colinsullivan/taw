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

    long _lastRead;
    long _newRead;

    void sendUpdate(long value);

  public:
  RotaryEncoder (const char* uid) {
    _lastRead = INFINITY;
    _uid = uid;
  }
  ~RotaryEncoder () {
    delete _e;
  }
  void attach (int aPin, int bPin);
  void tick ();

};

#endif
