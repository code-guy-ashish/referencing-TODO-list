
let input = document.getElementsByClassName('input_msg')[0];
let add_button = document.getElementsByTagName("button")[0];
let ref_list = document.getElementsByClassName("ref_list")[0];
let keys = [];
let link_obj = {};

// Functionalities when the pages loads and reloads
window.addEventListener("load", () => {
    input.value = "";
    if ("link_o" in sessionStorage)
        link_obj = JSON.parse(sessionStorage.getItem("link_o"))
    enlist();
})

// Add Event Listner on removeAll button to clear the list
document.getElementsByClassName("remove")[0].addEventListener("click", () => {
    localStorage.clear();
    // sessionStorage.clear();
    window.location.reload();
})

// Evnet Listner for continuosuly looking for <> and # and pop auto search reference

input.addEventListener("input", (e) => {
    let len = input.value.length;

    if (e.data === ">" && input.value[len - 2] === "<" || e.data === "#") {
        position_list(len);
        ref_list.style.visibility = "visible";
    }
    else
        ref_list.style.visibility = "hidden";

})

// Positioning the Reference List
function position_list(x, y = 0) {
    ref_list.style.left = 180 + x * 7 + 'px';
    ref_list.style.top = 250 + y + 'px';
}

// Fuction to enlist all the list elements from the localstrogage into list

function enlist() {
    // Getting all the keys in the localStorage
    for (let i = 0; i < localStorage.length; i++)
        keys.push(parseInt(localStorage.key(i)));
    // Sorting the keys in ascending order
    keys.sort((a, b) => {
        return a - b;
    })
    keys.forEach((element) => {
        add_element(element, true)
    });
}

// Function to have input value altered when element selected from reference list

let create_el = () => {
    for (let i = 0; i < ref_list.children.length; i++) {
        let element = ref_list.children[i].firstElementChild;
        let id = element.getAttribute("id");
        document.getElementById(id).addEventListener("click", () => {
            input.value += element.textContent;
            ref_list.style.visibility = "hidden";

        })
    }
}

// Linking function 
let merge_array = (split_input) => {
    if (split_input[1] in link_obj)
        return Array.from(new Set(split_input.slice(1).concat(link_obj[split_input[1]])))
    else
        return split_input.slice(1)

}

let linking = (split_input) => {
    // console.log(split_input)
    if (split_input.length > 1) {
        let x = merge_array(split_input);
        link_obj[split_input[0]] = x;
    }
    else
        link_obj[split_input[0]] = [];

    sessionStorage.setItem("link_o", JSON.stringify(link_obj));
}


// Adds the div dynamically

function add_element(key, value) {
    let element = `
    <div class="text_card">
        <span class="text_msg">${localStorage.getItem(key)}</span>`;

    let element2 = `
    <div class="text_card">
        <span id=${key} class="ref_msg text_msg">${localStorage.getItem(key)}</span>
    </div>`;
    if (value && link_obj[localStorage.getItem(key)].length > 0) {
        link_obj[localStorage.getItem(key)].forEach((item) => {
            let span = `<span class="ref">${item}</span>`;
            element += span;
        })
    }
    element += "</div>"
    document.getElementsByClassName("texts")[0].innerHTML = element + document.getElementsByClassName("texts")[0].innerHTML;
    ref_list.innerHTML += element2;
    create_el();
}


// Add Event Listner for ADD button 
add_button.addEventListener("click", () => {
    let t_stamp = new Date().getTime();
    const breakpoint = /\#|\<>/
    localStorage.setItem(t_stamp, input.value.split(breakpoint)[0]);
    linking(input.value.split(breakpoint));
    add_element(t_stamp, true);
    input.value = "";
})
