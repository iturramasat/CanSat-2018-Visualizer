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

  let listen_to_params = ["hbmp", "atotal", "tbmp", "pbmp", "vvel", "gpslat", "gpslng"];
  listen_to_params.forEach(function (parameter) {
    socket.on(parameter, function (value) {
      if(parameter == "hbmp"){
        $("#label-hbmp").html(value);
      } else if (parameter == "atotal"){
        $("#label-atotal").html(value);
      } else if (parameter == "tbmp"){
        $("#label-tbmp").html(value);
      } else if(parameter == "pbmp"){
        $("#label-pbmp").html(value);
      } else if(parameter == "vvel"){
        $("#label-vvel").html("value");
      }
    });
  });

  map = new GMap("embedded-map");
  map.setupRecoverMap();
  map.updateCansat();

  //
  // PARACHUTE.
  //


  firebase.database().ref(baseUrl + "pc-openh").on('value', function(snapshot) {
    $("#parachute-inputh").val(snapshot.val().value);
    $("#label-ph").html(snapshot.val().value);
  });

  firebase.database().ref(baseUrl + "pc-progh").on('value', function(snapshot) {
    $("#label-pprog").html(snapshot.val().value);
  });

  firebase.database().ref(baseUrl + "config/parachute_height").on("value", function (snapshot) {
    $("#parachute-inputhprog").val(snapshot.val().value);
  });

  firebase.database().ref(baseUrl + "config/parachute_program").on("value", function (snapshot) {
    $("#parachute-inputhprog").val(snapshot.val().value);
  });


  $("#parachute-update").click(function () {
    let openH = $("#parachute-inputh").val();
    let progH = $("#parachute-inputhprog").val();

    firebase.database().ref(baseUrl + "config/parachute_height").set({
      value:openH
    });
    firebase.database().ref(baseUrl + "config/parachute_program").set({
      value:progH
    });
    console.log("Updating parachute values");
  });


  // POWER RATE

  firebase.database().ref(baseUrl + "config/tx_rate").on("value", function (snapshot) {
    if(snapshot.val().value === true){
      $("#powersave-mode").removeClass("btn-primary");
      $("#continuous-mode").addClass("btn-primary");
      play("txrate_continuous");
    } else {
      $("#powersave-mode").addClass("btn-primary");
      $("#continuous-mode").removeClass("btn-primary");
      play("txrate_lowenergy");
    }
  });

  $("#powersave-mode").click(function () {
    firebase.database().ref(baseUrl + "config/tx_rate").set({
      value:false
    });
  });


  $("#continuous-mode").click(function () {
    firebase.database().ref(baseUrl + "config/tx_rate").set({
      value:true
    });
  });

  $("#parachute-unprogram").click(function () {
    sendCommand(0);
  });

  $("#parachute-program").click(function () {
    sendCommand(1);
  });

  $("#parachute-open").click(function () {
    sendCommand(2);
  });

  $("#parachute-close").click(function () {
    sendCommand(3);
  });

  $("#recording-start").click(function () {
    sendCommand(4);
  });

  $("#recording-stop").click(function () {
    sendCommand(5);
  });

});

let map;

function initMap() {

}

const max_commands = 10;
function sendCommand(number) {
  let command = Math.round(Math.random()*300) * max_commands + number;
  firebase.database().ref(baseUrl + "config/command").set({
    value:command
  });
}

function receiveCommand(number) {
  let command = number % max_commands;
  console.log(command + " command triggered");
}
