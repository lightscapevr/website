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

function State(auth_token, fullname, email) {
    this.auth_token = auth_token;
    this.fullname = fullname;
    this.email = email;
    this.callLater = null;
    return this;
}

var FORMAT = "DD MMMM YYYY";

function formatDate(tstamp) {
    return moment(new Date(tstamp * 1000)).format(FORMAT);
}

function showManageButtons() {
    $("#manage-subscription-section").show();
    $("#pricing").hide();
    $("#get-a-license").attr("onclick", "showLicenseModal(); return false;");
    $("#get-a-license").html("Manage licenses");
}

function showPricingInfo() {
    $("#pricing").show();
    $("#manage-subscription-section").hide();
    $("#get-a-license").attr("onclick", "return true;");
    $("#get-a-license").html("Get a License");
}

function getUserInfo() {
    connection.session.call('com.user.get_info', [state.auth_token,
    state.fullname, state.email]).then(function (r) {
        if (r.subscriptions) {
            showManageButtons();
        }
    },
        show_error);
}

function on_sign_in(cu) {
    vueAppApi.log_in(cu.getBasicProfile().getName(), cu.getAuthResponse().id_token);

    $("#login-button").replaceWith($("#login-button").clone()); // remove event listeners
    return;
    state = new State(id_token, name, profile.getEmail());
    if (connection.session.isOpen) {
        getUserInfo();
    } else {
        state.callLater = getUserInfo;
    }
    $("#user-modal-user").text("Logged in as " + name);
    $("#login-contents").text(name);
}

function showLicenseModal() {
    $("#user-modal")[0].style.display = "block";
    showLicenses();
}

function showLicenses() {
    connection.session.call('com.user.get_info', [state.auth_token,
    state.fullname, state.email]).then(function (r) {
        if (!r.result) {
            $("#user-modal-body").html("No license present, please sign up for one");
        } else {
            r.number = r.subscriptions.length;
            for (var i in r.subscriptions) {
                var sub = r.subscriptions[i];
                if (sub.license_type == 'vr-sketch-hobbyist')
                    sub.license_type = "hobbyist";
                else if (sub.license_type == 'vr-sketch' ||
                    sub.license_type == "vr-sketch-2" ||
                    sub.license_type == "vr-sketch-yearly")
                    sub.license_type = "";
                else
                    sub.license_type = "educational, automatically renewed";

                sub.ends_at = formatDate(sub.ends_at);
                if (sub.deleted) {
                    sub.deleted = "cancelled";
                } else {
                    sub.deleted = "";
                }
            }
            nunjucks.render('templates/subscriptions.html', r, function (err, html) {
                if (err) {
                    show_error(err);
                } else {
                    $("#user-modal-body").html(html);
                }
            });
        }
    }, show_error);
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
    connection.session.call('com.user.get_info', [state.auth_token,
    state.fullname, state.email]).then(function (r) {
        if (r.subscriptions) {
            showManageButtons();
        } else {
            var cbinst = Chargebee.getInstance();
            cbinst.openCheckout({
                hostedPage: function () {
                    return connection.session.call('com.hostedpage', [state.auth_token,
                    state.fullname, state.email, plan]);
                },
                success: function (hostedPageId) {
                    connection.session.call('com.user.successful_payment',
                        [state.auth_token, hostedPageId]).then(function (r) {
                            $("#user-modal").show();
                            showLicenses();
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
    $("#billing-period-choice-modal").hide();
    createHostedPage('vr-sketch-2');
}

function order_regular_yearly() {
    $("#billing-period-choice-modal").hide();
    createHostedPage("vr-sketch-yearly");
}


function showEduModal() {
    if (!logInIfNotLoggedIn(showEduModal))
        return;
    $("#edu-modal")[0].style.display = "block";
}

function order_hobbyist() {
    $("#hobbyist-modal")[0].style.display = "";
    createHostedPage('vr-sketch-hobbyist');
}

function showHobbyistModal() {
    if (!logInIfNotLoggedIn(showHobbyistModal))
        return;
    $("#hobbyist-modal")[0].style.display = "block";
}

function checkEduAndOrder() {
    if (!$("#edu-purpose").val() || !$("#edu-role").val() || !$("#edu-institution").val()) {
        $("#edu-modal-error").html("please fill in the fields");
        return;
    } else if (!$("#edu-check").prop("checked")) {
        $("#edu-modal-error").html("please check the checkbox");
        return;
    }
    connection.session.call('com.register_edu', [state.auth_token, state.fullname, state.email,
    $("#edu-purpose").val(), $("#edu-role").val(), $("#edu-institution").val()]).then(function (r) {
        $("#edu-modal").hide();
        if (r.success) {
            showLicenseModal();
            getUserInfo();
        }
        else
            show_error();
    }, show_error);
}

function manage_subscriptions() {
    cbinst = Chargebee.getInstance();
    cbinst.setPortalSession(function () {
        return connection.session.call('com.portalsession', [state.auth_token]).then(
            function (r) {
                if (!r.success)
                    show_error(r.error);
                return r['portal_session'];
            }, show_error);
    });
    cbinst.createChargebeePortal().open({
        close: function () {
            connection.session.call('com.user.update_info', [state.auth_token]).then(
                function (res) {
                    if (!res.success)
                        show_error(res.error)
                    else
                        showLicenses();
                }, show_error);
        }
    });
}

var vueAppApi = {};
(function (public_api) {
  'use strict';

  var app = new Vue({
    el: "#cloud-app",
    data: {
        logged_in: false,
        token: null
    },
    methods: {}
  });

  public_api.log_in = function(name, token) {
    app.logged_in = true;
    app.token = token;
    $("#login-button").text(name);
    $("#login-button").addClass("dropdown-toggle");
    $("#login-button").attr("data-toggle", "dropdown");
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
        if (state && state.callLater) {
            state.callLater();
        }

        /* autoping functionality not implemented */
        function ping_server() {
          connection.session.call('com.ping', []);
          setTimeout(ping_server, 10000);
        }

        ping_server();

    }
    connection.open();

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
    var cbinst = Chargebee.init({site: 'baroquesoftware'});

});

function signout() {
    auth2.signOut().then(function () {
        $("#user-modal-user").text("not logged in");
        $("#login-contents").text("Log in");
        $("#login-bar").replaceWith($("#login-bar").clone()); // remove event listeners
        auth2.attachClickHandler($("#login-bar")[0], {}, on_sign_in,
            show_error);
        let modal = $("#user-modal")[0];
        modal.style.display = "none";
        showPricingInfo();
    });
}
