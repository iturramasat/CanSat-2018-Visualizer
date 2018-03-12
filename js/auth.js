

$(function () {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      var displayName = user.displayName;
      var email = user.email;
      var emailVerified = user.emailVerified;
      var photoURL = user.photoURL;
      var isAnonymous = user.isAnonymous;
      var uid = user.uid;
      var providerData = user.providerData;
      if(displayName == ""){
        displayName = user.providerData.uid;
      }
      //alert(user);
      console.log(user);
      // ...
      $("#welcome-name").html(displayName);
      $("#welcome-login").hide();
      $("#welcome").show();
    } else {
      // User is signed out.
      // ...
      $("#welcome").hide();
      $("#welcome-login").show();
    }
  });
})
