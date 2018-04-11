$(function () {
  socket = io(socketServer);
  socket.on("pos", function (pos) {
    mainMap.updateCansatPos(pos);
  });

});

function initMap() {
  let mainMap = new GMap("mainMap");

}
