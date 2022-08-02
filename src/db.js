export default class {

    constructor(dbName) {
        this.dbName = dbName;
        this.database = this.getData();
    }

    update() {
        localStorage.setItem(this.dbName, JSON.stringify(this.database))
    }

    getData() {
        return JSON.parse(localStorage.getItem(this.dbName)) || [];
    }

    destroy() {
        localStorage.removeItem(this.dbName)
    }
}