class Graphic {
	constructor (name, includeZeroVal, container) {
		var that = this;
		that.dps = []; // dataPoints
		that.name = name;
		that.includeZero = includeZeroVal;
		that.container = container;
		that.chart = new CanvasJS.Chart(container, {
			title :{
				text: name
			},
			axisY: {
				includeZero: includeZeroVal
			},
			data: [{
				type: "spline",
				dataPoints: that.dps
			}]
		});

		that.xVal = 0;
		that.yVal = 100;
		that.updateInterval = 200;
		that.dataLength = 100; // number of dataPoints visible at any point

	}

	addValue(xval, yval){
		var that = this;
		that.dps.push({
			x: xval,
			y: yval
		});

		if (that.dps.length > that.dataLength) {
			that.dps.shift();
		}
		that.chart.render();
	}

  addInstantValue(yval){
    var that = this;
    var xval = new Date(Date.now());
    that.addValue(xval, yval);
  }
}
