import { getOverlappingDaysInIntervals } from 'date-fns';
import Db from './db'
import {render} from './pages/render';

const editWindow = document.getElementById('edit-window');
const closeButton = document.getElementById('edit-window-close-button');
const task = document.getElementById('edit-window-task');
const star = document.getElementById('edit-window-star');
const note = document.getElementById('edit-window-note');
const datepicker = document.getElementById('edit-window-datepicker');
const category = document.getElementById('edit-window-category');
const deleteButton = document.getElementById('edit-window-delete-button');
const doneButton = document.getElementById('edit-window-done-button');

const others = {}

let currentTaskID = null;

closeButton.addEventListener('click', closeClickHandle)
doneButton.addEventListener('click', doneClickHandle);
deleteButton.addEventListener('click', deleteClickHandle);


function deleteClickHandle() {
    const taskToDelete = db.database.filter(item => item.id === currentTaskID)[0];
    const deleteIndex = db.database.indexOf(taskToDelete);
    db.database.splice(deleteIndex, 1);
    db.update();
    utils.hideWindow();
    render(others.base,db,others.sidebar.currentwidnow);
    others.sidebar.showCount();
}


function closeClickHandle() {
    utils.hideWindow();
}



function doneClickHandle(e) {
    const taskToEdit = db.database.filter(item => item.id === currentTaskID)[0];
    taskToEdit.todo = task.value;
    taskToEdit.important = star.checked;
    taskToEdit.category = category.value;
    taskToEdit.date = datepicker.value;
    taskToEdit.note = note.value;
    db.update();
    utils.hideWindow();
    render(others.base,db,others.sidebar.currentwidnow);
    others.sidebar.showCount();
}

const db = new Db('todos');
const listsDb = new Db('lists');

console.log(db.database)




const utils =  {
    showWindow(e) {
        const starCheck = e.currentTarget.querySelector('.star-check');
        const contains = starCheck !== e.target && starCheck.contains(e.target);
        const isCheckbox = e.target.matches('input[type="checkbox"]');
        if (isCheckbox || contains) return;
        db.database = db.getData();
        editWindow.classList.remove('hide');
        const taskID = parseInt(e.currentTarget.dataset.taskid);
        currentTaskID = taskID;
        const taskDB = db.database.filter(item => item.id === taskID)[0];
        console.log(taskDB)
        task.value = taskDB.todo;
        note.value = taskDB.note;
        datepicker.value = taskDB.date;
        star.checked = taskDB.important;

        category.innerHTML = ''

        const tasksOption = document.createElement('option');
        tasksOption.innerText = 'tasks';
        tasksOption.setAttribute('value', 'tasks')
        if (taskDB.category === 'tasks') {
            tasksOption.setAttribute('disabled', 'disabled')
            tasksOption.setAttribute('selected', 'selected')
        }
        category.append(tasksOption)
        
        listsDb.database = listsDb.getData()

        listsDb.database.forEach(item => {
            const option = document.createElement('option');
            option.innerText = item.name;
            option.setAttribute('value', item.name)
            if (taskDB.category === item.name) {
                option.setAttribute('disabled', 'disabled')
                option.setAttribute('selected', 'selected')
            }
            category.append(option)
        })

    },
    
    hideWindow() {
        editWindow.classList.add('hide');
        currentTaskID = null;
    },

    init({sidebar, base}) {
        others.sidebar = sidebar;
        others.base = base;
    }
}




export default utils
