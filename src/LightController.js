/**
 *  @file       LightController.js
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2016 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

import net from "net"
import createOPCStream from "opc"
import createOPCStrand from "opc/strand"

import * as actions from "./actions.js"
import config from "./config.js"
import ColorUtils from "./ColorUtils.js"
import KnobLightsRenderer from "./KnobLightsRenderer.js";


/**
 *  @class        LightController
 *
 *  @classdesc    This class takes care of mapping the lighting renders to
 *  the physical lights, communicating this out to the serial port.
 *
 */
class LightController {
  constructor (store) {
    this.store = store;

    // we are starting to initialize the lighting
    this.store.dispatch(actions.lightingInit());

    // connecting directly to Fadecandy with this socket
    this.socket = new net.Socket();
    this.socket.setNoDelay();
    let handleSocketClosed = () => {
      console.log("Lighting connection closed.");
      this.connect();
    }
    let handleSocketConnected = () => {
      console.log("LightController connected to fadecandy.");
      this.store.dispatch(actions.lightingReady());
      //this.handleStateChange();
      //this.store.subscribe(() => { this.handleStateChange(); })
    };
    this.socket.on("close", handleSocketClosed);
    this.socket.on("error", handleSocketClosed);
    this.socket.on("connect", handleSocketConnected);

    // We will stream OPC data to the fadecandy over the socket
    this.opcStream = createOPCStream();
    this.opcStream.pipe(this.socket);

    // This is the fadecandy pixel information, in RGB format
    this.fadecandyPixels = createOPCStrand(
      config.SEQUENCE_NAMES.length * config.SEQUENCE_NUM_LEDS
    );

    // one knob renderer per sequence
    this.knobLightRenderers = {};

    // cache the meter and transport of each sequence so we can handle when
    // it changes.
    this.sequenceMeter = {};
    this.sequenceTransport = {};

    // create a strip for each sequence
    this.sequencePixels = {};

    config.SEQUENCE_NAMES.forEach((sequenceName) => {
      var pixelAddrs = config.SEQUENCE_NAME_TO_PIXEL_ADDRESSES[sequenceName];
      //this.sequenceStrips[sequenceName] = new pixel.Strip({
        //data: config.SEQUENCE_NAME_TO_LED_PIN[sequenceName],
        //length: 16,
        //board: board,
        //controller: "FIRMATA"
      //});

      this.sequenceMeter[sequenceName] = null;
      this.sequenceTransport[sequenceName] = null;
      this.sequencePixels[sequenceName] = this.fadecandyPixels.slice(
        pixelAddrs[0],
        pixelAddrs[1]
      );

      this.knobLightRenderers[sequenceName] = new KnobLightsRenderer({
        store: this.store,
        sequencerName: sequenceName
      });

    });
    
    // start the connection to fadecandy
    this.connect();
  }

  connect () {
    console.log("Connecting to fadecandy...");
    this.socket.connect(7890);
  }


  render () {
    var t = (new Date()).getTime();

    // for each sequence
    config.SEQUENCE_NAMES.forEach((sequenceName) => {
      // `KnobLightsRenderer` for this knob
      var knobLightRenderer = this.knobLightRenderers[sequenceName],
        knobLightRendererOutput,
        // hardware pixels
        pixels = this.sequencePixels[sequenceName],
        color,
        i;

      knobLightRenderer.render(t);
      knobLightRendererOutput = knobLightRenderer.getOutputBuffer();

      for (i = 0; i < knobLightRendererOutput.length; i++) {
        color = ColorUtils.hsvToRGB(knobLightRendererOutput.getPixel(i));
        //pixels.setPixel(i, 255, 0, 0);
        pixels.setPixel.apply(pixels, [i].concat(color));
      }
    });

    // write all pixels to the fadecandy
    this.opcStream.writePixels(0, this.fadecandyPixels.buffer);
  }
}
export default LightController;
