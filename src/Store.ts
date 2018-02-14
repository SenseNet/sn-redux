import { applyMiddleware, createStore, Store } from 'redux'
import { createLogger } from 'redux-logger'

/**
 * Module for configuring a store.
 *
 * It is actually a redux based data store, that lets you keep your application data in on place, allows you to access (get and update) the application state or subscribe to its listeners.
 *
 * Two middlewares are built-in:
 * * [redux-observable](https://redux-observable.js.org/) is as RxJS 5-based middleware for Redux. It's needed to compose and cancel async actions to create side effects and more,
 * so that your app are able to get or post data to sensenet Content Repository through OData with ajax requests.
 * * [redux-logger](https://github.com/evgenyrodionov/redux-logger) creates a detailed log on the dev toolbar console on all state changes.
 * You can add other middlewares too through the configureStore functions second param as an array of middlewares. But the built-in middlewares will be the part of the applied middleware group
 * in every way.
 *
 * ```
 * import * as React from "react";
 * import * as ReactDOM from "react-dom";
 * import Authentication from 'redux-authentication'
 * import { myRootReducer } from '../myApp/Reducers'
 * import { myRootEpic } from '../myApp/Epics'
 *
 * const store = Store.configureStore(myRootReducer, myRootEpic, [Authentication]);
 *
 * ReactDOM.render(
 * <Root store={store} />,
 * document.getElementById("root")
 * );
 * ```
 */

/**
 * Method to create a Redux store that holds the application state.
 * @param {any} [rootReducer=Reducers.sensenet] Root reducer of your application.
 * @param {Repository.BaseRepository<any,any>} The sensenet Repository
 * @param {any} [rootEpic=Epics.rootEpic] Root epic of your application.
 * @param {Array<any>=} middlewares Array of middlewares.
 * @param {Object=} persistedState Persisted state.
 * @returns {Store} Returns a Redux store, an object that holds the application state.
 * ```
 * import * as React from "react";
 * import * as ReactDOM from "react-dom";
 * import Authentication from 'redux-authentication'
 * import { myRootReducer } from '../myApp/Reducers'
 * import { myRootEpic } from '../myApp/Epics'
 *
 * const repository = new Repository.SnRepository({
 *  RepositoryUrl: 'https://sn-services/'
 * });
 * const store = Store.configureStore(myRootReducer, myRootEpic, [Authentication], {}, repository);
 *
 * ReactDOM.render(
 * <Root store={store} />,
 * document.getElementById("root")
 * );
 * ```
 */

export interface CreateStoreOptions {
    rootReducer,
    repository,
    middlewares?,
    persistedState?
}
/**
 * Method that configures a sensenet Redux store
 * @param options
 */
export const configureStore: (options: CreateStoreOptions) => Store<any> = (options: CreateStoreOptions) => {
    // let epicMiddleware

    // if (typeof rootEpic === 'undefined' || rootEpic === null) {
    //     epicMiddleware = createEpicMiddleware(Epics.rootEpic, { dependencies: { repository } })
    // } else {
    //     epicMiddleware = createEpicMiddleware(rootEpic, { dependencies: { repository } })
    // }
    let middlewareArray = []
    if (typeof options.middlewares === 'undefined' || options.middlewares === null) {
        // middlewareArray.push(epicMiddleware)
    } else {
        middlewareArray = [...options.middlewares]
    }
    const loggerMiddleware = createLogger()
    middlewareArray.push(loggerMiddleware)

    if (options.persistedState && typeof options.persistedState !== 'undefined') {
        return createStore(
            options.rootReducer,
            options.persistedState,
            applyMiddleware(...middlewareArray),
        )
    } else {
        return createStore(
            options.rootReducer,
            applyMiddleware(...middlewareArray),
        )
    }
}
