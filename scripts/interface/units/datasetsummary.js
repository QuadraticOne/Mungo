class DatasetSummary extends InterfaceUnit {
    static get INDENT_PER_GENERATION() {
        return 20;
    }

    /**
     * Create an interface for displaying, but not editing, the top-
     * level fields of any dataset.
     * @param {object} data 
     * @param {HTMLElement} parentElement 
     */
    constructor(data, parentElement) {
        super(data, parentElement);
    }

    /**
     * Create the elements required to display the unit, and return
     * the enclosing HTML element, but do not add it to the document.
     */
    create() {
        var container = document.createElement("div");
        container.classList.add(this.data.generation === 0 ?
            "datasetSummaryContainerParent" : "datasetSummaryContainerChild");

        var textBar = document.createElement("div");
        textBar.classList.add("datasetSummaryTextBar");
        container.appendChild(textBar);

        var leftGroup = document.createElement("div");
        leftGroup.classList.add("horizontalGroup");
        textBar.appendChild(leftGroup);

        var indent = document.createElement("div");
        var pixelIndent = this.data.generation * DatasetSummary.INDENT_PER_GENERATION;
        indent.style.width = pixelIndent.toString() + "px";
        leftGroup.appendChild(indent);

        var name = document.createElement("div");
        name.classList.add(this.data.generation === 0 ?
            "datasetSummaryNameParent" : "datasetSummaryNameChild");
        name.innerText = this.data.name;
        leftGroup.appendChild(name);

        var itemCount = document.createElement("div");
        itemCount.classList.add("datasetSummaryItemCount");
        itemCount.innerText = this.data.itemCount + " items";
        textBar.appendChild(itemCount);

        this.children = this.data.children.map(
            c => interfaceUnit(c, container));

        return container;
    }
}

mungo.builderTypes['datasetSummary'] = (d, p) => new DatasetSummary(d, p);
