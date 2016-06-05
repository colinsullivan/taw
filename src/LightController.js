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

  //handleSequenceChanged (seqName, seqState) {
    //var numBeats = seqState.meter.numBeats;
    ////console.log("numBeats");
    ////console.log(numBeats);
    //var pixels = this.sequencePixels[seqName];
    ////console.log("strip");
    ////console.log(strip);
    //var i;
    //// number of LEDs per beat (if less than one, there are more beats than
    //// LEDS in the strip)
    //var ledsPerBeat = 1.0 * pixels.length / numBeats;
    //var color;

    ////console.log(`handleSequenceChanged(${seqName})`);

    //var ledColors = [];
    //for (i = 0; i < pixels.length; i++) {
      //ledColors.push([0.72, 0.2, 0.2]);
    //}

    //for (i = 0; i < numBeats; i++) {
      //let ledIndex = Math.floor(ledsPerBeat * i) % pixels.length;
      //ledIndex = pixels.length - 1 - ledIndex; // clockwise
      //ledColors[ledIndex][1] = 0.5;
      //ledColors[ledIndex][2] = 0.5;

      //if (i === seqState.transport.beat) {
        //ledColors[ledIndex][1] = 0.5;
        //ledColors[ledIndex][2] = 1.0;
      //}

    //}

    //for (i = 0; i < pixels.length; i++) {
      //color = ColorUtils.hsvToRGB(ledColors[i]);
      ////pixels.setPixel(i, 255, 0, 0);
      //pixels.setPixel.apply(pixels, [i].concat(color));
    //}
  //}

  //handleStateChange() {
    //var state = this.store.getState();

    ////console.log("handleStateChange");

    //// for each sequence
    //config.SEQUENCE_NAMES.forEach((seqName) => {
      //let seqState = state.sequencers[seqName];

      //// if transport or meter have changed
      //if (
        //seqState.meter !== this.sequenceMeter[seqName]
      //|| seqState.transport !== this.sequenceTransport[seqName]
      //) {
        //this.sequenceMeter[seqName] = seqState.meter;
        //this.sequenceTransport[seqName] = seqState.transport;

        //// re-render lights for that sequence
        //this.handleSequenceChanged(seqName, seqState);
      //}
    //});
  //}

  render () {
    var t = (new Date()).getTime();
    //console.log("render");

    //var i;
    //for (i = 0; i < this.fadecandyPixels.length; i++) {
      //this.fadecandyPixels.setPixel(i, 255, 0, 0);
    //}

    // for each sequence
    config.SEQUENCE_NAMES.forEach((sequenceName) => {
      // `KnobLightsRenderer` for this knob
      var knobLightRenderer = this.knobLightRenderers[sequenceName],
        // hardware pixels
        pixels = this.sequencePixels[sequenceName],
        color,
        i;

      knobLightRenderer.render(t);

      for (i = 0; i < knobLightRenderer.buffer.length; i++) {
        color = ColorUtils.hsvToRGB(knobLightRenderer.buffer.getPixel(i));
        //pixels.setPixel(i, 255, 0, 0);
        pixels.setPixel.apply(pixels, [i].concat(color));
      }
    });
    this.opcStream.writePixels(0, this.fadecandyPixels.buffer);
  }
}
export default LightController;
