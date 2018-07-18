var auth2 = null;

$(document).ready(function() {
    gapi.load('auth2', function(){
      // Retrieve the singleton for the GoogleAuth library and set up the client.
      auth2 = gapi.auth2.init({
        client_id: '1076106158582-2hr4jav5kbn2gccs0jsdbdhr4sg1d399.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
        // Request scopes in addition to 'profile' and 'email'
        //scope: 'additional_scope'
      });
      auth2.attachClickHandler($("#login-bar"), {},
        function (google_user) {
            console.log(google_user);
        }, function (error) {
            console.log(JSON.stringify(error, undefined, 2));
        });
    });
});