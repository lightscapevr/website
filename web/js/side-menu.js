let tags = document.getElementById("md-target").getElementsByTagName('*');
let menu = document.getElementById("side-menu");

createMenuItemForEachHeading(tags, menu);

function createMenuItemForEachHeading(tagArray, target) {
    for (let i = -1, l = tagArray.length; ++i < l;) {
        if (
            tagArray[i].nodeName == "H1" ||
            tagArray[i].nodeName == "H2" ||
            tagArray[i].nodeName == "H3" ||
            tagArray[i].nodeName == "H4" ||
            tagArray[i].nodeName == "H5" ||
            tagArray[i].nodeName == "H6"

        ) {
            addMenuItem(target, tagArray[i]);
        }
    }
}

function addMenuItem(parent, node) {
    let id = node.innerHTML.toLowerCase().split(' ').join('-');
    node.id = id;

    let linkItem = document.createElement("a");
    linkItem.href = "#" + id;
    linkItem.onclick = function () { hideSideMenu(); };

    let item = document.createElement(node.nodeName);
    item.innerHTML = node.innerText;

    linkItem.appendChild(item)
    parent.appendChild(linkItem);
}


function toggleSideMenu() {
    if (menu.classList.contains("show")) {
        hideSideMenu()
    } else {
        showSideMenu()
    }
}

function hideSideMenu() {
    if (menu.classList.contains("show"))
        menu.classList.remove("show");
    if (!menu.classList.contains("hide"))
        menu.classList.add("hide");
}

function showSideMenu() {
    if (menu.classList.contains("hide"))
        menu.classList.remove("hide");
    if (!menu.classList.contains("show"))
        menu.classList.add("show");
}
