class FilteredDataset extends Dataset {
    /**
     * Create a dataset which takes only those items from its source dataset
     * that satisfy a given predicate.
     * @param {string} name 
     * @param {Dataset} parent 
     * @param {[Dataset]} children 
     * @param {Dataset} source 
     * @param {string} parameterName 
     * @param {string} predicateBody 
     */
    constructor(name, parent, children, source, parameterName, predicateBody) {
        super(name, parent, children);

        this.source = null;
        this.setSource(source);

        this.parameterName = parameterName;
        this.predicateBody = predicateBody;

        this.guid = getWeakGuid();
        this.messenger = getSandboxedFunctionMessenger();

        this.includedIndices = [];
        this.nextIndex = 0;

        this.setPredicate(this.parameterName, this.predicateBody);
    }

    /**
     * Get the ith item in the dataset, evaluating this lazily
     * where possible, and perform some action with the result.
     * @param {int} index 
     * @param {function} callback
     */
    getItem(index, callback) {
        var self = this;
        var quantityToFind = 0;
        if (self.includedIndices.length < index + 1) {
            var quantityToFind = index - self.includedIndices.length + 1;
        }
        self.findIncludedIndices(self, quantityToFind,
            () => self.source.getItem(self.includedIndices[index], callback));
    }

    /**
     * Count the items that are direct descendents of this dataset,
     * not counting any that belong to its children, and perform
     * some action with the result.
     * @param {function} callback
     */
    countDirectItems(callback) {
        var self = this;
        self.findIncludedIndices(self, -1, () => callback(self.includedIndices.length));
    }

    /**
     * Called when any of the predecessor datasets are updated; define
     * in this function how this dataset should react to the change.
     * @param {Dataset} predecessor 
     */
    predecessorUpdated(predecessor) {
        if (predecessor === this.source) {
            this.includedIndices = [];
            this.nextIndex = 0;
        }
    }

    /**
     * Perform any internal updates necessary when this dataset changes.
     */
    selfUpdated() { 
        this.includedIndices = [];
        this.nextIndex = 0;
    }

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
     * Sets the predicate parameter name and string to new values.
     * @param {string} parameterName
     * @param {string} predicateBody
     */
    setPredicate(parameterName, predicateBody) {
        var self = this;
        self.parameterName = parameterName;
        self.predicateBody = predicateBody;
        self.messenger.sendRequest({
            requestType: "update",
            guid: self.guid,
            parameterName: self.parameterName,
            functionBody: self.predicateBody
        }, function(result) { });
        self.updated();
    }

    /**
     * Go through the source dataset, picking only those elements that satisfy
     * the predicate, until either there are no more elements in the source
     * dataset or the quantity that have been found equals the second argument
     * of this function.  To find all applicable elements from the source, set
     * the quantity to find to -1.
     * @param {FilteredDataset} self 
     * @param {int} quantityToFind 
     * @param {function} callback
     */
    findIncludedIndices(self, quantityToFind, callback) {
        if (quantityToFind !== 0) {
            self.source.countDirectItems(function(sourceSize) {
                if (sourceSize > self.nextIndex) {
                    self.checkNextItem(self, quantityToFind, callback);
                } else {
                    callback();
                }
            });
        } else {
            callback();
        }
    }

    /**
     * Send a request to the sandboxed function to determine whether the next
     * element from the source dataset satisfies the predicate, and add its
     * index to the list of included indices if so.  Then continues to search
     * for elements until either there are no more, or `quantityToFind` equals
     * zero.
     * @param {FilteredDataset} self 
     * @param {int} quantityToFind 
     * @param {function} callback
     */
    checkNextItem(self, quantityToFind, callback) {
        self.source.getItem(self.nextIndex, function(item) {
            self.messenger.sendRequest({
                requestType: "query",
                guid: self.guid,
                datum: item
            }, function(result) {
                self.nextIndex += 1;
                if (result.content === true) {
                    self.includedIndices.push(self.nextIndex - 1);
                    self.findIncludedIndices(self, quantityToFind - 1, callback);
                } else {
                    self.findIncludedIndices(self, quantityToFind, callback);
                }
            });
        })
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
 * Filter a dataset, but not its children, to a new dataset according
 * to some predicate.
 * @param {string} name 
 * @param {Dataset} parent 
 * @param {Dataset} source 
 * @param {string} parameterName 
 * @param {string} predicateBody 
 */
function filteredDataset(name, parent, source, parameterName, predicateBody) {
    return recursivelyFilteredDataset(name, parent, source, parameterName,
        predicateBody, 0);
}

/**
 * Filter a dataset, and its children up to the given depth, to a new
 * dataset according to some predicate.  To filter all children
 * regardless of depth, set `recursionDepth` to -1.
 * @param {string} name 
 * @param {Dataset} parent 
 * @param {Dataset} source 
 * @param {string} parameterName 
 * @param {string} predicateBody 
 * @param {int} recursionDepth 
 */
function recursivelyFilteredDataset(name, parent, source, parameterName,
        predicateBody, recursionDepth) {
    var filteredChildren = [];
    if (recursionDepth !== 0) {
        for (var i = 0; i < source.children.length; i++) {
            filteredChildren.push(recursivelyFilteredDataset(
                name + "-filtered-" + source.children[i].name,
                null, source.children[i], parameterName, predicateBody,
                recursionDepth - 1));
        }
    }

    var topLevel = new FilteredDataset(name, parent, [], source,
        parameterName, predicateBody);    
    for (var i = 0; i < filteredChildren.length; i++) {
        filteredChildren[i].setParent(topLevel);
    }
    return topLevel;
}
