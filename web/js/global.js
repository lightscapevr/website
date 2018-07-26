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

function connectModalAndTrigger(modalId, triggerId) {
    // Find connections
    let modal = document.getElementById(modalId);
    let modalOpenBtn = document.getElementById(triggerId);
    let modalCloseBtn = modal.getElementsByClassName("modal-close-btn")[0];

    // Add events
    modalOpenBtn.onclick = function () { modal.style.display = "block"; }
    modalCloseBtn.onclick = function () { modal.style.display = "none"; }
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}
