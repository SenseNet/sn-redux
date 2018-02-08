import { combineEpics } from 'redux-observable'
import 'rxjs/add/operator/catch'
import 'rxjs/add/operator/mergeMap'
import { Observable } from 'rxjs/Observable'
import { GoogleOauthProvider } from 'sn-client-auth-google'
import { Authentication, Collection, ContentTypes, Repository } from 'sn-client-js'
import * as Actions from './Actions'
import * as Reducers from './Reducers'

/**
 * Module for redux-observable Epics of the sensenet built-in OData actions.
 *
 * _An Epic is the core primitive of [redux-observable](https://redux-observable.js.org). It is a function which takes a stream of actions and returns a stream of actions._
 *
 * Learn more about redux-observable Epics [here](https://redux-observable.js.org/docs/basics/Epics.html);
 *
 * In sensenet's case it means that the action steps (for exmaple request, success, fail) or multiple actions can be combined into Epics. It's extremely useful if you have
 * to work with async action or you have a complex process with multiple steps that have to wait for each other like validation, multiple step saving, etc.
 *
 * Following epics cover the CRUD operations and all the other built-in sensenet OData Actions. All of these Epics are combined into one root Epic. If you want to use them in
 * your application without any customization you don't have to do anything special, because it is set as default at the store creation, but if you want add you custom Epics to it
 * use combineEpics on sensenets root Epic and yours.
 *
 * ```
 * import { combineEpics } from 'redux-observable';
 * import { myCombinedEpics } from '../myApp/Epics';
 * import { myRootReducer } from '../myApp/Reducers';
 * import { rootEpic } from '../sn-redux/Epics';
 *
 * const myRootEpic = combinedEpics(
 *  rootEpic,
 *  myCombinedEpics
 * );
 *
 * const store = Store.configureStore(myRootReducer, myRootEpic, [Authentication]);
 * ```
 */

/**
 * Epic for initialize a sensenet Redux store. It checks the InitSensenetStore Action and calls the necessary ones snycronously. Loads the current content,
 * checks the login state with CheckLoginState, fetch the children items with RequestContent and loads the current content related actions with
 * LoadContentActions.
 */
export const initSensenetStoreEpic = (action$, store, dependencies?: { repository: Repository.BaseRepository }) => {
    return action$.ofType('INIT_SENSENET_STORE')
        .mergeMap((action) => {

            store.dispatch(Actions.loadRepository(dependencies.repository.Config))
            // dependencies.repository.Authentication.State.skipWhile(state => state === Authentication.LoginState.Pending)
            //     .first()
            //     .map(result => {

            dependencies.repository.GetCurrentUser().subscribe((user) => {
                if (user.Name === 'Visitor') {
                    store.dispatch(Actions.userLoginFailure({ message: null }))
                } else {
                    store.dispatch(Actions.userChanged(user))
                    store.dispatch(Actions.userLoginSuccess(user))
                }
            })

            return dependencies.repository.Load(action.path, action.options)
                .map((response) => {
                    return Actions.receiveLoadedContent(response, action.options)
                })
                .catch((error) => {
                    return Observable.of(Actions.receiveLoadedContentFailure(action.options, error))
                })
        })
}
/**
 * Epic for fetching content from the Content Repository. It is related to three redux actions, returns the ```RequestContent``` action and sends the JSON response to the
 * ```ReceiveContent``` action if the ajax request ended successfully or catches the error if the request failed and sends the error message to the ```ReceiveContentFailure``` action.
 */
export const fetchContentEpic = (action$, store, dependencies?: { repository: Repository.BaseRepository }) => {
    return action$.ofType('FETCH_CONTENT_REQUEST')
        .mergeMap((action) => {
            const collection = new Collection.Collection([], dependencies.repository, action.contentType)
            return collection.Read(action.path, action.options)
                .map((response) => Actions.receiveContent(response, action.options))
                .catch((error) => {
                    return Observable.of(Actions.receiveContentFailure(action.options, error))
                })
        },
        )
}
/**
 * Epic for loading content from the Content Repository. It is related to three redux actions, returns the ```LoadContent``` action and sends the JSON response to the
 * ```ReceiveLoadedContent``` action if the ajax request ended successfully or catches the error if the request failed and sends the error message to the ```ReceiveLoadedContentFailure``` action.
 */
export const loadContentEpic = (action$, store, dependencies?: { repository: Repository.BaseRepository }) => {
    return action$.ofType('LOAD_CONTENT_REQUEST')
        .mergeMap((action) => {
            return dependencies.repository.Load(action.id, action.options)
                .map((response) => {
                    return Actions.receiveLoadedContent(response, action.options)
                })
                .catch((error) => {
                    return Observable.of(Actions.receiveLoadedContentFailure(action.options, error))
                })
        },
        )
}
/**
 * Epic for loading Actions of a content from the Content Repository. It is related to three redux actions, returns the ```LoadContentActions``` action and sends the JSON response to the
 * ```ReceiveContentActions``` action if the ajax request ended successfully or catches the error if the request failed and sends the error message to the ```ReceiveContentActionsFailure``` action.
 */
export const loadContentActionsEpic = (action$, store, dependencies?: { repository: Repository.BaseRepository }) => {
    return action$.ofType('LOAD_CONTENT_ACTIONS')
        .mergeMap((action) => {
            const c = dependencies.repository.HandleLoadedContent(action.content, ContentTypes.GenericContent)
            return c.GetActions(action.scenario)
                .map((result) => Actions.receiveContentActions(result))
                .catch((error) => Observable.of(Actions.receiveContentActionsFailure(error)))
        })
}
/**
 * Epic for reloading content from the Content Repository. It is related to three redux actions, returns the ```ReloadContent``` action and sends the JSON response to the
 * ```ReceiveReloadedContent``` action if the ajax request ended successfully or catches the error if the request failed and sends the error message to the ```ReceiveReloadedContentFailure``` action.
 */
export const reloadContentEpic = (action$, store, dependencies?: { repository: Repository.BaseRepository }) => {
    return action$.ofType('RELOAD_CONTENT_REQUEST')

        .mergeMap((action) => {
            const c = dependencies.repository.HandleLoadedContent(action.content, ContentTypes.GenericContent)
            return c.Reload(action.actionname)
                .map((response) => Actions.receiveReloadedContent(response))
                .catch((error) => {
                    return Observable.of(Actions.receiveReloadedContentFailure(error))
                })
        },
        )
}
/**
 * Epic for reloading fields of a content from the Content Repository. It is related to three redux actions, returns the ```ReloadContentFields``` action and sends the JSON response to the
 * ```ReceiveReloadedContentFields``` action if the ajax request ended successfully or catches the error if the request failed and sends the error message to the ```ReceiveReloadedContentFieldsFailure``` action.
 */
export const reloadContentFieldsEpic = (action$, store, dependencies?: { repository: Repository.BaseRepository }) => {
    return action$.ofType('RELOAD_CONTENTFIELDS_REQUEST')
        .mergeMap((action) => {
            const c = dependencies.repository.HandleLoadedContent(action.content, ContentTypes.GenericContent)
            return c.ReloadFields(action.fields)
                .map((response) => Actions.receiveReloadedContentFields(response))
                .catch((error) => {
                    return Observable.of(Actions.receiveReloadedContentFieldsFailure(error))
                })
        },
        )
}
/**
 * Epic for creating a Content in the Content Repository. It is related to three redux actions, returns ```CreateContent``` action and sends the JSON response to the
 * ```CreateContentSuccess``` action if the ajax request ended successfully or catches the error if the request failed and sends the error message to the ```CreateContentFailure``` action.
 */
export const createContentEpic = (action$, store, dependencies?: { repository: Repository.BaseRepository }) => {
    return action$.ofType('CREATE_CONTENT_REQUEST')
        .mergeMap((action) => {
            const c = dependencies.repository.HandleLoadedContent(action.content, ContentTypes.GenericContent)
            return c.Save()
                .map(Actions.createContentSuccess)
                .catch((error) => Observable.of(Actions.createContentFailure(error)))
        })
}
/**
 * Epic for updating metadata of a Content in the Content Repository. It is related to three redux actions, returns ```UpdateContent``` action and sends the JSON response to the
 * ```UpdateContentSuccess``` action if the ajax request ended successfully or catches the error if the request failed and sends the error message to the ```UpdateContentFailure``` action.
 */
export const updateContentEpic = (action$, store, dependencies?: { repository: Repository.BaseRepository }) => {
    return action$.ofType('UPDATE_CONTENT_REQUEST')
        .mergeMap((action) => {
            const c = dependencies.repository.HandleLoadedContent({ Id: action.content.Id, Name: action.content.Name, Path: action.content.Path })
            const fields = c.GetFields()
            for (const field in fields) {
                if (fields[field] !== action.content[field]) {
                    c[field] = action.content[field]
                }
            }
            return c.Save().share()
                .map(Actions.updateContentSuccess)
                .catch((error) => Observable.of(Actions.updateContentFailure(error)))
        })
}
/**
 * Epic to delete a Content from the Content Repository. It is related to three redux actions, returns ```Delete``` action and sends the response to the
 * ```DeleteSuccess``` action if the ajax request ended successfully or catches the error if the request failed and sends the error message to the ```DeleteFailure``` action.
 */
export const deleteContentEpic = (action$, store, dependencies?: { repository: Repository.BaseRepository }) => {
    return action$.ofType('DELETE_CONTENT_REQUEST')
        .mergeMap((action) => {
            const c = dependencies.repository.HandleLoadedContent(action.content, ContentTypes.GenericContent)
            return c.Delete(action.permanently)
                .map((response) => {
                    const state = store.getState()
                    const ids = Reducers.getIds(state.sensenet.children)
                    return Actions.deleteSuccess(ids.indexOf(action.content.Id), action.content.Id)
                })
                .catch((error) => Observable.of(Actions.deleteFailure(error)))
        })
}
/**
 * Epic to delete multiple Content from the Content Repository. It is related to three redux actions, returns ```DeleteBatch``` action and sends the response to the
 * ```DeleteBatchSuccess``` action if the ajax request ended successfully or catches the error if the request failed and sends the error message to the ```DeleteBatchFailure``` action.
 */
export const deleteBatchEpic = (action$, store, dependencies?: { repository: Repository.BaseRepository }) => {
    return action$.ofType('DELETE_BATCH_REQUEST')
        .mergeMap((action) => {
            const contentItems = Object.keys(action.contentItems).map((id) => {
                return dependencies.repository.HandleLoadedContent(action.contentItems[id], action.contentItems.__contentType)
            })
            return dependencies.repository.DeleteBatch(contentItems, action.permanently)
                .map((response) => {
                    return Actions.deleteBatchSuccess(response)
                })
                .catch((error) => Observable.of(Actions.deleteBatchFailure(error)))
        })
}
/**
 * Epic to copy multiple Content in the Content Repository. It is related to three redux actions, returns ```CopyBatch``` action and sends the response to the
 * ```CopyBatchSuccess``` action if the ajax request ended successfully or catches the error if the request failed and sends the error message to the ```CopyBatchFailure``` action.
 */
export const copyBatchEpic = (action$, store, dependencies?: { repository: Repository.BaseRepository }) => {
    return action$.ofType('COPY_BATCH_REQUEST')
        .mergeMap((action) => {
            const contentItems = Object.keys(action.contentItems).map((id) => {
                return dependencies.repository.HandleLoadedContent(action.contentItems[id], action.contentItems.__contentType)
            })
            return dependencies.repository.CopyBatch(contentItems, action.path)
                .map((response) => {
                    return Actions.copyBatchSuccess(response)
                })
                .catch((error) => Observable.of(Actions.copyBatchFailure(error)))
        })
}
/**
 * Epic to move multiple Content in the Content Repository. It is related to three redux actions, returns ```MoveBatch``` action and sends the response to the
 * ```MoveBatchSuccess``` action if the ajax request ended successfully or catches the error if the request failed and sends the error message to the ```MoveBatchFailure``` action.
 */
export const moveBatchEpic = (action$, store, dependencies?: { repository: Repository.BaseRepository }) => {
    return action$.ofType('MOVE_BATCH_REQUEST')
        .mergeMap((action) => {
            const contentItems = Object.keys(action.contentItems).map((id) => {
                return dependencies.repository.HandleLoadedContent(action.contentItems[id], action.contentItems.__contentType)
            })
            return dependencies.repository.MoveBatch(contentItems, action.path)
                .map((response) => {
                    return Actions.moveBatchSuccess(response)
                })
                .catch((error) => Observable.of(Actions.moveBatchFailure(error)))
        })
}
/**
 * Epic to checkout a Content in the Content Repository. It is related to three redux actions, returns ```CheckOut``` action and sends the response to the
 * ```CheckOutSuccess``` action if the ajax request ended successfully or catches the error if the request failed and sends the error message to the ```CheckOutFailure``` action.
 */
export const checkoutContentEpic = (action$, store, dependencies?: { repository: Repository.BaseRepository }) => {
    return action$.ofType('CHECKOUT_CONTENT_REQUEST')
        .mergeMap((action) => {
            const c = dependencies.repository.HandleLoadedContent(action.content, ContentTypes.GenericContent)
            return c.Checkout()
                .map(Actions.checkOutSuccess)
                .catch((error) => Observable.of(Actions.checkOutFailure(error)))
        })
}

/**
 * Epic to checkin a Content in the Content Repository. It is related to three redux actions, returns ```CheckIn``` action and sends the response to the
 * ```CheckInSuccess``` action if the ajax request ended successfully or catches the error if the request failed and sends the error message to the ```CheckInFailure``` action.
 */
export const checkinContentEpic = (action$, store, dependencies?: { repository: Repository.BaseRepository }) => {
    return action$.ofType('CHECKIN_CONTENT_REQUEST')
        .mergeMap((action) => {
            const c = dependencies.repository.HandleLoadedContent(action.content, ContentTypes.GenericContent)
            return c.CheckIn(action.checkinComment)
                .map(Actions.checkInSuccess)
                .catch((error) => Observable.of(Actions.checkInFailure(error)))
        })
}
/**
 * Epic to publish a Content in the Content Repository. It is related to three redux actions, returns ```Publish``` action and sends the response to the
 * ```PublishSuccess``` action if the ajax request ended successfully or catches the error if the request failed and sends the error message to the ```PublishFailure``` action.
 */
export const publishContentEpic = (action$, store, dependencies?: { repository: Repository.BaseRepository }) => {
    return action$.ofType('PUBLISH_CONTENT_REQUEST')
        .mergeMap((action) => {
            const c = dependencies.repository.HandleLoadedContent(action.content, ContentTypes.GenericContent)
            return c.Publish()
                .map(Actions.publishSuccess)
                .catch((error) => Observable.of(Actions.publishFailure(error)))
        })
}
/**
 * Epic to approve a Content in the Content Repository. It is related to three redux actions, returns ```Approve``` action and sends the response to the
 * ```ApproveSuccess``` action if the ajax request ended successfully or catches the error if the request failed and sends the error message to the ```ApproveFailure``` action.
 */
export const approveContentEpic = (action$, store, dependencies?: { repository: Repository.BaseRepository }) => {
    return action$.ofType('APPROVE_CONTENT_REQUEST')
        .mergeMap((action) => {
            const c = dependencies.repository.HandleLoadedContent(action.content, ContentTypes.GenericContent)
            return c.Approve()
                .map(Actions.approveSuccess)
                .catch((error) => Observable.of(Actions.approveFailure(error)))
        })
}
/**
 * Epic to reject a Content in the Content Repository. It is related to three redux actions, returns ```Reject``` action and sends the response to the
 * ```RejectSuccess``` action if the ajax request ended successfully or catches the error if the request failed and sends the error message to the ```RejectFailure``` action.
 */
export const rejectContentEpic = (action$, store, dependencies?: { repository: Repository.BaseRepository }) => {
    return action$.ofType('REJECT_CONTENT_REQUEST')
        .mergeMap((action) => {
            const c = dependencies.repository.HandleLoadedContent(action.content, ContentTypes.GenericContent)
            return c.Reject(action.rejectReason)
                .map(Actions.rejectSuccess)
                .catch((error) => Observable.of(Actions.rejectFailure(error)))
        })
}
/**
 * Epic to undo checkout a Content in the Content Repository. It is related to three redux actions, returns ```UndoCheckout``` action and sends the response to the
 * ```UndoCheckoutSuccess``` action if the ajax request ended successfully or catches the error if the request failed and sends the error message to the ```UndoCheckoutFailure``` action.
 */
export const undocheckoutContentEpic = (action$, store, dependencies?: { repository: Repository.BaseRepository }) => {
    return action$.ofType('UNDOCHECKOUT_CONTENT_REQUEST')
        .mergeMap((action) => {
            const c = dependencies.repository.HandleLoadedContent(action.content, ContentTypes.GenericContent)
            return c.UndoCheckout()
                .map(Actions.undoCheckoutSuccess)
                .catch((error) => Observable.of(Actions.undoCheckoutFailure(error)))
        })
}
/**
 * Epic to force undo checkout a Content in the Content Repository. It is related to three redux actions, returns ```ForceUndoCheckout``` action and sends the response to the
 * ```ForceUndoCheckoutSuccess``` action if the ajax request ended successfully or catches the error if the request failed and sends the error message to the ```ForceUndoCheckoutFailure``` action.
 */
export const forceundocheckoutContentEpic = (action$, store, dependencies?: { repository: Repository.BaseRepository }) => {
    return action$.ofType('FORCEUNDOCHECKOUT_CONTENT_REQUEST')
        .mergeMap((action) => {
            const c = dependencies.repository.HandleLoadedContent(action.content, ContentTypes.GenericContent)
            return c.ForceUndoCheckout()
                .map(Actions.forceUndoCheckoutSuccess)
                .catch((error) => Observable.of(Actions.forceUndoCheckoutFailure(error)))
        })
}
/**
 * Epic to restore a version of a Content in the Content Repository. It is related to three redux actions, returns ```RestoreVersion``` action and sends the response to the
 * ```RestoreVersionSuccess``` action if the ajax request ended successfully or catches the error if the request failed and sends the error message to the ```RestoreVersionFailure``` action.
 */
export const restoreversionContentEpic = (action$, store, dependencies?: { repository: Repository.BaseRepository }) => {
    return action$.ofType('RESTOREVERSION_CONTENT_REQUEST')
        .mergeMap((action) => {
            const c = dependencies.repository.HandleLoadedContent(action.content, ContentTypes.GenericContent)
            return c.RestoreVersion(action.version)
                .map(Actions.restoreVersionSuccess)
                .catch((error) => Observable.of(Actions.restoreVersionFailure(error)))
        })
}

/**
 * Epic to wait for the current login state to be initialized
 */
export const checkLoginStateEpic = (action$, store, dependencies?: { repository: Repository.BaseRepository }) => {
    return action$.ofType('CHECK_LOGIN_STATE_REQUEST')
        .mergeMap((action) => {
            return dependencies.repository.Authentication.State.skipWhile((state) => state === Authentication.LoginState.Pending)
                .first()
                .map((result) => {
                    return result === Authentication.LoginState.Authenticated ?
                        Actions.userLoginBuffer(true)
                        :
                        Actions.userLoginFailure({ message: null })
                })
        })
}

/**
 * Epic to login a user to a sensenet portal. It is related to three redux actions, returns ```LoginUser``` action and sends the response to the
 * ```LoginUserSuccess``` action if the ajax request ended successfully or catches the error if the request failed and sends the error message to the ```LoginUserFailure``` action.
 */
export const userLoginEpic = (action$, store, dependencies?: { repository: Repository.BaseRepository }) => {
    return action$.ofType('USER_LOGIN_REQUEST')
        .mergeMap((action) => {
            return dependencies.repository.Authentication.Login(action.userName, action.password)
                // .combineLatest(dependencies.repository.GetCurrentUser().skipWhile(u => u.Name === 'Visitor'))
                // .skipWhile(u => u instanceof ContentTypes.User)
                // .first()
                .map((result) => {
                    return result ?
                        Actions.userLoginBuffer(result)
                        :
                        Actions.userLoginFailure({ message: 'Failed to log in.' })
                })
                .catch((error) => Observable.of(Actions.userLoginFailure(error)))
        })
}
/**
 * Epic to login a user to a sensenet portal. It is related to three redux actions, returns ```LoginUser``` action and sends the response to the
 * ```LoginUserSuccess``` action if the ajax request ended successfully or catches the error if the request failed and sends the error message to the ```LoginUserFailure``` action.
 */
export const userLoginGoogleEpic = (action$, store, dependencies?: { repository: Repository.BaseRepository }) => {
    return action$.ofType('USER_LOGIN_GOOGLE')
        .mergeMap((action) => {
            return Observable.of(dependencies.repository.Authentication.GetOauthProvider(GoogleOauthProvider).Login())
                .map((result) => {
                    return Actions.userLoginBuffer(true)
                })
                .catch((error) => Observable.of(Actions.userLoginFailure(error)))
        })
}
/**
 * Epic to login buffer. It is related to three redux actions, returns ```LoginUser``` action and sends the response to the
 * ```LoginUserSuccess``` action if the ajax request ended successfully or catches the error if the request failed and sends the error message to the ```LoginUserFailure``` action.
 */
export const userLoginBufferEpic = (action$, store, dependencies?: { repository: Repository.BaseRepository }) => {
    return action$.ofType('USER_LOGIN_BUFFER')
        .mergeMap((action) => {
            return dependencies.repository.GetCurrentUser().skipWhile((u) => u.Name === 'Visitor')
                .map((result) => {
                    Actions.userLoginSuccess(result)
                })
                .catch((error) => Observable.of(Actions.userLoginFailure(error)))
        })
}
/**
 * Epic to logout a user from a sensenet portal. It is related to three redux actions, returns ```LogoutUser``` action and sends the response to the
 * ```LogoutUserSuccess``` action if the ajax request ended successfully or catches the error if the request failed and sends the error message to the ```LogoutUserFailure``` action.
 */
export const userLogoutEpic = (action$, store, dependencies?: { repository: Repository.BaseRepository }) => {
    return action$.ofType('USER_LOGOUT_REQUEST')
        .mergeMap((action) => {
            return dependencies.repository.Authentication.Logout()
                .map(Actions.userLogoutSuccess)
                .catch((error) => Observable.of(Actions.userLogoutFailure(error)))
        })
}
/**
 * Epic to get actions of a Contet in a sensenet portal. It is related to three redux actions, returns ```HandleLoadedContent``` action and sends the response to the
 * ```requestContentActionsSuccess``` action if the ajax request ended successfully or catches the error if the request failed and sends the error message to the ```requestContentActionsFailure``` action.
 */
export const getContentActions = (action$, store, dependencies?: { repository: Repository.BaseRepository }) => {
    return action$.ofType('REQUEST_CONTENT_ACTIONS')
        .mergeMap((action) => {
            const c = dependencies.repository.HandleLoadedContent(action.content, ContentTypes.GenericContent)
            return c.GetActions(action.scenario)
                .map((result) => Actions.requestContentActionsSuccess([...result, ...action.customItems], action.content.Id))
                .catch((error) => Observable.of(Actions.requestContentActionsFailure(error)))
        })
}
/**
 * Epic to upload a file to the Content Repository. It is related to three redux actions, returns ```UploadContent``` action and sends the response to the
 * ```UploadSuccess``` action if the ajax request ended successfully or catches the error if the request failed and sends the error message to the ```UploadFailure``` action.
 */
export const uploadFileEpic = (action$, store, dependencies?: { repository: Repository.BaseRepository }) => {
    return action$.ofType('UPLOAD_CONTENT_REQUEST')
        .mergeMap((action) => {
            return action.content.UploadFile({
                File: action.file,
                ContentType: action.contentType,
                OverWrite: action.overwrite,
                Body: action.body,
                PropertyName: action.propertyName,
                OdataOptions: {
                    Scenario: action.scenario,
                },
            })
                .map((response) => {
                    return Actions.uploadSuccess(response)
                })
                .catch((error) => Observable.of(Actions.uploadFailure(error)))
        })
}
/**
 * sn-redux root Epic, the main Epic combination that is used on a default sensenet application. Contains Epics related to CRUD operations and thr other built-in sensenet
 * [OData Actions and Function](http://wiki.sensenet.com/Built-in_OData_actions_and_functions).
 */
export const rootEpic = combineEpics(
    initSensenetStoreEpic,
    fetchContentEpic,
    loadContentEpic,
    loadContentActionsEpic,
    createContentEpic,
    updateContentEpic,
    deleteContentEpic,
    deleteBatchEpic,
    copyBatchEpic,
    moveBatchEpic,
    checkoutContentEpic,
    checkinContentEpic,
    publishContentEpic,
    approveContentEpic,
    rejectContentEpic,
    undocheckoutContentEpic,
    forceundocheckoutContentEpic,
    restoreversionContentEpic,
    userLoginEpic,
    userLoginGoogleEpic,
    userLogoutEpic,
    checkLoginStateEpic,
    getContentActions,
    uploadFileEpic,
)
