import { IContent } from '@sensenet/client-core'
import { IODataBatchResponse } from '@sensenet/client-core/dist/Models/IODataBatchResponse'
import { File as SNFile, Folder, Task, User } from '@sensenet/default-content-types'
import * as Chai from 'chai'
import * as Actions from '../src/Actions'
const expect = Chai.expect

describe('Actions', () => {
    const path = '/workspaces/project'
    describe('InitSensenetStore', () => {
        it('should create an action to an init sensenet store request', () => {
            const expectedAction = {
                type: 'INIT_SENSENET_STORE',
                path: '/workspaces/project',
                options: {},
            }
            expect(Actions.initSensenetStore(path, {})).to.deep.equal(expectedAction)
        })
        it('should create an action to an init sensenet store request with "/Root"', () => {
            const expectedAction = {
                type: 'INIT_SENSENET_STORE',
                path: '/Root',
                options: {},
            }
            expect(Actions.initSensenetStore()).to.deep.equal(expectedAction)
        })
    })
    describe('FetchContent', () => {
        it('should create an action to a fetch content request', () => {
            const expectedAction = {
                type: 'FETCH_CONTENT_REQUEST',
                path: '/workspaces/project',
                options: {},
                contentType: Task,
            }
            expect(Actions.requestContent(path, {}, Task)).to.deep.equal(expectedAction)
        })
        it('should create an action to a fetch content request', () => {
            const expectedAction = {
                type: 'FETCH_CONTENT_REQUEST',
                path: '/workspaces/project',
                options: {},
                contentType: undefined,
            }
            expect(Actions.requestContent(path)).to.deep.equal(expectedAction)
        })
        it('should create an action to receive content', () => {
            const expectedAction = {
                type: 'FETCH_CONTENT_SUCCESS',
                response: { entities: {}, result: [] },
                params: '?$select=Id,Type&metadata=no',
            }
            expect(Actions.receiveContent([], '?$select=Id,Type&metadata=no')).to.deep.equal(expectedAction)
        })
        it('should create an action to content fetch request failure', () => {
            const expectedAction = {
                type: 'FETCH_CONTENT_FAILURE',
                message: 'error',
                params: '?$select=Id,Type&metadata=no',
            }
            expect(Actions.receiveContentFailure('?$select=Id,Type&metadata=no', { message: 'error' })).to.deep.equal(expectedAction)
        })
    })
    describe('LoadContent', () => {
        it('should create an action to a load content request', () => {
            const expectedAction = {
                type: 'LOAD_CONTENT_REQUEST',
                id: 123,
                options: {},
                contentType: Task,
            }
            expect(Actions.loadContent(123, {}, Task)).to.deep.equal(expectedAction)
        })
        it('should create an action to a load content request', () => {
            const expectedAction = {
                type: 'LOAD_CONTENT_REQUEST',
                id: 123,
                options: {},
                contentType: undefined,
            }
            expect(Actions.loadContent(123)).to.deep.equal(expectedAction)
        })
        it('should create an action to receive a loaded content', () => {
            const content = { DisplayName: 'My content', Id: 123 } as Task
            expect(Actions.receiveLoadedContent(content, { select: ['Id', 'DisplayName'] }).response.DisplayName).to.deep.equal('My content')
        })

        it('should create an action to content reload request failure', () => {
            const expectedAction = {
                type: 'LOAD_CONTENT_FAILURE',
                message: 'error',
                params: '?$select=Id,Type&metadata=no',
            }
            expect(Actions.receiveLoadedContentFailure('?$select=Id,Type&metadata=no', { message: 'error' })).to.deep.equal(expectedAction)
        })
    })
    describe('LoadContentActions', () => {
        it('should create an action to a load content actions request', () => {
            const content = { DisplayName: 'My content', Id: 123 } as Task
            const expectedAction = {
                type: 'LOAD_CONTENT_ACTIONS',
                content,
                scenario: 'ListItem',
            }
            expect(Actions.loadContentActions(content, 'ListItem')).to.deep.equal(expectedAction)
        })
        it('should create an action to receive a loaded contents actions', () => {
            const expectedAction = {
                type: 'LOAD_CONTENT_ACTIONS_SUCCESS',
                actions: ['aa', 'bb'],
            }
            expect(Actions.receiveContentActions(['aa', 'bb'])).to.deep.equal(expectedAction)
        })
        it('should create an action to load content action request failure', () => {
            const expectedAction = {
                type: 'LOAD_CONTENT_ACTIONS_FAILURE',
                error: 'error',
            }
            expect(Actions.receiveContentActionsFailure('error')).to.deep.equal(expectedAction)
        })
    })
    describe('ReloadContent', () => {
        it('should create an action to a reload content request', () => {
            const content = { DisplayName: 'My content', Id: 123 } as Task
            const expectedAction = {
                type: 'RELOAD_CONTENT_REQUEST',
                content,
                actionName: 'edit',
            }
            expect(Actions.reloadContent(content, 'edit')).to.deep.equal(expectedAction)
        })
        it('should create an action to receive the reloaded content', () => {
            const content = { DisplayName: 'My content', Id: 123 } as Task
            expect(Actions.receiveReloadedContent(content, {}).response.DisplayName).to.deep.equal('My content')
        })

        it('should create an action to content load request failure', () => {
            const expectedAction = {
                type: 'RELOAD_CONTENT_FAILURE',
                message: 'error',
            }
            expect(Actions.receiveReloadedContentFailure({ message: 'error' })).to.deep.equal(expectedAction)
        })
    })
    describe('ReloadContentFields', () => {
        it('should create an action to a reload fields of a content request', () => {
            const content = { DisplayName: 'My content', Id: 123 } as Task
            const expectedAction = {
                type: 'RELOAD_CONTENTFIELDS_REQUEST',
                content,
                fields: ['Id', 'DisplayName'],
            }
            expect(Actions.reloadContentFields(content, ['Id', 'DisplayName'])).to.deep.equal(expectedAction)
        })
        it('should create an action to receive the reloaded fields of a content', () => {
            const content = { DisplayName: 'My content', Id: 123 } as Task
            expect(Actions.receiveReloadedContentFields(content, {}).response.DisplayName).to.deep.equal('My content')
        })
        it('should create an action to content load request failure', () => {
            const expectedAction = {
                type: 'RELOAD_CONTENTFIELDS_FAILURE',
                message: 'error',
            }
            expect(Actions.receiveReloadedContentFieldsFailure({ message: 'error' })).to.deep.equal(expectedAction)
        })
    })
    describe('CreateContent', () => {
        const content = { DisplayName: 'My content', Id: 123 } as Task

        it('should create an action to a create content request', () => {
            const expectedAction = {
                type: 'CREATE_CONTENT_REQUEST',
                content,
            }
            expect(Actions.createContent(content)).to.deep.equal(expectedAction)
        })
        it('should create an action to a create content success', () => {
            expect(Actions.createContentSuccess(content).response.entities.entities['123'].DisplayName).to.be.eq('My content')
        })
        it('should create an action to content creation failure', () => {
            const expectedAction = {
                type: 'CREATE_CONTENT_FAILURE',
                message: 'error',
            }
            expect(Actions.createContentFailure({ message: 'error' })).to.deep.equal(expectedAction)
        })
    })
    describe('UpdateContent', () => {
        it('should create an action to an update content request', () => {
            const expectedAction = {
                type: 'UPDATE_CONTENT_REQUEST',
                content: { Id: 2 },
            }
            expect(Actions.updateContent({
                Id: 2,
            })).to.deep.equal(expectedAction)
        })
        it('should create an action to update content success', () => {
            const content = { DisplayName: 'My content', Id: 123 } as Task
            expect(Actions.updateContentSuccess(content).response.DisplayName).to.deep.equal('My content')
        })
        it('should create an action to content update request failure', () => {
            const expectedAction = {
                type: 'UPDATE_CONTENT_FAILURE',
                message: 'error',
            }
            expect(Actions.updateContentFailure({ message: 'error' })).to.deep.equal(expectedAction)
        })
    })
    describe('DeleteContent', () => {
        const content = { DisplayName: 'My content', Id: 123 } as Task
        it('should create an action to a delete content request', () => {
            const expectedAction = {
                type: 'DELETE_CONTENT_REQUEST',
                content,
                permanently: false,
            }
            expect(Actions.deleteRequest(content, false)).to.deep.equal(expectedAction)
        })
        it('should create an action to a delete content request', () => {
            const expectedAction = {
                type: 'DELETE_CONTENT_REQUEST',
                content,
                permanently: false,
            }
            expect(Actions.deleteRequest(content)).to.deep.equal(expectedAction)
        })
        it('should create an action to delete content success', () => {
            const expectedAction = {
                type: 'DELETE_CONTENT_SUCCESS',
                index: 0,
                id: 123,
            }
            expect(Actions.deleteSuccess(0, 123)).to.deep.equal(expectedAction)
        })
        it('should create an action to delete content failure', () => {
            const expectedAction = {
                type: 'DELETE_CONTENT_FAILURE',
                message: 'error',
            }
            expect(Actions.deleteFailure({ message: 'error' })).to.deep.equal(expectedAction)
        })
    })
    describe('DeleteBatchContent', () => {
        it('should create an action to a delete content request', () => {
            const expectedAction = {
                type: 'DELETE_BATCH_REQUEST',
                contentItems: {
                    1: {
                        DisplaName: 'aaa',
                        Id: 1,
                    },
                    2: {
                        DisplaName: 'bbb',
                        Id: 2,
                    },
                },
                permanently: false,
            }
            expect(Actions.deleteBatch({
                1: {
                    DisplaName: 'aaa',
                    Id: 1,
                },
                2: {
                    DisplaName: 'bbb',
                    Id: 2,
                },
            })).to.deep.equal(expectedAction)
        })
        it('should create an action to delete content success', () => {
            const response = {} as IODataBatchResponse<IContent>
            const expectedAction = {
                type: 'DELETE_BATCH_SUCCESS',
                response,
            }
            expect(Actions.deleteBatchSuccess(response)).to.deep.equal(expectedAction)
        })
        it('should create an action to delete content failure', () => {
            const expectedAction = {
                type: 'DELETE_BATCH_FAILURE',
                message: 'error',
            }
            expect(Actions.deleteBatchFailure({ message: 'error' })).to.deep.equal(expectedAction)
        })
    })
    describe('CopyBatchContent', () => {
        it('should create an action to a copy multiple content request', () => {
            const expectedAction = {
                type: 'COPY_BATCH_REQUEST',
                contentItems:
                {
                    1: { DisplaName: 'aaa', Id: 1 },
                    2: { DisplaName: 'bbb', Id: 2 },
                },
                path: '/workspaces',
            }
            expect(Actions.copyBatch({
                1: {
                    DisplaName: 'aaa',
                    Id: 1,
                },
                2: {
                    DisplaName: 'bbb',
                    Id: 2,
                },
            }, '/workspaces')).to.deep.equal(expectedAction)
        })
        it('should create an action to copy multiple content success', () => {
            const response = {} as IODataBatchResponse<IContent>
            const expectedAction = {
                type: 'COPY_BATCH_SUCCESS',
                response,
            }
            expect(Actions.copyBatchSuccess(response)).to.deep.equal(expectedAction)
        })
        it('should create an action to copy multiple content failure', () => {
            const expectedAction = {
                type: 'COPY_BATCH_FAILURE',
                message: 'error',
            }
            expect(Actions.copyBatchFailure({ message: 'error' })).to.deep.equal(expectedAction)
        })
    })
    describe('MoveBatchContent', () => {
        it('should create an action to a move multiple content request with empty list', () => {
            const expectedAction = {
                type: 'MOVE_BATCH_REQUEST',
                contentItems: {},
                path: '/workspaces',
            }
            expect(Actions.moveBatch(undefined, '/workspaces')).to.deep.equal(expectedAction)
        })
        it('should create an action to a move multiple content request', () => {
            const expectedAction = {
                type: 'MOVE_BATCH_REQUEST',
                contentItems: {
                    1: {
                        DisplaName: 'aaa',
                        Id: 1,
                    },
                    2: {
                        DisplaName: 'bbb',
                        Id: 2,
                    },
                },
                path: '/workspaces',
            }
            expect(Actions.moveBatch({
                1: {
                    DisplaName: 'aaa',
                    Id: 1,
                },
                2: {
                    DisplaName: 'bbb',
                    Id: 2,
                },
            }, '/workspaces')).to.deep.equal(expectedAction)
        })
        it('should create an action to move multiple content success', () => {
            const response = {} as IODataBatchResponse<IContent>
            const expectedAction = {
                type: 'MOVE_BATCH_SUCCESS',
                response,
            }
            expect(Actions.moveBatchSuccess(response)).to.deep.equal(expectedAction)
        })
        it('should create an action to move multiple content failure', () => {
            const expectedAction = {
                type: 'MOVE_BATCH_FAILURE',
                message: 'error',
            }
            expect(Actions.moveBatchFailure({ message: 'error' })).to.deep.equal(expectedAction)
        })
    })
    describe('CheckoutContent', () => {
        const content = { DisplayName: 'My content', Id: 123 } as Task
        it('should create an action to a checkout content request', () => {
            const expectedAction = {
                type: 'CHECKOUT_CONTENT_REQUEST',
                content,
            }
            expect(Actions.checkOut(content)).to.deep.equal(expectedAction)
        })
        it('should create an action to checkout content success', () => {
            expect(Actions.checkOutSuccess(content).response.DisplayName).to.deep.equal('My content')
        })
        it('should create an action to checkout content failure', () => {
            const expectedAction = {
                type: 'CHECKOUT_CONTENT_FAILURE',
                message: 'error',
            }
            expect(Actions.checkOutFailure({ message: 'error' })).to.deep.equal(expectedAction)
        })
    })
    describe('CheckinContent', () => {
        const content = { DisplayName: 'My content', Id: 123 } as Task
        it('should create an action to a checkin content request', () => {
            const expectedAction = {
                type: 'CHECKIN_CONTENT_REQUEST',
                content,
                checkInComment: 'comment',
            }
            expect(Actions.checkIn(content, 'comment')).to.deep.equal(expectedAction)
        })
        it('should create an action to a checkin content request', () => {
            const expectedAction = {
                type: 'CHECKIN_CONTENT_REQUEST',
                content,
                checkInComment: '',
            }
            expect(Actions.checkIn(content)).to.deep.equal(expectedAction)
        })
        it('should create an action to checkin content success', () => {
            expect(Actions.checkInSuccess(content).response.DisplayName).to.deep.equal('My content')
        })
        it('should create an action to checkin content failure', () => {
            const expectedAction = {
                type: 'CHECKIN_CONTENT_FAILURE',
                message: 'error',
            }
            expect(Actions.checkInFailure({ message: 'error' })).to.deep.equal(expectedAction)
        })
    })
    describe('PublishContent', () => {
        const content = { DisplayName: 'My content', Id: 123 } as Task
        it('should create an action to a publish content request', () => {
            const expectedAction = {
                type: 'PUBLISH_CONTENT_REQUEST',
                content,
            }
            expect(Actions.publish(content)).to.deep.equal(expectedAction)
        })
        it('should create an action to publish content success', () => {
            expect(Actions.publishSuccess(content).response.DisplayName).to.deep.equal('My content')
        })
        it('should create an action to publish content failure', () => {
            const expectedAction = {
                type: 'PUBLISH_CONTENT_FAILURE',
                message: 'error',
            }
            expect(Actions.publishFailure({ message: 'error' })).to.deep.equal(expectedAction)
        })
    })
    describe('ApproveContent', () => {
        const content = { DisplayName: 'My content', Id: 123 } as Task
        it('should create an action to an approve content request', () => {
            const expectedAction = {
                type: 'APPROVE_CONTENT_REQUEST',
                content,
            }
            expect(Actions.approve(content)).to.deep.equal(expectedAction)
        })
        it('should create an action to approve content success', () => {
            expect(Actions.approveSuccess(content).response.DisplayName).to.deep.equal('My content')
        })
        it('should create an action to approve content failure', () => {
            const expectedAction = {
                type: 'APPROVE_CONTENT_FAILURE',
                message: 'error',
            }
            expect(Actions.approveFailure({ message: 'error' })).to.deep.equal(expectedAction)
        })
    })
    describe('RejectContent', () => {
        const content = { DisplayName: 'My content', Id: 123 } as Task
        it('should create an action to an reject content request', () => {
            const expectedAction = {
                type: 'REJECT_CONTENT_REQUEST',
                content,
                rejectReason: 'reason',
            }
            expect(Actions.reject(content, 'reason')).to.deep.equal(expectedAction)
        })
        it('should create an action to an reject content request', () => {
            const expectedAction = {
                type: 'REJECT_CONTENT_REQUEST',
                content,
                rejectReason: '',
            }
            expect(Actions.reject(content)).to.deep.equal(expectedAction)
        })
        it('should create an action to reject content success', () => {
            expect(Actions.rejectSuccess(content).response.DisplayName).to.deep.equal('My content')
        })
        it('should create an action to reject content failure', () => {
            const expectedAction = {
                type: 'REJECT_CONTENT_FAILURE',
                message: 'error',
            }
            expect(Actions.rejectFailure({ message: 'error' })).to.deep.equal(expectedAction)
        })
    })
    describe('UndoCheckoutContent', () => {
        const content = { DisplayName: 'My content', Id: 123 } as Task
        it('should create an action to an undo-checkout content request', () => {
            const expectedAction = {
                type: 'UNDOCHECKOUT_CONTENT_REQUEST',
                content,
            }
            expect(Actions.undoCheckout(content)).to.deep.equal(expectedAction)
        })
        it('should create an action to undo-checkout content success', () => {
            expect(Actions.undoCheckoutSuccess(content).response.DisplayName).to.deep.equal('My content')
        })
        it('should create an action to undo-checkout content failure', () => {
            const expectedAction = {
                type: 'UNDOCHECKOUT_CONTENT_FAILURE',
                message: 'error',
            }
            expect(Actions.undoCheckoutFailure({ message: 'error' })).to.deep.equal(expectedAction)
        })
    })
    describe('ForceUndoCheckoutContent', () => {
        const content = { DisplayName: 'My content', Id: 123 } as Task
        it('should create an action to a force undo-checkout content request', () => {
            const expectedAction = {
                type: 'FORCEUNDOCHECKOUT_CONTENT_REQUEST',
                content,
            }
            expect(Actions.forceUndoCheckout(content)).to.deep.equal(expectedAction)
        })
        it('should create an action to force undo-checkout content success', () => {
            expect(Actions.forceUndoCheckoutSuccess(content).response.DisplayName).to.deep.equal('My content')
        })
        it('should create an action to force undo-checkout content failure', () => {
            const expectedAction = {
                type: 'FORCEUNDOCHECKOUT_CONTENT_FAILURE',
                message: 'error',
            }
            expect(Actions.forceUndoCheckoutFailure({ message: 'error' })).to.deep.equal(expectedAction)
        })
    })
    describe('RestoreVersion', () => {
        const content = { DisplayName: 'My content', Id: 123 } as Task
        it('should create an action to a version restore request', () => {
            const expectedAction = {
                type: 'RESTOREVERSION_CONTENT_REQUEST',
                content,
                version: 'A.1.0',
            }
            expect(Actions.restoreVersion(content, 'A.1.0')).to.deep.equal(expectedAction)
        })
        it('should create an action to a version restore success', () => {
            expect(Actions.restoreVersionSuccess(content).response.DisplayName).to.deep.equal('My content')
        })
        it('should create an action to a version restore failure', () => {
            const expectedAction = {
                type: 'RESTOREVERSION_CONTENT_FAILURE',
                message: 'error',
            }
            expect(Actions.restoreVersionFailure({ message: 'error' })).to.deep.equal(expectedAction)
        })
    })
    describe('UserLogin', () => {
        it('should create an action to a user login request', () => {
            const expectedAction = {
                type: 'USER_LOGIN_REQUEST',
                userName: 'alba',
                password: 'alba',
            }
            expect(Actions.userLogin('alba', 'alba')).to.deep.equal(expectedAction)
        })
        it('should create an action to a user login success', () => {
            const user = { Name: 'alba' } as User
            const expectedAction = {
                type: 'USER_LOGIN_SUCCESS',
                response: user,
            }
            expect(Actions.userLoginSuccess(user)).to.deep.equal(expectedAction)
        })
        it('should create an action to a user login failure', () => {
            const expectedAction = {
                type: 'USER_LOGIN_FAILURE',
                message: 'error',
            }
            expect(Actions.userLoginFailure({ message: 'error' })).to.deep.equal(expectedAction)
        })
        it('should create an action to a user login failure with the proper message when 403', () => {
            const expectedAction = {
                type: 'USER_LOGIN_FAILURE',
                message: 'The username or the password is not valid!',
            }
            expect(Actions.userLoginFailure({ message: 'The username or the password is not valid!', status: 403 })).to.deep.equal(expectedAction)
        })
    })
    describe('UserLoginBuffer', () => {
        it('should create an action to a user login buffering', () => {
            const expectedAction = {
                type: 'USER_LOGIN_BUFFER',
                response: true,
            }
            expect(Actions.userLoginBuffer(true)).to.deep.equal(expectedAction)
        })
    })
    describe('UserLoginGoogle', () => {
        it('should create an action to a user login with google', () => {
            const expectedAction = {
                type: 'USER_LOGIN_GOOGLE',
            }
            expect(Actions.userLoginGoogle()).to.deep.equal(expectedAction)
        })
    })
    describe('UserLogout', () => {
        it('should create an action to a user logout request', () => {
            const expectedAction = {
                type: 'USER_LOGOUT_REQUEST',
            }
            expect(Actions.userLogout()).to.deep.equal(expectedAction)
        })
        it('should create an action to a user logout success', () => {
            const expectedAction = {
                type: 'USER_LOGOUT_SUCCESS',
            }
            expect(Actions.userLogoutSuccess({})).to.deep.equal(expectedAction)
        })
        it('should create an action to a user logout failure', () => {
            const expectedAction = {
                type: 'USER_LOGOUT_FAILURE',
                message: 'error',
            }
            expect(Actions.userLogoutFailure({ message: 'error' })).to.deep.equal(expectedAction)
        })
    })
    describe('CheckLoginState', () => {
        it('should return the current authentication state', () => {
            const expectedAction = {
                type: 'CHECK_LOGIN_STATE_REQUEST',
            }
            expect(Actions.checkLoginState()).to.deep.equal(expectedAction)
        })
    })
    describe('UserChanged', () => {
        it('should return the user changed action', () => {
            const user = { Name: 'alba' } as User
            const expectedAction = {
                type: 'USER_CHANGED',
                user,
            }
            expect(Actions.userChanged(user)).to.deep.equal(expectedAction)
        })
    })
    describe('LoadRepository', () => {
        it('should return the repository load action', () => {
            const expectedAction = {
                type: 'LOAD_REPOSITORY',
                repository: {},
            }
            expect(Actions.loadRepository({})).to.deep.equal(expectedAction)
        })
    })
    describe('SelectContent', () => {
        const content = { DisplayName: 'My content', Id: 1 } as Task
        it('should return the select content action', () => {
            const expectedAction = {
                type: 'SELECT_CONTENT',
                content,
            }
            expect(Actions.selectContent(content)).to.deep.equal(expectedAction)
        })
    })
    describe('DeSelectContent', () => {
        const content = { DisplayName: 'My content', Id: 1 } as Task
        it('should return the deselect content action', () => {
            const expectedAction = {
                type: 'DESELECT_CONTENT',
                content,
            }
            expect(Actions.deSelectContent(content)).to.deep.equal(expectedAction)
        })
    })
    describe('ClearSelection', () => {
        it('should return the clear selection action', () => {
            const expectedAction = {
                type: 'CLEAR_SELECTION',
            }
            expect(Actions.clearSelection()).to.deep.equal(expectedAction)
        })
    })
    describe('RequestContentActions', () => {
        const content = { DisplayName: 'My content', Id: 123 } as Task

        it('should return the RequestContentActions action', () => {
            const expectedAction = {
                type: 'REQUEST_CONTENT_ACTIONS',
                content,
                scenario: 'DMSListItem',
                customItems: [],
            }
            expect(Actions.requestContentActions(content, 'DMSListItem')).to.deep.equal(expectedAction)
        })
        it('should return the RequestContentActions action', () => {
            const expectedAction = {
                type: 'REQUEST_CONTENT_ACTIONS',
                content,
                scenario: 'DMSListItem',
                customItems: [{ DisplayName: 'aaa', Name: 'bbb', Icon: 'ccc' }],
            }
            expect(Actions.requestContentActions(content, 'DMSListItem', [{ DisplayName: 'aaa', Name: 'bbb', Icon: 'ccc' }])).to.deep.equal(expectedAction)
        })
        it('should return the RequestContentActionsSuccess action', () => {
            const expectedAction = {
                type: 'REQUEST_CONTENT_ACTIONS_SUCCESS',
                response: [
                    {
                        ActionName: 'Rename',
                    },
                ],
                id: 1,
            }
            expect(Actions.requestContentActionsSuccess([{ ActionName: 'Rename' }], 1)).to.deep.equal(expectedAction)
        })
        it('should return the RequestContentActionsFailure action', () => {
            const expectedAction = {
                type: 'REQUEST_CONTENT_ACTIONS_FAILURE',
                message: 'error',
            }
            expect(Actions.requestContentActionsFailure({ message: 'error' })).to.deep.equal(expectedAction)
        })
    })
    describe('UploadContentActions', () => {
        const content = { DisplayName: 'My content', Id: 123 } as Task
        const file = {
            lastModified: 1499931166346,
            name: 'README.md',
            size: 75,
            type: '',
        }
        it('should return the upload content action set only content and file', () => {
            const expectedAction = {
                type: 'UPLOAD_CONTENT_REQUEST',
                content,
                file,
                overwrite: true,
                propertyName: 'Binary',
                contentType: SNFile,
                body: null,
                scenario: 'ListItems',
            }
            expect(Actions.uploadRequest(content, file)).to.deep.equal(expectedAction)
        })
        it('should return the upload content action set content, file and contentType to Folder', () => {
            const expectedAction = {
                type: 'UPLOAD_CONTENT_REQUEST',
                content,
                contentType: Folder,
                file,
                overwrite: true,
                propertyName: 'Binary',
                body: null,
                scenario: 'ListItems',
            }
            expect(Actions.uploadRequest(content, file, Folder)).to.deep.equal(expectedAction)
        })
        it('should return the upload content action set content, file and overwrite to false', () => {
            const expectedAction = {
                type: 'UPLOAD_CONTENT_REQUEST',
                content,
                contentType: SNFile,
                file,
                overwrite: false,
                propertyName: 'Binary',
                body: null,
                scenario: 'ListItems',
            }
            expect(Actions.uploadRequest(content, file, undefined, false)).to.deep.equal(expectedAction)
        })
        it('should return the upload content action set content, file and propertyName to Avatar', () => {
            const expectedAction = {
                type: 'UPLOAD_CONTENT_REQUEST',
                content,
                contentType: SNFile,
                file,
                overwrite: true,
                propertyName: 'Avatar',
                body: null,
                scenario: 'ListItems',
            }
            expect(Actions.uploadRequest(content, file, undefined, undefined, undefined, 'Avatar')).to.deep.equal(expectedAction)
        })
        it('should return the upload content action set content, file and body', () => {
            const expectedAction = {
                type: 'UPLOAD_CONTENT_REQUEST',
                content,
                contentType: SNFile,
                file,
                overwrite: true,
                propertyName: 'Binary',
                body: { vmi: 'aaa' },
                scenario: 'ListItems',
            }
            expect(Actions.uploadRequest(content, file, undefined, undefined, { vmi: 'aaa' })).to.deep.equal(expectedAction)
        })
        it('should return the upload content action set content, file and scenario', () => {
            const expectedAction = {
                type: 'UPLOAD_CONTENT_REQUEST',
                content,
                contentType: SNFile,
                file,
                overwrite: true,
                propertyName: 'Binary',
                body: null,
                scenario: 'DMSListItems',
            }
            expect(Actions.uploadRequest(content, file, undefined, undefined,  undefined, null, 'DMSListItems')).to.deep.equal(expectedAction)
        })
        it('should create an action to upload content success', () => {
            const expectedAction = {
                type: 'UPLOAD_CONTENT_SUCCESS',
                response: [],
            }
            expect(Actions.uploadSuccess([])).to.deep.equal(expectedAction)
        })
        it('should create an action to content upload request failure', () => {
            const expectedAction = {
                type: 'UPLOAD_CONTENT_FAILURE',
                message: 'error',
            }
            expect(Actions.uploadFailure({ message: 'error' })).to.deep.equal(expectedAction)
        })
    })
})
