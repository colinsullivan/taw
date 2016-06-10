"main.sc".postln();
({

  //s.options.blockSize = 8;
  "Setting up".postln();
  {
    5.0.wait();
    "starting taw".postln();
    TawController.getInstance();
  }.fork();

  s.options.sampleRate = 32000;
  s.options.hardwareBufferSize = 1024;
  s.options.memSize = 8192 * 2;
  s.reboot();
}.value());
