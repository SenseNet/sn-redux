import { IContent, IODataCollectionResponse, IODataParams } from '@sensenet/client-core'
import { GenericContent, IActionModel } from '@sensenet/default-content-types'
import { combineReducers, Reducer } from 'redux'

/**
 * Reducer to handle Actions on the ids array in the currentitems object.
 * @param state Represents the current state.
 * @param action Represents an action that is called.
 * @returns state. Returns the next state based on the action.
 */
export const ids: Reducer<number[]> = (state = [], action) => {
    switch (action.type) {
        case 'FETCH_CONTENT_SUCCESS':
            return action.payload.result
        case 'CREATE_CONTENT_SUCCESS':
            return [...state, action.payload.Id]
        case 'UPLOAD_CONTENT_SUCCESS':
            if (state.indexOf(action.payload.Id) === -1) {
                return [...state, action.payload.Id]
            } else {
                return state
            }
        case 'DELETE_CONTENT_SUCCESS':
            return [...state.slice(0, action.index), ...state.slice(action.index + 1)]
        case 'DELETE_BATCH_SUCCESS':
        case 'MOVE_BATCH_SUCCESS':
            if (action.payload.d.results.length > 0) {
                const newIds = []
                const deletedIds = (action.payload.d.results as IContent[]).map((result) => result.Id)
                for (const id of state) {
                    if (deletedIds.indexOf(id) === -1) {
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
export const entities: Reducer<IODataCollectionResponse<GenericContent> | null> = (state = null, action) => {
    if (action.payload && (
        action.type !== 'USER_LOGIN_FAILURE' &&
        action.type !== 'USER_LOGIN_BUFFER' &&
        action.type !== 'LOAD_CONTENT_SUCCESS' &&
        action.type !== 'REQUEST_CONTENT_ACTIONS_SUCCESS' &&
        action.type !== 'UPDATE_CONTENT_SUCCESS' &&
        action.type !== 'UPLOAD_CONTENT_SUCCESS' &&
        action.type !== 'DELETE_BATCH_SUCCESS' &&
        action.type !== 'COPY_CONTENT_SUCCESS' &&
        action.type !== 'COPY_BATCH_SUCCESS' &&
        action.type !== 'MOVE_CONTENT_SUCCESS' &&
        action.type !== 'MOVE_BATCH_SUCCESS')) {
        if (action.payload.entities !== undefined && action.payload.entities.entities !== undefined) {
            return (Object as any).assign({}, state, action.payload.entities.entities)
        }
    }
    switch (action.type) {
        case 'DELETE_CONTENT_SUCCESS':
        case 'DELETE_BATCH_SUCCESS':
        case 'MOVE_BATCH_SUCCESS':
            const deletedIds = (action.payload.d.results as IContent[]).map((item) => {
                return item.Id
            })
            return {
                ...state,
                d: {
                    ...state && state.d,
                    ...{
                        __count: state && state.d.__count - action.payload.d.results.length,
                        results: state && state.d.results.filter((item) => deletedIds.indexOf(item.Id) === -1),
                    },
                },
            }
        case 'UPDATE_CONTENT_SUCCESS':
            return {
                ...state,
                d: {
                    ...state && state.d,
                    ...{
                        results: state && state.d.results.map((c) => {
                            if (c.Id === action.payload.Id) {
                                return action.payload
                            }
                            return c
                        }),
                    },
                },
            }
        case 'CREATE_CONTENT_SUCCESS':
        case 'UPLOAD_CONTENT_SUCCESS':
            return {
                ...state,
                d: {
                    ...(state && state.d),
                    ...{
                        __count: state && state.d.results.find((item) => item.Id === action.payload.Id) !== undefined ? state.d.__count : state && state.d.__count + 1,
                        results: state && state.d.results.find((item) => item.Id === action.payload.Id) !== undefined ? state.d.results.map((c) => {
                            if (c.Id === action.payload.Id) {
                                return action.payload
                            }
                            return c
                        }) : [action.payload, ...(state && state.d && state.d.results as GenericContent[] || [])],
                    },
                },
            }
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
export const childrenerror: Reducer<object | null> = (state = null, action) => {
    switch (action.type) {
        case 'FETCH_CONTENT_FAILURE':
            return action.payload.message
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
            return action.payload
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
