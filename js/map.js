class GMap {
  constructor(id){
    var that = this;
    that.cansatPos = {
      lat:-0.2,
      lng:42.89
    };
    that.map = new google.maps.Map(document.getElementById(id), {
      zoom: 4,
      center: that.cansatPos
    });
    that.markerList = {};
    that.markers = {};
  }

  _updateMarkers(){
    var that = this;
    Object.keys(that.markerList).forEach(function (marker_id) {
      let marker_info = that.markerList[marker_id];

      if(Date.now() - marker_info.timestamp <= 2 * 60 * 1000){
        if(typeof that.markers[marker_id] == "undefined"){
          that.markers[marker_id] = new google.maps.Marker({
            position: marker_info.position,
            map: that.map
          });
        } else {
          that.markers[marker_id].setPosition(marker_info.position);
        }
      } else {
        if(typeof that.markers[marker_id] != "undefined"){
          that.markers[marker_id].setMap(null);
        }
      }
    });
  }

  updateMarkers(markers){
    let that = this;
    that.markerList = markers;
  }

  setupRecoverMap(){
    let that = this;
    let locationRef = firebase.database().ref(baseUrl + 'location');
    locationRef.on('value', function(snapshot) {
      that.updateMarkers(snapshot.val());
    });
  }

  updateCansat(){
    let that = this;
    that.markerList["cansat"] = {};
    that.markerList["cansat"].position = that.cansatPos;
    that.markerList["cansat"].timestamp = Date.now();
    that._updateMarkers();
  }

  updateCansatLat(lat){
    let that = this;
    that.cansatPos.lat = lat;
    that.updateCansat();
  }

  updateCansatLng(lng){
    let that = this;
    that.cansatPos.lng = lng;
    that.updateCansat();
  }
}
