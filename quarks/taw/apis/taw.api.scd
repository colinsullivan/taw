(
  hello: { arg reply;
    var tawController = TawController.getInstance();
    /*tawController.play();*/
    tawController.play({
      "taw.api.hello".postln();
      reply.value("hello back");
    });
  }
);
