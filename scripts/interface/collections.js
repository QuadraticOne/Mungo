class InterfaceGroup extends InterfaceUnit {
    /**
     * Create a hierarchy of interface units.
     * @param {object} data 
     * @param {HTMLElement} parentElement 
     */
    constructor(data, parentElement) {
        super(data, parentElement);
    }

    /**
     * Build an interface group by trying to create each of the properties
     * of the data object as its own interface unit.
     */
    create() {
        this.children = { };
        this.container = document.createElement("div");
        for (var key in this.data) {
            this.children[key] = interfaceUnit(this.data[key], this.container);
        }
        return this.container;
    }

    /**
     * Get the data relating to this interface unit.
     */
    getData() {
        var output = { };
        for (var key in this.children) {
            output[key] = this.children[key].getData();
        }
        return output;
    }

    /**
     * Apply any changes to the interface's data as described
     * by the object.  Fields which are left out are assumed not
     * to have changed.
     * @param {object} newData 
     */
    applyDataChanges(changes) {
        for (var key in changes) {
            if (key in this.children) {
                this.children[key].applyDataChanges(changes[key]);
            }
        }
    }
}

class InterfaceList extends InterfaceUnit {
    /**
     * Create a list of interface elements where each element is
     * referenced by an index rather than by a name.
     * @param {[object]} data 
     * @param {HTMLElement} parentElement 
     */
    constructor(data, parentElement) {
        super(data, parentElement);
    }

    /**
     * Build an interface list by trying to create each of the elements
     * of the data list as its own interface unit.
     */
    create() {
        this.children = [];
        this.container = document.createElement("div");
        for (var i = 0; i < this.data.length; i++) {
            this.children.push(interfaceUnit(this.data[i], this.container));
        }
        return this.container;
    }
    
    /**
     * Get the data relating to this interface unit.
     */
    getData() {
        return this.children.map(c => c.getData());
    }

    /**
     * Apply any changes to the interface's data as described
     * by the object.  Fields which are left out are assumed not
     * to have changed.
     * @param {object} newData 
     */
    applyDataChanges(changes) {
        if (changes.constructor === Array) {
            for (var i = 0; i < changes.length; i++) {
                this.children[i].applyDataChanges(changes[i]);
            }
        } else {
            for (var key in changes) {
                if (key in this.children) {
                    this.children[key].applyDataChanges(changes[key]);
                }
            }
        }
    }
}

/**
 * Determine whether the object's data refers to an interface unit,
 * a list of interface units, or a hierarchy of interface units, and
 * return the relevant one using the constructors defined as keys
 * of `mungo.builderTypes`.
 * @param {object} data 
 * @param {HTMLElement} parentElement 
 */
function interfaceUnit(data, parentElement) {
    if (data.constructor === Array) {
        return new InterfaceList(data, parentElement);
    } else if (typeof data === 'object' && "type" in data) {
        return mungo.builderTypes[data.type](
            data, parentElement);
    } else {
        return new InterfaceGroup(data, parentElement);
    }
}

["interfaceUnit", "interfaceGroup", "interfaceList"].forEach(s =>
    mungo.builderTypes[s] = interfaceUnit);
    