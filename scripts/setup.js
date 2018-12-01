window.onload = setup;

var sandboxedFunctionMessenger = null;

function setup() {
    setupSandboxedFunctionMessenger();
}

function addClickMethod(elementId, callback) {
    document.getElementById(elementId).addEventListener("click", callback);
}

function setupSandboxedFunctionMessenger() {
    sandboxedFunctionMessenger = new MessengerAPIMaster(
        "sandboxedFunctionMaster", "../pages/sandboxfunction.html");
    sandboxedFunctionMessenger.start();
}

function getSandboxedFunctionMessenger() {
    return sandboxedFunctionMessenger;
}
