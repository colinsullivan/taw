"main.sc".postln();
({

  //s.options.blockSize = 8;
  "Setting up".postln();
  {
    5.0.wait();
    "starting taw".postln();
    TawController.getInstance();
  }.fork();

  s.boot();
}.value());
