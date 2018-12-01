class MessageAPIMaster {
    /**
     * Create the master of a message API, also creating the
     * iframe with which it will communicate.
     * @param {string} name 
     * @param {string} iframeSource 
     */
    constructor(name, iframeSource) {
        this.name = name;
        this.iframeSource = iframeSource;

        this.iframe = null;
        this.pendingRequests = {};
    }

    /**
     * Set up a connection between the master and the slave.
     */
    start() {
        this.iframe = document.createElement("iframe");
        this.iframe.id = this.name;
        this.iframe.src = this.iframeSource;
        this.iframe.style.display = "none";
        document.body.appendChild(this.iframe);

        var self = this;
        window.addEventListener("message", function(response) {
            self.handleResponse(self, response);
        }, false);
    }

    /**
     * Terminate the connection between the master and the slave.
     */
    kill() {
        this.iframe.parentElement.removeChild(this.iframe);
    }

    /**
     * Send a request to the slave, calling the specified
     * function on the returned data when it arrives.
     * @param {object} data 
     * @param {function} callback 
     */
    sendRequest(data, callback) {
        var requestId = getWeakGuid();
        this.pendingRequests[requestId] = callback;
        var message = {
            requestId: requestId,
            data: data
        }
        this.iframe.contentWindow.postMessage(message, "*");
    }

    /**
     * Handle a response from the slave.  If the request ID is
     * recognised, the pending request will be marked as resolved
     * and the callback will be executed on the response data.  If
     * the request ID is not recognised, it will be ignored.
     * @param {MessageAPIMaster} self 
     * @param {object} response 
     */
    handleResponse(self, response) {
        if (response.data.requestId) {
            if (self.pendingRequests[response.data.requestId]) {
                var callback = self.pendingRequests[response.data.requestId];
                delete self.pendingRequests[response.data.requestId];
                callback(response.data.data);
            }
        }
    }
}
