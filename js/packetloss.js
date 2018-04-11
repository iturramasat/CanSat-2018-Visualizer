var g;

$(function () {

  firebase.initializeApp(fireBaseConfig);
  var database = firebase.database();
  let baseUrl = 'sats/' + localStorage.sat + "/";

  g = new JustGage({
    id: "packetloss",
    value: 0,
    min: 0,
    max: 100,
    title: "Calidad de la señal"
  });

  database.ref(baseUrl + "packetloss").on("value", function (snapshot) {
    g.refresh(snapshot.val().value * 100);
  });

})
