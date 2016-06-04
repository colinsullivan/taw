class LightAnimation {
  constructor(params) {
    var i;

    this.numPixels = this.getNumPixels();
    this.pixelColors = [];
    for (i = 0; i < this.numPixels; i++) {
      this.pixelColors.push([0.0, 0.0, 0.0]);
    }
    this.startTime = (new Date()).getTime();

  }

  render() {
    
  }

};

export default LightAnimation;
