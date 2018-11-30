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
        return this.items[index];
    };

    /**
     * Count the items that are direct descendents of this dataset,
     * not counting any that belong to its children.
     */
    countDirectItems() {
        return this.items.length;
    };
}

points = [];
for (var i = 0; i < 20; i++) {
    points.push({ x: i, y: i * i });
}
d = new LiteralDataset("d", null, [], points);
e = new LiteralDataset("e", d, [], points);
