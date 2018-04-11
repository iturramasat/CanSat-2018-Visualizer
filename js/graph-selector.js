let selectors = [
  ["lm35", "bmp"],
  ["bmp", "mpx"],
  ["hradar", "hbmp", "hmpx"]
];

$(function () {
  new GraphSelector(selectors[1], selectors[1][0], "pre", {
    "bmp":"BMP180",
    "mpx":"MPX-BLABLABLA"
  });
});

function enable() {

}

class GraphSelector {
  constructor(options, def, id, labels){
    let that = this;
    that.options = options;
    that.default = def;
    that.id = id;
    that.labels = labels;
    that.changeSelection(def);
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
