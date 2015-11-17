#ifndef RotaryEncoder_h
#define RotaryEncoder_h

#include <Arduino.h>

#include <string.h>

class RotaryEncoder {

  private:
    int _aPin;
    int _bPin;
    const char* _uid;
    
    unsigned int enc_prev_pos   = 0;
    unsigned int enc_flags      = 0;
    //static char    sw_was_pressed = 0;
    
    void sendUpdate(int direction);
  public:
  RotaryEncoder (const char* uid) {
    _uid = uid;
  }

  void attach (int aPin, int bPin);

  
  void tick ();
};

#endif
