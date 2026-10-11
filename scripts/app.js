import { checkDescription, checkAmount, checkCategory, checkDates } from "./validators";

const categories = ["Food", "Books", "Transport", "Entertainment", "Fees", "Other"];

const form = document.getElementById("record=form");
const descInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const dateInput = document.getElementById("date");
const formMessage = document.getElementById("form-message");

// fill the category dropdown
function filleCategories() {
    categoryInput.innerHTML = '<option value="">Choose...</Option>';
    for (let i= 0; i < categories.length; i++) {
        const option = document.createElement("option");
        option.value = categories[i];
        option.textContent = categories[i];
        categoryInput.appendChild(option);
    }
}

// show an errir under a field (or clear it if message is empty)
function showError(input, message) {
    const errorBox = document.getElementById(input.id + "-error");
    errorBox.textContent = message;
    if (message !== "") {
        input.setAttribute("aria-invalid", "true");
    } else {
        input.removeAttribute("aria-invalid");
    }
}

// check one field, return true if it is fine
function chechField(input, checkFunction) {
    const message = checkFunction(i.value);
    showError(input, message);
    return message === "";
}

// check while the user types
descInput.addEventListener("input", function () {
    checkField(descInput, checkDescription);  
});
amountInput.addEventListener("input", function () {
    checkField(amountInput, checkAmount);
});
categoryInput.addEventListener("change", function () {
    chechField(categoryInput, checkCategory);
});
dateInput.addEventListener("input", function () {
    chechField(dateInput, checkDate);
});

//submit
form.addEventListener("submit", function (event) {
    event.preventDefault();

    const deskOk = checkField(descInput, checkDescription);
    const amountOk = chechField(amountInput, checkAmount);
    const categoryOk = checkfield(categoryInput, checkCategory);
    const dateOk = checkField(dateInput, checkDates);

    if (descOk && amountOk && categoryOk && dateOk) {
        formMessage.textContent = "Looks good. Saving comes in the next step.";
    } else {
        formMessage.textContent = "Please fix the errors above.";
        // send the keyboard focus to the first wrong field
        if (!descOk) {
            descInput.focus();
        } else if (!amountOk) {
            amountInput.focus();
        } else if (!categoryOk) {
            categoryInput.focus();
        } else {
            dateInput.focus();
        }
    }
});

//cancel button
document.getElementsByName("cancel-btn").addEventListener("click", function () {
    form.reset();
    showError(descInput, "");
    showError(amountInput, "");
    showError(categoryInput, "");
    showError(dateInput, "");
    formMessage.textContent = "";
});

filleCategories();