class MappedDataset extends Dataset {
    /**
     * Create a dataset whose items are evaluated as a one-to-one mapping
     * from some source dataset via a transfer function.
     * @param {string} name 
     * @param {Dataset} parent 
     * @param {[Dataset]} children 
     * @param {Dataset} source 
     * @param {string} functionString 
     */
    constructor(name, parent, children, source, functionString) {
        super(name, parent, children);

        this.source = null;
        this.setSource(source);

        this.functionString = null;
        this.transfer = function(datum) { return { }; };
        this.setFunctionString(functionString);
    }

    /**
     * Return the ith item in the dataset, evaluating this lazily
     * where possible.
     * @param {int} index 
     */
    getItem(index) {
        return this.transfer(this.source.getItem(index));
    }

    /**
     * Count the items that are direct descendents of this dataset,
     * not counting any that belong to its children.
     */
    countDirectItems() {
        return this.source.countDirectItems();
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
     * Sets the function string used as the transfer function.
     * @param {string} newString 
     */
    setFunctionString(newString) {
        this.functionString = newString;
        this.transfer = new Function("x", this.functionString);
    }
}
