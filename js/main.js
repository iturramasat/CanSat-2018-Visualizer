var graphs = {}
let currentValues = {}
let tx_rate = 100;
let sd_rate = 100;

function parseNewValue(key, val) {
  let value = val.value;
  currentValues[key] = value;
  graphs[key].addInstantValue(value);
  $("#title-" + key).html(value);
}


$(function () {

  firebase.initializeApp(fireBaseConfig);
  var database = firebase.database();
  var socket = io(socketServer[localStorage.sat]);

  $("#continue-guestmode").click(function () {
    $("#welcome-login").hide();
  });

  if (typeof localStorage.sat == "undefined") {
    location.href = "./selector.html"
  }
/*
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


  var starCountRef = firebase.database().ref('sats/' + localStorage.sat + "/bmp");
  starCountRef.on('value', function(snapshot) {
    let values = snapshot.val();
    console.log(values);
  });*/

  let listen_to_graphs = ["bmp", "lm35", "mpx"];
  let baseUrl = 'sats/' + localStorage.sat + "/";
  listen_to_graphs.forEach(function (parameter) {
/*
    graphs[parameter] = new Graphic(parameter, true, "graph-" + parameter);
    database.ref(baseUrl + parameter).on('value', function (snapshot) {
      graphs[parameter].addInstantValue(snapshot.val().value);
    });
*/
    graphs[parameter] = new Graphic(parameter, true, "graph-" + parameter);
    socket.on(parameter, function (value) {
      graphs[parameter].addInstantValue(value);
    });
  });

  $("#powersave-mode").click(function () {
    tx_rate = 20 * 1000;
  });

  $("#continuous-mode").click(function () {
    tx_rate = 0.1 * 1000;
  });

  database.ref(baseUrl + "send_rate").on("value", function (snapshot) {
    let rate = snapshot.val().value;

  });
});
