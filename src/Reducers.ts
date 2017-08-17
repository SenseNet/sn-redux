import { normalize } from 'normalizr';
import { combineReducers } from 'redux';
import { Authentication } from 'sn-client-js';

export module Reducers {

    const country = (state = '', action) => {
        return state
    }
    const language = (state = navigator.language, action) => {
        switch (action.type) {
            case 'USER_LOGIN_SUCCESS':
                return Authentication.LoginState.Authenticated
            case 'USER_LOGOUT_SUCCESS':
                return Authentication.LoginState.Unauthenticated
            default:
                return state
        }
    }
    const loginState = (state = Authentication.LoginState.Pending, action) => {
        switch (action.type) {
            case 'USER_LOGIN_SUCCESS':
                return Authentication.LoginState.Authenticated
            case 'USER_LOGOUT_SUCCESS':
                return Authentication.LoginState.Unauthenticated
            case 'USER_LOGIN_FAILURE':
                return Authentication.LoginState.Unauthenticated
            case 'USER_LOGOUT_FAILURE':
                return Authentication.LoginState.Unauthenticated
            default:
                return state
        }
    }
    const loginError = (state = '', action) => {
        switch (action.type) {
            case 'USER_LOGIN_FAILURE':
                return action.message
            case 'USER_LOGOUT_FAILURE':
                return action.message
            default:
                return null
        }
    }

    const userName = (state = 'Visitor', action) => {
        switch (action.type) {
            case 'USER_CHANGED':
                return action.user.Name
            default:
                return state

        }
    }

    const fullName = (state = 'Visitor', action) => {
        switch (action.type) {
            case 'USER_CHANGED':
                return action.user.DisplayName
            default:
                return state
        }
    }

    const userLanguage = (state = navigator.language, action) => {
        switch (action.type) {
            case 'USER_CHANGED':
                if (typeof action.user.Language !== 'undefined'
                    && action.user.Language.length > 0)
                    return action.user.Language[0]
                else
                    return state
            default:
                return state
        }
    }

    const user = combineReducers({
        userName,
        fullName,
        userLanguage
    })

    export const session = combineReducers({
        country,
        language,
        loginState,
        error: loginError,
        user
    })

    const ids = (state = [], action) => {
        switch (action.type) {
            case 'FETCH_CONTENT_SUCCESS':
                return action.response.result;
            case 'CREATE_CONTENT_SUCCESS':
                return [...state, action.response.result];
            case 'DELETE_CONTENT_SUCCESS':
                return [...state.slice(0, action.index), ...state.slice(action.index + 1)]
            default:
                return state;
        }
    }
    const entities = (state = {}, action) => {
        if (action.response && (action.type !== 'USER_LOGIN_SUCCESS' && action.type !== 'LOAD_CONTENT_SUCCESS')) {
            return (<any>Object).assign({}, state, action.response.entities.entities);
        }
        switch (action.type) {
            case 'DELETE_CONTENT_SUCCESS':
                let res = Object.assign({}, state);
                delete res[action.id];
                return res;
            default:
                return state;
        }
    }
    const isFetching = (state = {}, action) => {
        switch (action.type) {
            case 'FETCH_CONTENT_REQUEST':
                return true;
            case 'FETCH_CONTENT_SUCCESS':
            case 'FETCH_CONTENT_FAILURE':
                return false;
            default:
                return state;
        }
    }
    const childrenerror = (state = {}, action) => {
        switch (action.type) {
            case 'FETCH_CONTENT_FAILURE':
                return action.message;
            case 'CREATE_CONTENT_FAILURE':
            case 'UPDATE_CONTENT_FAILURE':
            case 'DELETE_CONTENT_FAILURE':
            case 'CHECKIN_CONTENT_FAILURE':
            case 'CHECKOUT_CONTENT_FAILURE':
            case 'PUBLISH_CONTENT_FAILURE':
            case 'APPROVE_CONTENT_FAILURE':
            case 'REJECT_CONTENT_FAILURE':
            case 'UNDOCHECKOUT_CONTENT_FAILURE':
            case 'FORCEUNDOCHECKOUT_CONTENT_FAILURE':
            case 'RESTOREVERSION_CONTENT_FAILURE':
            case 'FETCH_CONTENT_REQUEST':
            case 'FETCH_CONTENT_SUCCESS':
            case 'CREATE_CONTENT_REQUEST':
            case 'CREATE_CONTENT_SUCCESS':
            case 'UPDATE_CONTENT_REQUEST':
            case 'UPDATE_CONTENT_SUCCESS':
            case 'DELETE_CONTENT_REQUEST':
            case 'DELETE_CONTENT_SUCCESS':
            case 'CHECKIN_CONTENT_REQUEST':
            case 'CHECKIN_CONTENT_SUCCESS':
            case 'CHECKOUT_CONTENT_REQUEST':
            case 'CHECKOUT_CONTENT_SUCCESS':
            case 'APPROVE_CONTENT_REQUEST':
            case 'APPROVE_CONTENT_SUCCESS':
            case 'PUBLISH_CONTENT_REQUEST':
            case 'PUBLISH_CONTENT_SUCCESS':
            case 'REJECT_CONTENT_REQUEST':
            case 'REJECT_CONTENT_SUCCESS':
            case 'UNDOCHECKOUT_CONTENT_REQUEST':
            case 'UNDOCHECKOUT_CONTENT_SUCCESS':
            case 'FORCEUNDOCHECKOUT_CONTENT_REQUEST':
            case 'FORCEUNDOCHECKOUT_CONTENT_SUCCESS':
            case 'RESTOREVERSION_CONTENT_REQUEST':
            case 'RESTOREVERSION_CONTENT_SUCCESS':
                return null;
            default:
                return state;
        }
    }
    const childrenactions = (state = {}, action) => {
        return state
    }
    const top = (state = {}, action) => {
        switch (action.type) {
            case 'FETCH_CONTENT_REQUEST':
                if (action.options.top)
                    return action.options.top
            default:
                return state
        }
    }
    const skip = (state = {}, action) => {
        switch (action.type) {
            case 'FETCH_CONTENT_REQUEST':
                if (action.options.skip)
                    return action.options.skip
            default:
                return state
        }
    }
    const query = (state = {}, action) => {
        switch (action.type) {
            case 'FETCH_CONTENT_REQUEST':
                if (action.options.query)
                    return action.options.query
            default:
                return state
        }
    }
    const order = (state = {}, action) => {
        switch (action.type) {
            case 'FETCH_CONTENT_REQUEST':
                if (action.options.order)
                    return action.options.order
            default:
                return state
        }
    }
    const filter = (state = {}, action) => {
        switch (action.type) {
            case 'FETCH_CONTENT_REQUEST':
                if (action.options.filter)
                    return action.options.filter
            default:
                return state
        }
    }
    const select = (state = {}, action) => {
        switch (action.type) {
            case 'FETCH_CONTENT_REQUEST':
                if (action.options.select)
                    return action.options.select
            default:
                return state
        }
    }
    export const children = combineReducers({
        ids,
        entities,
        isFetching,
        error: childrenerror,
        // actions: childrenactions,
        top,
        skip,
        query,
        order,
        filter,
        select
    })

    const isSaved = (state = true, action) => {
        switch (action.type) {
            case 'CREATE_CONTENT_REQUEST':
            case 'CREATE_CONTENT_FAILURE':
            case 'UPDATE_CONTENT_REQUEST':
            case 'UPDATE_CONTENT_FAILURE':
            case 'LOAD_CONTENT_REQUEST':
            case 'LOAD_CONTENT_FAILURE':
                return false;
            default:
                return true;
        }
    }

    const isValid = (state = true, action) => {
        return state
    }

    const isDirty = (state = false, action) => {
        return state
    }

    const isOperationInProgress = (state = false, action) => {
        switch (action.type) {
            case 'CREATE_CONTENT_REQUEST':
            case 'UPDATE_CONTENT_REQUEST':
            case 'DELETE_CONTENT_REQUEST':
                return true
            default:
                return false
        }

    }

    const contentState = combineReducers({
        isSaved,
        isValid,
        isDirty,
        isOperationInProgress
    })

    const contenterror = (state: any = null, action) => {
        switch (action.type) {
            case 'CREATE_CONTENT_FAILURE':
            case 'UPDATE_CONTENT_FAILURE':
            case 'DELETE_CONTENT_FAILURE':
            case 'CHECKIN_CONTENT_FAILURE':
            case 'CHECKOUT_CONTENT_FAILURE':
            case 'PUBLISH_CONTENT_FAILURE':
            case 'APPROVE_CONTENT_FAILURE':
            case 'REJECT_CONTENT_FAILURE':
            case 'UNDOCHECKOUT_CONTENT_FAILURE':
            case 'FORCEUNDOCHECKOUT_CONTENT_FAILURE':
            case 'RESTOREVERSION_CONTENT_FAILURE':
                return action.message;
            case 'FETCH_CONTENT_FAILURE':
            case 'FETCH_CONTENT_REQUEST':
            case 'FETCH_CONTENT_SUCCESS':
            case 'CREATE_CONTENT_REQUEST':
            case 'CREATE_CONTENT_SUCCESS':
            case 'UPDATE_CONTENT_REQUEST':
            case 'UPDATE_CONTENT_SUCCESS':
            case 'DELETE_CONTENT_REQUEST':
            case 'DELETE_CONTENT_SUCCESS':
            case 'CHECKIN_CONTENT_REQUEST':
            case 'CHECKIN_CONTENT_SUCCESS':
            case 'CHECKOUT_CONTENT_REQUEST':
            case 'CHECKOUT_CONTENT_SUCCESS':
            case 'APPROVE_CONTENT_REQUEST':
            case 'APPROVE_CONTENT_SUCCESS':
            case 'PUBLISH_CONTENT_REQUEST':
            case 'PUBLISH_CONTENT_SUCCESS':
            case 'REJECT_CONTENT_REQUEST':
            case 'REJECT_CONTENT_SUCCESS':
            case 'UNDOCHECKOUT_CONTENT_REQUEST':
            case 'UNDOCHECKOUT_CONTENT_SUCCESS':
            case 'FORCEUNDOCHECKOUT_CONTENT_REQUEST':
            case 'FORCEUNDOCHECKOUT_CONTENT_SUCCESS':
            case 'RESTOREVERSION_CONTENT_REQUEST':
            case 'RESTOREVERSION_CONTENT_SUCCESS':
                return null;
            default:
                return state;
        }
    }
    const contentactions = (state = {}, action) => {
        switch (action.type) {
            case 'LOAD_CONTENT_ACTIONS_SUCCESS':
                return action.actions
            default:
                return state
        }
    }
    const fields = (state = {}, action) => {
        switch (action.type) {
            case 'LOAD_CONTENT_SUCCESS':
            case 'RELOAD_CONTENT_SUCCESS':

                return action.response.GetFields()
            default:
                return state
        }
    }

    const content = (state = {}, action) => {
        switch (action.type) {
            case 'LOAD_CONTENT_SUCCESS':
            case 'RELOAD_CONTENT_SUCCESS':
                return action.response
            default:
                return state
        }
    }

    const currentcontent = combineReducers({
        contentState,
        error: contenterror,
        actions: contentactions,
        fields,
        content
    })

    const selected = (state = [], action) => {
        return state;
    }

    export const sensenet = combineReducers({
        session,
        children,
        currentcontent,
        selected
    })

    /**
   * Method to get a Content item from a state object by its Id.
   * @param {Object} state Current state object.
   * @param {number} Id Id of the Content.
   * @returns {Object} content. Returns the Content from a state object with the given Id.
   */
    export const getContent = (state: Object, Id: number) => state[Id];
    /**
     * Method to get the ```ids``` array from a state object.
     * @param {Object} state Current state object.
     * @returns {number[]} content. Returns the ```ids``` array from the given state.
     */
    export const getIds = (state: any) => state.ids;
    /**
     * Method to get if the fetching of data is in progress.
     * @param {Object} state Current state object.
     * @returns {boolean} Returns true or false whether data fetching is in progress or not.
     */
    export const getFetching = (state: any) => state.isFetching;
    /**
     * Method to get the error message.
     * @param {Object} state Current state object.
     * @returns {string} Returns the error message.
     */
    export const getError = (state: any) => {
        return state.errorMessage
    };

    export const getAuthenticationStatus = (state) => {
        return state.session.loginState as Authentication.LoginState;
    }

    export const getAuthenticationError = (state) => {
        return state.session.error;
    }
}