window.onload = setup;

function setup() {
    document.getElementById("testLog").addEventListener("click", testLog);
}

function testLog() {
    console.log("Console test");
}