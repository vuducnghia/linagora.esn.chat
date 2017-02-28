'use strict';

/* global chai, sinon: false */

var expect = chai.expect;

describe('The chatConversationActionsService service', function() {

  var $q, conversation, user, result, sessionMock, chatConversationActionsService, chatConversationService, chatConversationsStoreService, $rootScope;
  var CHAT_CONVERSATION_TYPE, CHAT_CONVERSATION_MODE, CHAT_EVENTS;
  var error, successSpy, errorSpy;

  beforeEach(function() {
    error = new Error('I failed');
    successSpy = sinon.spy();
    errorSpy = sinon.spy();
    conversation = {_id: 1, name: 'My conversation'};
    user = {_id: 'userId'};
    result = {data: {foo: 'bar'}};
    sessionMock = {
      ready: null
    };
    chatConversationService = {};
    chatConversationsStoreService = {};

    module('linagora.esn.chat', function($provide) {
      $provide.value('searchProviders', {
        add: angular.noop
      });
      $provide.value('chatSearchMessagesProviderService', {});
      $provide.value('chatSearchConversationsProviderService', {});
      $provide.value('chatConversationService', chatConversationService);
      $provide.value('chatConversationsStoreService', chatConversationsStoreService);
      $provide.factory('session', function($q) {
        sessionMock.ready = $q.when({user: user});

        return sessionMock;
      });
    });
  });

  beforeEach(angular.mock.inject(function(_$q_, _chatConversationActionsService_, _$rootScope_, _CHAT_CONVERSATION_TYPE_, _CHAT_CONVERSATION_MODE_, _CHAT_EVENTS_) {
    $q = _$q_;
    chatConversationActionsService = _chatConversationActionsService_;
    $rootScope = _$rootScope_;
    sessionMock.ready = $q.when({user: user});
    sessionMock.user = user;
    CHAT_CONVERSATION_TYPE = _CHAT_CONVERSATION_TYPE_;
    CHAT_CONVERSATION_MODE = _CHAT_CONVERSATION_MODE_;
    CHAT_EVENTS = _CHAT_EVENTS_;
  }));

  describe('The addChannel function', function() {
    it('should call chatConversationService.create and save new channel in store', function() {
      chatConversationService.create = sinon.spy(function() {
        return $q.when(result);
      });

      chatConversationsStoreService.addConversation = sinon.spy();

      chatConversationActionsService.addChannel(conversation);
      $rootScope.$digest();

      expect(chatConversationService.create).to.have.been.calledWith({_id: conversation._id, name: conversation.name, type: CHAT_CONVERSATION_TYPE.OPEN, mode: CHAT_CONVERSATION_MODE.CHANNEL});
      expect(chatConversationsStoreService.addConversation).to.have.been.calledWith(result.data);
    });

    it('should reject when chatConversationService.create rejects', function() {
      chatConversationService.create = sinon.spy(function() {
        return $q.reject(error);
      });

      chatConversationsStoreService.addConversation = sinon.spy();

      chatConversationActionsService.addChannel(conversation).then(successSpy, errorSpy);
      $rootScope.$digest();

      expect(chatConversationService.create).to.have.been.calledWith({_id: conversation._id, name: conversation.name, type: CHAT_CONVERSATION_TYPE.OPEN, mode: CHAT_CONVERSATION_MODE.CHANNEL});
      expect(chatConversationsStoreService.addConversation).to.not.have.been.called;
      expect(successSpy).to.not.have.been.called;
      expect(errorSpy).to.have.been.called;
    });
  });

  describe('The addPrivateConversation function', function() {
    it('should call chatConversationService.create and save new channel in store', function() {
      chatConversationService.create = sinon.spy(function() {
        return $q.when(result);
      });

      chatConversationsStoreService.addConversation = sinon.spy();

      chatConversationActionsService.addPrivateConversation(conversation);
      $rootScope.$digest();

      expect(chatConversationService.create).to.have.been.calledWith({_id: conversation._id, name: conversation.name, type: CHAT_CONVERSATION_TYPE.CONFIDENTIAL, mode: CHAT_CONVERSATION_MODE.CHANNEL});
      expect(chatConversationsStoreService.addConversation).to.have.been.calledWith(result.data);
    });

    it('should reject when chatConversationService.create rejects', function() {
      chatConversationService.create = sinon.spy(function() {
        return $q.reject(error);
      });

      chatConversationsStoreService.addConversation = sinon.spy();

      chatConversationActionsService.addPrivateConversation(conversation).then(successSpy, errorSpy);
      $rootScope.$digest();

      expect(chatConversationService.create).to.have.been.calledWith({_id: conversation._id, name: conversation.name, type: CHAT_CONVERSATION_TYPE.CONFIDENTIAL, mode: CHAT_CONVERSATION_MODE.CHANNEL});
      expect(chatConversationsStoreService.addConversation).to.not.have.been.called;
      expect(successSpy).to.not.have.been.called;
      expect(errorSpy).to.have.been.called;
    });
  });

  describe('The deleteConversation function', function() {
    it('should call chatConversationService.deleteConversation and save new channel in store', function() {
      chatConversationService.deleteConversation = sinon.spy(function() {
        return $q.when(result);
      });

      chatConversationsStoreService.deleteConversation = sinon.spy();

      chatConversationActionsService.deleteConversation(conversation);
      $rootScope.$digest();

      expect(chatConversationService.deleteConversation).to.have.been.calledWith(conversation._id);
      expect(chatConversationsStoreService.deleteConversation).to.have.been.calledWith(conversation);
    });

    it('should reject when chatConversationService.deleteConversation rejects', function() {
      chatConversationService.deleteConversation = sinon.spy(function() {
        return $q.reject(error);
      });

      chatConversationsStoreService.deleteConversation = sinon.spy();

      chatConversationActionsService.deleteConversation(conversation).then(successSpy, errorSpy);
      $rootScope.$digest();

      expect(chatConversationService.deleteConversation).to.have.been.calledWith(conversation._id);
      expect(chatConversationsStoreService.deleteConversation).to.not.have.been.called;
      expect(successSpy).to.not.have.been.called;
      expect(errorSpy).to.have.been.called;
    });
  });

  describe('The increaseNumberOfUnreadMessages function', function() {
    it('should call the equivalent function in chatConversationsStoreService', function() {
      chatConversationsStoreService.increaseNumberOfUnreadMessages = sinon.spy();
      chatConversationActionsService.increaseNumberOfUnreadMessages(conversation._id);

      expect(chatConversationsStoreService.increaseNumberOfUnreadMessages).to.have.been.calledWith(conversation._id);
    });
  });

  describe('The joinConversation function', function() {
    it('should call chatConversationService.join and chatConversationsStoreService.joinConversation', function() {
      chatConversationService.join = sinon.spy(function() {
        return $q.when(result);
      });

      chatConversationsStoreService.joinConversation = sinon.spy();

      chatConversationActionsService.joinConversation(conversation);
      $rootScope.$digest();

      expect(chatConversationService.join).to.have.been.calledWith(conversation._id, sessionMock.user._id);
      expect(chatConversationsStoreService.joinConversation).to.have.been.calledWith(conversation);
    });

    it('should reject when chatConversationService.join rejects', function() {
      chatConversationService.join = sinon.spy(function() {
        return $q.reject(error);
      });

      chatConversationsStoreService.joinConversation = sinon.spy();

      chatConversationActionsService.joinConversation(conversation).then(successSpy, errorSpy);
      $rootScope.$digest();

      expect(chatConversationService.join).to.have.been.calledWith(conversation._id, sessionMock.user._id);
      expect(chatConversationsStoreService.joinConversation).to.not.have.been.called;
      expect(successSpy).to.not.have.been.called;
      expect(errorSpy).to.have.been.called;
    });
  });

  describe('The leaveConversation function', function() {
    it('should call chatConversationService.leave and chatConversationsStoreService.deleteConversation', function() {
      chatConversationService.leave = sinon.spy(function() {
        return $q.when(result);
      });

      chatConversationsStoreService.deleteConversation = sinon.spy();

      chatConversationActionsService.leaveConversation(conversation);
      $rootScope.$digest();

      expect(chatConversationService.leave).to.have.been.calledWith(conversation._id, sessionMock.user._id);
      expect(chatConversationsStoreService.deleteConversation).to.have.been.calledWith(conversation);
    });

    it('should reject when chatConversationService.leave rejects', function() {
      chatConversationService.leave = sinon.spy(function() {
        return $q.reject(error);
      });

      chatConversationsStoreService.deleteConversation = sinon.spy();

      chatConversationActionsService.leaveConversation(conversation).then(successSpy, errorSpy);
      $rootScope.$digest();

      expect(chatConversationService.leave).to.have.been.calledWith(conversation._id, sessionMock.user._id);
      expect(chatConversationsStoreService.deleteConversation).to.not.have.been.called;
      expect(successSpy).to.not.have.been.called;
      expect(errorSpy).to.have.been.called;
    });
  });

  describe('The markAllMessagesAsRead function', function() {
    it('should call chatConversationService.markAsRead and chatConversationsStoreService.markAllMessagesAsRead', function() {
      chatConversationService.markAsRead = sinon.spy(function() {
        return $q.when(result);
      });

      chatConversationsStoreService.markAllMessagesAsRead = sinon.spy();

      chatConversationActionsService.markAllMessagesAsRead(conversation);
      $rootScope.$digest();

      expect(chatConversationService.markAsRead).to.have.been.calledWith(conversation._id);
      expect(chatConversationsStoreService.markAllMessagesAsRead).to.have.been.calledWith(conversation);
    });

    it('should reject when chatConversationService.markAsRead rejects', function() {
      chatConversationService.markAsRead = sinon.spy(function() {
        return $q.reject(error);
      });

      chatConversationsStoreService.markAllMessagesAsRead = sinon.spy();

      chatConversationActionsService.markAllMessagesAsRead(conversation).then(successSpy, errorSpy);
      $rootScope.$digest();

      expect(chatConversationService.markAsRead).to.have.been.calledWith(conversation._id);
      expect(chatConversationsStoreService.markAllMessagesAsRead).to.not.have.been.called;
      expect(successSpy).to.not.have.been.called;
      expect(errorSpy).to.have.been.called;
    });
  });

  describe('The setActive function', function() {
    it('should call chatConversationsStoreService.setActive', function() {
      chatConversationsStoreService.setActive = sinon.spy();

      chatConversationActionsService.setActive(conversation);
      $rootScope.$digest();

      expect(chatConversationsStoreService.setActive).to.have.been.calledWith(conversation);
    });
  });

  describe('The start function', function() {
    it('should fetch all the conversations and add them to the store', function() {
      chatConversationService.listForCurrentUser = sinon.spy(function() {
        return $q.when(result);
      });

      chatConversationsStoreService.addConversations = sinon.spy();

      chatConversationActionsService.start(conversation);
      $rootScope.$digest();

      expect(chatConversationService.listForCurrentUser).to.have.been.called;
      expect(chatConversationsStoreService.addConversations).to.have.been.calledWith(result.data);
    });

    it('should reject when fetchAllConversations rejects', function() {
      chatConversationService.listForCurrentUser = sinon.spy(function() {
        return $q.reject(error);
      });

      chatConversationsStoreService.addConversations = sinon.spy();

      chatConversationActionsService.start(conversation);
      $rootScope.$digest();

      expect(chatConversationService.listForCurrentUser).to.have.been.called;
      expect(chatConversationsStoreService.addConversations).to.not.have.been.called;
    });
  });

  describe('The unsetActive function', function() {
    it('should reset the activeRoom and broadcast event in the scope', function() {
      chatConversationsStoreService.unsetActive = sinon.spy(function() {
        chatConversationsStoreService.activeRoom = {};
      });
      chatConversationsStoreService.activeRoom = {_id: 1};
      $rootScope.$broadcast = sinon.spy();

      chatConversationActionsService.unsetActive();
      $rootScope.$digest();

      expect(chatConversationsStoreService.unsetActive).to.have.been.called;
      expect(chatConversationsStoreService.activeRoom).to.deep.equal({});
      expect($rootScope.$broadcast).to.have.been.calledWith(CHAT_EVENTS.UNSET_ACTIVE_ROOM);
    });
  });

  describe('The updateConversation function', function() {
    it('should call chatConversationService.update with right parameters and update the store', function() {
      var modifications = {foo: 'bar'};

      chatConversationService.update = sinon.spy(function() {
        return $q.when(result);
      });

      chatConversationActionsService.updateConversation(conversation._id, modifications);
      $rootScope.$digest();

      expect(chatConversationService.update).to.have.been.calledWith(conversation._id, {conversation: conversation._id, modifications: modifications});
    });

    it('should reject when chatConversationService.update rejects', function() {
      var modifications = {foo: 'bar'};

      chatConversationService.update = sinon.spy(function() {
        return $q.reject(error);
      });

      chatConversationActionsService.updateConversation(conversation._id, modifications).then(successSpy, errorSpy);
      $rootScope.$digest();

      expect(chatConversationService.update).to.have.been.calledWith(conversation._id, {conversation: conversation._id, modifications: modifications});
      expect(successSpy).to.not.have.been.called;
      expect(errorSpy).to.have.been.called;
    });
  });

  describe('The updateConversationTopic function', function() {
    it('should call the chatConversationService.updateTopic function and update the store', function() {
      var topic = 'New topic';

      result.topic = {value: topic};
      chatConversationService.updateTopic = sinon.spy(function() {
        return $q.when(result);
      });
      chatConversationsStoreService.updateTopic = sinon.spy();

      chatConversationActionsService.updateConversationTopic(conversation, topic);
      $rootScope.$digest();

      expect(chatConversationService.updateTopic).to.have.been.calledWith(conversation._id, topic);
      expect(chatConversationsStoreService.updateTopic).to.have.been.calledWith(result.data, result.data.topic);
    });

    it('should reject when chatConversationService.updateTopic rejects', function() {
      var topic = 'New topic';

      chatConversationService.updateTopic = sinon.spy(function() {
        return $q.reject(error);
      });
      chatConversationsStoreService.updateTopic = sinon.spy();

      chatConversationActionsService.updateConversationTopic(conversation, topic).then(successSpy, errorSpy);
      $rootScope.$digest();

      expect(chatConversationService.updateTopic).to.have.been.calledWith(conversation._id, topic);
      expect(chatConversationsStoreService.updateTopic).to.not.have.been.called;
      expect(successSpy).to.not.have.been.called;
      expect(errorSpy).to.have.been.called;
    });
  });

  describe('The updateUserMentionsCount function', function() {
    it('should do nothing when messageUserMentions is null', function() {
      chatConversationsStoreService.increaseUserMentionsCount = sinon.spy();
      chatConversationActionsService.updateUserMentionsCount(conversation._id);

      expect(chatConversationsStoreService.increaseUserMentionsCount).to.not.have.been.called;
    });

    it('should do nothing without current user\'s ID in messageUserMentions', function() {
      var anotherUser = {_id: 'anotherUser'};

      chatConversationsStoreService.increaseUserMentionsCount = sinon.spy();
      chatConversationActionsService.updateUserMentionsCount(conversation._id, [anotherUser]);

      expect(chatConversationsStoreService.increaseUserMentionsCount).to.not.have.been.called;
    });

    it('should call increaseUserMentionsCount when messageUserMentions contains current user\'s ID', function() {
      chatConversationsStoreService.increaseUserMentionsCount = sinon.spy();
      chatConversationActionsService.updateUserMentionsCount(conversation._id, [user]);

      expect(chatConversationsStoreService.increaseUserMentionsCount).to.have.been.called;
    });
  });

  describe('The updateMembers function', function() {
    beforeEach(function() {
      chatConversationsStoreService.setMembers = sinon.spy();
      chatConversationsStoreService.updateMembersCount = sinon.spy();
    });

    it('should not set members in store if conversation is not CONFIDENTIAL', function() {
      chatConversationActionsService.updateMembers({type: CHAT_CONVERSATION_TYPE.OPEN, members: [1]});

      expect(chatConversationsStoreService.setMembers).to.not.have.been.called;
    });

    it('should not set members in store if members is not defined', function() {
      chatConversationActionsService.updateMembers({type: CHAT_CONVERSATION_TYPE.CONFIDENTIAL});

      expect(chatConversationsStoreService.setMembers).to.not.have.been.called;
    });

    it('should set members in store if conversation type is CONFIDENTIAL and members is defined', function() {
      var members = [1, 2, 3];
      var conversation = {type: CHAT_CONVERSATION_TYPE.CONFIDENTIAL, members: members};

      chatConversationActionsService.updateMembers(conversation);

      expect(chatConversationsStoreService.setMembers).to.have.been.calledWith(conversation, members);
    });

    it('should not update the members count if not defined', function() {
      chatConversationActionsService.updateMembers({});

      expect(chatConversationsStoreService.updateMembersCount).to.not.have.been.called;
    });

    it('should not update the members count if 0', function() {
      chatConversationActionsService.updateMembers({}, 0);

      expect(chatConversationsStoreService.updateMembersCount).to.not.have.been.called;
    });

    it('should update the members count', function() {
      var count = 10;
      var conversation = {_id: 1};

      chatConversationActionsService.updateMembers(conversation, count);

      expect(chatConversationsStoreService.updateMembersCount).to.have.been.calledWith(conversation, count);
    });
  });
});