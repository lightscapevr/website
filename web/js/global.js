// menu logic
function toggle_menu() {
    let nav_btn_array = document.getElementsByClassName("nav-link");
    for (let i = 0; i < nav_btn_array.length; i++) {
        nav_btn_array[i].classList.toggle("nav-responsive");
    }
}
function hide_menu() {
    let nav_btn_array = document.getElementsByClassName("nav-link");
    for (let i = 0; i < nav_btn_array.length; i++) {
        nav_btn_array[i].classList.remove("nav-responsive");
    }
}


// modal logic

function connectModalAndTrigger(modalId, triggerId, afterfunc) {
    // Find connections
    let modal = document.getElementById(modalId);
    let modalOpenBtn = document.getElementById(triggerId);
    let modalCloseBtn = modal.getElementsByClassName("modal-close-btn")[0];

    // Add events
    if (modalOpenBtn) {
        modalOpenBtn.onclick = function () {
            modal.style.display = "block";
            if (afterfunc)
                afterfunc();
        }
    }
    modalCloseBtn.onclick = function () { modal.style.display = "none"; }
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
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