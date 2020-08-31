todo = {
    list: new Array(),
    numItems: 0,
}

const container = document.querySelector('.container');
const plusBtn = document.querySelector('.plusBtn');

plusBtn.addEventListener('click',function(){
    todo.createItem();
});

todo.createItem = () => {
    const item = document.createElement('div');
    item.classList.add('item');
    item.setAttribute('data-serial', todo.numItems);
    todo.numItems += 1;
    container.appendChild(item);

}