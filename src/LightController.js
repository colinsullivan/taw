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
import config from "./config"
import LevelMenuLightRenderer from "./LevelMenuLightRenderer"
import ColorUtils from "./ColorUtils"

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
    this.fadecandyPixels = createOPCStrand(50);

    // renderers for knob menus
    this.levelMenuLightRenderers = {
      'level_4_menu_0': new LevelMenuLightRenderer({
        store: this.store,
        levelName: 'level_4',
        controlMenuIndex: 0
      }),
      'level_4_menu_1': new LevelMenuLightRenderer({
        store: this.store,
        levelName: 'level_4',
        controlMenuIndex: 1
      }),
      'level_6_menu_0': new LevelMenuLightRenderer({
        store: this.store,
        levelName: 'level_6',
        controlMenuIndex: 0
      }),
      'level_6_menu_1': new LevelMenuLightRenderer({
        store: this.store,
        levelName: 'level_6',
        controlMenuIndex: 1
      })
    };


    this.levelMenuLightBuffers = {};
    config.PIXEL_ADDRESS_MENU_NAMES.forEach((menuName) => {
      let menuPixelAddressRange = config.PIXEL_ADDRESSES[menuName];

      this.levelMenuLightBuffers[menuName] = this.fadecandyPixels.slice(
        menuPixelAddressRange[0],
        menuPixelAddressRange[1] + 1
      );
      
    });

    

    // one knob renderer per sequence
    //this.knobLightRenderers = {};

    // cache the meter and transport of each sequence so we can handle when
    // it changes.
    //this.sequenceMeter = {};
    //this.sequenceTransport = {};

    //config.SEQUENCE_NAMES.forEach((sequenceName) => {

      //this.sequenceMeter[sequenceName] = null;
      //this.sequenceTransport[sequenceName] = null;

    //});

    // hardware pixels around each knob (just slices of `fadecandyPixels`
    // buffer above)
    //this.knobLightPixels = {};

    //config.KNOB_NAMES.forEach((knobId) => {
      //var pixelAddrs = config.PIXEL_ADDRESSES[knobId];

      //// get buffer slice for each knob
      //this.knobLightPixels[knobId] = this.fadecandyPixels.slice(
        //pixelAddrs[0],
        //pixelAddrs[1]
      //);

      // create a renderer for the lights around each knob
      //this.knobLightRenderers[knobId] = new KnobLightsRenderer({
        //store: this.store,
        //sequencerName: config.KNOB_NAME_TO_SEQUENCE_NAME[knobId],
        //knobId: knobId
      //});
    //})

    // pixel buffers for each sign
    //this.instructionSignPixels = this.fadecandyPixels.slice(
      //config.PIXEL_ADDRESSES.INSTRUCTION_SIGN[0],
      //config.PIXEL_ADDRESSES.INSTRUCTION_SIGN[1]
    //);
    //this.tawSignPixels = this.fadecandyPixels.slice(
      //config.PIXEL_ADDRESSES.TAW_SIGN[0],
      //config.PIXEL_ADDRESSES.TAW_SIGN[1]
    //);

    // create renderer for each sign
    //this.instructionSignRenderer = new InstructionsSignLightsRenderer({
      //store: this.store
    //});
    //this.tawSignRenderer = new TAWSignLightsRenderer({
      //store: this.store
    //});

    // start the connection to fadecandy
    this.connect();
  }

  connect () {
    console.log("Connecting to fadecandy...");
    this.socket.connect(7890);
  }

  render (t) {


    config.PIXEL_ADDRESS_MENU_NAMES.forEach((menuName) => {
      var menuLightBuffer,
        menuRenderer,
        menuRendererOutput,
        menuPixelAddressRange,
        i,
        color;
      menuLightBuffer = this.levelMenuLightBuffers[menuName];
      menuRenderer = this.levelMenuLightRenderers[menuName];

      menuRenderer.render(t);
      menuRendererOutput = menuRenderer.getOutputBuffer();


      for (i = 0; i < menuRendererOutput.length; i++) {
        color = ColorUtils.hsvToRGB(
          menuRendererOutput.getPixel(i)
        );
        menuLightBuffer.setPixel.apply(menuLightBuffer, [i].concat(color));
      }


    });

    // for each knob
    //config.KNOB_NAMES.forEach((knobId) => {
      //// `KnobLightsRenderer` for this knob
      //var knobLightRenderer = this.knobLightRenderers[knobId],
        //knobLightRendererOutput,
        //// hardware pixels
        //pixels = this.knobLightPixels[knobId],
        //color,
        //i,
        //pixelIndex;

      //knobLightRenderer.render(t);
      //knobLightRendererOutput = knobLightRenderer.getOutputBuffer();

      //for (i = 0; i < knobLightRendererOutput.length; i++) {
        //// knob pixels rendered in reverse
        //pixelIndex = (knobLightRendererOutput.length - 1 - i);

        //color = ColorUtils.hsvToRGB(
          //knobLightRendererOutput.getPixel(pixelIndex)
        //);

        ////pixels.setPixel(i, 255, 0, 0);
        //pixels.setPixel.apply(pixels, [i].concat(color));
      //}
    //});

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
