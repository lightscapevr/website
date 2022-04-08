var connection;
var PENDING = null;

let LOGIN_LOGIN = "<button id='main-login-button' class='btn btn-outline-primary' data-toggle='modal'" +
                  "data-target='#login-type-modal' onclick=\"$('#login-type-modal').show(); $('#fullname-container').hide();" +
                  "$('#login-rest').hide(); $('#error-bar').text('');\">Log in or create account</button>";
let LOGIN_NAME = "<button id='main-login-button' class='btn btn-primary dropdown-toggle' data-toggle='dropdown'>";
let LOGIN_NAME_2 = "</button>";
let RESET_PASSWORD_BUTTON = "&nbsp;&nbsp;<button class='btn btn-primary' onclick='password_reset();'>Reset password to the typed one</button>";


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

function show_error_message(errmsg) {
    $("#error").show();
    $("#error-msg").html(errmsg + '<button type="button" class="close" onclick="hide_error()">&times;</button>')
}

function show_error(err, errmsg) {
    if (err && err.error == 'wamp.error.runtime_error' && err.args[0].startsWith('Token expired')) {
        vueAppApi.logout();
        return;
    }
    Sentry.captureMessage(err);
    if (errmsg === undefined) {
        errmsg = '';
    }
    $("#error").show();
    $("#error-msg").html('Error encountered ' + errmsg + '<button type="button" class="close" onclick="hide_error()">&times;</button>');
    console.trace();
    console.log(JSON.stringify(err, undefined, 2));
}

var FORMAT = "DD MMMM YYYY";

function formatDate(tstamp) {
    return moment(new Date(tstamp * 1000)).format(FORMAT);
}

function showManageButtons() {
    $("#pricing").hide();
    $('.nav-link[href="#pricing"]').hide();
    $("#get-a-license").attr("onclick", "showLicenseModal(); return false;");
    $("#get-a-license").html("Manage licenses");
}

function showPricingInfo() {
    $("#pricing").show();
    $('.nav-link[href="#pricing"]').show();
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

function log_in_button() {
    XXX;
    // Only used until gapi.auth2 is loaded
    var btn = $("#login-button");
    //xxxx
    //if (btn.html() == 'Log in') {
    btn.html('Logging in&nbsp;<i class="fa fa-spin fa-spinner">');
    PENDING = function () {
        btn.html('Log in');
        btn[0].click();
        $("#login-button").removeAttr('onclick');
    }
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

function showLicenseModal() {
    $("#user-modal").modal('show');
    vueAppApi.show_licenses();
}

function logInIfNotLoggedIn(continuation) {
    // gapi.auth might not be loaded by the time a user calls this function
    // if no gapi.auth2 yet then store this function in PENDING which will be called when gapi is loaded
    XXXX
    if (gapi.auth2) {
        let auth2 = gapi.auth2.getAuthInstance();
        if (auth2.currentUser.get().isSignedIn()) {
            return true;
        }
        // show the log in dialog
        auth2.signIn().then(function (googleUser) {
            on_google_sign_in(googleUser);
            continuation();
        });
    } else {
        PENDING = function () {
            logInIfNotLoggedIn(continuation);
        }
    }
    return false;
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

function showRegularModal() {
    $("#billing-period-choice-modal").show();
}

function order_regular_monthly() {
    addSpinnerForTime('order-regular-monthly-btn');
    if (!logInIfNotLoggedIn(order_regular_monthly))
        return;

    $("#billing-period-choice-modal").modal('hide');
    createHostedPage('vr-sketch-3');
}

function order_regular_yearly() {
    addSpinnerForTime('order-regular-yearly-btn');
    if (!logInIfNotLoggedIn(order_regular_yearly))
        return;

    $("#billing-period-choice-modal").modal('hide');
    createHostedPage("vr-sketch-yearly-2");
}

function showEnterpriseModal() {
    $("#enterprise-modal").show();
}

function order_enterprise_monthly() {
    addSpinnerForTime('order-enterprise-monthly-btn');
    if (!logInIfNotLoggedIn(order_enterprise_monthly))
        return;

    $("#enterprise-modal").modal('hide');
    createHostedPage('vr-sketch-enterprise');
}

function order_enterprise_yearly() {
    addSpinnerForTime('order-enterprise-yearly-btn');
    if (!logInIfNotLoggedIn(order_enterprise_yearly))
        return;

    $("#enterprise-modal").modal('hide');
    createHostedPage("vr-sketch-enterprise-annual");
}

function showHobbyistModal() {
    $("#hobbyist-modal").show();
}

function order_hobbyist() {
    addSpinnerForTime('order-hobbyist-btn');
    if (!logInIfNotLoggedIn(order_hobbyist))
        return;

    $("#hobbyist-modal").modal('hide');
    createHostedPage('vr-sketch-hobbyist-2');
}

function showEduModal() {
    $("#edu-modal").show();
}

function checkEduAndOrder() {
    addSpinnerForTime('edu-subscribe-button');
    if (!logInIfNotLoggedIn(checkEduAndOrder))
        return;

    if (!$("#edu-purpose").val() || !$("#edu-role").val() || !$("#edu-institution").val()) {
        $("#edu-modal-error").html("please fill in the fields");
        return;
    } else if (!$("#edu-check").prop("checked")) {
        $("#edu-modal-error").html("please check the checkbox");
        return;
    }
    $("#edu-subscribe-button").attr("disabled", "disabled");
    connection.session.call('com.register_edu', [vueAppApi.get_auth_token(),
    vueAppApi.get_name(), vueAppApi.get_email(),
    $("#edu-purpose").val(), $("#edu-role").val(), $("#edu-institution").val()]).then(function (r) {
        $("#edu-modal").modal('hide');
        $("#edu-subscribe-button").attr("disabled", null);
        if (r.success) {
            showLicenseModal();
            getUserInfo();
        }
        else
            show_error(r.error);
    }, show_error);
}

function addSpinnerForTime(elementId) {
    var element = $('#' + elementId);
    var spinner = '&nbsp;<i class="fa fa-spin fa-spinner">';
    var innerHtml = element.html().replace(spinner, '')
    element.html(innerHtml + spinner);
    element.delay(4000).queue(function () { element.html(innerHtml); });
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

function clear_error() {
    $("#error-bar").text("");
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
            name: null,
            is_sso: false,
            email: null,
            token: null,
            licenses_loaded: false,
            no_license: false,
            licenses: [],
        },
        methods: {}
    });

    public_api.log_in = function (name, email, token, is_sso) {
        app.token = token;
        app.name = name;
        app.email = email;
        app.is_sso = is_sso;
        $("#main-login-button").replaceWith(LOGIN_NAME + name + LOGIN_NAME_2);
    };

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

    public_api.logout = function () {
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
        $("#main-login-button").click();
        $("#main-login-button").replaceWith(LOGIN_LOGIN);
        app.token = null;
        app.email = null;
        app.fullname = null;
    }

})(vueAppApi);

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

    $(document).click(function () {
        $("#message-container").hide();
        $("#error").hide();
        return false;
    });

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
        function ping_server() {
            connection.session.call('com.ping', []);
            setTimeout(ping_server, 10000);
        }

        ping_server();

    }
    connection.open();

    var cbinst = Chargebee.init({ site: CHARGEBEE_SITE });

});

// Load youtube videos
$(document).ready(function () {
    var video_players = $('.youtube-player');

    // Add onlick event
    video_players.click(function () {
        var id = $(this).attr('data-embed');
        var vid = '<iframe src="//www.youtube.com/embed/' + id + '?showinfo=0&autoplay=1" frameborder="0" allow="autoplay; encrypted-media; fullscreen" allowfullscreen></iframe>';
        $(this).append(vid);
        $(this).children('.youtube-play-btn').remove();
    })

    // Add cover images
    video_players.each(function () {
        var id = $(this).attr('data-embed');
        if ($(this)[0].offsetWidth > 540) {
            $(this).css('background-image', 'url("https://img.youtube.com/vi/' + id + '/maxresdefault.jpg")');
        } else {
            $(this).css('background-image', 'url("https://img.youtube.com/vi/' + id + '/0.jpg")');
        }
    });
});

// Delay add images to carrousel
$(document).ready(function () {
    var images = [
        { src: "img/slides/slide-2-600x337.jpg", alt: "Drawing a building in virtual reality with VR Sketch" },
        { src: "img/slides/slide-10-600x337.jpg", alt: "Multiple people working together in virtual reality with VR Sketch" },
        { src: "img/slides/slide-3-600x337.jpg", alt: "Creating in virtual reality with VR Sketch" },
        { src: "img/slides/slide-11-600x337.jpg", alt: "Control scenes and layer from inside virtual reality with VR Sketch" },
        { src: "img/slides/slide-5-600x337.jpg", alt: "Teleport navigation in virtual reality with VR Sketch" },
        { src: "img/slides/slide-7-600x337.jpg", alt: "Selecting tools in virtual reality with VR Sketch" },
        { src: "img/slides/slide-8-600x337.jpg", alt: "Drawing architecture in virtual reality with VR Sketch" },
        { src: "img/slides/slide-9-600x337.jpg", alt: "Visiting famous buildings in virtual reality with VR Sketch" },
        { src: "img/slides/slide-12-600x337.jpg", alt: "Using the Laser Selecting tool in VR Sketch" }
    ]
    var carrousel = $('#js-carousel');
    for (var i = 0; i < images.length; i++) {
        carrousel.append('<div class="carousel-item"><img class="d-block w-100" src="' + images[i].src + '" alt="' + images[i].alt + '"></div>')
    }
});
