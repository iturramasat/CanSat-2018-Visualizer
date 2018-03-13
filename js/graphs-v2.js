window.chartColors = {
	red: 'rgb(255, 99, 132)',
	orange: 'rgb(255, 159, 64)',
	yellow: 'rgb(255, 205, 86)',
	green: 'rgb(75, 192, 192)',
	blue: 'rgb(54, 162, 235)',
	purple: 'rgb(153, 102, 255)',
	grey: 'rgb(201, 203, 207)'
};

class Graphic {
  constructor(name, includeZeroVal, container){
    var that = this;
    that.dps = []; // dataPoints
    that.name = name;
    that.includeZero = includeZeroVal;
    that.container = container;
    that.config = {
        type: 'line',
        data: {
          labels: [],
  				datasets: [{
              label: 'My First dataset',
              backgroundColor: window.chartColors.red,
              borderColor: window.chartColors.red,
              data: [],
              fill: false
          }]
        },
        options: {
          responsive: true,
          title: {
            display: true,
            text: 'Chart.js Line Chart'
          },
          tooltips: {
            mode: 'index',
            intersect: false,
          },
          hover: {
            mode: 'nearest',
            intersect: true
          },
          scales: {
            xAxes: [{
              display: true,
              scaleLabel: {
                display: true,
                labelString: 'Month'
              }
            }],
            yAxes: [{
              display: true,
              scaleLabel: {
                display: true,
                labelString: 'Value'
              }
            }]
          }
        }
      };

    that.chart = new Chart(document.getElementById(container), that.config);
    that.dataLength = 100; // number of dataPoints visible at any point
  }

  addValue(xval, yval){
    var that = this;
    that.config.data.labels.push(xval);
    that.config.data.datasets[0].data.push(yval);
    /*if (that.dps.length > that.dataLength) {
      that.dps.shift();
    }*/
    that.chart.update();
  }
  addInstantValue(yval){
    var that = this;
    var xval = new Date(Date.now());
    that.addValue(xval, yval);
  }
}
