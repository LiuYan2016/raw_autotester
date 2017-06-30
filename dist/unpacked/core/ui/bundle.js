webpackJsonp([4],{

/***/ 24:
/***/ (function(module, exports) {

	/**
	 * Control messages flow between bg and tabs
	 * - bg messages are received by all tabs
	 * - tab messages are received only by background
	 * Internal msg format:
	 * {
	 *   name: {String}
	 *   payload: {*}
	 * }
	 *
	 * message - is transport layer, via chrome runtime
	 * event - something that occurs and should be transferred
	 */

	const registeredListeners = new Map();
	const registeredEvents = new Set();
	// todo: will not work for event-pages
	const isBackgroundPage = chrome.extension.getBackgroundPage() === window;

	/**
	 * Start listen messages
	 *
	 * @param {Object} [events] available events
	 */
	exports.start = function (events) {
	  if (events) {
	    exports.registerEvents(events);
	  }
	  chrome.runtime.onMessage.addListener(onMessage);
	};

	/**
	 * Register events
	 */
	exports.registerEvents = function (events) {
	  if (Array.isArray(events)) {
	    events.forEach(key => registeredEvents.add(events[key]));
	  } else if (events && typeof events === 'object') {
	    Object.keys(events).forEach(key => registeredEvents.add(events[key]));
	  } else {
	    throw new Error('Events should be array or object to register');
	  }
	};

	/**
	 * Send message from tab to bg OR visa-versa
	 * @param {String} name
	 * @param {*} payload
	 */
	exports.send = function (name, payload) {
	  assertEventName(name);
	  const msg = wrapKnownMessage({name, payload});
	  return new Promise(resolve => {
	    chrome.runtime.sendMessage(msg, resolve);
	  });
	};

	/**
	 * Add listener to message
	 * @param {String} name
	 * @param {Function} fn
	 */
	exports.on = function (name, fn) {
	  assertEventName(name);
	  const msgListeners = registeredListeners.get(name) || [];
	  msgListeners.push(fn);
	  registeredListeners.set(name, msgListeners);
	};

	function onMessage(msg, sender, sendResponse) {
	  if (!isKnownMessage(msg)) {
	    return;
	  }

	  const fromTabToTab = sender.tab && !isBackgroundPage;
	  const fromBgToBg = !sender.tab && isBackgroundPage;
	  if (fromTabToTab || fromBgToBg) {
	    return;
	  }

	  assertEventName(msg.name);

	  const msgListeners = registeredListeners.get(msg.name);
	  if (msgListeners && msgListeners.length) {
	    let asyncResponse = false;
	    let result;
	    msgListeners.forEach(listener => {
	      try {
	        result = listener(msg.payload, sender, sendResponse);
	      } catch (e) {
	        // we need to re-throw error in next tick to be out of onMessage handler and allow event to bubble
	        // todo: try capture error stack
	        throwAsync(e);
	      }
	      if (result === true) {
	        asyncResponse = true;
	      }
	      if (isPromise(result)) {
	        asyncResponse = true;
	        result.then(
	          data => sendResponse(data),
	          e => sendResponse(e && e.stack || String(e))
	        );
	      }
	    });
	    // if at least some result is true or promise, we should return true
	    // to show that sendResponse will be called asynchroniously
	    return asyncResponse;
	  }
	}

	function assertEventName(name) {
	  if (!registeredEvents.has(name)) {
	    throw new Error(`Unknown event ${name}`);
	  }
	}

	function isKnownMessage(msg) {
	  return msg && msg.isMessaging;
	}

	function wrapKnownMessage(msg) {
	  return Object.assign(msg, {
	    isMessaging: true
	  });
	}

	function isPromise(obj) {
	  return obj && typeof obj.then === 'function';
	}

	function throwAsync(e) {
	  setTimeout(() => {
	    throw e;
	  }, 0);
	}


/***/ }),

/***/ 25:
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * External events.
	 * This file should be included in both bg and tab contexts.
	 */

	const keyMirror = __webpack_require__(26);

	/**
	 * List of all messages
	 */
	module.exports = keyMirror({
	  // from tab
	  TESTS_RUN: null,
	  // from bg
	  RELOAD: null,
	  TESTS_DONE: null,
	  SESSION_STARTED: null,
	  FILE_STARTED: null,
	  TEST_STARTED: null,
	});


/***/ }),

/***/ 88:
/***/ (function(module, exports) {

	/**
	 * Simple console logger
	 */

	/* eslint no-console: 0 */

	class Logger {
	  constructor(prefix) {
	    this._prefix = `[${prefix}]:`;
	  }

	  log() {
	    this._callConsole('log', [].slice.call(arguments));
	  }

	  info() {
	    this._callConsole('info', [].slice.call(arguments));
	  }

	  warn() {
	    this._callConsole('warn', [].slice.call(arguments));
	  }

	  error() {
	    this._callConsole('error', [].slice.call(arguments));
	  }

	  _callConsole(method, args) {
	    console[method].apply(console, [this._prefix].concat(args));
	  }
	}

	/**
	 * Helper to create logger right after require()
	 * E.g. const logger = require('./logger').create('Module')
	 *
	 * @param {String} prefix
	 * @returns {Logger}
	 */
	Logger.create = function (prefix) {
	  return new Logger(prefix);
	};

	module.exports = Logger;


/***/ }),

/***/ 644:
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Main ui entry
	 */

	const mobx = __webpack_require__(534);
	const fs = __webpack_require__(14);
	const state = __webpack_require__(604);
	const { APP_STATE } = __webpack_require__(610);
	const bgApi = __webpack_require__(645);
	const windowApi = __webpack_require__(646);
	const testsRun = __webpack_require__(647);
	const configLoader = __webpack_require__(653);
	const htmlConsole = __webpack_require__(648);
	const setup = __webpack_require__(651);
	const editor = __webpack_require__(629);

	/**
	 * Start app
	 */
	exports.start = function () {
	  htmlConsole.init();
	  testsRun.init();
	  configLoader.init();
	  editor.init();
	  bgApi.init();
	  windowApi.init();
	  return Promise.resolve().then(() => fs.init({ type: window.PERSISTENT, requestQuota: false })).then(() => setup.applyOnFirstRun()).then(() => state.load()).then(mobx.action(ready));
	};

	function ready() {
	  state.appState = APP_STATE.READY;
	}

/***/ }),

/***/ 645:
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Communication with bg page
	 */

	const messaging = __webpack_require__(24);
	const externalEvents = __webpack_require__(25);
	const {
	  onTestsDone,
	  onSessionStarted,
	  onFileStarted,
	  onTestStarted
	} = __webpack_require__(612);

	const {
	  RELOAD,
	  TESTS_RUN,
	  TESTS_DONE,
	  SESSION_STARTED,
	  FILE_STARTED,
	  TEST_STARTED
	} = externalEvents;

	exports.init = function () {
	  messaging.registerEvents(externalEvents);
	  messaging.on(RELOAD, () => location.reload());
	  messaging.on(TESTS_DONE, () => onTestsDone.dispatch());
	  // todo: make this channeling in more automatic way (e.g. event flag isExternal: true)
	  messaging.on(SESSION_STARTED, data => onSessionStarted.dispatch(data));
	  messaging.on(FILE_STARTED, data => onFileStarted.dispatch(data));
	  messaging.on(TEST_STARTED, data => onTestStarted.dispatch(data));
	  messaging.start();
	};

	exports.runTests = function (data) {
	  return messaging.send(TESTS_RUN, data);
	};

/***/ }),

/***/ 646:
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * API of window for programmatic run and other stuff
	 */

	const testsRun = __webpack_require__(647);
	const htmlConsole = __webpack_require__(648);
	const setup = __webpack_require__(651);

	/**
	 * Exports API to window
	 */
	exports.init = function () {
	  Object.assign(window, {
	    /**
	     * Run custom tests on loopback chrome
	     *
	     * @param {Array<{path, code}>} tests
	     */
	    runTests: testsRun.runCustomSnippets,
	    /**
	     * Console implementation to show test logs in report
	     */
	    htmlConsole: htmlConsole.getInstance(),

	    resetDefaults: function () {
	      return setup.reset();
	    },

	    // for custom reporting
	    // todo: export module, not dom element
	    report: document.getElementById('report')
	  });
	};

/***/ }),

/***/ 647:
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Tests run controller
	 */

	const thenChrome = __webpack_require__(1);
	const mobx = __webpack_require__(534);
	const path = __webpack_require__(116);
	const fs = __webpack_require__(14);
	const state = __webpack_require__(604);
	const { APP_STATE, TAB } = __webpack_require__(610);
	const bgApi = __webpack_require__(645);
	const { onTestsRun, onTestsDone, onConsoleClear } = __webpack_require__(612);

	exports.init = function () {
	  onTestsRun.addListener(runOnCurrentData);
	  onTestsDone.addListener(done);
	};

	/**
	 * Run custom snippets
	 *
	 * @param {Array<{path, code}>} snippets
	 */
	exports.runCustomSnippets = function (snippets) {
	  const data = {
	    target: getSelectedTargetInfo(),
	    snippets: snippets,
	    devMode: false
	  };
	  run(data);
	};

	const run = mobx.action(function (data) {
	  state.appState = APP_STATE.TESTS_RUNNING;
	  state.selectedTab = TAB.REPORT;
	  onConsoleClear.dispatch();
	  bgApi.runTests(data);
	});

	const done = mobx.action(function () {
	  state.appState = APP_STATE.TESTS_DONE;
	  // activate self tab after tests done
	  activateSelfTab();
	});

	function runOnCurrentData() {
	  const data = {
	    target: getSelectedTargetInfo(),
	    baseUrl: getBaseUrl(),
	    files: getFiles(),
	    devMode: state.devMode
	  };
	  if (state.isInnerFiles) {
	    getSnippets(data.baseUrl, data.files).then(snippets => {
	      data.snippets = snippets;
	      run(data);
	    });
	  } else {
	    run(data);
	  }
	}

	function getFiles() {
	  if (state.selectedFile) {
	    return state.files.filter(file => file.isSetup).map(file => file.path).concat([state.selectedFile]);
	  } else {
	    return state.files.map(file => file.path);
	  }
	}

	function getBaseUrl() {
	  return state.isInnerFiles ? state.innerFilesPath : path.dirname(state.filesSourceUrl);
	}

	function getSnippets(basePath, paths) {
	  const tasks = paths.map(path => {
	    const fullPath = basePath + '/' + path;
	    return fs.readFile(fullPath).then(code => {
	      return { path, code };
	    });
	  });
	  return Promise.all(tasks);
	}

	function getSelectedTargetInfo() {
	  if (!state.selectedTarget) {
	    throw new Error('Empty target');
	  }
	  const hub = state.hubs.find(hub => hub.id === state.selectedTarget.hubId);
	  return {
	    serverUrl: hub.serverUrl,
	    watchUrl: hub.watchUrl,
	    loopback: hub.loopback,
	    name: state.selectedTarget.name,
	    caps: Object.assign({}, hub.caps, state.selectedTarget.caps)
	  };
	}

	function activateSelfTab() {
	  return thenChrome.tabs.getCurrent().then(tab => thenChrome.tabs.update(tab.id, { active: true }));
	}

/***/ }),

/***/ 648:
/***/ (function(module, exports, __webpack_require__) {

	
	const Console = __webpack_require__(649);
	const { onConsoleMessage, onConsoleClear } = __webpack_require__(612);

	let instance = null;

	exports.init = function () {
	  instance = new Console();
	  instance.onMessage = data => onConsoleMessage.dispatch(data);
	  instance.onClear = () => onConsoleClear.dispatch();
	};

	exports.getInstance = function () {
	  return instance;
	};

/***/ }),

/***/ 649:
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Implementation of console interface
	 */

	const stringifySafe = __webpack_require__(650);

	const MAX_INLINE_OBJ_LENGTH = 50;

	module.exports = class Console {
	  constructor() {
	    this._lines = [];
	    this.onMessage = () => {};
	    this.onClear = () => {};
	  }

	  log() {
	    const args = [].slice.call(arguments);
	    this._addLine('log', args);
	  }

	  info() {
	    const args = [].slice.call(arguments);
	    this._addLine('info', args);
	  }

	  warn() {
	    const args = [].slice.call(arguments);
	    this._addLine('warn', args);
	  }

	  error() {
	    const args = [].slice.call(arguments);
	    this._addLine('error', args);
	  }

	  clear() {
	    this._lines.length = 0;
	    this.onClear();
	  }

	  _addLine(type, args) {
	    args = args.map(formatArg);
	    const line = {type, args};
	    this._lines.push(line);
	    this.onMessage(line);
	  }
	};

	function formatArg(arg) {
	  switch (typeof arg) {
	    case 'object':
	      // todo: date and regexp
	      return arg === null ? formatNullUndefined() : formatString(stringifyObj(arg));
	    case 'function':
	      return formatString(arg.toString());
	    case 'number':
	      return formatNumber(arg);
	    case 'undefined':
	      return formatNullUndefined();
	    default:
	      return formatString(arg);
	  }
	}

	function formatNullUndefined(v) {
	  return {
	    type: 'null-undefined',
	    text: String(v),
	  };
	}

	function formatString(v) {
	  return {
	    type: 'string',
	    text: v,
	  };
	}

	function formatNumber(v) {
	  return {
	    type: 'number',
	    text: v,
	  };
	}

	function stringifyObj(obj) {
	  try {
	    let str = stringifySafe(obj, replacer, 2);
	    // for small objects use inline
	    if (str.length < MAX_INLINE_OBJ_LENGTH) {
	      str = stringifySafe(obj, replacer);
	    }
	    return str;
	  } catch(e) {
	    return obj.toString();
	  }
	}

	/**
	 * Replace Date and Regexp in stringify
	 *
	 * @param {String} key
	 * @param {*} value
	 */
	function replacer(key, value) {
	  if (value instanceof Date) {
	    return value.toString();
	  } else if (value instanceof RegExp) {
	    return `/${value}/`;
	  } else {
	    return value;
	  }
	}


/***/ }),

/***/ 650:
/***/ (function(module, exports) {

	exports = module.exports = stringify
	exports.getSerialize = serializer

	function stringify(obj, replacer, spaces, cycleReplacer) {
	  return JSON.stringify(obj, serializer(replacer, cycleReplacer), spaces)
	}

	function serializer(replacer, cycleReplacer) {
	  var stack = [], keys = []

	  if (cycleReplacer == null) cycleReplacer = function(key, value) {
	    if (stack[0] === value) return "[Circular ~]"
	    return "[Circular ~." + keys.slice(0, stack.indexOf(value)).join(".") + "]"
	  }

	  return function(key, value) {
	    if (stack.length > 0) {
	      var thisPos = stack.indexOf(this)
	      ~thisPos ? stack.splice(thisPos + 1) : stack.push(this)
	      ~thisPos ? keys.splice(thisPos, Infinity, key) : keys.push(key)
	      if (~stack.indexOf(value)) value = cycleReplacer.call(this, key, value)
	    }
	    else stack.push(value)

	    return replacer == null ? value : replacer.call(this, key, value)
	  }
	}


/***/ }),

/***/ 651:
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Store some predefined data in first run
	 * To clear storage run from console: chrome.storage.local.clear()
	 */

	const thenChrome = __webpack_require__(1);
	const mobx = __webpack_require__(534);
	const fs = __webpack_require__(14);
	const defaults = __webpack_require__(609);
	const defaultsExtra = __webpack_require__(652);
	const { PROJECTS_DIR } = __webpack_require__(610);
	const logger = __webpack_require__(88).create('Setup');

	exports.applyOnFirstRun = function () {
	  return isFirstRun().then(firstRun => firstRun ? storeDefaults() : null);
	};

	/**
	 * Resets local storage, filesystem and reloads ui
	 */
	exports.reset = function () {
	  return Promise.all([fs.clear(), thenChrome.storage.local.clear()]).then(() => {
	    // setTimeout is usefull here for test client to get response from evaluated script before page reload
	    setTimeout(() => location.reload(), 50);
	  });
	};

	/**
	 * Detects first run by checking `installDate` key in storage
	 */
	function isFirstRun() {
	  return thenChrome.storage.local.get('installDate').then(data => Object.keys(data).length === 0);
	}

	function storeDefaults() {
	  return Promise.all([storeToStorage(), storeToFs()]);
	}

	function storeToStorage() {
	  const data = mobx.toJS({
	    installDate: Date.now(),
	    projects: [defaults.project],
	    selectedProjectId: defaults.project.id,
	    targets: defaults.targets.concat(defaultsExtra.targets),
	    selectedTargetId: defaults.targets[0].id,
	    hubs: defaults.hubs.concat(defaultsExtra.hubs),
	    selectedTab: defaults.selectedTab
	  });
	  logger.log(`Storing to storage`, data);
	  return thenChrome.storage.local.set(data);
	}

	function storeToFs() {
	  const path = `${ PROJECTS_DIR }/${ defaults.project.id }/${ defaults.innerFile.path }`;
	  const content = defaults.innerFile.code;
	  logger.log(`Storing default inner file: ${ path }`);
	  return fs.writeFile(path, content);
	}

/***/ }),

/***/ 652:
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Extra targets defined by buildInfo.isDev and process.env variables and applied in install controller
	 */

	exports.hubs = [];
	exports.targets = [];

	// add localhost hub and target (currently for dev build only)
	if (false) {
	  exports.hubs = exports.hubs.concat([{
	    id: 'localhost',
	    serverUrl: 'http://localhost:4444/wd/hub',
	    caps: {
	      'browserName': 'chrome'
	    }
	  }]);

	  exports.targets = exports.targets.concat([{
	    id: 'localhost-1',
	    hubId: 'localhost',
	    name: 'Localhost server (chrome)'
	  }, {
	    id: 'localhost-2',
	    hubId: 'localhost',
	    name: 'Localhost server (firefox)',
	    caps: {
	      'browserName': 'firefox'
	    }
	  }]);
	}

	// add yandex hub and targets
	if (false) {
	  exports.hubs = exports.hubs.concat([{
	    id: 'yandex',
	    serverUrl: `http://${ process.env.YANDEX_USER }:${ process.env.YANDEX_KEY }@sg.yandex-team.ru:4444/wd/hub`,
	    caps: {
	      'browserName': 'chrome'
	    }
	  }]);

	  exports.targets = exports.targets.concat([{
	    id: 'yandex-1',
	    hubId: 'yandex',
	    name: 'Yandex grid (chrome 51, linux)',
	    caps: {
	      'platform': 'LINUX',
	      'version': '51.0'
	    }
	  }, {
	    id: 'yandex-2',
	    hubId: 'yandex',
	    name: 'Yandex grid (chrome 53, win7)',
	    caps: {
	      'platform': 'WINDOWS',
	      'version': '53.0'
	    }
	  }]);
	}

	// add sauce hub and targets
	if (false) {
	  exports.hubs = exports.hubs.concat([{
	    id: 'sauce',
	    serverUrl: `http://${ process.env.SAUCE_USER }:${ process.env.SAUCE_KEY }@ondemand.saucelabs.com:80/wd/hub`,
	    watchUrl: `https://saucelabs.com/beta/tests/:sessionId/watch`,
	    caps: {
	      // temp for demo
	      'username': process.env.SAUCE_USER,
	      'accessKey': process.env.SAUCE_KEY,
	      'browserName': 'chrome'
	    }
	  }]);

	  exports.targets = exports.targets.concat([{
	    id: 'sauce-1',
	    hubId: 'sauce',
	    name: 'Sauce labs (chrome stable, win7)',
	    caps: {
	      'platform': 'Windows 7'
	    }
	  }, {
	    id: 'sauce-2',
	    hubId: 'sauce',
	    name: 'Sauce labs (chrome beta, win7)',
	    caps: {
	      'platform': 'Windows 7',
	      'version': 'beta'
	    }
	  }, {
	    id: 'sauce-3',
	    hubId: 'sauce',
	    name: 'Sauce labs (firefox stable, win7)',
	    caps: {
	      'platform': 'Windows 7',
	      'browserName': 'firefox'
	    }
	  }]);
	}

/***/ }),

/***/ 653:
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Loads tests config from url
	 */

	const mobx = __webpack_require__(534);
	const state = __webpack_require__(604);
	const { onError } = __webpack_require__(612);
	const { APP_STATE } = __webpack_require__(610);
	const utils = __webpack_require__(8);
	const evaluate = __webpack_require__(654);
	const logger = __webpack_require__(88).create('Config-loader');

	// todo: isLoading flag to reject parallel requests

	/**
	 * Initially subscribe to changes of filesSourceUrl to reload config automatically
	 */
	exports.init = function () {
	  mobx.reaction(() => state.filesSourceUrl, exports.load);
	};

	/**
	 * Loads config from current url
	 */
	exports.load = mobx.action(function () {
	  const url = state.filesSourceUrl;
	  if (utils.isValidUrl(url)) {
	    state.appState = APP_STATE.LOADING;
	    logger.log(`Loading config from: ${ url }`);
	    return utils.fetchText(url).then(text => processConfig(text, url)).then(done, fail);
	  } else {
	    fail(new Error(`Invalid config url ${ url }`));
	  }
	});

	const done = mobx.action(function (config) {
	  const setupFiles = config.setup.map(path => {
	    return { path, isSetup: true };
	  });
	  const regularFiles = config.tests.map(path => {
	    return { path, isSetup: false };
	  });
	  state.appState = APP_STATE.READY;
	  state.outerFiles = setupFiles.concat(regularFiles);
	  logger.log(`Config loaded:`, config);
	});

	const fail = mobx.action(function (e) {
	  state.outerFiles = [];
	  state.appState = APP_STATE.READY;
	  // todo: store.clearTests();
	  onError.dispatch(e);
	});

	function processConfig(text, url) {
	  const config = evaluate.asCommonJs(url, text);
	  validateConfig(config);
	  return config;
	}

	function validateConfig(config) {
	  if (!config) {
	    throw new Error('Config is empty');
	  }
	  if (typeof config !== 'object') {
	    throw new Error('Config should be object');
	  }
	  if (!Array.isArray(config.setup)) {
	    config.setup = [];
	  }
	  if (!Array.isArray(config.tests)) {
	    config.tests = [];
	  }
	}

/***/ }),

/***/ 654:
/***/ (function(module, exports) {

	/**
	 * Evaluate methods
	 */

	/**
	 * Evaluate code as commonJs module
	 * Filename is required as otherwise you will not be able to debug code (<anonymous> in stack trace)
	 *
	 * @param {String} filename
	 * @param {String} code
	 */
	exports.asCommonJs = function (filename, code) {
	  const module = {exports: {}};
	  const args = {
	    module: module,
	    exports: module.exports,
	  };
	  const fnCode = code + '\nreturn module;';
	  return exports.asFunction(filename, fnCode, args).exports;
	};

	/**
	 * Evaluate code as anonymous function with specified arguments
	 * Filename is required as otherwise you will not be able to debug code (<anonymous> in stack trace)
	 *
	 * @param {String} filename
	 * @param {String} code
	 * @param {Object} [args]
	 * @param {Object} [context]
	 */
	exports.asFunction = function (filename, code, args = {}, context = null) {
	  const argNames = Object.keys(args);
	  const argValues = argNames.map(name => args[name]);
	  const fn = new Function(argNames.join(','), code);
	  // for pretty debugging
	  Object.defineProperty(fn, 'name', {value: filename});
	  return fn.apply(context, argValues);
	};


/***/ })

});