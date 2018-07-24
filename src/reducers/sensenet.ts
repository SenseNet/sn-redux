import { Workspace } from '@sensenet/default-content-types'
import { combineReducers, Reducer } from 'redux'
import { batchResponses } from './batchresponses'
import { currentcontent } from './currentcontent'
import { currentitems } from './currentitems'
import { selected } from './selected'
import { session } from './session'

/**
 * Reducer to handle Actions on the currentworkspace object.
 * @param state Represents the current state.
 * @param action Represents an action that is called.
 * @returns state. Returns the next state based on the action.
 */
export const currentworkspace: Reducer<Workspace | null> = (state = null, action) => {
    switch (action.type) {
        case 'LOAD_CONTENT_SUCCESS':
            return action.payload.d.Workspace
        default:
            return state
    }
}
/**
 * Reducer combining session, currentitems, currentcontent and selected into a single object, ```sensenet``` which will be the top-level one.
 */
export const sensenet = combineReducers({
    session,
    currentworkspace,
    currentcontent,
    currentitems,
    selected,
    batchResponses,
})
