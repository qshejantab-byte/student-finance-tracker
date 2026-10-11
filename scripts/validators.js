// regex rules
export const rules = {
    description: /^\S(?:.*\S)?$/,
    doubleSpace: /\s{2,}/,
    hasLetter: /^(?=.*[A-Za-z]).+$/,
    duplicateWord: /\b(\w+)\s+\1\b/i,
    amount: /^(0|[1-9]\d*)(\.\d{1,2})?$/,
    date: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
    category: /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/

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
