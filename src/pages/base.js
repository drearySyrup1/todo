import Element from '../element.js';
import { format, isThisSecond } from 'date-fns'
import datescount from '../datescount'
import editWindow from '../edit-window'
import {render} from './render';

export default class {
    title = document.getElementById('title');
    icon = document.getElementById('title-icon');
    tasks = document.getElementById('tasks');
    addButton = document.getElementById('add-task');
    editButton = document.getElementById('actions-edit');
    deleteButton = document.getElementById('actions-delete');
    state2 = false;
    generateId = this.idGenerator();
    generateTaskId = this.idGenerator();
    datepicker = document.getElementById('datepicker');
    input = this.addButton.querySelector('#state2 input');
    editInput = document.getElementById('topbar-edit-input');
    deleteWarningWindow = document.getElementById('delete-warning-window');

    constructor(db, listDb) {
        this.db = db;
        this.listDb = listDb;
        this.editButton.addEventListener('click', this.editHandle.bind(this))
        this.deleteButton.addEventListener('click', this.deleteHandle.bind(this))
    }

    deleteHandle() {
        let listName = this.sidebar.currentwidnow

        this.db.database = this.db.getData();

        const deleteList = (deleteTasks=false) => {

            if (deleteTasks) {
                console.log('deleting tasks from db');
                const newTaskDb = this.db.database.filter(item => item.category !== listName);
                this.db.database = newTaskDb;
                this.db.update()
            }
            // delete list from db and tasks that have that list
            this.sidebar.db.database = this.sidebar.db.getData();
            const newDb = this.sidebar.db.database.filter(item => item.name !== this.sidebar.currentwidnow);
            this.sidebar.db.database = newDb;
            this.sidebar.db.update();
            this.sidebar.showCount();
            this.sidebar.renderLists();
            this.sidebar.selectAnimation(document.querySelector('[data-name="tasks"]'))
            render(this, this.db, 'tasks');
        }

        
        // scan through tasks to see if any tasks in in this list
        // give warning if so give warning
        const dbCall = this.db.database.filter(item => item.category === this.sidebar.currentwidnow);
        if (dbCall.length > 0) {
            this.showWindow(this.deleteWarningWindow);
            this.deleteWarningWindow.querySelectorAll('button').forEach(i => i.addEventListener('click', handleBtnClicks.bind(this)));

            function handleBtnClicks(e) {
                if (e.target.id === 'delete-warning-window-yes-button') {
                    console.log('yes')
                    deleteList(true)
                    this.hideWindow(this.deleteWarningWindow);
                }

                if (e.target.id === 'delete-warning-window-no-button') {
                    this.hideWindow(this.deleteWarningWindow);
                }
            }
            this.deleteWarningWindow.querySelectorAll('button').forEach(i => i.removeEventListener('click', handleBtnClicks));
        } else {
            deleteList();
        }

    }

    editHandle() {
        this.title.classList.add('hide');
        this.editInput.classList.remove('hide')
        this.editInput.value = this.title.innerText;
        this.editInput.focus();

        this.editInput.addEventListener('keydown', e => {
            if (e.code === 'Enter' && this.editInput.value !== '') {
                //here change name 
                this.listDb.database = this.listDb.getData();

                this.db.database = this.db.getData();

                const tasksToUpdateTitles = this.db.database.filter(item => item.category === this.title.innerText);
                console.log(tasksToUpdateTitles)
                tasksToUpdateTitles.forEach(item => item.category = this.editInput.value);
                this.db.update();


                const title = this.listDb.database.filter(item => item.name === this.title.innerText)[0];
                title.name = this.editInput.value;
                this.listDb.update();
                this.sidebar.renderLists();
                this.title.innerText = this.editInput.value;
                this.sidebar.showCount();
                this.stopEdit();

            }
            if (e.code === 'Escape') this.stopEdit();
        })
    }

    showWindow(el) {
        el.classList.remove('hide');
    }

    hideWindow(el) {
        el.classList.add('hide');
    }

    stopEdit() {
        this.title.classList.remove('hide');
        this.editInput.classList.add('hide')
    }

    hideActions() {
        this.editButton.classList.add('hide');
        this.deleteButton.classList.add('hide')
    }

    showActions() {
        this.editButton.classList.remove('hide');
        this.deleteButton.classList.remove('hide')
    }

    changeTitle(newTitle, newIcon) {
        this.title.innerText = newTitle;
        let oldIcon = this.icon.classList[this.icon.classList.length -1];
        this.icon.classList.remove(oldIcon);
        this.icon.classList.add(newIcon);
    }

    clear() {
        this.tasks.innerHTML = '';
    }

    idGenerator() {
        let id = 0;
    
        return () => {
            id++;
            return id;
        }
    }

    createTaskElement(inputValue, checked=false, important=false,create=false, taskid, date) {
        let input;
        let dateToPass;
        if (!create) {
            input = this.addButton.querySelector('#state2 input');
            dateToPass = this.datepicker.value
            date = datescount(this.datepicker.value);
            inputValue = input.value
            }
        const taskId = taskid || this.db.getData().length + 1;
        const wrapper = new Element('div',['task'],'',tasks);
        wrapper.el.dataset.taskid = taskId;
        const taskWrap = new Element('div',['task-wrap'],'', wrapper.el);
        const taskWrapSplit = new Element('div',['taskwrapsplit'],'', taskWrap.el);
            
            const checkbox = new Element('div',['checkbox'],'', taskWrapSplit.el);

            const checkboxInput = new Element(
                'input',[],'', checkbox.el,
                [{name: 'type', value: 'checkbox'}]);
            checkboxInput.el.checked = checked;
            checkboxInput.el.dataset.taskid = taskId;
            new Element('div',['checksvg'],'', checkbox.el);
            new Element('p',[], inputValue, taskWrapSplit.el);

        const taskWrapBottom = new Element('div',['taskwrapbottom'],'', taskWrap.el);
            let dateIcon = new Element('span',['mdi', 'mdi-calendar'],'', taskWrapBottom.el);
            let dateElement = new Element('p',[],date.date || date, taskWrapBottom.el);
            let noteIcon = new Element('span',['hide','mdi', 'mdi-note'],'', taskWrapBottom.el);
            if (date ==='Yesterday' || date.past) {
                dateElement.el.style.color = 'hsl(0, 90%,70%)';    
            }
        

        const starCheck = new Element('div',['star-check'],'', wrapper.el);

            const inputId = `star${this.generateId()}`;

            const importantCheck = new Element(
                'input',[],'', starCheck.el,
                [{name: 'type', value: 'checkbox'}], inputId);

            importantCheck.el.checked = important;
            importantCheck.el.dataset.taskid = taskId;

            const label = new Element('label', [], '', starCheck.el,[{name:'for',value:inputId}])

            const svgs = new Element('div', ['svgs'],'',label.el)

                
                new Element('span', ['mdi','mdi-18px','mdi-star-outline'],
                '',svgs.el)

                new Element('span', ['mdi','mdi-18px','mdi-star'],
                '',svgs.el)


                if (!create) {
                input.value = '';

            }

            checkboxInput.el.addEventListener('click', this.checkboxHandle.bind(this));
            importantCheck.el.addEventListener('click', this.importantHandle.bind(this));

            wrapper.el.addEventListener('click', this.taskClickHandle.bind(this));
    
            
            return { ref: wrapper, checkbox: checkbox.el, important: importantCheck.el, value: inputValue, id:taskId, date: dateToPass}
    }

    //not in use at the moment
    dragElement(e) {
        const elmnt = e.currentTarget;
        const width = elmnt.offsetWidth;
        console.log()

        console.log(elmnt);

        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        
        elmnt.addEventListener('mousedown', dragMouseDown());
      
        function dragMouseDown(e) {
            elmnt.style.position = 'absolute';
            elmnt.style.backgroundColor = 'hsla(0, 0%, 15%, 1)';
            elmnt.style.zIndex = '10000';
            elmnt.style.width = `${width}px`;

        console.log('down')
          e = e || window.event;
          e.preventDefault();
          // get the mouse cursor position at startup:
          pos3 = e.clientX;
          pos4 = e.clientY;
        //   elmnt.style.top = (elmnt.offsetTop - pos4) + "px";
          elmnt.style.left = (elmnt.offsetLeft) + "px";
          console.log(pos3,pos4)
          document.onmouseup = closeDragElement;
          // call a function whenever the cursor moves:
          document.onmousemove = elementDrag;
        }
      
        function elementDrag(e) {
          e = e || window.event;
          e.preventDefault();
          // calculate the new cursor position:
          pos1 = pos3 - e.clientX;
          pos2 = pos4 - e.clientY;
          pos3 = e.clientX;
          pos4 = e.clientY;
          // set the element's new position:
          elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
          elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
        }
      
        function closeDragElement() {
            console.log('up');
            elmnt.style.position = 'static';
            elmnt.style.backgroundColor = 'hsla(0, 0%, 15%, .5)';
            elmnt.style.zIndex = '1';
          // stop moving when mouse button is released:
          document.onmouseup = null;
          document.onmousemove = null;
        }
      }

    taskClickHandle(e) {
        editWindow.init({sidebar: this.sidebar, base: this})
        editWindow.showWindow(e)
    }

    buttonState1() {
        this.addButton.querySelector('#state1').classList.remove('hide')
        this.addButton.querySelector('#state2').classList.add('hide')
        this.addButton.querySelector('#state2 input').value = '';
        this.state2 = false;
    }

    hideDatePicker(hide) {
        if (hide) {
            this.datepicker.classList.add('hide');
            return;
        }
        if (!hide) {
            this.datepicker.classList.remove('hide');
            return;
        }
    }

    buttonState2() {
        if (this.state2) return;
        const todayDate = format(new Date(), 'yyyy-MM-dd');
        this.addButton.querySelector('#state1').classList.add('hide')
        this.addButton.querySelector('#state2').classList.remove('hide')
        this.datepicker.value = todayDate;
        this.addButton.querySelector('#state2 input').focus()
        this.state2 = true;
        // if (this.sidebar.currentwidnow === 'my-day') this.hideDatePicker(true);
        console.log(this.state2);
    }
    
    removeTask(taskid) {
        const currentTask = document.querySelector(`[data-taskid="${taskid}"]`)
        tasks.removeChild(currentTask);
    }

    checkboxHandle(e) {
        const eventId = parseInt(e.target.dataset.taskid);
        const database = this.db.database;
        database.forEach(item => {
            if (parseInt(item.id) === eventId) {
                item.done = e.target.checked;

                // if (item.done) {
                //     item.category = 'completed';
                // } else {
                //     const importantCheckboxDOM = document.querySelector(`[data-taskid="${item.id}"] .star-check input`)
                //     if (item.important) {
                //         item.category = 'important'
                //     } else {
                //         item.category = 'tasks';
                //     }
                // }

                this.removeTask(eventId);

                this.db.update();
                this.sidebar.showCount();
                return;
            }
        })
    }
    
    importantHandle(e) {
        const eventId = parseInt(e.target.dataset.taskid);
        this.db.database = this.db.getData();
        const database = this.db.database;
        database.forEach(item => {
            if (parseInt(item.id) === eventId) {
                item.important = e.target.checked;

                // if (item.important) {
                //     item.category = 'important';
                // } else {
                //     item.category = 'tasks';
                // }

                if (this.sidebar.currentwidnow === 'important' && !item.important) this.removeTask(eventId)

                this.db.update();
                this.sidebar.showCount();
                return;
            }
        })
    }
    
}

