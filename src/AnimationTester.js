import net from "net"
import createOPCStream from "opc"
import createOPCStrand from "opc/strand"

import ColorUtils from "./ColorUtils.js";

class AnimationTester {
  constructor(params) {

    this.animation = params.animation;
    
    this.socket = new net.Socket();
    this.socket.setNoDelay();
    let handleSocketClosed = () => {
      console.log("Lighting connection closed.");
      this.connect();
    }
    let handleSocketReady = () => {
      console.log("LightController connected to fadecandy.");
      
    }
    this.socket.on("close", handleSocketClosed);
    this.socket.on("error", handleSocketClosed);
    this.socket.on("connect", handleSocketReady);

    this.opcStream = createOPCStream();
    this.opcStream.pipe(this.socket);

    this.fadecandyPixels = createOPCStrand(
      this.animation.numPixels
    );

    console.log("Connecting to fadecandy...");
    this.socket.connect(7890);
  }
  render () {
    var pixels = this.fadecandyPixels,
      i,
      color,
      t = (new Date()).getTime();

    this.animation.render(t);

    for (i = 0; i < pixels.length; i++) {
      color = ColorUtils.hsvToRGB(this.animation.pixelColors[i]);
      //pixels.setPixel(i, 255, 0, 0);
      pixels.setPixel.apply(pixels, [i].concat(color));
    }

    this.opcStream.writePixels(0, this.fadecandyPixels.buffer);
  }
};

export default AnimationTester;
