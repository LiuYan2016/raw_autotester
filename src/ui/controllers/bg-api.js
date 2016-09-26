/**
 * Communication with bg page
 */

const messaging = require('../../utils/messaging');
const externalEvents = require('../../background/external-events');
const {onTestsDone, onSessionStarted} = require('../controllers/internal-channels');

const {
  RELOAD,
  TESTS_LIST_LOAD,
  TESTS_RUN,
  TESTS_DONE,
  SESSION_STARTED,
} = externalEvents;

exports.init = function() {
  messaging.registerEvents(externalEvents);
  messaging.on(RELOAD, () => location.reload());
  messaging.on(TESTS_DONE, () => onTestsDone.dispatch());
  // todo: make this channeling in more automatic way (e.g. event flag isExternal: true)
  messaging.on(SESSION_STARTED, data => onSessionStarted.dispatch(data));
  messaging.start();
};

exports.loadTestsList = function(url) {
  return messaging.send(TESTS_LIST_LOAD, {url});
};

exports.runTests = function(data) {
  return messaging.send(TESTS_RUN, data);
};
