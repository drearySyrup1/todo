import Db from './db';
import Item from './item';
import Base from './pages/base';
import Sidebar from './pages/sidebar';
import {render} from './pages/render';


const db  = new Db('todos');
const listDb = new Db('lists')
const base = new Base(db);
const sidebar = new Sidebar(base, listDb, db);
base.sidebar = sidebar;
render(base, db);
sidebar.renderLists();
sidebar.showCount();

window.addEventListener('keydown', e => {
    if (e.code === 'Enter' && base.input.value !== '') {
        let important = false;
        if (sidebar.currentwidnow === 'important') important = true;
        const addListeners = base.createTaskElement('', false, important, false, null);

        const value = addListeners.value;



        const todo = new Item(value,false, important,addListeners.id,addListeners.date,sidebar.currentwidnow);
        base.buttonState1();
        db.database.push(todo);
        db.update();
        sidebar.showCount();
    }

    if (e.code === 'Escape') base.buttonState1();
    if (e.code === 'Tab' && !base.state2) {
        e.preventDefault();
        base.buttonState2();
        base.input.focus();
    }
})

base.addButton.addEventListener('click', e => {
    base.buttonState2();
});


// const todo = new Item('asd',false, false, 'today');
