({

  "Setting up".postln();

  API.mountDuplexOSC();

  {
    5.0.wait();
    "starting taw".postln();
    TawController.getInstance();
  }.fork();

  //s.options.device = "PreSonus FIREPOD (2112)";
  s.options.device = "JackRouter";

  s.options.sampleRate = 32000;
  s.options.hardwareBufferSize = 2048;
  s.options.memSize = 8192 * 2;
  s.options.maxSynthDefs = 1024 * 2;
  s.boot();
}.value());

{
  ServerOptions.devices;
}
