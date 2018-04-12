let selectors = [
  ["lm35", "bmp"],
  ["bmp", "mpx"],
  ["hradar", "hbmp", "hmpx"]
];

let labels = {
  "tbmp":"BMP180",
  "tds":"DS18B20",
  "tmpu":"MPU9250",
  "pbmp":"BMP180",
  "pmpx":"MPX",
  "hrdr":"uRad 0.4",
  "hgps":"Altura GPS",
  "hmpx":"MPX",
  "hbmp":"BMP180"
}

$(function () {
  new GraphSelector("pre", [
    "pbmp", "pmpx"
  ], labels);

  new GraphSelector("tmp", [
    "tbmp", "tmpu", "tds"
  ], labels);

  new GraphSelector("h", [
    "hrdr", "hgps", "hmpx", "hbmp"
  ], labels);

});

function enable() {

}

class GraphSelector {
  constructor(id, options, labels){
    let that = this;
    that.options = options;
    that.default = options[0];
    that.id = id;
    that.labels = labels;
    that.changeSelection(that.default);
    that.setupDom();
  }

  changeSelection(selected){
    let that = this;
    that.options.forEach(function (option) {
      GraphSelector.disable(option);
    });

    GraphSelector.enable(selected);

    that.current = selected;
    that.refreshLabel();
  }

  refreshLabel(){
    let that = this;
    $("#selector-label-" + that.id).html(that.labels[that.current]);
  }

  setupDom(){
    let that = this;
    that.options.forEach(function (option) {
      $("#selector-" + that.id + "-" + option).click(function () {
        that.changeSelection(option);
      });
    });

    that.refreshLabel();
  }

  static enable(option){
    let that = GraphSelector;
    $("#graph-"+option).show();
  }

  static disable(option){
    let that = GraphSelector;
    $("#graph-"+option).hide();
  }
}
