var auth2 = null;
var connection;

function hide_error() {
    $("#error").html("");
}

function show_error(err) {
    if (err && err.error == 'wamp.error.runtime_error' && err.args[0].startsWith('Token expired')) {
        vueAppApi.logout();
        return;
    }
    Sentry.captureMessage(err);
    $("#error").html("Error encountered <span onclick='hide_error()'>&times;</span>");
    console.trace();
    console.log(JSON.stringify(err, undefined, 2));
}

var FORMAT = "DD MMMM YYYY";

function formatDate(tstamp) {
    return moment(new Date(tstamp * 1000)).format(FORMAT);
}

function showManageButtons() {
    $("#pricing").hide();
    $("#get-a-license").attr("onclick", "showLicenseModal(); return false;");
    $("#get-a-license").html("Manage licenses");
}

function showPricingInfo() {
    $("#pricing").show();
    $("#get-a-license").attr("onclick", "return true;");
    $("#get-a-license").html("Get a License");
}

function getUserInfo() {
    connection.session.call('com.user.get_info', [vueAppApi.get_auth_token(),
        vueAppApi.get_name(), vueAppApi.get_email()]).then(function (r) {
            if (r.subscriptions) {
                showManageButtons();
            }
        },
        show_error);
}

function on_sign_in(cu) {
    vueAppApi.log_in(cu.getBasicProfile().getName(), cu.getBasicProfile().getEmail(),
        cu.getAuthResponse().id_token);

    $("#login-button").replaceWith($("#login-button").clone()); // remove event listeners
    getUserInfo();
}

function showLicenseModal() {
    $("#user-modal").modal('show');
    vueAppApi.show_licenses();
}

function logInIfNotLoggedIn(continuation) {
    if (auth2.currentUser.get().isSignedIn())
        return true;
    // show the log in dialog
    gapi.auth2.getAuthInstance().signIn().then(function (googleUser) {
        onSignedIn(googleUser);
        continuation();
    });
}

function createHostedPage(plan) {
    // first check if user does not have a plan already
    connection.session.call('com.user.get_info', [vueAppApi.get_auth_token(),
    vueAppApi.get_name(), vueAppApi.get_email()]).then(function (r) {
        if (r.subscriptions) {
            showManageButtons();
        } else {
            var cbinst = Chargebee.getInstance();
            cbinst.openCheckout({
                hostedPage: function () {
                    return connection.session.call('com.hostedpage', [vueAppApi.get_auth_token(),
                    vueAppApi.get_name(), vueAppApi.get_email(), plan]);
                },
                success: function (hostedPageId) {
                    connection.session.call('com.user.successful_payment',
                        [vueAppApi.get_auth_token(), hostedPageId]).then(function (r) {
                            $("#user-modal").modal('show');
                            vueAppApi.show_licenses();
                            getUserInfo();
                        }, show_error);
                },
                error: show_error
            });
        }
    }, show_error);
}

function order_regular() {
    if (!logInIfNotLoggedIn(order_regular))
        return;
    $("#billing-period-choice-modal").show();
}

function order_regular_monthly() {
    $("#billing-period-choice-modal").modal('hide');
    createHostedPage('vr-sketch-2');
}

function order_regular_yearly() {
    $("#billing-period-choice-modal").modal('hide');
    createHostedPage("vr-sketch-yearly");
}


function showEduModal() {
    if (!logInIfNotLoggedIn(showEduModal))
        return;
    $("#edu-modal").show();
}

function order_hobbyist() {
    $("#hobbyist-modal").modal('hide');
    createHostedPage('vr-sketch-hobbyist');
}

function showHobbyistModal() {
    if (!logInIfNotLoggedIn(showHobbyistModal))
        return;
    $("#hobbyist-modal").show();
}

function checkEduAndOrder() {
    if (!$("#edu-purpose").val() || !$("#edu-role").val() || !$("#edu-institution").val()) {
        $("#edu-modal-error").html("please fill in the fields");
        return;
    } else if (!$("#edu-check").prop("checked")) {
        $("#edu-modal-error").html("please check the checkbox");
        return;
    }
    connection.session.call('com.register_edu', [vueAppApi.get_auth_token(),
        vueAppApi.get_name(), vueAppApi.get_email(),
    $("#edu-purpose").val(), $("#edu-role").val(), $("#edu-institution").val()]).then(function (r) {
        $("#edu-modal").modal('hide');
        if (r.success) {
            showLicenseModal();
            getUserInfo();
        }
        else
            show_error(r.error);
    }, show_error);
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

var vueAppApi = {};
(function (public_api) {
  'use strict';

  Vue.component('user-details', {
    // Area to display user licenses
    props: ['licenses', 'licenses_loaded', 'no_license'],
    template: '#user-details'
  })

  var app = new Vue({
    el: "#index-app",
    data: {
        logged_in: false,
        name: null,
        email: null,
        token: null,
        licenses_loaded: false,
        no_license: false,
        licenses: [],
    },
    methods: {}
  });

  public_api.log_in = function(name, email, token) {
    app.logged_in = true;
    app.token = token;
    app.name = name;
    app.email = email;
    $("#login-button").text(name);
    $("#login-button").addClass("dropdown-toggle");
    $("#login-button").attr("data-toggle", "dropdown");
  };

  public_api.get_auth_token = function() { return app.token; };
  public_api.get_name = function() { return app.name; };
  public_api.get_email = function() { return app.email; };

  public_api.show_licenses = function(arg) {
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
                if (sub.license_type == 'vr-sketch-hobbyist')
                    d.license_type = "hobbyist";
                else if (sub.license_type == 'vr-sketch' ||
                    d.license_type == "vr-sketch-2" ||
                    d.license_type == "vr-sketch-yearly")
                    d.license_type = "";
                else
                    d.license_type = "educational, automatically renewed";
                licenses.push(d);
            }
            app.licenses = licenses;
        }, show_error);
  };

  public_api.logout = function()
  {
    app.logged_in = false;
    app.token = null;
    $("#login-button").text("Log in");
    $("#login-button").removeClass("dropdown-toggle");
    $("#login-button").attr("data-toggle", null);
    $("#login-dropdown").hide();
    let auth2 = gapi.auth2.getAuthInstance();
    auth2.attachClickHandler($("#login-button")[0], {ux_mode: 'redirect'},
                             on_sign_in, show_error);
    auth2.signOut();
    showPricingInfo();
  }

})(vueAppApi);

$(document).ready(function () {
    let wsuri = (document.location.protocol === "http:" ? "ws:" : "wss:") + "//" +
                document.location.host + "/ws";
    connection = new autobahn.Connection({
        url: wsuri,
        realm: "vrsketch",
        max_retries: -1,
        max_retry_delay: 3,
    });
    connection.onopen = function (session, details) {
        gapi.load('auth2', function () {
            // Retrieve the singleton for the GoogleAuth library and set up the client.
            auth2 = gapi.auth2.init({
                client_id: GOOGLE_CLIENT_TOKEN_ID,
                cookiepolicy: 'single_host_origin',

                // Request scopes in addition to 'profile' and 'email'
                //scope: 'additional_scope'
            });

            auth2.then(function () {
                if (auth2.isSignedIn.get()) {
                    on_sign_in(auth2.currentUser.get());
                } else {
                    auth2.attachClickHandler($("#login-button")[0],
                        {ux_mode: 'redirect'}, on_sign_in,
                        show_error);
                }

            }, show_error);
        });
        /* autoping functionality not implemented */
        function ping_server() {
          connection.session.call('com.ping', []);
          setTimeout(ping_server, 10000);
        }

        ping_server();

    }
    connection.open();

    var cbinst = Chargebee.init({site: CHARGEBEE_SITE});

});
