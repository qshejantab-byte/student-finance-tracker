const RECORDS_KEY = "sft:records";

export function loadRecords() {
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

const SETTINGS_KEY = "sft:settings";

export function loadSettings() {
    try {
        const text = localStorage.getItem(SETTINGS_KEY);
        if (text === null) {
            return null;
        }
        const data = JSON. parse(text);
        if (data !== null && typeof data === "object" && !Array.isArray(data)) {
            return data;
        }
        return null;
    } catch (error) {
        return null;
    }
}

export function saveSettings(settings) {
    try {
        localStorage.setItem(SETTINGS_KEY,  JSON.stringify(settings));
    } catch (error) {
        console.log("Could not save settings", error);
    }
}