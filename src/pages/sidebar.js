import tasks from './tasks';
import important from './important';
import completed from './completed';
import {render, getCount} from './render';
import Element from '../element';


export default class {

    customLists = document.getElementById('custom-lists');
    nav = document.querySelectorAll('.link');
    currentwidnow = document.querySelector('.selected').dataset.name;
    state2 = false;
    addButton = document.getElementById('add-list')
    input = this.addButton.querySelector('#sidebar-state2 input');
    error = document.getElementById('error-sidebar');

    constructor(base,db, todoDb) {
        this.base = base;
        this.db = db;
        this.todoDb = todoDb;
        this.addEventListeners();
    }


    addEventListeners() {
        this.nav.forEach(item => item.addEventListener('click', this.clickHandler.bind(this)))
        this.addButton.addEventListener('click', this.addListClickHandle.bind(this));
        this.input.addEventListener('keydown', this.inputSubmitHandle.bind(this));
    }

    showError(msg) {
        this.error.classList.remove('hide');
        this.error.innerText = msg;

        setTimeout((() => {
            this.error.classList.add('hide');
        }).bind(this),1000)
    }

    cacheNav() {
        this.nav = document.querySelectorAll('.link');
    }

    inputSubmitHandle(e) {
        if (e.code === 'Enter' && this.input.value !== '') {
            const founds = this.db.database.filter(item => item.name === this.input.value)
            if (founds.length > 0) {this.showError('Already exists'); return;}
            this.createCustomListElement({name: this.input.value})
            this.db.database.push({name: this.input.value})
            this.db.update();
            this.buttonState1();
        }
        if (e.code === 'Escape') {
            this.buttonState1();
        }
    }

    showCount() {
        this.cacheNav();
        this.nav.forEach(item => {
            const count = getCount(this.todoDb, item.dataset.name);
            const countElement = item.querySelector('[data-type="count"]');
            if (!countElement) return;
            if (count > 0) {
                countElement.classList.remove('hide');
                countElement.innerText = count;
            } else {
                countElement.classList.add('hide');
            }
        })
    }

    renderLists() {
        this.db.database.forEach(item => {
            this.createCustomListElement({name: item.name})
        })
    }
    
    createCustomListElement({name}={}) {
        const wrapper = new Element('div',['sidebar-item','link'],'',this.customLists);
        wrapper.el.dataset.name = name;
        const listLeft = new Element('div',['list-left'],'',wrapper.el);


        new Element('span',['mdi','mdi-18px','mdi-format-list-bulleted'],'',listLeft.el)
        new Element('span',['nav-name'],name,listLeft.el)

        const listRight = new Element('div',['hide','list-right'],'',wrapper.el);

        listRight.el.dataset.type = 'count';        


        wrapper.el.addEventListener('click', this.clickHandler.bind(this))

    }

    buttonState1() {
        this.addButton.querySelector('#sidebar-state1').classList.remove('hide')
        this.addButton.querySelector('#sidebar-state2').classList.add('hide')
        this.addButton.querySelector('#sidebar-state2 input').value = '';
        this.state2 = false;
    }
    
    buttonState2() {
        if (this.state2) return;
        this.addButton.querySelector('#sidebar-state1').classList.add('hide')
        this.addButton.querySelector('#sidebar-state2').classList.remove('hide')
        this.addButton.querySelector('#sidebar-state2 input').focus()
        this.state2 = true;
    }
    
    addListClickHandle(e) {
        this.buttonState2();
    }

    selectAnimation(el) {
        const selected = document.querySelectorAll('.selected');
        selected.forEach(el => el.classList.remove('selected'));
        this.currentwidnow = el.dataset.name;
        el.classList.add('selected')
    }

    getIcon() {
        let element = document.querySelector('.selected span');
        let oldIcon = element.classList[element.classList.length - 1]
        return oldIcon;
    }

    clickHandler(e) { 
        this.selectAnimation(e.currentTarget)

        const newTitle = e.currentTarget.querySelector('.nav-name').innerText;
        this.base.changeTitle(newTitle, this.getIcon())

        this.base.clear();
        render(this.base, this.base.db, e.currentTarget.dataset.name);

        if (this.base.state2 && this.currentwidnow === 'my-day') {
            this.base.hideDatePicker(true)
        } else {
            this.base.hideDatePicker(false)
        }

        if (this.currentwidnow === 'completed') {
            this.base.addButton.classList.add('hide')
        }
        // switch () {
        //     case 'my-day':

        //     break;
        //     case 'important':
        //         important(this.base, this.base.db);
        //     break;
        //     case 'tasks':
        //         tasks(this.base, this.base.db);
        //     break;
        //     case 'completed':
        //         completed(this.base, this.base.db);
        //         this.base.addButton.classList.add('hide')
        //     break;
        //     case 'getting-started':

        //     break;
        //     case 'custom':

        //     break;
        // }

    }
}

