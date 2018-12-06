class InterfaceUnit {
    /**
     * Create an instance of this interface unit as the last child
     * of the given parent element.
     * @param {object} data
     * @param {HTMLElement} parentElement
     */
    constructor(data, parentElement) {
        this.data = data;
        this.parentElement = parentElement;
        this.element = this.create();
        this.addToDocument();
    }

    /**
     * Create the elements required to display the unit, and return
     * the enclosing HTML element, but do not add it to the document.
     */
    create() {
        console.error("InterfaceUnit.create has not been implemented.");
    }

    /**
     * Add the HTML element enclosing the visual representation of the
     * data structure to the parent element.
     */
    addToDocument() {
        this.parentElement.appendChild(this.element);
    }

    /**
     * Destroy this interface unit, removing it from the document.
     */
    removeFromDocument() {
        this.parentElement.removeChild(this.element);
    }

    /**
     * Get the data object for this unit.  This should be overridden
     * if the data must be refreshed after user changes.
     */
    getData() {
        return this.data;
    }

    /**
     * Apply any changes to the interface's data as described
     * by the object.  Fields which are left out are assumed not
     * to have changed.
     * @param {object} newData 
     */
    applyDataChanges(changes) { }
}
