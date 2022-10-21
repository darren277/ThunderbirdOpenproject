function saveSettings() {
    const apikey = document.getElementById("apikey").value;
    const defaultproject = getSelectedProject("defaultproject");
    const defaultassignee = getSelectedProject("defaultassignee");
    const apiurl = document.getElementById("apiurl").value;
    let defaultContentFormat = document.getElementById(
        "defaultcontentformat"
    ).value;
    if (defaultContentFormat === "custom") {
        defaultContentFormat = document.getElementById(
            "defaultcontentformat-custom"
        ).value;
    }
    const includeMessageBody = document.getElementById(
        "include_message_body"
    ).checked;
    browser.storage.local.set({
        apikey: apikey,
        defaultproject: defaultproject,
        defaultassignee: defaultassignee,
        apiurl: apiurl,
        defaultcontentformat: defaultContentFormat,
        includeMessageBody: includeMessageBody ? "1" : "0",
    });
}

function saveAndLoadProjects() {
    saveSettings();
    fillAllProjectsSelect("defaultproject");
    fillAllAssigneesSelect("defaultassignee");
}

function enableApplyToken() {
    document.getElementById("tokenapplybutton").disabled = false;
}

function applyToken() {
    saveAndLoadProjects();
    document.getElementById("tokenapplybutton").disabled = true;
}

function updateCustomTaskFormat() {
    const value = document.getElementById("defaultcontentformat").value;
    let maillink = false;
    let custom = false;
    if (value.includes("%msgurl%")) {
        maillink = true;
    } else if (value === "custom") {
        maillink = true;
        custom = true;
    }
    document.getElementById("setupinstructions-maillink").style.display = maillink
        ? "block"
        : "none";
    document.getElementById("defaultcontentformat-custom-wrapper").style.display =
        custom ? "block" : "none";
}

function initSettings() {
    loadAPIUrl().then((apiurl) => {
        loadAPIToken().then((apikey) => {
            document.getElementById("apiurl").value = apiurl || "";
            document.getElementById("apikey").value = apikey || "";
            if (apikey && apiurl) {
                fillAllProjectsSelect("defaultproject");
                fillAllAssigneesSelect("defaultassignee");
            }
        })
    });
    loadDefaultContentFormat().then((res) => {
        const element = document.getElementById("defaultcontentformat");
        element.value = res;
        if (element.value !== res) {
            element.value = "custom";
            document.getElementById("defaultcontentformat-custom").value = res;
        }
        updateCustomTaskFormat();
    });
    loadIncludeMessageBody().then((res) => {
        document.getElementById("include_message_body").checked = res;
    });
}

function hideSettings() {
    document.getElementById("popup-settings").style.display = "none";
    document.getElementById("popup-page").style.display = "block";
}

document.addEventListener("DOMContentLoaded", function () {
    document
        .getElementById("apiurl")
        .addEventListener("change", saveAndLoadProjects);
    document
        .getElementById("apiurl")
        .addEventListener("keyup", enableApplyToken);
    document
        .getElementById("apikey")
        .addEventListener("change", saveAndLoadProjects);
    document
        .getElementById("apikey")
        .addEventListener("keyup", enableApplyToken);
    document
        .getElementById("defaultproject")
        .addEventListener("change", saveSettings);
    document
        .getElementById("defaultassignee")
        .addEventListener("change", saveSettings);
    document
        .getElementById("tokenapplybutton")
        .addEventListener("click", applyToken);
    document
        .getElementById("defaultcontentformat")
        .addEventListener("change", saveSettings);
    document
        .getElementById("defaultcontentformat-custom")
        .addEventListener("change", saveSettings);
    document
        .getElementById("include_message_body")
        .addEventListener("change", saveSettings);

    document
        .getElementById("defaultcontentformat")
        .addEventListener("change", updateCustomTaskFormat);
    initSettings();
});
