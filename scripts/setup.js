window.onload = setup;

var mungo = {
    builderTypes: { }
};

var sandboxedFunctionMessenger = null;

function setup() {
    setupSandboxedFunctionMessenger();
    setupDatasets();
}

function addClickMethod(elementId, callback) {
    document.getElementById(elementId).addEventListener("click", callback);
}

function setupSandboxedFunctionMessenger() {
    sandboxedFunctionMessenger = new MessageAPIMaster(
        "sandboxedFunctionMaster", "../pages/sandboxedfunction.html");
    sandboxedFunctionMessenger.start();
}

function getSandboxedFunctionMessenger() {
    return sandboxedFunctionMessenger;
}

function setupDatasets() {
    mungo.datasetContainer = document.getElementById("datasetContainer");
}
