class Graphic {
  constructor(name, includeZeroVal, container){
    var that = this;
    that.dps = []; // dataPoints
    that.name = name;
    that.includeZero = includeZeroVal;
    that.container = container;
    that.chart = new Chart($("#" + container), {
      {
        type: 'line',
        data: data,
        options: options
      }
    });
    that.dataLength = 100; // number of dataPoints visible at any point
  }
}
