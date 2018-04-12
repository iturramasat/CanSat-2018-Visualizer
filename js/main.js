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
    //location.href = "./selector.html"
    localStorage.setItem("sat", "a_sat");
  }

  let listen_to_graphs = ["tbmp", "tds", "tmpu","pbmp", "pmpx", "hmpx", "hbmp", "hrdr", "hgps"];
  let baseUrl = 'sats/' + localStorage.sat + "/";
  listen_to_graphs.forEach(function (parameter) {
    graphs[parameter] = new Graphic(parameter, true, "graph-" + parameter);
    socket.on(parameter, function (value) {
      graphs[parameter].addInstantValue(value);
    });
  });

  socket.emit("resend"); // request resend of last values

  let listen_to_params = [];
  listen_to_params.forEach(function (parameter) {
    socket.on(parameter, function (value) {
      if(parameter == "hbmp"){
        
      }
    })
  });

  /*$("#powersave-mode").click(function () {
    tx_rate = 20 * 1000;
  });

  $("#continuous-mode").click(function () {
    tx_rate = 0.1 * 1000;
  });

  database.ref(baseUrl + "send_rate").on("value", function (snapshot) {
    let rate = snapshot.val().value;
  });*/

  map = new GMap("embedded-map");
  map.setupRecoverMap();
});

let map;
function initMap() {

}
