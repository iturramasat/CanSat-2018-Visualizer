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
		that.unit = $("#"+container).attr("unit");
    that.config = {
        type: 'line',
        data: {
          labels: [],
  				datasets: [{
              label: name,
              backgroundColor: window.chartColors.red,
              borderColor: window.chartColors.red,
              data: [],
              fill: false
          }]
        },
        options: {
					animation: false,
          responsive: false,
					legend: {
						 display: false
					},
          title: {
            display: false,
            //text: 'Chart.js Line Chart'
          },/*
          tooltips: {
            mode: 'index',
            intersect: false,
          },*/
          /*hover: {
            mode: 'nearest',
            intersect: true
          },*/
          scales: {
            xAxes: [{
              display: false,
              scaleLabel: {
                display: true,
                labelString: 'time'
              },
            }],
            yAxes: [{
              display: true,
              scaleLabel: {
                display: true,
                labelString: that.unit
              },
							ticks : {
								beginAtZero : includeZeroVal
							}
            }]
          }
        }
      };

    that.chart = new Chart(document.getElementById(container), that.config);
		that.maxValues = 50;
  }

  addValue(xval, yval){
    var that = this;
    that.config.data.labels.push(xval);
    that.config.data.datasets[0].data.push(yval);
    /*if (that.dps.length > that.dataLength) {
      that.dps.shift();
    }*/
		//console.log(xval + " : " + yval);
		that.clean();
    that.chart.update();
  }

  addInstantValue(yval){
    var that = this;
    let xval = new Date(Date.now());
    that.addValue(xval, yval);
  }

	clean(){
		let that = this;
		let maxValues = that.maxValues;
		that.config.data.labels = that.config.data.labels.slice(Math.max(that.config.data.labels.length - maxValues, 0));
		that.config.data.datasets[0].data = that.config.data.datasets[0].data.slice(Math.max(that.config.data.datasets[0].data.length - maxValues, 0));
	}
}
