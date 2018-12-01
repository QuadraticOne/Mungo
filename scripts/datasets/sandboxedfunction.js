var sandboxedFunction = null;
var sandboxedFunctionSlave = null;

class SandboxedFunction {
    /**
     * Class which maintains a list of functions, each referenced
     * by a GUID, allowing them to be dynamically updated and queried.
     */
    constructor() {
        this.functions = {};
    }

    /**
     * Update the function referenced by the given GUID to have
     * a new parameter name and/or function body.  If no function
     * exists for that GUID, a new entry will be created.
     * @param {SandboxedFunction} self
     * @param {string} guid 
     * @param {string} parameterName 
     * @param {string} functionBody 
     */
    updateFunction(self, guid, parameterName, functionBody) {
        self.functions[guid] = new Function(parameterName, functionBody);
    }

    /**
     * Delete any function associated with the given GUID.
     * @param {SandboxedFunction} self
     * @param {string} guid 
     */
    deleteFunction(self, guid) {
        delete self.functions[guid];
    }

    /**
     * Return the response of the function, as specified by the
     * given GUID, when applied to the input data.
     * @param {SandboxedFunction} self
     * @param {string} guid 
     * @param {object} datum
     */
    query(self, guid, datum) {
        return self.functions[guid](datum);
    }

    /**
     * Return the response of the function, as specified by the
     * given GUID, when applied elementwise to each object in the
     * input list.
     * @param {SandboxedFunction} self
     * @param {string} guid 
     * @param {[object]} data 
     */
    massQuery(self, guid, data) {
        return data.map(self.functions[guid]);
    }

    /**
     * Return a response to the given request.
     * @param {SandboxedFunction} self 
     * @param {object} data 
     */
    response(self, data) {
        switch (data.requestType) {
            case "update":
            case "create":
                self.updateFunction(self, data.guid,
                    data.parameterName, data.functionBody);
                return { success: true };
            case "delete":
                self.deleteFunction(self, data.guid);
                return { success: true };
            case "query":
                var result = {
                    content: self.query(self, data.guid, data.datum),
                    success: true
                }
                return result;
            case "massQuery":
                var result = {
                    content: self.massQuery(self, data.guid, data.data),
                    success: true
                };
                return result;
            default:
                console.error("Unrecognised response type.");
                return { success: false };
        }
    }
}

sandboxedFunction = new SandboxedFunction();
sandboxedFunctionSlave = new MessageAPISlave(
    data => sandboxedFunction.response(sandboxedFunction, data));
