import { Repository } from '@sensenet/client-core'
import * as Chai from 'chai'
import { applyMiddleware, combineReducers, createStore } from 'redux'
import { createLogger } from 'redux-logger'
import * as Store from '../src/Store'
const expect = Chai.expect

describe('Store', () => {
    const repository = new Repository({}, async () => ({ ok: true } as any))
    const loggerMiddleware = createLogger()
    const middlewareArray = []
    middlewareArray.push(loggerMiddleware)
    const myReducer = combineReducers({})
    const store = createStore(
        myReducer,
        {},
        applyMiddleware(...middlewareArray),
    )
    it('should return a redux store', () => {
        expect(typeof Store.configureStore({ repository, rootReducer: myReducer })).to.be.equal(typeof store)
    })
    it('should return a redux store', () => {
        expect(typeof Store.configureStore({ repository, rootReducer: myReducer, middlewares: null, persistedState: {} })).to.be.equal(typeof store)
    })
    it('should return a redux store', () => {
        expect(typeof Store.configureStore({ repository, rootReducer: myReducer, middlewares: null })).to.be.equal(typeof store)
    })
    it('should return a redux store', () => {
        expect(typeof Store.configureStore({ repository, rootReducer: myReducer, middlewares: middlewareArray })).to.be.equal(typeof store)
    })
})
