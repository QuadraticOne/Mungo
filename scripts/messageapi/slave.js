class MessageAPISlave {
    /**
     * Create a message API slave from a function that, when
     * given an object, returns a different object.  The only
     * constraint is that the object must be serialisable.
     * @param {MessageAPISlave} self 
     * @param {function} responseFunction 
     */
    constructor(responseFunction) {
        this.responseFunction = responseFunction;

        var self = this;
        window.addEventListener("message", function(message) {
            self.respondTo(self, message)
        }, false);
    }

    /**
     * Determine the response to the given message and send it.
     * @param {object} message 
     */
    respondTo(self, message) {
        var response = {
            requestId: message.data.requestId,
            data: self.responseFunction(message.data.data)
        };
        message.source.postMessage(response, message.origin);
    }
}
