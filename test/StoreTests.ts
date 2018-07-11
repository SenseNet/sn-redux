import { Repository } from '@sensenet/client-core'
import * as Chai from 'chai'
import { combineReducers, Reducer } from 'redux'
import { createLogger } from 'redux-logger'
import { createSensenetStore } from '../src/Store'
const expect = Chai.expect

declare var global: any

global.window = {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: () => {
        // aaa
    },
}

describe('Store', () => {

    const repository = new Repository({}, async () => ({ ok: true } as any))
    const loggerMiddleware = createLogger()
    const middlewareArray = []
    middlewareArray.push(loggerMiddleware)
    const enhancers = []

    const testReducer: Reducer<{ testValue: number }> = (state = { testValue: 1 }, action) => {
        return state
    }

    const rootReducer = combineReducers<{ testReducer: { testValue: number } }>({
        testReducer,
    })

    it('should return a redux store', () => {
        expect(createSensenetStore({ repository, rootReducer })).to.be.instanceof(Object)
    })
    it('should return a redux store', () => {
        expect(createSensenetStore({ repository, rootReducer, middlewares: null, persistedState: { testReducer: { testValue: 3 } } })).to.be.instanceof(Object)
    })
    it('should return a redux store', () => {
        expect(createSensenetStore({ repository, rootReducer, middlewares: null })).to.be.instanceof(Object)
    })
    it('should return a redux store', () => {
        expect(createSensenetStore({ repository, rootReducer, middlewares: middlewareArray })).to.be.instanceof(Object)
    })

    it('should return a redux store', () => {
        expect(createSensenetStore({ repository, rootReducer, middlewares: middlewareArray, logger: true })).to.be.instanceof(Object)
    })

    it('should return a redux store', () => {
        expect(createSensenetStore({ repository, rootReducer, middlewares: middlewareArray, devTools: true })).to.be.instanceof(Object)
    })

    it('should return a redux store', () => {
        expect(createSensenetStore({ repository, rootReducer, middlewares: middlewareArray, enhancers })).to.be.instanceof(Object)
    })

    it('should return a redux store', () => {
        global.window = { }
        expect(createSensenetStore({ repository, rootReducer, middlewares: middlewareArray })).to.be.instanceof(Object)
    })

    it('should return a redux store', () => {
        global.window = { }
        expect(createSensenetStore({ repository, rootReducer, middlewares: middlewareArray, devTools: true })).to.be.instanceof(Object)
    })

    it('default state should be applied', () => {
        const tempStore = createSensenetStore({ repository, rootReducer, middlewares: middlewareArray })
        const state = tempStore.getState()
        expect(state.testReducer.testValue).to.be.eq(1)
    })

    it('persisted state should be applied', () => {
        const tempStore = createSensenetStore({ repository, rootReducer, middlewares: middlewareArray, persistedState: { testReducer: { testValue: 3 } } })
        const state = tempStore.getState()
        expect(state.testReducer.testValue).to.be.eq(3)
    })
})
