class MappedDataset extends Dataset {
    /**
     * Create a dataset whose items are evaluated as a one-to-one mapping
     * from some source dataset via a transfer function.
     * @param {string} name 
     * @param {Dataset} parent 
     * @param {[Dataset]} children 
     * @param {Dataset} source 
     * @param {string} parameterName
     * @param {string} functionBody 
     */
    constructor(name, parent, children, source, parameterName, functionBody) {
        super(name, parent, children);

        this.source = null;
        this.setSource(source);

        this.parameterName = parameterName;
        this.functionBody = functionBody;

        this.guid = getWeakGuid();
        this.messenger = new MessageAPIMaster();
    }

    /**
     * Return the ith item in the dataset, evaluating this lazily
     * where possible.
     * @param {int} index 
     * @param {function} callback
     */
    getItem(index, callback) {
        self.source.getItem(index, function(sourceItem) {
            getSandboxedFunctionMessenger().sendRequest({
                requestType: "query",
                datum: sourceItem
            }, callback);
        });
    }

    /**
     * Count the items that are direct descendents of this dataset,
     * not counting any that belong to its children.
     * @param {function} callback
     */
    countDirectItems(callback) {
        this.source.countDirectItems(callback);
    }

    /**
     * Called when any of the predecessor datasets are updated; define
     * in this function how this dataset should react to the change.
     * @param {Dataset} predecessor 
     */
    predecessorUpdated(predecessor) {
        this.updated();
    }

    /**
     * Perform any internal updates necessary when this dataset changes.
     */
    selfUpdated() { }

    /**
     * Set the source to a new source and update this dataset as well
     * as its successors.
     * @param {Dataset} newSource 
     */
    setSource(newSource) {
        if (this.source !== null) {
            Dataset.removeDependency(this.source, this);
        }
        this.source = newSource;
        Dataset.createDependency(newSource, this);
        this.updated();
    }

    /**
     * Sets the function parameter name and string to new values.
     * @param {string} parameterName
     * @param {string} functionBody
     */
    setFunction(parameterName, functionBody) {
        this.parameterName = parameterName;
        this.functionBody = functionBody;
        getSandboxedFunctionMessenger().sendRequest({
            requestType: "update",
            guid: this.guid,
            parameterName: this.parameterName,
            functionBody: this.functionBody
        }, function(result) { });
    }
}
