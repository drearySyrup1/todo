export default class {

    constructor(dbName) {
        this.dbName = dbName;
        this.database = this.getData();
    }

    update() {
        console.log('pushing')
        localStorage.setItem(this.dbName, JSON.stringify(this.database))
    }

    getData() {
        console.log('getting data')
        return JSON.parse(localStorage.getItem(this.dbName)) || [];
    }

    destroy() {
        localStorage.removeItem(this.dbName)
    }
}