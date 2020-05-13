import { INIT_ACTION, ROW_ADD_ACTION, ROW_DELETE_ACTION, ROW_FILTER_ACTION } from './constant';

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

const render = (currentState) => {
    listTable.innerHTML = '';
    currentState.cookies.forEach(cookie => {
        if (cookie) {
            addRowTable(cookie.name, cookie.value);
        }
    });
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