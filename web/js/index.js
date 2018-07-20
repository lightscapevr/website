var auth2 = null;

function show_error(err) {
    console.log(JSON.stringify(err, undefined, 2));
}

function onSignedIn(googleUser)
{
    var name = googleUser.getBasicProfile().getName();
    $("#login-contents").text(name);
}

$(document).ready(function() {
    gapi.load('auth2', function(){
        // Retrieve the singleton for the GoogleAuth library and set up the client.
        auth2 = gapi.auth2.init({
            client_id: '1076106158582-2hr4jav5kbn2gccs0jsdbdhr4sg1d399.apps.googleusercontent.com',
            cookiepolicy: 'single_host_origin',
            // Request scopes in addition to 'profile' and 'email'
            //scope: 'additional_scope'
        });

        auth2.then(function () {
            if (auth2.isSignedIn.get()) {
                onSignedIn(auth2.currentUser.get());
            }

            auth2.attachClickHandler($("#login-bar")[0], {}, onSignedIn,
                show_error);

        }, show_error);

    });
});