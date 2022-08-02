export default class {
    constructor(todo, done, important, id, date, category='tasks', note='') {
        this.todo = todo;
        this.done = done;
        this.important = important;
        this.id = id;
        this.category = category;
        this.date = date;
        this.note = note;
    }
}