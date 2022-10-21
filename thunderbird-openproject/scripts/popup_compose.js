function messageAddTask() {
    addTaskFromMessage(
        "task_content",
        "task_project",
        "task_assignee",
        undefined,
        "task_add"
    );
}

function prefillContent() {
    fillAllProjectsSelect("task_project");
    fillAllAssigneesSelect("task_assignee");
}

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("task_add").addEventListener("click", messageAddTask);
    showSettingsIfNecessary();
    prefillContent();
});
