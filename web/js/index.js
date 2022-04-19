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

function logInIfNotLoggedIn(continuation) {
    // gapi.auth might not be loaded by the time a user calls this function
    // if no gapi.auth2 yet then store this function in PENDING which will be called when gapi is loaded
    if (vueAppApi.is_logged()) {
        return true;
    }
    vueAppApi.set_when_logged_in(continuation);
    $("#main-login-button").click();
    return false;
}

function createHostedPage(plan) {
    // first check if user does not have a plan already
    connection.session.call('com.user.get_info', [vueAppApi.get_auth_token(),
    vueAppApi.get_name(), vueAppApi.get_email()]).then(function (r) {
        if (r.error) {
            show_error_message(r.error);
            vueAppApi.logout(false);
            return;
        }
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
            files: [],
            when_logged_in: null
        },
        methods: {}
    });
    add_login_methods(app, public_api);
})(vueAppApi);

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
