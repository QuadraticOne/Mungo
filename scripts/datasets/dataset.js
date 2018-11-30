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
        if (this.parent !== null) {
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
     * Return the ith item in the dataset, evaluating this lazily
     * where possible.
     * @param {int} index 
     */
    getItem(index) {
        console.error("Dataset.getItem not implemented.");
    };

    /**
     * Count the items that are direct descendents of this dataset,
     * not counting any that belong to its children.
     */
    countDirectItems() {
        console.error("Dataset.countItems not implemented.");
    };

    /**
     * Return the number of items belonging to this dataset and its
     * children.
     */
    countItems() {
        var total = this.countDirectItems();
        for (var i = 0; i < this.children.length; i++) {
            total += this.children[i].countItems();
        }
        return total;
    };

    /**
     * Return all items belonging directly to the dataset and, optionally,
     * to its children as well.
     * @param {bool} includeChildren
     */
    getItems(includeChildren) {
        var output = [];
        for (var i = 0; i < this.countDirectItems(); i++) {
            output.push(this.getItem(i));
        }
        if (includeChildren) {
            for (var i = 0; i < this.children.length; i++) {
                output = output.concat(this.children[i].items(includeChildren));
            }
        } 
        return output;
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
    addSuccessor(dataset) {
        var i = this.successors.indexOf(dataset);
        if (i !== -1) {
            this.successors.splice(i, 1);
        } else {
            console.error("Successor not found.");
        }
    }
}
