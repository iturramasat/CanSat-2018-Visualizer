var graphs = {}
let currentValues = {}


function parseNewValue(key, val) {
  let value = val.value;
  currentValues[key] = value;
  graphs[key].addInstantValue(value);
  $("#title-" + key).html(value);
}


$(function () {

  firebase.initializeApp(fireBaseConfig);
  var database = firebase.database();


  if (typeof localStorage.sat == "undefined") {
    location.href = "./selector.html"
  }

  let graphScheme = {
    "bmp": "graph_bmp",
    "mpx": "graph_mpx",
    "lm35": "graph_lm35"//,
    //"v_vel": "vvelgraph"
  }


  Object.keys(graphScheme).forEach(function (graph) {
    let graphID = graphScheme[graph];
    graphs[graph] = new Graphic(graph, true, graphID);
  });


  var starCountRef = firebase.database().ref('sats/' + localStorage.sat);
  starCountRef.on('value', function(snapshot) {
    let values = snapshot.val();
    Object.keys(values).forEach(function (key) {
      let newValue = values[key];
      if(typeof values[key] != "undefined"){
        if(values[key] != currentValues[key]){
          parseNewValue(key, values[key]);
        }
      } else {
        parseNewValue(key, values[key]);
      }
    });
  });
});
