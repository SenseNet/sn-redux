import { LoginState, Repository } from '@sensenet/client-core'
import { Status, Task } from '@sensenet/default-content-types'
import * as Chai from 'chai'
import * as Reducers from '../src/Reducers'
const expect = Chai.expect
describe('Reducers', () => {
    describe('country reducer', () => {
        it('should return the initial state', () => {
            expect(Reducers.country(undefined, {})).to.be.deep.equal('')
        })
    })

    describe('language reducer', () => {
        const user = { Language: ['hu-HU'] }
        const user2 = {}
        it('should return the initial state', () => {
            expect(Reducers.language(undefined, {})).to.be.deep.equal('en-US')
        })
        it('should return the language set on the user', () => {
            expect(Reducers.language(undefined, { type: 'USER_CHANGED', user })).to.be.deep.equal('hu-HU')
        })
        it('should return the initial language', () => {
            expect(Reducers.language(undefined, { type: 'USER_CHANGED', user: user2 })).to.be.deep.equal('en-US')
        })
    })

    describe('loginState reducer', () => {
        it('should return the initial state', () => {
            expect(Reducers.loginState(undefined, {})).to.be.deep.equal(LoginState.Pending)
        })
        it('should return the new state', () => {
            expect(Reducers.loginState(undefined, { type: 'USER_LOGIN_STATE_CHANGED', loginState: LoginState.Authenticated })).to.be.deep.equal(LoginState.Authenticated)
        })
    })

    describe('loginError reducer', () => {
        it('should return the initial state', () => {
            expect(Reducers.loginError(undefined, {})).to.be.deep.equal(null)
        })
        it('should return null', () => {
            expect(Reducers.loginError(undefined, { type: 'USER_LOGIN_SUCCESS', payload: true })).to.be.deep.equal(null)
        })
        it('should return an error message', () => {
            expect(Reducers.loginError(undefined, { type: 'USER_LOGIN_SUCCESS', payload: false })).to.be.deep.equal('Wrong username or password!')
        })
        it('should return an error message', () => {
            expect(Reducers.loginError(undefined, { type: 'USER_LOGIN_FAILURE', payload: { message: 'error' } })).to.be.deep.equal('error')
        })
        it('should return an error message', () => {
            expect(Reducers.loginError(undefined, { type: 'USER_LOGOUT_FAILURE', payload: { message: 'error' } })).to.be.deep.equal('error')
        })
    })

    describe('userName reducer', () => {
        it('should return the initial state', () => {
            expect(Reducers.userName(undefined, {}).LoginName).to.be.deep.equal('Visitor')
        })
        it('should return the logged-in users name', () => {
            expect(Reducers.userName(undefined, { type: 'USER_CHANGED', user: { Name: 'Alba' } })).to.be.deep.equal('Alba')
        })
    })

    describe('fullName reducer', () => {
        it('should return the initial state', () => {
            expect(Reducers.fullName(undefined, {}).DisplayName).to.be.deep.equal('Visitor')
        })
        it('should return the logged-in users full-name', () => {
            expect(Reducers.fullName(undefined, { type: 'USER_CHANGED', user: { DisplayName: 'Alba Monday' } })).to.be.deep.equal('Alba Monday')
        })
    })

    describe('userLanguage reducer', () => {
        const user = { Language: ['hu-HU'] }
        const user2 = {}
        it('should return the initial state', () => {
            expect(Reducers.userLanguage(undefined, {})).to.be.deep.equal('en-US')
        })
        it('should return the language set on the user', () => {
            expect(Reducers.userLanguage(undefined, { type: 'USER_CHANGED', user })).to.be.deep.equal('hu-HU')
        })
        it('should return the initial language', () => {
            expect(Reducers.userLanguage(undefined, { type: 'USER_CHANGED', user: user2 })).to.be.deep.equal('en-US')
        })
    })

    describe('userAvatarPath reducer', () => {
        it('should return the initial state', () => {
            expect(Reducers.userAvatarPath(undefined, {})).to.be.deep.equal('')
        })
        it('should return the initial state', () => {
            expect(Reducers.userAvatarPath(undefined, { type: 'USER_CHANGED', user: { DisplayName: 'Alba Monday' } })).to.be.deep.equal('')
        })
        it('should return the logged-in users avatars path', () => {
            expect(Reducers.userAvatarPath(undefined, { type: 'USER_CHANGED', user: { Avatar: { _deferred: 'Alba Monday' } } })).to.be.deep.equal('Alba Monday')
        })
    })

    describe('ids reducer', () => {
        it('should return the initial state', () => {
            expect(Reducers.ids(undefined, {})).to.be.deep.equal([])
        })
        it('should handle FETCH_CONTENT_SUCCESS', () => {
            expect(Reducers.ids([],
                {
                    type: 'FETCH_CONTENT_SUCCESS',
                    payload: {
                        result: [5145, 5146],
                        entities: {
                            collection: {
                                5145: {
                                    Id: 5145,
                                    DisplayName: 'Some Article',
                                    Status: ['Active'],
                                },
                                5146: {
                                    Id: 5146,
                                    Displayname: 'Other Article',
                                    Status: ['Completed'],
                                },
                            },
                        },
                    },
                    filter: '?$select=Id,Type&metadata=no',
                }))
                .to.be.deep.equal([5145, 5146])
        })
        it('should handle CREATE_CONTENT_SUCCESS', () => {
            expect(Reducers.ids(
                [1, 2, 3],
                {
                    type: 'CREATE_CONTENT_SUCCESS',
                    payload: {
                        Id: 4,
                    },
                }))
                .to.be.deep.equal([1, 2, 3, 4])
        })
        it('should handle DELETE_CONTENT_SUCCESS', () => {
            expect(Reducers.ids(
                [1, 2, 3],
                {
                    type: 'DELETE_CONTENT_SUCCESS',
                    index: 0,
                    id: 1,
                }))
                .to.be.deep.equal([2, 3])
        })
        it('should handle UPDATE_CONTENT_SUCCESS', () => {
            expect(Reducers.ids(
                [1, 2, 3],
                {
                    type: 'UPLOAD_CONTENT_SUCCESS',
                    payload: {
                        Id: 4,
                    },
                }))
                .to.be.deep.equal([1, 2, 3, 4])
        })
        it('should handle UPDATE_CONTENT_SUCCESS with existing id', () => {
            expect(Reducers.ids(
                [1, 2, 3],
                {
                    type: 'UPLOAD_CONTENT_SUCCESS',
                    payload: {
                        Id: 3,
                    },
                }))
                .to.be.deep.equal([1, 2, 3])
        })
        it('should handle DELETE_BATCH_SUCCESS', () => {
            expect(Reducers.ids([1, 2, 3], {
                type: 'DELETE_BATCH_SUCCESS',
                payload: {
                    d: {
                        results: [
                            { Id: 1 },
                            { Id: 2 },
                        ],
                        errors: [],
                    },
                },
            })).to.be.deep.equal([3])
        })
        it('should handle DELETE_BATCH_SUCCESS', () => {
            expect(Reducers.ids([1, 2, 3], {
                type: 'DELETE_BATCH_SUCCESS',
                payload: {
                    d: {
                        results: [],
                        errors: [],
                    },
                },
            })).to.be.deep.equal([1, 2, 3])
        })
        it('should handle MOVE_BATCH_SUCCESS', () => {
            expect(Reducers.ids([1, 2, 3], {
                type: 'MOVE_BATCH_SUCCESS',
                payload: {
                    d: {
                        results: [
                            { Id: 1 },
                            { Id: 2 },
                        ],
                        errors: [],
                    },
                },
            })).to.be.deep.equal([3])
        })
        it('should handle MOVE_BATCH_SUCCESS', () => {
            expect(Reducers.ids([1, 2, 3], {
                type: 'MOVE_BATCH_SUCCESS',
                payload: {
                    d: {
                        results: [],
                        errors: [],
                    },
                },
            })).to.be.deep.equal([1, 2, 3])
        })
    })

    describe('entities reducer', () => {
        it('should return the initial state', () => {
            expect(Reducers.entities(undefined, {})).to.be.deep.equal({})
        })
        it('should handle DELETE_CONTENT_SUCCESS', () => {
            const ids = [1, 2, 3]
            expect(Reducers.entities(ids, { type: 'DELETE_CONTENT_SUCCESS', id: 1 })).to.be.deep.equal({ 0: 1, 2: 3 })
        })
        it('should return a new state with the given response', () => {
            expect(Reducers.entities({}, { payload: { entities: { entities: { a: 0, b: 2 } } } }))
                .to.be.deep.eq({ a: 0, b: 2 })
        })
        it('should handle UPDATE_CONTENT_SUCCESS', () => {
            const entities = {
                5145: {
                    Id: 5145,
                    DisplayName: 'Some Article',
                    Status: ['Active'],
                },
                5146: {
                    Id: 5146,
                    Displayname: 'Other Article',
                    Status: ['Completed'],
                },
            }
            expect(Reducers.entities(entities, { type: 'UPDATE_CONTENT_SUCCESS', payload: { Id: 5145, DisplayName: 'aaa', Status: ['Active'] } })).to.be.deep.equal(
                {
                    5145: {
                        Id: 5145,
                        DisplayName: 'aaa',
                        Status: ['Active'],
                    },
                    5146: {
                        Id: 5146,
                        Displayname: 'Other Article',
                        Status: ['Completed'],
                    },
                },
            )
        })
        it('should handle UPLOAD_CONTENT_SUCCESS', () => {
            const entities = {
                5122: {
                    Id: 5122,
                    DisplayName: 'Some Article',
                    Status: ['Active'],
                },
                5146: {
                    Id: 5146,
                    Displayname: 'Other Article',
                    Status: ['Completed'],
                },
            }
            expect(Reducers.entities(entities, { type: 'UPLOAD_CONTENT_SUCCESS', payload: { Id: 5145, DisplayName: 'aaa', Status: ['Active'] } })).to.be.deep.equal(
                {
                    5122: {
                        Id: 5122,
                        DisplayName: 'Some Article',
                        Status: ['Active'],
                    },
                    5146: {
                        Id: 5146,
                        Displayname: 'Other Article',
                        Status: ['Completed'],
                    },
                    5145: {
                        Id: 5145,
                        DisplayName: 'aaa',
                        Status: ['Active'],
                    },
                },
            )
        })
        it('should handle UPLOAD_CONTENT_SUCCESS with existing content', () => {
            const entities = {
                5122: {
                    Id: 5122,
                    DisplayName: 'Some Article',
                    Status: ['Active'],
                },
                5146: {
                    Id: 5146,
                    Displayname: 'Other Article',
                    Status: ['Completed'],
                },
            }
            expect(Reducers.entities(entities, { type: 'UPLOAD_CONTENT_SUCCESS', payload: { Id: 5122, DisplayName: 'Some Article', Status: ['Active'] } })).to.be.deep.equal(
                {
                    5122: {
                        Id: 5122,
                        DisplayName: 'Some Article',
                        Status: ['Active'],
                    },
                    5146: {
                        Id: 5146,
                        Displayname: 'Other Article',
                        Status: ['Completed'],
                    },
                },
            )
        })
        it('should handle DELETE_BATCH_SUCCESS', () => {
            const entities = {
                5122: {
                    Id: 5122,
                    DisplayName: 'Some Article',
                    Status: ['Active'],
                },
                5146: {
                    Id: 5146,
                    Displayname: 'Other Article',
                    Status: ['Completed'],
                },
            }
            expect(Reducers.entities(entities, {
                type: 'DELETE_BATCH_SUCCESS',
                payload: {
                    d: {
                        results: [
                            { Id: 5122 },
                        ],
                        errors: [],
                    },
                },
            })).to.be.deep.equal({
                5146: {
                    Id: 5146,
                    Displayname: 'Other Article',
                    Status: ['Completed'],
                },
            })
        })
        it('should handle a custom Action', () => {
            expect(Reducers.entities(undefined, {
                type: 'AAAA',
                payload: {
                    d: {
                        results: [
                            { Id: 5122 },
                        ],
                        errors: [],
                    },
                },
            })).to.be.deep.equal({})
        })
    })

    describe('isFetching reducer', () => {
        it('should return the initial state', () => {
            expect(Reducers.isFetching(undefined, {})).to.be.eq(false)
        })
        it('should handle FETCH_CONTENT_LOADING', () => {
            expect(Reducers.isFetching(false, { type: 'FETCH_CONTENT_LOADING' })).to.be.eq(true)
        })
        it('should handle FETCH_CONTENT', () => {
            expect(Reducers.isFetching(true, { type: 'FETCH_CONTENT' })).to.be.eq(false)
        })
        it('should handle FETCH_CONTENT_SUCCESS', () => {
            expect(Reducers.isFetching(true, { type: 'FETCH_CONTENT_SUCCESS' })).to.be.eq(false)
        })
        it('should handle FETCH_CONTENT_FAILURE', () => {
            expect(Reducers.isFetching(true, { type: 'FETCH_CONTENT_FAILURE' })).to.be.eq(false)
        })
    })

    describe('childrenerror reducer', () => {
        it('should return the initial state', () => {
            expect(Reducers.childrenerror(undefined, {})).to.be.eq(null)
        })
        it('should handle FETCH_CONTENT_FAILURE', () => {
            expect(Reducers.childrenerror(null, { type: 'FETCH_CONTENT_FAILURE', payload: { message: 'error' } })).to.be.eq('error')
        })
        it('should handle CREATE_CONTENT_FAILURE', () => {
            expect(Reducers.childrenerror(null, { type: 'CREATE_CONTENT_FAILURE', payload: { message: 'error' } })).to.be.eq(null)
        })
        it('should handle UPDATE_CONTENT_FAILURE', () => {
            expect(Reducers.childrenerror(null, { type: 'UPDATE_CONTENT_FAILURE', payload: { message: 'error' } })).to.be.eq(null)
        })
        it('should handle DELETE_CONTENT_FAILURE', () => {
            expect(Reducers.childrenerror(null, { type: 'DELETE_CONTENT_FAILURE', payload: { message: 'error' } })).to.be.eq(null)
        })
        it('should handle CHECKIN_CONTENT_FAILURE', () => {
            expect(Reducers.childrenerror(null, { type: 'CHECKIN_CONTENT_FAILURE', payload: { message: 'error' } })).to.be.eq(null)
        })
        it('should handle CHECKOUT_CONTENT_FAILURE', () => {
            expect(Reducers.childrenerror(null, { type: 'CHECKOUT_CONTENT_FAILURE', payload: { message: 'error' } })).to.be.eq(null)
        })
        it('should handle PUBLISH_CONTENT_FAILURE', () => {
            expect(Reducers.childrenerror(null, { type: 'PUBLISH_CONTENT_FAILURE', payload: { message: 'error' } })).to.be.eq(null)
        })
        it('should handle APPROVE_CONTENT_FAILURE', () => {
            expect(Reducers.childrenerror(null, { type: 'APPROVE_CONTENT_FAILURE', payload: { message: 'error' } })).to.be.eq(null)
        })
        it('should handle REJECT_CONTENT_FAILURE', () => {
            expect(Reducers.childrenerror(null, { type: 'REJECT_CONTENT_FAILURE', payload: { message: 'error' } })).to.be.eq(null)
        })
        it('should handle UNDOCHECKOUT_CONTENT_FAILURE', () => {
            expect(Reducers.childrenerror(null, { type: 'UNDOCHECKOUT_CONTENT_FAILURE', payload: { message: 'error' } })).to.be.eq(null)
        })
        it('should handle FORCEUNDOCHECKOUT_CONTENT_FAILURE', () => {
            expect(Reducers.childrenerror(null, { type: 'FORCEUNDOCHECKOUT_CONTENT_FAILURE', payload: { message: 'error' } })).to.be.eq(null)
        })
        it('should handle RESTOREVERSION_CONTENT_FAILURE', () => {
            expect(Reducers.childrenerror(null, { type: 'RESTOREVERSION_CONTENT_FAILURE', payload: { message: 'error' } })).to.be.eq(null)
        })
        it('should handle FETCH_CONTENT', () => {
            expect(Reducers.childrenerror(null, { type: 'FETCH_CONTENT' })).to.be.eq(null)
        })
        it('should handle FETCH_CONTENT_SUCCESS', () => {
            expect(Reducers.childrenerror(null, { type: 'FETCH_CONTENT_SUCCESS' })).to.be.eq(null)
        })
        it('should handle CREATE_CONTENT', () => {
            expect(Reducers.childrenerror(null, { type: 'CREATE_CONTENT' })).to.be.eq(null)
        })
        it('should handle CREATE_CONTENT_SUCCESS', () => {
            expect(Reducers.childrenerror(null, { type: 'CREATE_CONTENT_SUCCESS' })).to.be.eq(null)
        })
        it('should handle UPDATE_CONTENT', () => {
            expect(Reducers.childrenerror(null, { type: 'UPDATE_CONTENT' })).to.be.eq(null)
        })
        it('should handle UPDATE_CONTENT_SUCCESS', () => {
            expect(Reducers.childrenerror(null, { type: 'UPDATE_CONTENT_SUCCESS' })).to.be.eq(null)
        })
        it('should handle DELETE_CONTENT', () => {
            expect(Reducers.childrenerror(null, { type: 'DELETE_CONTENT' })).to.be.eq(null)
        })
        it('should handle DELETE_CONTENT_SUCCESS', () => {
            expect(Reducers.childrenerror(null, { type: 'DELETE_CONTENT_SUCCESS' })).to.be.eq(null)
        })
        it('should handle CHECKIN_CONTENT', () => {
            expect(Reducers.childrenerror(null, { type: 'CHECKIN_CONTENT' })).to.be.eq(null)
        })
        it('should handle CHECKIN_CONTENT_SUCCESS', () => {
            expect(Reducers.childrenerror(null, { type: 'CHECKIN_CONTENT_SUCCESS' })).to.be.eq(null)
        })
        it('should handle CHECKOUT_CONTENT', () => {
            expect(Reducers.childrenerror(null, { type: 'CHECKOUT_CONTENT' })).to.be.eq(null)
        })
        it('should handle CHECKOUT_CONTENT_SUCCESS', () => {
            expect(Reducers.childrenerror(null, { type: 'CHECKOUT_CONTENT_SUCCESS' })).to.be.eq(null)
        })
        it('should handle APPROVE_CONTENT', () => {
            expect(Reducers.childrenerror(null, { type: 'APPROVE_CONTENT' })).to.be.eq(null)
        })
        it('should handle APPROVE_CONTENT_SUCCESS', () => {
            expect(Reducers.childrenerror(null, { type: 'APPROVE_CONTENT_SUCCESS' })).to.be.eq(null)
        })
        it('should handle PUBLISH_CONTENT', () => {
            expect(Reducers.childrenerror(null, { type: 'PUBLISH_CONTENT' })).to.be.eq(null)
        })
        it('should handle PUBLISH_CONTENT_SUCCESS', () => {
            expect(Reducers.childrenerror(null, { type: 'PUBLISH_CONTENT_SUCCESS' })).to.be.eq(null)
        })
        it('should handle REJECT_CONTENT', () => {
            expect(Reducers.childrenerror(null, { type: 'REJECT_CONTENT' })).to.be.eq(null)
        })
        it('should handle REJECT_CONTENT_SUCCESS', () => {
            expect(Reducers.childrenerror(null, { type: 'REJECT_CONTENT_SUCCESS' })).to.be.eq(null)
        })
        it('should handle UNDOCHECKOUT_CONTENT', () => {
            expect(Reducers.childrenerror(null, { type: 'UNDOCHECKOUT_CONTENT' })).to.be.eq(null)
        })
        it('should handle UNDOCHECKOUT_CONTENT_SUCCESS', () => {
            expect(Reducers.childrenerror(null, { type: 'UNDOCHECKOUT_CONTENT_SUCCESS' })).to.be.eq(null)
        })
        it('should handle FORCEUNDOCHECKOUT_CONTENT', () => {
            expect(Reducers.childrenerror(null, { type: 'FORCEUNDOCHECKOUT_CONTENT' })).to.be.eq(null)
        })
        it('should handle FORCEUNDOCHECKOUT_CONTENT_SUCCESS', () => {
            expect(Reducers.childrenerror(null, { type: 'FORCEUNDOCHECKOUT_CONTENT_SUCCESS' })).to.be.eq(null)
        })
        it('should handle RESTOREVERSION_CONTENT', () => {
            expect(Reducers.childrenerror(null, { type: 'RESTOREVERSION_CONTENT' })).to.be.eq(null)
        })
        it('should handle RESTOREVERSION_CONTENT_SUCCESS', () => {
            expect(Reducers.childrenerror(null, { type: 'RESTOREVERSION_CONTENT_SUCCESS' })).to.be.eq(null)
        })
    })
    describe('childrenactions reducer', () => {
        it('should return the initial state', () => {
            expect(Reducers.childrenactions(undefined, {})).to.be.deep.equal([])
        })
        it('should handle REQUEST_CONTENT_ACTIONS_SUCCESS', () => {
            const action = {
                type: 'REQUEST_CONTENT_ACTIONS_SUCCESS',
                payload: [
                    {
                        ActionName: 'Rename',
                    },
                ],
            }
            expect(Reducers.childrenactions(undefined, action)).to.be.deep.equal([{ ActionName: 'Rename' }])
        })
    })
    describe('top reducer', () => {
        it('should return the initial state', () => {
            expect(Reducers.top(undefined, {})).to.be.deep.equal({})
        })
        it('should return 10', () => {
            expect(Reducers.top(undefined, { type: 'FETCH_CONTENT', options: { top: 10 } })).to.be.eq(10)
        })
        it('should return initial state', () => {
            expect(Reducers.top(undefined, { type: 'FETCH_CONTENT', options: {} })).to.be.deep.equal({})
        })
        it('should return initial state', () => {
            expect(Reducers.top(undefined, { type: 'SET_DEFAULT_ODATAOPTIONS', options: {} })).to.be.deep.equal({})
        })
        it('should return 10', () => {
            expect(Reducers.top(undefined, { type: 'SET_DEFAULT_ODATAOPTIONS', options: { top: 10 } })).to.be.eq(10)
        })
    })
    describe('skip reducer', () => {
        it('should return the initial state', () => {
            expect(Reducers.skip(undefined, {})).to.be.deep.equal({})
        })
        it('should return 10', () => {
            expect(Reducers.skip(undefined, { type: 'FETCH_CONTENT', options: { skip: 10 } })).to.be.eq(10)
        })
        it('should return initial state', () => {
            expect(Reducers.skip(undefined, { type: 'FETCH_CONTENT', options: {} })).to.be.deep.equal({})
        })
        it('should return initial state', () => {
            expect(Reducers.skip(undefined, { type: 'SET_DEFAULT_ODATAOPTIONS', options: {} })).to.be.deep.equal({})
        })
        it('should return 10', () => {
            expect(Reducers.skip(undefined, { type: 'SET_DEFAULT_ODATAOPTIONS', options: { skip: 10 } })).to.be.eq(10)
        })
    })
    describe('query reducer', () => {
        it('should return the initial state', () => {
            expect(Reducers.query(undefined, {})).to.be.deep.equal({})
        })
        it('should return "DisplayName:aaa"', () => {
            expect(Reducers.query(undefined, { type: 'FETCH_CONTENT', options: { query: 'DisplayName:aaa' } })).to.be.eq('DisplayName:aaa')
        })
        it('should return initial state', () => {
            expect(Reducers.query(undefined, { type: 'FETCH_CONTENT', options: {} })).to.be.deep.equal({})
        })
        it('should return initial state', () => {
            expect(Reducers.query(undefined, { type: 'SET_DEFAULT_ODATAOPTIONS', options: {} })).to.be.deep.equal({})
        })
        it('should return "DisplayName:aaa"', () => {
            expect(Reducers.query(undefined, { type: 'SET_DEFAULT_ODATAOPTIONS', options: { query: 'DisplayName:aaa' } })).to.be.eq('DisplayName:aaa')
        })
    })
    describe('order reducer', () => {
        it('should return the initial state', () => {
            expect(Reducers.order(undefined, {})).to.be.deep.equal({})
        })
        it('should return "DisplayName desc"', () => {
            expect(Reducers.order(undefined, { type: 'FETCH_CONTENT', options: { orderby: 'DisplayName desc' } })).to.be.eq('DisplayName desc')
        })
        it('should return initial state', () => {
            expect(Reducers.order(undefined, { type: 'FETCH_CONTENT', options: {} })).to.be.deep.equal({})
        })
        it('should return initial state', () => {
            expect(Reducers.order(undefined, { type: 'SET_DEFAULT_ODATAOPTIONS', options: {} })).to.be.deep.equal({})
        })
        it('should return "DisplayName desc"', () => {
            expect(Reducers.order(undefined, { type: 'SET_DEFAULT_ODATAOPTIONS', options: { orderby: 'DisplayName desc' } })).to.be.eq('DisplayName desc')
        })
    })
    describe('filter reducer', () => {
        it('should return the initial state', () => {
            expect(Reducers.filter(undefined, {})).to.be.deep.equal({})
        })
        it('should return "isOf(Task)"', () => {
            expect(Reducers.filter(undefined, { type: 'FETCH_CONTENT', options: { filter: 'isOf(Task)' } })).to.be.eq('isOf(Task)')
        })
        it('should return initial state', () => {
            expect(Reducers.filter(undefined, { type: 'FETCH_CONTENT', options: {} })).to.be.deep.equal({})
        })
        it('should return initial state', () => {
            expect(Reducers.filter(undefined, { type: 'SET_DEFAULT_ODATAOPTIONS', options: {} })).to.be.deep.equal({})
        })
        it('should return "isOf(Task)"', () => {
            expect(Reducers.filter(undefined, { type: 'SET_DEFAULT_ODATAOPTIONS', options: { filter: 'isOf(Task)' } })).to.be.eq('isOf(Task)')
        })
    })
    describe('select reducer', () => {
        it('should return the initial state', () => {
            expect(Reducers.select(undefined, {})).to.be.deep.equal({})
        })
        it('should return "all"', () => {
            expect(Reducers.select(undefined, { type: 'FETCH_CONTENT', options: { select: 'all' } })).to.be.eq('all')
        })
        it('should return initial state', () => {
            expect(Reducers.select(undefined, { type: 'FETCH_CONTENT', options: {} })).to.be.deep.equal({})
        })
        it('should return initial state', () => {
            expect(Reducers.select(undefined, { type: 'SET_DEFAULT_ODATAOPTIONS', options: {} })).to.be.deep.equal({})
        })
        it('should return "all"', () => {
            expect(Reducers.select(undefined, { type: 'SET_DEFAULT_ODATAOPTIONS', options: { select: 'all' } })).to.be.eq('all')
        })
    })
    describe('expand reducer', () => {
        it('should return the initial state', () => {
            expect(Reducers.expand(undefined, {})).to.be.deep.equal([])
        })
        it('should return an array of strings', () => {
            expect(Reducers.expand(undefined, { type: 'FETCH_CONTENT', options: { expand: ['Owner'] } })).to.be.deep.eq(['Owner'])
        })
        it('should return initial state', () => {
            expect(Reducers.expand(undefined, { type: 'FETCH_CONTENT', options: {} })).to.be.deep.equal([])
        })
        it('should return initial state', () => {
            expect(Reducers.expand(undefined, { type: 'SET_DEFAULT_ODATAOPTIONS', options: {} })).to.be.deep.equal([])
        })
        it('should return an array of strings', () => {
            expect(Reducers.expand(undefined, { type: 'SET_DEFAULT_ODATAOPTIONS', options: { expand: ['Owner'] } })).to.be.deep.eq(['Owner'])
        })
    })
    describe('scenario reducer', () => {
        it('should return the initial state', () => {
            expect(Reducers.scenario(undefined, {})).to.be.deep.equal('')
        })
        it('should return "DocLib"', () => {
            expect(Reducers.scenario(undefined, { type: 'FETCH_CONTENT', options: { scenario: 'DocLib' } })).to.be.eq('DocLib')
        })
        it('should return initial state', () => {
            expect(Reducers.scenario(undefined, { type: 'FETCH_CONTENT', options: {} })).to.be.deep.equal('')
        })
        it('should return initial state', () => {
            expect(Reducers.scenario(undefined, { type: 'SET_DEFAULT_ODATAOPTIONS', options: {} })).to.be.deep.equal('')
        })
        it('should return "DocLib"', () => {
            expect(Reducers.scenario(undefined, { type: 'SET_DEFAULT_ODATAOPTIONS', options: { scenario: 'DocLib' } })).to.be.eq('DocLib')
        })
    })
    describe('isOpened reducer', () => {
        it('should return the initial state', () => {
            expect(Reducers.isOpened(undefined, {})).to.be.eq(null)
        })
        it('should return 1', () => {
            const action = {
                type: 'REQUEST_CONTENT_ACTIONS_SUCCESS',
                id: 1,
            }
            expect(Reducers.isOpened(undefined, action)).to.be.eq(1)
        })
    })
    describe('isSaved reducer', () => {
        it('should return the initial state', () => {
            expect(Reducers.isSaved(undefined, {})).to.be.deep.equal(true)
        })
        it('should return false', () => {
            expect(Reducers.isSaved(undefined, { type: 'CREATE_CONTENT' })).to.be.deep.equal(false)
        })
        it('should return false', () => {
            expect(Reducers.isSaved(undefined, { type: 'CREATE_CONTENT_FAILURE' })).to.be.deep.equal(false)
        })
        it('should return false', () => {
            expect(Reducers.isSaved(undefined, { type: 'UPDATE_CONTENT' })).to.be.deep.equal(false)
        })
        it('should return false', () => {
            expect(Reducers.isSaved(undefined, { type: 'UPDATE_CONTENT_FAILURE' })).to.be.deep.equal(false)
        })
        it('should return false', () => {
            expect(Reducers.isSaved(undefined, { type: 'LOAD_CONTENT' })).to.be.deep.equal(false)
        })
        it('should return false', () => {
            expect(Reducers.isSaved(undefined, { type: 'LOAD_CONTENT_FAILURE' })).to.be.deep.equal(false)
        })
    })
    describe('isValid reducer', () => {
        it('should return the initial state', () => {
            expect(Reducers.isValid(undefined, {})).to.be.deep.equal(true)
        })
    })
    describe('isDirty reducer', () => {
        it('should return the initial state', () => {
            expect(Reducers.isDirty(undefined, {})).to.be.deep.equal(false)
        })
    })
    describe('isOperationInProgress reducer', () => {
        it('should return the initial state', () => {
            expect(Reducers.isOperationInProgress(undefined, {})).to.be.deep.equal(false)
        })
        it('should return true', () => {
            expect(Reducers.isOperationInProgress(undefined, { type: 'CREATE_CONTENT_LOADING' })).to.be.deep.equal(true)
        })
        it('should return true', () => {
            expect(Reducers.isOperationInProgress(undefined, { type: 'UPDATE_CONTENT_LOADING' })).to.be.deep.equal(true)
        })
        it('should return true', () => {
            expect(Reducers.isOperationInProgress(undefined, { type: 'DELETE_CONTENT_LOADING' })).to.be.deep.equal(true)
        })
    })
    describe('contenterror reducer', () => {
        it('should return the initial state', () => {
            expect(Reducers.contenterror(undefined, {})).to.be.eq(null)
        })
        it('should handle FETCH_CONTENT_FAILURE', () => {
            expect(Reducers.contenterror(null, { type: 'FETCH_CONTENT_FAILURE', payload: { message: 'error' } })).to.be.eq(null)
        })
        it('should handle CREATE_CONTENT_FAILURE', () => {
            expect(Reducers.contenterror(null, { type: 'CREATE_CONTENT_FAILURE', payload: { message: 'error' } })).to.be.eq('error')
        })
        it('should handle UPDATE_CONTENT_FAILURE', () => {
            expect(Reducers.contenterror(null, { type: 'UPDATE_CONTENT_FAILURE', payload: { message: 'error' } })).to.be.eq('error')
        })
        it('should handle DELETE_CONTENT_FAILURE', () => {
            expect(Reducers.contenterror(null, { type: 'DELETE_CONTENT_FAILURE', payload: { message: 'error' } })).to.be.eq('error')
        })
        it('should handle CHECKIN_CONTENT_FAILURE', () => {
            expect(Reducers.contenterror(null, { type: 'CHECKIN_CONTENT_FAILURE', payload: { message: 'error' } })).to.be.eq('error')
        })
        it('should handle CHECKOUT_CONTENT_FAILURE', () => {
            expect(Reducers.contenterror(null, { type: 'CHECKOUT_CONTENT_FAILURE', payload: { message: 'error' } })).to.be.eq('error')
        })
        it('should handle PUBLISH_CONTENT_FAILURE', () => {
            expect(Reducers.contenterror(null, { type: 'PUBLISH_CONTENT_FAILURE', payload: { message: 'error' } })).to.be.eq('error')
        })
        it('should handle APPROVE_CONTENT_FAILURE', () => {
            expect(Reducers.contenterror(null, { type: 'APPROVE_CONTENT_FAILURE', payload: { message: 'error' } })).to.be.eq('error')
        })
        it('should handle REJECT_CONTENT_FAILURE', () => {
            expect(Reducers.contenterror(null, { type: 'REJECT_CONTENT_FAILURE', payload: { message: 'error' } })).to.be.eq('error')
        })
        it('should handle UNDOCHECKOUT_CONTENT_FAILURE', () => {
            expect(Reducers.contenterror(null, { type: 'UNDOCHECKOUT_CONTENT_FAILURE', payload: { message: 'error' } })).to.be.eq('error')
        })
        it('should handle FORCEUNDOCHECKOUT_CONTENT_FAILURE', () => {
            expect(Reducers.contenterror(null, { type: 'FORCEUNDOCHECKOUT_CONTENT_FAILURE', payload: { message: 'error' } })).to.be.eq('error')
        })
        it('should handle RESTOREVERSION_CONTENT_FAILURE', () => {
            expect(Reducers.contenterror(null, { type: 'RESTOREVERSION_CONTENT_FAILURE', payload: { message: 'error' } })).to.be.eq('error')
        })
        it('should handle FETCH_CONTENT', () => {
            expect(Reducers.contenterror(null, { type: 'FETCH_CONTENT' })).to.be.eq(null)
        })
        it('should handle FETCH_CONTENT_SUCCESS', () => {
            expect(Reducers.contenterror(null, { type: 'FETCH_CONTENT_SUCCESS' })).to.be.eq(null)
        })
        it('should handle CREATE_CONTENT', () => {
            expect(Reducers.contenterror(null, { type: 'CREATE_CONTENT' })).to.be.eq(null)
        })
        it('should handle CREATE_CONTENT_SUCCESS', () => {
            expect(Reducers.contenterror(null, { type: 'CREATE_CONTENT_SUCCESS' })).to.be.eq(null)
        })
        it('should handle UPDATE_CONTENT', () => {
            expect(Reducers.contenterror(null, { type: 'UPDATE_CONTENT' })).to.be.eq(null)
        })
        it('should handle UPDATE_CONTENT_SUCCESS', () => {
            expect(Reducers.contenterror(null, { type: 'UPDATE_CONTENT_SUCCESS' })).to.be.eq(null)
        })
        it('should handle DELETE_CONTENT', () => {
            expect(Reducers.contenterror(null, { type: 'DELETE_CONTENT' })).to.be.eq(null)
        })
        it('should handle DELETE_CONTENT_SUCCESS', () => {
            expect(Reducers.contenterror(null, { type: 'DELETE_CONTENT_SUCCESS' })).to.be.eq(null)
        })
        it('should handle CHECKIN_CONTENT', () => {
            expect(Reducers.contenterror(null, { type: 'CHECKIN_CONTENT' })).to.be.eq(null)
        })
        it('should handle CHECKIN_CONTENT_SUCCESS', () => {
            expect(Reducers.contenterror(null, { type: 'CHECKIN_CONTENT_SUCCESS' })).to.be.eq(null)
        })
        it('should handle CHECKOUT_CONTENT', () => {
            expect(Reducers.contenterror(null, { type: 'CHECKOUT_CONTENT' })).to.be.eq(null)
        })
        it('should handle CHECKOUT_CONTENT_SUCCESS', () => {
            expect(Reducers.contenterror(null, { type: 'CHECKOUT_CONTENT_SUCCESS' })).to.be.eq(null)
        })
        it('should handle APPROVE_CONTENT', () => {
            expect(Reducers.contenterror(null, { type: 'APPROVE_CONTENT' })).to.be.eq(null)
        })
        it('should handle APPROVE_CONTENT_SUCCESS', () => {
            expect(Reducers.contenterror(null, { type: 'APPROVE_CONTENT_SUCCESS' })).to.be.eq(null)
        })
        it('should handle PUBLISH_CONTENT', () => {
            expect(Reducers.contenterror(null, { type: 'PUBLISH_CONTENT' })).to.be.eq(null)
        })
        it('should handle PUBLISH_CONTENT_SUCCESS', () => {
            expect(Reducers.contenterror(null, { type: 'PUBLISH_CONTENT_SUCCESS' })).to.be.eq(null)
        })
        it('should handle REJECT_CONTENT', () => {
            expect(Reducers.contenterror(null, { type: 'REJECT_CONTENT' })).to.be.eq(null)
        })
        it('should handle REJECT_CONTENT_SUCCESS', () => {
            expect(Reducers.contenterror(null, { type: 'REJECT_CONTENT_SUCCESS' })).to.be.eq(null)
        })
        it('should handle UNDOCHECKOUT_CONTENT', () => {
            expect(Reducers.contenterror(null, { type: 'UNDOCHECKOUT_CONTENT' })).to.be.eq(null)
        })
        it('should handle UNDOCHECKOUT_CONTENT_SUCCESS', () => {
            expect(Reducers.contenterror(null, { type: 'UNDOCHECKOUT_CONTENT_SUCCESS' })).to.be.eq(null)
        })
        it('should handle FORCEUNDOCHECKOUT_CONTENT', () => {
            expect(Reducers.contenterror(null, { type: 'FORCEUNDOCHECKOUT_CONTENT' })).to.be.eq(null)
        })
        it('should handle FORCEUNDOCHECKOUT_CONTENT_SUCCESS', () => {
            expect(Reducers.contenterror(null, { type: 'FORCEUNDOCHECKOUT_CONTENT_SUCCESS' })).to.be.eq(null)
        })
        it('should handle RESTOREVERSION_CONTENT', () => {
            expect(Reducers.contenterror(null, { type: 'RESTOREVERSION_CONTENT' })).to.be.eq(null)
        })
        it('should handle RESTOREVERSION_CONTENT_SUCCESS', () => {
            expect(Reducers.contenterror(null, { type: 'RESTOREVERSION_CONTENT_SUCCESS' })).to.be.eq(null)
        })
        it('should handle FETCH_CONTENT_PENDING', () => {
            expect(Reducers.contenterror(null, { type: 'FETCH_CONTENT_PENDING' })).to.be.eq(null)
        })
    })
    describe('contentactions reducer', () => {
        const action = {
            type: 'LOAD_CONTENT_ACTIONS_SUCCESS',
            payload: {
                d: {
                    Actions: ['aaa', 'bbb'],
                },
            },
        }
        it('should return the initial state', () => {
            expect(Reducers.contentactions(undefined, {})).to.deep.equal({})
        })
        it('should return an array with actions', () => {
            expect(Reducers.contentactions(null, action)).to.deep.equal(['aaa', 'bbb'])
        })
    })
    describe('fields reducer', () => {
        it('should return the initial state', () => {
            expect(Reducers.fields(undefined, {})).to.deep.equal({})
        })
        it('should return an empty object', () => {

            const content = {
                Path: '/Root/Sites/Default_Site/tasks',
                Status: Status.active,
            } as Task
            const action = {
                type: 'LOAD_CONTENT_SUCCESS',
                payload: content,
            }
            expect(Reducers.fields({}, action)).to.deep.equal({})
        })
        it('should return changed fields of the content', () => {

            const action = {
                type: 'CHANGE_FIELD_VALUE',
                name: 'Name',
                value: 'aaa',
            }
            expect(Reducers.fields({}, action)).to.deep.equal({
                Name: 'aaa',
            })
        })
    })
    describe('schema reducer', () => {
        it('should return the initial state', () => {
            expect(Reducers.schema(undefined, {})).to.deep.equal({})
        })
        it('should return schema of the given content type', () => {

            const action = {
                type: 'GET_SCHEMA',
                payload: { Icon: 'FormItem' },
            }
            expect(Reducers.schema({}, action)).to.deep.equal({
                Icon: 'FormItem',
            })
        })
    })
    describe('content reducer', () => {
        it('should return the initial state', () => {
            expect(Reducers.fields(undefined, {})).to.deep.equal({})
        })
        it('should return a content', () => {

            const content = {
                Path: '/Root/Sites/Default_Site/tasks',
                Status: Status.active,
            } as Task
            const action = {
                type: 'LOAD_CONTENT_SUCCESS',
                payload: { d: content },
            }
            expect(Reducers.content(undefined, action)).to.deep.equal(content)
        })
    })
    describe('selected reducer', () => {
        it('should return the initial state', () => {
            expect(Reducers.selectedIds(undefined, {})).to.deep.equal([])
        })
        it('should return an array with one item with the id 1', () => {
            const content = {
                Path: '/Root/Sites/Default_Site/tasks',
                Status: Status.active,
                Id: 1,
            } as Task
            const action = {
                type: 'SELECT_CONTENT',
                content,
            }
            expect(Reducers.selectedIds(undefined, action)).to.deep.equal([1])
        })
        it('should return an array with two items with the id 1 and 2', () => {
            const content = {
                Path: '/Root/Sites/Default_Site/tasks',
                Status: Status.active,
                Id: 2,
            } as Task
            const action = {
                type: 'SELECT_CONTENT',
                content,
            }
            expect(Reducers.selectedIds([1], action)).to.deep.equal([1, 2])
        })
        it('should return an array with one item with the id 1', () => {
            const content = {
                Path: '/Root/Sites/Default_Site/tasks',
                Status: Status.active,
                Id: 2,
            } as Task
            const action = {
                type: 'DESELECT_CONTENT',
                content,
            }
            expect(Reducers.selectedIds([1, 2], action)).to.deep.equal([1])
        })
        it('should return an empty array', () => {
            const content = {
                Path: '/Root/Sites/Default_Site/tasks',
                Status: Status.active,
                Id: 1,
            } as Task
            const action = {
                type: 'DESELECT_CONTENT',
                content,
            }
            expect(Reducers.selectedIds([1], action)).to.deep.equal([])
        })
        it('should return an empty array', () => {
            const action = {
                type: 'CLEAR_SELECTION',
            }
            expect(Reducers.selectedIds([1], action)).to.deep.equal([])
        })
    })
    describe('selectedContent reducer', () => {

        it('should return the initial state', () => {
            expect(Reducers.selectedContentItems(undefined, {})).to.deep.equal({})
        })
        it('should return an object with one children item with the id 1', () => {
            const content = {
                Path: '/Root/Sites/Default_Site/tasks',
                Status: Status.active,
                Id: 1,
            } as Task
            const action = {
                type: 'SELECT_CONTENT',
                content,
            }
            expect(Reducers.selectedContentItems(undefined, action)).to.deep.equal({ 1: content })
        })
        it('should return an object with two items with the id 1 and 2', () => {
            const entities = {
                1: {
                    Id: 1,
                    DisplayName: 'Some Article',
                    Status: ['Active'],
                },
            }
            const content = {
                Path: '/Root/Sites/Default_Site/tasks',
                Status: Status.active,
                Id: 2,
            } as Task
            const action = {
                type: 'SELECT_CONTENT',
                content,
            }
            expect(Reducers.selectedContentItems(entities, action)).to.deep.equal(
                {
                    1: {
                        Id: 1,
                        DisplayName: 'Some Article',
                        Status: ['Active'],
                    },
                    2: content,
                },
            )
        })
        it('should return an object with one item with the id 1', () => {
            const entities = {
                1: {
                    Id: 1,
                    DisplayName: 'Some Article',
                    Status: ['Active'],
                },
                2: {
                    Id: 2,
                    DisplayName: 'Some Article',
                    Status: ['Active'],
                },
            }
            const content = {
                Path: '/Root/Sites/Default_Site/tasks',
                Status: Status.active,
                Id: 2,
            } as Task
            const action = {
                type: 'DESELECT_CONTENT',
                content,
            }
            expect(Reducers.selectedContentItems(entities, action)).to.deep.equal(
                {
                    1: {
                        Id: 1,
                        DisplayName: 'Some Article',
                        Status: ['Active'],
                    },
                },
            )
        })
        it('should return an empty object', () => {
            const entities = {
                1: {
                    Id: 1,
                    DisplayName: 'Some Article',
                    Status: ['Active'],
                },
            }
            const content = {
                Path: '/Root/Sites/Default_Site/tasks',
                Status: Status.active,
                Id: 1,
            } as Task
            const action = {
                type: 'DESELECT_CONTENT',
                content,
            }
            expect(Reducers.selectedContentItems(entities, action)).to.deep.equal({})
        })
        it('should return an empty object', () => {
            const entities = {
                1: {
                    Id: 1,
                    DisplayName: 'Some Article',
                    Status: ['Active'],
                },
            }
            const action = {
                type: 'CLEAR_SELECTION',
            }
            expect(Reducers.selectedContentItems(entities, action)).to.deep.equal({})
        })
    })
    describe('batchResponseError reducer', () => {
        it('should return the initial state', () => {
            expect(Reducers.batchResponseError(undefined, {})).to.deep.equal('')
        })
        it('should return an error message', () => {
            const action = {
                type: 'DELETE_BATCH_FAILURE',
                payload: {
                    message: 'error',
                },
            }
            expect(Reducers.batchResponseError(undefined, action)).to.deep.equal('error')
        })
        it('should return an error message', () => {
            const action = {
                type: 'COPY_BATCH_FAILURE',
                payload: {
                    message: 'error',
                },
            }
            expect(Reducers.batchResponseError(undefined, action)).to.deep.equal('error')
        })
        it('should return an error message', () => {
            const action = {
                type: 'MOVE_BATCH_FAILURE',
                payload: {
                    message: 'error',
                },
            }
            expect(Reducers.batchResponseError(undefined, action)).to.deep.equal('error')
        })
        it('should return an empty string', () => {
            const action = {
                type: 'MOVE_BATCH_SUCCESS',
                payload: {},
            }
            expect(Reducers.batchResponseError(undefined, action)).to.deep.equal('')
        })
    })
    describe('OdataBatchResponse reducer', () => {
        it('should return the initial state', () => {
            expect(Reducers.odataBatchResponse(undefined, {})).to.deep.equal({})
        })
        it('should return a response object', () => {
            const action = {
                type: 'DELETE_BATCH_SUCCESS',
                payload: {
                    vmi: '1',
                },
            }
            expect(Reducers.odataBatchResponse(undefined, action)).to.deep.equal({
                vmi: '1',
            })
        })
        it('should return an error message', () => {
            const action = {
                type: 'COPY_BATCH_SUCCESS',
                payload: {
                    vmi: '1',
                },
            }
            expect(Reducers.odataBatchResponse(undefined, action)).to.deep.equal({
                vmi: '1',
            })
        })
        it('should return an error message', () => {
            const action = {
                type: 'MOVE_BATCH_SUCCESS',
                payload: {
                    vmi: '1',
                },
            }
            expect(Reducers.odataBatchResponse(undefined, action)).to.deep.equal({
                vmi: '1',
            })
        })
        it('should return an empty string', () => {
            const action = {
                type: 'MOVE_BATCH_FAILURE',
                message: 'error',
            }
            expect(Reducers.odataBatchResponse(undefined, action)).to.deep.equal({})
        })
    })
    describe('getContent', () => {
        const state = {
            entities: {
                collection: {
                    5145: {
                        Id: 5145,
                        DisplayName: 'Some Article',
                        Status: ['Active'],
                    },
                    5146: {
                        Id: 5146,
                        Displayname: 'Other Article',
                        Status: ['Completed'],
                    },
                },
            },
        }
        it('should return the content from the state by the given id', () => {
            expect(Reducers.getContent(state.entities.collection, 5145)).to.be.deep.eq(
                {
                    Id: 5145,
                    DisplayName: 'Some Article',
                    Status: ['Active'],
                },
            )
        })
    })

    describe('repository reducer', () => {
        const repository = new Repository({}, async () => ({ ok: true } as any))
        it('should return the initial state', () => {
            expect(Reducers.repository(undefined, {} as any)).to.be.deep.equal(null)
        })
        it('should return the repository config', () => {

            expect(Reducers.repository(null, { type: 'LOAD_REPOSITORY', repository: repository.configuration as any })).to.be.deep.equal(repository.configuration)
        })
    })

    describe('getIds', () => {
        const state = {
            ids: [5145, 5146],
        }
        it('should return the id array from the current state', () => {
            expect(Reducers.getIds(state)).to.be.deep.eq([5145, 5146])
        })
    })

    describe('getFetching', () => {
        const state = {
            ids: [5145, 5146],
            isFetching: false,
        }
        it('should return the value of isFetching from the current state', () => {
            expect(Reducers.getFetching(state)).to.be.eq(false)
        })
    })

    describe('getError', () => {
        const state = {
            ids: [5145, 5146],
            isFetching: false,
            error: 'error',
        }
        it('should return the value of errorMessage from the current state', () => {
            expect(Reducers.getError(state)).to.be.eq('error')
        })
    })

    describe('getAuthenticationStatus', () => {
        const state = {
            session: {
                loginState: LoginState.Authenticated,
            },
        }
        it('should return true if the user is authenticated state', () => {
            expect(Reducers.getAuthenticationStatus(state)).to.be.eq(LoginState.Authenticated)
        })
    })

    describe('getAuthenticationError', () => {
        const state = {
            session: {
                error: 'error',
            },
        }
        it('should return the value of errorMessage from the current state', () => {
            expect(Reducers.getAuthenticationError(state)).to.be.eq('error')
        })
    })
    describe('getRepositoryUrl', () => {
        const state = {
            session: {
                repository: {
                    repositoryUrl: 'https://dmsservice.demo.sensenet.com',
                },
            },
        }
        it('should return the value of RepositoryUrl from the current state', () => {
            expect(Reducers.getRepositoryUrl(state)).to.be.eq('https://dmsservice.demo.sensenet.com')
        })
    })
    describe('getSelectedContentIds', () => {
        const state = {
            selected: {
                ids: [1, 2],
                entities: {
                    1: {
                        DisplaName: 'aaa',
                        Id: 1,
                    },
                    2: {
                        DisplaName: 'bbb',
                        Id: 2,
                    },
                },
            },
        }
        it('should return the value of the selected reducers current state, an array with two items', () => {
            expect(Reducers.getSelectedContentIds(state)).to.be.deep.equal([1, 2])
        })
    })
    describe('getSelectedContentItems', () => {
        const state = {
            selected: {
                ids: [1, 2],
                entities: {
                    1: {
                        DisplaName: 'aaa',
                        Id: 1,
                    },
                    2: {
                        DisplaName: 'bbb',
                        Id: 2,
                    },
                },
            },
        }
        it('should return the value of the selected reducers current state, an array with two items', () => {
            expect(Reducers.getSelectedContentItems(state)).to.be.deep.equal({
                1: {
                    DisplaName: 'aaa',
                    Id: 1,
                },
                2: {
                    DisplaName: 'bbb',
                    Id: 2,
                },
            })
        })
    })
    describe('getOpenedContentId', () => {
        const state = {
            isOpened: 1,
        }
        it('should return 1 as the opened items id', () => {
            expect(Reducers.getOpenedContent(state)).to.be.eq(1)
        })
    })
    describe('getChildrenActions', () => {
        const state = {
            actions: [
                {
                    ActionName: 'Rename',
                },
            ],
        }
        it('should return 1 as the opened items id', () => {
            expect(Reducers.getChildrenActions(state)).to.be.deep.equal([{ ActionName: 'Rename' }])
        })
    })
    describe('getCurrentContent', () => {
        const state = {
            currentcontent: {
                content: {
                    DisplayName: 'my content',
                },
            },
        }
        it('should return the content', () => {
            expect(Reducers.getCurrentContent(state)).to.be.deep.equal({ DisplayName: 'my content' })
        })
    })
    describe('getChildren', () => {
        const state = {
            entities: {
                5145: {
                    Id: 5145,
                    DisplayName: 'Some Article',
                    Status: ['Active'],
                },
                5146: {
                    Id: 5146,
                    Displayname: 'Other Article',
                    Status: ['Completed'],
                },
            },
        }
        it('should return the children object', () => {
            expect(Reducers.getChildren(state)).to.be.deep.equal({
                5145: {
                    Id: 5145,
                    DisplayName: 'Some Article',
                    Status: ['Active'],
                },
                5146: {
                    Id: 5146,
                    Displayname: 'Other Article',
                    Status: ['Completed'],
                },
            })
        })
    })
    describe('getFields', () => {
        const state = {
            currentcontent: {
                fields: {
                    Name: 'aaa',
                },
            },
        }
        it('should return the list of the fields that were changed', () => {
            expect(Reducers.getFields(state)).to.be.deep.equal({
                Name: 'aaa',
            })
        })
    })
    describe('getSchema', () => {
        const state = {
            currentcontent: {
                schema: {
                    Name: 'aaa',
                },
            },
        }
        it('should return the schema of the current content', () => {
            expect(Reducers.getSchema(state)).to.be.deep.equal({
                Name: 'aaa',
            })
        })
    })
})
