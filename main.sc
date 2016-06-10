({

  "Setting up".postln();
  {
    5.0.wait();
    "starting taw".postln();
    TawController.getInstance();
  }.fork();

  s.options.sampleRate = 32000;
  s.options.hardwareBufferSize = 2048;
  s.options.memSize = 8192 * 2;
  s.boot();
}.value());
