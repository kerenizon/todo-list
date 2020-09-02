todo = {
    list: new Array(),
    numItems: 0,
    item: {
        id: '',
        title: '',
        createdAt: Date.now(),
        task: '',
    },
    currentTaskId:'',
    isInitStorage: false,
}

const container = document.querySelector('.container');
const plusBtn = document.querySelector('.plusBtn');
const modalOuter = document.querySelector('.modal-outer');
const modalInner = document.querySelector('.modal-inner');


// For todays date
Date.prototype.today = function () { 
    return ((this.getDate() < 10)?"0":"") + this.getDate() +"/"+(((this.getMonth()+1) < 10)?"0":"") + (this.getMonth()+1) +"/"+ this.getFullYear();
}

// For the time now
Date.prototype.timeNow = function () {
     return ((this.getHours() < 10)?"0":"") + this.getHours() +":"+ ((this.getMinutes() < 10)?"0":"") + this.getMinutes() +":"+ ((this.getSeconds() < 10)?"0":"") + this.getSeconds();
}

plusBtn.addEventListener('click',function(){
    createItem();
});

for(let i=0;i<localStorage.length;i++){
    storageObj = JSON.parse(localStorage.getItem(`${i+1}`));
    todo.isInitStorage = true;
    createItem(storageObj);
}
todo.isInitStorage = false;



function createItem (obj = {}) {

    const editIcon = document.createElement('i');
    editIcon.classList.add('fas');
    editIcon.classList.add('fa-edit');

    const readIcon =  document.createElement('i');
    readIcon.classList.add('fas');
    readIcon.classList.add('fa-book-open');

    const deletIcon =  document.createElement('i');
    deletIcon.classList.add('fas');
    deletIcon.classList.add('fa-trash-alt');

    todo.numItems += 1;
    const newItem = obj;


    if (!todo.isInitStorage){
        newItem.createdAt = `${new Date().today()}  ${new Date().timeNow()}`
        newItem.id = todo.numItems;
    }
    console.log('nowcheck',newItem);
    
    todo.list.push(newItem);

    const item = document.createElement('div');
    item.classList.add('item');
    if (!todo.isInitStorage){
        item.setAttribute('data-serial', newItem.id);
        console.log('item',item.dataset.serial)
    }else{
        console.log('check',newItem);
        item.setAttribute('data-serial', newItem[0].id);
        console.log('item',item.dataset.serial)
    }
    item.appendChild(editIcon);
    item.appendChild(readIcon);
    item.appendChild(deletIcon);

    const itemTxt = document.createElement('div');
    // const title = document.createElement('h2');
    // title.classList.add('titleUpdate');
    const taskNo = document.createElement('h2');
    taskNo.classList.add('taskNo');
    const taskTxt = document.createElement('h2');

    // title.innerHTML = `title:`;
    if (todo.isInitStorage){
        taskNo.innerHTML = `task No. ${newItem[0].id}`;
        taskTxt.innerHTML = `created at: ${newItem[0].createdAt}`;
        
    }else{
        taskNo.innerHTML = `task No. ${newItem.id}`;
        taskTxt.innerHTML = `created at: ${newItem.createdAt}`;
    }

    

    // itemTxt.appendChild(title);
    itemTxt.appendChild(taskNo);
    itemTxt.appendChild(taskTxt);

    item.appendChild(itemTxt);
    container.appendChild(item);
 
    updateItem();
    readItem(newItem);
    removeItem();
}


function readItem (newItem) {
    let itemObj;
    document.querySelectorAll('.fa-book-open').forEach(el => el.addEventListener('click',function(e){
        const task = e.currentTarget.parentElement;
        document.querySelector('.taskNum').innerHTML = task.dataset.serial;
        todo.currentTaskId = task.dataset.serial;
        if (!todo.isInitStorage){
            if(todo.currentTaskId <= localStorage.length){
                itemObj = todo.list.filter(el => el[0].id == todo.currentTaskId);}
        }
        

        const titleInput = document.querySelector('.titleInput');
        const textareaInput = document.querySelector('.textareaInput');
        
        if(todo.isInitStorage){
            document.querySelector('.title').innerHTML = `title: ${itemObj[0][0].title}`; 
            document.querySelector('.tasktxt').innerHTML = `task: ${itemObj[0][0].task}`;
        }else{
            if(itemObj){
                document.querySelector('.title').innerHTML = `title: ${itemObj[0][0].title}`; 
                document.querySelector('.tasktxt').innerHTML = `task: ${itemObj[0][0].task}`;
            }else{
                document.querySelector('.title').innerHTML = `title:`; 
                document.querySelector('.tasktxt').innerHTML = `task:`;
            }
        }
        
        titleInput.style['visibility'] = 'hidden';
        textareaInput.style['visibility'] = 'hidden';
        document.querySelector('.submit').style['visibility'] = 'hidden';
        clickOutside();
    })) 
}



function clickOutside () {
        modalOuter.classList.add("open");

        function closeModal() {
            modalOuter.classList.remove("open");
        }
        
        modalOuter.addEventListener("click", function (e) {
            const isOutside = !e.target.closest(".modal-inner");
            if (isOutside) {
            closeModal();
            }
        });
        
        window.addEventListener("keydown", (event) => {
            console.log(event);
            if (event.key === "Escape") {
            closeModal();
            }
        });

       
}

  


function updateItem () {
    document.querySelectorAll('.fa-edit').forEach(el => el.addEventListener('click',function(e){

        const task = e.currentTarget.parentElement;
        document.querySelector('.taskNum').innerHTML = task.dataset.serial;
        todo.currentTaskId = task.dataset.serial;

        document.querySelector('.titleInput').style['visibility'] = 'visible';
        document.querySelector('.textareaInput').style['visibility'] = 'visible';
        // document.querySelector('input[type = "submit"]').style['visibility'] = 'visible';
        document.querySelector('.submit').style['visibility'] = 'visible';
        clickOutside();

        document.querySelector('.titleInput').value = '';
        document.querySelector('.textareaInput').value = '';

    })) 

    document.querySelector('.submit').addEventListener('click',function(e){
        const itemObj = todo.list.filter(el => el.id == todo.currentTaskId);
        if (todo.isInitStorage){
            itemObj[0].title = document.querySelector('.titleInput').value;
            itemObj[0].task = document.querySelector('.textareaInput').value;
        }else{
            itemObj[0].title = document.querySelector('.titleInput').value;
            itemObj[0].task = document.querySelector('.textareaInput').value;
            console.log(itemObj[0].title);
        }
        

        modalOuter.classList.remove("open");
        let taskNoArr = document.querySelectorAll('.taskNo');
        let taskNo = [...taskNoArr].filter(el => el.innerHTML.slice(-1) == todo.currentTaskId);
        let titleUpdate = taskNo.nextElementSibling;
        // titleUpdate.innerHTML = `${titleUpdate.innerHTML} ${itemObj[0].title}`;

        localStorage.setItem(todo.currentTaskId, JSON.stringify(itemObj));
        return true;
    })
 
}

function removeItem () {
    document.querySelectorAll('.fa-trash-alt').forEach(el => el.addEventListener('click',function(e){
        const task = e.currentTarget.parentElement;
        document.querySelector('.taskNum').innerHTML = task.dataset.serial;
        todo.currentTaskId = task.dataset.serial;

        task.remove();

        let index;
        todo.list.forEach((el,ind) =>{
            if(el.id == todo.currentTaskId){
                index = ind;
            }
        }) 

        if (index > -1) {
            todo.list.splice(index, 1);
        }

        localStorage.removeItem(todo.currentTaskId);
    })) 
 
}
