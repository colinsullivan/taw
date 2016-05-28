
({

  //s.options.blockSize = 8;
  s.doWhenBooted({
    TawController.getInstance();
  });

  API.mountDuplexOSC;
  s.boot();
}.value());