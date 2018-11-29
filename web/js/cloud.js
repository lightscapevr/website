var auth2 = null;
var connection;
var state = null;

function hide_error() {
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

function uuid() {
    var result = "";
    for (var i = 0; i < 32; i++)
        result += Math.floor(Math.random() * 16).toString(16).toUpperCase();
    return result;
}

function State(auth_token, fullname, email) {
    this.auth_token = auth_token;
    this.fullname = fullname;
    this.email = email;
    this.callLater = null;
    this.token = uuid();
    this.connected = false;
    this.can_edit = false;
    this.currently_visiting_model = null;
    return this;
}

function on_logged_in(state) {
    connection.session.call("com.files.list", [state.auth_token]).then(function (res) {
        nunjucks.render('templates/cloud_files.html', res, function (err, html) {
            if (err) {
                show_error(err);
            } else {
                $("#files").html(html);
            }
        })
    }, show_error);
}

var BASE = "http://127.0.0.1:17355/vrsketch/";
var BASE_URL = "https://test.vrsketch.eu/cloud.html?file=";

function load_file(filename, file_id) {
    $.get(BASE + "view?name=" + filename + "&key=" + file_id);
}

function show_file_url(container, file_id)
{
    $(".file-url").hide();
    var elem = $(container).parent().children(".file-url");
    elem.show();
    elem.html("<input class='file-url-share' type='text' size=100 value=" + BASE_URL + file_id + ">")
}

function load_file_edit(filename, file_id)
{
    $.get(BASE + "edit?key=" + file_id + "&name=" + filename);
}

function pollVrSketch()
{
    if (state.connected)
        return;
    if (state.token) {
        $.get(BASE + "ping?token=" + state.token);
    }
    setTimeout(pollVrSketch, 2000);
}

function getStatusUpdate(initial)
{
    connection.session.call('com.sessions.get', [state.token, initial]).then(
        function (r) {
            if (!r.success) {
                console.log("It should never have returned success: false");
                return;
            }
            if (r.filename) {
                $("#currently-visiting").show();
                $("#currently-visiting-file").html("Currently visiting " + r.filename);
                state.currently_visiting_model = r.filename;
            }
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get('file')) {
                load_file("foo filename", urlParams.get("file"));
            }
            $("#current-status").removeClass("red").addClass("green");
            $("#current-status").html("CONNECTED");
            $(".load-button").removeClass("disabled").attr("disabled", false);
            state.connected = true;
            if (r.ready_to_edit) {
                $(".load-button-edit").removeClass("disabled").attr("disabled", false);
                state.can_edit = true;
            }
            getStatusUpdate(false);
        }, show_error);
}

function not_logged_in()
{
    $("#log-in-modal").show();
    $("#logged-in").html("not logged in");

    function onFailure(error) {
        $("#sign-in-header").html("Error: please sign in again");
    }
    gapi.signin2.render('sign-in-with-google', {
      'scope': 'profile email',
      'width': 240,
      'height': 50,
      'longtitle': true,
      'theme': 'dark',
      'onsuccess': on_sign_in,
      'onfailure': onFailure
    });
}

function on_sign_in()
{
    var auth2 = gapi.auth2.getAuthInstance();
    $("#logged-in").html(auth2.currentUser.get().getBasicProfile().getName());
    var googleUser = auth2.currentUser.get();
    var profile = googleUser.getBasicProfile();
    // The ID token you need to pass to your backend:
    var id_token = googleUser.getAuthResponse().id_token;

    var name = profile.getName();

    state = new State(id_token, name, profile.getEmail());
    on_logged_in(state);
    setTimeout(pollVrSketch, 0);
    getStatusUpdate(true);
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
      auto_ping_interval: 10.0,
    });
    connection.onopen = function (session, dets) {
        gapi.load('auth2', function () {
            auth2 = gapi.auth2.init({ 'client_id': CLIENT_TOKEN_ID });
            auth2.then(function () {
                if (auth2.isSignedIn.get()) {
                    on_sign_in();
                } else {
                    not_logged_in();
                }
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
        }).on("fileuploadadd", function (e, data) {
        });
    };
    connection.open();
    nunjucks.configure({'web': {'async': true}});
});
