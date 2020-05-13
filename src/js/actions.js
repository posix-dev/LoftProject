// eslint-disable-next-line no-unused-vars
import { INIT_ACTION, ROW_ADD_ACTION, ROW_DELETE_ACTION, ROW_FILTER_ACTION } from './constant';

export const initAction = {
    type: INIT_ACTION,
}

// eslint-disable-next-line no-unused-vars
export const deleteRowAction = (internalAction) => {
    return {
        type: ROW_DELETE_ACTION,
        internalAction: () => internalAction()
    }
}

export const addRowAction = (internalAction) => {
    return {
        type: ROW_ADD_ACTION,
        internalAction: () => internalAction()
    }
}

export const filterAction = {
    type: ROW_FILTER_ACTION
}