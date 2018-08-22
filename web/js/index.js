var auth2 = null;
var connection;

function show_error(err) {
    console.log(JSON.stringify(err, undefined, 2));
}

function onSignedIn(googleUser)
{
    var name = googleUser.getBasicProfile().getName();
    $("#login-bar").replaceWith($("#login-bar").clone()); // remove event listeners
    connectModalAndTrigger("user-modal", "login-bar", function() {
        //connection.session.call
    });
    $("#user-modal-user").text("Logged in as " + name);
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
            } else {
                auth2.attachClickHandler($("#login-bar")[0], {}, onSignedIn,
                    show_error);
            }

        }, show_error);
    });
    let modal = $("#user-modal")[0];
    $("#user-modal-close").click(function () { modal.style.display = "none"; });


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
    connection.open();

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
    });
}