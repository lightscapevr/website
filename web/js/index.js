// testimonial slide logic
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