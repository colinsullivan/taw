({

  //API.mountDuplexOSC;

  //API.loadAll.allPaths


}.value());

({
  var m, mBounds;
  s.quit;
  /*s.options.inDevice = "PreSonus FIREPOD (2112)";*/
  //s.options.outDevice= "Soundflower (64ch)";
  /*s.options.inDevice = "JackRouter";
  s.options.outDevice = "JackRouter";
  s.options.numOutputBusChannels = 48;
  s.options.numInputBusChannels = 48;
  s.options.memSize = 8192 * 2 * 2 * 2;
  s.options.blockSize = 8;*/
  s.boot();
  m = s.meter();
  // move level meter to bottom right of screen
  mBounds = m.window.bounds;
  mBounds.left = 1440;
  mBounds.top = 900;
  m.window.setTopLeftBounds(mBounds);
}.value());

({
  s.quit();
}.value());

Quarks.gui();

Quarks.install("taw");

API.loadAll.allPaths.do(_.postln);

TawController.getInstance()
