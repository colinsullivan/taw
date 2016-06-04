import net from "net"
import createOPCStream from "opc"
import createOPCStrand from "opc/strand"

class AnimationTester {
  constructor() {
    
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

    //this.fadecandyPixels = createOPCStrand(
      //config.SEQUENCE_NAMES.length * config.SEQUENCE_NUM_LEDS
    //);

    console.log("Connecting to fadecandy...");
    this.socket.connect(7890);
  }
};

export default AnimationTester;
