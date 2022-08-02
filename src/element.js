export default class Element {
    constructor(type, classList, value, parent, attributes=[], id) {
        this.el = document.createElement(type);
        classList.forEach(cl => this.el.classList.add(cl));
        if (id) {
            this.el.id = id;
        }
        attributes.forEach(attr => {
            this.el.setAttribute(attr.name, attr.value);
        })
        this.el.innerText = value;
        parent.append(this.el)
    }
}