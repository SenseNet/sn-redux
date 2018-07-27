import { IODataParams } from '@sensenet/client-core'
import { GenericContent, IActionModel } from '@sensenet/default-content-types'
import { PromiseMiddlewareFailedAction, PromiseMiddlewareSucceededAction } from '@sensenet/redux-promise-middleware'
import { combineReducers, Reducer } from 'redux'
import { createContent, deleteContent, moveBatch, PromiseReturns, requestContent, updateContent, uploadRequest } from '../Actions'

/**
 * Reducer to handle Actions on the ids array in the currentitems object.
 * @param state Represents the current state.
 * @param action Represents an action that is called.
 * @returns state. Returns the next state based on the action.
 */
export const ids: Reducer<number[], PromiseMiddlewareSucceededAction<any>> = (state = [], action) => {
    switch (action.type) {
        case 'FETCH_CONTENT_SUCCESS':
            return (action.result as PromiseReturns<typeof requestContent>).map((content) => content.Id)
        case 'CREATE_CONTENT_SUCCESS':
            return [...state, action.result.Id]
        case 'UPLOAD_CONTENT_SUCCESS':
            if (state.indexOf(action.result.Id) === -1) {
                return [...state, action.result.Id]
            } else {
                return state
            }
        case 'DELETE_CONTENT_SUCCESS':
            const deletedIds = (action.result as PromiseReturns<typeof deleteContent>).d.results.map((d) => d.Id)
            return [...state.filter((id) => !deletedIds.includes(id))]
        case 'DELETE_BATCH_SUCCESS':
        case 'MOVE_BATCH_SUCCESS':
            if (action.result.d.results.length > 0) {
                const newIds = []
                const movedIds = (action.result as PromiseReturns<typeof moveBatch>).d.results.map((result) => result.Id)
                for (const id of state) {
                    if (movedIds.indexOf(id) === -1) {
                        newIds.push(id)
                    }
                }
                return newIds
            }
        default:
            return state
    }
}
/**
 * Reducer to handle Actions on the entities object in the currentitems object.
 * @param state Represents the current state.
 * @param action Represents an action that is called.
 * @returns state. Returns the next state based on the action.
 */
export const entities: Reducer<GenericContent[], PromiseMiddlewareSucceededAction<any>> = (state: GenericContent[] = [], action) => {
    // if (action.result && (
    //     action.type !== 'USER_LOGIN_FAILURE' &&
    //     action.type !== 'USER_LOGIN_BUFFER' &&
    //     action.type !== 'LOAD_CONTENT_SUCCESS' &&
    //     action.type !== 'REQUEST_CONTENT_ACTIONS_SUCCESS' &&
    //     action.type !== 'UPDATE_CONTENT_SUCCESS' &&
    //     action.type !== 'UPLOAD_CONTENT_SUCCESS' &&
    //     action.type !== 'DELETE_BATCH_SUCCESS' &&
    //     action.type !== 'COPY_CONTENT_SUCCESS' &&
    //     action.type !== 'COPY_BATCH_SUCCESS' &&
    //     action.type !== 'MOVE_CONTENT_SUCCESS' &&
    //     action.type !== 'MOVE_BATCH_SUCCESS')) {
    //     if (action.result.entities !== undefined && action.result.entities.entities !== undefined) {
    //         return (Object as any).assign({}, state, action.result.entities.entities)
    //     }
    // }
    switch (action.type) {
        case 'DELETE_CONTENT_SUCCESS':
        case 'DELETE_BATCH_SUCCESS':
        case 'MOVE_BATCH_SUCCESS':
            const deletedIds = (action.result as PromiseReturns<typeof deleteContent>).d.results.map((i) => i.Id)
            return [...state.filter((item) => !deletedIds.includes(item.Id))]
        case 'UPDATE_CONTENT_SUCCESS':
            return state.map((c) => {
                if (c.Id === (action.result as PromiseReturns<typeof updateContent>).d.Id) {
                    return action.result
                }
                return c
            })
        case 'CREATE_CONTENT_SUCCESS':
        case 'UPLOAD_CONTENT_SUCCESS':
            const newContent = (action.result as PromiseReturns<typeof uploadRequest> | PromiseReturns<typeof createContent>) as GenericContent
            return state.find((item) => item.Id === action.result.Id) !== undefined ? state.map((c) => {
                if (c.Id === newContent.Id) {
                    return newContent
                }
                return c
            }) : [newContent, ...state]
        case 'FETCH_CONTENT_SUCCESS':
            return [
                ...(action.result as PromiseReturns<typeof requestContent>) as GenericContent[],
            ]
        default:
            return state
    }
}
/**
 * Reducer to handle Actions on the isFetching property in the currentitems object.
 * @param state Represents the current state.
 * @param action Represents an action that is called.
 * @returns state. Returns the next state based on the action.
 */
export const isFetching: Reducer<boolean> = (state = false, action) => {
    switch (action.type) {
        case 'FETCH_CONTENT_LOADING':
            return true
        case 'FETCH_CONTENT':
        case 'FETCH_CONTENT_SUCCESS':
        case 'FETCH_CONTENT_FAILURE':
            return false
        default:
            return state
    }
}
/**
 * Reducer to handle Actions on the childrenerror property in the currentitems object.
 * @param state Represents the current state.
 * @param action Represents an action that is called.
 * @returns state. Returns the next state based on the action.
 */
export const childrenerror: Reducer<object | null, PromiseMiddlewareFailedAction<any> | PromiseMiddlewareSucceededAction<any>> = (state = null, action) => {
    switch (action.type) {
        case 'FETCH_CONTENT_FAILURE':
            return (action as PromiseMiddlewareFailedAction<any>).error.message
        case 'FETCH_CONTENT_SUCCESS':
        case 'CREATE_CONTENT_SUCCESS':
        case 'UPDATE_CONTENT_SUCCESS':
        case 'DELETE_CONTENT_SUCCESS':
        case 'CHECKIN_CONTENT_SUCCESS':
        case 'CHECKOUT_CONTENT_SUCCESS':
        case 'APPROVE_CONTENT_SUCCESS':
        case 'PUBLISH_CONTENT_SUCCESS':
        case 'REJECT_CONTENT_SUCCESS':
        case 'UNDOCHECKOUT_CONTENT_SUCCESS':
        case 'FORCEUNDOCHECKOUT_CONTENT_SUCCESS':
        case 'RESTOREVERSION_CONTENT_SUCCESS':
            return null
        default:
            return state
    }
}
/**
 * Reducer to handle Actions on the chidlrenactions object in the currentitems object.
 * @param state Represents the current state.
 * @param action Represents an action that is called.
 * @returns state. Returns the next state based on the action.
 */
export const childrenactions: Reducer<IActionModel[]> = (state = [], action) => {
    switch (action.type) {
        case 'REQUEST_CONTENT_ACTIONS_SUCCESS':
            return action.result
        default:
            return state
    }
}
/**
 * Reducer to handle Actions on the isOpened property in the currentitems object.
 * @param state Represents the current state.
 * @param action Represents an action that is called.
 * @returns state. Returns the next state based on the action.
 */
export const isOpened: Reducer<boolean | null> = (state = null, action) => {
    switch (action.type) {
        case 'REQUEST_CONTENT_ACTIONS_SUCCESS':
            return action.id
        default:
            return state
    }
}
/**
 * Reducer to handle Actions on the odata options property in the currentitems object.
 * @param state Represents the current state.
 * @param action Represents an action that is called.
 * @returns state. Returns the next state based on the action.
 */
export const options: Reducer<IODataParams<GenericContent> | null> = (state = null, action) => {
    switch (action.type) {
        case 'SET_ODATAOPTIONS':
            return action.options
        default:
            return state
    }
}
/**
 * Reducer combining ids, entities, isFetching, actions, error, top, skip, query, order, filter, select and isOpened into a single object, ```currentitems```.
 */
export const currentitems = combineReducers({
    ids,
    entities,
    isFetching,
    actions: childrenactions,
    error: childrenerror,
    isOpened,
    options,
})
