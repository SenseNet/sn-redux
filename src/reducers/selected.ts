import { combineReducers, Reducer } from 'redux'

/**
 * Reducer to handle Actions on the selected array.
 * @param state Represents the current state.
 * @param action Represents an action that is called.
 * @returns state. Returns the next state based on the action.
 */
export const selectedIds: Reducer<number[]> = (state = [], action) => {
    switch (action.type) {
        case 'SELECT_CONTENT':
            return [...state, action.content.Id]
        case 'DESELECT_CONTENT':
            const index = state.indexOf(action.content.Id)
            return [...state.slice(0, index), ...state.slice(index + 1)]
        case 'CLEAR_SELECTION':
            return []
        default:
            return state
    }
}
/**
 * Reducer to handle selected content items.
 * @param state Represents the current state.
 * @param action Represents an action that is called.
 * @returns state. Returns the next state based on the action.
 */
export const selectedContentItems: Reducer<object> = (state = {}, action) => {
    switch (action.type) {
        case 'DESELECT_CONTENT':
            const res: any = Object.assign({}, state)
            delete res[action.content.Id]
            return res
        case 'SELECT_CONTENT':
            const obj: any = {}
            obj[action.content.Id] = action.content
            return (Object as any).assign({}, state, obj)
        case 'CLEAR_SELECTION':
            return {}
        default:
            return state
    }
}
/**
 * Reducer combining ids and entities into a single object, ```selected```.
 */
export const selected = combineReducers({
    ids: selectedIds,
    entities: selectedContentItems,
})
