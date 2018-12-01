class SandboxedFunctionExternal {
    /**
     * Create a sandboxed function and add it to the page's sandboxed iframe.
     */
    constructor(parameterName) {
        this.iframeContainerId = "sandbox";
        this.iframe = null;

        this.parameterName = "x";
        this.functionBody = "return { };";
    }

    /**
     * Set up this sandboxed function.
     */
    start() {
        var iframeContainer = document.getElementById(this.iframeContainerId);
        var iframe = document.createElement("iframe");
        iframe.src = "../pages/sandbox.html";
        this.iframe = iframeContainer.appendChild(iframe);
    }

    /**
     * Remove the iframe corresponding to this function
     * from the sandbox.
     */
    kill() {
        this.iframe.parentElement.removeChild(this.iframe);
    }

    /**
     * Set the function body of the sandboxed function to
     * a new value.
     * @param {string} functionBody
     */
    setFunction(parameterName, functionBody) {
        this.parameterName = parameterName;
        this.functionBody = functionBody;
        var message = {
            compute: false,
            par: this.parameterName,
            body: this.functionBody
        }
        console.log(message); // DEBUG
        this.iframe.contentWindow.postMessage(message, "*");
    }

    /**
     * Compute the result of applying the current function
     * to the given datum, supplied as a JavaScript object.
     * @param {object} datum 
     * @param {function} callback
     */
    computeResult(datum, callback) {
        var message = {
            compute: true,
            datum: datum
        }
        window.addEventListener("message", callback, false);
        this.iframe.contentWindow.postMessage(message, "*");
    }
}
