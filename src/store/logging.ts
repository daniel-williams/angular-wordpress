import {usePostMiddleware, usePreMiddleware, Middleware} from "@ngrx/store";

const actionLog : Middleware = (action) => {
    return action.do(val => {
        console.warn('DISPATCH: ', val)
    });
};

const stateLog : Middleware = (state) => {
    return state.do(val => {
        console.info('STATE: ', val)
    });
};

export const LOGGING_PROVIDERS = [
    usePreMiddleware(actionLog),
    usePostMiddleware(stateLog)
];
