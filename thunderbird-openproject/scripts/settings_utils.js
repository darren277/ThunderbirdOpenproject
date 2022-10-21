function loadAPIUrl() {
    return browser.storage.local.get("apiurl").then((res) => res.apiurl);
}

function loadAPIToken() {
    return browser.storage.local.get("apikey").then((res) => res.apikey);
}

function loadDefaultProject() {
    return browser.storage.local
        .get("defaultproject")
        .then((res) => res.defaultproject);
}

function loadDefaultAssignee() {
    return browser.storage.local
        .get("defaultassignee")
        .then((res) => res.defaultassignee);
}

function loadDefaultContentFormat() {
    return browser.storage.local
        .get("defaultcontentformat")
        .then((res) => res.defaultcontentformat || "Mail by %author%: %subject%");
}

function loadIncludeMessageBody() {
    return browser.storage.local
        .get("includeMessageBody")
        .then((res) => res.includeMessageBody === "1");
}

function showSettingsIfNecessary() {
    loadAPIUrl().then((apiurl) => {
        loadAPIToken().then((token) => {
            if (!token || token.length < 40 || !apiurl || apiurl < 10) {
                // TODO does not work...
                browser.runtime.openOptionsPage();
            }
        })
    });
}
