///<reference path="../node_modules/@types/mocha/index.d.ts"/>
import { Reducers } from '../src/Reducers';
import { Actions } from '../src/Actions';
import * as Chai from 'chai';
import { Authentication, Content, ContentTypes, Mocks } from 'sn-client-js';
const expect = Chai.expect;
describe('Reducers', () => {
    describe('country reducer', () => {
        it('should return the initial state', () => {
            expect(Reducers.country(undefined, {})).to.be.deep.equal('');
        });
    })

    describe('language reducer', () => {
        const user = { Language: ['hu-HU'] }
        const user2 = {}
        it('should return the initial state', () => {
            expect(Reducers.language(undefined, {})).to.be.deep.equal('en-US');
        });
        it('should return the language set on the user', () => {
            expect(Reducers.language(undefined, { type: 'USER_CHANGED', user: user })).to.be.deep.equal('hu-HU');
        });
        it('should return the initial language', () => {
            expect(Reducers.language(undefined, { type: 'USER_CHANGED', user: user2 })).to.be.deep.equal('en-US');
        });
    })

    describe('loginState reducer', () => {
        it('should return the initial state', () => {
            expect(Reducers.loginState(undefined, {})).to.be.deep.equal(Authentication.LoginState.Pending);
        });
        it('should return that a user is logged-in', () => {
            expect(Reducers.loginState(undefined, { type: 'USER_LOGIN_SUCCESS' })).to.be.deep.equal(Authentication.LoginState.Authenticated);
        });
        it('should return theres no authenticated user', () => {
            expect(Reducers.loginState(undefined, { type: 'USER_LOGOUT_SUCCESS' })).to.be.deep.equal(Authentication.LoginState.Unauthenticated);
        });
        it('should return theres no authenticated user', () => {
            expect(Reducers.loginState(undefined, { type: 'USER_LOGIN_FAILURE' })).to.be.deep.equal(Authentication.LoginState.Unauthenticated);
        });
        it('should return theres no authenticated user', () => {
            expect(Reducers.loginState(undefined, { type: 'USER_LOGOUT_FAILURE' })).to.be.deep.equal(Authentication.LoginState.Unauthenticated);
        });
    })

    describe('loginError reducer', () => {
        it('should return the initial state', () => {
            expect(Reducers.loginError(undefined, {})).to.be.deep.equal(null);
        });
        it('should return an error message', () => {
            expect(Reducers.loginError(undefined, { type: 'USER_LOGIN_FAILURE', message: 'error' })).to.be.deep.equal('error');
        });
        it('should return an error message', () => {
            expect(Reducers.loginError(undefined, { type: 'USER_LOGOUT_FAILURE', message: 'error' })).to.be.deep.equal('error');
        });
    })

    describe('userName reducer', () => {
        it('should return the initial state', () => {
            expect(Reducers.userName(undefined, {})).to.be.deep.equal('Visitor');
        });
        it('should return the logged-in users name', () => {
            expect(Reducers.userName(undefined, { type: 'USER_CHANGED', user: { Name: 'Alba' } })).to.be.deep.equal('Alba');
        });
    })

    describe('fullName reducer', () => {
        it('should return the initial state', () => {
            expect(Reducers.fullName(undefined, {})).to.be.deep.equal('Visitor');
        });
        it('should return the logged-in users full-name', () => {
            expect(Reducers.fullName(undefined, { type: 'USER_CHANGED', user: { DisplayName: 'Alba Monday' } })).to.be.deep.equal('Alba Monday');
        });
    })

    describe('userLanguage reducer', () => {
        const user = { Language: ['hu-HU'] }
        const user2 = {}
        it('should return the initial state', () => {
            expect(Reducers.userLanguage(undefined, {})).to.be.deep.equal('en-US');
        });
        it('should return the language set on the user', () => {
            expect(Reducers.userLanguage(undefined, { type: 'USER_CHANGED', user: user })).to.be.deep.equal('hu-HU');
        });
        it('should return the initial language', () => {
            expect(Reducers.userLanguage(undefined, { type: 'USER_CHANGED', user: user2 })).to.be.deep.equal('en-US');
        });
    })

    describe('userAvatarPath reducer', () => {
        it('should return the initial state', () => {
            expect(Reducers.userAvatarPath(undefined, {})).to.be.deep.equal('');
        });
        it('should return the initial state', () => {
            expect(Reducers.userAvatarPath(undefined, { type: 'USER_CHANGED', user: { DisplayName: 'Alba Monday' } })).to.be.deep.equal('');
        });
        it('should return the logged-in users avatars path', () => {
            expect(Reducers.userAvatarPath(undefined, { type: 'USER_CHANGED', user: { Avatar: { _deferred: 'Alba Monday' } } })).to.be.deep.equal('Alba Monday');
        });
    })

    describe('ids reducer', () => {
        it('should return the initial state', () => {
            expect(Reducers.ids(undefined, {})).to.be.deep.equal([]);
        });
        it('should handle FETCH_CONTENT_SUCCESS', () => {
            expect(Reducers.ids([],
                {
                    type: 'FETCH_CONTENT_SUCCESS',
                    response: {
                        result: [5145, 5146],
                        entities: {
                            collection: {
                                5145: {
                                    Id: 5145,
                                    DisplayName: 'Some Article',
                                    Status: ['Active']
                                },
                                5146: {
                                    Id: 5146,
                                    Displayname: 'Other Article',
                                    Status: ['Completed']
                                }
                            }
                        }
                    },
                    filter: '?$select=Id,Type&metadata=no'
                }))
                .to.be.deep.equal([5145, 5146]);
        });
        it('should handle CREATE_CONTENT_SUCCESS', () => {
            expect(Reducers.ids([],
                {
                    type: 'CREATE_CONTENT_SUCCESS',
                    response: {
                        entities: {
                            collection: {
                                123: {
                                    DisplayName: 'My content',
                                    Id: 123
                                }
                            }
                        },
                        result: 123
                    },
                    filter: '?$select=Id,Type&metadata=no'
                }))
                .to.be.deep.equal([123]);
        });
        it('should handle DELETE_CONTENT_SUCCESS', () => {
            expect(Reducers.ids(
                [1, 2, 3],
                {
                    type: 'DELETE_CONTENT_SUCCESS',
                    index: 0,
                    id: 1
                }))
                .to.be.deep.equal([2, 3]);
        });
    });

    describe('entities reducer', () => {
        it('should return the initial state', () => {
            expect(Reducers.entities(undefined, {})).to.be.deep.equal({});
        });
        it('should handle DELETE_CONTENT_SUCCESS', () => {
            const ids = [1, 2, 3];
            expect(Reducers.entities(ids, { type: 'DELETE_CONTENT_SUCCESS', id: 1 })).to.be.deep.equal({ 0: 1, 2: 3 });
        });
        it('should return a new state with the given response', () => {
            expect(Reducers.entities({}, { response: { entities: { entities: { a: 0, b: 2 } } } }))
                .to.be.deep.eq({ a: 0, b: 2 });
        });
    });

    describe('isFetching reducer', () => {
        it('should return the initial state', () => {
            expect(Reducers.isFetching(undefined, {})).to.be.eq(false);
        });
        it('should handle FETCH_CONTENT_SUCCESS', () => {
            expect(Reducers.isFetching(false, { type: 'FETCH_CONTENT_REQUEST' })).to.be.eq(true);
        });
        it('should handle FETCH_CONTENT_SUCCESS', () => {
            expect(Reducers.isFetching(true, { type: 'FETCH_CONTENT_SUCCESS' })).to.be.eq(false);
        });
        it('should handle FETCH_CONTENT_FAILURE', () => {
            expect(Reducers.isFetching(true, { type: 'FETCH_CONTENT_FAILURE' })).to.be.eq(false);
        });
    });

    describe('childrenerror reducer', () => {
        it('should return the initial state', () => {
            expect(Reducers.childrenerror(undefined, {})).to.be.eq(null);
        });
        it('should handle FETCH_CONTENT_FAILURE', () => {
            expect(Reducers.childrenerror(null, { type: 'FETCH_CONTENT_FAILURE', message: 'error' })).to.be.eq('error');
        });
        it('should handle CREATE_CONTENT_FAILURE', () => {
            expect(Reducers.childrenerror(null, { type: 'CREATE_CONTENT_FAILURE', message: 'error' })).to.be.eq(null);
        });
        it('should handle UPDATE_CONTENT_FAILURE', () => {
            expect(Reducers.childrenerror(null, { type: 'UPDATE_CONTENT_FAILURE', message: 'error' })).to.be.eq(null);
        });
        it('should handle DELETE_CONTENT_FAILURE', () => {
            expect(Reducers.childrenerror(null, { type: 'DELETE_CONTENT_FAILURE', message: 'error' })).to.be.eq(null);
        });
        it('should handle CHECKIN_CONTENT_FAILURE', () => {
            expect(Reducers.childrenerror(null, { type: 'CHECKIN_CONTENT_FAILURE', message: 'error' })).to.be.eq(null);
        });
        it('should handle CHECKOUT_CONTENT_FAILURE', () => {
            expect(Reducers.childrenerror(null, { type: 'CHECKOUT_CONTENT_FAILURE', message: 'error' })).to.be.eq(null);
        });
        it('should handle PUBLISH_CONTENT_FAILURE', () => {
            expect(Reducers.childrenerror(null, { type: 'PUBLISH_CONTENT_FAILURE', message: 'error' })).to.be.eq(null);
        });
        it('should handle APPROVE_CONTENT_FAILURE', () => {
            expect(Reducers.childrenerror(null, { type: 'APPROVE_CONTENT_FAILURE', message: 'error' })).to.be.eq(null);
        });
        it('should handle REJECT_CONTENT_FAILURE', () => {
            expect(Reducers.childrenerror(null, { type: 'REJECT_CONTENT_FAILURE', message: 'error' })).to.be.eq(null);
        });
        it('should handle UNDOCHECKOUT_CONTENT_FAILURE', () => {
            expect(Reducers.childrenerror(null, { type: 'UNDOCHECKOUT_CONTENT_FAILURE', message: 'error' })).to.be.eq(null);
        });
        it('should handle FORCEUNDOCHECKOUT_CONTENT_FAILURE', () => {
            expect(Reducers.childrenerror(null, { type: 'FORCEUNDOCHECKOUT_CONTENT_FAILURE', message: 'error' })).to.be.eq(null);
        });
        it('should handle RESTOREVERSION_CONTENT_FAILURE', () => {
            expect(Reducers.childrenerror(null, { type: 'RESTOREVERSION_CONTENT_FAILURE', message: 'error' })).to.be.eq(null);
        });
        it('should handle FETCH_CONTENT_REQUEST', () => {
            expect(Reducers.childrenerror(null, { type: 'FETCH_CONTENT_REQUEST' })).to.be.eq(null);
        });
        it('should handle FETCH_CONTENT_SUCCESS', () => {
            expect(Reducers.childrenerror(null, { type: 'FETCH_CONTENT_SUCCESS' })).to.be.eq(null);
        });
        it('should handle CREATE_CONTENT_REQUEST', () => {
            expect(Reducers.childrenerror(null, { type: 'CREATE_CONTENT_REQUEST' })).to.be.eq(null);
        });
        it('should handle CREATE_CONTENT_SUCCESS', () => {
            expect(Reducers.childrenerror(null, { type: 'CREATE_CONTENT_SUCCESS' })).to.be.eq(null);
        });
        it('should handle UPDATE_CONTENT_REQUEST', () => {
            expect(Reducers.childrenerror(null, { type: 'UPDATE_CONTENT_REQUEST' })).to.be.eq(null);
        });
        it('should handle UPDATE_CONTENT_SUCCESS', () => {
            expect(Reducers.childrenerror(null, { type: 'UPDATE_CONTENT_SUCCESS' })).to.be.eq(null);
        });
        it('should handle DELETE_CONTENT_REQUEST', () => {
            expect(Reducers.childrenerror(null, { type: 'DELETE_CONTENT_REQUEST' })).to.be.eq(null);
        });
        it('should handle DELETE_CONTENT_SUCCESS', () => {
            expect(Reducers.childrenerror(null, { type: 'DELETE_CONTENT_SUCCESS' })).to.be.eq(null);
        });
        it('should handle CHECKIN_CONTENT_REQUEST', () => {
            expect(Reducers.childrenerror(null, { type: 'CHECKIN_CONTENT_REQUEST' })).to.be.eq(null);
        });
        it('should handle CHECKIN_CONTENT_SUCCESS', () => {
            expect(Reducers.childrenerror(null, { type: 'CHECKIN_CONTENT_SUCCESS' })).to.be.eq(null);
        });
        it('should handle CHECKOUT_CONTENT_REQUEST', () => {
            expect(Reducers.childrenerror(null, { type: 'CHECKOUT_CONTENT_REQUEST' })).to.be.eq(null);
        });
        it('should handle CHECKOUT_CONTENT_SUCCESS', () => {
            expect(Reducers.childrenerror(null, { type: 'CHECKOUT_CONTENT_SUCCESS' })).to.be.eq(null);
        });
        it('should handle APPROVE_CONTENT_REQUEST', () => {
            expect(Reducers.childrenerror(null, { type: 'APPROVE_CONTENT_REQUEST' })).to.be.eq(null);
        });
        it('should handle APPROVE_CONTENT_SUCCESS', () => {
            expect(Reducers.childrenerror(null, { type: 'APPROVE_CONTENT_SUCCESS' })).to.be.eq(null);
        });
        it('should handle PUBLISH_CONTENT_REQUEST', () => {
            expect(Reducers.childrenerror(null, { type: 'PUBLISH_CONTENT_REQUEST' })).to.be.eq(null);
        });
        it('should handle PUBLISH_CONTENT_SUCCESS', () => {
            expect(Reducers.childrenerror(null, { type: 'PUBLISH_CONTENT_SUCCESS' })).to.be.eq(null);
        });
        it('should handle REJECT_CONTENT_REQUEST', () => {
            expect(Reducers.childrenerror(null, { type: 'REJECT_CONTENT_REQUEST' })).to.be.eq(null);
        });
        it('should handle REJECT_CONTENT_SUCCESS', () => {
            expect(Reducers.childrenerror(null, { type: 'REJECT_CONTENT_SUCCESS' })).to.be.eq(null);
        });
        it('should handle UNDOCHECKOUT_CONTENT_REQUEST', () => {
            expect(Reducers.childrenerror(null, { type: 'UNDOCHECKOUT_CONTENT_REQUEST' })).to.be.eq(null);
        });
        it('should handle UNDOCHECKOUT_CONTENT_SUCCESS', () => {
            expect(Reducers.childrenerror(null, { type: 'UNDOCHECKOUT_CONTENT_SUCCESS' })).to.be.eq(null);
        });
        it('should handle FORCEUNDOCHECKOUT_CONTENT_REQUEST', () => {
            expect(Reducers.childrenerror(null, { type: 'FORCEUNDOCHECKOUT_CONTENT_REQUEST' })).to.be.eq(null);
        });
        it('should handle FORCEUNDOCHECKOUT_CONTENT_SUCCESS', () => {
            expect(Reducers.childrenerror(null, { type: 'FORCEUNDOCHECKOUT_CONTENT_SUCCESS' })).to.be.eq(null);
        });
        it('should handle RESTOREVERSION_CONTENT_REQUEST', () => {
            expect(Reducers.childrenerror(null, { type: 'RESTOREVERSION_CONTENT_REQUEST' })).to.be.eq(null);
        });
        it('should handle RESTOREVERSION_CONTENT_SUCCESS', () => {
            expect(Reducers.childrenerror(null, { type: 'RESTOREVERSION_CONTENT_SUCCESS' })).to.be.eq(null);
        });
    });
    describe('childrenactions reducer', () => {
        it('should return the initial state', () => {
            expect(Reducers.childrenactions(undefined, {})).to.be.deep.equal({});
        });
    });
    describe('top reducer', () => {
        it('should return the initial state', () => {
            expect(Reducers.top(undefined, {})).to.be.deep.equal({});
        });
        it('should return 10', () => {
            expect(Reducers.top(undefined, { type: 'FETCH_CONTENT_REQUEST', options: { top: 10 } })).to.be.eq(10);
        });
        it('should return initial state', () => {
            expect(Reducers.top(undefined, { type: 'FETCH_CONTENT_REQUEST', options: {} })).to.be.deep.equal({});
        });
    });
    describe('skip reducer', () => {
        it('should return the initial state', () => {
            expect(Reducers.skip(undefined, {})).to.be.deep.equal({});
        });
        it('should return 10', () => {
            expect(Reducers.skip(undefined, { type: 'FETCH_CONTENT_REQUEST', options: { skip: 10 } })).to.be.eq(10);
        });
        it('should return initial state', () => {
            expect(Reducers.skip(undefined, { type: 'FETCH_CONTENT_REQUEST', options: {} })).to.be.deep.equal({});
        });
    });
    describe('query reducer', () => {
        it('should return the initial state', () => {
            expect(Reducers.query(undefined, {})).to.be.deep.equal({});
        });
        it('should return "DisplayName:aaa"', () => {
            expect(Reducers.query(undefined, { type: 'FETCH_CONTENT_REQUEST', options: { query: 'DisplayName:aaa' } })).to.be.eq('DisplayName:aaa');
        });
        it('should return initial state', () => {
            expect(Reducers.query(undefined, { type: 'FETCH_CONTENT_REQUEST', options: {} })).to.be.deep.equal({});
        });
    });
    describe('order reducer', () => {
        it('should return the initial state', () => {
            expect(Reducers.order(undefined, {})).to.be.deep.equal({});
        });
        it('should return "DisplayName desc"', () => {
            expect(Reducers.order(undefined, { type: 'FETCH_CONTENT_REQUEST', options: { orderby: 'DisplayName desc' } })).to.be.eq('DisplayName desc');
        });
        it('should return initial state', () => {
            expect(Reducers.order(undefined, { type: 'FETCH_CONTENT_REQUEST', options: {} })).to.be.deep.equal({});
        });
    });
    describe('filter reducer', () => {
        it('should return the initial state', () => {
            expect(Reducers.filter(undefined, {})).to.be.deep.equal({});
        });
        it('should return "isOf(Task)"', () => {
            expect(Reducers.filter(undefined, { type: 'FETCH_CONTENT_REQUEST', options: { filter: 'isOf(Task)' } })).to.be.eq('isOf(Task)');
        });
        it('should return initial state', () => {
            expect(Reducers.filter(undefined, { type: 'FETCH_CONTENT_REQUEST', options: {} })).to.be.deep.equal({});
        });
    });
    describe('select reducer', () => {
        it('should return the initial state', () => {
            expect(Reducers.select(undefined, {})).to.be.deep.equal({});
        });
        it('should return "isOf(Task)"', () => {
            expect(Reducers.select(undefined, { type: 'FETCH_CONTENT_REQUEST', options: { select: 'all' } })).to.be.eq('all');
        });
        it('should return initial state', () => {
            expect(Reducers.select(undefined, { type: 'FETCH_CONTENT_REQUEST', options: {} })).to.be.deep.equal({});
        });
    });
    describe('isSaved reducer', () => {
        it('should return the initial state', () => {
            expect(Reducers.isSaved(undefined, {})).to.be.deep.equal(true);
        });
        it('should return false', () => {
            expect(Reducers.isSaved(undefined, { type: 'CREATE_CONTENT_REQUEST' })).to.be.deep.equal(false);
        });
        it('should return false', () => {
            expect(Reducers.isSaved(undefined, { type: 'CREATE_CONTENT_FAILURE' })).to.be.deep.equal(false);
        });
        it('should return false', () => {
            expect(Reducers.isSaved(undefined, { type: 'UPDATE_CONTENT_REQUEST' })).to.be.deep.equal(false);
        });
        it('should return false', () => {
            expect(Reducers.isSaved(undefined, { type: 'UPDATE_CONTENT_FAILURE' })).to.be.deep.equal(false);
        });
        it('should return false', () => {
            expect(Reducers.isSaved(undefined, { type: 'LOAD_CONTENT_REQUEST' })).to.be.deep.equal(false);
        });
        it('should return false', () => {
            expect(Reducers.isSaved(undefined, { type: 'LOAD_CONTENT_FAILURE' })).to.be.deep.equal(false);
        });
    })
    describe('isValid reducer', () => {
        it('should return the initial state', () => {
            expect(Reducers.isValid(undefined, {})).to.be.deep.equal(true);
        });
    })
    describe('isDirty reducer', () => {
        it('should return the initial state', () => {
            expect(Reducers.isDirty(undefined, {})).to.be.deep.equal(false);
        });
    })
    describe('isOperationInProgress reducer', () => {
        it('should return the initial state', () => {
            expect(Reducers.isOperationInProgress(undefined, {})).to.be.deep.equal(false);
        });
        it('should return true', () => {
            expect(Reducers.isOperationInProgress(undefined, { type: 'CREATE_CONTENT_REQUEST' })).to.be.deep.equal(true);
        });
        it('should return true', () => {
            expect(Reducers.isOperationInProgress(undefined, { type: 'UPDATE_CONTENT_REQUEST' })).to.be.deep.equal(true);
        });
        it('should return true', () => {
            expect(Reducers.isOperationInProgress(undefined, { type: 'DELETE_CONTENT_REQUEST' })).to.be.deep.equal(true);
        });
    })
    describe('contenterror reducer', () => {
        it('should return the initial state', () => {
            expect(Reducers.contenterror(undefined, {})).to.be.eq(null);
        });
        it('should handle FETCH_CONTENT_FAILURE', () => {
            expect(Reducers.contenterror(null, { type: 'FETCH_CONTENT_FAILURE', message: 'error' })).to.be.eq(null);
        });
        it('should handle CREATE_CONTENT_FAILURE', () => {
            expect(Reducers.contenterror(null, { type: 'CREATE_CONTENT_FAILURE', message: 'error' })).to.be.eq('error');
        });
        it('should handle UPDATE_CONTENT_FAILURE', () => {
            expect(Reducers.contenterror(null, { type: 'UPDATE_CONTENT_FAILURE', message: 'error' })).to.be.eq('error');
        });
        it('should handle DELETE_CONTENT_FAILURE', () => {
            expect(Reducers.contenterror(null, { type: 'DELETE_CONTENT_FAILURE', message: 'error' })).to.be.eq('error');
        });
        it('should handle CHECKIN_CONTENT_FAILURE', () => {
            expect(Reducers.contenterror(null, { type: 'CHECKIN_CONTENT_FAILURE', message: 'error' })).to.be.eq('error');
        });
        it('should handle CHECKOUT_CONTENT_FAILURE', () => {
            expect(Reducers.contenterror(null, { type: 'CHECKOUT_CONTENT_FAILURE', message: 'error' })).to.be.eq('error');
        });
        it('should handle PUBLISH_CONTENT_FAILURE', () => {
            expect(Reducers.contenterror(null, { type: 'PUBLISH_CONTENT_FAILURE', message: 'error' })).to.be.eq('error');
        });
        it('should handle APPROVE_CONTENT_FAILURE', () => {
            expect(Reducers.contenterror(null, { type: 'APPROVE_CONTENT_FAILURE', message: 'error' })).to.be.eq('error');
        });
        it('should handle REJECT_CONTENT_FAILURE', () => {
            expect(Reducers.contenterror(null, { type: 'REJECT_CONTENT_FAILURE', message: 'error' })).to.be.eq('error');
        });
        it('should handle UNDOCHECKOUT_CONTENT_FAILURE', () => {
            expect(Reducers.contenterror(null, { type: 'UNDOCHECKOUT_CONTENT_FAILURE', message: 'error' })).to.be.eq('error');
        });
        it('should handle FORCEUNDOCHECKOUT_CONTENT_FAILURE', () => {
            expect(Reducers.contenterror(null, { type: 'FORCEUNDOCHECKOUT_CONTENT_FAILURE', message: 'error' })).to.be.eq('error');
        });
        it('should handle RESTOREVERSION_CONTENT_FAILURE', () => {
            expect(Reducers.contenterror(null, { type: 'RESTOREVERSION_CONTENT_FAILURE', message: 'error' })).to.be.eq('error');
        });
        it('should handle FETCH_CONTENT_REQUEST', () => {
            expect(Reducers.contenterror(null, { type: 'FETCH_CONTENT_REQUEST' })).to.be.eq(null);
        });
        it('should handle FETCH_CONTENT_SUCCESS', () => {
            expect(Reducers.contenterror(null, { type: 'FETCH_CONTENT_SUCCESS' })).to.be.eq(null);
        });
        it('should handle CREATE_CONTENT_REQUEST', () => {
            expect(Reducers.contenterror(null, { type: 'CREATE_CONTENT_REQUEST' })).to.be.eq(null);
        });
        it('should handle CREATE_CONTENT_SUCCESS', () => {
            expect(Reducers.contenterror(null, { type: 'CREATE_CONTENT_SUCCESS' })).to.be.eq(null);
        });
        it('should handle UPDATE_CONTENT_REQUEST', () => {
            expect(Reducers.contenterror(null, { type: 'UPDATE_CONTENT_REQUEST' })).to.be.eq(null);
        });
        it('should handle UPDATE_CONTENT_SUCCESS', () => {
            expect(Reducers.contenterror(null, { type: 'UPDATE_CONTENT_SUCCESS' })).to.be.eq(null);
        });
        it('should handle DELETE_CONTENT_REQUEST', () => {
            expect(Reducers.contenterror(null, { type: 'DELETE_CONTENT_REQUEST' })).to.be.eq(null);
        });
        it('should handle DELETE_CONTENT_SUCCESS', () => {
            expect(Reducers.contenterror(null, { type: 'DELETE_CONTENT_SUCCESS' })).to.be.eq(null);
        });
        it('should handle CHECKIN_CONTENT_REQUEST', () => {
            expect(Reducers.contenterror(null, { type: 'CHECKIN_CONTENT_REQUEST' })).to.be.eq(null);
        });
        it('should handle CHECKIN_CONTENT_SUCCESS', () => {
            expect(Reducers.contenterror(null, { type: 'CHECKIN_CONTENT_SUCCESS' })).to.be.eq(null);
        });
        it('should handle CHECKOUT_CONTENT_REQUEST', () => {
            expect(Reducers.contenterror(null, { type: 'CHECKOUT_CONTENT_REQUEST' })).to.be.eq(null);
        });
        it('should handle CHECKOUT_CONTENT_SUCCESS', () => {
            expect(Reducers.contenterror(null, { type: 'CHECKOUT_CONTENT_SUCCESS' })).to.be.eq(null);
        });
        it('should handle APPROVE_CONTENT_REQUEST', () => {
            expect(Reducers.contenterror(null, { type: 'APPROVE_CONTENT_REQUEST' })).to.be.eq(null);
        });
        it('should handle APPROVE_CONTENT_SUCCESS', () => {
            expect(Reducers.contenterror(null, { type: 'APPROVE_CONTENT_SUCCESS' })).to.be.eq(null);
        });
        it('should handle PUBLISH_CONTENT_REQUEST', () => {
            expect(Reducers.contenterror(null, { type: 'PUBLISH_CONTENT_REQUEST' })).to.be.eq(null);
        });
        it('should handle PUBLISH_CONTENT_SUCCESS', () => {
            expect(Reducers.contenterror(null, { type: 'PUBLISH_CONTENT_SUCCESS' })).to.be.eq(null);
        });
        it('should handle REJECT_CONTENT_REQUEST', () => {
            expect(Reducers.contenterror(null, { type: 'REJECT_CONTENT_REQUEST' })).to.be.eq(null);
        });
        it('should handle REJECT_CONTENT_SUCCESS', () => {
            expect(Reducers.contenterror(null, { type: 'REJECT_CONTENT_SUCCESS' })).to.be.eq(null);
        });
        it('should handle UNDOCHECKOUT_CONTENT_REQUEST', () => {
            expect(Reducers.contenterror(null, { type: 'UNDOCHECKOUT_CONTENT_REQUEST' })).to.be.eq(null);
        });
        it('should handle UNDOCHECKOUT_CONTENT_SUCCESS', () => {
            expect(Reducers.contenterror(null, { type: 'UNDOCHECKOUT_CONTENT_SUCCESS' })).to.be.eq(null);
        });
        it('should handle FORCEUNDOCHECKOUT_CONTENT_REQUEST', () => {
            expect(Reducers.contenterror(null, { type: 'FORCEUNDOCHECKOUT_CONTENT_REQUEST' })).to.be.eq(null);
        });
        it('should handle FORCEUNDOCHECKOUT_CONTENT_SUCCESS', () => {
            expect(Reducers.contenterror(null, { type: 'FORCEUNDOCHECKOUT_CONTENT_SUCCESS' })).to.be.eq(null);
        });
        it('should handle RESTOREVERSION_CONTENT_REQUEST', () => {
            expect(Reducers.contenterror(null, { type: 'RESTOREVERSION_CONTENT_REQUEST' })).to.be.eq(null);
        });
        it('should handle RESTOREVERSION_CONTENT_SUCCESS', () => {
            expect(Reducers.contenterror(null, { type: 'RESTOREVERSION_CONTENT_SUCCESS' })).to.be.eq(null);
        });
    });
    describe('contentactions reducer', () => {
        const action = {
            type: 'LOAD_CONTENT_ACTIONS_SUCCESS',
            actions: ['aaa', 'bbb']
        }
        it('should return the initial state', () => {
            expect(Reducers.contentactions(undefined, {})).to.deep.equal({});
        });
        it('should return an array with actions', () => {
            expect(Reducers.contentactions(null, action)).to.deep.equal(['aaa', 'bbb']);
        });
    });
    describe('fields reducer', () => {
        it('should return the initial state', () => {
            expect(Reducers.fields(undefined, {})).to.deep.equal({});
        });
        it('should return fields of the content', () => {

            let repo: Mocks.MockRepository = new Mocks.MockRepository();
            let content = Content.Create({
                Path: '/Root/Sites/Default_Site/tasks',
                Status: 'active' as any
            }, ContentTypes.Task, repo)
            const action = {
                type: 'LOAD_CONTENT_SUCCESS',
                response: content
            }
            expect(Reducers.fields({}, action)).to.deep.equal({
                Path: '/Root/Sites/Default_Site/tasks',
                Status: 'active'
            });
        });
        it('should return fields of the content', () => {

            let repo: Mocks.MockRepository = new Mocks.MockRepository();
            let content = Content.Create({
                Path: '/Root/Sites/Default_Site/tasks',
                Status: 'active' as any
            }, ContentTypes.Task, repo)
            const action = {
                type: 'RELOAD_CONTENT_SUCCESS',
                response: content
            }
            expect(Reducers.fields(null, action)).to.deep.equal({
                Path: '/Root/Sites/Default_Site/tasks',
                Status: 'active'
            });
        });
    });
    describe('content reducer', () => {
        it('should return the initial state', () => {
            expect(Reducers.fields(undefined, {})).to.deep.equal({});
        });
        it('should return a content', () => {
            let repo: Mocks.MockRepository = new Mocks.MockRepository();
            let content = Content.Create({
                Path: '/Root/Sites/Default_Site/tasks',
                Status: 'active' as any
            }, ContentTypes.Task, repo)
            const action = {
                type: 'LOAD_CONTENT_SUCCESS',
                response: content
            }
            expect(Reducers.content(undefined, action)).to.deep.equal(content);
        });
        it('should return a content', () => {
            let repo: Mocks.MockRepository = new Mocks.MockRepository();
            let content = Content.Create({
                Path: '/Root/Sites/Default_Site/tasks',
                Status: 'active' as any
            }, ContentTypes.Task, repo)
            const action = {
                type: 'RELOAD_CONTENT_SUCCESS',
                response: content
            }
            expect(Reducers.content(undefined, action)).to.deep.equal(content);
        });
    })
    describe('selected reducer', () => {
        it('should return the initial state', () => {
            expect(Reducers.selected(undefined, {})).to.deep.equal([]);
        });
    })
    describe('getContent', () => {
        const state = {
            entities: {
                collection: {
                    5145: {
                        Id: 5145,
                        DisplayName: 'Some Article',
                        Status: ['Active']
                    },
                    5146: {
                        Id: 5146,
                        Displayname: 'Other Article',
                        Status: ['Completed']
                    }
                }
            }
        }
        it('should return the content from the state by the given id', () => {
            expect(Reducers.getContent(state.entities.collection, 5145)).to.be.deep.eq(
                {
                    Id: 5145,
                    DisplayName: 'Some Article',
                    Status: ['Active']
                }
            );
        });
    });

    describe('repository reducer', () => {
        it('should return the initial state', () => {
            expect(Reducers.repository(undefined, {})).to.be.deep.equal(null);
        });
        it('should return the repository config', () => {
            let repo: Mocks.MockRepository = new Mocks.MockRepository();
            expect(Reducers.repository(null, { type: 'LOAD_REPOSITORY', repository: repo.Config })).to.be.deep.equal(repo.Config);
        });
    })

    describe('getIds', () => {
        const state = {
            ids: [5145, 5146]
        }
        it('should return the id array from the current state', () => {
            expect(Reducers.getIds(state)).to.be.deep.eq([5145, 5146]);
        });
    });

    describe('getFetching', () => {
        const state = {
            ids: [5145, 5146],
            isFetching: false
        }
        it('should return the value of isFetching from the current state', () => {
            expect(Reducers.getFetching(state)).to.be.eq(false);
        });
    });

    describe('getError', () => {
        const state = {
            ids: [5145, 5146],
            isFetching: false,
            error: 'error'
        }
        it('should return the value of errorMessage from the current state', () => {
            expect(Reducers.getError(state)).to.be.eq('error');
        });
    });

    describe('getAuthenticationStatus', () => {
        const state = {
            session: {
                loginState: Authentication.LoginState.Authenticated
            }
        }
        it('should return true if the user is authenticated state', () => {
            expect(Reducers.getAuthenticationStatus(state)).to.be.eq(Authentication.LoginState.Authenticated);
        });
    });

    describe('getAuthenticationError', () => {
        const state = {
            session: {
                error: 'error'
            }
        }
        it('should return the value of errorMessage from the current state', () => {
            expect(Reducers.getAuthenticationError(state)).to.be.eq('error');
        });
    });
    describe('getRepositoryUrl', () => {
        const state = {
            session: {
                repository: {
                    RepositoryUrl: 'https://dmsservice.demo.sensenet.com'
                }
            }
        }
        it('should return the value of RepositoryUrl from the current state', () => {
            expect(Reducers.getRepositoryUrl(state)).to.be.eq('https://dmsservice.demo.sensenet.com');
        });
    });
});