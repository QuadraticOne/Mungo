class Dataset {
    /**
     * Abstract class defining the required behaviour of a Dataset.
     * @param {string} name 
     * @param {Dataset} parent
     * @param {[Dataset]} children 
     */
    constructor(name, parent, children) {
        this.name = name;

        this.parent = null;
        this.setParent(parent);

        this.children = children;

        this.predecessors = [];
        this.successors = [];
    }

    /**
     * Calculate the generation of the dataset.  This is 0 for a dataset
     * which has no parent, and increments by 1 for each generation of
     * children beneath it.
     */
    generation() {
        if (this.parent === null) {
            return 0;
        } else {
            return 1 + this.parent.generation();
        }
    }

    /**
     * Remove the parent dataset from this dataset, and also remove this
     * dataset from the parent's list of children.  Will not cause an
     * error if this dataset has no parent.
     */
    removeParent() {
        if (parent !== null) {
            var i = this.parent.children.indexOf(this);
            if (i !== -1) {
                this.parent.children.splice(i, 1);
            }
            this.parent = null;
        }
    }

    /**
     * Sets the parent of this dataset and adds this dataset to the list
     * of children of the new parent.
     * @param {Dataset} dataset 
     */
    setParent(dataset) {
        if (dataset !== null) {
            this.parent = dataset;
            this.parent.children.push(this);
        }
    }

    /**
     * Get the ith item in the dataset, evaluating this lazily
     * where possible, and perform some action with the result.
     * @param {int} index 
     * @param {function} callback
     */
    getItem(index, callback) {
        console.error("Dataset.getItem not implemented.");
    }

    /**
     * Count the items that are direct descendents of this dataset,
     * not counting any that belong to its children, and perform
     * some action with the result.
     * @param {function} callback
     */
    countDirectItems(callback) {
        console.error("Dataset.countItems not implemented.");
    }

    /**
     * Called when any of the predecessor datasets are updated; define
     * in this function how this dataset should react to the change.
     * @param {Dataset} predecessor 
     */
    predecessorUpdated(predecessor) {
        console.error("Dataset.predecessorUpdated not implemented.");
    }

    /**
     * Perform any internal updates necessary when this dataset changes.
     */
    selfUpdated() {
        console.error("Dataset.selfUpdated not implemented.");
    }

    /**
     * Called to make any internal changes needed when the dataset is
     * updated, and notifies any successors that they may also need to
     * be updated.
     */
    updated() {
        this.selfUpdated();
        for (var i = 0; i < this.successors.length; i++) {
            this.successors[i].predecessorUpdated(this);
        }
    }

    /**
     * Count the items belonging to this dataset and its children and
     * then perform some action with the result.
     * @param {function} callback
     */
    countItems(callback) {
        var self = this;
        getters = range(self.children.length).map(
            cb => (i => self.children[i].countItems(cb)));
        getters.push(cb => self.countDirectItems(cb));
        new CallbackAccumulator(getters).execute(function(counts) {
            var sum = 0;
            for (var i = 0; i < counts.length; i++) {
                sum += counts[i];
            }
            callback(sum);
        });
    }

    /**
     * Retrieve all items belonging directly to the dataset and, optionally,
     * to its children as well, collate them into a single array, and then
     * perform an action on the result.
     * @param {bool} includeChildren
     * @param {function} callback
     */
    getItems(includeChildren, callback) {
        var self = this;
        if (self.children.length === 0 || !includeChildren) {
            self.getDirectItems(callback);
        } else {
            new CallbackAccumulator([self.getDirectItems, self.getChildItems])
                .execute(results => callback(flatten(results)));
        }
    }

    /**
     * Get the items that belong directly to this dataset, as opposed to
     * one of its children, collate them into an array, and perform an
     * action on the results.
     * @param {function} callback 
     */
    getDirectItems(callback) {
        var self = this;
        self.countDirectItems(function(nDirectItems) {
            var directItemGetters = range(nDirectItems).map(
                cb => (i => self.getItem(i, cb)));
            new CallbackAccumulator(directItemGetters).execute(callback);
        });
    }
    
    /**
     * Flatten the items of all children into one list and perform an
     * action on the result.
     * @param {bool} includeGrandchildren
     * @param {function} callback 
     */
    getChildItems(includeGrandchildren, callback) {
        var self = this;
        var childItemGetters = range(self.children.length).map(
            cb => (i => self.children[i].getItems(includeGrandchildren, cb)));
        new CallbackAccumulator(childItemGetters).execute(
            results => callback(flatten(results)));
    }

    /**
     * Register another dataset as one upon which this dataset depends.
     * @param {Dataset} dataset
     */
    addPredecessor(dataset) {
        this.predecessors.push(dataset);
    }

    /**
     * Register another dataset as one which depends upon this
     * dataset.
     * @param {Dataset} dataset
     */
    addSuccessor(dataset) {
        this.successors.push(dataset);
    }

    /**
     * Deregister the dataset as one upon which this dataset depends.
     * @param {Dataset} dataset
     */
    removePredecessor(dataset) {
        var i = this.predecessors.indexOf(dataset);
        if (i !== -1) {
            this.predecessors.splice(i, 1);
        } else {
            console.error("Predecessor not found.");
        }
    }

    /**
     * Deregister the given dataset as one which depends upon this
     * dataset.
     * @param {Dataset} dataset
     */
    removeSuccessor(dataset) {
        var i = this.successors.indexOf(dataset);
        if (i !== -1) {
            this.successors.splice(i, 1);
        } else {
            console.error("Successor not found.");
        }
    }

    /**
     * Create a directional dependency between one dataset and
     * another.
     * @param {Dataset} predecessor 
     * @param {Dataset} successor 
     */
    static createDependency(predecessor, successor) {
        predecessor.addSuccessor(successor);
        successor.addPredecessor(predecessor);
    }

    /**
     * Remove an existing directed dependency between one
     * dataset and another.
     * @param {Dataset} predecessor 
     * @param {Dataset} successor 
     */
    static removeDependency(predecessor, successor) {
        predecessor.removeSuccessor(successor);
        successor.removePredecessor(predecessor);
    }
}

class CallbackAccumulator {
    /**
     * Accumulate into a single array the results from a number of
     * functions which, when given a function as their sole argument,
     * will call that function after retrieving a result.
     * @param {[function]} getters
     */
    constructor(getters) {
        this.getters = getters;

        this.expectedResults = this.getters.length;
        this.results = [];
        this.receivedResults = 0;
    }

    /**
     * Accumulate the results of all the getters and, once all
     * of them have returned their results, call a callback upon
     * the accumulated array.
     * @param {function} callback 
     */
    execute(callback) {
        var self = this;
        this.receivedResults = 0;

        this.results = [];
        for (var i = 0; i < this.expectedResults; i++) {
            this.results.push(null);
        }

        for (var i = 0; i < this.expectedResults; i++) {
            this.getters[i](function(result) {
                self.results[i] = result;
                self.receivedResults += 1;
                if (self.receivedResults >= self.expectedResults) {
                    callback(self.results);
                }
            });
        }
    }
}

/**
 * Return a list of all numbers, starting from 0 and ending before
 * n (exclusive).
 * @param {int} n 
 */
function range(n) {
    output = [];
    for (var i = 0; i < n; i++) {
        output.push(i);
    }
    return output;
}

/**
 * Flatten a two-dimensional array of objects into a one-dimensional
 * array.
 * @param {[[object]]} ls 
 */
function flatten(ls) {
    var output = [];
    for (var i = 0; i < ls.length; i++) {
        output = output.concat(ls[i]);
    }
    return output;
}
