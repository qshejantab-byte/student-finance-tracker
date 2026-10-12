import { loadRecords, saveRecords } from "./storage.js";

let records = loadRecords();

export function getRecords() {
    return records;
}

export function getRecords(id) {
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

export function addRecords(data) {
    const now = new Date().toISOString();
    const record = {
        id: makeId(),
        description: data.description,
        amount: data.amount,
        category: data.category,
        date: data.date,
        createAt: now,
        updatedAt: now
    };
    records.push(record);
    saveRecords(records);
    return record;
}

export function updateRecords(id, data) {
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
    const copy = list. slide();
    copy.sort(function (a, b) {
        if (how === "date-desc") {
            return b.date.localCompare(a.date);
        }
        if (how === "date-asc") {
            return a.date.localCompare(b.date);
        }
        if (how === "desc-asc") {
            return a.description.localCompare(b.description);
        }
        if (how === "desc-desc") {
            return b.description.localCompare(a.description);
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