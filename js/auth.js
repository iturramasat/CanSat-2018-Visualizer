

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

      //alert(user);
      console.log(user);
      // ...
      if(user.providerData[0].providerId == "phone"){
        displayName = user.providerData[0].phoneNumber;
      }


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
