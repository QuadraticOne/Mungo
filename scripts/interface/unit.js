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
        this.parentElement.appendChild(this.element);
    }

    /**
     * Create the elements required to display the unit, and return
     * the enclosing HTML element, but do not add it to the document.
     */
    create() {
        console.error("InterfaceUnit.create has not been implemented.");
    }

    /**
     * Destroy this interface unit, removing it from the document.
     */
    destroy() {
        this.parentElement.removeChild(this.element);
        this.element = null;
    }

    /**
     * Get the data object for this unit.  This will automatically
     * check for any updates.
     */
    getData() {
        this.refreshData();
        return this.data;
    }

    /**
     * Refresh this interface unit's data field, updating any members that
     * may have been modified by the user.
     */
    refreshData() { }
}
