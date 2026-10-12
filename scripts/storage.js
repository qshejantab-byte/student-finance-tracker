const RECORDS_KEY = "sft:records";

export function leadRecords() {
    try {
        const text = localStorage.getItem(RECORDS_KEY);
        if (text === null) {
            return [];
        }
        const data = JSON.parse(text);
        if (Array.isArray(data)) {
            return data;
        }
        return [];
    } catch (error) {
        return [];
    }
}

export function saveRecords(records) {
    try {
        localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
    } catch (error) {
        console.log("Could not save records", error);
    }
}