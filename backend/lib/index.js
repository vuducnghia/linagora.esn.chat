'use strict';

const constants = require('./constants');

module.exports = function(dependencies) {

  const models = {
    conversation: require('./db/conversation')(dependencies),
    message: require('./db/message')(dependencies)
  };

  const utils = require('./utils')(dependencies);
  const message = require('./message')(dependencies);
  const conversation = require('./conversation')(dependencies);
  const community = require('./community')(dependencies);
  const userState = require('./userState')(dependencies);
  const moderate = require('./moderate')(dependencies);
  const listener = require('./listener')(dependencies);

  function start(callback) {
    listener.start({conversation, message});
    userState.init();
    moderate.start();
    callback();
  }

  return {
    community,
    constants,
    conversation,
    listener,
    message,
    moderate,
    models,
    start,
    userState
  };
};
