$(function () {
  $(".interface").hide();
  $("#partners").hide();

  if(Date.now() - parseInt(localStorage.partnerLastShown) > 1800000){
    setTimeout(function () {
      $(".interface").show();
      $("#partners").hide(1000);
    }, 10000)
    $(".interface").hide();
    $(".partners").show();
  } else {
    $(".interface").show();
  }

  localStorage.setItem("partnerLastShown", Date.now());

})
