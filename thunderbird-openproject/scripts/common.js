function getSelectedProject(selectid) {
    const projects = document.getElementById(selectid);
    if (projects.options[projects.selectedIndex]) {
        return projects.options[projects.selectedIndex].value;
    }
    return "";
}

function getSelectedAssignee(selectid) {
    const assignees = document.getElementById(selectid);
    if (assignees.options[assignees.selectedIndex]) {
        return assignees.options[assignees.selectedIndex].value;
    }
    return "";
}

function fillAllProjectsSelect(selectid, selected) {
    loadDefaultProject().then((selected) => {
        getAllProjects()
            .then((projects) => {
                function process(proj, indent) {
                    let option = document.createElement("option");
                    let text = "";
                    for (let i = 0; i < indent; i++) {
                        text += "&nbsp;&nbsp;&nbsp;";
                    }
                    option.innerHTML = text + proj.name;
                    option.value = proj.id;
                    if (proj.id == selected) {
                        option.selected = true;
                    }
                    el.add(option);
                    proj.childs.forEach((child) => {
                        process(child, indent + 1);
                    });
                }
                const el = document.getElementById(selectid);
                el.innerHTML = "";
                projects.forEach((proj) => {
                    process(proj, 0);
                });
            })
            .catch((err) => {
                const el = document.getElementById(selectid);
                el.innerHTML =
                    '<option value="0">Could not connect to OpenProject...</option>';
            });
    });
}

function fillAllAssigneesSelect(selectid, selected) {
    loadDefaultAssignee().then((selected) => {
        getAllUsers()
            .then((users) => {
                function process(usr, indent) {
                    let option = document.createElement("option");
                    let text = "";
                    for (let i = 0; i < indent; i++) {
                        text += "&nbsp;&nbsp;&nbsp;";
                    }
                    option.innerHTML = text + usr.name;
                    option.value = usr.id;
                    if (usr.id == selected) {
                        option.selected = true;
                    }
                    el.add(option);
                }
                const el = document.getElementById(selectid);
                el.innerHTML = "";
                users.forEach((usr) => {
                    process(usr, 0);
                });
            })
            .catch((err) => {
                const el = document.getElementById(selectid);
                el.innerHTML =
                    '<option value="0">Could not connect to OpenProject...</option>';
            });
    });
}

function getDisplayedMessage() {
    return browser.tabs
        .query({
            active: true,
            currentWindow: true,
        })
        .then((tabs) =>
            browser.messageDisplay
                .getDisplayedMessage(tabs[0].id)
                .then((message) => [message, tabs[0].id])
        );
}

function findMessageBody(messageId) {
    function traversePart(part, contentType) {
        if (part.contentType.toLowerCase() === contentType) {
            return part.body;
        }
        for (currentPart of part.parts || []) {
            const result = traversePart(currentPart, contentType);
            if (result !== undefined) {
                return result;
            }
        }
    }

    return browser.messages
        .getFull(messageId)
        .then(
            (fullMessage) =>
                traversePart(fullMessage, "text/plain") ||
                traversePart(fullMessage, "text/html")
        );
}

function formatDefaultTaskContent(message) {
    function twoDigits(num) {
        if (num < 10) {
            return "0" + num;
        }
        return num;
    }

    return loadDefaultContentFormat().then((contentFormat) =>
        contentFormat
            .replace("%author%", message.author)
            .replace("%subject%", message.subject)
            .replace("%date-Y%", message.date.getFullYear())
            .replace("%date-M%", message.date.getMonth() + 1)
            .replace("%date-D%", message.date.getDate())
            .replace("%date-h%", message.date.getHours())
            .replace("%date-m%", message.date.getMinutes())
            .replace("%date-s%", message.date.getSeconds())
            .replace("%date-YYYY%", message.date.getFullYear())
            .replace("%date-MM%", twoDigits(message.date.getMonth() + 1))
            .replace("%date-DD%", twoDigits(message.date.getDate()))
            .replace("%date-hh%", twoDigits(message.date.getHours()))
            .replace("%date-mm%", twoDigits(message.date.getMinutes()))
            .replace("%date-ss%", twoDigits(message.date.getSeconds()))
            .replace("%msgid%", message.headerMessageId)
    );
}

function addTaskFromMessage(contentid, projectselector, assigneeselector, includebodyid, failid) {
    const content = document.getElementById(contentid).value;
    const project = getSelectedProject(projectselector);
    const assignee = getSelectedAssignee(assigneeselector);
    const includeMessageBody = includebodyid
        ? document.getElementById(includebodyid).checked
        : false;
    Promise.resolve()
        .then(() => {
            if (includeMessageBody) {
                return getDisplayedMessage().then(([message]) =>
                    findMessageBody(message.id)
                );
            } else {
                return "";
            }
        })
        .then((messageContent) => addTask(content, project, assignee, messageContent))
        .then((res) => {
            window.close();
        })
        .catch((err) => {
            document.getElementById(failid).innerHTML = "Adding Task failed...";
        });
}
