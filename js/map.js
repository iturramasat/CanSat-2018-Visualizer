class GMap {
  constructor(id){
    var that = this;
    var uluru = {lat: -25.363, lng: 131.044};
    that.map = new google.maps.Map(document.getElementById(id), {
      zoom: 4,
      center: uluru
    });
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
}
