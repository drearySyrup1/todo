import datecount from '../datescount';

export function render(base, db, category='tasks') {
    const database = db.database
    base.addButton.classList.remove('hide')
    
    database.forEach(item => {
        if (item.category === category || category === 'tasks' ||
        category === 'my-day' || category === 'important' ||
        category === 'completed') {
            if (category === 'tasks' && item.done) return;
            const dateString = datecount(item.date)
            if (category === 'my-day' && (dateString !== 'Today' || item.done)) return;
            if (category === 'important' && (!item.important || item.done)) return;
            if (category === 'completed' && item.done === false) return;
            if (item.category === category && item.done) return;
            base.createTaskElement(item.todo,item.done,item.important, true, item.id,dateString)
        }
    })
    // database.forEach(item => {
    //     if (item.category === category || category === 'tasks' || category === 'my-day') {
    //         if (category === 'tasks' && item.category === 'completed') return;
    //         const dateString = datecount(item.date)
    //         if (category === 'my-day' && dateString !== 'Today' || item.done) return;
    //         if (category === 'important' && item.done) return;

    //         base.createTaskElement(item.todo,item.done,item.important, true, item.id,dateString)
    //     }
    // })

    // console.log(database)
}


export function getCount(db, category) {
    if (category === 'tasks') {
        return db.database.filter(item => item.done !== true).length
    }
    if (category === 'my-day') {
        return db.database.filter(item => (datecount(item.date) === 'Today' && item.done === false)).length;
    }
    if (category === 'completed') {
        return db.database.filter(item => item.done === true).length;
    }
    if (category === 'important') {
        return db.database.filter(item => item.important === true && item.done === false).length;
    }
    return db.database.filter(item => item.category === category && item.done === false).length;
}