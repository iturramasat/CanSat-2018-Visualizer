function init() {

}

$(function () {
  $("#selector").change(function () {
    if($("#selector").val() != "no-sat"){
      localStorage.setItem("sat", $("#selector").val());
      console.log($("#selector").val());
      setTimeout(function () {
        location.href = "./index.html"

      }, 500);
    }
  });
});
