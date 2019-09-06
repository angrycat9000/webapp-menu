class TabList {
    constructor(source) {
        this.array = source || [];
        if( ! Array.isArray(source))
            this.array = Array.from(source)
        
    }

    get first() {return (0 == this.array.length) ? null : this.array[0];}

    get last() {return (0 == this.array.length) ? null : this.array[this.array.length-1];}

    get defaultFocusItem() {return this.array.find(item=>item.isDefaultFocus)}

    next(item) {
        const index = this.array.indexOf(item);
        if (index < 0)
            return this.first;
        const nextIndex = (index + 1) % this.array.length;
        return this.array[nextIndex];
    }

    previous(item) {
        const index = this.array.indexOf(item);
        if (index < 0)
            return this.last;
        const prevIndex = (index - 1 + this.array.length) % this.array.length;
        return this.array[prevIndex];
    }

    *[Symbol.iterator]() {
        for(let e of this.array)
            yield e;
    }
}

export default TabList;