async function doRequest(endpoint, config) {
    let apiurl = await loadAPIUrl();
    let apikey = await loadAPIToken();

    var credentials = btoa("apikey:" + apikey);
    config.headers = {
        Authorization: "Basic " + credentials,
    };
    if (config.body) {
        config.headers["Content-Type"] = "application/json";
    }

    // This could be split up into sequential async code as well.
    return window
        .fetch(apiurl + endpoint, config)
        .then((res) => {
            if (!res.ok) {
                console.log("Error with request to " + endpoint + ": ", res);
                return Promise.reject();
            }
            return res.json();
        });
}

function requestGet(endpoint) {
    return doRequest(endpoint, { method: "get" });
}

function requestPost(endpoint, data) {
    return doRequest(endpoint, { method: "post", body: JSON.stringify(data) });
}

function compareNames(a, b) {
    if (a.name < b.name) {
        return -1;
    }
    if (a.name > b.name) {
        return 1;
    }
    return 0;
}


function getAllProjects() {
    return requestGet("/api/v3/projects").then((res) => {
        let projects = {};
        let roots = [];
        res._embedded.elements.forEach((proj) => {
            projects[proj.id] = proj;
            proj.childs = [];
        });
        res._embedded.elements.forEach((proj) => {
            if (proj._links.parent.href) {
                const projhref = proj._links.parent.href.split("/");
                projects[projhref[4]].childs.push(proj);
            } else {
                roots.push(proj);
            }
        });
        return roots.sort(compareNames);
    });
}

function getAllUsers() {
    return requestGet("/api/v3/users").then((res) => {
        let users = [];
        res._embedded.elements.forEach((usr) => {
            users.push(usr);
        });
        return users.sort(compareNames);
    });
}

function addTask(content, projectid, assigneeid, messageContent) {
    return requestPost("/api/v3/work_packages", {
        "subject": content,
        "description": {
            "format": "textile",
            "raw": messageContent
            // "html": messageContent
        },
        "_links": {
            "type": {
                "href": "/api/v3/types/1",
                "title": "Task"
            },
            "status": {
                "href": "/api/v3/statuses/1",
                "title": "New"
            },
            "priority": {
                "href": "/api/v3/priorities/8",
                "title": "Normal"
            },
            "assignee": {
                "href": "/api/v3/users/" + parseInt(assigneeid, 10),
            },
            "project": {
                "href": "/api/v3/projects/" + parseInt(projectid, 10),
            },
            "category": {
                "href": "/api/v3/categories/3",
                "title": "From email"
            }
        }
    });


}
