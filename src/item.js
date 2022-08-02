export default class {
    constructor(todo, done, important, id, date, category='tasks') {
        this.todo = todo;
        this.done = done;
        this.important = important;
        this.id = id;
        this.category = category;
        this.date = date;
    }
}