export default (base, db, checkboxHandle, importantHandle) => {
    const database = db.database

    database.forEach(item => {
        if (item.category === 'important') {
        const addListeners = base.createTaskElement(item.todo,item.done,item.important, true, item.id)
        }
    })

    // console.log(database)
}