window.onload = setup;

var sandboxedFunctionMessenger = null;

function setup() {
    setupSandboxedFunctionMessenger();
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
