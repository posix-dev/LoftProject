/*
 Страница должна предварительно загрузить список городов из
 https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 и отсортировать в алфавитном порядке.
 При вводе в текстовое поле, под ним должен появляться список тех городов,
 в названии которых, хотя бы частично, есть введенное значение.
 Регистр символов учитываться не должен, то есть "Moscow" и "moscow" - одинаковые названия.
 Во время загрузки городов, на странице должна быть надпись "Загрузка..."
 После окончания загрузки городов, надпись исчезает и появляется текстовое поле.
 Разметку смотрите в файле towns-content.hbs
 Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 *** Часть со звездочкой ***
 Если загрузка городов не удалась (например, отключился интернет или сервер вернул ошибку),
 то необходимо показать надпись "Не удалось загрузить города" и кнопку "Повторить".
 При клике на кнопку, процесс загрузки повторяется заново
 */

/*
 homeworkContainer - это контейнер для всех ваших домашних заданий
 Если вы создаете новые html-элементы и добавляете их на страницу, то добавляйте их только в этот контейнер
 Пример:
   const newDiv = document.createElement('div');
   homeworkContainer.appendChild(newDiv);
 */
const homeworkContainer = document.querySelector('#homework-container');
/* Блок с надписью "Загрузка" */
const loadingBlock = homeworkContainer.querySelector('#loading-block');
/* Блок с текстовым полем и результатом поиска */
const filterBlock = homeworkContainer.querySelector('#filter-block');
/* Текстовое поле для поиска по городам */
const filterInput = homeworkContainer.querySelector('#filter-input');
/* Блок с результатами поиска */
const filterResult = homeworkContainer.querySelector('#filter-result');
/* Блок для отображения ошибки */
const reloadWrapper = homeworkContainer.querySelector('#reload_wrapper');
/* Кнопка для перезагрузки данных о городах */
const reloadBtn = homeworkContainer.querySelector('#reload_btn');

/*
 Функция должна вернуть Promise, который должен быть разрешен с массивом городов в качестве значения
 Массив городов пожно получить отправив асинхронный запрос по адресу
 https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 */
const sortByName = (a, b) => {
    if (a.name > b.name) {
        return 1;
    }
    if (b.name > a.name) {
        return -1;
    }

    return 0;
}

const loadAndGetTowns = async () => {
    const url = 'https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json'

    try {
        const response = await fetch(url);
        const body = await response.json();

        return body.sort(sortByName)
    } catch (e) {
        throw new Error(e)
    }
}

const createSearchResultFragment = (list) => {
    const fragment = document.createDocumentFragment();
    const div = document.createElement('div');

    for (let item of list) {
        let span = document.createElement('p');

        span.innerText = item.name;
        div.appendChild(span)
    }

    fragment.appendChild(div);

    return fragment
}

const startLoadingTowns = async () => {
    try {
        const towns = await loadAndGetTowns();

        localStorage.setItem('towns', JSON.stringify(towns));
        loadingBlock.style.display = 'none';
        reloadWrapper.style.display = 'none';
        filterBlock.style.display = 'block';
    } catch (e) {
        loadingBlock.style.display = 'none';
        reloadWrapper.style.display = 'block';
    }
};

const getTownFromStorage = () => JSON.parse(localStorage.getItem('towns'));

const getMatchList = (matchedString, list) => list.filter(item => isMatching(item.name, matchedString));

/*
 Функция должна проверять встречается ли подстрока chunk в строке full
 Проверка должна происходить без учета регистра символов
 Пример:
   isMatching('Moscow', 'moscow') // true
   isMatching('Moscow', 'mosc') // true
   isMatching('Moscow', 'cow') // true
   isMatching('Moscow', 'SCO') // true
   isMatching('Moscow', 'Moscov') // false
 */
const isMatching = (full = '', chunk = '') => {
    let lowCaseFull = full.toLowerCase();
    let lowCaseChunk = chunk.toLowerCase();

    return lowCaseFull.includes(lowCaseChunk);
}

const render = (fragment) => {
    filterResult.textContent = '';
    filterResult.appendChild(fragment);
}

reloadBtn.addEventListener('click', async () => {
    reloadWrapper.style.display = 'none';
    loadingBlock.style.display = 'block';
    await startLoadingTowns();
});

filterInput.addEventListener('keyup', (e) => {
    if (!e.target.value) {
        filterResult.innerHTML = '';
    } else {
        const townsList = getTownFromStorage();
        const matchList = getMatchList(e.target.value, townsList)
        const fragment = createSearchResultFragment(matchList);

        render(fragment)
    }
});

document.addEventListener('DOMContentLoaded', async () => startLoadingTowns())

export {
    loadAndGetTowns,
    isMatching
};