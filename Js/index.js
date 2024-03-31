document.addEventListener("DOMContentLoaded", function() {
    const projectsList = document.getElementById("projects-list");
    const completedProjectsList = document.getElementById("completed-projects");
    const binSection = document.getElementById("bin-section");
    const addProjectBtn = document.getElementById("add-project-btn");
    const projectForm = document.getElementById("project-form");
    const projectNameInput = document.getElementById("project-name");
    const dueDateInput = document.getElementById("due-date");
    const dueTimeInput = document.getElementById("due-time");
    const saveProjectBtn = document.getElementById("save-project-btn");
    const cancelProjectBtn = document.getElementById("cancel-project-btn");

    let projects = [];
    let completedProjects = [];
    let deletedProjects = [];

    // Loading projects from localStorage
    if (localStorage.getItem('projects')) {
        projects = JSON.parse(localStorage.getItem('projects'));
        renderProjects();
    }

    // Load completed projects from localStorage
    if (localStorage.getItem('completedProjects')) {
        completedProjects = JSON.parse(localStorage.getItem('completedProjects'));
        renderCompletedProjects();
    }

    // Load deleted projects from localStorage
    if (localStorage.getItem('deletedProjects')) {
        deletedProjects = JSON.parse(localStorage.getItem('deletedProjects'));
        renderDeletedProjects();
    }

    // Function to render projects
    function renderProjects() {
        projectsList.innerHTML = "";
        projects.forEach((project, index) => {
            const projectItem = createProjectElement(project, index);
            projectsList.appendChild(projectItem);
        });
    }

    // Function to render completed projects
    function renderCompletedProjects() {
        completedProjectsList.innerHTML = "";
        completedProjects.forEach((project, index) => {
            const projectItem = createProjectElement(project, index, true);
            completedProjectsList.appendChild(projectItem);
        });
    }

    // Function to render deleted projects
function renderDeletedProjects() {
    binSection.style.display = deletedProjects.length > 0 ? "block" : "none";
    const deletedProjectsList = document.getElementById("deleted-projects");
    deletedProjectsList.innerHTML = "";
    deletedProjects.forEach((project, index) => {
        const projectItem = createProjectElement(project, index, true, true);
        deletedProjectsList.appendChild(projectItem);
    });
}

// Add event listener to toggle completed projects section
const toggleCompletedProjectsBtn = document.getElementById("toggle-completed-projects");
const completedProjectsSection = document.getElementById("deleted-projects");
const chevronIcon = toggleCompletedProjectsBtn.querySelector("i");

// Initially, hide the completed projects section and set the chevron icon accordingly
completedProjectsSection.style.display = "none";
chevronIcon.classList.add("bx-chevron-right");

toggleCompletedProjectsBtn.addEventListener("click", function() {
    if (completedProjectsSection.style.display === "none") {
        completedProjectsSection.style.display = "block";
        chevronIcon.classList.replace("bx-chevron-right", "bx-chevron-down");
    } else {
        completedProjectsSection.style.display = "none";
        chevronIcon.classList.replace("bx-chevron-down", "bx-chevron-right");
    }
});


    // Function to create project element
function createProjectElement(project, index, completed = false, deleted = false) {
    const projectItem = document.createElement("div");
    const dueDate = new Date(project.dueDateTime);
    const formattedDate = dueDate.toLocaleDateString();
    const formattedTime = dueDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // apply styles
    projectItem.style.display = "flex";
    projectItem.style.justifyContent = "space-between";
    projectItem.style.alignItems = "center";
    // projectItem.style.borderTop = "0.1px solid #5dbde";
    projectItem.style.borderBottom = "1px solid #5dbde3";
    projectItem.style.padding = "17px";

    projectItem.innerHTML = `
        <div style="flex: 1;">${project.name}</div>
        <div style="flex-shrink: 0; margin-left: 20px;">${formattedDate}</div>
        <div style="flex-shrink: 0; margin-left: 20px;">${formattedTime}</div>
        <div style="flex-shrink: 0;">
            ${deleted || completed ? '' : `<button class="delete-project-btn" data-index="${index}" style="margin-left: 20px;">Delete</button>`}
            ${deleted ? `<button class="restore-project-btn" data-index="${index}">Restore</button>` : ''}
        </div>
    `;

    return projectItem;
}

    // show project form
    function showProjectForm() {
        projectForm.style.display = "block";
    }

    // hide project form
    function hideProjectForm() {
        projectForm.style.display = "none";
        projectNameInput.value = "";
        dueDateInput.value = "";
        dueTimeInput.value = "";
    }

    // Event listener for add project button
    addProjectBtn.addEventListener("click", function() {
        showProjectForm();
    });

    // Event listener for save project button
    saveProjectBtn.addEventListener("click", function() {
        const projectName = projectNameInput.value.trim();
        const dueDate = dueDateInput.value.trim();
        const dueTime = dueTimeInput.value.trim();
        if (projectName !== "" && dueDate !== "" && dueTime !== "") {
            const dueDateTime = new Date(`${dueDate}T${dueTime}`).toISOString();
            projects.push({ name: projectName, dueDateTime: dueDateTime });
            localStorage.setItem('projects', JSON.stringify(projects));
            renderProjects();
            hideProjectForm();
        }
    });

    // Event listener for cancel project button
    cancelProjectBtn.addEventListener("click", function() {
        hideProjectForm();
    });

    // Event delegation for delete project button
    projectsList.addEventListener("click", function(event) {
        if (event.target.classList.contains("delete-project-btn")) {
            const index = event.target.dataset.index;
            deletedProjects.push(projects[index]);
            projects.splice(index, 1);
            localStorage.setItem('projects', JSON.stringify(projects));
            localStorage.setItem('deletedProjects', JSON.stringify(deletedProjects));
            renderProjects();
            renderDeletedProjects();
        }
    });

    // Event delegation for restore project button
    binSection.addEventListener("click", function(event) {
        if (event.target.classList.contains("restore-project-btn")) {
            const index = event.target.dataset.index;
            projects.push(deletedProjects[index]);
            deletedProjects.splice(index, 1);
            localStorage.setItem('projects', JSON.stringify(projects));
            localStorage.setItem('deletedProjects', JSON.stringify(deletedProjects));
            renderProjects();
            renderDeletedProjects();
        }
    });

    // Event delegation for complete project button
    projectsList.addEventListener("click", function(event) {
        if (event.target.classList.contains("complete-project-btn")) {
            const index = event.target.dataset.index;
            const completedProject = projects.splice(index, 1)[0];
            completedProjects.push(completedProject);
            localStorage.setItem('projects', JSON.stringify(projects));
            localStorage.setItem('completedProjects', JSON.stringify(completedProjects));
            renderProjects();
            renderCompletedProjects();
        }
    });
});
