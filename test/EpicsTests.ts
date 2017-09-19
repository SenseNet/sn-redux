import * as Chai from 'chai';
import configureMockStore from 'redux-mock-store';
import { createEpicMiddleware } from 'redux-observable';
import { Mocks, ContentTypes, HttpProviders, Authentication, ODataApi, Content } from 'sn-client-js';
import { Epics } from '../src/Epics'
import { Actions } from '../src/Actions'
import { Store } from '../src/Store'
const expect = Chai.expect;
import 'rxjs';

describe('Epics', () => {

    let repo: Mocks.MockRepository = new Mocks.MockRepository();
    (repo.Authentication as Mocks.MockAuthService).stateSubject.next(Authentication.LoginState.Authenticated);
    (repo.httpProviderRef as Mocks.MockHttpProvider).UseTimeout = false;

    beforeEach(() => {
        (repo.httpProviderRef as Mocks.MockHttpProvider).setError({ message: 'XMLHttpRequest is not supported by your browser' });

    })
    describe('fetchContent Epic', () => {
        let store;
        const epicMiddleware = createEpicMiddleware(Epics.fetchContentEpic, { dependencies: { repository: repo } });
        const mockStore = configureMockStore([epicMiddleware]);

        before(() => {
            store = mockStore();
        });

        after(() => {
            epicMiddleware.replaceEpic(Epics.fetchContentEpic);
        });
        it('handles the error', () => {
            store.dispatch({ type: 'FETCH_CONTENT_REQUEST', path: '/workspaces/Project', options: {} });
            expect(store.getActions()).to.be.deep.eq(
                [{
                    type: 'FETCH_CONTENT_REQUEST',
                    path: '/workspaces/Project',
                    options:
                    {
                        select: ['Id', 'Path', 'Name', 'Type', 'DisplayName', 'Description', 'Icon'],
                        metadata: 'no',
                        inlinecount: 'allpages',
                        expand: undefined,
                        top: 1000
                    }
                },
                {
                    type: 'FETCH_CONTENT_FAILURE',
                    params:
                    {
                        select: ['Id', 'Path', 'Name', 'Type', 'DisplayName', 'Description', 'Icon'],
                        metadata: 'no',
                        inlinecount: 'allpages',
                        expand: undefined,
                        top: 1000
                    },
                    message: 'XMLHttpRequest is not supported by your browser'
                }]);
        })
    });
    // describe('initSensenetStoreEpic Epic', () => {
    //     let store;
    //     const epicMiddleware = createEpicMiddleware(Epics.initSensenetStoreEpic, { dependencies: { repository: repo } });
    //     const mockStore = configureMockStore([epicMiddleware]);
    //     before(() => {
    //         store = mockStore();
    //     });

    //     after(() => {
    //         epicMiddleware.replaceEpic(Epics.initSensenetStoreEpic);
    //     });
    //     it('handles the error', () => {
    //         const user = Content.Create({ Name: 'alba', Id: 123 }, ContentTypes.User, repo)
    //         store.dispatch({ type: 'INIT_SENSENET_STORE', path: '/workspaces', options: {} });
    //         expect(store.getActions()).to.equal(
    //             [{
    //                 type: 'INIT_SENSENET_STORE',
    //                 path: '/workspaces',
    //                 options:
    //                 {
    //                     select: [['Id', 'Path', 'Name', 'Type'],
    //                     ['DisplayName', 'Description', 'Icon']],
    //                     metadata: 'no',
    //                     inlinecount: 'allpages',
    //                     expand: undefined,
    //                     top: 1000
    //                 }
    //             },
    //             {
    //                 type: 'USER_CHANGED',
    //                 user: user
    //             },
    //             { type: 'CHECK_LOGIN_STATE_REQUEST' },
    //             {
    //                 type: 'LOAD_CONTENT_FAILURE',
    //                 params:
    //                 {
    //                     select: [['Id', 'Path', 'Name', 'Type'],
    //                     ['DisplayName', 'Description', 'Icon']],
    //                     metadata: 'no',
    //                     inlinecount: 'allpages',
    //                     expand: undefined,
    //                     top: 1000
    //                 },
    //                 message: 'XMLHttpRequest is not supported by your browser'
    //             }]);
    //     })
    // })
    describe('loadContent Epic', () => {
        let store;
        const epicMiddleware = createEpicMiddleware(Epics.loadContentEpic, { dependencies: { repository: repo } });
        const mockStore = configureMockStore([epicMiddleware]);

        before(() => {
            store = mockStore();
        });

        after(() => {
            epicMiddleware.replaceEpic(Epics.loadContentEpic);
        });
        it('handles the error', () => {
            store.dispatch({ type: 'LOAD_CONTENT_REQUEST', path: '/workspaces/Project', options: {} });
            expect(store.getActions()).to.be.deep.eq(
                [{
                    type: 'LOAD_CONTENT_REQUEST',
                    path: '/workspaces/Project',
                    options:
                    {
                        select: ['Id', 'Path', 'Name', 'Type', 'DisplayName', 'Description', 'Icon'],
                        metadata: 'no',
                        inlinecount: 'allpages',
                        expand: undefined,
                        top: 1000
                    }
                },
                {
                    type: 'LOAD_CONTENT_FAILURE',
                    params:
                    {
                        select: ['Id', 'Path', 'Name', 'Type', 'DisplayName', 'Description', 'Icon'],
                        metadata: 'no',
                        inlinecount: 'allpages',
                        expand: undefined,
                        top: 1000
                    },
                    message: 'XMLHttpRequest is not supported by your browser'
                }]);
        })
    });
    describe('reloadContent Epic', () => {
        let store;
        const epicMiddleware = createEpicMiddleware(Epics.reloadContentEpic, { dependencies: { repository: repo } });
        const mockStore = configureMockStore([epicMiddleware]);

        before(() => {
            store = mockStore();
        });

        after(() => {
            epicMiddleware.replaceEpic(Epics.reloadContentEpic);
        });

        const content = repo.HandleLoadedContent({ DisplayName: 'My Content', Id: 123, Path: '/workspaces' }, ContentTypes.Task)
        it('handles the error', () => {
            content.Save('/workspaces')
            store.dispatch({ type: 'RELOAD_CONTENT_REQUEST', content, options: {} });
            expect(store.getActions()).to.be.deep.eq([
                {
                    type: 'RELOAD_CONTENT_REQUEST',
                    content,
                    options: {}
                }]);
        })
        it('handles the error', () => {
            store.dispatch({ type: 'RELOAD_CONTENT_FAILURE', error: 'error' });
            expect(store.getActions()).to.be.deep.eq(
                [{
                    type: 'RELOAD_CONTENT_REQUEST',
                    content,
                    options: {}
                },
                { type: 'RELOAD_CONTENT_FAILURE', error: 'error' }]);
        })
    });
    describe('reloadContentFields Epic', () => {
        let store;
        const epicMiddleware = createEpicMiddleware(Epics.reloadContentFieldsEpic, { dependencies: { repository: repo } });
        const mockStore = configureMockStore([epicMiddleware]);

        before(() => {
            store = mockStore();
        });

        after(() => {
            epicMiddleware.replaceEpic(Epics.reloadContentFieldsEpic);
        });

        const content = repo.HandleLoadedContent({ DisplayName: 'My Content', Id: 123, Path: '/workspaces' }, ContentTypes.Task)
        it('handles the error', () => {
            const content = repo.HandleLoadedContent({ DisplayName: 'My Content', Id: 123, Path: '/workspaces' }, ContentTypes.Task)
            store.dispatch({ type: 'RELOAD_CONTENTFIELDS_REQUEST', content, options: {}, fields: ['DisplayName'] });
            expect(store.getActions()).to.be.deep.eq(
                [{
                    type: 'RELOAD_CONTENTFIELDS_REQUEST',
                    content,
                    options: {},
                    fields: ['DisplayName']
                },
                {
                    type: 'RELOAD_CONTENTFIELDS_FAILURE',
                    message: 'XMLHttpRequest is not supported by your browser'
                }]);
        })
        it('handles the error', () => {
            store.dispatch({ type: 'RELOAD_CONTENTFIELDS_FAILURE', error: 'error' });
            expect(store.getActions()).to.be.deep.eq(
                [{
                    type: 'RELOAD_CONTENTFIELDS_REQUEST',
                    content,
                    options: {},
                    fields: ['DisplayName']
                },
                {
                    type: 'RELOAD_CONTENTFIELDS_FAILURE',
                    message: 'XMLHttpRequest is not supported by your browser'
                },
                { type: 'RELOAD_CONTENTFIELDS_FAILURE', error: 'error' }]);
        })
    });
    describe('createContent Epic', () => {
        let store;
        const epicMiddleware = createEpicMiddleware(Epics.createContentEpic, { dependencies: { repository: repo } });
        const mockStore = configureMockStore([epicMiddleware]);

        before(() => {
            store = mockStore();
        });

        after(() => {
            epicMiddleware.replaceEpic(Epics.createContentEpic);
        });
        const content = Content.Create({ DisplayName: 'My content', Id: 123, Path: '/workspaces' }, ContentTypes.Task, repo);
        it('handles the error', () => {
            store.dispatch({ type: 'CREATE_CONTENT_REQUEST', content, contentType: ContentTypes.Task });
            expect(store.getActions()).to.be.deep.eq(
                [{
                    type: 'CREATE_CONTENT_REQUEST',
                    content: content,
                    contentType: ContentTypes.Task
                }]);
        })
        it('handles the error', () => {
            store.dispatch({ type: 'CREATE_CONTENT_FAILURE', error: { message: 'error' } });
            expect(store.getActions()).to.be.deep.eq(
                [{
                    type: 'CREATE_CONTENT_REQUEST',
                    content,
                    contentType: ContentTypes.Task
                },
                { type: 'CREATE_CONTENT_FAILURE', error: { message: 'error' } }]);
        })
    });
    describe('updateContent Epic', () => {
        let store;
        const epicMiddleware = createEpicMiddleware(Epics.updateContentEpic, { dependencies: { repository: repo } });
        const mockStore = configureMockStore([epicMiddleware]);

        before(() => {
            store = mockStore();
        });

        after(() => {
            epicMiddleware.replaceEpic(Epics.updateContentEpic);
        });
        it('handles the error', () => {
            const content = Content.Create({ DisplayName: 'My content', Id: 123, Path: '/workspaces' }, ContentTypes.Task, repo);
            store.dispatch({ type: 'UPDATE_CONTENT_REQUEST', content });
            expect(store.getActions()).to.be.deep.eq(
                [{
                    type: 'UPDATE_CONTENT_REQUEST',
                    content
                }]);
        })
    });
    describe('deleteContent Epic', () => {
        let store;
        const epicMiddleware = createEpicMiddleware(Epics.deleteContentEpic, { dependencies: { repository: repo } });
        const mockStore = configureMockStore([epicMiddleware]);

        before(() => {
            store = mockStore();
        });

        after(() => {
            epicMiddleware.replaceEpic(Epics.deleteContentEpic);
        });
        const content = Content.Create({ DisplayName: 'My content', Id: 123, Path: '/workspaces' }, ContentTypes.Task, repo);
        it('handles the error', () => {
            store.dispatch({ type: 'DELETE_CONTENT_REQUEST', content, permanently: false });
            expect(store.getActions()).to.be.deep.eq(
                [{
                    type: 'DELETE_CONTENT_REQUEST',
                    content,
                    permanently: false
                }]);
        })
        it('handles the error', () => {
            store.dispatch({ type: 'DELETE_CONTENT_FAILURE', error: 'error' });
            expect(store.getActions()).to.be.deep.eq(
                [{
                    type: 'DELETE_CONTENT_REQUEST',
                    content,
                    permanently: false
                },
                { type: 'DELETE_CONTENT_FAILURE', error: 'error' }]);
        })
    });
    describe('deleteBatch Epic', () => {
        let store;
        const epicMiddleware = createEpicMiddleware(Epics.deleteBatchEpic, { dependencies: { repository: repo } });
        const mockStore = configureMockStore([epicMiddleware]);

        before(() => {
            store = mockStore();
        });

        after(() => {
            epicMiddleware.replaceEpic(Epics.deleteBatchEpic);
        });
        // it('handles the error', () => {
        //     store.dispatch({ type: 'DELETE_BATCH_REQUEST', ids: ['1', '2'], permanently: false });
        //     expect(store.getActions()).to.be.deep.eq(
        //         [{
        //             type: 'DELETE_BATCH_REQUEST',
        //             path: '/workspaces/Project',
        //             ids: ['1', '2'],
        //             permanently: false
        //         }]);
        // })
    });
    describe('checkoutContent Epic', () => {
        let store;
        const epicMiddleware = createEpicMiddleware(Epics.checkoutContentEpic, { dependencies: { repository: repo } });
        const mockStore = configureMockStore([epicMiddleware]);

        before(() => {
            store = mockStore();
        });

        after(() => {
            epicMiddleware.replaceEpic(Epics.checkoutContentEpic);
        });
        it('handles the error', () => {

            const content = Content.Create({ DisplayName: 'My content', Id: 123, Path: '/workspaces' }, ContentTypes.Task, repo);
            (repo.httpProviderRef as Mocks.MockHttpProvider).setError({ message: 'Checkout Content failed' });
            store.dispatch({ type: 'CHECKOUT_CONTENT_REQUEST', content });
            expect(store.getActions()).to.be.deep.eq(
                [{
                    type: 'CHECKOUT_CONTENT_REQUEST',
                    content
                }]);
        })
    });
    describe('checkinContent Epic', () => {
        let store;
        const epicMiddleware = createEpicMiddleware(Epics.checkinContentEpic, { dependencies: { repository: repo } });
        const mockStore = configureMockStore([epicMiddleware]);

        before(() => {
            store = mockStore();
        });

        after(() => {
            epicMiddleware.replaceEpic(Epics.checkinContentEpic);
        });
        it('handles the error', () => {
            const content = Content.Create({ DisplayName: 'My content', Id: 123, Path: '/workspaces' }, ContentTypes.Task, repo);
            (repo.httpProviderRef as Mocks.MockHttpProvider).setError({ message: 'Checkin Content failed' });

            store.dispatch({ type: 'CHECKIN_CONTENT_REQUEST', content, checkinComment: 'comment' });
            expect(store.getActions()).to.be.deep.eq(
                [{
                    type: 'CHECKIN_CONTENT_REQUEST',
                    content,
                    checkinComment: 'comment'
                }]);
        })
    });
    describe('publishContent Epic', () => {
        let store;
        const epicMiddleware = createEpicMiddleware(Epics.publishContentEpic, { dependencies: { repository: repo } });
        const mockStore = configureMockStore([epicMiddleware]);

        before(() => {
            store = mockStore();
        });

        after(() => {
            epicMiddleware.replaceEpic(Epics.publishContentEpic);
        });
        it('handles the error', () => {
            (repo.httpProviderRef as Mocks.MockHttpProvider).setError({ message: 'Publish Content failed' });
            const content = Content.Create({ DisplayName: 'My content', Id: 123, Path: '/workspaces' }, ContentTypes.Task, repo);
            store.dispatch({ type: 'PUBLISH_CONTENT_REQUEST', content });

            expect(store.getActions()).to.be.deep.eq(
                [{
                    type: 'PUBLISH_CONTENT_REQUEST',
                    content
                }]);
        })
    });
    describe('approveContent Epic', () => {
        let store;
        const epicMiddleware = createEpicMiddleware(Epics.approveContentEpic, { dependencies: { repository: repo } });
        const mockStore = configureMockStore([epicMiddleware]);

        before(() => {
            store = mockStore();
        });

        after(() => {
            epicMiddleware.replaceEpic(Epics.approveContentEpic);
        });
        it('handles the error', () => {
            (repo.httpProviderRef as Mocks.MockHttpProvider).setError({ message: 'Approve Content failed' });
            const content = Content.Create({ DisplayName: 'My content', Id: 123, Path: '/workspaces' }, ContentTypes.Task, repo);
            store.dispatch({ type: 'APPROVE_CONTENT_REQUEST', content });
            expect(store.getActions()).to.be.deep.eq(
                [{
                    type: 'APPROVE_CONTENT_REQUEST',
                    content
                }]);
        })
    });
    describe('rejectContent Epic', () => {
        let store;
        const epicMiddleware = createEpicMiddleware(Epics.rejectContentEpic, { dependencies: { repository: repo } });
        const mockStore = configureMockStore([epicMiddleware]);

        beforeEach(() => {
            store = mockStore();
        });

        afterEach(() => {
            epicMiddleware.replaceEpic(Epics.rejectContentEpic);
        });
        it('handles the error', () => {
            (repo.httpProviderRef as Mocks.MockHttpProvider).setError({ message: 'Reject Content failed' });
            const content = Content.Create({ DisplayName: 'My content', Id: 123, Path: '/workspaces' }, ContentTypes.Task, repo);
            store.dispatch({ type: 'REJECT_CONTENT_REQUEST', content, rejectReason: 'reason' });
            expect(store.getActions()).to.be.deep.eq(
                [{
                    type: 'REJECT_CONTENT_REQUEST',
                    content,
                    rejectReason: 'reason'
                }]);
        });
    });
    describe('undocheckoutContent Epic', () => {
        let store;
        const epicMiddleware = createEpicMiddleware(Epics.undocheckoutContentEpic, { dependencies: { repository: repo } });
        const content = Content.Create({ DisplayName: 'My content', Id: 123, Path: '/workspaces' }, ContentTypes.Task, repo);
        const mockStore = configureMockStore([epicMiddleware]);

        before(() => {
            store = mockStore();
        });

        after(() => {
            epicMiddleware.replaceEpic(Epics.undocheckoutContentEpic);
        });
        it('handles the error', () => {
            (repo.httpProviderRef as Mocks.MockHttpProvider).setError({ message: 'Undo Checkout failed' });
            store.dispatch({ type: 'UNDOCHECKOUT_CONTENT_REQUEST', content });
            expect(store.getActions()).to.be.deep.eq(
                [{
                    type: 'UNDOCHECKOUT_CONTENT_REQUEST',
                    content
                }]);
        })
    });
    describe('forceundocheckoutContent Epic', () => {
        let store;
        const epicMiddleware = createEpicMiddleware(Epics.forceundocheckoutContentEpic, { dependencies: { repository: repo } });
        const content = Content.Create({ DisplayName: 'My content', Id: 123, Path: '/workspaces' }, ContentTypes.Task, repo);
        const mockStore = configureMockStore([epicMiddleware]);

        before(() => {
            store = mockStore();
        });

        after(() => {
            epicMiddleware.replaceEpic(Epics.forceundocheckoutContentEpic);
        });
        it('handles the error', () => {
            (repo.httpProviderRef as Mocks.MockHttpProvider).setError({ message: 'ForceUndoCheckout failed' });
            store.dispatch({ type: 'FORCEUNDOCHECKOUT_CONTENT_REQUEST', content });
            expect(store.getActions()).to.be.deep.eq(
                [{
                    type: 'FORCEUNDOCHECKOUT_CONTENT_REQUEST',
                    content
                }]);
        })
    });
    describe('restoreVersion Epic', () => {
        let store;
        const epicMiddleware = createEpicMiddleware(Epics.restoreversionContentEpic, { dependencies: { repository: repo } });
        const mockStore = configureMockStore([epicMiddleware]);

        before(() => {
            store = mockStore();
        });

        after(() => {
            epicMiddleware.replaceEpic(Epics.restoreversionContentEpic);
        });
        it('handles the error', () => {
            const content = Content.Create({ DisplayName: 'My content', Id: 123, Path: '/workspaces' }, ContentTypes.Task, repo);
            (repo.httpProviderRef as Mocks.MockHttpProvider).setError({ message: 'Restore failed' });
            store.dispatch({ type: 'RESTOREVERSION_CONTENT_REQUEST', content, version: 'A.1.0' });
            expect(store.getActions()).to.be.deep.eq(
                [{
                    type: 'RESTOREVERSION_CONTENT_REQUEST',
                    content,
                    version: 'A.1.0'
                }]);
        });
    });
    describe('login Epic', () => {
        let store;
        const epicMiddleware = createEpicMiddleware(Epics.userLoginEpic, { dependencies: { repository: repo } });
        const mockStore = configureMockStore([epicMiddleware]);

        beforeEach(() => {
            store = mockStore();
        });

        afterEach(() => {
            epicMiddleware.replaceEpic(Epics.userLoginEpic);
        });
        it('handles the error', () => {
            store.dispatch({ type: 'USER_LOGIN_REQUEST', username: 'alba', password: 'alba' });
            (repo.Authentication as Mocks.MockAuthService).stateSubject.next(Authentication.LoginState.Unauthenticated);
            expect(store.getActions()).to.be.deep.eq(
                [{
                    type: 'USER_LOGIN_REQUEST',
                    username: 'alba',
                    password: 'alba'
                },
                {
                    type: 'USER_LOGIN_FAILURE',
                    message: 'Failed to log in.'
                }]);
        })
        it('handles the loggedin user', () => {
            const user = Content.Create({ Name: 'alba', Id: 123 }, ContentTypes.User, repo)
            store.dispatch({ type: 'USER_LOGIN_REQUEST', username: 'user', password: 'password' });
            (repo.Authentication as Mocks.MockAuthService).stateSubject.next(Authentication.LoginState.Authenticated);
            expect(store.getActions()).to.be.deep.eq(
                [{
                    type: 'USER_LOGIN_REQUEST',
                    username: 'user',
                    password: 'password'
                },
                { type: 'USER_LOGIN_FAILURE', message: 'Failed to log in.' }]);
        })
    });
    describe('logout Epic', () => {
        let store;
        const epicMiddleware = createEpicMiddleware(Epics.userLogoutEpic, { dependencies: { repository: repo } });
        const mockStore = configureMockStore([epicMiddleware]);

        before(() => {
            store = mockStore();
        });

        after(() => {
            epicMiddleware.replaceEpic(Epics.userLogoutEpic);
        });
        it('handles the success', () => {
            (repo.Authentication as Mocks.MockAuthService).stateSubject.next(Authentication.LoginState.Unauthenticated);
            store.dispatch({ type: 'USER_LOGOUT_REQUEST', id: 111, username: 'alba', password: 'alba' });
            expect(store.getActions()).to.be.deep.eq(
                [{
                    type: 'USER_LOGOUT_REQUEST',
                    id: 111,
                    username: 'alba',
                    password: 'alba'
                },
                {
                    type: 'USER_LOGOUT_SUCCESS'
                }]);
        })
        it('handles the error', () => {
            (repo.Authentication as Mocks.MockAuthService).stateSubject.next(Authentication.LoginState.Authenticated);
            store.dispatch({ type: 'USER_LOGOUT_FAILURE', error: 'error' });
            expect(store.getActions()).to.be.deep.eq(
                [{
                    type: 'USER_LOGOUT_REQUEST',
                    id: 111,
                    username: 'alba',
                    password: 'alba'
                },
                { type: 'USER_LOGOUT_SUCCESS' },
                { type: 'USER_LOGOUT_FAILURE', error: 'error' }]);
        })
    });
    describe('checkLoginState Epic', () => {
        let store;
        const epicMiddleware = createEpicMiddleware(Epics.checkLoginStateEpic, { dependencies: { repository: repo } });
        const mockStore = configureMockStore([epicMiddleware]);

        beforeEach(() => {
            store = mockStore();
        });

        afterEach(() => {
            epicMiddleware.replaceEpic(Epics.userLoginEpic);
        });
        const user = Content.Create({ Name: 'alba', Id: '2' }, ContentTypes.User, repo)
        it('handles a loggedin user', () => {
            store.dispatch(Actions.UserLoginSuccess(user));
            (repo.Authentication as Mocks.MockAuthService).stateSubject.next(Authentication.LoginState.Authenticated);
            store.dispatch({ type: 'CHECK_LOGIN_STATE_REQUEST' });
            expect(store.getActions()).to.be.deep.eq(
                [{
                    type: 'USER_LOGIN_SUCCESS',
                    response: user
                },
                { type: 'CHECK_LOGIN_STATE_REQUEST' },
                { type: 'USER_LOGIN_SUCCESS', response: 2 }]);
        })
        it('handles an error', () => {
            (repo.Authentication as Mocks.MockAuthService).stateSubject.next(Authentication.LoginState.Unauthenticated);
            store.dispatch({ type: 'CHECK_LOGIN_STATE_REQUEST' });
            expect(store.getActions()).to.be.deep.eq([
                { type: 'CHECK_LOGIN_STATE_REQUEST' },
                { type: 'USER_LOGIN_FAILURE', message: null }]);
        })
    });
    describe('getContentActions Epic', () => {
        let store;
        const epicMiddleware = createEpicMiddleware(Epics.getContentActions, { dependencies: { repository: repo } });
        const mockStore = configureMockStore([epicMiddleware]);

        before(() => {
            store = mockStore();
        });

        after(() => {
            epicMiddleware.replaceEpic(Epics.getContentActions);
        });
        const content = Content.Create({ Name: 'alba', Id: '2' }, ContentTypes.Task, repo)
        it('handles the success', () => {
            store.dispatch({ type: 'REQUEST_CONTENT_ACTIONS', content, scenario: 'DMSDemoScenario' });
            expect(store.getActions()).to.be.deep.eq(
                [{
                    type: 'REQUEST_CONTENT_ACTIONS',
                    content,
                    scenario: 'DMSDemoScenario'
                },
                {
                    type: 'REQUEST_CONTENT_ACTIONS_FAILURE',
                    message: 'XMLHttpRequest is not supported by your browser'
                }]);
        })
        it('handles the error', () => {
            store.dispatch({ type: 'REQUEST_CONTENT_ACTIONS_FAILURE', error: 'error' });
            expect(store.getActions()).to.be.deep.eq(
                [{
                    type: 'REQUEST_CONTENT_ACTIONS',
                    content,
                    scenario: 'DMSDemoScenario'
                },
                {
                    type: 'REQUEST_CONTENT_ACTIONS_FAILURE',
                    message: 'XMLHttpRequest is not supported by your browser'
                },
                { type: 'REQUEST_CONTENT_ACTIONS_FAILURE', error: 'error' }]);
        })
    });
    describe('loadContentActionsEpic Epic', () => {
        let store;
        const epicMiddleware = createEpicMiddleware(Epics.loadContentActionsEpic, { dependencies: { repository: repo } });
        const mockStore = configureMockStore([epicMiddleware]);

        before(() => {
            store = mockStore();
        });

        after(() => {
            epicMiddleware.replaceEpic(Epics.loadContentActionsEpic);
        });
        const content = Content.Create({ Name: 'alba', Id: '2' }, ContentTypes.Task, repo)
        it('handles the success', () => {
            store.dispatch({ type: 'LOAD_CONTENT_ACTIONS', content, scenario: 'DMSDemoScenario' });
            expect(store.getActions()).to.be.deep.eq(
                [{
                    type: 'LOAD_CONTENT_ACTIONS',
                    content,
                    scenario: 'DMSDemoScenario'
                },
                {
                    type: 'LOAD_CONTENT_ACTIONS_FAILURE',
                    error: { message: 'XMLHttpRequest is not supported by your browser' }
                }]);
        })
        it('handles the error', () => {
            store.dispatch({ type: 'LOAD_CONTENT_ACTIONS_FAILURE', error: 'error' });

            expect(store.getActions()).to.be.deep.eq(
                [{
                    type: 'LOAD_CONTENT_ACTIONS',
                    content,
                    scenario: 'DMSDemoScenario'
                },
                {
                    type: 'LOAD_CONTENT_ACTIONS_FAILURE',
                    error: { message: 'XMLHttpRequest is not supported by your browser' }
                },
                { type: 'LOAD_CONTENT_ACTIONS_FAILURE', error: 'error' }]);
        })
    });
});