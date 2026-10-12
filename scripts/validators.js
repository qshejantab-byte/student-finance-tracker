// regex rules
export const rules = {
    description: /^\S(?:.*\S)?$/,
    doubleSpace: /\s{2,}/,
    hasLetter: /^(?=.*[A-Za-z]).+$/,
    duplicateWord: /\b(\w+)\s+\1\b/i,
    amount: /^(0|[1-9]\d*)(\.\d{1,2})?$/,
    date: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
    category: /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/,
    rate: /^(0|[1-9]\d*)(\.\d{1,6})?$/  

};

// each function returns an error message, or "" if the value is fine

export function checkDescription(text) {
    if (text== "") {
        return "Description is required.";
    }

    if (!rules.description.test(text)) {
        return "No spaces at the start or the end.";
    }
    if (rules.description.test(test)) {
        return "No double spaces.";
    }
    if (!rules.hasLetter.test(text)) {
        return "Description must have at least one letter.";
    }
    if (rules.duplicateWord.test(text)) {
        return "A word is repeated in the description.";
    }
    return "";
}

export function checkAmount(text) {
    if (text=== "") {
        return "Amount id required.";
    }
    if (!rules.amount.test(text)) {
        return "Use a numnber like 12 or 12.50 (2 decimals at most).";
    }
    if (Number(text) ===0) {
        return "Amount must be more than 0.";
    }
    return "";
}

export function checkDates(text) {
    if (text === "") {
        return "Date is required.";
    }
    if (!rules.date.test(text)) {
        return "Use the format YYYY-MM-DD.";
    }
    // the regex lets 2026-02-30 through, so check the date is real
    const d = new Date(text);
    if (isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== text) {
        return "That date does not exist.";
    }
    return "";
}

export function checkCategory(text) {
    if (text === "") {
        return "Choose a category.";
    }
    if (!rules.category.test(text)) {
        return "Use letters, spaces and hyphens only.";
    }
    return "";
}

export function checkRate(text) {
    if (text === "") {
        return "Rate is required.";
    }
    if (!rules.rate.test(text)) {
        return "Use a number with up to 6 decimals, like 0.0007.";
    }
    if (Number(text) === 0) {
        return "Rate must be more than 0.";
    }
    return "";
}

// checks a list of records from a JSON file, return "" if it is fine
export function checkRecordsList(data) {
    if (!Array.isArray(data)) {
        return "The data is not a list.";
    }

    const ids = [];
    for (let i = 0; i < data.length; i++) {
        const item = data[i];
        const where = "Record #" + (i + 1) + ": ";

        if (item === null || typeof item !== "object" || Array.isArray(item)) {
            return where + "The record is not an object.";
}
if (typeof item.id !== "string" || item.id === "") {
            return where + "The id is missing.";
        }
        if (ids.includes(item.id)) {
            return where + "id is used twice.";
        }
        ids.push(item.id);


        if (typeof item.description !== "string") {
            return where + "description is missing.";
        }
        if (typeof item.amount !== "number") {
            return where + "amount must be a number.";
        }
        if (typeof item.category !== "string") {
            return where + "category is missing.";
        }
        if (typeof item.date !== "string") {
            return where + "date is missing.";
        }

        // use the same rules as the form
        let message = checkDescription(item.description);
        if (message !== "") {
            message = checkAmount(String(item.amount));
        }
        if (message !== "") {
            message = checkCategory(item.category);
        }
        if (message !== "") {
            message = checkDate(item.date);
        }
        if (message !== "") {
            return where + message;
        }

        if (typeof item.createdAt !== "string" || isNaN(Date.parse(item.createdAt))) {
            return where + "createdAt is missing or invalid.";
        }
        if (typeof item.updatedAt !== "string" || isNaN(Date.parse(item.updatedAt))) {
            return where + "updatedAt is not a valid date.";
        }

    }
    return "";
}