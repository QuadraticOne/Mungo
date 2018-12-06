class InterfaceUnit {
    /**
     * Create an instance of this interface unit as the last child
     * of the given parent element.
     * @param {HTMLElement} parentElement
     */
    constructor(parentElement) {
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
}
