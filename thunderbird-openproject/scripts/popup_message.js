function messageAddTask() {
    addTaskFromMessage(
        "task_content",
        "task_project",
        "task_assignee",
        "include_message_body",
        "task_add"
    );
}

function prefillContent() {
    fillAllProjectsSelect("task_project");
    fillAllAssigneesSelect("task_assignee");
    loadIncludeMessageBody().then((res) => {
        document.getElementById("include_message_body").checked = res;
    });
    getDisplayedMessage()
        .then(([message, tabId]) => {
            return formatDefaultTaskContent(message);
        })
        .then((defaultTaskContent) => {
            document.getElementById("task_content").value = defaultTaskContent;
        });
}

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("task_add").addEventListener("click", messageAddTask);
    showSettingsIfNecessary();
    prefillContent();
});
