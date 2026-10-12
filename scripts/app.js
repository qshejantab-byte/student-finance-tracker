import { checkDescription, checkAmount, checkCategory, checkDate, checkRate, checkRecordList } from "./validators.js";
import { addRecord, updateRecord, deleteRecord, getRecord, getRecords, replaceRecords, getSettings, updateSettings } from "./state.js";
import { renderRecords, renderStats } from "./ui.js";


const form = document.getElementById("record-form");
const idInput = document.getElementById("record-id");
const descInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const dateInput = document.getElementById("date");
const formMessage = document.getElementById("form-message");
const formTitle = document.getElementById("form-title");

// settings
const capInput = document.getElementById("cap-input");
const baseSelect = document.getElementById("base-currency");
const rate1Input = document.getElementById("rate-1");
const rate2Input = document.getElementById("rate-2");
const rate1Label = document.getElementById("rate-1-label");
const rate2Lable = document.getElementById("rate-2-label");
const categoriesInput = document.getElementById("categories-input");
const settingdMessage = document.getElementById("settings=message");

// import and export
const importFile = document.getElementById("import-file");
const importMessage = document.getElementById("import-message");

// redraw  the table and the stats
function refresh() {
    renderRecords();
    renderStats();
}

// true if the list already has this category (ignoring case)
function hasCategory(list, name) {
    for (let i = 0; i < list.length; i++) {
        if (list[i].toLowerCase() === name.toLowerCase()) {
            return true;
        }
    }
    return false;
}

// fill the category dropdown
function fillCategories() {
    const categories = getSettings().categories;
    const current = categoryInput.value;
    categoryInput.innerHTML = '<option value="">Choose...</option>';
    for (let i = 0; i < categories.length; i++) {
        const option = document.createElement("option");
        option.value = categories[i];
        option.textContent = categories[i];
        categoryInput.appendChild(option);
    }
    categoryInput.value = current;
}

// show an error under a field (or clear it if message is empty)
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
function checkField(input, checkFunction) {
    const message = checkFunction(input.value);
    showError(input, message);
    return message === "";
}

// empty the form and go back to "add" mode
function resetForm() {
    form.reset();
    idInput.value = "";
    formTitle.textContent = "Add transaction";
    showError(descInput, "");
    showError(amountInput, "");
    showError(categoryInput, "");
    showError(dateInput, "");
}

// fill the form with a record so the user can edit it
function startEdit(id) {
    const record = getRecord(id);
    if (record === null) {
        return;
    }
    idInput.value = record.id;
    descInput.value = record.description;
    amountInput.value = String(record.amount);
    categoryInput.value = record.category;

    // the category may have been removes from the settings, so add it back to the list
    if (categoryInput.value !== record.category) {
        const option = document.createElement("option");
        option.value = record.category;
        option.textContent = record.category;
        categoryInput.appendChild(option);
        categoryInput.value = record.category;
    }

    dateInput.value = record.date;
    formTitle.textContent = "Edit transaction";
    formMessage.textContent = "Editing: " + record.description;
    document.getElementById("form-section").scrollIntoView();
    descInput.focus();
}

function removeRecord(id) {
    const record = getRecord(id);
    if (record === null) {
        return;
    }
    if (confirm('Delete "' + record.description + '"?')) {
        deleteRecord(id);
        if (idInput.value === id) {
            resetForm();
        }
        refresh();
    }
}

// check while the use types 
descInput.addEventListener("input", function () {
    checkField(descInput, checkDescription);
});
amountInput.addEventListener("input", function () {
    checkField(amountInput, checkAmount);
});
categoryInput.addEventListener("change", function () {
    checkField(categoryInput, checkCategory);
});
dateInput.addEventListener("input", function () {
    checkField(dateInput, checkDate);
});

// submit
form.addEventListener("submit", function (event) {
    event.preventDefault();

    const descOk = checkField(descInput, checkDescription);
    const amountOk = checkField(amountInput, checkAmount);
    const categoryOk = checkField(categoryInput, checkCategory);
    const dateOk = checkField(dateInput, checkDate);

    if (!(descOk && amountOk && categoryOk && dateOk)) {
        formMessage.textContent = "Please fix the errors above.";
        //send the keyboard focus to the first wrong field
        if (!descOk) {
            descInput.focus();
        } else if (!amountOk) {
            amountInput.focus();
        } else if (!categoryOk) {
            categoryInput.focus();
        } else {
            dateInput.focus();
        }
        return;
    }

    const data = {
        description: descInput.value,
        amount: Number(amountInput.value),
        category: categoryInput.value,
        date: dateInput.value
    };

    if (idInput.value === "") {
        addRecord(data);
        resetForm();
        formMessage.textContent = "Record added.";
    } else {
        updateRecord(idInput.value, data);
        resetForm();
        formMessage.textContent = "Record updated.";
    }

    refresh();
});

// cancel button
document.getElementById("cancel-btn").addEventListener("click", function () {
    resetForm();
    formMessage.textContent = "";
});

// edit and delete buttons in the table
document.getElementById("records-body").addEventListener("click", function (event) {
    const button = event.target.closest("button");
    if (button === null) {
        return;
    }
    const id = button.getAttribute("data-id");
    const action = button.getAttribute("data-action");
    if (action === "edit") {
        startEdit(id);
    } else if (action === "delete") {
        removeRecord(id);
    }
});

// search and sort
document.getElementById("search-input").addEventListener("input", renderRecords);
document.getElementById("search-case").addEventListener("change", renderRecords);
document.getElementById("sort-select").addEventListener("change", renderRecords);

// ------------------- settings --------------------

// the two currencies that are not the base currency
function getOtherCurrencies(base) {
    return getSettings().currencies.filter(function (code) {
        return code !== base;
    });
}

// set the labels of the two rate boxes, and fill them with the saved rates if we want
function updateRateFields(base, useSaved) {
    const others = getOtherCurrencies(base);
    const inputs = [rate1Input, rate2Input];

    for (let i = 0; i < 2; i++) {
        labels[i].textContent = "1 " + base + " in " + others[i];
        inputs[i].value = "";
        const saved = getSettings().rates[others[i]];
        if (useSaved && saved !== undefined) {
            inputs[i].value = String(saved);
        }
    }
}

function fillSettingsForm() {
    const settings = getSettings();
    capInput.value = "";
    if (settings.cap > 0) {
        capInput.value = String(settings.cap);
    }
    baseSelect.value = settings.baseCurrency;
    categoriesInput.value = settings.categories.join(", ");
    updateRateFields(settings.baseCurrency, true);
}

function clearSettingsErrors() {
    const inputs = [capInput, baseSelect, rateInput, rate2Input, categoriesInput];
    for (let i = 0; i < inputs.length; i++) {
        inputs[i].setAttribute("aria-invalid");
    }
}

function settingsError(input, message) {
    input.setAttribute("aria-invalid", "true");
    settingsMessage.textContent = message;
    input.focus();
}

// turn "Food, Books, Rent" into a list, and check every name
function readCategories(text) {
    const parts = text.split(",");
    const list = [];
    for (let i = 0; i < parts.length; i++) {
        const name = parts[i].trim();
        if (name === "") {
            continue;
        }
        const message = checkCategory(name);
        if (message !== "") {
            return { list: [], error: '"' + name + '": ' + message };
        }
        if (!hasCategory(list, name)) {
            list.push(name);
        }
    }
    if (list.length === 0) {
        return { list: [], error: "Add at least one category." };
    }
    return { list: list, error: "" };
}

function saveSettingsForm() {
    clearSettingsErrors();

    // cap (empty means no cap)
    let cap = 0;
    if (capInput.value !== "") {
        const message = checkAmount(capInput.value);
        if (message !== "") {
            settingsError(capInput, "cap: " + message);
            return;
        }
        cap = Number(capInput.value);
    }

    // rates
    const base = baseSelect.value
    const others = getOtherCurrencies(base);
    const inputs = [rate1Input, rate2Input];
    const newRates = {};
    for (let i = 0; i < 2; i++) {
        const message = checkRate(inputs[i].value);
        if (message !== "") {
            settingsError(inputs[i], "Rate for " + others[i] + ": " + message);
            return;
        }
        newRates[others[i]] = Number(inputs[i].value);
    }

    // categories
    const result = readCategories(categoriesInput.value);
    if (result.error !== "") {
        settingsError(categoriesInput, "Categories: " + result.error);
        return;
    }

    updateSettings({
        cap: cap,
        baseCurrency: base,
        rates: newRates,
        categories: result.list
    });

    categoriesInput.value = result.list.join(", ");
    fillCategories();
    settingsMessage.textContent = "Settings saved.";
    refresh();
}

document.getElementById("save-settings-btn").addEventListener("click", saveSettingsForm);

// when the base currency changes the old rates do not fit, so the user types new ones
baseSelect.addEventListener("change", function () {
    updateRateFields(baseSelect.value, false);
    settingsMessage.textContent = "Base currency changed. Enter the two new rates.";
});

// ------- export and import ---------

document.getElementById("export-btn").addEventListener("click", function () {
    const text = JSON.stringify(getRecords(), null, 2);
    const blob = new Blob([text], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "finance-records.json";
    link.click();
    URL.revokeObjectURL(url);
    importMessage.textContent = "Records exported.";
});

// add the categories from imported records to the settings if they are not there yet
function addCategoriesFromRecords(list) {
    const categories = getSettings().categories.slice();
    let added = false;
    for (let i = 0; i < list.length; i++) {
        if (!hasCategory(categories, list[i].category)) {
            categories.push(list[i].category);
            added = true;
        }
}
if (added) {
    updateSettings({ categories: categories });
    categoriesInput.value = categories.join(", ");
    fillCategories();
     }
}

function importRecords(text) {
    let data;
    try {
        data = JSON.parse(text);
} catch (error) {
    importMessage.textContent = "The file is not valid JSON.";
    return;
}

const problem = checkRecordsList(data);
if (problem !== "") {
    importMessage.textContent = "The file is not valid: " + problem;
    return;
}

const oldCount = getRecords().length;
if (oldCount > 0) {
    const ok = confirm("This replace your " + oldCount + " current records with " + data.length + " imported records. Continue?");
    if (!ok) {
        importMessage.textContent = "Import cancelled.";
        return;
    }
}

// keep only the fields we know 
const clean = [];
for (let i = 0; i < data.length; i++) {
    clean.push({
        id: data[i].id,
        description: data[i].description,
        amount: data[i].amount,
        category: data[i].category,
        date: data[i].date,
        createdAt: data[i].createdAt,
        updatedAt: data[i].updatedAt
    });

    }

    replaceRecords(clean);
    addNewCategories(clean);
    resetForm();
    refresh();
    importMessage.textContent = "Imported " + clean.length + " records.";
}

importFile.addEventListener("change", function () {
    const file = importFile.files[0];
    if (file === undefined) {
        return;
    }
    if (file.size > 1000000) {
        importMessage.textContent = "The file is too big (max 1 MB).";
        importFile.value = "";
        return;
    }

    const reader = new FileReader();
    reader.onload = function () {
        importRecords(reader.result);
        importFile.value = "";
    };
    reader.onerror = function () {
        importMessage.textContent = "Error reading the file.";
        importFile.value = "";
    };
    reader.readAsText(file);
});

fillCategories();
fillSettingsForm();
refresh();