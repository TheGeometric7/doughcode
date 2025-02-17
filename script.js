document.addEventListener("DOMContentLoaded", () => {
    const fileList = document.getElementById("file-list");
    const codeArea = document.getElementById("code-area");
    const previewWindow = document.getElementById("preview-window").contentWindow.document;
    const consoleOutput = document.getElementById("console-output");
    const runButton = document.getElementById("run-button");
    const saveButton = document.getElementById("save-button");
    const loadButton = document.getElementById("load-button");
    const addFileButton = document.getElementById("add-file-button");
    const renameFileButton = document.getElementById("rename-file-button");
    const deleteFileButton = document.getElementById("delete-file-button");
    const logo = `<svg id="eSd75kr631n1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" width="300px" height="300px"><path style="fill: rgba(0, 0, 0, 0); stroke: rgb(204, 204, 204); stroke-width: 8px;" transform="translate(150, 150)" d="M 83.547 -70.022 C 83.547 -70.022 62.257 -79.734 49.444 -82.536 C 34.993 -85.915 16.553 -89.31 -2.216 -86.699 C -25.252 -83.494 -59.234 -70.761 -76.818 -59.013 C -89.026 -50.856 -97.615 -41.026 -102.911 -30.9 C -107.481 -22.163 -108.806 -12.353 -109.023 -3.003 C -109.24 6.363 -107.879 16.588 -104.195 25.249 C -100.419 34.128 -94.149 43.348 -86.325 49.5 C -78.046 56.01 -66.598 59.718 -55.217 62.541 C -42.503 65.694 -28.507 66.436 -13.289 66.294 C 4.933 66.124 30.491 63.592 46.718 59.788 C 58.339 57.064 67.817 54.55 75.772 49.099 C 83.175 44.026 90.355 37.25 93.488 28.975 C 97.006 19.682 96.424 5.598 93.552 -4.833 C 90.702 -15.186 83.539 -25.428 76.45 -33.414 C 69.655 -41.069 51.798 -46.29 52.237 -52.133 C 52.716 -58.505 81.643 -68.741 84.037 -69.836 C 84.329 -69.97 84.547 -70.022 84.547 -70.022"/><text style="fill: rgb(204, 204, 204); font-family: Arial, sans-serif; font-size: 70px; font-weight: 900; white-space: pre;" x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"><tspan>&lt;/&gt;</tspan></text></svg>`;
    let files = [];
    let currentFile = null;
    if (previewWindow.body.innerHTML.trim() === "") {
        previewWindow.body.innerHTML = `<div style="display: flex; justify-content: center; align-items: center; height: 100%; background-color: #000;">${logo}</div>`;
    }
    function notification(type, text) {
        if (type === "alert") {
            alert(text);
            return;
        }
    }
    addFileButton.addEventListener("click", () => {
        const fileName = prompt("Enter File Name:");
        if (fileName) {
            const file = { name: fileName, content: "" };
            files.push(file);
            renderFileList();
            switchFile(file);
        }
    });
    renameFileButton.addEventListener("click", () => {
        if (currentFile) {
            const newName = prompt("Enter new file name:", currentFile.name);
            if (newName) {
                currentFile.name = newName;
                renderFileList();
            }
        } else {
            notification("alert", "No file selected.");
        }
    });
    deleteFileButton.addEventListener("click", () => {
        if (currentFile) {
            const confirmDelete = confirm(`Are you sure you want to delete ${currentFile.name}?`);
            if (confirmDelete) {
                files = files.filter(file => file !== currentFile);
                if (files.length > 0) {
                    switchFile(files[0]);
                } else {
                    currentFile = null;
                    codeArea.value = "";
                }
                renderFileList();
            }
        } else {
            notification("alert", "No file selected.");
        }
    });
    function renderFileList() {
        fileList.innerHTML = "";
        files.forEach((file, index) => {
            const fileTab = document.createElement("div");
            fileTab.textContent = file.name;
            fileTab.addEventListener("click", () => switchFile(file));
            if (file === currentFile) {
                fileTab.classList.add("active");
            }
            fileList.appendChild(fileTab);
        });
    }
    function switchFile(file) {
        currentFile = file;
        codeArea.value = file.content;
        renderFileList();
    }
    codeArea.addEventListener("input", () => {
        currentFile.content = codeArea.value;
    });
    runButton.addEventListener("click", () => {
        const htmlFile = files.find(file => file.name.endsWith(".html"));
        const cssFile = files.find(file => file.name.endsWith(".css"));
        const jsFile = files.find(file => file.name.endsWith(".js"));
        previewWindow.open();
        previewWindow.write(`
            <!DOCTYPE html>
            <html>
                <head>
                    <style>${cssFile ? cssFile.content : ""}</style>
                </head>
                <body>
                    ${htmlFile ? htmlFile.content : ""}
                    <script>${jsFile ? jsFile.content : ""}</script>
                </body>
            </html>
        `);
        previewWindow.close();
    });
    saveButton.addEventListener("click", () => {
        localStorage.setItem("project", JSON.stringify(files));
        consoleOutput.innerHTML = "Project saved to Local Storage.";
    });
    loadButton.addEventListener("click", () => {
        const savedProject = localStorage.getItem("project");
        if (savedProject) {
            files = JSON.parse(savedProject);
            renderFileList();
            switchFile(files[0]);
            consoleOutput.innerHTML = "Project loaded from Local Storage.";
        } else {
            consoleOutput.innerHTML = "No project found in Local Storage.";
        }
    });
    (function() {
        const oldLog = console.log;
        console.log = function(message) {
            consoleOutput.innerHTML += `<div>${message}</div>`;
            oldLog.apply(console, arguments);
        };
    })();
});