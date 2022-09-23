if (window.location.host == 'test.vrsketch.eu') {
    GOOGLE_CLIENT_TOKEN_ID = '1076106158582-2hr4jav5kbn2gccs0jsdbdhr4sg1d399.apps.googleusercontent.com';
    CHARGEBEE_SITE = 'baroquesoftware-test';
} else if (window.location.host == 'dev.vrsketch.eu') {
    GOOGLE_CLIENT_TOKEN_ID = '1076106158582-vqlj400ho3b2dpeiqd2bvofu20mhsj46.apps.googleusercontent.com';
    CHARGEBEE_SITE = 'baroquesoftware-test';
} else {
    GOOGLE_CLIENT_TOKEN_ID = '1076106158582-vekr6opr52b6i8eeu3cc8si7828hisgj.apps.googleusercontent.com';
    CHARGEBEE_SITE = 'baroquesoftware';
    if (window.Sentry) {
        Sentry.init({ dsn: 'https://38c4d64c82484e57b0199aef2d2e83cf@sentry.io/1306011' });
    }
}

var showPricingInfo = function () {};

var connection;
var PENDING = null;

let LOGIN_LOGIN = "<button id='main-login-button' class='btn btn-outline-primary' data-toggle='modal'" +
                  "data-target='#login-type-modal' onclick=\"$('#login-type-modal').show(); $('#fullname-container').hide();" +
                  "$('#login-rest').hide(); $('#error-bar').text('');\">Log in or create account</button>";
let LOGIN_NAME = "<button id='main-login-button' class='btn btn-primary dropdown-toggle' data-toggle='dropdown'>";
let LOGIN_NAME_2 = "</button>";
let RESET_PASSWORD_BUTTON = "&nbsp;&nbsp;<button type='button' class='btn btn-primary' "+
                            "onclick='password_reset(); return false;'>Reset password to the typed one</button>";

function show_error_message(errmsg) {
    $("#error").show();
    $("#error-msg").html(errmsg + '<button type="button" class="close" onclick="hide_error()">&times;</button>')
}

function hide_error() {
    $("#error").hide();
    $("#error-msg").html("");
}

function show_message(msg) {
    $("#message-container").show();
    $("#message-inner").text(msg);
}

function hide_message_container() {
    $("#message-container").hide();
    $("#message-inner").html("");
}

function getUserInfo() {
    connection.session.call('com.user.get_info', [vueAppApi.get_auth_token(),
    vueAppApi.get_name(), vueAppApi.get_email()]).then(function (r) {
        if (r.error) {
            show_error_message(r.error);
            vueAppApi.logout(false);
        }
        if (r.subscriptions) {
            showManageButtons();
        }
    },
        show_error);
}

function on_google_sign_in(cu) {
    on_sign_in(cu.getBasicProfile().getName(), cu.getBasicProfile().getEmail(),
        cu.getAuthResponse().id_token, true);
}

function on_vrsketch_sign_in(name, email, token, webtoken) {
    on_sign_in(name, email, token, false);
}

function on_sign_in(name, email, token, is_sso) {
    vueAppApi.log_in(name, email, token, is_sso);

    $("#main-login-button").replaceWith($("#main-login-button").clone()); // remove event listeners
    getUserInfo();
}

var FORMAT = "DD MMMM YYYY";

function formatDate(tstamp) {
    return moment(new Date(tstamp * 1000)).format(FORMAT);
}

function login_email_password() {
    var email = $("#login-email").val();
    var password = $("#login-password").val();
    if (!check_email_password_validity(email, password))
        return;

    $("#error-bar").text("Logging in...");
    connection.session.call('com.user.check_email_password', [email, password]).then(function (r) {
        if (!r.success) {
            if (r.incorrect_password) {
                $("#error-bar").html(r.answer + RESET_PASSWORD_BUTTON);
            } else {
                $("#error-bar").text(r.answer);
            }
        } else {
            store_cookie(r.token);
            on_vrsketch_sign_in(r.fullname, email, r.token);
            $("#login-type-modal").modal("hide");
        }
    });
}

function manage_subscriptions() {
    cbinst = Chargebee.getInstance();
    cbinst.setPortalSession(function () {
        return connection.session.call('com.portalsession', [vueAppApi.get_auth_token()]).then(
            function (r) {
                if (!r.success)
                    show_error(r.error);
                return r['portal_session'];
            }, show_error);
    });
    cbinst.createChargebeePortal().open({
        close: function () {
            connection.session.call('com.user.update_info', [vueAppApi.get_auth_token()]).then(
                function (res) {
                    if (!res.success)
                        show_error(res.error)
                    else
                        vueAppApi.show_licenses();
                }, show_error);
        }
    });
}

function check_valid_password(password)
{
    if (password.length >= 6) {
        return(true);
    }
    return(false);
}

function check_email_password_validity(email, password)
{
    // verify the input
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email == '') {
        $("#error-bar").text("Empty email");
        return(false);
    } else if (!re.test(email)) {
        $("#error-bar").text("Please enter a valid email");
        return(false);
    } else if (!check_valid_password(password)) {
        $("#error-bar").text("Please enter a password of minimum 6 characters");
        return false;
    }
    return true;
}

function password_reset()
{
    var email = $("#login-email").val();
    var password = $("#login-password").val();
    if (!check_email_password_validity(email, password))
        return;
    $("#error-bar").html("Email sending...");
    connection.session.call('com.email.send_reset_email', [email, password]).then(function (r) {
        if (!r.success) {
            $("#error-bar").text(r.answer);
            return;
        }
        $("#error-bar").text("Email sent, please read your email and confirm.")
    });
}

function create_vrsketch_account() {
    var email = $("#login-email").val();
    var password = $("#login-password").val();
    var fullname = $("#fullname").val();
    if (!check_email_password_validity(email, password))
        return;
    if (!fullname) {
        $("#error-bar").text("Please enter your full name");
        $("#fullname-container").show();
        return;
    } else {
        // check if there is such an account first
        $("#error-bar").html("Email sending...");
        connection.session.call('com.email.send_registration_email', [email, password, fullname]).then(function (r) {
            $("#error-bar").html("Email sent, please read your email and confirm.");
        });
    }
}

function store_cookie(login_token) {
    document.cookie = "vrsketch_login_token= " + login_token + "; expires=Fri, 1 Dec 2100 12:00:00 UTC; path=/"
}

function parse_cookie() {
    var a = {};
    var cookies = document.cookie.split(";");
    for (var p in cookies) {
        var p1 = cookies[p];
        var x = p1.split("=");
        a[x[0].trim()] = x[1];
    }
    return a;
}

function show_error(err, errmsg) {
    if (err && err.error == 'wamp.error.runtime_error' && err.args[0].startsWith('Token expired')) {
        vueAppApi.logout(false);
        return;
    }
    if (window.Sentry)
        Sentry.captureMessage(err);
    if (errmsg === undefined) {
        errmsg = '';
    }
    $("#error").show();
    $("#error-msg").html('Error encountered ' + errmsg + '<button type="button" class="close" onclick="hide_error()">&times;</button>');
    console.trace();
    console.log(JSON.stringify(err, undefined, 2));
}

function showLicenseModal() {
    $("#user-modal").modal('show');
    vueAppApi.show_licenses();
}

function clear_error() {
    $("#error-bar").text("");
}

function add_login_methods(app, public_api, post_login_function)
{
    public_api.log_in = function (name, email, token, is_sso) {
        app.token = token;
        app.name = name;
        app.email = email;
        app.is_sso = is_sso;
        if (app.when_logged_in) {
            app.when_logged_in();
            app.when_logged_in = null;
        }
        $("#main-login-button").replaceWith(LOGIN_NAME + name + LOGIN_NAME_2);
        if (post_login_function)
            post_login_function();
    };

    public_api.is_logged = function () {
        return !(app.token == null);
    }

    public_api.set_when_logged_in = function (continuation) {
        app.when_logged_in = continuation;
    }

    public_api.get_auth_token = function () { return app.token; };
    public_api.get_name = function () { return app.name; };
    public_api.get_email = function () { return app.email; };

    public_api.show_licenses = function (arg) {
        connection.session.call('com.user.get_info', [app.token, app.name, app.email]).then(
            function (r) {
                app.licenses_loaded = true;
                if (!r.result) {
                    app.no_license = true;
                    app.licenses = [];
                    return;
                }
                app.no_license = false;
                let licenses = [];
                for (var i = 0; i < r.subscriptions.length; i++) {
                    let sub = r.subscriptions[i];
                    let d = {
                        deleted: sub.deleted ? "deleted" : "",
                        quantity: sub.quantity,
                        license_id: sub.license_id,
                        ends_at: formatDate(sub.ends_at)
                    }
                    if (sub.license_type == 'vr-sketch-hobbyist' ||
                        sub.license_type == 'vr-sketch-hobbyist-2')
                        d.license_type = "hobbyist license";
                    else if (sub.license_type == 'vr-sketch-enterprise' ||
                             sub.license_type == 'vr-sketch-enterprise-2')
                        d.license_type = 'enterprise license';
                    else if (sub.license_type == 'vr-sketch' ||
                        sub.license_type == "vr-sketch-2" ||
                        sub.license_type == "vr-sketch-3" ||
                        sub.license_type == "vr-sketch-yearly-2" ||
                        sub.license_type == "vr-sketch-yearly")
                        d.license_type = "license";
                    else
                        d.license_type = "educational, automatically renewed";
                    licenses.push(d);
                }
                app.licenses = licenses;
            }, show_error);
    };

    public_api.get_debug_info = function () {
        return app;
    }

    public_api.logout = function (click_main_button) {
        /*XXX
        } else {
            PENDING = function () {
                public_api.logout()
            }
        }*/
        if (app.is_sso) {
            if (gapi.auth2) {
                let auth2 = gapi.auth2.getAuthInstance();
                auth2.signOut();
            }

        } else {
            store_cookie(''); // clear the cookie
            // auth2.signOut() // if through google
        }
        showPricingInfo();
        if (click_main_button)
            $("#main-login-button").click();
        $("#main-login-button").replaceWith(LOGIN_LOGIN);
        if (app.is_sso && gapi.auth2) {
            gapi.auth2.getAuthInstance().attachClickHandler($("#google-login-button")[0],
                        { ux_mode: 'redirect' }, on_google_sign_in,
                        show_error);
        }
        app.token = null;
        app.email = null;
        app.when_logged_in = null;
        app.fullname = null;
        app.files = [];
    }
}

$(document).ready(function () {
    var wsuri;
    if (document.location.host == 'localhost:8000') {
        wsuri = "ws://localhost:8080/ws";
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

    /*$(document).click(function () {
        $("#message-container").hide();
        $("#error").hide();
        return true;
    });*/

    function do_action(params)
    {
        var action = params.get('action');
        if (action == 'account_create') {
            connection.session.call("com.user.create", [params.get('token'), params.get('secret_token')]).then(
                function(r) {
                    if (r.success) {
                        store_cookie(r.webtoken);
                        on_vrsketch_sign_in(r.name, r.email, r.webtoken);
                        show_message("Account successfully created, you have been logged in.");
                    } else {
                        show_error_message(r.answer);
                    }
                });

        } else if (action == 'password_reset') {
            connection.session.call('com.user.reset_password', [params.get('token'), params.get('secret_token')]).then(
                function(r) {
                    if (r.success) {
                        store_cookie(r.webtoken);
                        on_vrsketch_sign_in(r.name, r.email, r.webtoken);
                        show_message("Password successfully reset, you are logged in.")
                    } else {
                        show_error_message(r.answer);
                    }
                });
        }
    }

    connection.onopen = function (session, details) {
        $("#main-login-button").replaceWith(LOGIN_LOGIN);
        if (window.location.hash.startsWith('#P')) {
          /* don't log in with google, but instead use the value of the
             hash-tag as license key */
          let license_id = window.location.hash.substring(2, 2+64);
          window.location.hash = '';
          connection.session.call('com.user.get_basic_info', [license_id]).then(
            function (res) {
              if (!res.success) {
                show_error(res.error);
                return;
              }
              vueAppApi.log_in(res.name, license_id, license_id, false);
            }, show_error);
          // load the gapi anyway, but don't do anything with it
          gapi.load('auth2', function() {
            let auth2 = gapi.auth2.init({'client_id': GOOGLE_CLIENT_TOKEN_ID});
          });
          return;
        }

        let params = new URLSearchParams(location.search);
        if (params.get('action'))
            do_action(params);
        var login_cookie = parse_cookie().vrsketch_login_token;
        if (login_cookie) {
            connection.session.call('com.user.check', [login_cookie]).then(function (r) {
                on_vrsketch_sign_in(r.fullname, r.email, login_cookie);
            });
        }
        gapi.load('auth2', function () {
            // Retrieve the singleton for the GoogleAuth library and set up the client.

            let auth2 = gapi.auth2.init({
                client_id: GOOGLE_CLIENT_TOKEN_ID,
                cookiepolicy: 'single_host_origin',

                // Request scopes in addition to 'profile' and 'email'
                //scope: 'additional_scope'
            });

            auth2.then(function () {
                if (auth2.isSignedIn.get()) {
                    on_google_sign_in(auth2.currentUser.get());
                } else {
                    auth2.attachClickHandler($("#google-login-button")[0],
                        { ux_mode: 'redirect' }, on_google_sign_in,
                        show_error);
                }

                // If there is a pending function, call it
                if (PENDING) {
                    PENDING();
                    PENDING = null;
                }
            }, show_error);
        });

        /* autoping functionality not implemented */
        /*function ping_server() {
            connection.session.call('com.ping', []);
            setTimeout(ping_server, 10000);
        }

        ping_server();*/

    }
    connection.open();

    var cbinst = Chargebee.init({ site: CHARGEBEE_SITE });

});
