import { addRowAction, deleteRowAction, filterAction, initAction } from './actions';
import { INIT_ACTION, ROW_ADD_ACTION, ROW_DELETE_ACTION, ROW_FILTER_ACTION } from './constant';

/*
 ДЗ 7 - Создать редактор cookie с возможностью фильтрации

 7.1: На странице должна быть таблица со списком имеющихся cookie. Таблица должна иметь следующие столбцы:
   - имя
   - значение
   - удалить (при нажатии на кнопку, выбранная cookie удаляется из браузера и таблицы)

 7.2: На странице должна быть форма для добавления новой cookie. Форма должна содержать следующие поля:
   - имя
   - значение
   - добавить (при нажатии на кнопку, в браузер и таблицу добавляется новая cookie с указанным именем и значением)

 Если добавляется cookie с именем уже существующей cookie, то ее значение в браузере и таблице должно быть обновлено

 7.3: На странице должно быть текстовое поле для фильтрации cookie
 В таблице должны быть только те cookie, в имени или значении которых, хотя бы частично, есть введенное значение
 Если в поле фильтра пусто, то должны выводиться все доступные cookie
 Если добавляемая cookie не соответсвует фильтру, то она должна быть добавлена только в браузер, но не в таблицу
 Если добавляется cookie, с именем уже существующей cookie и ее новое значение не соответствует фильтру,
 то ее значение должно быть обновлено в браузере, а из таблицы cookie должна быть удалена

 Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 */

/*
 homeworkContainer - это контейнер для всех ваших домашних заданий
 Если вы создаете новые html-элементы и добавляете их на страницу, то добавляйте их только в этот контейнер

 Пример:
   const newDiv = document.createElement('div');
   homeworkContainer.appendChild(newDiv);
 */
const homeworkContainer = document.querySelector('#homework-container');
// текстовое поле для фильтрации cookie
const filterNameInput = homeworkContainer.querySelector('#filter-name-input');
// текстовое поле с именем cookie
const addNameInput = homeworkContainer.querySelector('#add-name-input');
// текстовое поле со значением cookie
const addValueInput = homeworkContainer.querySelector('#add-value-input');
// кнопка "добавить cookie"
const addCookieButton = homeworkContainer.querySelector('#add-button');
// таблица со списком cookie
const listTable = homeworkContainer.querySelector('#list-table tbody');

let currentState = {
    cookies: '',
}

const reducer = (action, state) => {
    switch (action.type) {
        case INIT_ACTION:
        case ROW_DELETE_ACTION:
        case ROW_ADD_ACTION:
            return { ...state, cookies: getParsedCookies() }
        case ROW_FILTER_ACTION:
            return { ...state, cookies: action.payload }
        default:
            return state;
    }
}

const store = {
    dispatch: (action) => {
        if ('internalAction' in action) {
            action.internalAction()
        }
        currentState = reducer(action, currentState)
        render(currentState)
    }
}

const render = (currentState) => {
    listTable.innerHTML = '';
    currentState.cookies.forEach(cookie => {
        if (cookie) {
            addRowTable(cookie.name, cookie.value);
        }
    });
}

const getParsedCookies = () => {
    let newArray = [];

    document.cookie.split(';').forEach(item => {
        let cookiesArray = item.split('=');

        if (cookiesArray[0] && cookiesArray[1]) {
            newArray.push({
                name: trimAndReplaceSpace(cookiesArray[0]),
                value: trimAndReplaceSpace(cookiesArray[1])
            });
        }
    });

    return newArray;
}

const trimAndReplaceSpace = (value) => value.trim().replace(/%20/g, ' ');

const addRowTable = (name, value) => {
    const tr = document.createElement('tr');
    const tdName = document.createElement('td');
    const tdValue = document.createElement('td');
    const tdDel = document.createElement('td');
    const iconWrapper = document.createElement('div');
    const icon = document.createElement('i');

    tdName.innerText = decodeURI(name);
    tdValue.innerText = decodeURI(value);

    icon.dataset.name = decodeURI(name);
    icon.classList.add('remove-icon');

    iconWrapper.classList.add('remove-wrapper')
    iconWrapper.appendChild(icon)

    tdDel.appendChild(iconWrapper);

    tr.classList.add(name);
    tr.appendChild(tdName);
    tr.appendChild(tdValue);
    tr.appendChild(tdDel);
    listTable.appendChild(tr);
}

const updateRowTable = (name, value) => {
    Array.from(listTable.children).forEach(item => {
        if (item.firstChild.textContent === name) {
            item.children[1].textContent = value;
        }
    })
}

const deleteRowTable = tr => tr.parentNode.removeChild(tr);

const getMatchList = (matchedString, list) => list.filter(item =>
    (isMatching(item.name, matchedString)) || (isMatching(item.value, matchedString))
);

const isMatching = (full = '', chunk = '') => {
    let lowCaseFull = full.toLowerCase();
    let lowCaseChunk = chunk.toLowerCase();

    return lowCaseFull.includes(lowCaseChunk);
}

const getCookie = (name) => {
    name = trimAndReplaceSpace(name)
    let matches = document.cookie.match(new RegExp(
        `(?:^|; )${name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1')}=([^;]*)`
    ));

    return matches ? decodeURIComponent(matches[1]) : undefined;
}

const setCookie = (name, value, options = {}) => {
    options = {
        path: '/',
        ...options
    };

    if (options.expires instanceof Date) {
        options.expires = options.expires.toUTCString();
    }

    let updatedCookie = encodeURIComponent(trimAndReplaceSpace(name))
        + '=' + encodeURIComponent(trimAndReplaceSpace(value));

    // eslint-disable-next-line guard-for-in
    for (let optionKey in options) {
        updatedCookie += '; ' + optionKey;
        let optionValue = options[optionKey];

        if (optionValue !== true) {
            updatedCookie += '=' + optionValue;
        }
    }

    document.cookie = updatedCookie;
}

filterNameInput.addEventListener('keyup', (e) => {
    filterAction.payload = getMatchList(e.target.value, getParsedCookies())
    store.dispatch(filterAction);
});

addCookieButton.addEventListener('click', () => {
    const name = trimAndReplaceSpace(addNameInput.value);
    const value = trimAndReplaceSpace(addValueInput.value);

    store.dispatch(addRowAction(() => addCookie(name, value)));
});

const addCookie = (name, value) => {
    try {
        if (getCookie(name)) {
            updateRowTable(name, value);
        } else {
            if (!name || !value) {
                throw new Error('Имя и значение cookie должны быть заполнены')
            } else {
                // addRowTable(name, value);
                addNameInput.value = '';
                addValueInput.value = '';
                addNameInput.focus();
            }
        }

        setCookie(name, value);
    } catch (e) {
        alert(e.message);
    }
}

const deleteCookie = name => {
    setCookie(name, '', {
        'max-age': -1
    });
}

const deleteRow = (item) => {
    if (item.classList.contains('remove-wrapper')
        || item.classList.contains('remove-icon')
    ) {
        const tr = item.closest('tr');

        deleteCookie(tr.className);
        deleteRowTable(tr);
    }
}

listTable.addEventListener('click', e => {
    store.dispatch(deleteRowAction(() => deleteRow(e.target)))
})

document.addEventListener('DOMContentLoaded', () => {
    store.dispatch(initAction)
});
