chrome.app.runtime.onLaunched.addListener(function() {
    chrome.app.window.create("pages/window.html", {
        state: "maximized",
        frame: {
            type: "chrome",
            color: "#273D45"
        }
    });
  });
