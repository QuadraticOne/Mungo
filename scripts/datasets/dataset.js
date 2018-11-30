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
        if (parent === null) {
            return 0;
        } else {
            return 1 + parent.generation();
        }
    }

    /**
     * Remove the parent dataset from this dataset, and also remove this
     * dataset from the parent's list of children.  Will not cause an
     * error if this dataset has no parent.
     */
    removeParent() {
        if (parent !== null) {
            var i = parent.children.indexOf(this);
            if (i !== -1) {
                parent.children.splice(i, 1);
            }
            parent = null;
        }
    }

    /**
     * Sets the parent of this dataset and adds this dataset to the list
     * of children of the new parent.
     * @param {Dataset} dataset 
     */
    setParent(dataset) {
        if (dataset !== null) {
            parent = dataset;
            parent.children.push(this);
        }
    }

    /**
     * Return the ith item in the dataset, evaluating this lazily
     * where possible.
     * @param {int} index 
     */
    getItem(index) {
        console.error("Dataset.getItem not implemented.");
    }

    /**
     * Count the items that are direct descendents of this dataset,
     * not counting any that belong to its children.
     */
    countDirectItems() {
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
        selfUpdated();
        for (var i = 0; i < successors.length; i++) {
            this.successors[i].predecessorUpdated(this);
        }
    }

    /**
     * Return the number of items belonging to this dataset and its
     * children.
     */
    countItems() {
        var total = countDirectItems();
        for (var i = 0; i < children.length; i++) {
            total += children[i].countItems();
        }
        return total;
    }

    /**
     * Return all items belonging directly to the dataset and, optionally,
     * to its children as well.
     * @param {bool} includeChildren
     */
    getItems(includeChildren) {
        var output = [];
        for (var i = 0; i < countDirectItems(); i++) {
            output.push(getItem(i));
        }
        if (includeChildren) {
            for (var i = 0; i < children.length; i++) {
                output = output.concat(children[i].items(includeChildren));
            }
        } 
        return output;
    }

    /**
     * Register another dataset as one upon which this dataset depends.
     * @param {Dataset} dataset
     */
    addPredecessor(dataset) {
        predecessors.push(dataset);
    }

    /**
     * Register another dataset as one which depends upon this
     * dataset.
     * @param {Dataset} dataset
     */
    addSuccessor(dataset) {
        successors.push(dataset);
    }

    /**
     * Deregister the dataset as one upon which this dataset depends.
     * @param {Dataset} dataset
     */
    removePredecessor(dataset) {
        var i = predecessors.indexOf(dataset);
        if (i !== -1) {
            predecessors.splice(i, 1);
        } else {
            console.error("Predecessor not found.");
        }
    }

    /**
     * Deregister the given dataset as one which depends upon this
     * dataset.
     * @param {Dataset} dataset
     */
    addSuccessor(dataset) {
        var i = successors.indexOf(dataset);
        if (i !== -1) {
            successors.splice(i, 1);
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
