var connection;
var PENDING = null

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
    // gapi.auth might not be loaded by the time a user calls this function
    // if no gapi.auth2 yet then store this function in PENDING which will be called when gapi is loaded
    if (gapi.auth2) {
        let auth2 = gapi.auth2.getAuthInstance();
        if (auth2.currentUser.get().isSignedIn()) {
            return true;
        }
        // show the log in dialog
        auth2.signIn().then(function (googleUser) {
            on_sign_in(googleUser);
            continuation();
        });
    } else {
        PENDING = function () {
            logInIfNotLoggedIn(continuation);
        }
    }
    return false;
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

function create_vrsketch_account() {
    // verify the input
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var email = $("#login-email").val();
    var password = $("#login-password").val();
    if (email == '') {
        $("#error-bar").text("Empty email");
        return;
    } else if (!re.test(email)) {
        $("#error-bar").text("Please enter a valid email");
        return;
    } else if (!check_valid_password(password)) {
        $("#error-bar").text("Please enter a password of minimum 6 characters");
        return;
    } else {
        // check if there is such an account first
        $("#error-bar").html("Email sending...");
        connection.session.call('com.email.send_registration_email', [email, password]).then(function (r) {
            $("#error-bar").html("Email sent, please confirm, <button class='btn btn-primary'>Resend</button>");
        });
    }
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

    public_api.log_in = function (name, email, token) {
        app.logged_in = true;
        app.token = token;
        app.name = name;
        app.email = email;
        $("#login-button").text(name);
        $("#login-button").addClass("dropdown-toggle");
        $("#login-button").attr("data-toggle", "dropdown");
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
        if (gapi.auth2) {
            app.logged_in = false;
            app.token = null;
            $("#login-button").text("Log in");
            $("#login-button").removeClass("dropdown-toggle");
            $("#login-button").attr("data-toggle", null);
            $("#login-dropdown").hide();
            let auth2 = gapi.auth2.getAuthInstance();
            auth2.attachClickHandler($("#login-button")[0], { ux_mode: 'redirect' },
                on_sign_in, show_error);
            auth2.signOut();
            showPricingInfo();
        } else {
            PENDING = function () {
                public_api.logout()
            }
        }
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
        console.log(params);
        var action = params.get('action');
        if (action == 'account_create') {
            connection.session.call("com.user.create", [params.get('token'), params.get('secret_token')]).then(
                function(r) {
                    if (r.success) {
                        show_message("Account successfully created, you have been logged in");
                    } else {
                        show_error_message(r.answer);
                    }
                });
        }
    }

    connection.onopen = function (session, details) {
        let params = new URLSearchParams(location.search);
        if (params.get('action'))
            do_action(params);
        gapi.load('auth2', function () {
            // Retrieve the singleton for the GoogleAuth library and set up the client.
            return; // XXX
            XXX

            let auth2 = gapi.auth2.init({
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
                        { ux_mode: 'redirect' }, on_sign_in,
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
