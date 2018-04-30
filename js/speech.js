let speech_enabled;
$(function () {
  if(localStorage.speech_enabled === "false"){
    speech_enabled = false;
  } else {
    speech_enabled = true;
  }

  let render = function () {
    if(speech_enabled){
      $("#toggle_speech").html("Desactivar voz");
    } else {
      $("#toggle_speech").html("Activar voz");
    }
  }

  render();

  $("#toggle_speech").click(function () {
    speech_enabled = !speech_enabled;
    localStorage.setItem("speech_enabled", speech_enabled);
    render();
  });

  play("welcome");

});

let audio = {paused:true};
function play(msg, priority = false) {
  if((!priority && speech_enabled && audio.paused) || (priority && speech_enabled)){
    if(priority && !audio.paused){
      audio.pause();
    }
    console.log("Playing " + msg);
    audio = new Audio("speech/" + msg + '.mp3');
    audio.play();
  }
}
