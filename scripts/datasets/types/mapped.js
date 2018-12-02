class MappedDataset extends Dataset {
    /**
     * Create a dataset whose items are evaluated as a one-to-one mapping
     * from some source dataset via a transfer function.
     * @param {string} name 
     * @param {Dataset} parent 
     * @param {[Dataset]} children 
     * @param {Dataset} source 
     * @param {string} guid
     */
    constructor(name, parent, children, source, guid) {
        super(name, parent, children);

        this.source = null;
        this.setSource(source);

        this.parameterName = "x";
        this.functionBody = "return x;";

        this.guid = guid;
        this.messenger = getSandboxedFunctionMessenger();
    }

    /**
     * Return the ith item in the dataset, evaluating this lazily
     * where possible.
     * @param {int} index 
     * @param {function} callback
     */
    getItem(index, callback) {
        var self = this;
        self.source.getItem(index, function(sourceItem) {
            self.messenger.sendRequest({
                requestType: "query",
                guid: self.guid,
                datum: sourceItem
            }, result => callback(result.content));
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
        var self = this;
        self.parameterName = parameterName;
        self.functionBody = functionBody;
        self.messenger.sendRequest({
            requestType: "update",
            guid: self.guid,
            parameterName: self.parameterName,
            functionBody: self.functionBody
        }, function(result) { });
        self.updated();
    }

    /**
     * Kill the dataset, removing its sandboxed function to free
     * up space.
     */
    kill() {
        this.messenger.sendRequest({
            requestType: "delete",
            guid: this.guid
        }, function(result) { });
    }
}

/**
 * Map a dataset, but not its children, to a new dataset according
 * to some transfer function.
 * @param {string} name 
 * @param {Dataset} parent 
 * @param {Dataset} source 
 * @param {string} parameterName 
 * @param {string} functionBody 
 */
function mappedDataset(name, parent, source, parameterName, functionBody) {
    return recursivelyMappedDataset(name, parent, source, parameterName,
        functionBody, 0);
}

/**
 * Map a dataset, and its children up to the given depth, to a new
 * dataset according to some transfer function.  To map all children
 * regardless of depth, set `recursionDepth` to -1.
 * @param {string} name 
 * @param {Dataset} parent 
 * @param {Dataset} source 
 * @param {string} parameterName 
 * @param {string} functionBody 
 * @param {int} recursionDepth 
 * @param {string?} guid
 */
function recursivelyMappedDataset(name, parent, source, parameterName,
        functionBody, recursionDepth, guid = null) {
    var datasetGuid = guid === null ? getWeakGuid() : guid;
    var mappedChildren = [];
    if (recursionDepth !== 0) {
        for (var i = 0; i < source.children.length; i++) {
            mappedChildren.push(recursivelyMappedDataset(
                name + "-mapped-" + source.children[i].name,
                null, source.children[i], parameterName, functionBody,
                recursionDepth - 1, datasetGuid));
        }
    }

    var topLevel = new MappedDataset(name, parent, [], source, datasetGuid);
    topLevel.setFunction(parameterName, functionBody);
    for (var i = 0; i < mappedChildren.length; i++) {
        mappedChildren[i].setParent(topLevel);
        // Children are also dependent on the parent because they
        // are using the same function
        Dataset.createDependency(topLevel, mappedChildren[i]);
    }
    return topLevel;
}
