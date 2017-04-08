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
import InstructionsSignLightsRenderer from "./InstructionsSignLightsRenderer.js";
import TAWSignLightsRenderer from "./TAWSignLightsRenderer.js";


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
      + config.INSTRUCTION_SIGN_NUM_LEDS
      + config.TAW_SIGN_NUM_LEDS  
    );

    // one knob renderer per sequence
    this.knobLightRenderers = {};

    // cache the meter and transport of each sequence so we can handle when
    // it changes.
    this.sequenceMeter = {};
    this.sequenceTransport = {};

    config.SEQUENCE_NAMES.forEach((sequenceName) => {

      this.sequenceMeter[sequenceName] = null;
      this.sequenceTransport[sequenceName] = null;

    });

    // hardware pixels around each knob (just slices of `fadecandyPixels`
    // buffer above)
    this.knobLightPixels = {};

    config.KNOB_NAMES.forEach((knobId) => {
      var pixelAddrs = config.PIXEL_ADDRESSES[knobId];

      // get buffer slice for each knob
      this.knobLightPixels[knobId] = this.fadecandyPixels.slice(
        pixelAddrs[0],
        pixelAddrs[1]
      );

      // create a renderer for the lights around each knob
      this.knobLightRenderers[knobId] = new KnobLightsRenderer({
        store: this.store,
        sequencerName: config.KNOB_NAME_TO_SEQUENCE_NAME[knobId],
        knobId: knobId
      });
    })

    // pixel buffers for each sign
    this.instructionSignPixels = this.fadecandyPixels.slice(
      config.PIXEL_ADDRESSES.INSTRUCTION_SIGN[0],
      config.PIXEL_ADDRESSES.INSTRUCTION_SIGN[1]
    );
    this.tawSignPixels = this.fadecandyPixels.slice(
      config.PIXEL_ADDRESSES.TAW_SIGN[0],
      config.PIXEL_ADDRESSES.TAW_SIGN[1]
    );

    // create renderer for each sign
    this.instructionSignRenderer = new InstructionsSignLightsRenderer({
      store: this.store
    });
    this.tawSignRenderer = new TAWSignLightsRenderer({
      store: this.store
    });

    // start the connection to fadecandy
    this.connect();
  }

  connect () {
    console.log("Connecting to fadecandy...");
    this.socket.connect(7890);
  }

  renderSign(signRenderer, pixels, t) {
    var signOutput = signRenderer.getOutputBuffer(),
      i,
      color;
    signRenderer.render(t);
    for (i = 0; i < signOutput.length; i++) {
      color = ColorUtils.hsvToRGB(signOutput.getPixel(i));
      pixels.setPixel.apply(pixels, [i].concat(color));
    }
  }

  render () {
    var t = (new Date()).getTime();

    // for each knob
    config.KNOB_NAMES.forEach((knobId) => {
      // `KnobLightsRenderer` for this knob
      var knobLightRenderer = this.knobLightRenderers[knobId],
        knobLightRendererOutput,
        // hardware pixels
        pixels = this.knobLightPixels[knobId],
        color,
        i,
        pixelIndex;

      knobLightRenderer.render(t);
      knobLightRendererOutput = knobLightRenderer.getOutputBuffer();

      for (i = 0; i < knobLightRendererOutput.length; i++) {
        // knob pixels rendered in reverse
        pixelIndex = (knobLightRendererOutput.length - 1 - i);

        color = ColorUtils.hsvToRGB(
          knobLightRendererOutput.getPixel(pixelIndex)
        );

        //pixels.setPixel(i, 255, 0, 0);
        pixels.setPixel.apply(pixels, [i].concat(color));
      }
    });

    // render signs
    //this.renderSign(
      //this.instructionSignRenderer,
      //this.instructionSignPixels,
      //t
    //);
    //this.renderSign(
      //this.tawSignRenderer,
      //this.tawSignPixels,
      //t
    //);

    // write all pixels to the fadecandy
    this.opcStream.writePixels(0, this.fadecandyPixels.buffer);
  }
}
export default LightController;
