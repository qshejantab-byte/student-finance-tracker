import { getRecords, sortRecords, getSettings } from "./state.js";
import { compileRegex, hasMatch, highlight } from "./search.js";

const body = document.getElementById("records-body");
const emptyMessage = document.getElementById("empty-message");
const searchInput = document.getElementById("search-input");
const searchCase = document.getElementById("search-case");
const searchMessage = document.getElementById("search-message");
const sortSelect = document.getElementById("sort-select");

function makeCell(label) {
    const td = document.createElement("td");
        td.setAttribute("data-label", label);
    return td;
}

function makeButton(text, action, records) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = text;
    button.setAttribute("data-action", action);
    button.setAttribute("data-id", records.id);
    button.setAttribute("aria-label", text + " " + records.description);
    if (action === "delete") {
        button.className = "delete";
    }
    return button;
}

export function renderRecords() {
    const all = getRecords();
    const result = compileRegex(searchInput.value, searchCase.checked);    
    const regex = result.regex;

    let list = sortRecords(all, sortSelect.value);

    // keep only the records that match the search
    if (regex !== null) {
        list = list.filter(function (records) {
            return hasMatch(regex, records.description) ||
            hasMatch(regex, records.category) ||
            hasMatch(regex, records.date) ||
            hasMatch(regex, records.amount.toFixed(2));
        });
    }

    body.innerHTML = "";

        for (let i = 0; i < list.length; i++) {
        const record = list[i];
        const tr = document.createElement("tr");

        const dateCell = makeCell("Date");
        highlight(dateCell, record.date, regex);

        const descCell = makeCell("Description");
        highlight(descCell, record.description, regex);

        const categoryCell = makeCell("Category");
        highlight(categoryCell, record.category, regex);

        const amountCell = makeCell("Amount");
        highlight(amountCell, record.amount.toFixed(2), regex);

        const actionCell = makeCell("Actions");
        actionCell.appendChild(makeButton("Edit", "edit", record));
        actionCell.appendChild(makeButton("Delete", "delete", record));

        tr.appendChild(dateCell);
        tr.appendChild(descCell);
        tr.appendChild(categoryCell);
        tr.appendChild(amountCell);
        tr.appendChild(actionCell);
        body.appendChild(tr);
    }

    // empty message
    if (list.length === 0) {
        if (all.length === 0) {
            emptyMessage.textContent = "No records yet.";
        } else {
            emptyMessage.textContent = "No records match your search.";
        }
        emptyMessage.hidden = false;
    } else {
        emptyMessage.hidden = true;
    }

    // search message
    if (result.error !== "") {
        searchMessage.textContent = result.error;
        searchInput.setAttribute("aria-invalid", "true");
    } else {
        searchMessage.textContent = "Showing " + list.length + " of " + all.length + " records.";
        searchInput.removeAttribute("aria-invalid");
    }
}

const statusCount = document.getElementById("stat-count");
const statSum = document.getElementById("stat-sum");
const statTop = document.getElementById("stat-top");
const trendChart = document.getElementById("trend-chart");
const capMessage = document.getElementById("cap-message");
const statConverted = document.getElementById("stat-converted");

// date as YYYY-MM-DD using the local time 
function toDateString(d) {
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return d.getFullYear() + "-" + month + "-" + day;
}

export function renderStats() {
    const records = getRecords();
    const settings = getSettings();
    const currency = settings.baseCurrency;

    // total, and total for each category
    let total = 0;
    const byCategory = new Map();
    for (let i = 0; i < records.length; i++) {
        total += records[i].amount;
        const category = records [i].category;
        byCategory.set(category, (byCategory.get(category) || 0) + records[i].amount);
    }
    total = Math.round(total * 100) / 100;

    // category with the biggest total
    let topName = "";
    let topAmount = 0;
    byCategory.forEach(function (amount, name) {
        if (amount > topAmount) {
            topAmount = amount;
            topName= name;
        }
    });

    statusCount.textContent = records.length;
    statSum.textContent = total.toFixed(2) + " " + currency;
    // total in the other currencies, using the rates from settings
    const parts = [];
    for (let i = 0; i < settings.currencies.length; i++) {
        const code = settings.currencies[i];
        const rate = settings.rates[code];
        if (code !== currency && rate !== undefined) {
            parts.push ((total * rate).toFixed(2) + " " + code);
        }

    }
    statConverted.textContent = parts.join(", ");
            if (topName === "") {
        statTop.textContent = "-";
    } else {
        statTop.textContent = topName + " (" + topAmount.toFixed(2) + ")";
    }

// last 7 days, today is the last one
const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const days = [];
for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push({ key: toDateString(d), label: dayNames[d.getDay()], total: 0 });
}
for (let i = 0; i < records.length; i++) {
    for (let j = 0; j < days.length; j++) {
        if (records[i].date === days[j].key) {
            days[j].total += records[i].amount;
        }
    }
}

let max = 0;
for (let i = 0; i < days.length; i++) {
    if (days[i].total > max) {
        max = days[i].total;
    }
}

trendChart.innerHTML = "";
const summary = [];
for (let i = 0; i < days.length; i++) {
    const col = document.createElement("div");
    col.className = "bar-col";

    const value = document.createElement("span");
    value.className = "bar-value";
    value.textContent = Math.round(days[i].total);

    const bar = document.createElement("div");
    bar.className = "bar";
    let height = 0;
    if (max > 0) {
        height = Math.round(days[i].total / max * 80);
    }
    bar.style.height = height + "px";

    const label = document.createElement("span");
    label.className = "bar-label";
    label.textContent = days[i].label;

    col.appendChild(value);
    col.appendChild(bar);
    col.appendChild(label);
    trendChart.appendChild(col);

    summary.push(days[i].label + " " + days[i].total.toFixed(2));
}
// the chart is drawn with divs, so we give screen readers the numbers as text
trendChart.setAttribute("role", "img");
trendChart.setAttribute("aria-label", "Spending in the last 7 days: " + summary.join(", "));

// cap message
const cap = settings.cap;
capMessage.classList.remove("cap-over");
if (!cap || cap <=0) {
    capMessage.setAttribute("aria-live", "polite");
    capMessage.textContent = "No cap set. You can set one in Settings.";
} else if (total <= cap) {
    capMessage.setAttribute("aria-live", "polite");
    capMessage.textContent = "You have " + (cap - total).toFixed(2) + " " + currency + " left of your " + cap.toFixed(2) + " cap.";
} else {
    capMessage.setAttribute("aria-live", "assertive");
    capMessage.classList.add("cap-over");
    capMessage.textContent = "You are " + (total - cap).toFixed(2) + " " + currency + " over your " + cap.toFixed(2) + " cap.";
}
}