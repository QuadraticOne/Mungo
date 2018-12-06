class InterfaceGroup extends InterfaceUnit {
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

    refreshData() {
        console.error("NYI");
    }
}

class InterfaceList extends InterfaceUnit {
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

    refreshData() {
        console.error("NYI");
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
