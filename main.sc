
({

  //s.options.blockSize = 8;
  s.doWhenBooted({
    TawController.getInstance();
  });
  
  s.boot();
}.value());
