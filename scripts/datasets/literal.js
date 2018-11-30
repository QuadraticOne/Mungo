class LiteralDataset extends Dataset {
    /**
     * Create a dataset which is defined explicitly by a list of JSON
     * objects passed to it.
     * @param {string} name 
     * @param {Dataset} parent 
     * @param {[Dataset]} children 
     * @param {[object]} items 
     */
    constructor(name, parent, children, items) {
        super(name, parent, children, [], []);
        this.items = items;
    }

    /**
     * Return the ith item in the dataset, evaluating this lazily
     * where possible.
     * @param {int} index 
     */
    getItem(index) {
        return items[index];
    }

    /**
     * Count the items that are direct descendents of this dataset,
     * not counting any that belong to its children.
     */
    countDirectItems() {
        return items.length;
    }

    /**
     * Called when any of the predecessor datasets are updated; define
     * in this function how this dataset should react to the change.
     * @param {Dataset} predecessor 
     */
    predecessorUpdated(predecessor) { }

    /**
     * Perform any internal updates necessary when this dataset changes.
     */
    selfUpdated() { }
}
