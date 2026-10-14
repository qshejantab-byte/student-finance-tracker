import { loadRecords, saveRecords, loadSettings, saveSettings } from "./storage.js";

let records = loadRecords();

const defaultSettings = {
    baseCurrency: "RWF",
    currencies: ["RWF", "USD", "EUR"],
    rates: { USD: 0.0007, EUR: 0.0006 },
    cap: 0,
    categories: ["Food", "Books", "Transport", "Entertainment", "Fees", "Other"]
};

let settings = Object.assign({}, defaultSettings, loadSettings());

export function getSettings () {
    return settings;
}

export function updateSettings(changes) {
    Object.assign(settings, changes);
    saveSettings(settings);
}

export function getRecords() {
    return records;
}

export function getRecord(id) {
    for (let i=0; i < records.length; i++) {
        if (records[i].id === id) {
            return records[i];
        }
    }
    return null;
}

// makes ids like rec_0001, rec_0002
function makeId() {
    let max = 0;
    for (let i = 0; i < records.length; i++) {
        const num = Number(records[i].id.replace("rec_", ""));
        if (num > max) {
            max = num;
        }
    }
    return "rec_" + String(max + 1).padStart(4, "0");
}

export function addRecord(data) {
    const now = new Date().toISOString();
    const record = {
        id: makeId(),
        description: data.description,
        amount: data.amount,
        category: data.category,
        date: data.date,
        createdAt: now,
        updatedAt: now
    };
    records.push(record);
    saveRecords(records);
    return record;
}

export function updateRecord(id, data) {
    const record = getRecord(id);
    if (record === null) {
        return;
    }
    record.description = data.description;
    record.amount = data.amount;
    record.category = data.category;
    record.date = data.date;
    record.updatedAt = new Date().toISOString();
    saveRecords(records);
}

export function deleteRecord(id) {
    records = records.filter(function (record) {
        return record.id !== id;
    });
    saveRecords (records);
}

// returns a sorted copy, the original list stays the same
export function sortRecords(list, how) {
    const copy = list. slice();
    copy.sort(function (a, b) {
        if (how === "date-desc") {
            return b.date.localeCompare(a.date);
        }
        if (how === "date-asc") {
            return a.date.localeCompare(b.date);
        }
        if (how === "desc-asc") {
            return a.description.localeCompare(b.description);
        }
        if (how === "desc-desc") {
            return b.description.localeCompare(a.description);
        }
        if (how === "amount-asc") {
            return a.amount - b.amount;
        }
        if (how === "amount-desc") {
            return b.amount - a.amount;
        }
        return 0;
    });
    return copy;
}

export function replaceRecords(list) {
    records = list;
    saveRecords(records);
}