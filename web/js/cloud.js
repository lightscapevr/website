var auth2 = null;
var connection;
var state = null;

function hide_error()
{
    $("#error").html("");
}

function show_error(err) {
    if (err && err.error == 'wamp.error.runtime_error' && err.args[0].startsWith('Token expired')) {
        signout();
        return;
    }
    Sentry.captureMessage(err);
    $("#error").html("Error encountered <span onclick='hide_error()'>&times;</span>");
    console.log(JSON.stringify(err, undefined, 2));
}

function State(auth_token, fullname, email)
{
    this.auth_token = auth_token;
    this.fullname = fullname;
    this.email = email;
    this.callLater = null;
    return this;
}

function on_logged_in(state)
{
    connection.session.call("com.files.list", [state.auth_token]).then(function (res) {
        nunjucks.render('templates/cloud_files.html', res, function(err, html){
            if (err) {
                show_error(err);
            } else {
                $("#files").html(html);
            }            
        })
    }, show_error);
}

function load_file(file_id)
{
    $.get("http://127.0.0.1:17355/vrsketch-viewer/?key=" + file_id);
}

$(document).ready(function() {
    var wsuri;
    if (document.location.origin == "file://") {
        wsuri = "ws://127.0.0.1:8080/ws";

    } else {
        wsuri = (document.location.protocol === "http:" ? "ws:" : "wss:") + "//" +
                 document.location.host + "/ws";
    }
    connection = new autobahn.Connection({
      url: wsuri,
      realm: "vrsketch",
      max_retries: -1,
      max_retry_delay: 3,
    });
    connection.onopen = function(session, dets) {
        gapi.load('auth2', function() {
            auth2 = gapi.auth2.init({'client_id': CLIENT_TOKEN_ID});
            auth2.then(function () {
                $("#logged-in").html(auth2.currentUser.get().getBasicProfile().getName());
                var googleUser = auth2.currentUser.get();
                var profile = googleUser.getBasicProfile();
                // The ID token you need to pass to your backend:
                var id_token = googleUser.getAuthResponse().id_token;

                var name = profile.getName();

                state = new State(id_token, name, profile.getEmail());
                on_logged_in(state);
            });
        });

        var url = document.location.protocol + "//" + document.location.host + "/checkout/files/new";
        $('#fileupload').fileupload({
            url: url,
            dataType: 'json',
            acceptFileTypes: /\.skp/i,
            done: function (e, data) {
                if (!data.result.success) {
                    show_error(data.result.error);
                    return;
                }
                connection.session.call('com.files.add', [state.auth_token,
                    data.files[0].name, data.result.fname, '']).then(
                    function (r) {
                        on_logged_in(state);
                    }, show_error
                );
            },
            progressall: function (e, data) {
                var progress = parseInt(data.loaded / data.total * 100, 10);
                $('#progress .progress-bar').css(
                    'width',
                    progress + '%'
                );
            },
        }).on("fileuploadadd", function(e, data) {
        });
    };
    connection.open();
    nunjucks.configure({'web': {'async': true}});

});
