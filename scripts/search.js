// turn what the user typed into a regex
// if it is not a valid pattern we return an error message instead of crashing
export function compileRegex(text, ignoreCase) {
    if (text === "") {
        return { regex: null, error: "" };
    }
    if (text.length > 100) {
        return { regex: null, error: "Pattern is too long (100 characters max)." };
    }
    try {
        const flags = ignoreCase ? "gi" : "g";
        return { regex: new RegExp(text, flags), error: "" };
    } catch (error) {
        return { regex: null, error: "Not a valid pattern: " + error.message };
    }
}

// the g flag remembers its positioning, so we reset it before eact test
export function hasMatch(regex, text) {
    regex.lastIndex = 0;
    return regex.test(text);
}

// puts the text in the element and wraps the matches in <mark>
// we use textContent and CreatElement so nothing typed can run as html
export function highlight(element, text, regex) {
    element.textContent = "";
    if (regex === null) {
        element.textContent = text;
        return;
    }

    let last = 0;
    regex.lastIndex = 0;
    let match = regex.exec(text);

    while (match !== null) {
        if (match[0] === "") {
            //empty match, move forward so we do not loop forever
            regex.lastIndex++;
            match = regex.exec(text);
            continue;
        }
        if (match.index > last) {
            element.appendChild(document.createTextNode(text.slice(last, match.index)));
        }
        const mark = document.createElement("mark");
        mark.textContent = match[0];
        element.appendChild(mark);
        last = match.index + match[0].length;
        match = regex.exec(text);
    }

    if (last < text.length) {
        element.appendChild(document.createTextNode(text.slice(last)));
    }
}