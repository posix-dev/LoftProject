/* Задание со звездочкой */

/*
 Создайте страницу с кнопкой.
 При нажатии на кнопку должен создаваться div со случайными размерами, цветом и позицией на экране
 Необходимо предоставить возможность перетаскивать созданные div при помощи drag and drop
 Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 */

/*
 homeworkContainer - это контейнер для всех ваших домашних заданий
 Если вы создаете новые html-элементы и добавляете их на страницу, то дабавляйте их только в этот контейнер

 Пример:
   const newDiv = document.createElement('div');
   homeworkContainer.appendChild(newDiv);
 */
const homeworkContainer = document.querySelector('#homework-container');

/*
 Функция должна создавать и возвращать новый div с классом draggable-div и случайными размерами/цветом/позицией
 Функция должна только создавать элемент и задавать ему случайные размер/позицию/цвет
 Функция НЕ должна добавлять элемент на страницу. На страницу элемент добавляется отдельно

 Пример:
   const newDiv = createDiv();
   homeworkContainer.appendChild(newDiv);
 */
const createDiv = () => {
    let div = document.createElement('div');
    let maxWidth = 200;
    let maxHeight = 200;

    div.classList.add('draggable-div');
    div.draggable = true;
    div.style.backgroundColor =
        '#' + Math.floor(Math.random() * 16777215).toString(16);
    div.style.width = Math.floor(Math.random() * maxWidth) + 'px';
    div.style.height = Math.floor(Math.random() * maxHeight) + 'px';
    div.style.position = 'absolute';
    div.style.left = Math.floor(Math.random() * maxWidth) + 'px';
    div.style.top = Math.floor(Math.random() * maxHeight) + 'px';

    return div;
    // return new DivBuilder( 'draggable-div')
    //     .setWidth(Math.floor(Math.random() * maxWidth))
    //     .setHeight(Math.floor(Math.random() * maxHeight))
    //     .setLeft(Math.floor(Math.random() * maxWidth)+ 'px')
    //     .setTop(Math.floor(Math.random() * maxHeight)+ 'px')
    //     .setBackgroundColor('#' + Math.floor(Math.random() * 16777215).toString(16))
    //     .setPosition('relative')
    //     .build()
}

// class DivBuilder {
//     constructor(className) {
//         this.className = className
//     }
//
//     setWidth(width) {
//         this.width = width
//
//         return this;
//     }
//
//     setBackgroundColor(backgroundColor) {
//         this.backgroundColor = backgroundColor
//
//         return this;
//     }
//
//     setPosition(position) {
//         this.position = position
//
//         return this;
//     }
//
//     setLeft(left) {
//         this.left = left
//
//         return this;
//     }
//
//     setTop(top) {
//         this.top = top
//
//         return this;
//     }
//
//     setHeight(height) {
//         this.height = height
//
//         return this;
//     }
//
//     build() {
//         const innerDiv = document.createElement('div');
//
//         innerDiv.classList.add(this.className);
//         innerDiv.style.width = this.width;
//         innerDiv.style.height = this.height;
//         innerDiv.style.backgroundColor = this.backgroundColor;
//         innerDiv.style.position = this.position;
//         innerDiv.style.left = this.left;
//         innerDiv.style.top = this.top;
//
//         return innerDiv
//     }
// }

/*
 Функция должна добавлять обработчики событий для перетаскивания элемента при помощи drag and drop

 Пример:
   const newDiv = createDiv();
   homeworkContainer.appendChild(newDiv);
   addListeners(newDiv);
 */
const dragStart = (e) => e.target.style.opacity = '0.4';
const dragEnd = (e) => e.target.style.opacity = '1.0';

const drag = (e) => {
    const dt = e.dataTransfer;

    dt.setData(
        'left', (e.clientX - e.target.getBoundingClientRect().left).toString()
    );
    dt.setData(
        'top', (e.clientY - e.target.getBoundingClientRect().top).toString()
    );
}

const drop = (e) => {
    console.log('here')
    const dropObject = e.target
    const dataTransfer = e.dataTransfer
    const dataLeft = dataTransfer.getData('left');
    const dataTop = dataTransfer.getData('top');

    e.preventDefault();
    if (e.stopPropagation) {
        e.stopPropagation(); // stops the browser from redirecting.
    }

    console.dir(dataLeft + ' ' + dataTop)
    dropObject.style.left = dataLeft;
    dropObject.style.top = dataTop;
    dataTransfer.clearData()
}

const addListeners = (target) => {
    target.addEventListener('dragstart', dragStart);
    target.addEventListener('drag', drag);
    target.addEventListener('drop', drop);
    target.addEventListener('dragend', dragEnd);
}

let addDivButton = homeworkContainer.querySelector('#addDiv');

addDivButton.addEventListener('click', () => {
    // создать новый div
    const div = createDiv();

    // добавить на страницу
    homeworkContainer.appendChild(div);
    // назначить обработчики событий мыши для реализации D&D
    addListeners(div);
    // можно не назначать обработчики событий каждому div в отдельности, а использовать делегирование
    // или использовать HTML5 D&D - https://www.html5rocks.com/ru/tutorials/dnd/basics/
});

export {
    createDiv
};
