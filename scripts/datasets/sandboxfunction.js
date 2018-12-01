new MessageAPISlave(new SandboxFunction().response);

class SandboxFunction {
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
     * @param {string} guid 
     * @param {string} parameterName 
     * @param {string} functionBody 
     */
    updateFunction(guid, parameterName, functionBody) {
        this.functions[guid] = new Function(parameterName, functionBody);
    }

    /**
     * Delete any function associated with the given GUID.
     * @param {string} guid 
     */
    deleteFunction(guid) {
        delete this.functions[guid];
    }

    /**
     * Return the response of the function, as specified by the
     * given GUID, when applied to the input data.
     * @param {string} guid 
     * @param {object} datum
     */
    query(guid, datum) {
        return this.functions[guid](datum);
    }

    /**
     * Return the response of the function, as specified by the
     * given GUID, when applied elementwise to each object in the
     * input list.
     * @param {string} guid 
     * @param {[object]} data 
     */
    queryMany(guid, data) {
        return data.map(this.functions[guid]);
    }

    /**
     * Return a response to the given request.
     */
    response(data) {
        switch (data.requestType) {
            case "update":
            case "create":
                this.updateFunction(data.guid,
                    data.parameterName, data.functionBody);
                return { success: true };
            case "delete":
                this.deleteFunction(data.guid);
                return { success: true };
            case "query":
                return this.query(data.guid, data.datum);
            case "queryMany":
                return this.queryMany(data.guid, data.data);
            default:
                console.error("Unrecognised response type.");
                return { success: false };
        }
    }
}
