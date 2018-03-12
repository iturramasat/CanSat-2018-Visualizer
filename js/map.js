class Map {
  constructor(id){
    var that = this;
    var uluru = {lat: -25.363, lng: 131.044};
    var map = new google.maps.Map(document.getElementById(id), {
      zoom: 4,
      center: uluru
    });
    that.cansat = new google.maps.Marker({
      position: uluru,
      map: map
    });
  }

  setCansatPos(pos){

  }
}
