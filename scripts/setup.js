window.onload = setup;

var mungo = {
    builderTypes: { },
    panels: { }
};

var sandboxedFunctionMessenger = null;

function setup() {
    setupSandboxedFunctionMessenger();
    setupDatasets();
    setupWindow();
    setupDebugging();
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
    mungo.panels.activeDatasets = document.getElementById("activeDatasets");
}

function setupWindow() {
    var taskbarHeight = 48;
    var window = document.getElementById("window");
    window.style.width = (screen.width).toString() + "px";
    window.style.height = (screen.height - taskbarHeight).toString() + "px";
}

function setupDebugging() {
    dsp = new LiteralDataset("Parent", null, [], range(10));
    dsc = new LiteralDataset("Child", null, [], range(15));
    dsc.setParent(dsp);

    dsp.getSummaryData(dsp,
        result => interfaceUnit(result, mungo.panels.activeDatasets));
}
