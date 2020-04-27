const NO_INITIAL_VALUE_INDEX = 1;
const INITIAL_VALUE_INDEX = 0;

/* ДЗ 2 - работа с массивами и объектами */
/*
 Задание 1:

 Напишите аналог встроенного метода forEach для работы с массивами
 Посмотрите как работает forEach и повторите это поведение для массива, который будет передан в параметре array
 */

const forEach = (array, fn) => {
    for (let i = 0; i < array.length; i++) {
        fn(array[i], i, array);
    }
}

/*
 Задание 2:

 Напишите аналог встроенного метода map для работы с массивами
 Посмотрите как работает map и повторите это поведение для массива, который будет передан в параметре array
 */
const map = (array, fn) => {
    let newArray = [];

    for (let i = 0; i < array.length; i++) {
        newArray = [...newArray, fn(array[i], i, array)];
    }

    return newArray;
}

/*
 Задание 3:

 Напишите аналог встроенного метода reduce для работы с массивами
 Посмотрите как работает reduce и повторите это поведение для массива, который будет передан в параметре array
 */
function reduce(array, fn, initial) {
    const { startValue, startIndex } = startData(initial, array[0]);
    let value = startValue;

    for (let i = startIndex; i < array.length; i++) {
        value = fn(value, array[i], i, array);
    }

    return value;
}

/*
* Жаль нет приватных функций..
* Эта функция берет на себя логику возврата начальных данных для функции reduce
* о начальном индексе и начальном значении
*  */
const startData = (initial, initialValueWhenNoInitial) => initial ? {
    startIndex: INITIAL_VALUE_INDEX,
    startValue: initial
} : {
    startIndex: NO_INITIAL_VALUE_INDEX,
    startValue: initialValueWhenNoInitial
};

/*
 Задание 4:

 Функция должна перебрать все свойства объекта, преобразовать их имена в верхний регистр и вернуть в виде массива

 Пример:
   upperProps({ name: 'Сергей', lastName: 'Петров' }) вернет ['NAME', 'LASTNAME']
 */
const upperProps = (obj) => {
    let newArr = [];

    for (let key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            newArr.push(key.toUpperCase());
        }
    }

    return newArr;
}

/*
 Задание 5 *:

 Напишите аналог встроенного метода slice для работы с массивами
 Посмотрите как работает slice и повторите это поведение для массива, который будет передан в параметре array
 */
const slice = (array, from = 0, to = array.length) => {
    let newArr = [];

    if (from < 0) {
        from = array.length + from;
    }
    if (to < 0) {
        to = array.length + to;
    }

    for (let i = from; i < to; i++) {
        if (array[i]) {
            newArr.push(array[i]);
        }
    }

    return newArr;
}

/*
 Задание 6 *:

 Функция принимает объект и должна вернуть Proxy для этого объекта
 Proxy должен перехватывать все попытки записи значений свойств и возводить это значение в квадрат
 */
const createProxy = (obj) => {
    const handler = {
        set(target, prop, val) {
            return Reflect.set(target, prop, val ** 2);
        }
    }

    return new Proxy(obj, handler);
}

export {
    forEach,
    map,
    reduce,
    upperProps,
    slice,
    createProxy
};
