var graphs = {}
let currentValues = {}
let tx_rate = 100;
let sd_rate = 100;

let map;

function initMap() {

}

let previousH;
let previousH_time;
let vvel;
let hbmp = 0;

function parseNewValue(key, val) {
  let value = val.value;
  currentValues[key] = value;
  graphs[key].addInstantValue(value);
  $("#title-" + key).html(value);
}

let socket;
$(function () {

  firebase.initializeApp(fireBaseConfig);
  var database = firebase.database();
  socket = io(socketServer[localStorage.sat]);

  $("#continue-guestmode").click(function () {
    $("#welcome-login").hide();
  });

  if (typeof localStorage.sat == "undefined") {
    //location.href = "./selector.html"
    localStorage.setItem("sat", "a_sat");
  }

  let listen_to_graphs = ["tbmp", "tlm35", "tmpu","pbmp", "pmpx", "hmpx", "hbmp", "hrdr", "hgps"];
  let baseUrl = 'sats/' + localStorage.sat + "/";
  listen_to_graphs.forEach(function (parameter) {
    let includeZero;
    if($("#graph-" + parameter).attr("includeZero") == "true"){
      includeZero = true;
    } else {
      includeZero = false
    }
    graphs[parameter] = new Graphic(parameter, includeZero, "graph-" + parameter);
    socket.on(parameter, function (value) {
      graphs[parameter].addInstantValue(value);
    });
  });

  socket.emit("resend"); // request resend of last values

  map = new GMap("embedded-map");
  map.setupRecoverMap();
  map.updateCansat();


  let listen_to_params = ["hbmp", "atotal", "tbmp", "pbmp", "gpslat", "gpslng", "volt", "hrdr"];
  listen_to_params.forEach(function (parameter) {
    socket.on(parameter, function (value) {
      if(parameter == "hbmp"){
        $("#label-hbmp").html(value);
        hbmp = value;
      } else if (parameter == "atotal"){
        $("#label-atotal").html(value);
      } else if (parameter == "tbmp"){
        $("#label-tbmp").html(value);
      } else if(parameter == "pbmp"){
        $("#label-pbmp").html(value);
      } else if(parameter == "volt"){
        $("#label-voltage").html(value);
      } else if(parameter == "gpslat"){
        map.updateCansatLat(value / 100000);
      } else if(parameter == "gpslng"){
        map.updateCansatLng(value / 100000);
      } else if(parameter == "hrdr"){
        $("#label-hrdr").html(value);
      }
    });
  });



  //
  // PARACHUTE.
  //


  firebase.database().ref(baseUrl + "pc-openh").on('value', function(snapshot) {
    //$("#parachute-inputh").val(snapshot.val().value);
    $("#label-ph").html(snapshot.val().value);
  });

  firebase.database().ref(baseUrl + "pc-progh").on('value', function(snapshot) {
    $("#label-pprog").html(snapshot.val().value);
  });

  firebase.database().ref(baseUrl + "config/parachute_height").on("value", function (snapshot) {
    $("#parachute-inputh").val(snapshot.val().value);
  });

  firebase.database().ref(baseUrl + "config/parachute_program").on("value", function (snapshot) {
    $("#parachute-inputhprog").val(snapshot.val().value);
  });

  firebase.database().ref(baseUrl + "parachute_open").on('value', function(snapshot) {
    if(snapshot.val().value){
      $("#parachute-status").html("ABIERTO");
      $("#parachute-status").attr("class", "label-abierto");
      play("parachute_opened");
    } else {
      $("#parachute-status").html("CERRADO");
      $("#parachute-status").attr("class", "label-cerrado");
      play("parachute_closed");
    }
  });


  firebase.database().ref(baseUrl + "parachute_programmed").on('value', function(snapshot) {
    if(snapshot.val().value){
      $("#parachute-program").html("PROGRAMADO");
      $("#parachute-program").attr("class", "label-programado");
      play("parachute_programmed");

    } else {
      $("#parachute-program").html("DESPROGRAMADO");
      $("#parachute-program").attr("class", "label-desprogramado");
      play("parachute_unprogrammed");

    }
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

  $("#parachute-programbtn").click(function () {
    sendCommand(1);
  });

  $("#parachute-open").click(function () {
    sendCommand(2);
    socket.emit("parachute", true);
  });

  $("#parachute-close").click(function () {
    sendCommand(3);
    socket.emit("parachute", false)
  });

  socket.on("parachute", function (value) {
    if(value == true){
      play("parachute_opened");
    } else {
      play("parachute_closed")
    }
  })

  $("#recording-start").click(function () {
    sendCommand(4);
  });

  $("#recording-stop").click(function () {
    sendCommand(5);
  });

});


$(function () {
  setInterval(function () {
    let currentH = hbmp;
    let difference = currentH - previousH;
    let difference_time = Date.now() - previousH_time;
    vvel = difference / difference_time;
    if(vvel >= 3.0){
      newStatus = "asc";
      if(newStatus != status){
        play("height_asc");
        status = newStatus;
        $("#parachute-direction").html("ASCENDIENDO");
        $("#parachute-direction").attr("class", "label-ascenso");
      }
    } else if( vvel <= -3.0){
      newStatus = "desc";
      if(newStatus != status){
        play("height_desc");
        status = newStatus;
        $("#parachute-direction").html("DESCENDIENDO");
        $("#parachute-direction").attr("class", "label-descenso");
      }
    } else {
      newStatus = "stable";
      if(newStatus != status){
        play("height_stable");
        status = newStatus;
        $("#parachute-direction").html("ESTABLE");
        $("#parachute-direction").attr("class", "label-estable");
      }
    }
    $("#label-vvel").html(vvel);
    //updateCansatDirection();
    previousH = currentH;
    previousH_time = Date.now();
  }, 200);
})
