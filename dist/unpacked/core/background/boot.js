/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Bootstrap before main bundle
	 */

	// export thenChrome for debug
	window.thenChrome = __webpack_require__(1);
	const errorCatcher = __webpack_require__(6);
	const errorHandler = __webpack_require__(7);
	const browserAction = __webpack_require__(10);

	// catch all errors and proxy to ui
	errorCatcher.attach(window, errorHandler);
	// set browserAction click handler to open ui
	browserAction.setup();


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _api = __webpack_require__(2);

	var _api2 = _interopRequireDefault(_api);

	var Thenable = getNativePromise();

	/**
	 * Get native promise constructor
	 * @returns {*}
	 */
	function getNativePromise() {
	    if (typeof window !== 'undefined' && window.Promise) {
	        return window.Promise;
	    }
	    if (typeof global !== 'undefined' && global.Promise) {
	        return global.Promise;
	    }
	}

	if (!Thenable) {
	    throw new TypeError('Native promise does not support in your environment. Use /out/api function directly');
	}

	/**
	 * @type {ThenChrome}
	 */
	exports['default'] = (0, _api2['default'])(Thenable);
	module.exports = exports['default'];
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	exports['default'] = create;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _config = __webpack_require__(3);

	var _config2 = _interopRequireDefault(_config);

	var _wrapper = __webpack_require__(4);

	var _object = __webpack_require__(5);

	/**
	 * @param {Function} Thenable
	 * @returns {ThenChrome}
	 */

	function create(Thenable) {
	    return Object.keys(_config2['default']).reduce(function (result, namespace) {
	        createNamespace(result, namespace);
	        return wrapMethods(result, namespace, _config2['default'][namespace], Thenable);
	    }, {});
	}

	/**
	 * Create namespace
	 * @param {Object} obj
	 * @param {String} namespace
	 * @returns {*}
	 */
	function createNamespace(obj, namespace) {
	    var chromeNamespace = (0, _object.get)(obj, namespace);
	    if (!chromeNamespace) {
	        (0, _object.set)(obj, namespace);
	    }
	    return obj;
	}

	/**
	 * @param {Object} obj
	 * @param {String} namespace
	 * @param {Object} data
	 * @param {Array<String>} data.async
	 * @param {Array<String>} data.sync
	 * @param {Function} Promise constructor
	 * @returns {Object}
	 */
	function wrapMethods(obj, namespace, data, Promise) {
	    (0, _wrapper.wrapAsyncMethods)(obj, namespace, data.async, Promise);
	    (0, _wrapper.wrapSyncMethods)(obj, namespace, data.sync, Promise);
	    return obj;
	}
	module.exports = exports['default'];

/***/ }),
/* 3 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	exports['default'] = {
	    alarms: {
	        async: ['get', 'getAll', 'clear', 'clearAll'],
	        sync: ['create']
	    },
	    bookmarks: {
	        async: ['get', 'getChildren', 'getRecent', 'getTree', 'getSubTree', 'search', 'create', 'move', 'update', 'remove', 'removeTree']
	    },
	    browserAction: {
	        async: ['getTitle', 'setIcon', 'getPopup', 'getBadgeText', 'getBadgeBackgroundColor'],
	        sync: ['setTitle', 'setPopup', 'setBadgeText', 'setBadgeBackgroundColor', 'enable', 'disable']
	    },
	    browsingData: {
	        async: ['settings', 'remove', 'removeAppcache', 'removeCache', 'removeCookies', 'removeDownloads', 'removeFileSystems', 'removeFormData', 'removeHistory', 'removeIndexedDB', 'removeLocalStorage', 'removePluginData', 'removePasswords', 'removeWebSQL']
	    },
	    commands: {
	        async: ['getAll']
	    },
	    contextMenus: {
	        async: ['create', 'update', 'remove', 'removeAll']
	    },
	    cookies: {
	        async: ['get', 'getAll', 'set', 'remove', 'getAllCookieStores']
	    },
	    'debugger': {
	        async: ['attach', 'detach', 'sendCommand', 'getTargets']
	    },
	    desktopCapture: {
	        async: ['chooseDesktopMedia'],
	        sync: ['cancelChooseDesktopMedia']
	    },
	    'devtools.inspectedWindow': {
	        async: ['eval', 'getResources'],
	        sync: ['reload']
	    },
	    'devtools.network': {
	        async: ['getHAR']
	    },
	    'devtools.panels': {
	        async: ['create', 'setOpenResourceHandler', 'openResource']
	    },
	    dial: {
	        async: ['discoverNow', 'fetchDeviceDescription']
	    },
	    downloads: {
	        async: ['download', 'search', 'pause', 'resume', 'cancel', 'getFileIcon', 'erase', 'removeFile', 'acceptDanger'],
	        sync: ['open', 'show', 'showDefaultFolder', 'drag', 'setShelfEnabled']
	    },
	    extension: {
	        async: ['isAllowedIncognitoAccess', 'isAllowedFileSchemeAccess'],
	        sync: ['getURL', 'getViews', 'getBackgroundPage', 'getExtensionTabs', 'setUpdateUrlData']
	    },
	    fontSettings: {
	        async: ['clearFont', 'getFont', 'setFont', 'getFontList', 'clearDefaultFontSize', 'getDefaultFontSize', 'setDefaultFontSize', 'clearDefaultFixedFontSize', 'getDefaultFixedFontSize', 'setDefaultFixedFontSize', 'clearMinimumFontSize', 'getMinimumFontSize', 'setMinimumFontSize']
	    },
	    gcm: {
	        async: ['register', 'unregister', 'send']
	    },
	    history: {
	        async: ['search', 'getVisits', 'addUrl', 'deleteUrl', 'deleteRange', 'deleteAll']
	    },
	    i18n: {
	        async: ['getAcceptLanguages', 'detectLanguage'],
	        sync: ['getMessage', 'getUILanguage']
	    },
	    identity: {
	        async: ['getAccounts', 'getAuthToken', 'getProfileUserInfo', 'removeCachedAuthToken', 'launchWebAuthFlow'],
	        sync: ['getRedirectURL']
	    },
	    idle: {
	        async: ['queryState'],
	        sync: ['setDetectionInterval']
	    },
	    instanceID: {
	        async: ['getID', 'getCreationTime', 'getToken', 'deleteToken', 'deleteID']
	    },
	    management: {
	        async: ['getAll', 'get', 'getSelf', 'getPermissionWarningsById', 'getPermissionWarningsByManifest', 'setEnabled', 'uninstall', 'uninstallSelf', 'launchApp', 'createAppShortcut', 'setLaunchType', 'generateAppForLink']
	    },
	    notifications: {
	        async: ['create', 'update', 'clear', 'getAll', 'getPermissionLevel']
	    },
	    omnibox: {
	        sync: ['setDefaultSuggestion']
	    },
	    pageAction: {
	        async: ['getTitle', 'setIcon', 'getPopup'],
	        sync: ['show', 'hide', 'setTitle', 'setPopup']
	    },
	    pageCapture: {
	        async: ['saveAsMHTML']
	    },
	    permissions: {
	        async: ['getAll', 'contains', 'request', 'remove']
	    },
	    'privacy.network.networkPredictionEnabled': {
	        async: ['get', 'set', 'clear']
	    },
	    'privacy.services.alternateErrorPagesEnabled': {
	        async: ['get', 'set', 'clear']
	    },
	    'privacy.services.autofillEnabled': {
	        async: ['get', 'set', 'clear']
	    },
	    'privacy.services.passwordSavingEnabled': {
	        async: ['get', 'set', 'clear']
	    },
	    'privacy.services.safeBrowsingEnabled': {
	        async: ['get', 'set', 'clear']
	    },
	    'privacy.services.searchSuggestEnabled': {
	        async: ['get', 'set', 'clear']
	    },
	    'privacy.services.spellingServiceEnabled': {
	        async: ['get', 'set', 'clear']
	    },
	    'privacy.services.translationServiceEnabled': {
	        async: ['get', 'set', 'clear']
	    },
	    'privacy.websites.hyperlinkAuditingEnabled': {
	        async: ['get', 'set', 'clear']
	    },
	    'privacy.websites.referrersEnabled': {
	        async: ['get', 'set', 'clear']
	    },
	    'privacy.websites.thirdPartyCookiesAllowed': {
	        async: ['get', 'set', 'clear']
	    },
	    'proxy.settings': {
	        async: ['get', 'set', 'clear']
	    },
	    runtime: {
	        async: ['getBackgroundPage', 'openOptionsPage', 'setUninstallURL', 'requestUpdateCheck', 'sendMessage', 'sendNativeMessage', 'getPlatformInfo', 'getPackageDirectoryEntry'],
	        sync: ['getManifest', 'getURL', 'reload', 'restart', 'connect', 'connectNative']
	    },
	    sessions: {
	        async: ['getRecentlyClosed', 'getDevices', 'restore']
	    },
	    'storage.local': {
	        async: ['clear', 'get', 'set', 'remove', 'getBytesInUse']
	    },
	    'storage.managed': {
	        async: ['clear', 'get', 'set', 'remove', 'getBytesInUse']
	    },
	    'storage.sync': {
	        async: ['clear', 'get', 'set', 'remove', 'getBytesInUse']
	    },
	    'system.cpu': {
	        async: ['getInfo']
	    },
	    'system.memory': {
	        async: ['getInfo']
	    },
	    'system.storage': {
	        async: ['getInfo', 'ejectDevice', 'getAvailableCapacity']
	    },
	    tabCapture: {
	        async: ['capture', 'getCapturedTabs']
	    },
	    tabs: {
	        async: ['get', 'getCurrent', 'sendRequest', 'sendMessage', 'getSelected', 'getAllInWindow', 'create', 'duplicate', 'query', 'highlight', 'update', 'move', 'reload', 'remove', 'detectLanguage', 'captureVisibleTab', 'executeScript', 'insertCSS', 'setZoom', 'getZoom', 'setZoomSettings', 'getZoomSettings'],
	        sync: ['connect']
	    },
	    topSites: {
	        async: ['get']
	    },
	    tts: {
	        async: ['speak', 'isSpeaking', 'getVoices'],
	        sync: ['stop', 'pause', 'resume']
	    },
	    webNavigation: {
	        async: ['getFrame', 'getAllFrames']
	    },
	    webRequest: {
	        async: ['handlerBehaviorChanged']
	    },
	    windows: {
	        async: ['get', 'getCurrent', 'getLastFocused', 'getAll', 'create', 'update', 'remove']
	    }
	};
	module.exports = exports['default'];

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	exports.wrapAsyncMethods = wrapAsyncMethods;
	exports.wrapSyncMethods = wrapSyncMethods;

	var _object = __webpack_require__(5);

	/**
	 * chrome api object
	 * @see https://developer.chrome.com/extensions/api_index
	 */
	var chromeApi = getChromeApi();

	/**
	 * Create getters for async methods
	 * @param {Object} obj
	 * @param {String} namespace
	 * @param {Array<String>} asyncMethods
	 * @param {Function} Thenable
	 * @returns {Object}
	 */

	function wrapAsyncMethods(obj, namespace, asyncMethods, Thenable) {
	    if (asyncMethods === undefined) asyncMethods = [];

	    return asyncMethods.reduce(function (result, method) {
	        return appendAsyncMethod(obj, namespace, method, Thenable);
	    }, obj);
	}

	/**
	 * Wrap sync methods to promise
	 * @param {Object} obj
	 * @param {String} namespace
	 * @param {Array<String>} syncMethods
	 * @param {Function} Thenable
	 * @returns {*}
	 */

	function wrapSyncMethods(obj, namespace, syncMethods, Thenable) {
	    if (syncMethods === undefined) syncMethods = [];

	    return syncMethods.reduce(function (result, method) {
	        return appendSyncMethod(obj, namespace, method, Thenable);
	    }, obj);
	}

	/**
	 * Get chrome api object
	 * @returns {chrome}
	 */
	function getChromeApi() {
	    if (typeof window !== 'undefined' && window.chrome) {
	        return window.chrome;
	    }
	    if (typeof global !== 'undefined' && global.chrome) {
	        return global.chrome;
	    }
	}

	/**
	 * Append async method to data
	 * @param {Object} obj
	 * @param {String} namespace
	 * @param {String} method
	 * @param {Function} Thenable
	 * @returns {Object}
	 */
	function appendAsyncMethod(obj, namespace, method, Thenable) {
	    var data = (0, _object.get)(obj, namespace);
	    Object.defineProperty(data, method, {
	        get: function get() {
	            return wrapAsyncMethod(Thenable, namespace, method);
	        }
	    });
	    return obj;
	}

	/**
	 * Wrap sync method
	 * @param {Function} Thenable
	 * @param {String} namespace
	 * @param {String} method
	 * @returns {Function}
	 */
	function wrapAsyncMethod(Thenable, namespace, method) {
	    var _this = this;

	    return function () {
	        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	            args[_key] = arguments[_key];
	        }

	        return new Thenable(function (resolve, reject) {
	            var chromeNamespace = (0, _object.get)(chromeApi, namespace);
	            args.push(getResolver(resolve, reject, _this));
	            apply(chromeNamespace[method], chromeNamespace, args);
	        });
	    };
	}

	/**
	 *
	 * @param {Function} resolve
	 * @param {Function} reject
	 * @param {*} context
	 * @returns {Function}
	 */
	function getResolver(resolve, reject, context) {
	    return function () {
	        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
	            args[_key2] = arguments[_key2];
	        }

	        if (chromeApi.runtime.lastError) {
	            return reject(chromeApi.runtime.lastError);
	        }
	        return apply(resolve, context, args);
	    };
	}

	/**
	 * Append sync method
	 * @param {Object} obj
	 * @param {String} namespace
	 * @param {String} method
	 * @param {Function} PromiseConstructor
	 * @returns {Object}
	 */
	function appendSyncMethod(obj, namespace, method, PromiseConstructor) {
	    var data = (0, _object.get)(obj, namespace);
	    Object.defineProperty(data, method, {
	        get: function get() {
	            return wrapSyncMethod(PromiseConstructor, namespace, method);
	        }
	    });
	    return obj;
	}

	/**
	 * Wrap sync method
	 * @param {Function} Thenable
	 * @param {String} namespace
	 * @param {String} method
	 * @returns {Function}
	 */
	function wrapSyncMethod(Thenable, namespace, method) {
	    return function () {
	        for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
	            args[_key3] = arguments[_key3];
	        }

	        return new Thenable(function (resolve, reject) {
	            var chromeNamespace = (0, _object.get)(chromeApi, namespace);
	            try {
	                return resolve(apply(chromeNamespace[method], chromeNamespace, args));
	            } catch (e) {
	                return reject(e);
	            }
	        });
	    };
	}

	/**
	 * For IE compatibility we can't use method.apply.
	 *
	 * Function apply
	 * @param {Function} method
	 * @param {*} context
	 * @param {Array} args
	 * @returns {*}
	 */
	function apply(method, context, args) {
	    return Function.prototype.apply.call(method, context, args);
	}
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ }),
/* 5 */
/***/ (function(module, exports) {

	/**
	 * Get nested object by path
	 * @param {Object} object
	 * @param {String} path
	 * @param {String} [delimiter]
	 * @returns {Object|Null}
	 */
	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	exports.get = get;
	exports.set = set;

	function get(object, path) {
	    var delimiter = arguments.length <= 2 || arguments[2] === undefined ? '.' : arguments[2];

	    var keys = path.split(delimiter);
	    var data = object;

	    for (var i = 0; i < keys.length; i++) {
	        var key = keys[i];
	        if (!data[key]) {
	            return null;
	        }
	        data = data[key];
	    }
	    return data;
	}

	/**
	 * Create nested object by path
	 * @param {Object} obj
	 * @param {String} path
	 * @param {String} [delimiter]
	 * @returns {*}
	 */

	function set(obj, path) {
	    var delimiter = arguments.length <= 2 || arguments[2] === undefined ? '.' : arguments[2];

	    return createNestedObject(obj, path.split(delimiter));
	}

	/**
	 * Create nested objects
	 * @param {Object} obj
	 * @param {Array<String>} keys
	 * @returns {*}
	 */
	function createNestedObject(obj, keys) {
	    if (keys.length) {
	        var nested = obj[keys[0]] = typeof obj[keys[0]] === 'undefined' ? {} : obj[keys[0]];
	        createNestedObject(nested, keys.slice(1, keys.length));
	    }
	    return obj;
	}

/***/ }),
/* 6 */
/***/ (function(module, exports) {

	/**
	 * Catches all unhandled errors and unhandled promise rejections, and pass them to specified handler
	 * Can avoid circular errors and store errors until handler attached.
	 *
	 * todo: event for promise can contain any value, not only Error !!
	 * todo: store errors until handler set
	 *
	 * see: https://developer.mozilla.org/en/docs/Web/API/GlobalEventHandlers/onerror
	 * see: https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onunhandledrejection
	 */

	/**
	 * If the same error comes within this timeout, we ignore it to avoid endless loop
	 * Timeout is progressively increased
	 */
	const EQUAL_ERRORS_TIMEOUT_MIN = 50;
	const EQUAL_ERRORS_TIMEOUT_MAX = 60 * 1000;

	let currentTimeout = null;
	let handler = null;
	let lastErrorEvent = null;

	/**
	 * Attach to window for catching errors
	 *
	 * @param {Window} win
	 * @param {Function} [handler]
	 */
	exports.attach = function (win, handler) {
	  win.addEventListener('error', processError);
	  win.addEventListener('unhandledrejection', processError);
	  resetTimeout();
	  if (handler) {
	    exports.setHandler(handler);
	  }
	};

	/**
	 * Sets handler to process errors
	 * @param {Function} newHandler
	 */
	exports.setHandler = function (newHandler) {
	  if (typeof newHandler === 'function') {
	    handler = newHandler;
	  } else {
	    throw new Error('Error handler should be function');
	  }
	};

	function processError(errorEvent) {
	  if (isEqualEvents(lastErrorEvent, errorEvent)) {
	    if (getEventsDelta(lastErrorEvent, errorEvent) <= currentTimeout) {
	      lastErrorEvent = errorEvent;
	      errorEvent.preventDefault();
	      return;
	    } else {
	      increaseTimeout();
	    }
	  } else {
	    resetTimeout();
	  }
	  lastErrorEvent = errorEvent;
	  if (handler) {
	    const error = getErrorFromEvent(errorEvent);
	    // run handler in nextTick to catch handler-own instant errors normally
	    setTimeout(() => {
	      handler(error, errorEvent);
	    }, 0);
	  }
	}

	function isEqualEvents(errorEvent1, errorEvent2) {
	  if (!errorEvent1 || !errorEvent2 || errorEvent1.type !== errorEvent2.type) {
	    return false;
	  }
	  const error1 = getErrorFromEvent(errorEvent1);
	  const error2 = getErrorFromEvent(errorEvent2);
	  return error1 === error2 ||
	    (error1.message === error2.message && error1.stack === error2.stack);
	}

	function getEventsDelta(event1, event2) {
	  return Math.abs(event1.timeStamp - event2.timeStamp);
	}

	function getErrorFromEvent(errorEvent) {
	  // here can be instance of PromiseRejectionEvent or ErrorEvent
	  const errorValue = errorEvent.promise ? errorEvent.reason : errorEvent.error;
	  const inPromise = errorEvent.promise ? '(in promise) ' : '';
	  return errorValue instanceof Error
	    ? errorValue
	    : new Error(`Uncaught ${inPromise}${errorValue.message || errorValue}`);
	}

	function resetTimeout() {
	  if (currentTimeout !== EQUAL_ERRORS_TIMEOUT_MIN) {
	    currentTimeout = EQUAL_ERRORS_TIMEOUT_MIN;
	  }
	}

	function increaseTimeout() {
	  if (currentTimeout < EQUAL_ERRORS_TIMEOUT_MAX) {
	    currentTimeout = currentTimeout * 2;
	    if (currentTimeout > EQUAL_ERRORS_TIMEOUT_MAX) {
	      currentTimeout = EQUAL_ERRORS_TIMEOUT_MAX;
	    }
	  }
	}


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Handler for uncaught errors that proxies it to ui
	 * Prefix not useful as there can be errors in tests that are executed in background.
	 */

	const utils = __webpack_require__(8);

	/**
	 * For that error we show additional warning with link to chrome://flags
	 */
	const CHROME_URL_ACCESS_ERROR = 'Cannot access a chrome-extension:// URL of different extension';

	module.exports = function (error) {
	  const msg = getMsg(error);
	  processChromeUrlAccessError(msg);
	  if (error.isMocha) {
	    // don't display mocha errors as mocha do it itself
	    return;
	  }
	  showInAllViews('error', msg);
	};

	function showInAllViews(method/*, msg1, msg2, ...*/) {
	  const args = Array.prototype.slice.call(arguments, 1);
	  chrome.extension.getViews({type: 'tab'}).forEach(view => {
	    if (view.htmlConsole) {
	      view.htmlConsole[method].apply(view.htmlConsole, args);
	    }
	  });
	}

	function getMsg(error) {
	  return typeof error === 'object'
	    ? (utils.cleanStack(error.stack) || error.message || error.name)
	    : String(error);
	}

	function processChromeUrlAccessError(msg) {
	  if (typeof msg === 'string' && msg.indexOf(CHROME_URL_ACCESS_ERROR) >= 0) {
	    showInAllViews(
	      'warn',
	      'Please enable chrome flag to allow debug of extensions',
	      'chrome://flags/#extensions-on-chrome-urls'
	    )
	  }
	}


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Utils
	 */

	const escapeStringRegexp = __webpack_require__(9);

	/**
	 * Loads script via <script> tag
	 *
	 * @param {String} url
	 * @param {Object} targetDocument
	 * @returns {Promise}
	 */
	exports.loadScript = function (url, doc = document) {
	  return new Promise(function (resolve, reject) {
	    const script = doc.createElement('script');
	    script.type = 'text/javascript';
	    doc.getElementsByTagName('head')[0].appendChild(script);
	    script.onload = () => resolve(script);
	    script.onerror = () => reject(new Error(`Can not load script ${url}`));
	    script.src = url;
	  });
	};

	/**
	 * Remove elements by selector
	 *
	 * @param {String} selector
	 * @param {Document} [doc]
	 */
	exports.removeBySelector = function (selector, doc = document) {
	  [].forEach.call(doc.querySelectorAll(selector), el => {
	    el.parentNode.removeChild(el);
	  });
	};

	/**
	 * Fetch script via window.fetch
	 *
	 * @param {String} url
	 * @returns {Promise}
	 */
	exports.fetchText = function (url) {
	  return window.fetch(url)
	    .then(r => r.text())
	};

	/**
	 * Throws error in next tick
	 *
	 * @param {Error} error
	 */
	exports.asyncThrow = function (error) {
	  setTimeout(() => {
	    throw error;
	  }, 0);
	};

	/**
	 * Copies object without first-level undefined props
	 * Useful for using Object.assign to set defaults
	 *
	 * @param {Object} obj
	 */
	exports.noUndefined = function (obj) {
	  return Object.keys(obj).reduce((res, key) => {
	    if (obj[key] !== undefined) {
	      res[key] = obj[key];
	    }
	    return res;
	  }, {})
	};


	/**
	 * Trim slashes
	 *
	 * @param {String} str
	 * @returns {String}
	 */
	exports.trimSlashes = function (str) {
	  return str.replace(/^\/+|\/+$/g, '');
	};

	/**
	 * Remove useless paths from error stack:
	 * - filesystem:chrome-extension://cidkhbpkgpdkadkjpkfooofilpmfneog/persistent/
	 * - chrome-extension://cidkhbpkgpdkadkjpkfooofilpmfneog/
	 *
	 * @param {String} stack
	 */
	exports.cleanStack = function(stack) {
	  if (typeof stack !== 'string') {
	    return stack;
	  }
	  const url = chrome.runtime.getURL('');
	  const urlFs = `filesystem:${url}persistent/`;
	  const urlRe = new RegExp(escapeStringRegexp(url), 'g');
	  const urlFsRe = new RegExp(escapeStringRegexp(urlFs), 'g');
	  return stack
	    .replace(urlFsRe, '')
	    .replace(urlRe, '')
	};

	/**
	 * Cuts local url
	 *
	 * @param {String} localUrl
	 */
	exports.cutLocalUrl = function (localUrl) {
	  return localUrl
	    .replace(`filesystem:chrome-extension://${chrome.runtime.id}/persistent/`, '')
	    .replace(`chrome-extension://${chrome.runtime.id}/`, '');
	};

	/**
	 * Is valid url
	 *
	 * @param {String} str
	 */
	exports.isValidUrl = function (str) {
	  try {
	    new URL(str);
	    return true;
	  } catch (e) {
	    return false;
	  }
	};

	/**
	 * Safer version of path.join() that can also join url with path
	 * (lib from node-browserify remove second slash after protocol `http://abc` --> `http:/abc`)
	 */
	exports.join = function () {
	  return [].map.call(arguments, arg => exports.trimSlashes(arg)).join('/');
	};


/***/ }),
/* 9 */
/***/ (function(module, exports) {

	'use strict';

	var matchOperatorsRe = /[|\\{}()[\]^$+*?.]/g;

	module.exports = function (str) {
		if (typeof str !== 'string') {
			throw new TypeError('Expected a string');
		}

		return str.replace(matchOperatorsRe, '\\$&');
	};


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Setup browser action to open Autotester UI
	 */

	const smartUrlOpener = __webpack_require__(11);
	const constants = __webpack_require__(12);

	exports.setup = function () {
	  chrome.browserAction.onClicked.addListener(() => smartUrlOpener.open(constants.UI_URL));
	};


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Open urls via chrome api:
	 * - check existing tabs and activate instead of opening the same url
	 * - can listen <A> clicks and open system chrome:// urls
	 */

	const thenChrome = __webpack_require__(1);

	exports.open = function (url) {
	  thenChrome.tabs.query({})
	    .then(tabs => {
	      const tab = tabs.find(tab => tab.url === url);
	      return tab
	        ? thenChrome.tabs.update(tab.id, {active: true})
	        : thenChrome.tabs.create({url});
	    })
	};

	exports.listen = function () {
	  document.body.addEventListener('click', onClick);
	};

	exports.stop = function () {
	  document.body.removeEventListener('click', onClick);
	};

	function onClick(event) {
	  const target = event.target;
	  if (target.tagName === 'A' && target.href) {
	    event.preventDefault();
	    exports.open(target.href);
	  }
	}


/***/ }),
/* 12 */
/***/ (function(module, exports) {

	
	exports.UI_URL = chrome.runtime.getURL('core/ui/ui.html');


/***/ })
/******/ ]);