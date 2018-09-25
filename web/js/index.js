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

var FORMAT = "DD MMMM YYYY";

function formatDate(tstamp)
{
    return moment(new Date(tstamp * 1000)).format(FORMAT);
}

function getUserInfo()
{
    connection.session.call('com.user.get_info', [state.auth_token, 
    state.fullname, state.email]).then(function (r) {
        if (r.subscriptions) {
            $("#manage-subscription-section").show();
            $("#pricing").hide();
        }
    },
    show_error);
}

function onSignedIn(googleUser)
{
    var profile = googleUser.getBasicProfile();
    // The ID token you need to pass to your backend:
    var id_token = googleUser.getAuthResponse().id_token;

    var name = profile.getName();
    $("#login-bar").replaceWith($("#login-bar").clone()); // remove event listeners
    state = new State(id_token, name, profile.getEmail());
    connectModalAndTrigger("user-modal", "login-bar", showLicenseModal);
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
                    else if (sub.license_type == 'vr-sketch')
                        sub.license_type = "";
                    else
                        sub.license_type = "educational";

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

function logInIfNotLoggedIn(continuation)
{
    if (auth2.currentUser.get().isSignedIn())
        return true;
    // show the log in dialog
    gapi.auth2.getAuthInstance().signIn().then(function (googleUser) {
        onSignedIn(googleUser);
        continuation();
    });
}

function createHostedPage(plan)
{
    var cbinst = Chargebee.getInstance();
    cbinst.openCheckout({
        hostedPage: function() {
            return connection.session.call('com.hostedpage', [state.auth_token,
                state.fullname, state.email, plan]);
        },
        success: function(hostedPageId) {
            connection.session.call('com.user.successful_payment',
                [state.auth_token, hostedPageId]).then(function (r) {
                    $("#user-modal").show();
                    showLicenses();
                }, show_error);
        },
        error: show_error
    });
}

function order_regular()
{
    if (!logInIfNotLoggedIn(order_regular))
        return;
    createHostedPage('vr-sketch');
}

function showEduModal()
{
    if (!logInIfNotLoggedIn(showEduModal))
        return;
    $("#edu-modal")[0].style.display = "block";
}

function order_hobbyist()
{
    $("#hobbyist-modal")[0].style.display = "";
    createHostedPage('vr-sketch-hobbyist');
}

function showHobbyistModal()
{
    if (!logInIfNotLoggedIn(showHobbyistModal))
        return;
    $("#hobbyist-modal")[0].style.display = "block";
}

function checkEduAndOrder()
{
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

function manage_subscriptions()
{
    cbinst = Chargebee.getInstance();
    cbinst.setPortalSession(function() {
        return connection.session.call('com.portalsession', [state.auth_token]).then(
            function (r) {
                if (!r.success)
                    show_error(r.error);
                return r['portal_session'];
        }, show_error);
        });
    cbinst.createChargebeePortal().open({close: function() {
       connection.session.call('com.user.update_info', [state.auth_token]).then(
            function (res) {
                if (!res.success)
                    show_error(res.error)
                else
                    showLicenses();
            }, show_error);
    }});
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
    connection.onopen = function (session, details) {
        if (state && state.callLater) {
            state.callLater();
        }
    }
    connection.open();

    gapi.load('auth2', function(){
        // Retrieve the singleton for the GoogleAuth library and set up the client.
        auth2 = gapi.auth2.init({
            client_id: '1076106158582-vekr6opr52b6i8eeu3cc8si7828hisgj.apps.googleusercontent.com',
            cookiepolicy: 'single_host_origin',
            // Request scopes in addition to 'profile' and 'email'
            //scope: 'additional_scope'
        });

        auth2.then(function () {
            if (auth2.isSignedIn.get()) {
                onSignedIn(auth2.currentUser.get());
            } else {
                auth2.attachClickHandler($("#login-bar")[0], {}, onSignedIn,
                    show_error);
            }

        }, show_error);
    });
    let modal = $("#user-modal")[0];
    $("#user-modal-close").click(function () { modal.style.display = "none"; });
    connectModalAndTrigger("hobbyist-modal", null, null);
    connectModalAndTrigger("edu-modal", null, null);


    // index testimonial fade scroll logic
    let slideIndex = 0;
    cycle_slides();
    function cycle_slides() {
        let slide_array = document.getElementsByClassName("slide");

        for (let i = 0; i < slide_array.length; i++) {
            slide_array[i].classList.add("slide-off");
            slide_array[i].classList.remove("slide-on");
        }

        slideIndex++;
        if (slideIndex > slide_array.length) { slideIndex = 1 }
        slide_array[slideIndex - 1].classList.remove("slide-off");
        slide_array[slideIndex - 1].classList.add("slide-on");

        setTimeout(cycle_slides, 6000); //time interval must match css
    }

    // FAQ Logic
    let accordions = document.getElementsByClassName("accordion");
    if (accordions != undefined && accordions.length > 0) {
        for (let i = 0; i < accordions.length; i++) {
            accordions[i].addEventListener("click", function () {
                this.classList.toggle("accordion-active");
                let panel = this.nextElementSibling;
                if (panel.style.maxHeight) {
                    panel.style.maxHeight = null;
                } else {
                    panel.style.maxHeight = panel.scrollHeight + "px";
                }
            });
        }
    }

    var cbinst = Chargebee.init({site: 'baroquesoftware'});
    nunjucks.configure({'web': {'async': true}});

});

function signout() {
    auth2.signOut().then(function () {
        $("#user-modal-user").text("not logged in");
        $("#login-contents").text("Log in");
        $("#login-bar").replaceWith($("#login-bar").clone()); // remove event listeners
        auth2.attachClickHandler($("#login-bar")[0], {}, onSignedIn,
                    show_error);
        let modal = $("#user-modal")[0];
        modal.style.display = "none";
        $("#pricing").show();
        $("#manage-subscription-section").hide();
    });
}