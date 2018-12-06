class TextEntrySingleLine extends InterfaceUnit {
    constructor(data, parentElement) {
        super(data, parentElement);
    }

    /**
     * Create the elements required to display the unit, and return
     * the enclosing HTML element, but do not add it to the document.
     */
    create() {
        this.textEntry = document.createElement("input");
        this.textEntry.setAttribute("type", "text");
        this.setText(this.data.text);
        return this.textEntry;
    }

    /**
     * Get the data object for this unit.  This should be overridden
     * if the data must be refreshed after user changes.
     */
    getData() {
        return { type: "textEntrySingleLine", text: this.textEntry.value };
    }

    /**
     * Apply any changes to the interface's data as described
     * by the object.  Fields which are left out are assumed not
     * to have changed.
     * @param {object} newData 
     */
    applyDataChanges(changes) {
        if ("text" in changes) {
            this.setText(changes.text);
        }
    }

    /**
     * Update the text displayed by the interface element.  This will
     * change the DOM as well as the stored data object.
     * @param {string} newText 
     */
    setText(newText) {
        this.textEntry.value = newText;
        this.data.text = newText;
    }
}

mungo.builderTypes['textEntrySingleLine'] = (d, p) => new TextEntrySingleLine(d, p);
