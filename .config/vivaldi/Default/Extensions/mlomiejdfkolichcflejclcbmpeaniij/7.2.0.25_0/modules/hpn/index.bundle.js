!function(e){function r(e,r,t){e in l||(l[e]={name:e,declarative:!0,deps:r,declare:t,normalizedDeps:r})}function t(e){return p[e]||(p[e]={name:e,dependencies:[],exports:{},importers:[]})}function n(r){if(!r.module){var o=r.module=t(r.name),a=r.module.exports,u=r.declare.call(e,function(e,r){if(o.locked=!0,"object"==typeof e)for(var t in e)a[t]=e[t];else a[e]=r;for(var n=0,u=o.importers.length;u>n;n++){var i=o.importers[n];if(!i.locked)for(var l=0;l<i.dependencies.length;++l)i.dependencies[l]===o&&i.setters[l](a)}return o.locked=!1,r},r.name);o.setters=u.setters,o.execute=u.execute;for(var s=0,d=r.normalizedDeps.length;d>s;s++){var f,c=r.normalizedDeps[s],v=l[c],m=p[c];m?f=m.exports:v&&!v.declarative?f=v.esModule:v?(n(v),m=v.module,f=m.exports):f=i(c),m&&m.importers?(m.importers.push(o),o.dependencies.push(m)):o.dependencies.push(null),o.setters[s]&&o.setters[s](f)}}}function o(r){var t={};if(("object"==typeof r||"function"==typeof r)&&r!==e)if(d)for(var n in r)"default"!==n&&a(t,r,n);else{var o=r&&r.hasOwnProperty;for(var n in r)"default"===n||o&&!r.hasOwnProperty(n)||(t[n]=r[n])}return t["default"]=r,c(t,"__useDefault",{value:!0}),t}function a(e,r,t){try{var n;(n=Object.getOwnPropertyDescriptor(r,t))&&c(e,t,n)}catch(o){return e[t]=r[t],!1}}function u(r,t){var n=l[r];if(n&&!n.evaluated&&n.declarative){t.push(r);for(var o=0,a=n.normalizedDeps.length;a>o;o++){var d=n.normalizedDeps[o];-1==s.call(t,d)&&(l[d]?u(d,t):i(d))}n.evaluated||(n.evaluated=!0,n.module.execute.call(e))}}function i(e){if(m[e])return m[e];if("@node/"==e.substr(0,6))return m[e]=o(v(e.substr(6)));var r=l[e];if(!r)throw"Module "+e+" not present.";return n(l[e]),u(e,[]),l[e]=void 0,r.declarative&&c(r.module.exports,"__esModule",{value:!0}),m[e]=r.declarative?r.module.exports:r.esModule}var l={},s=Array.prototype.indexOf||function(e){for(var r=0,t=this.length;t>r;r++)if(this[r]===e)return r;return-1},d=!0;try{Object.getOwnPropertyDescriptor({a:0},"a")}catch(f){d=!1}var c;!function(){try{Object.defineProperty({},"a",{})&&(c=Object.defineProperty)}catch(e){c=function(e,r,t){try{e[r]=t.value||t.get.call(e)}catch(n){}}}}();var p={},v="undefined"!=typeof System&&System._nodeRequire||"undefined"!=typeof require&&require.resolve&&"undefined"!=typeof process&&require,m={"@empty":{}};return function(e,t,n,a){return function(u){u(function(u){for(var l=0;l<t.length;l++)(function(e,r){r&&r.__esModule?m[e]=r:m[e]=o(r)})(t[l],arguments[l]);a({register:r});var s=i(e[0]);if(e.length>1)for(var l=1;l<e.length;l++)i(e[l]);return n?s["default"]:s})}}}("undefined"!=typeof self?self:global)

(["1"], [], false, function($__System) {
var require = this.require, exports = this.exports, module = this.module;
$__System.register('2', ['3'], function (_export) {
  'use strict';

  var events;
  return {
    setters: [function (_events) {
      events = _events['default'];
    }],
    execute: function () {
      _export('default', function (originalBackground) {
        var background = Object.assign({}, originalBackground);
        var bgInit = background.init;
        var bgUnload = background.unload;
        var bgEvents = background.events;

        // bind actions to background object
        Object.keys(background.actions || {}).forEach(function (action) {
          background.actions[action] = background.actions[action].bind(background);
        });

        background.init = function init() {
          for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          var promise = Promise.resolve(bgInit.apply(background, args));

          Object.keys(bgEvents || {}).forEach(function (event) {
            bgEvents[event] = bgEvents[event].bind(background);
            events.sub(event, bgEvents[event]);
          });
          return promise;
        };

        background.unload = function unload() {
          Object.keys(bgEvents || {}).forEach(function (event) {
            events.un_sub(event, bgEvents[event]);
          });

          for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
          }

          bgUnload.apply(background, args);
        };

        return background;
      });
    }
  };
});
$__System.register("4", [], function (_export) {
  "use strict";

  _export("isPlatformAtLeastInVersion", isPlatformAtLeastInVersion);

  function isPlatformAtLeastInVersion(version) {
    return true;
  }

  return {
    setters: [],
    execute: function () {
      _export("default", {
        isMobile: false,
        isFirefox: false,
        isChromium: true
      });
    }
  };
});
$__System.register('5', ['4'], function (_export) {
  'use strict';

  var platform, isFirefox, isMobile, isChromium, platformName;

  _export('notImplemented', notImplemented);

  function notImplemented() {
    throw new Error('Not implemented');
  }

  return {
    setters: [function (_platformPlatform) {
      platform = _platformPlatform['default'];

      _export('isPlatformAtLeastInVersion', _platformPlatform.isPlatformAtLeastInVersion);
    }],
    execute: function () {
      isFirefox = platform.isFirefox;

      _export('isFirefox', isFirefox);

      isMobile = platform.isMobile;

      _export('isMobile', isMobile);

      isChromium = platform.isChromium;

      _export('isChromium', isChromium);

      platformName = platform.platformName;

      _export('platformName', platformName);
    }
  };
});
$__System.register('6', [], function (_export) {
  // TODO: this entire file requires a rewrite from ground up
  'use strict';

  var CliqzChromeDB, _default;

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ('value' in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
      }
    }return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
  }();

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError('Cannot call a class as a function');
    }
  }

  return {
    setters: [],
    execute: function () {
      CliqzChromeDB = {
        VERSION: '0.1',
        set: function set(db, key, obj, callback) {
          var dbKey = db + ':' + key;
          var o = {};
          o[dbKey] = obj;
          chrome.storage.local.set(o, callback);
        },
        get: function get(db, keyValueOrFunction, callback) {

          if (typeof keyValueOrFunction === 'function') {

            chrome.storage.local.get(null, function (items) {
              var results = [];
              Object.keys(items).forEach(function (lab) {
                if (lab.startsWith(db)) {
                  if (keyValueOrFunction(items[lab])) results.push(items[lab]);
                }
              });
              callback(results);
            });
          } else {
            var dbKey = db + ':' + keyValueOrFunction;
            chrome.storage.local.get(dbKey, function (items) {
              callback(items[dbKey]);
            });
          }
        },
        remove: function remove(db, keyValueOrFunction, callback) {

          if (typeof keyValueOrFunction === 'function') {

            chrome.storage.local.get(null, function (items) {
              var resultsToBeRemoved = [];
              Object.keys(items).forEach(function (lab) {
                if (lab.startsWith(db)) {
                  if (keyValueOrFunction(items[lab])) {
                    var dbKey = db + ':' + lab;
                    resultsToBeRemoved.push(dbKey);
                  }
                }
              });

              chrome.storage.local.remove(resultsToBeRemoved, callback);
            });
          } else {
            var dbKey = db + ':' + keyValueOrFunction;
            chrome.storage.local.remove(dbKey, callback);
          }
        },
        size: function size(callback) {
          chrome.storage.local.getBytesInUse(null, function (a) {
            var res = [a, a / chrome.storage.local.QUOTA_BYTES];
            console.log('Current size: ', res[0], res[1]);
            if (callback) callback(res);
          });
        },
        removeEverything: function removeEverything() {
          chrome.storage.local.clear();
          CliqzChromeDB.size();
        }
      };

      _default = function () {
        function _default(CliqzSecureMessage) {
          _classCallCheck(this, _default);

          this.CliqzSecureMessage = CliqzSecureMessage;
        }

        _createClass(_default, [{
          key: 'close',
          value: function close() {}
        }, {
          key: 'saveRecord',
          value: function saveRecord(id, data) {
            CliqzChromeDB.set('hpn', id, data);
          }
        }, {
          key: 'loadRecord',
          value: function loadRecord(id) {
            var promise = new Promise(function (resolve, reject) {
              CliqzChromeDB.get('hpn', id, function (obj) {
                var res = [];
                if (obj) res.push(obj);
                resolve(res);
              });
            });
            return promise;
          }
        }, {
          key: 'saveKeys',
          value: function saveKeys(_data) {
            return new Promise(function (resolve, reject) {
              CliqzChromeDB.set('hpn', 'userKey', JSON.stringify(_data));
              resolve({ status: true, data: _data });
            });
          }
        }, {
          key: 'loadKeys',
          value: function loadKeys() {
            var _this = this;

            return new Promise(function (resolve, reject) {
              _this.loadRecord('userKey').then(function (data) {
                if (data.length === 0) {
                  resolve(null);
                } else {
                  try {
                    resolve(JSON.parse(data));
                  } catch (ee) {
                    resolve(null);
                  }
                }
              });
            });
          }
        }, {
          key: 'saveLocalCheckTable',
          value: function saveLocalCheckTable() {
            if (Object.keys(this.CliqzSecureMessage.localTemporalUniq).length > 0) {
              this.saveRecord('localTemporalUniq', JSON.stringify(this.CliqzSecureMessage.localTemporalUniq));
            }
          }
        }, {
          key: 'loadLocalCheckTable',
          value: function loadLocalCheckTable() {
            var _this2 = this;

            this.loadRecord('localTemporalUniq').then(function (res) {
              if (res.length > 0) {
                _this2.CliqzSecureMessage.localTemporalUniq = JSON.parse(res[0]);
              } else {
                _this2.CliqzSecureMessage.localTemporalUniq = {};
              }
            });
          }
        }]);

        return _default;
      }();

      _export('default', _default);
    }
  };
});
$__System.register("7", [], function (_export) {
  "use strict";

  return {
    setters: [],
    execute: function () {
      _export("default", {
        init: function init() {}
      });
    }
  };
});
$__System.register("8", ["9", "3", "7"], function (_export) {
  "use strict";

  var CliqzUtils, CliqzEvents, CliqzPromise;
  return {
    setters: [function (_utils) {
      CliqzUtils = _utils["default"];
    }, function (_events) {
      CliqzEvents = _events["default"];
    }, function (_platformHistoryManager) {
      _export("historyManager", _platformHistoryManager["default"]);
    }],
    execute: function () {
      CliqzPromise = CliqzUtils.Promise;

      _export("utils", CliqzUtils);

      _export("events", CliqzEvents);

      _export("Promise", CliqzPromise);
    }
  };
});
$__System.register('a', ['b'], function (_export) {
  'use strict';

  var chrome, Storage;

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ('value' in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
      }
    }return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
  }();

  function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];return arr2;
    } else {
      return Array.from(arr);
    }
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });
    } else {
      obj[key] = value;
    }return obj;
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError('Cannot call a class as a function');
    }
  }

  return {
    setters: [function (_globals) {
      chrome = _globals.chrome;
    }],
    execute: function () {
      Storage = function () {
        function Storage(filePath) {
          _classCallCheck(this, Storage);

          this.key = ['resource-loader'].concat(_toConsumableArray(filePath)).join(':');
        }

        _createClass(Storage, [{
          key: 'load',
          value: function load() {
            var _this = this;

            return new Promise(function (resolve, reject) {
              chrome.storage.local.get(_this.key, function (values) {
                var key = Object.keys(values);
                var value = values[key];
                if (value) {
                  resolve(value);
                } else {
                  reject('resource-loader: chrome storage has no value for key ' + _this.key);
                }
              });
            });
          }
        }, {
          key: 'save',
          value: function save(data) {
            var _this2 = this;

            return new Promise(function (resolve) {
              chrome.storage.local.set(_defineProperty({}, _this2.key, data), resolve);
            });
          }
        }]);

        return Storage;
      }();

      _export('default', Storage);
    }
  };
});
$__System.register('c', ['d', 'e', '8', 'a'], function (_export) {

  // Common durations
  'use strict';

  var config, console, utils, Storage, ONE_SECOND, ONE_MINUTE, ONE_HOUR, UpdateCallbackHandler, Resource, _default;

  var _get = function get(_x3, _x4, _x5) {
    var _again = true;_function: while (_again) {
      var object = _x3,
          property = _x4,
          receiver = _x5;_again = false;if (object === null) object = Function.prototype;var desc = Object.getOwnPropertyDescriptor(object, property);if (desc === undefined) {
        var parent = Object.getPrototypeOf(object);if (parent === null) {
          return undefined;
        } else {
          _x3 = parent;_x4 = property;_x5 = receiver;_again = true;desc = parent = undefined;continue _function;
        }
      } else if ('value' in desc) {
        return desc.value;
      } else {
        var getter = desc.get;if (getter === undefined) {
          return undefined;
        }return getter.call(receiver);
      }
    }
  };

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ('value' in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
      }
    }return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
  }();

  function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];return arr2;
    } else {
      return Array.from(arr);
    }
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== 'function' && superClass !== null) {
      throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass);
    }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError('Cannot call a class as a function');
    }
  }

  function get(url) {
    return new Promise(function (resolve, reject) {
      utils.httpGet(url, function (res) {
        resolve(res.response);
      }, reject, 10 * ONE_SECOND);
    });
  }

  /* Abstract away the pattern `onUpdate` trigger list of
   * callbacks. This pattern is used a lot, so it looks worth
   * it to create a base class to handle it.
   */
  return {
    setters: [function (_config) {
      config = _config['default'];
    }, function (_console) {
      console = _console['default'];
    }, function (_cliqz) {
      utils = _cliqz.utils;
    }, function (_platformResourceLoaderStorage) {
      Storage = _platformResourceLoaderStorage['default'];
    }],
    execute: function () {
      ONE_SECOND = 1000;
      ONE_MINUTE = 60 * ONE_SECOND;
      ONE_HOUR = 60 * ONE_MINUTE;

      UpdateCallbackHandler = function () {
        function UpdateCallbackHandler() {
          _classCallCheck(this, UpdateCallbackHandler);

          this.callbacks = [];
        }

        /* A resource is responsible for handling a remote resource persisted on
         * disk. It will be persisted on disk upon each update from remote. It is
         * also able to parse JSON automatically if `dataType` is 'json'.
         */

        _createClass(UpdateCallbackHandler, [{
          key: 'onUpdate',
          value: function onUpdate(callback) {
            this.callbacks.push(callback);
          }
        }, {
          key: 'triggerCallbacks',
          value: function triggerCallbacks(args) {
            return Promise.all(this.callbacks.map(function (cb) {
              return cb(args);
            }));
          }
        }]);

        return UpdateCallbackHandler;
      }();

      _export('UpdateCallbackHandler', UpdateCallbackHandler);

      Resource = function () {
        function Resource(name) {
          var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

          _classCallCheck(this, Resource);

          this.name = typeof name === 'string' ? [name] : name;
          this.remoteURL = options.remoteURL;
          this.dataType = options.dataType || 'json';
          this.filePath = ['cliqz'].concat(_toConsumableArray(this.name));
          this.chromeURL = options.chromeURL || '' + config.baseURL + this.name.join('/');
          this.storage = new Storage(this.filePath);
        }

        /**
         * Loads the resource. Load either a cached version of the file available in
         * the profile, or at the chrome URL (if provided) or from remote.
         *
         * @returns a Promise resolving to the resource. This Promise can fail on
         * error (if the remote resource cannot be fetched, or if the parsing
         * fails, for example), thus **you should should add a _catch_** to this
         * promise to handle errors properly.
         */

        _createClass(Resource, [{
          key: 'load',
          value: function load() {
            var _this = this;

            return this.storage.load().then(function (data) {
              try {
                // If TextDecoder is not available just use `data`
                return new TextDecoder().decode(data);
              } catch (e) {
                return data;
              }
            }).then(function (data) {
              return _this.parseData(data);
            })['catch'](function () {
              return _this.updateFromURL(_this.chromeURL);
            })['catch'](function () {
              return _this.updateFromRemote();
            });
          }

          /**
           * Tries to update the resource from the `remoteURL`.
           *
           * @returns a Promise resolving to the updated resource. Similarly
           * to the `load` method, the promise can fail, and thus you should
           * had a **catch** close to your promise to handle any exception.
           */
        }, {
          key: 'updateFromRemote',
          value: function updateFromRemote() {
            if (this.remoteURL === undefined) {
              return Promise.reject('updateFromRemote: remoteURL is undefined');
            }
            return this.updateFromURL(this.remoteURL);
          }

          /* *****************************************************************
           * Private API
           ******************************************************************/

        }, {
          key: 'updateFromURL',
          value: function updateFromURL(url) {
            if (url) {
              return get(url).then(this.persist.bind(this));
            }

            return Promise.reject('updateFromURL: url is undefined');
          }
        }, {
          key: 'persist',
          value: function persist(data) {
            var _this2 = this;

            return this.parseData(data).then(function (parsed) {
              return _this2.storage.save(data)['catch'](function (e) {
                return console.error('resource-loader error on persist: ', e);
              }).then(function () {
                return parsed;
              });
            });
          }
        }, {
          key: 'parseData',
          value: function parseData(data) {
            if (this.dataType === 'json') {
              try {
                var parsed = JSON.parse(data);
                return Promise.resolve(parsed);
              } catch (e) {
                return Promise.reject('parseData: failed with exception ' + e);
              }
            }

            return Promise.resolve(data);
          }
        }]);

        return Resource;
      }();

      _export('Resource', Resource);

      _default = function (_UpdateCallbackHandler) {
        _inherits(_default, _UpdateCallbackHandler);

        function _default(resourceName) {
          var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

          _classCallCheck(this, _default);

          _get(Object.getPrototypeOf(_default.prototype), 'constructor', this).call(this);

          this.resource = new Resource(resourceName, options);
          this.cron = options.cron || ONE_HOUR;
          this.updateInterval = options.updateInterval || 10 * ONE_MINUTE;
          this.intervalTimer = utils.setInterval(this.updateFromRemote.bind(this), this.updateInterval);
        }

        /**
         * Loads the resource hold by `this.resource`. This can return
         * a failed promise. Please read `Resource.load` doc string for
         * further information.
         */

        _createClass(_default, [{
          key: 'load',
          value: function load() {
            return this.resource.load();
          }

          /**
           * Updates the resource from remote (maximum one time per `cron`
           * time frame).
           *
           * @returns a Promise which never fails, since this update will be
           * triggered by `setInterval` and thus you cannot catch. If the update
           * fails, then the callback won't be called.
           */
        }, {
          key: 'updateFromRemote',
          value: function updateFromRemote() {
            var pref = 'resource-loader.lastUpdates.' + this.resource.name.join('/');
            var lastUpdate = Number(utils.getPref(pref, 0));
            var currentTime = Date.now();

            if (currentTime > this.cron + lastUpdate) {
              return this.resource.updateFromRemote().then(function (data) {
                utils.setPref(pref, String(Date.now()));
                return data;
              }).then(this.triggerCallbacks.bind(this))['catch'](function () {
                return undefined;
              });
            }
            return Promise.resolve();
          }
        }, {
          key: 'stop',
          value: function stop() {
            utils.clearInterval(this.intervalTimer);
          }
        }]);

        return _default;
      }(UpdateCallbackHandler);

      _export('default', _default);
    }
  };
});
$__System.register('f', ['10', '11'], function (_export) {

  // Using this function it is easier to see if the push of message failed.
  'use strict';

  var CliqzSecureMessage, CryptoWorker, sendMessage;

  _export('sendM', sendM);

  /*
  This will send the messages inside the trk one at a time. This uses a generator expression.
  
  Will return a Promise which resolves to an array, one for each sent message:
  its value will be null if everything was ok,
  and a string indicating the error message otherwise (useful for testing)
  */

  function sendM(m) {
    var sent = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

    var sendMessageWCrypto = new CryptoWorker();
    sendMessage(sendMessageWCrypto, m);

    sendMessageWCrypto.onmessage = function (e) {
      if (e.data.type === 'telemetry') {
        CliqzSecureMessage.localTemporalUniq = e.data.localTemporalUniq;
        CliqzSecureMessage.storage.saveLocalCheckTable();
      }

      var nextMsg = CliqzSecureMessage.nextMessage();
      if (nextMsg) {
        sendMessage(sendMessageWCrypto, nextMsg);
      } else {
        // Queue is empty hence dump the local temp queue to disk.
        CliqzSecureMessage.storage.saveLocalCheckTable();
        sendMessageWCrypto.terminate();
        return sent;
      }
    };
  }

  return {
    setters: [function (_main) {
      CliqzSecureMessage = _main['default'];
    }, function (_cryptoWorker) {
      CryptoWorker = _cryptoWorker['default'];
    }],
    execute: function () {
      sendMessage = function sendMessage(ww, m) {
        try {
          ww.postMessage({
            msg: m,
            type: 'telemetry',
            sourcemap: CliqzSecureMessage.sourceMap,
            upk: CliqzSecureMessage.uPK,
            dspk: CliqzSecureMessage.dsPK,
            sspk: CliqzSecureMessage.secureLogger,
            routetable: CliqzSecureMessage.routeTable,
            localTemporalUniq: CliqzSecureMessage.localTemporalUniq
          });
        } catch (e) {}
      };

      ;
    }
  };
});
$__System.register('12', ['9', '13', '10'], function (_export) {
  'use strict';

  var utils, http, CliqzSecureMessage, OFFER_TELEMETRY, proxyHttpHandler;

  _export('overRideCliqzResults', overRideCliqzResults);

  function overRideCliqzResults() {
    if (utils.getPref('proxyNetwork', true) === false) return;

    if (!proxyHttpHandler) proxyHttpHandler = http.defaultHttpHandler;

    function httpHandler(method, url, callback, onerror, timeout, data, sync) {
      if (url.startsWith(utils.RESULTS_PROVIDER) && utils.getPref('hpn-queryv2', false)) {
        var query = url.replace(utils.RESULTS_PROVIDER, '');
        var uid = Math.floor(Math.random() * 10000000);
        CliqzSecureMessage.queriesID[uid] = callback;
        CliqzSecureMessage.wCrypto.postMessage({
          msg: { action: 'instant',
            type: 'cliqz',
            ts: '',
            ver: '1.5',
            payload: query,
            rp: utils.RESULTS_PROVIDER
          },
          uid: uid,
          type: 'instant',
          sourcemap: CliqzSecureMessage.sourceMap,
          upk: CliqzSecureMessage.uPK,
          dspk: CliqzSecureMessage.dsPK,
          sspk: CliqzSecureMessage.secureLogger,
          queryproxyip: CliqzSecureMessage.queryProxyIP
        });
        return null;
      } else if (url.startsWith(utils.RESULTS_PROVIDER_LOG)) {
        var query = url.replace(utils.RESULTS_PROVIDER_LOG, '');
        var uid = Math.floor(Math.random() * 10000000);
        CliqzSecureMessage.queriesID[uid] = callback;
        CliqzSecureMessage.wCrypto.postMessage({
          msg: { action: 'extension-result-telemetry',
            type: 'cliqz',
            ts: '',
            ver: '1.5',
            payload: query
          },
          uid: uid,
          type: 'instant',
          sourcemap: CliqzSecureMessage.sourceMap,
          upk: CliqzSecureMessage.uPK,
          dspk: CliqzSecureMessage.dsPK,
          sspk: CliqzSecureMessage.secureLogger,
          queryproxyip: CliqzSecureMessage.queryProxyIP
        });
        return null;
      } else if (url === utils.SAFE_BROWSING) {
        var batch = JSON.parse(data);
        if (batch.length > 0) {
          batch.forEach(function (eachMsg) {
            CliqzSecureMessage.telemetry(eachMsg);
          });
        }
        callback && callback({ 'response': '{"success":true}' });
      } else if (url === OFFER_TELEMETRY) {
        var batch = JSON.parse(data);
        CliqzSecureMessage.telemetry(batch);
        callback && callback({ 'response': '{"success":true}' });
      } else {
        return proxyHttpHandler.apply(undefined, arguments);
      }
      return null;
    };

    http.overrideHttpHandler(httpHandler);
    http.addCompressionExclusion(utils.SAFE_BROWSING);
  }

  return {
    setters: [function (_coreUtils) {
      utils = _coreUtils['default'];
    }, function (_coreHttp) {
      http = _coreHttp;
    }, function (_main) {
      CliqzSecureMessage = _main['default'];
    }],
    execute: function () {
      OFFER_TELEMETRY = 'https://offers-api.cliqz.com/api/v1/savesignal';
      proxyHttpHandler = null;
    }
  };
});
$__System.register("14", [], function (_export) {
  "use strict";

  var _default;

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
      }
    }return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
  }();

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [],
    execute: function () {
      _default = function () {
        function _default() {
          var _ref = arguments.length <= 0 || arguments[0] === undefined ? { position: 0 } : arguments[0];

          var position = _ref.position;

          _classCallCheck(this, _default);
        }

        _createClass(_default, [{
          key: "init",
          value: function init() {}

          /**
           * Disable all proxy rules provided by this instance
           * @method destroy
           */
        }, {
          key: "unload",
          value: function unload() {}

          // TODO: add documentation
        }, {
          key: "newProxy",
          value: function newProxy() {}

          /**
           * Firefox proxy API entry point - called on new http(s) connection.
           * @method applyFilter
           * @param pps
           * @param url {string}
           * @param defaultProxy
           * @returns aProxy
           */
        }, {
          key: "applyFilter",
          value: function applyFilter(pps, url, defaultProxy) {}
        }]);

        return _default;
      }();

      _export("default", _default);
    }
  };
});
$__System.register("b", [], function (_export) {
  /* global chrome, window */
  "use strict";

  return {
    setters: [],
    execute: function () {
      _export("chrome", chrome);

      _export("window", window);
    }
  };
});
$__System.register('15', ['b'], function (_export) {
  'use strict';

  var window;
  return {
    setters: [function (_globals) {
      window = _globals.window;
    }],
    execute: function () {
      _export('default', window.console);
    }
  };
});
$__System.register("16", ["e", "17", "18", "9"], function (_export) {
  "use strict";

  var console, prefs, Storage, CliqzUtils, eventIDs, port, CLIQZEnvironment, CE;
  return {
    setters: [function (_coreConsole) {
      console = _coreConsole["default"];
    }, function (_corePrefs) {
      prefs = _corePrefs["default"];
    }, function (_coreStorage) {
      Storage = _coreStorage["default"];
    }, function (_coreUtils) {
      CliqzUtils = _coreUtils["default"];
    }],
    execute: function () {
      eventIDs = {};
      port = chrome.runtime.connect({ name: "encrypted-query" });

      port.onMessage.addListener(function (response) {
        var cb = eventIDs[response.eID].cb;
        delete eventIDs[response.eID];
        cb && cb(response.data);
      });

      CLIQZEnvironment = {
        SKIN_PATH: 'modules/static/skin/',
        RESULTS_PROVIDER: 'https://api.cliqz.com/api/v2/results?nrh=1&q=',
        RICH_HEADER: 'https://api.cliqz.com/api/v2/rich-header?path=/v2/map',
        LOG: 'https://stats.cliqz.com',
        BRANDS_DATA_URL: 'static/brands_database.json',
        TEMPLATES_PATH: 'modules/static/templates/',
        LOCALE_PATH: 'modules/static/locale/',
        RERANKERS: [],
        RESULTS_TIMEOUT: 1000, // 1 second
        TEMPLATES: { 'calculator': 1, 'clustering': 1, 'currency': 1, 'custom': 1, 'emphasis': 1, 'empty': 1,
          'generic': 1, /*'images_beta': 1,*/'main': 1, 'results': 1, 'text': 1, 'series': 1,
          'spellcheck': 1,
          'pattern-h1': 3, 'pattern-h2': 2, 'pattern-h3': 1, 'pattern-h3-cluster': 1,
          'pattern-hm': 1,
          'topsites': 3,
          'celebrities': 2, 'Cliqz': 2, 'entity-generic': 2, 'noResult': 3, 'weatherAlert': 3, 'entity-news-1': 3, 'entity-video-1': 3,
          'flightStatusEZ-2': 2, 'weatherEZ': 2,
          'news': 1, 'people': 1, 'video': 1, 'hq': 1,
          'ligaEZ1Game': 2,
          'ligaEZTable': 3,
          'rd-h3-w-rating': 1,
          'vod': 3,
          'movie-vod': 3,
          'liveTicker': 3
        },
        MESSAGE_TEMPLATES: ['footer-message', 'onboarding-callout', 'onboarding-callout-extended', 'slow_connection', 'partials/location/missing_location_2', 'partials/location/no-locale-data'],
        PARTIALS: ['url', 'logo', 'EZ-category', 'partials/ez-title', 'partials/ez-url', 'partials/ez-history', 'partials/ez-description', 'partials/ez-generic-buttons', 'EZ-history', 'rd-h3-w-rating', 'pcgame_movie_side_snippet', 'partials/location/local-data', 'partials/location/missing_location_1', 'partials/timetable-cinema', 'partials/timetable-movie', 'partials/bottom-data-sc', 'partials/download', 'partials/streaming', 'partials/lyrics'],
        trk: [],
        telemetry: function () {
          var trkTimer = null,
              telemetrySending = [],
              TELEMETRY_MAX_SIZE = 500;

          function pushTelemetry() {
            // put current data aside in case of failure
            telemetrySending = CE.trk.slice(0);
            CE.trk = [];

            CliqzUtils.httpPost(CE.LOG, pushTelemetryCallback, JSON.stringify(telemetrySending), pushTelemetryError, 10000);

            console.log('Telemetry', 'push telemetry data: ' + telemetrySending.length + ' elements');
          }

          function pushTelemetryCallback(req) {
            var response = JSON.parse(req.response);

            if (response.new_session) {
              prefs.set('session', response.new_session);
            }
            telemetrySending = [];
          }

          function pushTelemetryError(req) {
            // pushTelemetry failed, put data back in queue to be sent again later
            console.log('Telemetry', 'push telemetry failed: ' + telemetrySending.length + ' elements');
            CE.trk = telemetrySending.concat(CE.trk);

            // Remove some old entries if too many are stored, to prevent unbounded growth when problems with network.
            var slice_pos = CE.trk.length - TELEMETRY_MAX_SIZE + 100;
            if (slice_pos > 0) {
              console.log('Telemetry', 'discarding ' + slice_pos + ' old telemetry data');
              CE.trk = CE.trk.slice(slice_pos);
            }

            telemetrySending = [];
          }

          return function (msg, instantPush) {
            if (msg.type != 'environment' && CLIQZEnvironment.isPrivate()) return;
            console.log('Utils.telemetry', msg);
            msg.session = prefs.get('session');
            msg.ts = Date.now();

            CE.trk.push(msg);
            CE.clearTimeout(trkTimer);

            if (instantPush || CE.trk.length % 100 == 0) {
              pushTelemetry();
            } else {
              trkTimer = CE.setTimeout(pushTelemetry, 60000);
            }
          };
        }(),

        isUnknownTemplate: function isUnknownTemplate(template) {
          // in case an unknown template is required
          return template && !CE.TEMPLATES[template];
        },
        getBrandsDBUrl: function getBrandsDBUrl(version) {
          return 'https://cdn.cliqz.com/brands-database/database/' + version + '/data/database.json';
        },
        setInterval: function (_setInterval) {
          function setInterval() {
            return _setInterval.apply(this, arguments);
          }

          setInterval.toString = function () {
            return _setInterval.toString();
          };

          return setInterval;
        }(function () {
          return setInterval.apply(null, arguments);
        }),
        setTimeout: function (_setTimeout) {
          function setTimeout() {
            return _setTimeout.apply(this, arguments);
          }

          setTimeout.toString = function () {
            return _setTimeout.toString();
          };

          return setTimeout;
        }(function () {
          return setTimeout.apply(null, arguments);
        }),
        clearTimeout: function (_clearTimeout) {
          function clearTimeout() {
            return _clearTimeout.apply(this, arguments);
          }

          clearTimeout.toString = function () {
            return _clearTimeout.toString();
          };

          return clearTimeout;
        }(function () {
          clearTimeout.apply(null, arguments);
        }),
        Promise: Promise,
        OS: 'chromium',
        isPrivate: function isPrivate() {
          return chrome.extension.inIncognitoContext;
        },
        isOnPrivateTab: function isOnPrivateTab(win) {
          return CE.isPrivate();
        },
        getWindow: function getWindow() {
          return { document: { getElementById: function getElementById() {} } };
        },

        historySearch: function historySearch(q, callback, searchParam) {
          function matchTypeToStyle(type) {
            if (!type) return 'favicon';
            type = type.toLowerCase();
            if (type.startsWith('history')) return 'favicon';
            return type;
          }

          chrome.cliqzSearchPrivate.queryHistory(q, function (query, matches, finished) {
            var res = matches.map(function (match) {
              return {
                value: match.url,
                comment: match.description,
                style: matchTypeToStyle(match.provider_type),
                image: '',
                label: ''
              };
            });
            callback({
              query: query,
              results: res,
              ready: true
            });
          });
        },

        openLink: function openLink(win, url, newTab) {
          chrome.cliqzSearchPrivate.navigate(url, !!newTab);
        },

        copyResult: function copyResult(val) {
          var backup = document.oncopy;
          try {
            document.oncopy = function (event) {
              event.clipboardData.setData("text/plain", val);
              event.preventDefault();
            };
            document.execCommand("copy", false, null);
          } finally {
            document.oncopy = backup;
          }
        },
        // debug
        _ENGINES: [{
          "name": "CLIQZ dummy search", "alias": "#qq", "default": true, "icon": "", "searchForm": "https://www.cliqz.com/?q={searchTerms}", "suggestionUrl": "", "base_url": "https://www.cliqz.com/search?q=", "prefix": "#qq", "code": 3
        }],
        getSearchEngines: function getSearchEngines() {
          return CE._ENGINES.map(function (e) {
            e.getSubmissionForQuery = function (q) {
              //TODO: create the correct search URL
              return e.searchForm.replace("{searchTerms}", q);
            };

            e.getSuggestionUrlForQuery = function (q) {
              //TODO: create the correct search URL
              return e.suggestionUrl.replace("{searchTerms}", q);
            };

            return e;
          });
        },
        updateAlias: function updateAlias() {},
        getEngineByAlias: function getEngineByAlias(alias) {
          return CE._ENGINES.find(function (engine) {
            return engine.alias === alias;
          });
        },
        getEngineByName: function getEngineByName(name) {
          return CE._ENGINES.find(function (engine) {
            return engine.name === name;
          });
        },
        getNoResults: function getNoResults(q) {
          var engines = CE.getSearchEngines().map(function (e) {
            e.style = CE.getLogoDetails(CE.getDetailsFromUrl(e.searchForm)).style;
            e.text = e.alias.slice(1);
            return e;
          });
          var defaultName = CE.getDefaultSearchEngine().name,
              isUrl = CliqzUtils.isUrl(q);

          return CE.Result.cliqz({
            template: 'noResult',
            snippet: {
              text_line1: CE.getLocalizedString(isUrl ? 'noResultUrlNavigate' : 'noResultTitle'),
              // forwarding the query to the default search engine is not handled by CLIQZ but by Firefox
              // we should take care of this specific case differently on alternative platforms
              text_line2: isUrl ? CE.getLocalizedString('noResultUrlSearch') : CE.getLocalizedString('noResultMessage', defaultName),
              "search_engines": engines,
              //use local image in case of no internet connection
              "cliqz_logo": CE.SKIN_PATH + "img/cliqz.svg"
            },
            type: 'rh',
            subType: { empty: true }
          });
        },
        setDefaultSearchEngine: function setDefaultSearchEngine(engine) {
          var storage = new Storage();
          storage.setObject('defaultSearchEngine', engine);
        },
        getDefaultSearchEngine: function getDefaultSearchEngine() {
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = CE.getSearchEngines()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var e = _step.value;

              if (e["default"]) return e;
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator["return"]) {
                _iterator["return"]();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }
        },
        onRenderComplete: function onRenderComplete(query, allUrls) {
          chrome.cliqzSearchPrivate.processResults(query, allUrls);
        },
        onResultSelectionChange: function onResultSelectionChange(position) {
          chrome.cliqzSearchPrivate.onResultSelectionChange(position);
        },
        setSupportInfo: function setSupportInfo() {}
      };
      CE = CLIQZEnvironment;
      // Shorthand alias.

      _export("default", CLIQZEnvironment);
    }
  };
});
$__System.register('19', [], function (_export) {
  /* global localStorage */
  'use strict';

  return {
    setters: [],
    execute: function () {
      _export('default', function (url) {
        if (url) {
          throw new Error('localStorage for URL is not supported');
        }
        return localStorage;
      });
    }
  };
});
$__System.register('18', ['19'], function (_export) {

  /**
  * @namespace core
  */
  'use strict';

  var getStorage, Storage;

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ('value' in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
      }
    }return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
  }();

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError('Cannot call a class as a function');
    }
  }

  return {
    setters: [function (_platformStorage) {
      getStorage = _platformStorage['default'];
    }],
    execute: function () {
      Storage = function () {
        function Storage(url) {
          _classCallCheck(this, Storage);

          // if not called as constructor, still act as one
          if (!(this instanceof Storage)) {
            return new Storage(url);
          }

          this.storage = getStorage.bind(null, url);
          this.url = url;
        }

        _createClass(Storage, [{
          key: 'getItem',
          value: function getItem(key) {
            return this.storage().getItem(key);
          }
        }, {
          key: 'setItem',
          value: function setItem(key, value) {
            return this.storage().setItem(key, value);
          }
        }, {
          key: 'removeItem',
          value: function removeItem(key) {
            return this.storage().removeItem(key);
          }
        }, {
          key: 'clear',
          value: function clear() {
            return this.storage().clear();
          }

          /**
           * @method setObject
           * @param key {string}
           * @param object
           */
        }, {
          key: 'setObject',
          value: function setObject(key, object) {
            this.storage().setItem(key, JSON.stringify(object));
          }

          /**
           * @method getObject
           * @param key {string}
           * @param notFound {Boolean}
           */
        }, {
          key: 'getObject',
          value: function getObject(key) {
            var notFound = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

            var o = this.storage().getItem(key);
            if (o) {
              return JSON.parse(o);
            }
            return notFound;
          }
        }]);

        return Storage;
      }();

      _export('default', Storage);
    }
  };
});
$__System.register('1a', [], function (_export) {
  // TLD list extracted from http://www.iana.org/domains/root/db,
  // cc stands fro country code, the other are generic
  'use strict';

  var TLDs;
  return {
    setters: [],
    execute: function () {
      TLDs = { gw: 'cc', gu: 'cc', gt: 'cc', gs: 'cc', gr: 'cc', gq: 'cc', gp: 'cc', dance: 'na', tienda: 'na', gy: 'cc', gg: 'cc', gf: 'cc', ge: 'cc', gd: 'cc', gb: 'cc', ga: 'cc', edu: 'na', gn: 'cc', gm: 'cc', gl: 'cc', '公司': 'na', gi: 'cc', gh: 'cc', tz: 'cc', zone: 'na', tv: 'cc', tw: 'cc', tt: 'cc', immobilien: 'na', tr: 'cc', tp: 'cc', tn: 'cc', to: 'cc', tl: 'cc', bike: 'na', tj: 'cc', tk: 'cc', th: 'cc', tf: 'cc', tg: 'cc', td: 'cc', tc: 'cc', coop: 'na', 'онлайн': 'na', cool: 'na', ro: 'cc', vu: 'cc', democrat: 'na', guitars: 'na', qpon: 'na', 'срб': 'cc', zm: 'cc', tel: 'na', futbol: 'na', za: 'cc', 'بازار': 'na', 'рф': 'cc', zw: 'cc', blue: 'na', mu: 'cc', 'ไทย': 'cc', asia: 'na', marketing: 'na', '测试': 'na', international: 'na', net: 'na', '新加坡': 'cc', okinawa: 'na', 'பரிட்சை': 'na', 'טעסט': 'na', '삼성': 'na', sexy: 'na', institute: 'na', '台灣': 'cc', pics: 'na', '公益': 'na', '机构': 'na', social: 'na', domains: 'na', '香港': 'cc', '集团': 'na', limo: 'na', 'мон': 'cc', tools: 'na', nagoya: 'na', properties: 'na', camera: 'na', today: 'na', club: 'na', company: 'na', glass: 'na', berlin: 'na', me: 'cc', md: 'cc', mg: 'cc', mf: 'cc', ma: 'cc', mc: 'cc', tokyo: 'na', mm: 'cc', ml: 'cc', mo: 'cc', mn: 'cc', mh: 'cc', mk: 'cc', cat: 'na', reviews: 'na', mt: 'cc', mw: 'cc', mv: 'cc', mq: 'cc', mp: 'cc', ms: 'cc', mr: 'cc', cab: 'na', my: 'cc', mx: 'cc', mz: 'cc', 'இலங்கை': 'cc', wang: 'na', estate: 'na', clothing: 'na', monash: 'na', guru: 'na', technology: 'na', travel: 'na', 'テスト': 'na', pink: 'na', fr: 'cc', '테스트': 'na', farm: 'na', lighting: 'na', fi: 'cc', fj: 'cc', fk: 'cc', fm: 'cc', fo: 'cc', sz: 'cc', kaufen: 'na', sx: 'cc', ss: 'cc', sr: 'cc', sv: 'cc', su: 'cc', st: 'cc', sk: 'cc', sj: 'cc', si: 'cc', sh: 'cc', so: 'cc', sn: 'cc', sm: 'cc', sl: 'cc', sc: 'cc', sb: 'cc', rentals: 'na', sg: 'cc', se: 'cc', sd: 'cc', '组织机构': 'na', shoes: 'na', '中國': 'cc', industries: 'na', lb: 'cc', lc: 'cc', la: 'cc', lk: 'cc', li: 'cc', lv: 'cc', lt: 'cc', lu: 'cc', lr: 'cc', ls: 'cc', holiday: 'na', ly: 'cc', coffee: 'na', ceo: 'na', '在线': 'na', ye: 'cc', 'إختبار': 'na', ninja: 'na', yt: 'cc', name: 'na', moda: 'na', eh: 'cc', 'بھارت': 'cc', ee: 'cc', house: 'na', eg: 'cc', ec: 'cc', vote: 'na', eu: 'cc', et: 'cc', es: 'cc', er: 'cc', ru: 'cc', rw: 'cc', 'ભારત': 'cc', rs: 'cc', boutique: 'na', re: 'cc', 'سورية': 'cc', gov: 'na', 'орг': 'na', red: 'na', foundation: 'na', pub: 'na', vacations: 'na', org: 'na', training: 'na', recipes: 'na', 'испытание': 'na', '中文网': 'na', support: 'na', onl: 'na', '中信': 'na', voto: 'na', florist: 'na', 'ලංකා': 'cc', 'қаз': 'cc', management: 'na', 'مصر': 'cc', 'آزمایشی': 'na', kiwi: 'na', academy: 'na', sy: 'cc', cards: 'na', 'संगठन': 'na', pro: 'na', kred: 'na', sa: 'cc', mil: 'na', '我爱你': 'na', agency: 'na', 'みんな': 'na', equipment: 'na', mango: 'na', luxury: 'na', villas: 'na', '政务': 'na', singles: 'na', systems: 'na', plumbing: 'na', 'δοκιμή': 'na', 'تونس': 'cc', 'پاکستان': 'cc', gallery: 'na', kg: 'cc', ke: 'cc', 'বাংলা': 'cc', ki: 'cc', kh: 'cc', kn: 'cc', km: 'cc', kr: 'cc', kp: 'cc', kw: 'cc', link: 'na', ky: 'cc', voting: 'na', cruises: 'na', 'عمان': 'cc', cheap: 'na', solutions: 'na', '測試': 'na', neustar: 'na', partners: 'na', 'இந்தியா': 'cc', menu: 'na', arpa: 'na', flights: 'na', rich: 'na', 'do': 'cc', dm: 'cc', dj: 'cc', dk: 'cc', photography: 'na', de: 'cc', watch: 'na', dz: 'cc', supplies: 'na', report: 'na', tips: 'na', 'გე': 'cc', bar: 'na', qa: 'cc', shiksha: 'na', 'укр': 'cc', vision: 'na', wiki: 'na', 'قطر': 'cc', '한국': 'cc', computer: 'na', best: 'na', voyage: 'na', expert: 'na', diamonds: 'na', email: 'na', wf: 'cc', jobs: 'na', bargains: 'na', '移动': 'na', jp: 'cc', jm: 'cc', jo: 'cc', ws: 'cc', je: 'cc', kitchen: 'na', 'ਭਾਰਤ': 'cc', 'ایران': 'cc', ua: 'cc', buzz: 'na', com: 'na', uno: 'na', ck: 'cc', ci: 'cc', ch: 'cc', co: 'cc', cn: 'cc', cm: 'cc', cl: 'cc', cc: 'cc', ca: 'cc', cg: 'cc', cf: 'cc', community: 'na', cd: 'cc', cz: 'cc', cy: 'cc', cx: 'cc', cr: 'cc', cw: 'cc', cv: 'cc', cu: 'cc', pr: 'cc', ps: 'cc', pw: 'cc', pt: 'cc', holdings: 'na', wien: 'na', py: 'cc', ai: 'cc', pa: 'cc', pf: 'cc', pg: 'cc', pe: 'cc', pk: 'cc', ph: 'cc', pn: 'cc', pl: 'cc', pm: 'cc', '台湾': 'cc', aero: 'na', catering: 'na', photos: 'na', 'परीक्षा': 'na', graphics: 'na', 'فلسطين': 'cc', 'ভারত': 'cc', ventures: 'na', va: 'cc', vc: 'cc', ve: 'cc', vg: 'cc', iq: 'cc', vi: 'cc', is: 'cc', ir: 'cc', it: 'cc', vn: 'cc', im: 'cc', il: 'cc', io: 'cc', 'in': 'cc', ie: 'cc', id: 'cc', tattoo: 'na', education: 'na', parts: 'na', events: 'na', 'భారత్': 'cc', cleaning: 'na', kim: 'na', contractors: 'na', mobi: 'na', center: 'na', photo: 'na', nf: 'cc', 'مليسيا': 'cc', wed: 'na', supply: 'na', '网络': 'na', 'сайт': 'na', careers: 'na', build: 'na', 'الاردن': 'cc', bid: 'na', biz: 'na', 'السعودية': 'cc', gift: 'na', 'дети': 'na', works: 'na', '游戏': 'na', tm: 'cc', exposed: 'na', productions: 'na', koeln: 'na', dating: 'na', christmas: 'na', bd: 'cc', be: 'cc', bf: 'cc', bg: 'cc', ba: 'cc', bb: 'cc', bl: 'cc', bm: 'cc', bn: 'cc', bo: 'cc', bh: 'cc', bi: 'cc', bj: 'cc', bt: 'cc', bv: 'cc', bw: 'cc', bq: 'cc', br: 'cc', bs: 'cc', post: 'na', by: 'cc', bz: 'cc', om: 'cc', ruhr: 'na', 'امارات': 'cc', repair: 'na', xyz: 'na', 'شبكة': 'na', viajes: 'na', museum: 'na', fish: 'na', 'الجزائر': 'cc', hr: 'cc', ht: 'cc', hu: 'cc', hk: 'cc', construction: 'na', hn: 'cc', solar: 'na', hm: 'cc', info: 'na', 'சிங்கப்பூர்': 'cc', uy: 'cc', uz: 'cc', us: 'cc', um: 'cc', uk: 'cc', ug: 'cc', builders: 'na', ac: 'cc', camp: 'na', ae: 'cc', ad: 'cc', ag: 'cc', af: 'cc', int: 'na', am: 'cc', al: 'cc', ao: 'cc', an: 'cc', aq: 'cc', as: 'cc', ar: 'cc', au: 'cc', at: 'cc', aw: 'cc', ax: 'cc', az: 'cc', ni: 'cc', codes: 'na', nl: 'cc', no: 'cc', na: 'cc', nc: 'cc', ne: 'cc', actor: 'na', ng: 'cc', 'भारत': 'cc', nz: 'cc', 'سودان': 'cc', np: 'cc', nr: 'cc', nu: 'cc', xxx: 'na', '世界': 'na', kz: 'cc', enterprises: 'na', land: 'na', 'المغرب': 'cc', '中国': 'cc', directory: 'na' };

      _export('TLDs', TLDs);
    }
  };
});
$__System.register("1b", [], function (_export) {
  "use strict";

  return {
    setters: [],
    execute: function () {
      _export("default", fetch);

      _export("fetch", fetch);

      _export("Headers", Headers);

      _export("Request", Request);

      _export("Response", Response);
    }
  };
});
$__System.register("1c", [], function (_export) {
  "use strict";

  function setPrivateFlags() {}
  function setBackgroundRequest() {}
  function XMLHttpRequestFactory() {
    return XMLHttpRequest;
  }

  return {
    setters: [],
    execute: function () {
      _export("XMLHttpRequestFactory", XMLHttpRequestFactory);

      _export("setPrivateFlags", setPrivateFlags);

      _export("setBackgroundRequest", setBackgroundRequest);
    }
  };
});
$__System.register("1d", [], function (_export) {
  "use strict";

  var chromeUrlHandler;
  return {
    setters: [],
    execute: function () {
      chromeUrlHandler = false;

      _export("chromeUrlHandler", chromeUrlHandler);
    }
  };
});
$__System.register('13', ['1b', 'e', '1e', '1c', '1d'], function (_export) {
  'use strict';

  var ftch, console, compress, XMLHttpRequestFactory, setPrivateFlags, setBackgroundRequest, chromeUrlHandler, fetch, Headers, Request, Response, activeHandler, compressionAvailable, compressionExclusions;

  _export('defaultHttpHandler', defaultHttpHandler);

  /**
   *  Replace default http handler with fn
   */

  _export('httpHandler', httpHandler);

  _export('overrideHttpHandler', overrideHttpHandler);

  _export('addCompressionExclusion', addCompressionExclusion);

  _export('promiseHttpHandler', promiseHttpHandler);

  /** Legacy httpHandler implementation, based on XMLHttpRequest.
   *
   *  If you want to make HTTP requests, please check out the fetch API (platform/fetch)
   */

  function defaultHttpHandler(method, url, callback, onerror, timeout, data, sync, encoding, background) {
    if (method === 'GET' && url.startsWith('chrome://') && chromeUrlHandler) {
      chromeUrlHandler(url, callback, onerror);
      return;
    }
    var XMLHttpRequest = XMLHttpRequestFactory();
    var req = new XMLHttpRequest();
    req.timestamp = +new Date();
    if (background) {
      setBackgroundRequest(req);
    }
    req.open(method, url, !sync);
    setPrivateFlags(req);
    req.overrideMimeType && req.overrideMimeType('application/json');

    // headers for compressed data
    if (encoding) {
      req.setRequestHeader('Content-Encoding', encoding);
    }

    req.onload = function () {
      if (!parseInt) return; //parseInt is not a function after extension disable/uninstall

      var statusClass = parseInt(req.status / 100);
      if (statusClass == 2 || statusClass == 3 || statusClass == 0 /* local files */) {
          callback && callback(req);
        } else {
        console.log("loaded with non-200 " + url + " (status=" + req.status + " " + req.statusText + ")", "CLIQZEnvironment.httpHandler");
        onerror && onerror();
      }
    };
    req.onerror = function () {
      console.log("error loading " + url + " (status=" + req.status + " " + req.statusText + ")", "CLIQZEnvironment.httpHandler");
      onerror && onerror();
    };
    req.ontimeout = function () {
      console.log("timeout for " + url, "CLIQZEnvironment.httpHandler");
      onerror && onerror();
    };

    if (callback) {
      if (timeout) {
        req.timeout = parseInt(timeout);
      } else {
        req.timeout = ['POST', 'PUT'].indexOf(method) >= 0 ? 10000 : 1000;
      }
    }

    req.send(data);
    return req;
  }

  function httpHandler() {
    return activeHandler.apply(undefined, arguments);
  }

  function overrideHttpHandler(fn) {
    activeHandler = fn;
  }

  function compressionEnabled(url) {
    return compressionAvailable && !compressionExclusions.has(url);
  }

  /**
   *  Add a url for which we should not compress when using promiseHttpHandler
   */

  function addCompressionExclusion(url) {
    compressionExclusions.add(url);
  }

  function promiseHttpHandler(method, url, data, timeout, compressedPost) {
    return new Promise(function (resolve, reject) {
      // gzip.compress may be false if there is no implementation for this platform
      // or maybe it is not loaded yet
      if (method === 'POST' && compressedPost && compressionEnabled(url)) {
        var dataLength = data.length;
        data = compress(data);
        console.log("Compressed request to " + url + ", bytes saved = " + (dataLength - data.length) + " (" + (100 * (dataLength - data.length) / dataLength).toFixed(1) + "%)", "CLIQZEnvironment.httpHandler");
        httpHandler(method, url, resolve, reject, timeout, data, undefined, 'gzip');
      } else {
        httpHandler(method, url, resolve, reject, timeout, data);
      }
    });
  }

  return {
    setters: [function (_platformFetch) {
      ftch = _platformFetch;
    }, function (_console) {
      console = _console['default'];
    }, function (_gzip) {
      compress = _gzip.compress;
    }, function (_platformXmlhttprequest) {
      XMLHttpRequestFactory = _platformXmlhttprequest.XMLHttpRequestFactory;
      setPrivateFlags = _platformXmlhttprequest.setPrivateFlags;
      setBackgroundRequest = _platformXmlhttprequest.setBackgroundRequest;
    }, function (_platformChromeUrlHandler) {
      chromeUrlHandler = _platformChromeUrlHandler.chromeUrlHandler;
    }],
    execute: function () {
      fetch = ftch.fetch;

      _export('fetch', fetch);

      Headers = ftch.Headers;

      _export('Headers', Headers);

      Request = ftch.Request;

      _export('Request', Request);

      Response = ftch.Response;

      _export('Response', Response);

      ;

      activeHandler = defaultHttpHandler;
      compressionAvailable = Boolean(compress);
      compressionExclusions = new Set();
      ;
    }
  };
});
$__System.register("1f", [], function (_export) {
  "use strict";

  return {
    setters: [],
    execute: function () {}
  };
});
$__System.register("1e", ["1f"], function (_export) {

  /**
   *  Compress a string
   *
   *  @param {string} string to compress
   *  @returns {UInt8Array} compressed data
   */
  "use strict";

  var gzip, compress, decompress;
  return {
    setters: [function (_platformGzip) {
      gzip = _platformGzip;
    }],
    execute: function () {
      compress = gzip.compress || false;

      _export("compress", compress);

      /**
       *  Decompress a Gzip compressed string
       *
       *  @param {UInt8Array} gzipped data
       *  @returns {string} decompressed string
       */
      decompress = gzip.decompress || false;

      _export("decompress", decompress);
    }
  };
});
$__System.register('20', [], function (_export) {
  'use strict';

  var CliqzLanguage;
  return {
    setters: [],
    execute: function () {
      CliqzLanguage = {
        init: function init() {},
        stateToQueryString: function stateToQueryString() {
          return '&lang=de,en';
        }
      };

      _export('default', CliqzLanguage);
    }
  };
});
$__System.register('21', ['20'], function (_export) {
  'use strict';

  var Language;
  return {
    setters: [function (_platformLanguage) {
      Language = _platformLanguage['default'];
    }],
    execute: function () {
      _export('default', Language);
    }
  };
});
$__System.register("22", [], function (_export) {
  "use strict";

  _export("isURI", isURI);

  _export("default", equal);

  function isURI(text) {
    return false;
  }

  function equal(url1, url2) {
    return url1 === url2;
  }

  return {
    setters: [],
    execute: function () {}
  };
});
$__System.register('23', ['22'], function (_export) {
  'use strict';

  var isURI, UrlRegExp;

  /*
  strip protocol from url
  */

  _export('isUrl', isUrl);

  _export('urlStripProtocol', urlStripProtocol);

  function isUrl(input) {
    if (!input) {
      return false;
    }
    // TODO: handle ip addresses
    if (isURI(input)) {
      return true;
    } else {
      //step 1 remove eventual protocol
      var protocolPos = input.indexOf('://');
      if (protocolPos != -1 && protocolPos <= 6) {
        input = input.slice(protocolPos + 3);
      }
      //step2 remove path & everything after
      input = input.split('/')[0];
      //step3 run the regex
      return UrlRegExp.test(input);
    }
  }

  function urlStripProtocol(url) {
    var resultUrl = url;
    var toRemove = ['https://', 'http://', 'www2.', 'www.', 'mobile.', 'mobil.', 'm.'];
    toRemove.forEach(function (part) {
      if (resultUrl.toLowerCase().startsWith(part)) {
        resultUrl = resultUrl.substring(part.length);
      }
    });
    // remove trailing slash as well to have all urls in the same format
    if (resultUrl[resultUrl.length - 1] === '/') {
      resultUrl = resultUrl.slice(0, -1);
    }
    return resultUrl;
  }

  return {
    setters: [function (_platformUrl) {
      isURI = _platformUrl.isURI;

      _export('equals', _platformUrl['default']);
    }],
    execute: function () {
      UrlRegExp = /^(([a-z\d]([a-z\d-]*[a-z\d])?)\.)+[a-z]{2,}(\:\d+)?$/i;
    }
  };
});
$__System.register("9", ["16", "e", "17", "18", "3", "1a", "13", "1e", "21", "23"], function (_export) {
  "use strict";

  var CLIQZEnvironment, console, prefs, Storage, CliqzEvents, TLDs, _httpHandler, promiseHttpHandler, gzip, CliqzLanguage, isUrl, VERTICAL_ENCODINGS, COLOURS, LOGOS, BRANDS_DATABASE, ipv4_part, ipv4_regex, ipv6_regex, schemeRE, CliqzUtils;

  var _slicedToArray = function () {
    function sliceIterator(arr, i) {
      var _arr = [];var _n = true;var _d = false;var _e = undefined;try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;_e = err;
      } finally {
        try {
          if (!_n && _i["return"]) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }return _arr;
    }return function (arr, i) {
      if (Array.isArray(arr)) {
        return arr;
      } else if (Symbol.iterator in Object(arr)) {
        return sliceIterator(arr, i);
      } else {
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      }
    };
  }();

  return {
    setters: [function (_platformEnvironment) {
      CLIQZEnvironment = _platformEnvironment["default"];
    }, function (_console) {
      console = _console["default"];
    }, function (_prefs) {
      prefs = _prefs["default"];
    }, function (_storage) {
      Storage = _storage["default"];
    }, function (_events) {
      CliqzEvents = _events["default"];
    }, function (_tlds) {
      TLDs = _tlds.TLDs;
    }, function (_http) {
      _httpHandler = _http.httpHandler;
      promiseHttpHandler = _http.promiseHttpHandler;
    }, function (_gzip) {
      gzip = _gzip["default"];
    }, function (_language) {
      CliqzLanguage = _language["default"];
    }, function (_url) {
      isUrl = _url.isUrl;
    }],
    execute: function () {
      VERTICAL_ENCODINGS = {
        'people': 'p',
        'news': 'n',
        'video': 'v',
        'hq': 'h',
        'bm': 'm',
        'recipeRD': 'r',
        'game': 'g',
        'movie': 'o'
      };
      COLOURS = ['#ffce6d', '#ff6f69', '#96e397', '#5c7ba1', '#bfbfbf', '#3b5598', '#fbb44c', '#00b2e5', '#b3b3b3', '#99cccc', '#ff0027', '#999999'];
      LOGOS = ['wikipedia', 'google', 'facebook', 'youtube', 'duckduckgo', 'sternefresser', 'zalando', 'bild', 'web', 'ebay', 'gmx', 'amazon', 't-online', 'wiwo', 'wwe', 'weightwatchers', 'rp-online', 'wmagazine', 'chip', 'spiegel', 'yahoo', 'paypal', 'imdb', 'wikia', 'msn', 'autobild', 'dailymotion', 'hm', 'hotmail', 'zeit', 'bahn', 'softonic', 'handelsblatt', 'stern', 'cnn', 'mobile', 'aetv', 'postbank', 'dkb', 'bing', 'adobe', 'bbc', 'nike', 'starbucks', 'techcrunch', 'vevo', 'time', 'twitter', 'weatherunderground', 'xing', 'yelp', 'yandex', 'weather', 'flickr'];
      BRANDS_DATABASE = { domains: {}, palette: ["999"] };
      ipv4_part = "0*([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])";
      ipv4_regex = new RegExp("^" + ipv4_part + "\\." + ipv4_part + "\\." + ipv4_part + "\\." + ipv4_part + "([:]([0-9])+)?$");
      ipv6_regex = new RegExp("^\\[?(([0-9]|[a-f]|[A-F])*[:.]+([0-9]|[a-f]|[A-F])+[:.]*)+[\\]]?([:][0-9]+)?$");
      schemeRE = /^(\S+?):(\/\/)?(.*)$/i;
      CliqzUtils = {
        environment: CLIQZEnvironment,
        RESULTS_PROVIDER: CLIQZEnvironment.RESULTS_PROVIDER,
        RICH_HEADER: CLIQZEnvironment.RICH_HEADER,
        RESULTS_PROVIDER_LOG: 'https://api.cliqz.com/api/v1/logging?q=',
        RESULTS_PROVIDER_PING: 'https://api.cliqz.com/ping',
        CONFIG_PROVIDER: 'https://api.cliqz.com/api/v1/config',
        SAFE_BROWSING: 'https://safe-browsing.cliqz.com',
        TUTORIAL_URL: 'https://cliqz.com/home/onboarding',
        UNINSTALL: 'https://cliqz.com/home/offboarding',
        FEEDBACK: 'https://cliqz.com/feedback/',
        SYSTEM_BASE_URL: CLIQZEnvironment.SYSTEM_BASE_URL,
        PREFERRED_LANGUAGE: null,
        RESULTS_TIMEOUT: CLIQZEnvironment.RESULTS_TIMEOUT,

        BRANDS_DATABASE: BRANDS_DATABASE,

        //will be updated from the mixer config endpoint every time new logos are generated
        BRANDS_DATABASE_VERSION: 1483980213630,
        GEOLOC_WATCH_ID: null, // The ID of the geolocation watcher (function that updates cached geolocation on change)
        VERTICAL_TEMPLATES: {
          'n': 'news',
          'p': 'people',
          'v': 'video',
          'h': 'hq',
          'r': 'recipe',
          'g': 'cpgame_movie',
          'o': 'cpgame_movie'
        },
        hm: null,
        hw: null,
        mc: null,
        TEMPLATES_PATH: CLIQZEnvironment.TEMPLATES_PATH,
        TEMPLATES: CLIQZEnvironment.TEMPLATES,
        MESSAGE_TEMPLATES: CLIQZEnvironment.MESSAGE_TEMPLATES,
        PARTIALS: CLIQZEnvironment.PARTIALS,
        SKIN_PATH: CLIQZEnvironment.SKIN_PATH,
        LOCALE_PATH: CLIQZEnvironment.LOCALE_PATH,
        RERANKERS: CLIQZEnvironment.RERANKERS,
        CLIQZ_ONBOARDING: CLIQZEnvironment.CLIQZ_ONBOARDING,
        CLIQZ_ONBOARDING_URL: CLIQZEnvironment.CLIQZ_ONBOARDING_URL,
        BROWSER_ONBOARDING_PREF: CLIQZEnvironment.BROWSER_ONBOARDING_PREF,
        BROWSER_ONBOARDING_STEP_PREF: CLIQZEnvironment.BROWSER_ONBOARDING_STEP_PREF,
        CLIQZ_NEW_TAB: CLIQZEnvironment.CLIQZ_NEW_TAB,
        CLIQZ_NEW_TAB_RESOURCE_URL: CLIQZEnvironment.CLIQZ_NEW_TAB_RESOURCE_URL,

        telemetryHandlers: [CLIQZEnvironment.telemetry],

        init: function init(options) {
          options = options || {};

          if (!options.lang) {
            return Promise.reject("lang missing");
          }

          CLIQZEnvironment.gzip = gzip;

          // cutting cyclic dependency
          CLIQZEnvironment.getLogoDetails = CliqzUtils.getLogoDetails.bind(CliqzUtils);
          CLIQZEnvironment.getDetailsFromUrl = CliqzUtils.getDetailsFromUrl.bind(CliqzUtils);
          CLIQZEnvironment.getLocalizedString = CliqzUtils.getLocalizedString.bind(CliqzUtils);
          CLIQZEnvironment.app = CliqzUtils.app;
          CliqzUtils.log('Initialized', 'CliqzUtils');

          CliqzUtils.setLang(options.lang);

          CliqzUtils.tldExtractor = CLIQZEnvironment.tldExtractor || CliqzUtils.genericTldExtractor;
        },
        getLanguageFromLocale: function getLanguageFromLocale(locale) {
          return locale.match(/([a-z]+)(?:[-_]([A-Z]+))?/)[1];
        },
        SUPPORTED_LANGS: { 'de': 'de', 'en': 'en', 'fr': 'fr' },
        getSupportedLanguage: function getSupportedLanguage(lang) {
          return CliqzUtils.SUPPORTED_LANGS[lang] || 'en';
        },
        setLang: function setLang(locale) {
          var lang = CliqzUtils.getLanguageFromLocale(locale);
          var supportedLang = CliqzUtils.getSupportedLanguage(lang);
          CliqzUtils.PREFERRED_LANGUAGE = locale;
          CliqzUtils.getLocaleFile(supportedLang);
        },

        isNumber: function isNumber(n) {
          /*
          NOTE: this function can't recognize numbers in the form such as: "1.2B", but it can for "1e4". See specification for isFinite()
           */
          return !isNaN(parseFloat(n)) && isFinite(n);
        },

        //returns the type only if it is known
        getKnownType: function getKnownType(type) {
          return VERTICAL_ENCODINGS.hasOwnProperty(type) && type;
        },

        /**
         * Construct a uri from a url
         * @param {string}  aUrl - url
         * @param {string}  aOriginCharset - optional character set for the URI
         * @param {nsIURI}  aBaseURI - base URI for the spec
         */
        makeUri: CLIQZEnvironment.makeUri,

        setLogoDb: function setLogoDb(db) {
          BRANDS_DATABASE = CliqzUtils.BRANDS_DATABASE = db;
        },
        getLogoDetails: function getLogoDetails(urlDetails) {
          var base = urlDetails.name,
              baseCore = base.replace(/[-]/g, ""),
              check = function check(host, rule) {
            var address = host.lastIndexOf(base),
                parseddomain = host.substr(0, address) + "$" + host.substr(address + base.length);

            return parseddomain.indexOf(rule) != -1;
          },
              result = {},
              domains = BRANDS_DATABASE.domains;

          if (base.length == 0) return result;

          if (base == "IP") result = { text: "IP", backgroundColor: "9077e3" };else if (domains[base]) {
            for (var i = 0, imax = domains[base].length; i < imax; i++) {
              var rule = domains[base][i]; // r = rule, b = background-color, l = logo, t = text, c = color

              if (i == imax - 1 || check(urlDetails.host, rule.r)) {
                result = {
                  backgroundColor: rule.b ? rule.b : null,
                  backgroundImage: rule.l ? "url(https://cdn.cliqz.com/brands-database/database/" + this.BRANDS_DATABASE_VERSION + "/logos/" + base + "/" + rule.r + ".svg)" : "",
                  text: rule.t,
                  color: rule.c ? "" : "#fff"
                };

                break;
              }
            }
          }
          result.text = result.text || (baseCore.length > 1 ? baseCore[0].toUpperCase() + baseCore[1].toLowerCase() : "");
          result.backgroundColor = result.backgroundColor || BRANDS_DATABASE.palette[base.split("").reduce(function (a, b) {
            return a + b.charCodeAt(0);
          }, 0) % BRANDS_DATABASE.palette.length];
          var colorID = BRANDS_DATABASE.palette.indexOf(result.backgroundColor),
              buttonClass = BRANDS_DATABASE.buttons && colorID != -1 && BRANDS_DATABASE.buttons[colorID] ? BRANDS_DATABASE.buttons[colorID] : 10;

          result.buttonsClass = "cliqz-brands-button-" + buttonClass;
          result.style = "background-color: #" + result.backgroundColor + ";color:" + (result.color || '#fff') + ";";

          if (result.backgroundImage) result.style += "background-image:" + result.backgroundImage + "; text-indent: -10em;";

          return result;
        },
        httpHandler: function httpHandler() {
          var errorHandler = arguments[3]; // see httpGet or httpPost arguments
          try {
            return _httpHandler.apply(undefined, arguments);
          } catch (e) {
            if (errorHandler) {
              errorHandler(e);
            } else {
              CliqzUtils.log(e, "httpHandler failed");
            }
          }
        },
        httpGet: function httpGet(url, callback, onerror, timeout, _, sync) {
          return CliqzUtils.httpHandler('GET', url, callback, onerror, timeout, _, sync);
        },
        httpPost: function httpPost(url, callback, data, onerror, timeout) {
          return CliqzUtils.httpHandler('POST', url, callback, onerror, timeout, data);
        },
        httpPut: function httpPut(url, callback, data, onerror, timeout) {
          return CliqzUtils.httpHandler('PUT', url, callback, onerror, timeout, data);
        },
        getLocalStorage: function getLocalStorage(url) {
          return new Storage(url);
        },
        /**
         * Loads a resource URL from the xpi.
         *
         * Wraps httpGet in a try-catch clause. We need to do this, because when
         * trying to load a non-existing file from an xpi via xmlhttprequest, Firefox
         * throws a NS_ERROR_FILE_NOT_FOUND exception instead of calling the onerror
         * function.
         *
         * @see https://bugzilla.mozilla.org/show_bug.cgi?id=827243 (probably).
         */
        loadResource: function loadResource(url, callback, onerror) {
          try {
            return CliqzUtils.httpGet(url, callback, onerror, 3000);
          } catch (e) {
            CliqzUtils.log("Could not load resource " + url + " from the xpi", "CliqzUtils.httpHandler");
            onerror && onerror();
          }
        },
        openTabInWindow: CLIQZEnvironment.openTabInWindow,
        getPref: prefs.get,
        setPref: prefs.set,
        hasPref: prefs.has,
        clearPref: prefs.clear,
        log: function log(msg, key) {
          console.log(key, msg);
        },
        getDay: function getDay() {
          return Math.floor(new Date().getTime() / 86400000);
        },
        //creates a random 'len' long string from the input space
        rand: function rand(len, _space) {
          var ret = '',
              i,
              space = _space || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
              sLen = space.length;

          for (i = 0; i < len; i++) ret += space.charAt(Math.floor(Math.random() * sLen));

          return ret;
        },
        hash: function hash(s) {
          return s.split('').reduce(function (a, b) {
            return (a << 4) - a + b.charCodeAt(0) & 0xEFFFFFF;
          }, 0);
        },
        cleanMozillaActions: function cleanMozillaActions(url) {
          if (url.indexOf("moz-action:") == 0) {
            var _url$match = url.match(/^moz-action:([^,]+),(.*)$/);

            var _url$match2 = _slicedToArray(_url$match, 3);

            var action = _url$match2[1];
            var url = _url$match2[2];

            try {
              // handle cases like: moz-action:visiturl,{"url": "..."}
              var mozActionUrl = JSON.parse(url).url;
              if (mozActionUrl) {
                url = decodeURIComponent(mozActionUrl);
              }
            } catch (e) {}
          }
          return [action, url];
        },
        cleanUrlProtocol: function cleanUrlProtocol(url, cleanWWW) {
          if (!url) return '';

          // removes protocol if it's http(s). See CLIQZIUM-218.
          var urlLowered = url.toLowerCase();
          if (urlLowered.startsWith('http://')) url = url.slice(7);
          if (urlLowered.startsWith('https://')) url = url.slice(8);

          // removes the www.
          if (cleanWWW && url.toLowerCase().startsWith('www.')) url = url.slice(4);

          return url;
        },
        genericTldExtractor: function genericTldExtractor(host) {
          var v = host.toLowerCase().split('.'),
              tld = '';

          var first_level = TLDs[v[v.length - 1]];
          tld = v[v.length - 1];

          if (v.length > 2 && first_level == 'cc') {
            // check if we also have to remove the second level, only if 3 or more
            //  levels and the first_level was a country code
            if (TLDs[v[v.length - 2]]) {
              tld = v[v.length - 2] + '.' + tld;
            }
          }
          return tld;
        },
        getDetailsFromUrl: function getDetailsFromUrl(originalUrl) {
          var _CliqzUtils$cleanMozillaActions = CliqzUtils.cleanMozillaActions(originalUrl);

          var _CliqzUtils$cleanMozillaActions2 = _slicedToArray(_CliqzUtils$cleanMozillaActions, 2);

          var action = _CliqzUtils$cleanMozillaActions2[0];
          var originalUrl = _CliqzUtils$cleanMozillaActions2[1];

          // exclude protocol
          var url = originalUrl,
              scheme = '',
              slashes = '',
              name = '',
              tld = '',
              subdomains = [],
              path = '',
              query = '',
              fragment = '';

          // remove scheme
          var schemeMatch = schemeRE.exec(url);
          if (schemeMatch) {
            scheme = schemeMatch[1];
            slashes = schemeMatch[2];
            url = schemeMatch[3];
          }
          var ssl = scheme == 'https';

          // separate hostname from path, etc. Could be separated from rest by /, ? or #
          var host = url.split(/[\/\#\?]/)[0].toLowerCase();
          var path = url.replace(host, '');

          // separate username:password@ from host
          var userpass_host = host.split('@');
          if (userpass_host.length > 1) host = userpass_host[1];

          // Parse Port number
          var port = "";

          var isIPv4 = ipv4_regex.test(host);
          var isIPv6 = ipv6_regex.test(host);

          var indexOfColon = host.indexOf(":");
          if ((!isIPv6 || isIPv4) && indexOfColon >= 0) {
            port = host.substr(indexOfColon + 1);
            host = host.substr(0, indexOfColon);
          } else if (isIPv6) {
            // If an IPv6 address has a port number, it will be right after a closing bracket ] : format [ip_v6]:port
            var endOfIP = host.indexOf(']:');
            if (endOfIP >= 0) {
              port = host.split(']:')[1];
              host = host.split(']:')[0].replace('[', '').replace(']', '');
            }
          }

          // extract query and fragment from url
          var query = '';
          var query_idx = path.indexOf('?');
          if (query_idx != -1) {
            query = path.substr(query_idx + 1);
          }

          var fragment = '';
          var fragment_idx = path.indexOf('#');
          if (fragment_idx != -1) {
            fragment = path.substr(fragment_idx + 1);
          }

          // remove query and fragment from path
          path = path.replace('?' + query, '');
          path = path.replace('#' + fragment, '');
          query = query.replace('#' + fragment, '');

          // extra - all path, query and fragment
          var extra = path;
          if (query) extra += "?" + query;
          if (fragment) extra += "#" + fragment;

          isIPv4 = ipv4_regex.test(host);
          isIPv6 = ipv6_regex.test(host);
          var isLocalhost = CliqzUtils.isLocalhost(host, isIPv4, isIPv6);

          // find parts of hostname
          if (!isIPv4 && !isIPv6 && !isLocalhost) {
            try {
              tld = CliqzUtils.tldExtractor(host);

              // Get the domain name w/o subdomains and w/o TLD
              name = host.slice(0, -(tld.length + 1)).split('.').pop(); // +1 for the '.'

              // Get subdomains
              var name_tld = name + "." + tld;
              subdomains = host.slice(0, -name_tld.length).split(".").slice(0, -1);

              //remove www if exists
              // TODO: I don't think this is the right place to do this.
              //       Disabled for now, but check there are no issues.
              // host = host.indexOf('www.') == 0 ? host.slice(4) : host;
            } catch (e) {
              name = "";
              host = "";
              //CliqzUtils.log('WARNING Failed for: ' + originalUrl, 'CliqzUtils.getDetailsFromUrl');
            }
          } else {
            name = isLocalhost ? "localhost" : "IP";
          }

          // remove www from beginning, we need cleanHost in the friendly url
          var cleanHost = host;
          if (host.toLowerCase().indexOf('www.') == 0) {
            cleanHost = host.slice(4);
          }

          var friendly_url = cleanHost + extra;
          if (scheme && scheme != 'http' && scheme != 'https') friendly_url = scheme + ":" + slashes + friendly_url;
          //remove trailing slash from the end
          friendly_url = CliqzUtils.stripTrailingSlash(friendly_url);

          //Handle case where we have only tld for example http://cliqznas
          if (cleanHost === tld) {
            name = tld;
          }

          var urlDetails = {
            scheme: scheme ? scheme + ':' : '',
            name: name,
            domain: tld ? name + '.' + tld : '',
            tld: tld,
            subdomains: subdomains,
            path: path,
            query: query,
            fragment: fragment,
            extra: extra,
            host: host,
            cleanHost: cleanHost,
            ssl: ssl,
            port: port,
            friendly_url: friendly_url
          };

          return urlDetails;
        },
        stripTrailingSlash: function stripTrailingSlash(str) {
          if (str.substr(-1) === '/') {
            return str.substr(0, str.length - 1);
          }
          return str;
        },
        isUrl: isUrl,
        // Chechks if the given string is a valid IPv4 addres
        isIPv4: function isIPv4(input) {
          var ipv4_part = "0*([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])"; // numbers 0 - 255
          var ipv4_regex = new RegExp("^" + ipv4_part + "\\." + ipv4_part + "\\." + ipv4_part + "\\." + ipv4_part + "([:]([0-9])+)?$"); // port number
          return ipv4_regex.test(input);
        },

        isIPv6: function isIPv6(input) {

          // Currently using a simple regex for "what looks like an IPv6 address" for readability
          var ipv6_regex = new RegExp("^\\[?(([0-9]|[a-f]|[A-F])*[:.]+([0-9]|[a-f]|[A-F])+[:.]*)+[\\]]?([:][0-9]+)?$");
          return ipv6_regex.test(input);

          /* A better (more precise) regex to validate IPV6 addresses from StackOverflow:
          link: http://stackoverflow.com/questions/53497/regular-expression-that-matches-valid-ipv6-addresses
           var ipv6_regex = new RegExp("(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:)"
          + "{1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,"
          + "4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a"
          + "-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}"
          + "|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])"
          + "|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))");
          */
        },

        isLocalhost: function isLocalhost(host, isIPv4, isIPv6) {
          if (host == "localhost") return true;
          if (isIPv4 && host.substr(0, 3) == "127") return true;
          if (isIPv6 && host == "::1") return true;

          return false;
        },
        // checks if a value represents an url which is a seach engine
        isSearch: function isSearch(value) {
          if (CliqzUtils.isUrl(value)) {
            var url = this.cleanMozillaActions(value)[1];

            var _CliqzUtils$getDetailsFromUrl = CliqzUtils.getDetailsFromUrl(url);

            var _name = _CliqzUtils$getDetailsFromUrl.name;
            var subdomains = _CliqzUtils$getDetailsFromUrl.subdomains;
            var path = _CliqzUtils$getDetailsFromUrl.path;

            // allow only 'www' and 'de' (for Yahoo) subdomains to exclude 'maps.google.com' etc.
            // and empty path only to exclude 'www.google.com/maps' etc.
            var firstSubdomain = subdomains.length ? subdomains[0] : '';
            return (!path || path.length === 1 && path[0] === '/') && ((_name === 'google' || _name === 'bing' || _name === 'duckduckgo' || _name === 'startpage') && (!firstSubdomain || firstSubdomain === 'www') || _name === 'yahoo' && (!firstSubdomain || firstSubdomain === 'de'));
          }
          return false;
        },
        // checks if a string is a complete url
        isCompleteUrl: function isCompleteUrl(input) {
          var pattern = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
          if (!pattern.test(input)) {
            return false;
          } else {
            return true;
          }
        },
        // extract query term from search engine result page URLs
        extractQueryFromUrl: function extractQueryFromUrl(url) {
          // Google
          if (url.search(/http(s?):\/\/www\.google\..*\/.*q=.*/i) === 0) {
            url = url.substring(url.lastIndexOf('q=') + 2).split('&')[0];
            // Bing
          } else if (url.search(/http(s?):\/\/www\.bing\..*\/.*q=.*/i) === 0) {
            url = url.substring(url.indexOf('q=') + 2).split('&')[0];
            // Yahoo
          } else if (url.search(/http(s?):\/\/.*search\.yahoo\.com\/search.*p=.*/i) === 0) {
            url = url.substring(url.indexOf('p=') + 2).split('&')[0];
          } else {
            url = null;
          }
          var decoded = url ? decodeURIComponent(url.replace(/\+/g, ' ')) : null;
          if (decoded) return decoded;else return url;
        },
        // Remove clutter (http, www) from urls
        generalizeUrl: function generalizeUrl(url, skipCorrection) {
          if (!url) {
            return '';
          }
          var val = url.toLowerCase();
          var cleanParts = CliqzUtils.cleanUrlProtocol(val, false).split('/'),
              host = cleanParts[0],
              pathLength = 0,
              SYMBOLS = /,|\./g;
          if (!skipCorrection) {
            if (cleanParts.length > 1) {
              pathLength = ('/' + cleanParts.slice(1).join('/')).length;
            }
            if (host.indexOf('www') === 0 && host.length > 4) {
              // only fix symbols in host
              if (SYMBOLS.test(host[3]) && host[4] != ' ')
                // replace only issues in the host name, not ever in the path
                val = val.substr(0, val.length - pathLength).replace(SYMBOLS, '.') + (pathLength ? val.substr(-pathLength) : '');
            }
          }
          url = CliqzUtils.cleanUrlProtocol(val, true);
          return url[url.length - 1] == '/' ? url.slice(0, -1) : url;
        },
        // Remove clutter from urls that prevents pattern detection, e.g. checksum
        simplifyUrl: function simplifyUrl(url) {
          var q;
          // Google redirect urls
          if (url.search(/http(s?):\/\/www\.google\..*\/url\?.*url=.*/i) === 0) {
            // Return target URL instead
            url = url.substring(url.lastIndexOf('url=')).split('&')[0];
            url = url.substr(4);
            return decodeURIComponent(url);

            // Remove clutter from Google searches
          } else if (url.search(/http(s?):\/\/www\.google\..*\/.*q=.*/i) === 0) {
            q = url.substring(url.lastIndexOf('q=')).split('&')[0];
            if (q != 'q=') {
              // tbm defines category (images/news/...)
              var param = url.indexOf('#') != -1 ? url.substr(url.indexOf('#')) : url.substr(url.indexOf('?'));
              var tbm = param.indexOf('tbm=') != -1 ? '&' + param.substring(param.lastIndexOf('tbm=')).split('&')[0] : '';
              var page = param.indexOf('start=') != -1 ? '&' + param.substring(param.lastIndexOf('start=')).split('&')[0] : '';
              return 'https://www.google.com/search?' + q + tbm /*+ page*/;
            } else {
              return url;
            }
            // Bing
          } else if (url.search(/http(s?):\/\/www\.bing\..*\/.*q=.*/i) === 0) {
            q = url.substring(url.indexOf('q=')).split('&')[0];
            if (q != 'q=') {
              if (url.indexOf('search?') != -1) return url.substr(0, url.indexOf('search?')) + 'search?' + q;else return url.substr(0, url.indexOf('/?')) + '/?' + q;
            } else {
              return url;
            }
            // Yahoo redirect
          } else if (url.search(/http(s?):\/\/r.search\.yahoo\.com\/.*/i) === 0) {
            url = url.substring(url.lastIndexOf('/RU=')).split('/RK=')[0];
            url = url.substr(4);
            return decodeURIComponent(url);
            // Yahoo
          } else if (url.search(/http(s?):\/\/.*search\.yahoo\.com\/search.*p=.*/i) === 0) {
            var p = url.substring(url.indexOf('p=')).split('&')[0];
            if (p != 'p=' && url.indexOf(';') != -1) {
              return url.substr(0, url.indexOf(';')) + '?' + p;
            } else {
              return url;
            }
          } else {
            return url;
          }
        },

        // establishes the connection
        pingCliqzResults: function pingCliqzResults() {
          CliqzUtils.httpHandler('HEAD', CliqzUtils.RESULTS_PROVIDER_PING);
        },

        getResultsProviderQueryString: function getResultsProviderQueryString(q) {
          var numberResults = 5;
          if (CliqzUtils.getPref('languageDedup', false)) {
            numberResults = 7;
          }
          if (CliqzUtils.getPref('modules.context-search.enabled', false)) {
            numberResults = 10;
          }
          return encodeURIComponent(q) + CliqzUtils.encodeSessionParams() + CliqzLanguage.stateToQueryString() + CliqzUtils.encodeLocale() + CliqzUtils.encodeResultOrder() + CliqzUtils.encodeCountry() + CliqzUtils.encodeFilter() + CliqzUtils.encodeLocation(true) + // @TODO: remove true
          CliqzUtils.encodeResultCount(numberResults) + CliqzUtils.enncodeQuerySuggestionParam() + CliqzUtils.disableWikiDedup();
        },

        getRichHeaderQueryString: function getRichHeaderQueryString(q, loc, locale) {
          var numberResults = 5;
          if (CliqzUtils.getPref('languageDedup', false)) {
            numberResults = 7;
          }
          if (CliqzUtils.getPref('modules.context-search.enabled', false)) {
            numberResults = 10;
          }
          return "&q=" + encodeURIComponent(q) + // @TODO: should start with &q=
          CliqzUtils.encodeSessionParams() + CliqzLanguage.stateToQueryString() + CliqzUtils.encodeLocale(locale) + CliqzUtils.encodeResultOrder() + CliqzUtils.encodeCountry() + CliqzUtils.encodeFilter() + CliqzUtils.encodeLocation(true, loc && loc.latitude, loc && loc.longitude) + CliqzUtils.encodeResultCount(numberResults) + CliqzUtils.disableWikiDedup();
        },

        getBackendResults: function getBackendResults(q) {
          return new Promise(function (resolve, reject) {
            if (!CliqzUtils.getPref('cliqzBackendProvider.enabled', true)) {
              resolve({
                response: {
                  results: []
                },
                query: q
              });
            } else {
              CliqzUtils._sessionSeq++;

              // if the user sees the results more than 500ms we consider that he starts a new query
              if (CliqzUtils._queryLastDraw && Date.now() > CliqzUtils._queryLastDraw + 500) {
                CliqzUtils._queryCount++;
              }
              CliqzUtils._queryLastDraw = 0; // reset last Draw - wait for the actual draw
              CliqzUtils._queryLastLength = q.length;
              var url = CliqzUtils.RESULTS_PROVIDER + CliqzUtils.getResultsProviderQueryString(q);
              CliqzUtils.httpGet(url, function (res) {
                var resp = JSON.parse(res.response || '{}');
                if (resp.result !== undefined && resp.results === undefined) {
                  resp.results = resp.result;
                  delete resp.result;
                }
                resolve({
                  response: resp,
                  query: q
                });
              }, reject);
            }
          });
        },

        // IP driven configuration
        fetchAndStoreConfig: function fetchAndStoreConfig() {
          return new Promise(function (resolve) {
            CliqzUtils.httpGet(CliqzUtils.CONFIG_PROVIDER, function (res) {
              if (res && res.response) {
                try {
                  var config = JSON.parse(res.response);
                  for (var k in config) {
                    if (typeof config[k] == 'object') {
                      CliqzUtils.setPref('config_' + k, JSON.stringify(config[k]));
                    } else {
                      CliqzUtils.setPref('config_' + k, config[k]);
                    }
                  }

                  // we only set the prefered backend once at first start
                  if (CliqzUtils.getPref('backend_country', '') === '') {
                    // waiting a bit to be sure first initialization is complete
                    CliqzUtils.setTimeout(function () {
                      CliqzUtils.setDefaultIndexCountry(CliqzUtils.getPref('config_location', 'de'), true);
                    }, 2000);
                  }
                } catch (e) {
                  CliqzUtils.log(e);
                }
              }
              resolve();
            }, resolve, //on error the callback still needs to be called
            10000);
          });
        },
        setDefaultIndexCountry: function setDefaultIndexCountry(country, restart) {
          CliqzUtils.setPref('backend_country', country);
          CliqzUtils._country = country;

          if (country !== 'de') {
            // simple UI for outside germany
            CliqzUtils.setPref('dropDownStyle', 'simple');
          } else {
            CliqzUtils.clearPref('dropDownStyle');
          }

          if (restart) {
            CliqzUtils.setPref('modules.ui.enabled', false);

            // we need to avoid the throttle on prefs
            CliqzUtils.setTimeout(function () {
              CliqzUtils.setPref('modules.ui.enabled', true);
            }, 0);
          }
        },
        encodeLocale: function encodeLocale(locale) {
          var preferred = CliqzUtils.PREFERRED_LANGUAGE || "";
          if (locale) {
            preferred = locale;
          }
          // send browser language to the back-end
          //return '&locale=' + (locale ? locale : (CliqzUtils.PREFERRED_LANGUAGE || ""));
          return '&locale=' + preferred;
        },
        encodeCountry: function encodeCountry() {
          //international results not supported
          return '&country=' + CliqzUtils._country;
        },
        disableWikiDedup: function disableWikiDedup() {
          // disable wikipedia deduplication on the backend side
          var doDedup = CliqzUtils.getPref("languageDedup", false);
          if (doDedup) return '&ddl=0';else return "";
        },
        getAdultContentFilterState: function getAdultContentFilterState() {
          var data = {
            'conservative': 3,
            'moderate': 0,
            'liberal': 1
          },
              pref = CliqzUtils.getPref('adultContentFilter', 'moderate');
          return data[pref];
        },
        encodeFilter: function encodeFilter() {
          return '&adult=' + CliqzUtils.getAdultContentFilterState();
        },
        encodeResultCount: function encodeResultCount(count) {
          count = count || 5;
          return '&count=' + count;
        },
        enncodeQuerySuggestionParam: function enncodeQuerySuggestionParam() {
          var suggestionsEnabled = CliqzUtils.getPref("suggestionsEnabled", false);
          return "&suggest=" + (suggestionsEnabled ? 1 : 0);
        },
        encodeResultType: function encodeResultType(type) {
          if (type.indexOf('action') !== -1) return ['T'];else if (type.indexOf('cliqz-results') == 0) return CliqzUtils.encodeCliqzResultType(type);else if (type.indexOf('cliqz-pattern') == 0) return ['C'];else if (type === 'cliqz-extra') return ['X'];else if (type === 'cliqz-series') return ['S'];else if (type.indexOf('bookmark') == 0 || type.indexOf('tag') == 0) return ['B'].concat(CliqzUtils.encodeCliqzResultType(type));else if (type.indexOf('favicon') == 0 || type.indexOf('history') == 0) return ['H'].concat(CliqzUtils.encodeCliqzResultType(type));

          // cliqz type = "cliqz-custom sources-X"
          else if (type.indexOf('cliqz-custom') == 0) return type.substr(21);

          return type; //should never happen
        },
        //eg types: [ "H", "m" ], [ "H|instant", "X|11" ]
        isPrivateResultType: function isPrivateResultType(type) {
          var onlyType = type[0].split('|')[0];
          return 'HBTCS'.indexOf(onlyType) != -1 && type.length == 1;
        },
        // cliqz type = "cliqz-results sources-XXXXX" or "favicon sources-XXXXX" if combined with history
        encodeCliqzResultType: function encodeCliqzResultType(type) {
          var pos = type.indexOf('sources-');
          if (pos != -1) return CliqzUtils.encodeSources(type.substr(pos + 8));else return [];
        },
        // random ID generated at each urlbar focus
        _searchSession: '',
        // number of sequences in each session
        _sessionSeq: 0,
        _queryLastLength: null,
        _queryLastDraw: null,
        // number of queries in search session
        _queryCount: null,
        setSearchSession: function setSearchSession(rand) {
          CliqzUtils._country = CliqzUtils.getPref('backend_country');
          CliqzUtils._searchSession = rand;
          CliqzUtils._sessionSeq = 0;
          CliqzUtils._queryCount = 0;
          CliqzUtils._queryLastLength = 0;
          CliqzUtils._queryLastDraw = 0;
        },
        encodeSessionParams: function encodeSessionParams() {
          if (CliqzUtils._searchSession.length) {
            return '&s=' + encodeURIComponent(CliqzUtils._searchSession) + '&n=' + CliqzUtils._sessionSeq + '&qc=' + CliqzUtils._queryCount;
          } else return '';
        },

        encodeLocation: function encodeLocation(specifySource, lat, lng) {
          var qs = ['&loc_pref=', CliqzUtils.getPref('share_location', 'ask')].join('');

          if (CliqzUtils.USER_LAT && CliqzUtils.USER_LNG || lat && lng) {
            qs += ['&loc=', lat || CliqzUtils.USER_LAT, ',', lng || CliqzUtils.USER_LNG, specifySource ? ',U' : ''].join('');
          }

          return qs;
        },
        encodeSources: function encodeSources(sources) {
          return sources.toLowerCase().split(', ').map(function (s) {
            if (s.indexOf('cache') == 0) // to catch 'cache-*' for specific countries
              return 'd';else return VERTICAL_ENCODINGS[s] || s;
          });
        },
        isPrivate: CLIQZEnvironment.isPrivate,
        telemetry: function telemetry() {
          var args = arguments;
          CliqzUtils.telemetryHandlers.forEach(function (handler) {
            return handler.apply(null, args);
          });
        },
        resultTelemetry: function resultTelemetry(query, queryAutocompleted, resultIndex, resultUrl, resultOrder, extra) {
          CliqzUtils.setResultOrder(resultOrder);
          CliqzEvents.pub("human-web:sanitize-result-telemetry", { type: 'extension-result-telemetry',
            q: query,
            s: CliqzUtils.encodeSessionParams(),
            msg: {
              i: resultIndex,
              o: CliqzUtils.encodeResultOrder(),
              u: resultUrl ? resultUrl : '',
              a: queryAutocompleted,
              e: extra
            },
            endpoint: CliqzUtils.RESULTS_PROVIDER_LOG,
            method: "GET"
          });
          CliqzUtils.setResultOrder('');
        },
        _resultOrder: '',
        setResultOrder: function setResultOrder(resultOrder) {
          CliqzUtils._resultOrder = resultOrder;
        },
        encodeResultOrder: function encodeResultOrder() {
          return CliqzUtils._resultOrder && CliqzUtils._resultOrder.length ? '&o=' + encodeURIComponent(JSON.stringify(CliqzUtils._resultOrder)) : '';
        },
        setInterval: CLIQZEnvironment.setInterval,
        setTimeout: CLIQZEnvironment.setTimeout,
        clearTimeout: CLIQZEnvironment.clearTimeout,
        clearInterval: CLIQZEnvironment.clearTimeout,
        Promise: CLIQZEnvironment.Promise,
        locale: {},
        currLocale: null,
        getLocaleFile: function getLocaleFile(locale) {
          // locale file might not exist on mobile
          if (CliqzUtils.LOCALE_PATH) {
            var url = CliqzUtils.LOCALE_PATH + locale + '/cliqz.json';
            // Synchronous request is depricated
            var req = CliqzUtils.httpGet(url, null, null, null, null, true);
            CliqzUtils.currLocale = locale;
            CliqzUtils.locale["default"] = CliqzUtils.locale[locale] = JSON.parse(req.response);
          }
        },
        getLocalizedString: function getLocalizedString(key, substitutions) {
          if (!key) return '';

          var str = key,
              localMessages;

          if (CliqzUtils.currLocale != null && CliqzUtils.locale[CliqzUtils.currLocale] && CliqzUtils.locale[CliqzUtils.currLocale][key]) {
            str = CliqzUtils.locale[CliqzUtils.currLocale][key].message;
            localMessages = CliqzUtils.locale[CliqzUtils.currLocale];
          } else if (CliqzUtils.locale["default"] && CliqzUtils.locale["default"][key]) {
            str = CliqzUtils.locale["default"][key].message;
            localMessages = CliqzUtils.locale["default"];
          }

          if (!substitutions) {
            substitutions = [];
          }
          if (!Array.isArray(substitutions)) {
            substitutions = [substitutions];
          }

          function replacer(matched, index, dollarSigns) {
            if (index) {
              index = parseInt(index, 10) - 1;
              return index in substitutions ? substitutions[index] : "";
            } else {
              // For any series of contiguous `$`s, the first is dropped, and
              // the rest remain in the output string.
              return dollarSigns;
            }
          }
          return str.replace(/\$(?:([1-9]\d*)|(\$+))/g, replacer);
        },
        // gets all the elements with the class 'cliqz-locale' and adds
        // the localized string - key attribute - as content
        localizeDoc: function localizeDoc(doc) {
          var locale = doc.getElementsByClassName('cliqz-locale');
          for (var i = 0; i < locale.length; i++) {
            var el = locale[i];
            el.textContent = CliqzUtils.getLocalizedString(el.getAttribute('key'));
          }
        },
        isWindows: function isWindows() {
          return CLIQZEnvironment.OS.indexOf("win") === 0;
        },
        isMac: function isMac() {
          return CLIQZEnvironment.OS.indexOf("darwin") === 0;
        },
        isLinux: function isLinux() {
          return CLIQZEnvironment.OS.indexOf("linux") === 0;
        },
        getWindow: CLIQZEnvironment.getWindow,
        getWindowID: CLIQZEnvironment.getWindowID,
        /**
         * Bind functions contexts to a specified object.
         * @param {Object} from - An object, whose function properties will be processed.
         * @param {Object} to - An object, which will be the context (this) of processed functions.
         */
        bindObjectFunctions: function bindObjectFunctions(from, to) {
          for (var funcName in from) {
            var func = from[funcName];
            if (!from.hasOwnProperty(funcName)) continue;
            // Can't compare with prototype of object from a different module.
            if (typeof func != "function") continue;
            from[funcName] = func.bind(to);
          }
        },
        tryDecodeURIComponent: function tryDecodeURIComponent(s) {
          // avoide error from decodeURIComponent('%2')
          try {
            return decodeURIComponent(s);
          } catch (e) {
            return s;
          }
        },
        tryEncodeURIComponent: function tryEncodeURIComponent(s) {
          try {
            return encodeURIComponent(s);
          } catch (e) {
            return s;
          }
        },
        parseQueryString: function parseQueryString(qstr) {
          var query = {};
          var a = (qstr || '').split('&');
          for (var i in a) {
            var b = a[i].split('=');
            query[CliqzUtils.tryDecodeURIComponent(b[0])] = CliqzUtils.tryDecodeURIComponent(b[1]);
          }

          return query;
        },
        roundToDecimal: function roundToDecimal(number, digits) {
          var multiplier = Math.pow(10, digits);
          return Math.round(number * multiplier) / multiplier;
        },
        getAdultFilterState: function getAdultFilterState() {
          var data = {
            'conservative': {
              name: CliqzUtils.getLocalizedString('always'),
              selected: false
            },
            'moderate': {
              name: CliqzUtils.getLocalizedString('always_ask'),
              selected: false
            },
            'liberal': {
              name: CliqzUtils.getLocalizedString('never'),
              selected: false
            }
          };

          data[CliqzUtils.getPref('adultContentFilter', 'moderate')].selected = true;

          return data;
        },
        getLocationPermState: function getLocationPermState() {
          var data = {
            'yes': {
              name: CliqzUtils.getLocalizedString('always'),
              selected: false
            },
            'ask': {
              name: CliqzUtils.getLocalizedString('always_ask'),
              selected: false
            },
            'no': {
              name: CliqzUtils.getLocalizedString('never'),
              selected: false
            }
          };

          data[CliqzUtils.getPref('share_location', 'ask')].selected = true;

          return data;
        },

        // Returns result elements selecatble and navigatable from keyboard.
        // |container| search context, usually it's `CLIQZ.UI.gCliqzBox`.
        extractSelectableElements: function extractSelectableElements(container) {
          return Array.prototype.slice.call(container.querySelectorAll('[arrow]')).filter(function (el) {
            // dont consider hidden elements
            if (el.offsetParent == null) return false;

            if (!el.getAttribute('arrow-if-visible')) return true;

            // check if the element is visible
            //
            // for now this check is enough but we might be forced to switch to a
            // more generic approach - maybe using document.elementFromPoint(x, y)
            if (el.offsetLeft + el.offsetWidth > el.parentElement.offsetWidth) return false;
            return true;
          });
        },

        getNoResults: CLIQZEnvironment.getNoResults,
        getParameterByName: function getParameterByName(name, location) {
          name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
          var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
              results = regex.exec(location.search);
          return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
        },
        addEventListenerToElements: CLIQZEnvironment.addEventListenerToElements,
        search: CLIQZEnvironment.search,
        distance: function distance(lon1, lat1) {
          var lon2 = arguments.length <= 2 || arguments[2] === undefined ? CliqzUtils.USER_LNG : arguments[2];
          var lat2 = arguments.length <= 3 || arguments[3] === undefined ? CliqzUtils.USER_LAT : arguments[3];

          /** Converts numeric degrees to radians */
          function degreesToRad(degree) {
            return degree * Math.PI / 180;
          }

          var R = 6371; // Radius of the earth in km
          if (!lon2 || !lon1 || !lat2 || !lat1) {
            return -1;
          }
          var dLat = degreesToRad(lat2 - lat1); // Javascript functions in radians
          var dLon = degreesToRad(lon2 - lon1);
          var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(degreesToRad(lat1)) * Math.cos(degreesToRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
          var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          var d = R * c; // Distance in km
          return d;
        },
        getDefaultSearchEngine: CLIQZEnvironment.getDefaultSearchEngine,
        copyResult: CLIQZEnvironment.copyResult,
        openPopup: CLIQZEnvironment.openPopup,
        isOnPrivateTab: CLIQZEnvironment.isOnPrivateTab,
        getAllCliqzPrefs: CLIQZEnvironment.getAllCliqzPrefs,
        isDefaultBrowser: CLIQZEnvironment.isDefaultBrowser,
        setDefaultSearchEngine: CLIQZEnvironment.setDefaultSearchEngine,
        isUnknownTemplate: CLIQZEnvironment.isUnknownTemplate,
        historySearch: CLIQZEnvironment.historySearch,
        getEngineByName: CLIQZEnvironment.getEngineByName,
        addEngineWithDetails: CLIQZEnvironment.addEngineWithDetails,
        getEngineByAlias: CLIQZEnvironment.getEngineByAlias,
        getSearchEngines: CLIQZEnvironment.getSearchEngines,
        blackListedEngines: CLIQZEnvironment.blackListedEngines,
        updateAlias: CLIQZEnvironment.updateAlias,
        openLink: CLIQZEnvironment.openLink,
        getCliqzPrefs: function getCliqzPrefs() {
          function filterer(entry) {
            // avoid privay leaking prefs ('backup').
            // avoid irrelevant deep prefs (something.otherthing.x.y)
            // allow 'enabled' prefs
            return entry.indexOf('.') == -1 && entry.indexOf('backup') == -1 || entry.indexOf('.enabled') != -1;
          }

          var cliqzPrefs = {};
          var cliqzPrefsKeys = CliqzUtils.getAllCliqzPrefs().filter(filterer);

          for (var i = 0; i < cliqzPrefsKeys.length; i++) {
            cliqzPrefs[cliqzPrefsKeys[i]] = prefs.get(cliqzPrefsKeys[i]);
          }

          return cliqzPrefs;
        },
        promiseHttpHandler: promiseHttpHandler,
        registerResultProvider: function registerResultProvider(o) {
          CLIQZEnvironment.CliqzResultProviders = o.ResultProviders;
          CLIQZEnvironment.Result = o.Result;
        },
        lastRenderedResults: [],
        lastRenderedURLs: [],
        lastSelection: -1,
        onRenderComplete: function onRenderComplete(query, box) {
          if (!CLIQZEnvironment.onRenderComplete) return;

          CliqzUtils.lastRenderedResults = this.extractSelectableElements(box).filter(function (node) {
            return !!(node.getAttribute("url") || node.getAttribute("href"));
          });
          CliqzUtils.lastRenderedURLs = CliqzUtils.lastRenderedResults.map(function (node) {
            return node.getAttribute("url") || node.getAttribute("href");
          });

          CLIQZEnvironment.onRenderComplete(query, CliqzUtils.lastRenderedURLs);
        },
        onSelectionChange: function onSelectionChange(element) {
          if (!element) return;

          var current = CliqzUtils.lastRenderedResults.indexOf(element);
          if (current == -1) {
            current = CliqzUtils.lastRenderedURLs.indexOf(element.getAttribute("url"));
          }

          if (CliqzUtils.lastSelection == current) return;
          CliqzUtils.lastSelection = current;

          if (!CLIQZEnvironment.onResultSelectionChange) return;
          CLIQZEnvironment.onResultSelectionChange(current);
        }
      };

      _export("default", CliqzUtils);
    }
  };
});
// numbers 0 - 255
// port number
$__System.register("3", ["e", "9"], function (_export) {
  /*
   * This method implements the publish subscribe design pattern
   *
   * Event naming scheme:
   *    cliqz.module_name.event_name
   *
   *  single sender -> multiple potential recipients
   *    for example: cliqz.core.urlbar_focus (inform others about urlbar focus)
   *    module_name describes sender
   *  multiple potential senders -> single recipient
   *    for example: cliqz.msg_center.show_message (tell the message center to show a message)
   *    module_name describes recipient (this is more like a RPC)
   */

  "use strict";

  var console, CliqzUtils, CliqzEvents, subscribe;
  return {
    setters: [function (_console) {
      console = _console["default"];
    }, function (_utils) {
      CliqzUtils = _utils["default"];
    }],
    execute: function () {
      CliqzEvents = CliqzEvents || {
        //use a javascript object to push the message ids and the callbacks
        cache: {},
        tickCallbacks: [],
        /*
         * Publish events of interest with a specific id
         */
        queue: [],

        pub: function pub(id) {
          var _this = this;

          var args = Array.prototype.slice.call(arguments, 1);

          var callbacks = (CliqzEvents.cache[id] || []).map(function (ev) {
            return new Promise(function (resolve) {
              CliqzUtils.setTimeout(function () {
                try {
                  ev.apply(null, args);
                } catch (e) {
                  console.error("CliqzEvents error: " + id, e);
                }
                resolve();
              }, 0);
            });
          });

          var finishedPromise = Promise.all(callbacks).then(function () {
            var index = _this.queue.indexOf(finishedPromise);
            _this.queue.splice(index, 1);
            if (_this.queue.length === 0) {
              _this.triggerNextTick();
            }
          });
          this.queue.push(finishedPromise);
        },

        triggerNextTick: function triggerNextTick() {
          this.tickCallbacks.forEach(function (cb) {
            try {
              cb();
            } catch (e) {}
          });
          this.tickCallbacks = [];
        },

        nextTick: function nextTick() {
          var cb = arguments.length <= 0 || arguments[0] === undefined ? function () {} : arguments[0];

          this.tickCallbacks = this.tickCallbacks || [];
          this.tickCallbacks.push(cb);
        },

        /* Subscribe to events of interest
         * with a specific id and a callback
         * to be executed when the event is observed
         */
        sub: function sub(id, fn) {
          CliqzEvents.cache[id] = CliqzEvents.cache[id] || [];
          CliqzEvents.cache[id].push(fn);
        },

        subscribe: function subscribe(eventName, callback, that) {
          var cb = undefined;
          if (that) {
            cb = callback.bind(that);
          } else {
            cb = callback;
          }

          CliqzEvents.sub(eventName, cb);

          return {
            unsubscribe: function unsubscribe() {
              CliqzEvents.un_sub(eventName, cb);
            }
          };
        },

        un_sub: function un_sub(id, fn) {
          if (!CliqzEvents.cache[id] || CliqzEvents.cache[id].length === 0) {
            console.error("Trying to unsubscribe event that had no subscribers");
            return;
          }

          var index = CliqzEvents.cache[id].indexOf(fn);
          if (index > -1) {
            CliqzEvents.cache[id].splice(index, 1);
          } else {
            console.error("Trying to unsubscribe an unknown listener");
          }
        },

        clean_channel: function clean_channel(id) {
          if (!CliqzEvents.cache[id]) {
            throw "Trying to unsubscribe an unknown channel";
          }
          CliqzEvents.cache[id] = [];
        },

        /**
         * Adds a listener to eventTarget for events of type eventType, and republishes them
         *  through CliqzEvents with id cliqzEventName.
         */
        proxyEvent: function proxyEvent(cliqzEventName, eventTarget, eventType, propagate, transform) {
          if (propagate === undefined) propagate = false;

          var publisher = CliqzEvents.pub.bind(CliqzEvents, cliqzEventName);

          function handler() {
            var args = transform ? transform.apply(null, arguments) : arguments;
            publisher.apply(null, args);
          }

          eventTarget.addEventListener(eventType, handler, propagate);
          return {
            unsubscribe: function unsubscribe() {
              eventTarget.removeEventListener(eventType, handler);
            }
          };
        },

        nextId: function nextId() {
          nextId.id = nextId.id || 0;
          nextId.id += 1;
          return nextId.id;
        }
      };

      _export("default", CliqzEvents);

      subscribe = CliqzEvents.subscribe;

      _export("subscribe", subscribe);
    }
  };
});
$__System.register('24', ['18', '3'], function (_export) {
  'use strict';

  var Storage, events, storage;

  _export('getPref', getPref);

  _export('setPref', setPref);

  _export('hasPref', hasPref);

  _export('clearPref', clearPref);

  _export('enableChangeEvents', enableChangeEvents);

  _export('disableChangeEvents', disableChangeEvents);

  function getPref(pref, notFound) {
    var mypref = storage.getItem(pref);
    if (mypref) {
      if (mypref === 'false') {
        return false;
      }
      if (mypref === 'true') {
        return true;
      }
      if (!isNaN(mypref)) {
        return parseInt(mypref, 10);
      }
      return mypref;
    }
    return notFound;
  }

  function setPref(pref, val) {
    storage.setItem(pref, val);
    events.pub('prefchange', pref);
  }

  function hasPref(pref) {
    return storage.getItem(pref) !== null;
  }

  function clearPref(pref) {
    storage.removeItem(pref);
  }

  function enableChangeEvents() {
    throw new Error('not implemented - prefs.enableChangeEvents');
  }

  function disableChangeEvents() {
    throw new Error('not implemented - prefs.disableChangeEvents');
  }

  return {
    setters: [function (_coreStorage) {
      Storage = _coreStorage['default'];
    }, function (_coreEvents) {
      events = _coreEvents['default'];
    }],
    execute: function () {
      storage = new Storage();
    }
  };
});
$__System.register("17", ["24"], function (_export) {
  "use strict";

  var getPref, setPref, hasPref, clearPref, enableChangeEvents, disableChangeEvents;
  return {
    setters: [function (_platformPrefs) {
      getPref = _platformPrefs.getPref;
      setPref = _platformPrefs.setPref;
      hasPref = _platformPrefs.hasPref;
      clearPref = _platformPrefs.clearPref;
      enableChangeEvents = _platformPrefs.enableChangeEvents;
      disableChangeEvents = _platformPrefs.disableChangeEvents;
    }],
    execute: function () {
      _export("default", {
        /**
         * Get a value from preferences db
         * @param {string}  pref - preference identifier
         * @param {*=}      defautlValue - returned value in case pref is not defined
         * @param {string=} prefix - prefix for pref
         */
        get: getPref,
        /**
         * Set a value in preferences db
         * @param {string}  pref - preference identifier
         * @param {string=} prefix - prefix for pref
         */
        set: setPref,
        /**
         * Check if there is a value in preferences db
         * @param {string}  pref - preference identifier
         * @param {string=} prefix - prefix for pref
         */
        has: hasPref,
        /**
         * Clear value in preferences db
         * @param {string}  pref - preference identifier
         * @param {string=} prefix - prefix for pref
         */
        clear: clearPref,

        enableChangeEvents: enableChangeEvents,

        disableChangeEvents: disableChangeEvents
      });
    }
  };
});
$__System.register("e", ["15", "17"], function (_export) {
  "use strict";

  var console, prefs, isLoggingEnabled, log, error, debug;
  return {
    setters: [function (_platformConsole) {
      console = _platformConsole["default"];
    }, function (_prefs) {
      prefs = _prefs["default"];
    }],
    execute: function () {
      isLoggingEnabled = prefs.get('showConsoleLogs', false);
      log = undefined;
      error = undefined;
      debug = undefined;

      if (isLoggingEnabled) {
        log = console.log.bind(console, 'CLIQZ');
        error = console.error.bind(console, 'CLIQZ error');
        if (prefs.get('developer')) {
          debug = log;
        } else {
          debug = function () {};
        }
      } else {
        log = function () {};
        error = function () {};
        debug = function () {};
      }

      _export("default", {
        log: log,
        error: error,
        debug: debug
      });
    }
  };
});
$__System.register('25', ['10', 'e'], function (_export) {

  /*
  Function to create http url
  */
  'use strict';

  var CliqzSecureMessage, console;

  /*
  Converts given array to generator like object.
  */

  _export('createHttpUrl', createHttpUrl);

  _export('trkGen', trkGen);

  _export('prunelocalTemporalUniq', prunelocalTemporalUniq);

  _export('getRandomIntInclusive', getRandomIntInclusive);

  /*
  if(CliqzHumanWeb.actionStats) {
      const itemsLocalValidation = Object.keys(CliqzSecureMessage.localTemporalUniq).length;
      CliqzHumanWeb.actionStats.itemsLocalValidation = itemsLocalValidation;
  }
  */

  function createHttpUrl(host) {
    return 'http://' + host + '/verify';
  }

  function trkGen(_trk) {
    var trk = _trk;
    var idx = -1;
    return {
      next: function next() {
        idx += 1;
        if (idx < trk.length) {
          return {
            value: idx, // Return the first yielded value.
            done: false
          };
        } else {
          return {
            value: undefined, // Return undefined.
            done: true
          };
        }
      }
    };
  }

  function prunelocalTemporalUniq() {
    if (CliqzSecureMessage.localTemporalUniq && Object.keys(CliqzSecureMessage.localTemporalUniq).length > 0) {
      (function () {
        var currTime = Date.now();
        var pi = 0;
        Object.keys(CliqzSecureMessage.localTemporalUniq).forEach(function (e) {
          var d = CliqzSecureMessage.localTemporalUniq[e].ts;
          var diff = currTime - d;
          if (diff >= 24 * 60 * 60 * 1000) {
            delete CliqzSecureMessage.localTemporalUniq[e];
            pi += 1;
          }
        });
      })();
    }
  }

  function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  return {
    setters: [function (_main) {
      CliqzSecureMessage = _main['default'];
    }, function (_coreConsole) {
      console = _coreConsole['default'];
    }],
    execute: function () {}
  };
});
$__System.register('26', ['9', 'e', '14', '25', '10'], function (_export) {
  /*
  Picked up from unblock proxy.es
  */

  'use strict';

  var CliqzUtils, console, ProxyFilter, getRandomIntInclusive, CliqzSecureMessage, _default;

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ('value' in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
      }
    }return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
  }();

  var _get = function get(_x, _x2, _x3) {
    var _again = true;_function: while (_again) {
      var object = _x,
          property = _x2,
          receiver = _x3;_again = false;if (object === null) object = Function.prototype;var desc = Object.getOwnPropertyDescriptor(object, property);if (desc === undefined) {
        var parent = Object.getPrototypeOf(object);if (parent === null) {
          return undefined;
        } else {
          _x = parent;_x2 = property;_x3 = receiver;_again = true;desc = parent = undefined;continue _function;
        }
      } else if ('value' in desc) {
        return desc.value;
      } else {
        var getter = desc.get;if (getter === undefined) {
          return undefined;
        }return getter.call(receiver);
      }
    }
  };

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError('Cannot call a class as a function');
    }
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== 'function' && superClass !== null) {
      throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass);
    }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  return {
    setters: [function (_coreUtils) {
      CliqzUtils = _coreUtils['default'];
    }, function (_coreConsole) {
      console = _coreConsole['default'];
    }, function (_platformProxyFilter) {
      ProxyFilter = _platformProxyFilter['default'];
    }, function (_utils) {
      getRandomIntInclusive = _utils.getRandomIntInclusive;
    }, function (_main) {
      CliqzSecureMessage = _main['default'];
    }],
    execute: function () {
      _default = function (_ProxyFilter) {
        _inherits(_default, _ProxyFilter);

        /**
        * Wrapper for rule-based url proxying: implementation for Firefox
        * @class Proxy
        * @namespace unblock
        * @constructor
        */

        function _default() {
          _classCallCheck(this, _default);

          _get(Object.getPrototypeOf(_default.prototype), 'constructor', this).call(this);
          this.method = "socks";
          this.port = 9004;
        }

        _createClass(_default, [{
          key: 'shouldProxy',
          value: function shouldProxy(url) {
            var window = CliqzUtils.getWindow();
            return url.scheme === "https" && CliqzSecureMessage.servicesToProxy.indexOf(url.host) > -1 && (CliqzUtils.getPref('hpn-query', false) || CliqzUtils.isOnPrivateTab(window));
          }
        }, {
          key: 'proxy',
          value: function proxy() {
            if (!CliqzSecureMessage.proxyList) {
              return;
            }
            var proxyIdx = getRandomIntInclusive(0, 3);
            var proxyIP = CliqzSecureMessage.proxyList[proxyIdx];
            console.log("Proxying Query: " + proxyIP);

            if (CliqzSecureMessage.proxyInfoObj[proxyIP]) {
              return CliqzSecureMessage.proxyInfoObj[proxyIP];
            } else {
              var ob = this.newProxy(this.method, proxyIP, this.port, null, 1000, null);
              CliqzSecureMessage.proxyInfoObj[proxyIP] = ob;
              return ob;
            }
          }
        }]);

        return _default;
      }(ProxyFilter);

      _export('default', _default);

      ;
    }
  };
});
$__System.register('10', ['6', '9', 'd', 'c', 'f', '25', '12', '26', '11'], function (_export) {
  /*
   This module is used for sending the events for purpose of
   human-web, anti-tracking via a secure channel.
  */

  /* Global variables
  */
  'use strict';

  var Storage, CliqzUtils, config, ResourceLoader, sendM, hpnUtils, overRideCliqzResults, ProxyFilter, CryptoWorker, proxyCounter, CliqzSecureMessage;
  return {
    setters: [function (_platformHpnStorage) {
      Storage = _platformHpnStorage['default'];
    }, function (_coreUtils) {
      CliqzUtils = _coreUtils['default'];
    }, function (_coreConfig) {
      config = _coreConfig['default'];
    }, function (_coreResourceLoader) {
      ResourceLoader = _coreResourceLoader['default'];
    }, function (_sendMessage) {
      sendM = _sendMessage.sendM;
    }, function (_utils) {
      hpnUtils = _utils;
    }, function (_httpHandlerPatch) {
      overRideCliqzResults = _httpHandlerPatch.overRideCliqzResults;
    }, function (_proxyFilter) {
      ProxyFilter = _proxyFilter['default'];
    }, function (_cryptoWorker) {
      CryptoWorker = _cryptoWorker['default'];
    }],
    execute: function () {
      proxyCounter = 0;
      CliqzSecureMessage = {
        VERSION: '0.1',
        LOG_KEY: 'securemessage',
        debug: false,
        counter: 0,
        secureLogger: {},
        uPK: {},
        dsPK: {},
        routeTable: null,
        routeTableLoader: null,
        RSAKey: '',
        eventID: {},
        sourceMap: null,
        sourceMapLoader: null,
        tmult: 4,
        tpace: 250,
        SOURCE_MAP_PROVIDER: config.settings.ENDPOINT_SOURCE_MAP_PROVIDER,
        LOOKUP_TABLE_PROVIDER: config.settings.ENDPOINT_LOOKUP_TABLE_PROVIDER,
        KEYS_PROVIDER: config.settings.ENDPOINT_KEYS_PROVIDER,
        proxyList: null,
        proxyListLoader: null,
        proxyStats: {},
        PROXY_LIST_PROVIDER: config.settings.ENDPOINT_PROXY_LIST_PROVIDER,
        BLIND_SIGNER: config.settings.ENDPOINT_BLIND_SIGNER,
        USER_REG: config.settings.ENDPOINT_USER_REG,
        localTemporalUniq: null,
        wCrypto: null,
        queriesID: {},
        servicesToProxy: ["api.cliqz.com", "antiphishing.cliqz.com"],
        proxyInfoObj: {},
        queryProxyFilter: null,
        pacemaker: function pacemaker() {
          CliqzSecureMessage.counter += 1;

          if (CliqzSecureMessage.counter / CliqzSecureMessage.tmult % 10 === 0) {
            if (CliqzSecureMessage.debug) {
              CliqzUtils.log('Pacemaker: ' + CliqzSecureMessage.counter / CliqzSecureMessage.tmult, CliqzSecureMessage.LOG_KEY);
            }
          }

          if (CliqzSecureMessage.counter / CliqzSecureMessage.tmult % 5 === 0) {
            var currentTime = Date.now();

            if (!CliqzUtils.getWindow() || !CliqzUtils.getWindow().CLIQZ || !CliqzUtils.getWindow().CLIQZ.UI) return;
            var tDiff = currentTime - CliqzUtils.getWindow().CLIQZ.UI.lastInputTime;

            if (tDiff > 0 && tDiff > 1000 * 2 * 1) {
              CliqzSecureMessage.proxyIP();
            }

            if (!CliqzSecureMessage.uPK.publicKeyB64 || !CliqzSecureMessage.uPK.privateKey) {
              CliqzSecureMessage.registerUser();
            }
          }

          if (CliqzSecureMessage.counter / CliqzSecureMessage.tmult % (60 * 15 * 1) === 0) {
            if (CliqzSecureMessage.debug) {
              CliqzUtils.log('Clean local temp queue', CliqzSecureMessage.LOG_KEY);
            }
            hpnUtils.prunelocalTemporalUniq();
          }
        },
        // ****************************
        // telemetry, PREFER NOT TO SHARE WITH CliqzUtils for safety, blatant rip-off though
        // ****************************
        trk: [],
        trkTimer: null,
        telemetry: function telemetry(msg, instantPush) {
          if (!CliqzSecureMessage || // might be called after the module gets unloaded
          CliqzUtils.getPref('dnt', false) || CliqzUtils.isPrivate(CliqzUtils.getWindow())) return;

          if (msg) CliqzSecureMessage.trk.push(msg);
          CliqzUtils.clearTimeout(CliqzSecureMessage.trkTimer);
          if (instantPush || CliqzSecureMessage.trk.length % 20 === 0) {
            CliqzSecureMessage.pushTelemetry();
          } else {
            CliqzSecureMessage.trkTimer = CliqzUtils.setTimeout(CliqzSecureMessage.pushTelemetry, 10000);
          }
        },
        _telemetry_req: null,
        _telemetry_sending: [],
        telemetry_MAX_SIZE: 500,
        previousDataPost: null,
        pushMessage: [],
        routeHashTable: null,
        eacemakerId: null,
        queryProxyIP: null,
        performance: null,
        pushTelemetry: function pushTelemetry() {
          CliqzSecureMessage._telemetry_sending = CliqzSecureMessage.trk.splice(0);
          CliqzSecureMessage.pushMessage = hpnUtils.trkGen(CliqzSecureMessage._telemetry_sending);
          var nextMsg = CliqzSecureMessage.nextMessage();
          if (nextMsg) {
            return sendM(nextMsg);
          }
          return Promise.resolve([]);
        },
        nextMessage: function nextMessage() {
          if (CliqzSecureMessage._telemetry_sending.length > 0) {
            return CliqzSecureMessage._telemetry_sending[CliqzSecureMessage.pushMessage.next().value];
          }
        },
        initAtWindow: function initAtWindow(window) {},
        init: function init() {
          // Doing it here, because this lib. uses navigator and window objects.
          // Better method appriciated.

          if (CliqzSecureMessage.pacemakerId == null) {
            CliqzSecureMessage.pacemakerId = CliqzUtils.setInterval(CliqzSecureMessage.pacemaker.bind(this), CliqzSecureMessage.tpace, null);
          }

          // TODO: do not pass this to storage
          this.storage = new Storage(this);

          if (!CliqzSecureMessage.localTemporalUniq) this.storage.loadLocalCheckTable();

          // Load source map. Update it once an hour.
          this.sourceMapLoader = new ResourceLoader(["hpn", "sourcemap.json"], {
            remoteURL: CliqzSecureMessage.SOURCE_MAP_PROVIDER
          });

          this.sourceMapLoader.load().then(function (e) {
            CliqzSecureMessage.sourceMap = e;
          });

          this.sourceMapLoader.onUpdate(function (e) {
            return CliqzSecureMessage.sourceMap = e;
          });

          // Load proxy list. Update every 5 minutes.
          this.proxyListLoader = new ResourceLoader(["hpn", "proxylist.json"], {
            remoteURL: CliqzSecureMessage.PROXY_LIST_PROVIDER,
            cron: 1 * 5 * 60 * 1000,
            updateInterval: 1 * 5 * 60 * 1000
          });

          this.proxyListLoader.load().then(function (e) {
            CliqzSecureMessage.proxyList = e;
          });

          this.proxyListLoader.onUpdate(function (e) {
            return CliqzSecureMessage.proxyList = e;
          });

          // Load lookuptable. Update every 5 minutes.
          this.routeTableLoader = new ResourceLoader(["hpn", "routeTable.json"], {
            remoteURL: CliqzSecureMessage.LOOKUP_TABLE_PROVIDER,
            cron: 1 * 5 * 60 * 1000,
            updateInterval: 1 * 5 * 60 * 1000
          });

          this.routeTableLoader.load().then(function (e) {
            CliqzSecureMessage.routeTable = e;
          });

          this.routeTableLoader.onUpdate(function (e) {
            return CliqzSecureMessage.routeTable = e;
          });

          CliqzSecureMessage.dsPK.pubKeyB64 = config.settings.KEY_DS_PUBKEY;
          CliqzSecureMessage.secureLogger.publicKeyB64 = config.settings.KEY_SECURE_LOGGER_PUBKEY;

          if (CliqzUtils.getPref('proxyNetwork', true)) {
            overRideCliqzResults();
          }
          // Check user-key present or not.
          CliqzSecureMessage.registerUser();

          // Register proxy fr query.

          CliqzSecureMessage.queryProxyFilter = new ProxyFilter();
          CliqzSecureMessage.queryProxyFilter.init();
        },
        unload: function unload() {
          CliqzSecureMessage.queryProxyFilter.unload();
          this.storage.saveLocalCheckTable();
          CliqzSecureMessage.pushTelemetry();
          this.sourceMapLoader.stop();
          this.proxyListLoader.stop();
          this.routeTableLoader.stop();
          CliqzUtils.clearTimeout(CliqzSecureMessage.pacemakerId);
          this.storage.close();
        },
        proxyIP: function proxyIP() {
          if (!CliqzSecureMessage.proxyList) return;

          if (proxyCounter >= CliqzSecureMessage.proxyList.length) proxyCounter = 0;
          var url = hpnUtils.createHttpUrl(CliqzSecureMessage.proxyList[proxyCounter]);
          CliqzSecureMessage.queryProxyIP = url;
          proxyCounter += 1;
        },
        registerUser: function registerUser() {
          var _this = this;

          this.storage.loadKeys().then(function (userKey) {
            if (!userKey) {
              (function () {
                var userCrypto = new CryptoWorker();

                userCrypto.onmessage = function (e) {
                  if (e.data.status) {
                    var uK = {};
                    uK.privateKey = e.data.privateKey;
                    uK.publicKey = e.data.publicKey;
                    uK.ts = Date.now();
                    _this.storage.saveKeys(uK).then(function (response) {
                      if (response.status) {
                        CliqzSecureMessage.uPK.publicKeyB64 = response.data.publicKey;
                        CliqzSecureMessage.uPK.privateKey = response.data.privateKey;
                      }
                    });
                  }
                  userCrypto.terminate();
                };

                userCrypto.postMessage({
                  type: 'user-key'
                });
              })();
            } else {
              CliqzSecureMessage.uPK.publicKeyB64 = userKey.publicKey;
              CliqzSecureMessage.uPK.privateKey = userKey.privateKey;
            }
          });
        }
      };

      _export('default', CliqzSecureMessage);
    }
  };
});
$__System.register("d", [], function (_export) {
  "use strict";

  return {
    setters: [],
    execute: function () {
      _export("default", {
        "platform": "chromium",
        "brocfile": "Brocfile.webextensionhw.js",
        "baseURL": "/modules/",
        "testsBasePath": "",
        "settings": {
          "CONFIG_PROVIDER": "https://safe-browsing.ghostery.com/config",
          "ENDPOINT_BLIND_SIGNER": "https://ghostery-sign.ghostery.com/sign",
          "ENDPOINT_USER_REG": "https://ghostery-sign.ghostery.com/register",
          "ENDPOINT_SOURCE_MAP_PROVIDER": "https://ghostery-collector.ghostery.com/sourcemapjson",
          "ENDPOINT_LOOKUP_TABLE_PROVIDER": "https://ghostery-collector.ghostery.com/lookuptable",
          "ENDPOINT_KEYS_PROVIDER": "https://ghostery-collector.ghostery.com/signerKey",
          "ENDPOINT_PROXY_LIST_PROVIDER": "https://ghostery-collector.ghostery.com/proxyList",
          "ENDPOINT_PATTERNSURL": "https://safe-browsing.ghostery.com/patterns",
          "ENDPOINT_ANONPATTERNSURL": "https://safe-browsing.ghostery.com/patterns-anon",
          "ENDPOINT_CONFIGURL": "https://safe-browsing.ghostery.com/ts-config",
          "ENDPOINT_SAFE_QUORUM_ENDPOINT": "https://safe-browsing-quorum.ghostery.com/",
          "ENDPOINT_SAFE_QUORUM_PROVIDER": "https://safe-browsing-quorum.ghostery.com/config",
          "MSGCHANNEL": "web-extension",
          "KEY_DS_PUBKEY": "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAwXo4hXvboKHCggNJ0UNFvZQfDWi0jNcF1kBHthxilMu6LB/hFrSMQ+/FgTqVE36cCezWE0K1UcwmYGVsuqxcvql82RfCmYUVBroJ3UFG8qnetYfU5FOk43C555p5l5HzlF8QilcCUBCO4SCj9lEZ3/8FJboCupTqxEUq7nwUgaNZOiGKMdDUBZJO1tW4LSH4lj9IAZccEJ5HKVmJKopQ3hmzWgDqowxni4NQz+0DnsSfCGAupKaJDxjfajJosX5i674rgdHbZGtgHB3M9jhc6HFNPcmtUgLwgtUtRwMhSnya6q/O06euouNi1h0m5eRrWeMRlJSdUnelLSU8QNy7LQIDAQAB",
          "KEY_SECURE_LOGGER_PUBKEY": "MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAh5HhcRAn6+6woXQXl/NtZ+fOooNglZct/HSpYuqkcmrPauHW7EuOSq5bvpBZRTDROjR/kUPomqVZIzqhdCFPA8BwXSCz7hAel2Q157vtBvh9sngMMLXb5Fgzef5N4EuKO8pL5KrS+I9tfZac41vFJSdpgAirZYhh+tdcQQ1z0Qv/Rw0zOXjfvddCz3gEv2gB9KsLMVnTS1J4YOOgfza2adg9Ebz1z99DiF4vtCwn0IUwH/3ToTBwJLbMnC3Ol43yBNk8rgK2mkgCi614vOSD3hnVmio+iW6+AUklM8VPl6l7hEK9cljJY+9UsMVmTrvaFbMPwS6AdZCXKTmNdaMJcy3zSOXu5zvzihoQLwAu9LM3l2eVk0Mw0K7JXOP20fc8BtzWCOLYVP32r4R0BNuhTtvGqjHNZHPJN5OwaxkLpn2dujL9uDWGjRiOItKMVq/nOqmNGghrbf8IOaKT7VQhqOU4cXRkB/uF1UjYETBavwUZAxx9Wd/cMcAGmKiDxighxxQ29jDufl+2WG065tmJz+zCxmgrPh6Zb3KFUxPTe6yksAhWJhmGShA9v20t84M5c6NpZXoUsFcVja6XxzHeSB8dWq9Uu5QcZ83Gz/ronwdEjT2OGTtBgOFeTDqLYUgphC1gcUEHOCnTNXRMQOXqGwBfZHp+Mq61QcMq2rNS7xECAwEAAQ==",
          "frameScriptWhitelist": ["http://localhost:3000/"]
        },
        "priority": [],
        "modules": ["core", "hpn"],
        "subprojects": [],
        "environment": "development",
        "sourceMaps": true,
        "EXTENSION_VERSION": "1.16.0"
      });
    }
  };
});
$__System.register('11', ['d'], function (_export) {
  'use strict';

  var config, CryptoWorker;

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ('value' in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
      }
    }return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
  }();

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError('Cannot call a class as a function');
    }
  }

  return {
    setters: [function (_coreConfig) {
      config = _coreConfig['default'];
    }],
    execute: function () {
      CryptoWorker = function () {
        function CryptoWorker() {
          _classCallCheck(this, CryptoWorker);

          this.worker = new Worker(config.baseURL + 'hpn/worker.bundle.js');
        }

        _createClass(CryptoWorker, [{
          key: 'postMessage',
          value: function postMessage() {
            var _worker;

            (_worker = this.worker).postMessage.apply(_worker, arguments);
          }
        }, {
          key: 'terminate',
          value: function terminate() {
            this.worker.terminate();
          }
        }, {
          key: 'onmessage',
          set: function set(fn) {
            this.worker.onmessage = fn;
          }
        }]);

        return CryptoWorker;
      }();

      _export('default', CryptoWorker);
    }
  };
});
$__System.register('27', ['9', '2', '5', '10', '11'], function (_export) {

  /**
  * @namespace hpn
  * @class Background
  */
  'use strict';

  var CliqzUtils, background, isPlatformAtLeastInVersion, CliqzSecureMessage, CryptoWorker;
  return {
    setters: [function (_coreUtils) {
      CliqzUtils = _coreUtils['default'];
    }, function (_coreBaseBackground) {
      background = _coreBaseBackground['default'];
    }, function (_corePlatform) {
      isPlatformAtLeastInVersion = _corePlatform.isPlatformAtLeastInVersion;
    }, function (_main) {
      CliqzSecureMessage = _main['default'];
    }, function (_cryptoWorker) {
      CryptoWorker = _cryptoWorker['default'];
    }],
    execute: function () {
      _export('default', background({
        /**
        * @method init
        */
        init: function init() {
          var FF48_OR_ABOVE = isPlatformAtLeastInVersion('48.0');

          if (FF48_OR_ABOVE) {
            // We need to use this function, 'load' events do not seem to be firing...
            this.enabled = true;
            this.CliqzSecureMessage = CliqzSecureMessage;
            CliqzSecureMessage.init();
            CliqzSecureMessage.wCrypto = new CryptoWorker();
            CliqzSecureMessage.wCrypto.onmessage = function (e) {
              if (e.data.type === 'instant') {
                var callback = CliqzSecureMessage.queriesID[e.data.uid];
                delete CliqzSecureMessage.queriesID[e.data.uid];
                callback && callback({ response: e.data.res });
              }
            };
          }
        },
        /**
        * @method unload
        */
        unload: function unload() {
          if (this.enabled) {
            CliqzSecureMessage.wCrypto.terminate();
            CliqzSecureMessage.unload();
          }
        },

        actions: {
          sha1: function sha1(s) {
            var promise = new Promise(function (resolve, reject) {
              var wCrypto = new CryptoWorker();

              wCrypto.onmessage = function (e) {
                var result = e.data.result;
                wCrypto.terminate();
                resolve(result);
              };

              wCrypto.postMessage({
                "msg": s,
                "type": "hw-sha1"
              });
            });
            return promise;
          },

          sendTelemetry: function sendTelemetry(msg) {
            return CliqzSecureMessage.telemetry(msg);
          },

          sendInstantMessage: function sendInstantMessage(rp, payload) {
            CliqzSecureMessage.proxyIP();
            return new Promise(function (resolve, reject) {
              var wCrypto = new CryptoWorker();

              wCrypto.onmessage = function (e) {
                var result = JSON.parse(e.data.res).result;
                wCrypto.terminate();
                resolve(result);
              };
              wCrypto.postMessage({
                msg: {
                  action: 'instant',
                  type: 'cliqz',
                  ts: '',
                  ver: '1.5',
                  payload: payload,
                  rp: rp
                },
                uid: '',
                type: 'instant',
                sourcemap: CliqzSecureMessage.sourceMap,
                upk: CliqzSecureMessage.uPK,
                dspk: CliqzSecureMessage.dsPK,
                sspk: CliqzSecureMessage.secureLogger,
                queryproxyip: CliqzSecureMessage.queryProxyIP
              });
            });
          }
        }
      }));
    }
  };
});
$__System.register('28', ['9', '27'], function (_export) {
  'use strict';

  var utils, background, _default;

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ('value' in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
      }
    }return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
  }();

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError('Cannot call a class as a function');
    }
  }

  return {
    setters: [function (_coreUtils) {
      utils = _coreUtils['default'];
    }, function (_background) {
      background = _background['default'];
    }],
    execute: function () {
      _default = function () {
        function _default(settings) {
          _classCallCheck(this, _default);

          this.window = settings.window;
        }

        _createClass(_default, [{
          key: 'init',
          value: function init() {
            if (background.CliqzSecureMessage) {
              background.CliqzSecureMessage.initAtWindow(this.window);
            }
          }
        }, {
          key: 'unload',
          value: function unload() {}
        }, {
          key: 'status',
          value: function status() {
            if (background.CliqzSecureMessage && !utils.getPref('cliqz_core_disabled', false)) {
              return {
                visible: true,
                state: utils.getPref('hpn-query')
              };
            }
          }
        }]);

        return _default;
      }();

      _export('default', _default);
    }
  };
});
$__System.register('29', ['27', '28'], function (_export) {
  'use strict';

  var Background, Window;
  return {
    setters: [function (_background) {
      Background = _background['default'];
    }, function (_window) {
      Window = _window['default'];
    }],
    execute: function () {
      _export('default', {
        Background: Background,
        Window: Window
      });
    }
  };
});
$__System.register('1', ['29'], function (_export) {
  /* globals window */
  // FIXME: stop using this file as soon as subproject chrome-test-hw-hpn is killed
  'use strict';

  var hpn;
  return {
    setters: [function (_index) {
      hpn = _index['default'];
    }],
    execute: function () {

      window.CliqzSecureMessage = {
        init: function init() {
          this.background = hpn.Background;
          this.loadingPromise = this.background.init();
          return this.loadingPromise;
        },

        telemetry: function telemetry(msg) {
          var _this = this;

          return this.loadingPromise.then(function () {
            return _this.background.actions.sendTelemetry(msg);
          });
        },
        sha1: function sha1(msg) {
          var _this2 = this;

          return this.loadingPromise.then(function () {
            return _this2.background.actions.sha1(msg);
          });
        },

        sendInstantMessage: function sendInstantMessage(rp, payload) {
          var _this3 = this;

          return this.loadingPromise.then(function () {
            return _this3.background.actions.sendInstantMessage(rp, payload);
          });
        }
      };
    }
  };
});
})
(function(factory) {
  if (typeof define == 'function' && define.amd)
    define([], factory);
  else if (typeof module == 'object' && module.exports && typeof require == 'function')
    module.exports = factory();
  else
    factory();
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2NvcmUvYmFzZS9jb3JlL2Jhc2UvYmFja2dyb3VuZC5lcyIsIi4uL3BsYXRmb3JtL2Nocm9taXVtL3BsYXRmb3JtLmVzIiwiLi4vY29yZS9jb3JlL3BsYXRmb3JtLmVzIiwiLi4vcGxhdGZvcm0vaHBuL2Nocm9taXVtL2hwbi9zdG9yYWdlLmVzIiwiLi4vcGxhdGZvcm0vY2hyb21pdW0vaGlzdG9yeS1tYW5hZ2VyLmVzIiwiLi4vY29yZS9jb3JlL2NsaXF6LmVzIiwiLi4vcGxhdGZvcm0vY2hyb21pdW0vcmVzb3VyY2UtbG9hZGVyLXN0b3JhZ2UuZXMiLCIuLi9jb3JlL2NvcmUvcmVzb3VyY2UtbG9hZGVyLmVzIiwiaHBuL3NlbmQtbWVzc2FnZS5lcyIsImhwbi9odHRwLWhhbmRsZXItcGF0Y2guZXMiLCIuLi9wbGF0Zm9ybS9jaHJvbWl1bS9wcm94eS1maWx0ZXIuZXMiLCIuLi9wbGF0Zm9ybS9jaHJvbWl1bS9nbG9iYWxzLmVzIiwiLi4vcGxhdGZvcm0vY2hyb21pdW0vY29uc29sZS5lcyIsIi4uL3BsYXRmb3JtL2Nocm9taXVtL2Vudmlyb25tZW50LmVzIiwiLi4vcGxhdGZvcm0vY2hyb21pdW0vc3RvcmFnZS5lcyIsIi4uL2NvcmUvY29yZS9zdG9yYWdlLmVzIiwiLi4vY29yZS9jb3JlL3RsZHMuZXMiLCIuLi9wbGF0Zm9ybS9jaHJvbWl1bS9mZXRjaC5lcyIsIi4uL3BsYXRmb3JtL2Nocm9taXVtL3htbGh0dHByZXF1ZXN0LmVzIiwiLi4vcGxhdGZvcm0vY2hyb21pdW0vY2hyb21lLXVybC1oYW5kbGVyLmVzIiwiLi4vY29yZS9jb3JlL2h0dHAuZXMiLCIuLi9jb3JlL2NvcmUvZ3ppcC5lcyIsIi4uL3BsYXRmb3JtL2Nocm9taXVtL2xhbmd1YWdlLmVzIiwiLi4vY29yZS9jb3JlL2xhbmd1YWdlLmVzIiwiLi4vcGxhdGZvcm0vY2hyb21pdW0vdXJsLmVzIiwiLi4vY29yZS9jb3JlL3VybC5lcyIsIi4uL2NvcmUvY29yZS91dGlscy5lcyIsIi4uL2NvcmUvY29yZS9ldmVudHMuZXMiLCIuLi9wbGF0Zm9ybS9jaHJvbWl1bS9wcmVmcy5lcyIsIi4uL2NvcmUvY29yZS9wcmVmcy5lcyIsIi4uL2NvcmUvY29yZS9jb25zb2xlLmVzIiwiaHBuL3V0aWxzLmVzIiwiaHBuL3Byb3h5LWZpbHRlci5lcyIsImhwbi9tYWluLmVzIiwiLi4vY29yZS9jb3JlL2NvbmZpZy5lcyIsImhwbi9jcnlwdG8td29ya2VyLmVzIiwiaHBuL2JhY2tncm91bmQuZXMiLCJocG4vd2luZG93LmVzIiwiaHBuL2luZGV4LmVzIiwiaHBuL2luZGV4LmJ1bmRsZS5lcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O3lCQUVlLFVBQVUsQUFBa0Isb0JBQUUsQUFDM0M7WUFBTSxBQUFVLGFBQUcsQUFBTSxPQUFDLEFBQU0sT0FBQyxBQUFFLElBQUUsQUFBa0IsQUFBQyxBQUFDLEFBQ3pEO1lBQU0sQUFBTSxTQUFHLEFBQVUsV0FBQyxBQUFJLEFBQUMsQUFDL0I7WUFBTSxBQUFRLFdBQUcsQUFBVSxXQUFDLEFBQU0sQUFBQyxBQUNuQztZQUFNLEFBQVEsV0FBRyxBQUFVLFdBQUMsQUFBTSxBQUFDOztBQUduQztBQUFNLGVBQUMsQUFBSSxLQUFDLEFBQVUsV0FBQyxBQUFPLFdBQUksQUFBRSxBQUFDLElBQUMsQUFBTyxRQUFDLFVBQUEsQUFBTSxRQUFJLEFBQ3REO0FBQVUscUJBQUMsQUFBTyxRQUFDLEFBQU0sQUFBQyxVQUFHLEFBQVUsV0FBQyxBQUFPLFFBQUMsQUFBTSxBQUFDLFFBQUMsQUFBSSxLQUFDLEFBQVUsQUFBQyxBQUFDO0FBQzFFLEFBQUMsQUFBQyxBQUVIOztBQUFVLG1CQUFDLEFBQUksT0FBRyxTQUFTLEFBQUksT0FBVTs0Q0FBTixBQUFJLG1EQUFKO0FBQUk7QUFDckM7O2NBQU0sQUFBTyxVQUFHLEFBQU8sUUFBQyxBQUFPLFFBQUMsQUFBTSxPQUFDLEFBQUssTUFBQyxBQUFVLFlBQUUsQUFBSSxBQUFDLEFBQUMsQUFBQyxBQUVoRTs7QUFBTSxp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LEFBQUM7QUFDakI7OztlQWhEa0IsQUFBTzs7O3lCQUFQLEFBQU87Ozs7Ozs7OztNQ0ZmLEFBQUk7Ozt5QkFBSjtBQUFJLGFBQUcsRUFBQyxBQUFFLElBQUUsQUFBSSxNQUFFLEFBQUUsSUFBRSxBQUFJLE1BQUUsQUFBRSxJQUFFLEFBQUksTUFBRSxBQUFFLElBQUUsQUFBSSxNQUFFLEFBQUUsSUFBRSxBQUFJLE1BQUUsQUFBRSxJQUFFLEFBQUksTUFBRSxBQUFFLElBQUUsQUFBSSxNQUFFLEFBQUssT0FBRSxBQUFJLE1BQUUsQUFBTSxRQUFFLEFBQUksTUFBRSxBQUFFLElBQUUsQUFBSSxNQUFFLEFBQUUsSUFBRSxBQUFJLE1BQUUsQUFBRSxJQUFFLEFBQUksTUFBRSxBQUFFLElBQUUsQUFBSSxNQUFFLEFBQUUsSUFBRSxBQUFJLE1BQUUsQUFBRSxJQUFFLEFBQUksTUFBRSxBQUFFLElBQUUsQUFBSSxNQUFFLEFBQUcsS0FBRSxBQUFJLE1BQUUsQUFBRSxJQUFFLEFBQUksTUFBRSxBQUFFLElBQUUsQUFBSSxNQUFFLEFBQUUsSUFBRSxBQUFJLE1BQUUsQUFBYyxNQUFFLEFBQUksTUFBRSxBQUFFLElBQUUsQUFBSSxNQUFFLEFBQUUsSUFBRSxBQUFJLE1BQUUsQUFBRSxJQUFFLEFBQUksTUFBRSxBQUFJLE1BQUUsQUFBSSxNQUFFLEFBQUUsSUFBRSxBQUFJLE1BQUUsQUFBRSxJQUFFLEFBQUksTUFBRSxBQUFFLElBQUUsQUFBSSxNQUFFLEFBQVUsWUFBRSxBQUFJLE1BQUUsQUFBRSxJQUFFLEFBQUksTUFBRSxBQUFFLElBQUUsQUFBSSxNQUFFLEFBQUUsSUFBRSxBQUFJLE1BQUUsQUFBRSxJQUFFLEFBQUksTUFBRSxBQUFFLElBQUUsQUFBSSxNQUFFLEFBQUksTUFBRSxBQUFJLE1BQUUsQUFBRSxJQUFFLEFBQUksTUFBRSxBQUFFLElBQUUsQUFBSSxNQUFFLEFBQUUsSUFBRSxBQUFJLE1BQUUsQUFBRSxJQUFFLEFBQUksTUFBRSxBQUFFLElBQUUsQUFBSSxNQUFFLEFBQUUsSUFBRSxBQUFJLE1BQUUsQUFBRSxJQUFFLEFBQUksTUFBRSxBQUFJLE1BQUUsQUFBSSxNQUFFLEFBQXNDLFVBQUUsQUFBSSxNQUFFLEFBQUksTUFBRSxBQUFJLE1BQUUsQUFBRSxJQUFFLEFBQUksTUFBRSxBQUFFLElBQUUsQUFBSSxNQUFFLEFBQVEsVUFBRSxBQUFJLE1BQUUsQUFBTyxTQUFFLEFBQUksTUFBRSxBQUFJLE1BQUUsQUFBSSxNQUFFLEFBQW9CLE9BQUUsQUFBSSxNQUFFLEFBQUUsSUFBRSxBQUFJLE1BQUUsQUFBRyxLQUFFLEFBQUksTUFBRSxBQUFNLFFBQUUsQUFBSSxNQUFFLEFBQUUsSUFBRSxBQUFJLE1BQUUsQUFBZ0MsU0FBRSxBQUFJLE1BQUUsQUFBYyxNQUFFLEFBQUksTUFBRSxBQUFFLElBQUUsQUFBSSxNQUFFLEFBQUksTUFBRSxBQUFJLE1BQUUsQUFBRSxJQUFFLEFBQUksTUFBRSxBQUFvQixPQUFFLEFBQUksTUFBRSxBQUFJLE1BQUUsQUFBSSxNQUFFLEFBQVMsV0FBRSxBQUFJLE1BQUUsQUFBYyxNQUFFLEFBQUksTUFBRSxBQUFhLGVBQUUsQUFBSSxNQUFFLEFBQUcsS0FBRSxBQUFJLE1BQUUsQUFBb0IsT0FBRSxBQUFJLE1BQUUsQUFBTyxTQUFFLEFBQUksTUFBRSxBQUE0QyxXQUFFLEFBQUksTUFBRSxBQUEwQixRQUFFLEFBQUksTUFBRSxBQUFjLE1BQUUsQUFBSSxNQUFFLEFBQUksTUFBRSxBQUFJLE1BQUUsQUFBUyxXQUFFLEFBQUksTUFBRSxBQUFjLE1BQUUsQUFBSSxNQUFFLEFBQUksTUFBRSxBQUFJLE1BQUUsQUFBYyxNQUFFLEFBQUksTUFBRSxBQUFjLE1BQUUsQUFBSSxNQUFFLEFBQU0sUUFBRSxBQUFJLE1BQUUsQUFBTyxTQUFFLEFBQUksTUFBRSxBQUFjLE1BQUUsQUFBSSxNQUFFLEFBQWMsTUFBRSxBQUFJLE1BQUUsQUFBSSxNQUFFLEFBQUksTUFBRSxBQUFvQixPQUFFLEFBQUksTUFBRSxBQUFLLE9BQUUsQUFBSSxNQUFFLEFBQU0sUUFBRSxBQUFJLE1BQUUsQUFBVSxZQUFFLEFBQUksTUFBRSxBQUFNLFFBQUUsQUFBSSxNQUFFLEFBQUssT0FBRSxBQUFJLE1BQUUsQUFBSSxNQUFFLEFBQUksTUFBRSxBQUFPLFNBQUUsQUFBSSxNQUFFLEFBQUssT0FBRSxBQUFJLE1BQUUsQUFBTSxRQUFFLEFBQUksTUFBRSxBQUFFLElBQUUsQUFBSSxNQUFFLEFBQUUsSUFBRSxBQUFJLE1BQUUsQUFBRSxJQUFFLEFBQUksTUFBRSxBQUFFLElBQUUsQUFBSSxNQUFFLEFBQUUsSUFBRSxBQUFJLE1BQUUsQUFBRSxJQUFFLEFBQUksTUFBRSxBQUFLLE9BQUUsQUFBSSxNQUFFLEFBQUUsSUFBRSxBQUFJLE1BQUUsQUFBRSxJQUFFLEFBQUksTUFBRSxBQUFFLElBQUUsQUFBSSxNQUFFLEFBQUUsSUFBRSxBQUFJLE1BQUUsQUFBRSxJQUFFLEFBQUksTUFBRSxBQUFFLElBQUUsQUFBSSxNQUFFLEFBQUcsS0FBRSxBQUFJLE1BQUUsQUFBTyxTQUFFLEFBQUksTUFBRSxBQUFFLElBQUUsQUFBSSxNQUFFLEFBQUUsSUFBRSxBQUFJLE1BQUUsQUFBRSxJQUFFLEFBQUksTUFBRSxBQUFFLElBQUUsQUFBSSxNQUFFLEFBQUUsSUFBRSxBQUFJLE1BQUUsQUFBRSxJQUFFLEFBQUksTUFBRSxBQUFFLElBQUUsQUFBSSxNQUFFLEFBQUcsS0FBRSxBQUFJLE1BQUUsQUFBRSxJQUFFLEFBQUksTUFBRSxBQUFFLElBQUUsQUFBSSxNQUFFLEFBQUUsSUFBRSxBQUFJLE1BQUUsQUFBc0MsVUFBRSxBQUFJLE1BQUUsQUFBSSxNQUFFLEFBQUksTUFBRSxBQUFNLFFBQUUsQUFBSSxNQUFFLEFBQVEsVUFBRSxBQUFJLE1BQUUsQUFBTSxRQUFFLEFBQUksTUFBRSxBQUFJLE1BQUUsQUFBSSxNQUFFLEFBQVUsWUFBRSxBQUFJLE1BQUUsQUFBTSxRQUFFLEFBQUksTUFBRSxBQUFvQixPQUFFLEFBQUksTUFBRSxBQUFJLE1BQUUsQUFBSSxNQUFFLEFBQUUsSUFBRSxBQUFJLE1BQUUsQUFBb0IsT0FBRSxBQUFJLE1BQUUsQUFBSSxNQUFFLEFBQUksTUFBRSxBQUFRLFVBQUUsQUFBSSxNQUFFLEFBQUUsSUFBRSxBQUFJLE1BQUUsQUFBRSxJQUFFLEFBQUksTUFBRSxBQUFFLElBQUUsQUFBSSxNQUFFLEFBQUUsSUFBRSxBQUFJLE1BQUUsQUFBRSxJQUFFLEFBQUksTUFBRSxBQUFFLElBQUUsQUFBSSxNQUFFLEFBQU0sUUFBRSxBQUFJLE1BQUUsQUFBRSxJQUFFLEFBQUksTUFBRSxBQUFFLElBQUUsQUFBSSxNQUFFLEFBQUUsSUFBRSxBQUFJLE1BQUUsQUFBRSxJQUFFLEFBQUksTUFBRSxBQUFFLElBQUUsQUFBSSxNQUFFLEFBQUUsSUFBRSxBQUFJLE1BQUUsQUFBRSxJQUFFLEFBQUksTUFBRSxBQUFFLElBQUUsQUFBSSxNQUFFLEFBQUUsSUFBRSxBQUFJLE1BQUUsQUFBRSxJQUFFLEFBQUksTUFBRSxBQUFFLElBQUUsQUFBSSxNQUFFLEFBQUUsSUFBRSxBQUFJLE1BQUUsQUFBRSxJQUFFLEFBQUksTUFBRSxBQUFFLElBQUUsQUFBSSxNQUFFLEFBQUUsSUFBRSxBQUFJLE1BQUUsQUFBRSxJQUFFLEFBQUksTUFBRSxBQUFPLFNBQUUsQUFBSSxNQUFFLEFBQUUsSUFBRSxBQUFJLE1BQUUsQUFBRSxJQUFFLEFBQUksTUFBRSxBQUFFLElBQUUsQUFBSSxNQUFFLEFBQTBCLFFBQUUsQUFBSSxNQUFFLEFBQUssT0FBRSxBQUFJLE1BQUUsQUFBYyxNQUFFLEFBQUksTUFBRSxBQUFVLFlBQUUsQUFBSSxNQUFFLEFBQUUsSUFBRSxBQUFJLE1BQUUsQUFBRSxJQUFFLEFBQUksTUFBRSxBQUFFLElBQUUsQUFBSSxNQUFFLEFBQUUsSUFBRSxBQUFJLE1BQUUsQUFBRSxJQUFFLEFBQUksTUFBRSxBQUFFLElBQUUsQUFBSSxNQUFFLEFBQUUsSUFBRSxBQUFJLE1BQUUsQUFBRSxJQUFFLEFBQUksTUFBRSxBQUFFLElBQUUsQUFBSSxNQUFFLEFBQUUsSUFBRSxBQUFJLE1BQUUsQUFBTyxTQUFFLEFBQUksTUFBRSxBQUFFLElBQUUsQUFBSSxNQUFFLEFBQU0sUUFBRSxBQUFJLE1BQUUsQUFBRyxLQUFFLEFBQUksTUFBRSxBQUFjLE1BQUUsQUFBSSxNQUFFLEFBQUUsSUFBRSxBQUFJLE1BQUUsQUFBc0MsVUFBRSxBQUFJLE1BQUUsQUFBSyxPQUFFLEFBQUksTUFBRSxBQUFFLElBQUUsQUFBSSxNQUFFLEFBQUksTUFBRSxBQUFJLE1BQUUsQUFBSSxNQUFFLEFBQUksTUFBRSxBQUFFLElBQUUsQUFBSSxNQUFFLEFBQWdDLFNBQUUsQUFBSSxNQUFFLEFBQUUsSUFBRSxBQUFJLE1BQUUsQUFBSyxPQUFFLEFBQUksTUFBRSxBQUFFLElBQUUsQUFBSSxNQUFFLEFBQUUsSUFBRSxBQUFJLE1BQUUsQUFBSSxNQUFFLEFBQUksTUFBRSxBQUFFLElBQUUsQUFBSSxNQUFFLEFBQUUsSUFBRSxBQUFJLE1BQUUsQUFBRSxJQUFFLEFBQUksTUFBRSxBQUFFLElBQUUsQUFBSSxNQUFFLEFBQUUsSUFBRSxBQUFJLE1BQUUsQUFBRSxJQUFFLEFBQUksTUFBRSxBQUEwQixRQUFFLEFBQUksTUFBRSxBQUFFLElBQUUsQUFBSSxNQUFFLEFBQVEsVUFBRSxBQUFJLE1BQUUsQUFBRSxJQUFFLEFBQUksTUFBRSxBQUFnQyxTQUFFLEFBQUksTUFBRSxBQUFHLEtBQUUsQUFBSSxNQUFFLEFBQW9CLE9BQUUsQUFBSSxNQUFFLEFBQUcsS0FBRSxBQUFJLE1BQUUsQUFBVSxZQUFFLEFBQUksTUFBRSxBQUFHLEtBQUUsQUFBSSxNQUFFLEFBQVMsV0FBRSxBQUFJLE1BQUUsQUFBRyxLQUFFLEFBQUksTUFBRSxBQUFRLFVBQUUsQUFBSSxNQUFFLEFBQU8sU0FBRSxBQUFJLE1BQUUsQUFBd0QsYUFBRSxBQUFJLE1BQUUsQUFBb0IsT0FBRSxBQUFJLE1BQUUsQUFBTyxTQUFFLEFBQUksTUFBRSxBQUFHLEtBQUUsQUFBSSxNQUFFLEFBQWMsTUFBRSxBQUFJLE1BQUUsQUFBSSxNQUFFLEFBQUksTUFBRSxBQUFPLFNBQUUsQUFBSSxNQUFFLEFBQTBCLFFBQUUsQUFBSSxNQUFFLEFBQW9CLE9BQUUsQUFBSSxNQUFFLEFBQVUsWUFBRSxBQUFJLE1BQUUsQUFBb0IsT0FBRSxBQUFJLE1BQUUsQUFBNEMsV0FBRSxBQUFJLE1BQUUsQUFBSSxNQUFFLEFBQUksTUFBRSxBQUFPLFNBQUUsQUFBSSxNQUFFLEFBQUUsSUFBRSxBQUFJLE1BQUUsQUFBSyxPQUFFLEFBQUksTUFBRSxBQUFnQyxTQUFFLEFBQUksTUFBRSxBQUFHLEtBQUUsQUFBSSxNQUFFLEFBQUksTUFBRSxBQUFJLE1BQUUsQUFBRSxJQUFFLEFBQUksTUFBRSxBQUFHLEtBQUUsQUFBSSxNQUFFLEFBQW9CLE9BQUUsQUFBSSxNQUFFLEFBQU0sUUFBRSxBQUFJLE1BQUUsQUFBb0IsT0FBRSxBQUFJLE1BQUUsQUFBUyxXQUFFLEFBQUksTUFBRSxBQUFLLE9BQUUsQUFBSSxNQUFFLEFBQU0sUUFBRSxBQUFJLE1BQUUsQUFBTSxRQUFFLEFBQUksTUFBRSxBQUFjLE1BQUUsQUFBSSxNQUFFLEFBQU8sU0FBRSxBQUFJLE1BQUUsQUFBTyxTQUFFLEFBQUksTUFBRSxBQUFRLFVBQUUsQUFBSSxNQUFFLEFBQXNDLFVBQUUsQUFBSSxNQUFFLEFBQTBCLFFBQUUsQUFBSSxNQUFFLEFBQTRDLFdBQUUsQUFBSSxNQUFFLEFBQU8sU0FBRSxBQUFJLE1BQUUsQUFBRSxJQUFFLEFBQUksTUFBRSxBQUFFLElBQUUsQUFBSSxNQUFFLEFBQWdDLFNBQUUsQUFBSSxNQUFFLEFBQUUsSUFBRSxBQUFJLE1BQUUsQUFBRSxJQUFFLEFBQUksTUFBRSxBQUFFLElBQUUsQUFBSSxNQUFFLEFBQUUsSUFBRSxBQUFJLE1BQUUsQUFBRSxJQUFFLEFBQUksTUFBRSxBQUFFLElBQUUsQUFBSSxNQUFFLEFBQUUsSUFBRSxBQUFJLE1BQUUsQUFBSSxNQUFFLEFBQUksTUFBRSxBQUFFLElBQUUsQUFBSSxNQUFFLEFBQU0sUUFBRSxBQUFJLE1BQUUsQUFBTyxTQUFFLEFBQUksTUFBRSxBQUEwQixRQUFFLEFBQUksTUFBRSxBQUFLLE9BQUUsQUFBSSxNQUFFLEFBQVMsV0FBRSxBQUFJLE1BQUUsQUFBYyxNQUFFLEFBQUksTUFBRSxBQUFPLFNBQUUsQUFBSSxNQUFFLEFBQVEsVUFBRSxBQUFJLE1BQUUsQUFBNEMsV0FBRSxBQUFJLE1BQUUsQUFBSSxNQUFFLEFBQUksTUFBRSxBQUFJLE1BQUUsQUFBSSxNQUFFLEFBQU8sU0FBRSxBQUFJLE1BQUUsQUFBSSxNQUFFLEFBQUksTUFBRSxNQUFJLEFBQUksTUFBRSxBQUFFLElBQUUsQUFBSSxNQUFFLEFBQUUsSUFBRSxBQUFJLE1BQUUsQUFBRSxJQUFFLEFBQUksTUFBRSxBQUFXLGFBQUUsQUFBSSxNQUFFLEFBQUUsSUFBRSxBQUFJLE1BQUUsQUFBSyxPQUFFLEFBQUksTUFBRSxBQUFFLElBQUUsQUFBSSxNQUFFLEFBQVEsVUFBRSxBQUFJLE1BQUUsQUFBTSxRQUFFLEFBQUksTUFBRSxBQUFJLE1BQUUsQUFBSSxNQUFFLEFBQWMsTUFBRSxBQUFJLE1BQUUsQUFBRyxLQUFFLEFBQUksTUFBRSxBQUFFLElBQUUsQUFBSSxNQUFFLEFBQU8sU0FBRSxBQUFJLE1BQUUsQUFBb0IsT0FBRSxBQUFJLE1BQUUsQUFBTSxRQUFFLEFBQUksTUFBRSxBQUFJLE1BQUUsQUFBSSxNQUFFLEFBQW9CLE9BQUUsQUFBSSxNQUFFLEFBQWMsTUFBRSxBQUFJLE1BQUUsQUFBUSxVQUFFLEFBQUksTUFBRSxBQUFJLE1BQUUsQUFBSSxNQUFFLEFBQU0sUUFBRSxBQUFJLE1BQUUsQUFBTSxRQUFFLEFBQUksTUFBRSxBQUFRLFVBQUUsQUFBSSxNQUFFLEFBQUssT0FBRSxBQUFJLE1BQUUsQUFBRSxJQUFFLEFBQUksTUFBRSxBQUFJLE1BQUUsQUFBSSxNQUFFLEFBQVEsVUFBRSxBQUFJLE1BQUUsQUFBYyxNQUFFLEFBQUksTUFBRSxBQUFFLElBQUUsQUFBSSxNQUFFLEFBQUUsSUFBRSxBQUFJLE1BQUUsQUFBRSxJQUFFLEFBQUksTUFBRSxBQUFFLElBQUUsQUFBSSxNQUFFLEFBQUUsSUFBRSxBQUFJLE1BQUUsQUFBTyxTQUFFLEFBQUksTUFBRSxBQUEwQixRQUFFLEFBQUksTUFBRSxBQUFnQyxTQUFFLEFBQUksTUFBRSxBQUFFLElBQUUsQUFBSSxNQUFFLEFBQUksTUFBRSxBQUFJLE1BQUUsQUFBRyxLQUFFLEFBQUksTUFBRSxBQUFHLEtBQUUsQUFBSSxNQUFFLEFBQUUsSUFBRSxBQUFJLE1BQUUsQUFBRSxJQUFFLEFBQUksTUFBRSxBQUFFLElBQUUsQUFBSSxNQUFFLEFBQUUsSUFBRSxBQUFJLE1BQUUsQUFBRSxJQUFFLEFBQUksTUFBRSxBQUFFLElBQUUsQUFBSSxNQUFFLEFBQUUsSUFBRSxBQUFJLE1BQUUsQUFBRSxJQUFFLEFBQUksTUFBRSxBQUFFLElBQUUsQUFBSSxNQUFFLEFBQUUsSUFBRSxBQUFJLE1BQUUsQUFBRSxJQUFFLEFBQUksTUFBRSxBQUFTLFdBQUUsQUFBSSxNQUFFLEFBQUUsSUFBRSxBQUFJLE1BQUUsQUFBRSxJQUFFLEFBQUksTUFBRSxBQUFFLElBQUUsQUFBSSxNQUFFLEFBQUUsSUFBRSxBQUFJLE1BQUUsQUFBRSxJQUFFLEFBQUksTUFBRSxBQUFFLElBQUUsQUFBSSxNQUFFLEFBQUUsSUFBRSxBQUFJLE1BQUUsQUFBRSxJQUFFLEFBQUksTUFBRSxBQUFFLElBQUUsQUFBSSxNQUFFLEFBQUUsSUFBRSxBQUFJLE1BQUUsQUFBRSxJQUFFLEFBQUksTUFBRSxBQUFFLElBQUUsQUFBSSxNQUFFLEFBQVEsVUFBRSxBQUFJLE1BQUUsQUFBSSxNQUFFLEFBQUksTUFBRSxBQUFFLElBQUUsQUFBSSxNQUFFLEFBQUUsSUFBRSxBQUFJLE1BQUUsQUFBRSxJQUFFLEFBQUksTUFBRSxBQUFFLElBQUUsQUFBSSxNQUFFLEFBQUUsSUFBRSxBQUFJLE1BQUUsQUFBRSxJQUFFLEFBQUksTUFBRSxBQUFFLElBQUUsQUFBSSxNQUFFLEFBQUUsSUFBRSxBQUFJLE1BQUUsQUFBRSxJQUFFLEFBQUksTUFBRSxBQUFFLElBQUUsQUFBSSxNQUFFLEFBQUUsSUFBRSxBQUFJLE1BQUUsQUFBYyxNQUFFLEFBQUksTUFBRSxBQUFJLE1BQUUsQUFBSSxNQUFFLEFBQVEsVUFBRSxBQUFJLE1BQUUsQUFBTSxRQUFFLEFBQUksTUFBRSxBQUE0QyxXQUFFLEFBQUksTUFBRSxBQUFRLFVBQUUsQUFBSSxNQUFFLEFBQXNDLFVBQUUsQUFBSSxNQUFFLEFBQTBCLFFBQUUsQUFBSSxNQUFFLEFBQVEsVUFBRSxBQUFJLE1BQUUsQUFBRSxJQUFFLEFBQUksTUFBRSxBQUFFLElBQUUsQUFBSSxNQUFFLEFBQUUsSUFBRSxBQUFJLE1BQUUsQUFBRSxJQUFFLEFBQUksTUFBRSxBQUFFLElBQUUsQUFBSSxNQUFFLEFBQUUsSUFBRSxBQUFJLE1BQUUsQUFBRSxJQUFFLEFBQUksTUFBRSxBQUFFLElBQUUsQUFBSSxNQUFFLEFBQUUsSUFBRSxBQUFJLE1BQUUsQUFBRSxJQUFFLEFBQUksTUFBRSxBQUFFLElBQUUsQUFBSSxNQUFFLEFBQUUsSUFBRSxBQUFJLE1BQUUsQUFBRSxJQUFFLEFBQUksTUFBRSxNQUFJLEFBQUksTUFBRSxBQUFFLElBQUUsQUFBSSxNQUFFLEFBQUUsSUFBRSxBQUFJLE1BQUUsQUFBTSxRQUFFLEFBQUksTUFBRSxBQUFTLFdBQUUsQUFBSSxNQUFFLEFBQUssT0FBRSxBQUFJLE1BQUUsQUFBTSxRQUFFLEFBQUksTUFBRSxBQUFnQyxTQUFFLEFBQUksTUFBRSxBQUFRLFVBQUUsQUFBSSxNQUFFLEFBQUcsS0FBRSxBQUFJLE1BQUUsQUFBVyxhQUFFLEFBQUksTUFBRSxBQUFJLE1BQUUsQUFBSSxNQUFFLEFBQU0sUUFBRSxBQUFJLE1BQUUsQUFBSyxPQUFFLEFBQUksTUFBRSxBQUFFLElBQUUsQUFBSSxNQUFFLEFBQXNDLFVBQUUsQUFBSSxNQUFFLEFBQUcsS0FBRSxBQUFJLE1BQUUsQUFBTSxRQUFFLEFBQUksTUFBRSxBQUFjLE1BQUUsQUFBSSxNQUFFLEFBQTBCLFFBQUUsQUFBSSxNQUFFLEFBQU8sU0FBRSxBQUFJLE1BQUUsQUFBSyxPQUFFLEFBQUksTUFBRSxBQUFzQyxVQUFFLEFBQUksTUFBRSxBQUFHLEtBQUUsQUFBSSxNQUFFLEFBQUcsS0FBRSxBQUFJLE1BQUUsQUFBa0QsWUFBRSxBQUFJLE1BQUUsQUFBSSxNQUFFLEFBQUksTUFBRSxBQUEwQixRQUFFLEFBQUksTUFBRSxBQUFLLE9BQUUsQUFBSSxNQUFFLEFBQWMsTUFBRSxBQUFJLE1BQUUsQUFBRSxJQUFFLEFBQUksTUFBRSxBQUFPLFNBQUUsQUFBSSxNQUFFLEFBQVcsYUFBRSxBQUFJLE1BQUUsQUFBSyxPQUFFLEFBQUksTUFBRSxBQUFNLFFBQUUsQUFBSSxNQUFFLEFBQVMsV0FBRSxBQUFJLE1BQUUsQUFBRSxJQUFFLEFBQUksTUFBRSxBQUFFLElBQUUsQUFBSSxNQUFFLEFBQUUsSUFBRSxBQUFJLE1BQUUsQUFBRSxJQUFFLEFBQUksTUFBRSxBQUFFLElBQUUsQUFBSSxNQUFFLEFBQUUsSUFBRSxBQUFJLE1BQUUsQUFBRSxJQUFFLEFBQUksTUFBRSxBQUFFLElBQUUsQUFBSSxNQUFFLEFBQUUsSUFBRSxBQUFJLE1BQUUsQUFBRSxJQUFFLEFBQUksTUFBRSxBQUFFLElBQUUsQUFBSSxNQUFFLEFBQUUsSUFBRSxBQUFJLE1BQUUsQUFBRSxJQUFFLEFBQUksTUFBRSxBQUFFLElBQUUsQUFBSSxNQUFFLEFBQUUsSUFBRSxBQUFJLE1BQUUsQUFBRSxJQUFFLEFBQUksTUFBRSxBQUFFLElBQUUsQUFBSSxNQUFFLEFBQUUsSUFBRSxBQUFJLE1BQUUsQUFBRSxJQUFFLEFBQUksTUFBRSxBQUFJLE1BQUUsQUFBSSxNQUFFLEFBQUUsSUFBRSxBQUFJLE1BQUUsQUFBRSxJQUFFLEFBQUksTUFBRSxBQUFFLElBQUUsQUFBSSxNQUFFLEFBQUksTUFBRSxBQUFJLE1BQUUsQUFBc0MsVUFBRSxBQUFJLE1BQUUsQUFBTSxRQUFFLEFBQUksTUFBRSxBQUFHLEtBQUUsQUFBSSxNQUFFLEFBQTBCLFFBQUUsQUFBSSxNQUFFLEFBQU0sUUFBRSxBQUFJLE1BQUUsQUFBTSxRQUFFLEFBQUksTUFBRSxBQUFJLE1BQUUsQUFBSSxNQUFFLEFBQTRDLFdBQUUsQUFBSSxNQUFFLEFBQUUsSUFBRSxBQUFJLE1BQUUsQUFBRSxJQUFFLEFBQUksTUFBRSxBQUFFLElBQUUsQUFBSSxNQUFFLEFBQUUsSUFBRSxBQUFJLE1BQUUsQUFBWSxjQUFFLEFBQUksTUFBRSxBQUFFLElBQUUsQUFBSSxNQUFFLEFBQUssT0FBRSxBQUFJLE1BQUUsQUFBRSxJQUFFLEFBQUksTUFBRSxBQUFJLE1BQUUsQUFBSSxNQUFFLEFBQW9FLGVBQUUsQUFBSSxNQUFFLEFBQUUsSUFBRSxBQUFJLE1BQUUsQUFBRSxJQUFFLEFBQUksTUFBRSxBQUFFLElBQUUsQUFBSSxNQUFFLEFBQUUsSUFBRSxBQUFJLE1BQUUsQUFBRSxJQUFFLEFBQUksTUFBRSxBQUFFLElBQUUsQUFBSSxNQUFFLEFBQVEsVUFBRSxBQUFJLE1BQUUsQUFBRSxJQUFFLEFBQUksTUFBRSxBQUFJLE1BQUUsQUFBSSxNQUFFLEFBQUUsSUFBRSxBQUFJLE1BQUUsQUFBRSxJQUFFLEFBQUksTUFBRSxBQUFFLElBQUUsQUFBSSxNQUFFLEFBQUUsSUFBRSxBQUFJLE1BQUUsQUFBRyxLQUFFLEFBQUksTUFBRSxBQUFFLElBQUUsQUFBSSxNQUFFLEFBQUUsSUFBRSxBQUFJLE1BQUUsQUFBRSxJQUFFLEFBQUksTUFBRSxBQUFFLElBQUUsQUFBSSxNQUFFLEFBQUUsSUFBRSxBQUFJLE1BQUUsQUFBRSxJQUFFLEFBQUksTUFBRSxBQUFFLElBQUUsQUFBSSxNQUFFLEFBQUUsSUFBRSxBQUFJLE1BQUUsQUFBRSxJQUFFLEFBQUksTUFBRSxBQUFFLElBQUUsQUFBSSxNQUFFLEFBQUUsSUFBRSxBQUFJLE1BQUUsQUFBRSxJQUFFLEFBQUksTUFBRSxBQUFFLElBQUUsQUFBSSxNQUFFLEFBQUssT0FBRSxBQUFJLE1BQUUsQUFBRSxJQUFFLEFBQUksTUFBRSxBQUFFLElBQUUsQUFBSSxNQUFFLEFBQUUsSUFBRSxBQUFJLE1BQUUsQUFBRSxJQUFFLEFBQUksTUFBRSxBQUFFLElBQUUsQUFBSSxNQUFFLEFBQUssT0FBRSxBQUFJLE1BQUUsQUFBRSxJQUFFLEFBQUksTUFBRSxBQUEwQixRQUFFLEFBQUksTUFBRSxBQUFFLElBQUUsQUFBSSxNQUFFLEFBQWdDLFNBQUUsQUFBSSxNQUFF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QUMsV0FGSyxBQUFJO0FBR1osQUFDRDtBQUFJLGNBQUEsY0FBQyxBQUFHLEtBQUU7dUJBQ1I7O3NCQUFZLEFBQWMsZUFBQyxBQUFJLEtBQy9CO21CQUFNLE9BQUssQUFBVSxXQUFDLEFBQU8sUUFBQyxBQUFJLEtBQUMsQUFBRyxBQUFDO0FBQUEsQUFDdEMsQUFBQyxXQUZLLEFBQUk7QUFHWixBQUVEOztBQUFrQiw0QkFBQSw0QkFBQyxBQUFFLElBQUUsQUFBTyxTQUFFO3VCQUM5Qjs7c0JBQVksQUFBYyxlQUFDLEFBQUksS0FDN0I7bUJBQU0sT0FBSyxBQUFVLFdBQUMsQUFBTyxRQUFDLEFBQWtCLG1CQUFDLEFBQUUsSUFBRSxBQUFPLEFBQUM7QUFBQSxBQUM5RCxBQUFDLFdBRkssQUFBSTtBQUdaLEFBQ0YsQUFBQztBQXZCMEIsQUFDMUIiLCJmaWxlIjoiaW5kZXguYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGV2ZW50cyBmcm9tICcuLi9ldmVudHMnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAob3JpZ2luYWxCYWNrZ3JvdW5kKSB7XG4gIGNvbnN0IGJhY2tncm91bmQgPSBPYmplY3QuYXNzaWduKHt9LCBvcmlnaW5hbEJhY2tncm91bmQpO1xuICBjb25zdCBiZ0luaXQgPSBiYWNrZ3JvdW5kLmluaXQ7XG4gIGNvbnN0IGJnVW5sb2FkID0gYmFja2dyb3VuZC51bmxvYWQ7XG4gIGNvbnN0IGJnRXZlbnRzID0gYmFja2dyb3VuZC5ldmVudHM7XG5cbiAgLy8gYmluZCBhY3Rpb25zIHRvIGJhY2tncm91bmQgb2JqZWN0XG4gIE9iamVjdC5rZXlzKGJhY2tncm91bmQuYWN0aW9ucyB8fCB7fSkuZm9yRWFjaChhY3Rpb24gPT4ge1xuICAgIGJhY2tncm91bmQuYWN0aW9uc1thY3Rpb25dID0gYmFja2dyb3VuZC5hY3Rpb25zW2FjdGlvbl0uYmluZChiYWNrZ3JvdW5kKTtcbiAgfSk7XG5cbiAgYmFja2dyb3VuZC5pbml0ID0gZnVuY3Rpb24gaW5pdCguLi5hcmdzKSB7XG4gICAgY29uc3QgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZShiZ0luaXQuYXBwbHkoYmFja2dyb3VuZCwgYXJncykpO1xuXG4gICAgT2JqZWN0LmtleXMoYmdFdmVudHMgfHwge30pLmZvckVhY2goZXZlbnQgPT4ge1xuICAgICAgYmdFdmVudHNbZXZlbnRdID0gYmdFdmVudHNbZXZlbnRdLmJpbmQoYmFja2dyb3VuZCk7XG4gICAgICBldmVudHMuc3ViKGV2ZW50LCBiZ0V2ZW50c1tldmVudF0pO1xuICAgIH0pO1xuICAgIHJldHVybiBwcm9taXNlO1xuICB9O1xuXG4gIGJhY2tncm91bmQudW5sb2FkID0gZnVuY3Rpb24gdW5sb2FkKC4uLmFyZ3MpIHtcbiAgICBPYmplY3Qua2V5cyhiZ0V2ZW50cyB8fCB7fSkuZm9yRWFjaChldmVudCA9PiB7XG4gICAgICBldmVudHMudW5fc3ViKGV2ZW50LCBiZ0V2ZW50c1tldmVudF0pO1xuICAgIH0pO1xuXG4gICAgYmdVbmxvYWQuYXBwbHkoYmFja2dyb3VuZCwgYXJncyk7XG4gIH07XG5cbiAgcmV0dXJuIGJhY2tncm91bmQ7XG59XG4iLCJleHBvcnQgZGVmYXVsdCB7XG4gIGlzTW9iaWxlOiBmYWxzZSxcbiAgaXNGaXJlZm94OiBmYWxzZSxcbiAgaXNDaHJvbWl1bTogdHJ1ZVxufTtcbmV4cG9ydCBmdW5jdGlvbiBpc1BsYXRmb3JtQXRMZWFzdEluVmVyc2lvbih2ZXJzaW9uKSB7XG4gIHJldHVybiB0cnVlO1xufVxuIiwiaW1wb3J0IHBsYXRmb3JtIGZyb20gJy4uL3BsYXRmb3JtL3BsYXRmb3JtJztcblxuZXhwb3J0IHsgaXNQbGF0Zm9ybUF0TGVhc3RJblZlcnNpb24gfSBmcm9tICcuLi9wbGF0Zm9ybS9wbGF0Zm9ybSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBub3RJbXBsZW1lbnRlZCgpIHtcbiAgdGhyb3cgbmV3IEVycm9yKCdOb3QgaW1wbGVtZW50ZWQnKTtcbn1cblxuZXhwb3J0IGxldCBpc0ZpcmVmb3ggPSBwbGF0Zm9ybS5pc0ZpcmVmb3g7XG5leHBvcnQgbGV0IGlzTW9iaWxlID0gcGxhdGZvcm0uaXNNb2JpbGU7XG5leHBvcnQgbGV0IGlzQ2hyb21pdW0gPSBwbGF0Zm9ybS5pc0Nocm9taXVtO1xuZXhwb3J0IGxldCBwbGF0Zm9ybU5hbWUgPSBwbGF0Zm9ybS5wbGF0Zm9ybU5hbWU7XG4iLCIvLyBUT0RPOiB0aGlzIGVudGlyZSBmaWxlIHJlcXVpcmVzIGEgcmV3cml0ZSBmcm9tIGdyb3VuZCB1cFxuY29uc3QgQ2xpcXpDaHJvbWVEQiA9IHtcbiAgVkVSU0lPTjogJzAuMScsXG4gIHNldDogZnVuY3Rpb24oZGIsIGtleSwgb2JqLCBjYWxsYmFjaykge1xuICAgIHZhciBkYktleSA9IGRiKyc6JytrZXk7XG4gICAgdmFyIG8gPSB7fTtcbiAgICBvW2RiS2V5XSA9IG9iajtcbiAgICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQobywgY2FsbGJhY2spO1xuICB9LFxuICBnZXQ6IGZ1bmN0aW9uKGRiLCBrZXlWYWx1ZU9yRnVuY3Rpb24sIGNhbGxiYWNrKSB7XG5cbiAgICBpZiAodHlwZW9mIGtleVZhbHVlT3JGdW5jdGlvbiA9PT0gJ2Z1bmN0aW9uJykge1xuXG4gICAgICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQobnVsbCwgZnVuY3Rpb24oaXRlbXMpIHtcbiAgICAgICAgdmFyIHJlc3VsdHMgPSBbXTtcbiAgICAgICAgT2JqZWN0LmtleXMoaXRlbXMpLmZvckVhY2goIGZ1bmN0aW9uKGxhYikge1xuICAgICAgICAgIGlmIChsYWIuc3RhcnRzV2l0aChkYikpIHtcbiAgICAgICAgICAgIGlmIChrZXlWYWx1ZU9yRnVuY3Rpb24oaXRlbXNbbGFiXSkpIHJlc3VsdHMucHVzaChpdGVtc1tsYWJdKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBjYWxsYmFjayhyZXN1bHRzKTtcbiAgICAgIH0pO1xuXG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdmFyIGRiS2V5ID0gZGIrJzonK2tleVZhbHVlT3JGdW5jdGlvbjtcbiAgICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChkYktleSwgZnVuY3Rpb24oaXRlbXMpIHtcbiAgICAgICAgY2FsbGJhY2soaXRlbXNbZGJLZXldKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSxcbiAgcmVtb3ZlOiBmdW5jdGlvbihkYiwga2V5VmFsdWVPckZ1bmN0aW9uLCBjYWxsYmFjaykge1xuXG4gICAgaWYgKHR5cGVvZiBrZXlWYWx1ZU9yRnVuY3Rpb24gPT09ICdmdW5jdGlvbicpIHtcblxuICAgICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KG51bGwsIGZ1bmN0aW9uKGl0ZW1zKSB7XG4gICAgICAgIHZhciByZXN1bHRzVG9CZVJlbW92ZWQgPSBbXTtcbiAgICAgICAgT2JqZWN0LmtleXMoaXRlbXMpLmZvckVhY2goIGZ1bmN0aW9uKGxhYikge1xuICAgICAgICAgIGlmIChsYWIuc3RhcnRzV2l0aChkYikpIHtcbiAgICAgICAgICAgIGlmIChrZXlWYWx1ZU9yRnVuY3Rpb24oaXRlbXNbbGFiXSkpIHtcbiAgICAgICAgICAgICAgdmFyIGRiS2V5ID0gZGIrJzonK2xhYjtcbiAgICAgICAgICAgICAgcmVzdWx0c1RvQmVSZW1vdmVkLnB1c2goZGJLZXkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgY2hyb21lLnN0b3JhZ2UubG9jYWwucmVtb3ZlKHJlc3VsdHNUb0JlUmVtb3ZlZCwgY2FsbGJhY2spXG4gICAgICB9KTtcblxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHZhciBkYktleSA9IGRiKyc6JytrZXlWYWx1ZU9yRnVuY3Rpb247XG4gICAgICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5yZW1vdmUoZGJLZXksIGNhbGxiYWNrKTtcbiAgICB9XG4gIH0sXG4gIHNpemU6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0Qnl0ZXNJblVzZShudWxsLCBmdW5jdGlvbihhKSB7XG4gICAgICB2YXIgcmVzID0gW2EsIGEvY2hyb21lLnN0b3JhZ2UubG9jYWwuUVVPVEFfQllURVNdO1xuICAgICAgY29uc29sZS5sb2coJ0N1cnJlbnQgc2l6ZTogJywgcmVzWzBdLCByZXNbMV0pO1xuICAgICAgaWYgKGNhbGxiYWNrKSBjYWxsYmFjayhyZXMpO1xuICAgIH0pO1xuICB9LFxuICByZW1vdmVFdmVyeXRoaW5nOiBmdW5jdGlvbigpIHtcbiAgICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5jbGVhcigpO1xuICAgIENsaXF6Q2hyb21lREIuc2l6ZSgpO1xuICB9LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3Mge1xuICBjb25zdHJ1Y3RvcihDbGlxelNlY3VyZU1lc3NhZ2UpIHtcbiAgICB0aGlzLkNsaXF6U2VjdXJlTWVzc2FnZSA9IENsaXF6U2VjdXJlTWVzc2FnZTtcbiAgfVxuXG4gIGNsb3NlKCkge1xuICB9XG5cbiAgc2F2ZVJlY29yZChpZCwgZGF0YSkge1xuICAgIENsaXF6Q2hyb21lREIuc2V0KCdocG4nLCBpZCwgZGF0YSk7XG4gIH1cblxuICBsb2FkUmVjb3JkKGlkKSB7XG4gICAgdmFyIHByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xuICAgICAgQ2xpcXpDaHJvbWVEQi5nZXQoJ2hwbicsIGlkLCBmdW5jdGlvbihvYmopIHtcbiAgICAgICAgdmFyIHJlcyA9IFtdO1xuICAgICAgICBpZiAob2JqKSByZXMucHVzaChvYmopO1xuICAgICAgICByZXNvbHZlKHJlcyk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuXG4gIHNhdmVLZXlzKF9kYXRhKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgQ2xpcXpDaHJvbWVEQi5zZXQoJ2hwbicsICd1c2VyS2V5JywgSlNPTi5zdHJpbmdpZnkoX2RhdGEpKTtcbiAgICAgIHJlc29sdmUoeyBzdGF0dXM6IHRydWUsIGRhdGE6IF9kYXRhIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgbG9hZEtleXMoKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHRoaXMubG9hZFJlY29yZCgndXNlcktleScpXG4gICAgICAgIC50aGVuKGRhdGEgPT4ge1xuICAgICAgICAgIGlmIChkYXRhLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgcmVzb2x2ZShudWxsKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICByZXNvbHZlKEpTT04ucGFyc2UoZGF0YSkpO1xuICAgICAgICAgICAgfSBjYXRjaChlZSkge1xuICAgICAgICAgICAgICByZXNvbHZlKG51bGwpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBzYXZlTG9jYWxDaGVja1RhYmxlKCkge1xuICAgIGlmIChPYmplY3Qua2V5cyh0aGlzLkNsaXF6U2VjdXJlTWVzc2FnZS5sb2NhbFRlbXBvcmFsVW5pcSkubGVuZ3RoID4gMCkge1xuICAgICAgdGhpcy5zYXZlUmVjb3JkKCdsb2NhbFRlbXBvcmFsVW5pcScsIEpTT04uc3RyaW5naWZ5KHRoaXMuQ2xpcXpTZWN1cmVNZXNzYWdlLmxvY2FsVGVtcG9yYWxVbmlxKSk7XG4gICAgfVxuICB9XG5cbiAgbG9hZExvY2FsQ2hlY2tUYWJsZSgpIHtcbiAgICB0aGlzLmxvYWRSZWNvcmQoJ2xvY2FsVGVtcG9yYWxVbmlxJylcbiAgICAgIC50aGVuKCByZXMgPT4ge1xuICAgICAgICBpZihyZXMubGVuZ3RoID4gMCl7XG4gICAgICAgICAgdGhpcy5DbGlxelNlY3VyZU1lc3NhZ2UubG9jYWxUZW1wb3JhbFVuaXEgPSBKU09OLnBhcnNlKHJlc1swXSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5DbGlxelNlY3VyZU1lc3NhZ2UubG9jYWxUZW1wb3JhbFVuaXEgPSB7fTtcbiAgICAgICAgfVxuICAgICAgfSlcbiAgfVxufVxuIiwiZXhwb3J0IGRlZmF1bHQge1xuICBpbml0KCkge31cbn1cbiIsImV4cG9ydCB7IGRlZmF1bHQgYXMgaGlzdG9yeU1hbmFnZXIgfSBmcm9tIFwiLi4vcGxhdGZvcm0vaGlzdG9yeS1tYW5hZ2VyXCI7XG5cbmltcG9ydCBDbGlxelV0aWxzIGZyb20gXCIuL3V0aWxzXCI7XG5pbXBvcnQgQ2xpcXpFdmVudHMgZnJvbSBcIi4vZXZlbnRzXCI7XG5cbmNvbnN0IENsaXF6UHJvbWlzZSA9IENsaXF6VXRpbHMuUHJvbWlzZTtcblxuZXhwb3J0IHtcbiAgQ2xpcXpVdGlscyBhcyB1dGlscyxcbiAgQ2xpcXpFdmVudHMgYXMgZXZlbnRzLFxuICBDbGlxelByb21pc2UgYXMgUHJvbWlzZSxcbn07XG4iLCJpbXBvcnQgeyBjaHJvbWUgfSBmcm9tICcuL2dsb2JhbHMnO1xuXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFN0b3JhZ2Uge1xuICBjb25zdHJ1Y3RvcihmaWxlUGF0aCkge1xuICAgIHRoaXMua2V5ID0gW1xuICAgICAgJ3Jlc291cmNlLWxvYWRlcicsXG4gICAgICAuLi5maWxlUGF0aCxcbiAgICBdLmpvaW4oJzonKTtcbiAgfVxuXG4gIGxvYWQoKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldCh0aGlzLmtleSwgKHZhbHVlcykgPT4ge1xuICAgICAgICBjb25zdCBrZXkgPSBPYmplY3Qua2V5cyh2YWx1ZXMpO1xuICAgICAgICBjb25zdCB2YWx1ZSA9IHZhbHVlc1trZXldO1xuICAgICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgICByZXNvbHZlKHZhbHVlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZWplY3QoYHJlc291cmNlLWxvYWRlcjogY2hyb21lIHN0b3JhZ2UgaGFzIG5vIHZhbHVlIGZvciBrZXkgJHt0aGlzLmtleX1gKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBzYXZlKGRhdGEpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7XG4gICAgICAgIFt0aGlzLmtleV06IGRhdGEsXG4gICAgICB9LCByZXNvbHZlKTtcbiAgICB9KTtcbiAgfVxufVxuIiwiaW1wb3J0IGNvbmZpZyBmcm9tICcuL2NvbmZpZyc7XG5pbXBvcnQgY29uc29sZSBmcm9tICcuL2NvbnNvbGUnO1xuaW1wb3J0IHsgdXRpbHMgfSBmcm9tICcuL2NsaXF6JztcbmltcG9ydCBTdG9yYWdlIGZyb20gJy4uL3BsYXRmb3JtL3Jlc291cmNlLWxvYWRlci1zdG9yYWdlJztcblxuLy8gQ29tbW9uIGR1cmF0aW9uc1xuY29uc3QgT05FX1NFQ09ORCA9IDEwMDA7XG5jb25zdCBPTkVfTUlOVVRFID0gNjAgKiBPTkVfU0VDT05EO1xuY29uc3QgT05FX0hPVVIgPSA2MCAqIE9ORV9NSU5VVEU7XG5cbmZ1bmN0aW9uIGdldCh1cmwpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICB1dGlscy5odHRwR2V0KHVybCwgKHJlcykgPT4ge1xuICAgICAgcmVzb2x2ZShyZXMucmVzcG9uc2UpO1xuICAgIH0sIHJlamVjdCwgMTAgKiBPTkVfU0VDT05EKTtcbiAgfSk7XG59XG5cbi8qIEFic3RyYWN0IGF3YXkgdGhlIHBhdHRlcm4gYG9uVXBkYXRlYCB0cmlnZ2VyIGxpc3Qgb2ZcbiAqIGNhbGxiYWNrcy4gVGhpcyBwYXR0ZXJuIGlzIHVzZWQgYSBsb3QsIHNvIGl0IGxvb2tzIHdvcnRoXG4gKiBpdCB0byBjcmVhdGUgYSBiYXNlIGNsYXNzIHRvIGhhbmRsZSBpdC5cbiAqL1xuZXhwb3J0IGNsYXNzIFVwZGF0ZUNhbGxiYWNrSGFuZGxlciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuY2FsbGJhY2tzID0gW107XG4gIH1cblxuICBvblVwZGF0ZShjYWxsYmFjaykge1xuICAgIHRoaXMuY2FsbGJhY2tzLnB1c2goY2FsbGJhY2spO1xuICB9XG5cbiAgdHJpZ2dlckNhbGxiYWNrcyhhcmdzKSB7XG4gICAgcmV0dXJuIFByb21pc2UuYWxsKHRoaXMuY2FsbGJhY2tzLm1hcChjYiA9PiBjYihhcmdzKSkpO1xuICB9XG59XG5cbi8qIEEgcmVzb3VyY2UgaXMgcmVzcG9uc2libGUgZm9yIGhhbmRsaW5nIGEgcmVtb3RlIHJlc291cmNlIHBlcnNpc3RlZCBvblxuICogZGlzay4gSXQgd2lsbCBiZSBwZXJzaXN0ZWQgb24gZGlzayB1cG9uIGVhY2ggdXBkYXRlIGZyb20gcmVtb3RlLiBJdCBpc1xuICogYWxzbyBhYmxlIHRvIHBhcnNlIEpTT04gYXV0b21hdGljYWxseSBpZiBgZGF0YVR5cGVgIGlzICdqc29uJy5cbiAqL1xuZXhwb3J0IGNsYXNzIFJlc291cmNlIHtcblxuICBjb25zdHJ1Y3RvcihuYW1lLCBvcHRpb25zID0ge30pIHtcbiAgICB0aGlzLm5hbWUgPSAodHlwZW9mIG5hbWUgPT09ICdzdHJpbmcnKSA/IFtuYW1lXSA6IG5hbWU7XG4gICAgdGhpcy5yZW1vdGVVUkwgPSBvcHRpb25zLnJlbW90ZVVSTDtcbiAgICB0aGlzLmRhdGFUeXBlID0gb3B0aW9ucy5kYXRhVHlwZSB8fCAnanNvbic7XG4gICAgdGhpcy5maWxlUGF0aCA9IFsnY2xpcXonLCAuLi50aGlzLm5hbWVdO1xuICAgIHRoaXMuY2hyb21lVVJMID0gb3B0aW9ucy5jaHJvbWVVUkwgfHwgYCR7Y29uZmlnLmJhc2VVUkx9JHt0aGlzLm5hbWUuam9pbignLycpfWA7XG4gICAgdGhpcy5zdG9yYWdlID0gbmV3IFN0b3JhZ2UodGhpcy5maWxlUGF0aCk7XG4gIH1cblxuICAvKipcbiAgICogTG9hZHMgdGhlIHJlc291cmNlLiBMb2FkIGVpdGhlciBhIGNhY2hlZCB2ZXJzaW9uIG9mIHRoZSBmaWxlIGF2YWlsYWJsZSBpblxuICAgKiB0aGUgcHJvZmlsZSwgb3IgYXQgdGhlIGNocm9tZSBVUkwgKGlmIHByb3ZpZGVkKSBvciBmcm9tIHJlbW90ZS5cbiAgICpcbiAgICogQHJldHVybnMgYSBQcm9taXNlIHJlc29sdmluZyB0byB0aGUgcmVzb3VyY2UuIFRoaXMgUHJvbWlzZSBjYW4gZmFpbCBvblxuICAgKiBlcnJvciAoaWYgdGhlIHJlbW90ZSByZXNvdXJjZSBjYW5ub3QgYmUgZmV0Y2hlZCwgb3IgaWYgdGhlIHBhcnNpbmdcbiAgICogZmFpbHMsIGZvciBleGFtcGxlKSwgdGh1cyAqKnlvdSBzaG91bGQgc2hvdWxkIGFkZCBhIF9jYXRjaF8qKiB0byB0aGlzXG4gICAqIHByb21pc2UgdG8gaGFuZGxlIGVycm9ycyBwcm9wZXJseS5cbiAgICovXG4gIGxvYWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RvcmFnZS5sb2FkKClcbiAgICAgIC50aGVuKChkYXRhKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgLy8gSWYgVGV4dERlY29kZXIgaXMgbm90IGF2YWlsYWJsZSBqdXN0IHVzZSBgZGF0YWBcbiAgICAgICAgICByZXR1cm4gKG5ldyBUZXh0RGVjb2RlcigpKS5kZWNvZGUoZGF0YSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIC50aGVuKGRhdGEgPT4gdGhpcy5wYXJzZURhdGEoZGF0YSkpXG4gICAgICAuY2F0Y2goKCkgPT4gdGhpcy51cGRhdGVGcm9tVVJMKHRoaXMuY2hyb21lVVJMKSlcbiAgICAgIC5jYXRjaCgoKSA9PiB0aGlzLnVwZGF0ZUZyb21SZW1vdGUoKSk7XG4gIH1cblxuICAvKipcbiAgICogVHJpZXMgdG8gdXBkYXRlIHRoZSByZXNvdXJjZSBmcm9tIHRoZSBgcmVtb3RlVVJMYC5cbiAgICpcbiAgICogQHJldHVybnMgYSBQcm9taXNlIHJlc29sdmluZyB0byB0aGUgdXBkYXRlZCByZXNvdXJjZS4gU2ltaWxhcmx5XG4gICAqIHRvIHRoZSBgbG9hZGAgbWV0aG9kLCB0aGUgcHJvbWlzZSBjYW4gZmFpbCwgYW5kIHRodXMgeW91IHNob3VsZFxuICAgKiBoYWQgYSAqKmNhdGNoKiogY2xvc2UgdG8geW91ciBwcm9taXNlIHRvIGhhbmRsZSBhbnkgZXhjZXB0aW9uLlxuICAgKi9cbiAgdXBkYXRlRnJvbVJlbW90ZSgpIHtcbiAgICBpZiAodGhpcy5yZW1vdGVVUkwgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KCd1cGRhdGVGcm9tUmVtb3RlOiByZW1vdGVVUkwgaXMgdW5kZWZpbmVkJyk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnVwZGF0ZUZyb21VUkwodGhpcy5yZW1vdGVVUkwpO1xuICB9XG5cbiAgLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICogUHJpdmF0ZSBBUElcbiAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICB1cGRhdGVGcm9tVVJMKHVybCkge1xuICAgIGlmICh1cmwpIHtcbiAgICAgIHJldHVybiBnZXQodXJsKVxuICAgICAgICAudGhlbih0aGlzLnBlcnNpc3QuYmluZCh0aGlzKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIFByb21pc2UucmVqZWN0KCd1cGRhdGVGcm9tVVJMOiB1cmwgaXMgdW5kZWZpbmVkJyk7XG4gIH1cblxuICBwZXJzaXN0KGRhdGEpIHtcbiAgICByZXR1cm4gdGhpcy5wYXJzZURhdGEoZGF0YSkudGhlbihwYXJzZWQgPT5cbiAgICAgIHRoaXMuc3RvcmFnZS5zYXZlKGRhdGEpXG4gICAgICAuY2F0Y2goZSA9PiBjb25zb2xlLmVycm9yKCdyZXNvdXJjZS1sb2FkZXIgZXJyb3Igb24gcGVyc2lzdDogJywgZSkpXG4gICAgICAudGhlbigoKSA9PiBwYXJzZWQpXG4gICAgKTtcbiAgfVxuXG4gIHBhcnNlRGF0YShkYXRhKSB7XG4gICAgaWYgKHRoaXMuZGF0YVR5cGUgPT09ICdqc29uJykge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgcGFyc2VkID0gSlNPTi5wYXJzZShkYXRhKTtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShwYXJzZWQpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoYHBhcnNlRGF0YTogZmFpbGVkIHdpdGggZXhjZXB0aW9uICR7ZX1gKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGRhdGEpO1xuICB9XG59XG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgZXh0ZW5kcyBVcGRhdGVDYWxsYmFja0hhbmRsZXIge1xuXG4gIGNvbnN0cnVjdG9yKHJlc291cmNlTmFtZSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMucmVzb3VyY2UgPSBuZXcgUmVzb3VyY2UocmVzb3VyY2VOYW1lLCBvcHRpb25zKTtcbiAgICB0aGlzLmNyb24gPSBvcHRpb25zLmNyb24gfHwgT05FX0hPVVI7XG4gICAgdGhpcy51cGRhdGVJbnRlcnZhbCA9IG9wdGlvbnMudXBkYXRlSW50ZXJ2YWwgfHwgMTAgKiBPTkVfTUlOVVRFO1xuICAgIHRoaXMuaW50ZXJ2YWxUaW1lciA9IHV0aWxzLnNldEludGVydmFsKFxuICAgICAgICB0aGlzLnVwZGF0ZUZyb21SZW1vdGUuYmluZCh0aGlzKSxcbiAgICAgICAgdGhpcy51cGRhdGVJbnRlcnZhbCk7XG4gIH1cblxuXG4gIC8qKlxuICAgKiBMb2FkcyB0aGUgcmVzb3VyY2UgaG9sZCBieSBgdGhpcy5yZXNvdXJjZWAuIFRoaXMgY2FuIHJldHVyblxuICAgKiBhIGZhaWxlZCBwcm9taXNlLiBQbGVhc2UgcmVhZCBgUmVzb3VyY2UubG9hZGAgZG9jIHN0cmluZyBmb3JcbiAgICogZnVydGhlciBpbmZvcm1hdGlvbi5cbiAgICovXG4gIGxvYWQoKSB7XG4gICAgcmV0dXJuIHRoaXMucmVzb3VyY2UubG9hZCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgdGhlIHJlc291cmNlIGZyb20gcmVtb3RlIChtYXhpbXVtIG9uZSB0aW1lIHBlciBgY3JvbmBcbiAgICogdGltZSBmcmFtZSkuXG4gICAqXG4gICAqIEByZXR1cm5zIGEgUHJvbWlzZSB3aGljaCBuZXZlciBmYWlscywgc2luY2UgdGhpcyB1cGRhdGUgd2lsbCBiZVxuICAgKiB0cmlnZ2VyZWQgYnkgYHNldEludGVydmFsYCBhbmQgdGh1cyB5b3UgY2Fubm90IGNhdGNoLiBJZiB0aGUgdXBkYXRlXG4gICAqIGZhaWxzLCB0aGVuIHRoZSBjYWxsYmFjayB3b24ndCBiZSBjYWxsZWQuXG4gICAqL1xuICB1cGRhdGVGcm9tUmVtb3RlKCkge1xuICAgIGNvbnN0IHByZWYgPSBgcmVzb3VyY2UtbG9hZGVyLmxhc3RVcGRhdGVzLiR7dGhpcy5yZXNvdXJjZS5uYW1lLmpvaW4oJy8nKX1gO1xuICAgIGNvbnN0IGxhc3RVcGRhdGUgPSBOdW1iZXIodXRpbHMuZ2V0UHJlZihwcmVmLCAwKSk7XG4gICAgY29uc3QgY3VycmVudFRpbWUgPSBEYXRlLm5vdygpO1xuXG4gICAgaWYgKGN1cnJlbnRUaW1lID4gdGhpcy5jcm9uICsgbGFzdFVwZGF0ZSkge1xuICAgICAgcmV0dXJuIHRoaXMucmVzb3VyY2UudXBkYXRlRnJvbVJlbW90ZSgpXG4gICAgICAgIC50aGVuKChkYXRhKSA9PiB7XG4gICAgICAgICAgdXRpbHMuc2V0UHJlZihwcmVmLCBTdHJpbmcoRGF0ZS5ub3coKSkpO1xuICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICB9KVxuICAgICAgICAudGhlbih0aGlzLnRyaWdnZXJDYWxsYmFja3MuYmluZCh0aGlzKSlcbiAgICAgICAgLmNhdGNoKCgpID0+IHVuZGVmaW5lZCk7XG4gICAgfVxuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgfVxuXG4gIHN0b3AoKSB7XG4gICAgdXRpbHMuY2xlYXJJbnRlcnZhbCh0aGlzLmludGVydmFsVGltZXIpO1xuICB9XG59XG4iLCJpbXBvcnQgQ2xpcXpTZWN1cmVNZXNzYWdlIGZyb20gJy4vbWFpbic7XG5pbXBvcnQgQ3J5cHRvV29ya2VyIGZyb20gJy4vY3J5cHRvLXdvcmtlcic7XG5cbi8vIFVzaW5nIHRoaXMgZnVuY3Rpb24gaXQgaXMgZWFzaWVyIHRvIHNlZSBpZiB0aGUgcHVzaCBvZiBtZXNzYWdlIGZhaWxlZC5cbmNvbnN0IHNlbmRNZXNzYWdlID0gZnVuY3Rpb24gKHd3LCBtKSB7XG4gIHRyeSB7XG4gICAgd3cucG9zdE1lc3NhZ2Uoe1xuICAgICAgbXNnOiBtLFxuICAgICAgdHlwZTogJ3RlbGVtZXRyeScsXG4gICAgICBzb3VyY2VtYXA6IENsaXF6U2VjdXJlTWVzc2FnZS5zb3VyY2VNYXAsXG4gICAgICB1cGs6IENsaXF6U2VjdXJlTWVzc2FnZS51UEssXG4gICAgICBkc3BrOiBDbGlxelNlY3VyZU1lc3NhZ2UuZHNQSyxcbiAgICAgIHNzcGs6IENsaXF6U2VjdXJlTWVzc2FnZS5zZWN1cmVMb2dnZXIsXG4gICAgICByb3V0ZXRhYmxlOiBDbGlxelNlY3VyZU1lc3NhZ2Uucm91dGVUYWJsZSxcbiAgICAgIGxvY2FsVGVtcG9yYWxVbmlxOiBDbGlxelNlY3VyZU1lc3NhZ2UubG9jYWxUZW1wb3JhbFVuaXEsXG4gICAgfSk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgfVxufTtcblxuLypcblRoaXMgd2lsbCBzZW5kIHRoZSBtZXNzYWdlcyBpbnNpZGUgdGhlIHRyayBvbmUgYXQgYSB0aW1lLiBUaGlzIHVzZXMgYSBnZW5lcmF0b3IgZXhwcmVzc2lvbi5cblxuV2lsbCByZXR1cm4gYSBQcm9taXNlIHdoaWNoIHJlc29sdmVzIHRvIGFuIGFycmF5LCBvbmUgZm9yIGVhY2ggc2VudCBtZXNzYWdlOlxuaXRzIHZhbHVlIHdpbGwgYmUgbnVsbCBpZiBldmVyeXRoaW5nIHdhcyBvayxcbmFuZCBhIHN0cmluZyBpbmRpY2F0aW5nIHRoZSBlcnJvciBtZXNzYWdlIG90aGVyd2lzZSAodXNlZnVsIGZvciB0ZXN0aW5nKVxuKi9cbmV4cG9ydCBmdW5jdGlvbiBzZW5kTShtLCBzZW50ID0gW10pIHtcbiAgY29uc3Qgc2VuZE1lc3NhZ2VXQ3J5cHRvID0gbmV3IENyeXB0b1dvcmtlcigpO1xuICBzZW5kTWVzc2FnZShzZW5kTWVzc2FnZVdDcnlwdG8sIG0pO1xuXG4gIHNlbmRNZXNzYWdlV0NyeXB0by5vbm1lc3NhZ2UgPSAoZSkgPT4ge1xuICAgIGlmIChlLmRhdGEudHlwZSA9PT0gJ3RlbGVtZXRyeScpIHtcbiAgICAgIENsaXF6U2VjdXJlTWVzc2FnZS5sb2NhbFRlbXBvcmFsVW5pcSA9IGUuZGF0YS5sb2NhbFRlbXBvcmFsVW5pcTtcbiAgICAgIENsaXF6U2VjdXJlTWVzc2FnZS5zdG9yYWdlLnNhdmVMb2NhbENoZWNrVGFibGUoKTtcbiAgICB9XG5cbiAgICBjb25zdCBuZXh0TXNnID0gQ2xpcXpTZWN1cmVNZXNzYWdlLm5leHRNZXNzYWdlKCk7XG4gICAgaWYgKG5leHRNc2cpIHtcbiAgICAgIHNlbmRNZXNzYWdlKHNlbmRNZXNzYWdlV0NyeXB0bywgbmV4dE1zZyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFF1ZXVlIGlzIGVtcHR5IGhlbmNlIGR1bXAgdGhlIGxvY2FsIHRlbXAgcXVldWUgdG8gZGlzay5cbiAgICAgIENsaXF6U2VjdXJlTWVzc2FnZS5zdG9yYWdlLnNhdmVMb2NhbENoZWNrVGFibGUoKTtcbiAgICAgIHNlbmRNZXNzYWdlV0NyeXB0by50ZXJtaW5hdGUoKTtcbiAgICAgIHJldHVybiBzZW50O1xuICAgIH1cbiAgfTtcbn07XG4iLCJpbXBvcnQgdXRpbHMgZnJvbSAnLi4vY29yZS91dGlscyc7XG5pbXBvcnQgKiBhcyBodHRwIGZyb20gJy4uL2NvcmUvaHR0cCc7XG5pbXBvcnQgQ2xpcXpTZWN1cmVNZXNzYWdlIGZyb20gJy4vbWFpbic7XG5cbmNvbnN0IE9GRkVSX1RFTEVNRVRSWSA9ICdodHRwczovL29mZmVycy1hcGkuY2xpcXouY29tL2FwaS92MS9zYXZlc2lnbmFsJztcblxubGV0IHByb3h5SHR0cEhhbmRsZXIgPSBudWxsO1xuZXhwb3J0IGZ1bmN0aW9uIG92ZXJSaWRlQ2xpcXpSZXN1bHRzKCkge1xuICBpZiAodXRpbHMuZ2V0UHJlZigncHJveHlOZXR3b3JrJywgdHJ1ZSkgPT09IGZhbHNlKSByZXR1cm47XG5cbiAgaWYgKCFwcm94eUh0dHBIYW5kbGVyKSBwcm94eUh0dHBIYW5kbGVyID0gaHR0cC5kZWZhdWx0SHR0cEhhbmRsZXI7XG5cbiAgZnVuY3Rpb24gaHR0cEhhbmRsZXIobWV0aG9kLCB1cmwsIGNhbGxiYWNrLCBvbmVycm9yLCB0aW1lb3V0LCBkYXRhLCBzeW5jKSB7XG4gICAgaWYgKHVybC5zdGFydHNXaXRoKHV0aWxzLlJFU1VMVFNfUFJPVklERVIpICYmXG4gICAgICAgIHV0aWxzLmdldFByZWYoJ2hwbi1xdWVyeXYyJywgZmFsc2UpKSB7XG4gICAgICBjb25zdCBxdWVyeSA9IHVybC5yZXBsYWNlKCh1dGlscy5SRVNVTFRTX1BST1ZJREVSKSwgJycpO1xuICAgICAgY29uc3QgdWlkID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTAwMDAwMDApO1xuICAgICAgQ2xpcXpTZWN1cmVNZXNzYWdlLnF1ZXJpZXNJRFt1aWRdID0gY2FsbGJhY2s7XG4gICAgICBDbGlxelNlY3VyZU1lc3NhZ2Uud0NyeXB0by5wb3N0TWVzc2FnZSh7XG4gICAgICAgIG1zZzogeyBhY3Rpb246ICdpbnN0YW50JyxcbiAgICAgICAgICAgICAgdHlwZTogJ2NsaXF6JyxcbiAgICAgICAgICAgICAgdHM6ICcnLFxuICAgICAgICAgICAgICB2ZXI6ICcxLjUnLFxuICAgICAgICAgICAgICBwYXlsb2FkOiBxdWVyeSxcbiAgICAgICAgICAgICAgcnA6IHV0aWxzLlJFU1VMVFNfUFJPVklERVIsXG4gICAgICAgIH0sXG4gICAgICAgIHVpZDogdWlkLFxuICAgICAgICB0eXBlOiAnaW5zdGFudCcsXG4gICAgICAgIHNvdXJjZW1hcDogQ2xpcXpTZWN1cmVNZXNzYWdlLnNvdXJjZU1hcCxcbiAgICAgICAgdXBrOiBDbGlxelNlY3VyZU1lc3NhZ2UudVBLLFxuICAgICAgICBkc3BrOiBDbGlxelNlY3VyZU1lc3NhZ2UuZHNQSyxcbiAgICAgICAgc3NwazogQ2xpcXpTZWN1cmVNZXNzYWdlLnNlY3VyZUxvZ2dlcixcbiAgICAgICAgcXVlcnlwcm94eWlwOiBDbGlxelNlY3VyZU1lc3NhZ2UucXVlcnlQcm94eUlQLFxuICAgICAgfSk7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9IGVsc2UgaWYgKHVybC5zdGFydHNXaXRoKHV0aWxzLlJFU1VMVFNfUFJPVklERVJfTE9HKSkge1xuICAgICAgY29uc3QgcXVlcnkgPSB1cmwucmVwbGFjZSgodXRpbHMuUkVTVUxUU19QUk9WSURFUl9MT0cpLCAnJyk7XG4gICAgICBjb25zdCB1aWQgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMDAwMDAwMCk7XG4gICAgICBDbGlxelNlY3VyZU1lc3NhZ2UucXVlcmllc0lEW3VpZF0gPSBjYWxsYmFjaztcbiAgICAgIENsaXF6U2VjdXJlTWVzc2FnZS53Q3J5cHRvLnBvc3RNZXNzYWdlKHtcbiAgICAgICAgbXNnOiB7IGFjdGlvbjogJ2V4dGVuc2lvbi1yZXN1bHQtdGVsZW1ldHJ5JyxcbiAgICAgICAgICAgICAgdHlwZTogJ2NsaXF6JyxcbiAgICAgICAgICAgICAgdHM6ICcnLFxuICAgICAgICAgICAgICB2ZXI6ICcxLjUnLFxuICAgICAgICAgICAgICBwYXlsb2FkOiBxdWVyeSxcbiAgICAgICAgfSxcbiAgICAgICAgdWlkOiB1aWQsXG4gICAgICAgIHR5cGU6ICdpbnN0YW50JyxcbiAgICAgICAgc291cmNlbWFwOiBDbGlxelNlY3VyZU1lc3NhZ2Uuc291cmNlTWFwLFxuICAgICAgICB1cGs6IENsaXF6U2VjdXJlTWVzc2FnZS51UEssXG4gICAgICAgIGRzcGs6IENsaXF6U2VjdXJlTWVzc2FnZS5kc1BLLFxuICAgICAgICBzc3BrOiBDbGlxelNlY3VyZU1lc3NhZ2Uuc2VjdXJlTG9nZ2VyLFxuICAgICAgICBxdWVyeXByb3h5aXA6IENsaXF6U2VjdXJlTWVzc2FnZS5xdWVyeVByb3h5SVAsXG4gICAgICB9KTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH0gZWxzZSBpZiAodXJsID09PSB1dGlscy5TQUZFX0JST1dTSU5HKSB7XG4gICAgICBjb25zdCBiYXRjaCA9IEpTT04ucGFyc2UoZGF0YSk7XG4gICAgICBpZiAoYmF0Y2gubGVuZ3RoID4gMCkge1xuICAgICAgICBiYXRjaC5mb3JFYWNoKGVhY2hNc2cgPT4ge1xuICAgICAgICAgIENsaXF6U2VjdXJlTWVzc2FnZS50ZWxlbWV0cnkoZWFjaE1zZyk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgY2FsbGJhY2sgJiYgY2FsbGJhY2soeyAncmVzcG9uc2UnOiAne1wic3VjY2Vzc1wiOnRydWV9JyB9KTtcbiAgICB9IGVsc2UgaWYgKHVybCA9PT0gT0ZGRVJfVEVMRU1FVFJZKSB7XG4gICAgICBjb25zdCBiYXRjaCA9IEpTT04ucGFyc2UoZGF0YSk7XG4gICAgICBDbGlxelNlY3VyZU1lc3NhZ2UudGVsZW1ldHJ5KGJhdGNoKTtcbiAgICAgIGNhbGxiYWNrICYmIGNhbGxiYWNrKHsgJ3Jlc3BvbnNlJzogJ3tcInN1Y2Nlc3NcIjp0cnVlfScgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBwcm94eUh0dHBIYW5kbGVyLmFwcGx5KHVuZGVmaW5lZCwgYXJndW1lbnRzKTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH07XG5cbiAgaHR0cC5vdmVycmlkZUh0dHBIYW5kbGVyKGh0dHBIYW5kbGVyKTtcbiAgaHR0cC5hZGRDb21wcmVzc2lvbkV4Y2x1c2lvbih1dGlscy5TQUZFX0JST1dTSU5HKTtcblxufVxuIiwiXG5leHBvcnQgZGVmYXVsdCBjbGFzcyB7XG4gIGNvbnN0cnVjdG9yKHsgcG9zaXRpb24gfSA9IHsgcG9zaXRpb246IDAgfSkge1xuICB9XG5cbiAgaW5pdCgpIHtcbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNhYmxlIGFsbCBwcm94eSBydWxlcyBwcm92aWRlZCBieSB0aGlzIGluc3RhbmNlXG4gICAqIEBtZXRob2QgZGVzdHJveVxuICAgKi9cbiAgdW5sb2FkKCkge1xuICB9XG5cbiAgLy8gVE9ETzogYWRkIGRvY3VtZW50YXRpb25cbiAgbmV3UHJveHkoLi4uYXJncykge1xuICB9XG5cbiAgLyoqXG4gICAqIEZpcmVmb3ggcHJveHkgQVBJIGVudHJ5IHBvaW50IC0gY2FsbGVkIG9uIG5ldyBodHRwKHMpIGNvbm5lY3Rpb24uXG4gICAqIEBtZXRob2QgYXBwbHlGaWx0ZXJcbiAgICogQHBhcmFtIHBwc1xuICAgKiBAcGFyYW0gdXJsIHtzdHJpbmd9XG4gICAqIEBwYXJhbSBkZWZhdWx0UHJveHlcbiAgICogQHJldHVybnMgYVByb3h5XG4gICAqL1xuICBhcHBseUZpbHRlcihwcHMsIHVybCwgZGVmYXVsdFByb3h5KSB7XG4gIH1cbn1cbiIsIi8qIGdsb2JhbCBjaHJvbWUsIHdpbmRvdyAqL1xuZXhwb3J0IHtcbiAgY2hyb21lLFxuICB3aW5kb3csXG59XG4iLCJpbXBvcnQgeyB3aW5kb3cgfSBmcm9tICcuL2dsb2JhbHMnO1xuZXhwb3J0IGRlZmF1bHQgd2luZG93LmNvbnNvbGU7XG4iLCJpbXBvcnQgY29uc29sZSBmcm9tIFwiLi4vY29yZS9jb25zb2xlXCI7XG5pbXBvcnQgcHJlZnMgZnJvbSBcIi4uL2NvcmUvcHJlZnNcIjtcbmltcG9ydCBTdG9yYWdlIGZyb20gXCIuLi9jb3JlL3N0b3JhZ2VcIjtcbmltcG9ydCBDbGlxelV0aWxzIGZyb20gXCIuLi9jb3JlL3V0aWxzXCJcblxubGV0IGV2ZW50SURzID0ge307XG5jb25zdCBwb3J0ID0gY2hyb21lLnJ1bnRpbWUuY29ubmVjdCh7bmFtZTogXCJlbmNyeXB0ZWQtcXVlcnlcIn0pO1xucG9ydC5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICBsZXQgY2IgPSBldmVudElEc1tyZXNwb25zZS5lSURdLmNiO1xuICAgIGRlbGV0ZSBldmVudElEc1tyZXNwb25zZS5lSURdO1xuICAgIGNiICYmIGNiKHJlc3BvbnNlLmRhdGEpXG59KTtcblxuXG5jb25zdCBDTElRWkVudmlyb25tZW50ID0ge1xuICBTS0lOX1BBVEg6ICdtb2R1bGVzL3N0YXRpYy9za2luLycsXG4gIFJFU1VMVFNfUFJPVklERVI6ICdodHRwczovL2FwaS5jbGlxei5jb20vYXBpL3YyL3Jlc3VsdHM/bnJoPTEmcT0nLFxuICBSSUNIX0hFQURFUjogJ2h0dHBzOi8vYXBpLmNsaXF6LmNvbS9hcGkvdjIvcmljaC1oZWFkZXI/cGF0aD0vdjIvbWFwJyxcbiAgTE9HOiAnaHR0cHM6Ly9zdGF0cy5jbGlxei5jb20nLFxuICBCUkFORFNfREFUQV9VUkw6ICdzdGF0aWMvYnJhbmRzX2RhdGFiYXNlLmpzb24nLFxuICBURU1QTEFURVNfUEFUSDogJ21vZHVsZXMvc3RhdGljL3RlbXBsYXRlcy8nLFxuICBMT0NBTEVfUEFUSDogJ21vZHVsZXMvc3RhdGljL2xvY2FsZS8nLFxuICBSRVJBTktFUlM6IFtdLFxuICBSRVNVTFRTX1RJTUVPVVQ6IDEwMDAsIC8vIDEgc2Vjb25kXG4gIFRFTVBMQVRFUzogeydjYWxjdWxhdG9yJzogMSwgJ2NsdXN0ZXJpbmcnOiAxLCAnY3VycmVuY3knOiAxLCAnY3VzdG9tJzogMSwgJ2VtcGhhc2lzJzogMSwgJ2VtcHR5JzogMSxcbiAgICAnZ2VuZXJpYyc6IDEsIC8qJ2ltYWdlc19iZXRhJzogMSwqLyAnbWFpbic6IDEsICdyZXN1bHRzJzogMSwgJ3RleHQnOiAxLCAnc2VyaWVzJzogMSxcbiAgICAnc3BlbGxjaGVjayc6IDEsXG4gICAgJ3BhdHRlcm4taDEnOiAzLCAncGF0dGVybi1oMic6IDIsICdwYXR0ZXJuLWgzJzogMSwgJ3BhdHRlcm4taDMtY2x1c3Rlcic6IDEsXG4gICAgJ3BhdHRlcm4taG0nOiAxLFxuICAgICd0b3BzaXRlcyc6IDMsXG4gICAgJ2NlbGVicml0aWVzJzogMiwgJ0NsaXF6JzogMiwgJ2VudGl0eS1nZW5lcmljJzogMiwgJ25vUmVzdWx0JzogMywgJ3dlYXRoZXJBbGVydCc6IDMsICdlbnRpdHktbmV3cy0xJzogMywnZW50aXR5LXZpZGVvLTEnOiAzLFxuICAgICdmbGlnaHRTdGF0dXNFWi0yJzogMiwgJ3dlYXRoZXJFWic6IDIsXG4gICAgJ25ld3MnIDogMSwgJ3Blb3BsZScgOiAxLCAndmlkZW8nIDogMSwgJ2hxJyA6IDEsXG4gICAgJ2xpZ2FFWjFHYW1lJzogMixcbiAgICAnbGlnYUVaVGFibGUnOiAzLFxuICAgICdyZC1oMy13LXJhdGluZyc6IDEsXG4gICAgJ3ZvZCc6IDMsXG4gICAgJ21vdmllLXZvZCc6IDMsXG4gICAgJ2xpdmVUaWNrZXInOiAzXG4gIH0sXG4gIE1FU1NBR0VfVEVNUExBVEVTOiBbXG4gICAgJ2Zvb3Rlci1tZXNzYWdlJyxcbiAgICAnb25ib2FyZGluZy1jYWxsb3V0JyxcbiAgICAnb25ib2FyZGluZy1jYWxsb3V0LWV4dGVuZGVkJyxcbiAgICAnc2xvd19jb25uZWN0aW9uJyxcbiAgICAncGFydGlhbHMvbG9jYXRpb24vbWlzc2luZ19sb2NhdGlvbl8yJyxcbiAgICAncGFydGlhbHMvbG9jYXRpb24vbm8tbG9jYWxlLWRhdGEnXG4gIF0sXG4gIFBBUlRJQUxTOiBbXG4gICAgICAndXJsJyxcbiAgICAgICdsb2dvJyxcbiAgICAgICdFWi1jYXRlZ29yeScsXG4gICAgICAncGFydGlhbHMvZXotdGl0bGUnLFxuICAgICAgJ3BhcnRpYWxzL2V6LXVybCcsXG4gICAgICAncGFydGlhbHMvZXotaGlzdG9yeScsXG4gICAgICAncGFydGlhbHMvZXotZGVzY3JpcHRpb24nLFxuICAgICAgJ3BhcnRpYWxzL2V6LWdlbmVyaWMtYnV0dG9ucycsXG4gICAgICAnRVotaGlzdG9yeScsXG4gICAgICAncmQtaDMtdy1yYXRpbmcnLFxuICAgICAgJ3BjZ2FtZV9tb3ZpZV9zaWRlX3NuaXBwZXQnLFxuICAgICAgJ3BhcnRpYWxzL2xvY2F0aW9uL2xvY2FsLWRhdGEnLFxuICAgICAgJ3BhcnRpYWxzL2xvY2F0aW9uL21pc3NpbmdfbG9jYXRpb25fMScsXG4gICAgICAncGFydGlhbHMvdGltZXRhYmxlLWNpbmVtYScsXG4gICAgICAncGFydGlhbHMvdGltZXRhYmxlLW1vdmllJyxcbiAgICAgICdwYXJ0aWFscy9ib3R0b20tZGF0YS1zYycsXG4gICAgICAncGFydGlhbHMvZG93bmxvYWQnLFxuICAgICAgJ3BhcnRpYWxzL3N0cmVhbWluZycsXG4gICAgICAncGFydGlhbHMvbHlyaWNzJ1xuICBdLFxuICB0cms6IFtdLFxuICB0ZWxlbWV0cnk6IChmdW5jdGlvbigpe1xuICAgIHZhciB0cmtUaW1lciA9IG51bGwsXG4gICAgICAgIHRlbGVtZXRyeVNlbmRpbmcgPSBbXSxcbiAgICAgICAgVEVMRU1FVFJZX01BWF9TSVpFID0gNTAwO1xuXG4gICAgZnVuY3Rpb24gcHVzaFRlbGVtZXRyeSgpIHtcbiAgICAgIC8vIHB1dCBjdXJyZW50IGRhdGEgYXNpZGUgaW4gY2FzZSBvZiBmYWlsdXJlXG4gICAgICB0ZWxlbWV0cnlTZW5kaW5nID0gQ0UudHJrLnNsaWNlKDApO1xuICAgICAgQ0UudHJrID0gW107XG5cbiAgICAgIENsaXF6VXRpbHMuaHR0cFBvc3QoQ0UuTE9HLCBwdXNoVGVsZW1ldHJ5Q2FsbGJhY2ssIEpTT04uc3RyaW5naWZ5KHRlbGVtZXRyeVNlbmRpbmcpLFxuICAgICAgICAgIHB1c2hUZWxlbWV0cnlFcnJvciwgMTAwMDApO1xuXG4gICAgICBjb25zb2xlLmxvZygnVGVsZW1ldHJ5JywgJ3B1c2ggdGVsZW1ldHJ5IGRhdGE6ICcgKyB0ZWxlbWV0cnlTZW5kaW5nLmxlbmd0aCArICcgZWxlbWVudHMnKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwdXNoVGVsZW1ldHJ5Q2FsbGJhY2socmVxKXtcbiAgICAgIHZhciByZXNwb25zZSA9IEpTT04ucGFyc2UocmVxLnJlc3BvbnNlKTtcblxuICAgICAgaWYocmVzcG9uc2UubmV3X3Nlc3Npb24pe1xuICAgICAgICBwcmVmcy5zZXQoJ3Nlc3Npb24nLCByZXNwb25zZS5uZXdfc2Vzc2lvbik7XG4gICAgICB9XG4gICAgICB0ZWxlbWV0cnlTZW5kaW5nID0gW107XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcHVzaFRlbGVtZXRyeUVycm9yKHJlcSl7XG4gICAgICAvLyBwdXNoVGVsZW1ldHJ5IGZhaWxlZCwgcHV0IGRhdGEgYmFjayBpbiBxdWV1ZSB0byBiZSBzZW50IGFnYWluIGxhdGVyXG4gICAgICBjb25zb2xlLmxvZygnVGVsZW1ldHJ5JywgJ3B1c2ggdGVsZW1ldHJ5IGZhaWxlZDogJyArIHRlbGVtZXRyeVNlbmRpbmcubGVuZ3RoICsgJyBlbGVtZW50cycpO1xuICAgICAgQ0UudHJrID0gdGVsZW1ldHJ5U2VuZGluZy5jb25jYXQoQ0UudHJrKTtcblxuICAgICAgLy8gUmVtb3ZlIHNvbWUgb2xkIGVudHJpZXMgaWYgdG9vIG1hbnkgYXJlIHN0b3JlZCwgdG8gcHJldmVudCB1bmJvdW5kZWQgZ3Jvd3RoIHdoZW4gcHJvYmxlbXMgd2l0aCBuZXR3b3JrLlxuICAgICAgdmFyIHNsaWNlX3BvcyA9IENFLnRyay5sZW5ndGggLSBURUxFTUVUUllfTUFYX1NJWkUgKyAxMDA7XG4gICAgICBpZihzbGljZV9wb3MgPiAwKXtcbiAgICAgICAgY29uc29sZS5sb2coJ1RlbGVtZXRyeScsICdkaXNjYXJkaW5nICcgKyBzbGljZV9wb3MgKyAnIG9sZCB0ZWxlbWV0cnkgZGF0YScpO1xuICAgICAgICBDRS50cmsgPSBDRS50cmsuc2xpY2Uoc2xpY2VfcG9zKTtcbiAgICAgIH1cblxuICAgICAgdGVsZW1ldHJ5U2VuZGluZyA9IFtdO1xuICAgIH1cblxuICAgIHJldHVybiBmdW5jdGlvbihtc2csIGluc3RhbnRQdXNoKSB7XG4gICAgICBpZiAoKG1zZy50eXBlICE9ICdlbnZpcm9ubWVudCcpICYmIENMSVFaRW52aXJvbm1lbnQuaXNQcml2YXRlKCkpXG4gICAgICAgIHJldHVybjtcbiAgICAgIGNvbnNvbGUubG9nKCdVdGlscy50ZWxlbWV0cnknLCBtc2cpO1xuICAgICAgbXNnLnNlc3Npb24gPSBwcmVmcy5nZXQoJ3Nlc3Npb24nKTtcbiAgICAgIG1zZy50cyA9IERhdGUubm93KCk7XG5cbiAgICAgIENFLnRyay5wdXNoKG1zZyk7XG4gICAgICBDRS5jbGVhclRpbWVvdXQodHJrVGltZXIpO1xuXG4gICAgICBpZihpbnN0YW50UHVzaCB8fCBDRS50cmsubGVuZ3RoICUgMTAwID09IDApe1xuICAgICAgICBwdXNoVGVsZW1ldHJ5KCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0cmtUaW1lciA9IENFLnNldFRpbWVvdXQocHVzaFRlbGVtZXRyeSwgNjAwMDApO1xuICAgICAgfVxuICAgIH1cbiAgfSkoKSxcblxuICBpc1Vua25vd25UZW1wbGF0ZTogZnVuY3Rpb24odGVtcGxhdGUpe1xuICAgICAvLyBpbiBjYXNlIGFuIHVua25vd24gdGVtcGxhdGUgaXMgcmVxdWlyZWRcbiAgICAgcmV0dXJuIHRlbXBsYXRlICYmXG4gICAgICAgICAgICAhQ0UuVEVNUExBVEVTW3RlbXBsYXRlXVxuICB9LFxuICBnZXRCcmFuZHNEQlVybDogZnVuY3Rpb24odmVyc2lvbil7XG4gICAgcmV0dXJuICdodHRwczovL2Nkbi5jbGlxei5jb20vYnJhbmRzLWRhdGFiYXNlL2RhdGFiYXNlLycgKyB2ZXJzaW9uICsgJy9kYXRhL2RhdGFiYXNlLmpzb24nO1xuICB9LFxuICBzZXRJbnRlcnZhbDogZnVuY3Rpb24oKXsgcmV0dXJuIHNldEludGVydmFsLmFwcGx5KG51bGwsIGFyZ3VtZW50cyk7IH0sXG4gIHNldFRpbWVvdXQ6IGZ1bmN0aW9uKCl7IHJldHVybiBzZXRUaW1lb3V0LmFwcGx5KG51bGwsIGFyZ3VtZW50cyk7IH0sXG4gIGNsZWFyVGltZW91dDogZnVuY3Rpb24oKXsgY2xlYXJUaW1lb3V0LmFwcGx5KG51bGwsIGFyZ3VtZW50cyk7IH0sXG4gIFByb21pc2U6IFByb21pc2UsXG4gIE9TOiAnY2hyb21pdW0nLFxuICBpc1ByaXZhdGU6IGZ1bmN0aW9uKCkgeyByZXR1cm4gY2hyb21lLmV4dGVuc2lvbi5pbkluY29nbml0b0NvbnRleHQ7IH0sXG4gIGlzT25Qcml2YXRlVGFiOiBmdW5jdGlvbih3aW4pIHsgcmV0dXJuIENFLmlzUHJpdmF0ZSgpOyB9LFxuICBnZXRXaW5kb3c6IGZ1bmN0aW9uKCl7IHJldHVybiB7IGRvY3VtZW50OiB7IGdldEVsZW1lbnRCeUlkKCkge30gfSB9IH0sXG5cbiAgaGlzdG9yeVNlYXJjaDogZnVuY3Rpb24ocSwgY2FsbGJhY2ssIHNlYXJjaFBhcmFtKSB7XG4gICAgZnVuY3Rpb24gbWF0Y2hUeXBlVG9TdHlsZSh0eXBlKSB7XG4gICAgaWYgKCF0eXBlKVxuICAgICAgcmV0dXJuICdmYXZpY29uJztcbiAgICB0eXBlID0gdHlwZS50b0xvd2VyQ2FzZSgpO1xuICAgIGlmICh0eXBlLnN0YXJ0c1dpdGgoJ2hpc3RvcnknKSlcbiAgICAgIHJldHVybiAnZmF2aWNvbidcbiAgICByZXR1cm4gdHlwZTtcbiAgfVxuXG4gICAgY2hyb21lLmNsaXF6U2VhcmNoUHJpdmF0ZS5xdWVyeUhpc3RvcnkocSwgKHF1ZXJ5LCBtYXRjaGVzLCBmaW5pc2hlZCkgPT4ge1xuICAgICAgdmFyIHJlcyA9IG1hdGNoZXMubWFwKGZ1bmN0aW9uKG1hdGNoKSB7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgdmFsdWU6ICAgbWF0Y2gudXJsLFxuICAgICAgICAgICAgICBjb21tZW50OiBtYXRjaC5kZXNjcmlwdGlvbixcbiAgICAgICAgICAgICAgc3R5bGU6IG1hdGNoVHlwZVRvU3R5bGUobWF0Y2gucHJvdmlkZXJfdHlwZSksXG4gICAgICAgICAgICAgIGltYWdlOiAgICcnLFxuICAgICAgICAgICAgICBsYWJlbDogICAnJ1xuICAgICAgICAgIH07XG4gICAgICB9KTtcbiAgICAgIGNhbGxiYWNrKHtcbiAgICAgICAgcXVlcnk6IHF1ZXJ5LFxuICAgICAgICByZXN1bHRzOiByZXMsXG4gICAgICAgIHJlYWR5OiB0cnVlXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSxcblxuICBvcGVuTGluazogZnVuY3Rpb24od2luLCB1cmwsIG5ld1RhYikge1xuICAgIGNocm9tZS5jbGlxelNlYXJjaFByaXZhdGUubmF2aWdhdGUodXJsLCAhIW5ld1RhYik7XG4gIH0sXG5cbiAgY29weVJlc3VsdDogZnVuY3Rpb24odmFsKSB7XG4gICAgdmFyIGJhY2t1cCA9IGRvY3VtZW50Lm9uY29weTtcbiAgICB0cnkge1xuICAgICAgZG9jdW1lbnQub25jb3B5ID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgZXZlbnQuY2xpcGJvYXJkRGF0YS5zZXREYXRhKFwidGV4dC9wbGFpblwiLCB2YWwpO1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgfTtcbiAgICAgIGRvY3VtZW50LmV4ZWNDb21tYW5kKFwiY29weVwiLCBmYWxzZSwgbnVsbCk7XG4gICAgfVxuICAgIGZpbmFsbHkge1xuICAgICAgZG9jdW1lbnQub25jb3B5ID0gYmFja3VwO1xuICAgIH1cbiAgfSxcbiAgLy8gZGVidWdcbiAgX0VOR0lORVM6IFt7XG4gICAgXCJuYW1lXCI6IFwiQ0xJUVogZHVtbXkgc2VhcmNoXCIsIFwiYWxpYXNcIjogXCIjcXFcIiwgXCJkZWZhdWx0XCI6IHRydWUsIFwiaWNvblwiOiBcIlwiLCBcInNlYXJjaEZvcm1cIjogXCJodHRwczovL3d3dy5jbGlxei5jb20vP3E9e3NlYXJjaFRlcm1zfVwiLCBcInN1Z2dlc3Rpb25VcmxcIjogXCJcIiwgXCJiYXNlX3VybFwiOiBcImh0dHBzOi8vd3d3LmNsaXF6LmNvbS9zZWFyY2g/cT1cIiwgXCJwcmVmaXhcIjogXCIjcXFcIiwgXCJjb2RlXCI6IDNcbiAgfV0sXG4gIGdldFNlYXJjaEVuZ2luZXM6IGZ1bmN0aW9uKCl7XG4gICAgcmV0dXJuIENFLl9FTkdJTkVTLm1hcChmdW5jdGlvbihlKXtcbiAgICAgIGUuZ2V0U3VibWlzc2lvbkZvclF1ZXJ5ID0gZnVuY3Rpb24ocSl7XG4gICAgICAgICAgLy9UT0RPOiBjcmVhdGUgdGhlIGNvcnJlY3Qgc2VhcmNoIFVSTFxuICAgICAgICAgIHJldHVybiBlLnNlYXJjaEZvcm0ucmVwbGFjZShcIntzZWFyY2hUZXJtc31cIiwgcSk7XG4gICAgICB9XG5cbiAgICAgIGUuZ2V0U3VnZ2VzdGlvblVybEZvclF1ZXJ5ID0gZnVuY3Rpb24ocSl7XG4gICAgICAgICAgLy9UT0RPOiBjcmVhdGUgdGhlIGNvcnJlY3Qgc2VhcmNoIFVSTFxuICAgICAgICAgIHJldHVybiBlLnN1Z2dlc3Rpb25VcmwucmVwbGFjZShcIntzZWFyY2hUZXJtc31cIiwgcSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBlO1xuICAgIH0pO1xuICB9LFxuICB1cGRhdGVBbGlhczogZnVuY3Rpb24oKXt9LFxuICBnZXRFbmdpbmVCeUFsaWFzOiBmdW5jdGlvbihhbGlhcykge1xuICAgIHJldHVybiBDRS5fRU5HSU5FUy5maW5kKGVuZ2luZSA9PiB7IHJldHVybiBlbmdpbmUuYWxpYXMgPT09IGFsaWFzOyB9KTtcbiAgfSxcbiAgZ2V0RW5naW5lQnlOYW1lOiBmdW5jdGlvbihuYW1lKSB7XG4gICAgcmV0dXJuIENFLl9FTkdJTkVTLmZpbmQoZW5naW5lID0+IHsgcmV0dXJuIGVuZ2luZS5uYW1lID09PSBuYW1lOyB9KTtcbiAgfSxcbiAgZ2V0Tm9SZXN1bHRzOiBmdW5jdGlvbihxKSB7XG4gICAgY29uc3QgZW5naW5lcyA9IENFLmdldFNlYXJjaEVuZ2luZXMoKS5tYXAoZSA9PiB7XG4gICAgICBlLnN0eWxlID0gQ0UuZ2V0TG9nb0RldGFpbHMoXG4gICAgICAgICAgQ0UuZ2V0RGV0YWlsc0Zyb21VcmwoZS5zZWFyY2hGb3JtKSkuc3R5bGU7XG4gICAgICBlLnRleHQgPSAgZS5hbGlhcy5zbGljZSgxKTtcbiAgICAgIHJldHVybiBlO1xuICAgIH0pO1xuICAgIGNvbnN0IGRlZmF1bHROYW1lID0gQ0UuZ2V0RGVmYXVsdFNlYXJjaEVuZ2luZSgpLm5hbWUsXG4gICAgICAgICAgaXNVcmwgPSBDbGlxelV0aWxzLmlzVXJsKHEpO1xuXG4gICAgcmV0dXJuIENFLlJlc3VsdC5jbGlxeihcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZTonbm9SZXN1bHQnLFxuICAgICAgICAgICAgICAgIHNuaXBwZXQ6XG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB0ZXh0X2xpbmUxOiBDRS5nZXRMb2NhbGl6ZWRTdHJpbmcoaXNVcmwgPyAnbm9SZXN1bHRVcmxOYXZpZ2F0ZScgOiAnbm9SZXN1bHRUaXRsZScpLFxuICAgICAgICAgICAgICAgICAgICAvLyBmb3J3YXJkaW5nIHRoZSBxdWVyeSB0byB0aGUgZGVmYXVsdCBzZWFyY2ggZW5naW5lIGlzIG5vdCBoYW5kbGVkIGJ5IENMSVFaIGJ1dCBieSBGaXJlZm94XG4gICAgICAgICAgICAgICAgICAgIC8vIHdlIHNob3VsZCB0YWtlIGNhcmUgb2YgdGhpcyBzcGVjaWZpYyBjYXNlIGRpZmZlcmVudGx5IG9uIGFsdGVybmF0aXZlIHBsYXRmb3Jtc1xuICAgICAgICAgICAgICAgICAgICB0ZXh0X2xpbmUyOiBpc1VybCA/IENFLmdldExvY2FsaXplZFN0cmluZygnbm9SZXN1bHRVcmxTZWFyY2gnKSA6IENFLmdldExvY2FsaXplZFN0cmluZygnbm9SZXN1bHRNZXNzYWdlJywgZGVmYXVsdE5hbWUpLFxuICAgICAgICAgICAgICAgICAgICBcInNlYXJjaF9lbmdpbmVzXCI6IGVuZ2luZXMsXG4gICAgICAgICAgICAgICAgICAgIC8vdXNlIGxvY2FsIGltYWdlIGluIGNhc2Ugb2Ygbm8gaW50ZXJuZXQgY29ubmVjdGlvblxuICAgICAgICAgICAgICAgICAgICBcImNsaXF6X2xvZ29cIjogQ0UuU0tJTl9QQVRIICsgXCJpbWcvY2xpcXouc3ZnXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHR5cGU6ICdyaCcsXG4gICAgICAgICAgICAgICAgc3ViVHlwZToge2VtcHR5OnRydWV9XG4gICAgICAgICAgICB9XG4gICAgICAgIClcbiAgfSxcbiAgc2V0RGVmYXVsdFNlYXJjaEVuZ2luZTogZnVuY3Rpb24oZW5naW5lKSB7XG4gICAgY29uc3Qgc3RvcmFnZSA9IG5ldyBTdG9yYWdlKCk7XG4gICAgc3RvcmFnZS5zZXRPYmplY3QoJ2RlZmF1bHRTZWFyY2hFbmdpbmUnLCBlbmdpbmUpO1xuICB9LFxuICBnZXREZWZhdWx0U2VhcmNoRW5naW5lOiBmdW5jdGlvbigpIHtcbiAgICBmb3IgKGxldCBlIG9mIENFLmdldFNlYXJjaEVuZ2luZXMoKSkge1xuICAgICAgaWYgKGUuZGVmYXVsdClcbiAgICAgICAgcmV0dXJuIGU7XG4gICAgfVxuICB9LFxuICBvblJlbmRlckNvbXBsZXRlOiBmdW5jdGlvbihxdWVyeSwgYWxsVXJscykge1xuICAgIGNocm9tZS5jbGlxelNlYXJjaFByaXZhdGUucHJvY2Vzc1Jlc3VsdHMocXVlcnksIGFsbFVybHMpO1xuICB9LFxuICBvblJlc3VsdFNlbGVjdGlvbkNoYW5nZTogZnVuY3Rpb24ocG9zaXRpb24pIHtcbiAgICBjaHJvbWUuY2xpcXpTZWFyY2hQcml2YXRlLm9uUmVzdWx0U2VsZWN0aW9uQ2hhbmdlKHBvc2l0aW9uKTtcbiAgfSxcbiAgc2V0U3VwcG9ydEluZm8oKSB7fSxcbn07XG5jb25zdCBDRSA9IENMSVFaRW52aXJvbm1lbnQ7ICAvLyBTaG9ydGhhbmQgYWxpYXMuXG5cbmV4cG9ydCBkZWZhdWx0IENMSVFaRW52aXJvbm1lbnQ7XG4iLCIvKiBnbG9iYWwgbG9jYWxTdG9yYWdlICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAodXJsKSB7XG4gIGlmICh1cmwpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2xvY2FsU3RvcmFnZSBmb3IgVVJMIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbiAgfVxuICByZXR1cm4gbG9jYWxTdG9yYWdlO1xufVxuIiwiaW1wb3J0IGdldFN0b3JhZ2UgZnJvbSAnLi4vcGxhdGZvcm0vc3RvcmFnZSc7XG5cbi8qKlxuKiBAbmFtZXNwYWNlIGNvcmVcbiovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTdG9yYWdlIHtcblxuICBjb25zdHJ1Y3Rvcih1cmwpIHtcbiAgICAvLyBpZiBub3QgY2FsbGVkIGFzIGNvbnN0cnVjdG9yLCBzdGlsbCBhY3QgYXMgb25lXG4gICAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIFN0b3JhZ2UpKSB7XG4gICAgICByZXR1cm4gbmV3IFN0b3JhZ2UodXJsKTtcbiAgICB9XG5cbiAgICB0aGlzLnN0b3JhZ2UgPSBnZXRTdG9yYWdlLmJpbmQobnVsbCwgdXJsKTtcbiAgICB0aGlzLnVybCA9IHVybDtcbiAgfVxuXG4gIGdldEl0ZW0oa2V5KSB7XG4gICAgcmV0dXJuIHRoaXMuc3RvcmFnZSgpLmdldEl0ZW0oa2V5KTtcbiAgfVxuXG4gIHNldEl0ZW0oa2V5LCB2YWx1ZSkge1xuICAgIHJldHVybiB0aGlzLnN0b3JhZ2UoKS5zZXRJdGVtKGtleSwgdmFsdWUpO1xuICB9XG5cbiAgcmVtb3ZlSXRlbShrZXkpIHtcbiAgICByZXR1cm4gdGhpcy5zdG9yYWdlKCkucmVtb3ZlSXRlbShrZXkpO1xuICB9XG5cbiAgY2xlYXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RvcmFnZSgpLmNsZWFyKCk7XG4gIH1cblxuICAvKipcbiAgICogQG1ldGhvZCBzZXRPYmplY3RcbiAgICogQHBhcmFtIGtleSB7c3RyaW5nfVxuICAgKiBAcGFyYW0gb2JqZWN0XG4gICAqL1xuICBzZXRPYmplY3Qoa2V5LCBvYmplY3QpIHtcbiAgICB0aGlzLnN0b3JhZ2UoKS5zZXRJdGVtKGtleSwgSlNPTi5zdHJpbmdpZnkob2JqZWN0KSk7XG4gIH1cblxuICAvKipcbiAgICogQG1ldGhvZCBnZXRPYmplY3RcbiAgICogQHBhcmFtIGtleSB7c3RyaW5nfVxuICAgKiBAcGFyYW0gbm90Rm91bmQge0Jvb2xlYW59XG4gICAqL1xuICBnZXRPYmplY3Qoa2V5LCBub3RGb3VuZCA9IGZhbHNlKSB7XG4gICAgY29uc3QgbyA9IHRoaXMuc3RvcmFnZSgpLmdldEl0ZW0oa2V5KTtcbiAgICBpZiAobykge1xuICAgICAgcmV0dXJuIEpTT04ucGFyc2Uobyk7XG4gICAgfVxuICAgIHJldHVybiBub3RGb3VuZDtcbiAgfVxufVxuIiwiXG4vLyBUTEQgbGlzdCBleHRyYWN0ZWQgZnJvbSBodHRwOi8vd3d3LmlhbmEub3JnL2RvbWFpbnMvcm9vdC9kYixcbi8vIGNjIHN0YW5kcyBmcm8gY291bnRyeSBjb2RlLCB0aGUgb3RoZXIgYXJlIGdlbmVyaWNcbmV4cG9ydCBjb25zdCBUTERzID0ge2d3OiAnY2MnLCBndTogJ2NjJywgZ3Q6ICdjYycsIGdzOiAnY2MnLCBncjogJ2NjJywgZ3E6ICdjYycsIGdwOiAnY2MnLCBkYW5jZTogJ25hJywgdGllbmRhOiAnbmEnLCBneTogJ2NjJywgZ2c6ICdjYycsIGdmOiAnY2MnLCBnZTogJ2NjJywgZ2Q6ICdjYycsIGdiOiAnY2MnLCBnYTogJ2NjJywgZWR1OiAnbmEnLCBnbjogJ2NjJywgZ206ICdjYycsIGdsOiAnY2MnLCAnXFx1NTE2Y1xcdTUzZjgnOiAnbmEnLCBnaTogJ2NjJywgZ2g6ICdjYycsIHR6OiAnY2MnLCB6b25lOiAnbmEnLCB0djogJ2NjJywgdHc6ICdjYycsIHR0OiAnY2MnLCBpbW1vYmlsaWVuOiAnbmEnLCB0cjogJ2NjJywgdHA6ICdjYycsIHRuOiAnY2MnLCB0bzogJ2NjJywgdGw6ICdjYycsIGJpa2U6ICduYScsIHRqOiAnY2MnLCB0azogJ2NjJywgdGg6ICdjYycsIHRmOiAnY2MnLCB0ZzogJ2NjJywgdGQ6ICdjYycsIHRjOiAnY2MnLCBjb29wOiAnbmEnLCAnXFx1MDQzZVxcdTA0M2RcXHUwNDNiXFx1MDQzMFxcdTA0MzlcXHUwNDNkJzogJ25hJywgY29vbDogJ25hJywgcm86ICdjYycsIHZ1OiAnY2MnLCBkZW1vY3JhdDogJ25hJywgZ3VpdGFyczogJ25hJywgcXBvbjogJ25hJywgJ1xcdTA0NDFcXHUwNDQwXFx1MDQzMSc6ICdjYycsIHptOiAnY2MnLCB0ZWw6ICduYScsIGZ1dGJvbDogJ25hJywgemE6ICdjYycsICdcXHUwNjI4XFx1MDYyN1xcdTA2MzJcXHUwNjI3XFx1MDYzMSc6ICduYScsICdcXHUwNDQwXFx1MDQ0NCc6ICdjYycsIHp3OiAnY2MnLCBibHVlOiAnbmEnLCBtdTogJ2NjJywgJ1xcdTBlNDRcXHUwZTE3XFx1MGUyMic6ICdjYycsIGFzaWE6ICduYScsIG1hcmtldGluZzogJ25hJywgJ1xcdTZkNGJcXHU4YmQ1JzogJ25hJywgaW50ZXJuYXRpb25hbDogJ25hJywgbmV0OiAnbmEnLCAnXFx1NjViMFxcdTUyYTBcXHU1NzYxJzogJ2NjJywgb2tpbmF3YTogJ25hJywgJ1xcdTBiYWFcXHUwYmIwXFx1MGJiZlxcdTBiOWZcXHUwYmNkXFx1MGI5YVxcdTBiYzgnOiAnbmEnLCAnXFx1MDVkOFxcdTA1ZTJcXHUwNWUxXFx1MDVkOCc6ICduYScsICdcXHVjMGJjXFx1YzEzMSc6ICduYScsIHNleHk6ICduYScsIGluc3RpdHV0ZTogJ25hJywgJ1xcdTUzZjBcXHU3MDYzJzogJ2NjJywgcGljczogJ25hJywgJ1xcdTUxNmNcXHU3NmNhJzogJ25hJywgJ1xcdTY3M2FcXHU2Nzg0JzogJ25hJywgc29jaWFsOiAnbmEnLCBkb21haW5zOiAnbmEnLCAnXFx1OTk5OVxcdTZlMmYnOiAnY2MnLCAnXFx1OTZjNlxcdTU2ZTInOiAnbmEnLCBsaW1vOiAnbmEnLCAnXFx1MDQzY1xcdTA0M2VcXHUwNDNkJzogJ2NjJywgdG9vbHM6ICduYScsIG5hZ295YTogJ25hJywgcHJvcGVydGllczogJ25hJywgY2FtZXJhOiAnbmEnLCB0b2RheTogJ25hJywgY2x1YjogJ25hJywgY29tcGFueTogJ25hJywgZ2xhc3M6ICduYScsIGJlcmxpbjogJ25hJywgbWU6ICdjYycsIG1kOiAnY2MnLCBtZzogJ2NjJywgbWY6ICdjYycsIG1hOiAnY2MnLCBtYzogJ2NjJywgdG9reW86ICduYScsIG1tOiAnY2MnLCBtbDogJ2NjJywgbW86ICdjYycsIG1uOiAnY2MnLCBtaDogJ2NjJywgbWs6ICdjYycsIGNhdDogJ25hJywgcmV2aWV3czogJ25hJywgbXQ6ICdjYycsIG13OiAnY2MnLCBtdjogJ2NjJywgbXE6ICdjYycsIG1wOiAnY2MnLCBtczogJ2NjJywgbXI6ICdjYycsIGNhYjogJ25hJywgbXk6ICdjYycsIG14OiAnY2MnLCBtejogJ2NjJywgJ1xcdTBiODdcXHUwYmIyXFx1MGI5OVxcdTBiY2RcXHUwYjk1XFx1MGJjOCc6ICdjYycsIHdhbmc6ICduYScsIGVzdGF0ZTogJ25hJywgY2xvdGhpbmc6ICduYScsIG1vbmFzaDogJ25hJywgZ3VydTogJ25hJywgdGVjaG5vbG9neTogJ25hJywgdHJhdmVsOiAnbmEnLCAnXFx1MzBjNlxcdTMwYjlcXHUzMGM4JzogJ25hJywgcGluazogJ25hJywgZnI6ICdjYycsICdcXHVkMTRjXFx1YzJhNFxcdWQyYjgnOiAnbmEnLCBmYXJtOiAnbmEnLCBsaWdodGluZzogJ25hJywgZmk6ICdjYycsIGZqOiAnY2MnLCBmazogJ2NjJywgZm06ICdjYycsIGZvOiAnY2MnLCBzejogJ2NjJywga2F1ZmVuOiAnbmEnLCBzeDogJ2NjJywgc3M6ICdjYycsIHNyOiAnY2MnLCBzdjogJ2NjJywgc3U6ICdjYycsIHN0OiAnY2MnLCBzazogJ2NjJywgc2o6ICdjYycsIHNpOiAnY2MnLCBzaDogJ2NjJywgc286ICdjYycsIHNuOiAnY2MnLCBzbTogJ2NjJywgc2w6ICdjYycsIHNjOiAnY2MnLCBzYjogJ2NjJywgcmVudGFsczogJ25hJywgc2c6ICdjYycsIHNlOiAnY2MnLCBzZDogJ2NjJywgJ1xcdTdlYzRcXHU3ZWM3XFx1NjczYVxcdTY3ODQnOiAnbmEnLCBzaG9lczogJ25hJywgJ1xcdTRlMmRcXHU1NzBiJzogJ2NjJywgaW5kdXN0cmllczogJ25hJywgbGI6ICdjYycsIGxjOiAnY2MnLCBsYTogJ2NjJywgbGs6ICdjYycsIGxpOiAnY2MnLCBsdjogJ2NjJywgbHQ6ICdjYycsIGx1OiAnY2MnLCBscjogJ2NjJywgbHM6ICdjYycsIGhvbGlkYXk6ICduYScsIGx5OiAnY2MnLCBjb2ZmZWU6ICduYScsIGNlbzogJ25hJywgJ1xcdTU3MjhcXHU3ZWJmJzogJ25hJywgeWU6ICdjYycsICdcXHUwNjI1XFx1MDYyZVxcdTA2MmFcXHUwNjI4XFx1MDYyN1xcdTA2MzEnOiAnbmEnLCBuaW5qYTogJ25hJywgeXQ6ICdjYycsIG5hbWU6ICduYScsIG1vZGE6ICduYScsIGVoOiAnY2MnLCAnXFx1MDYyOFxcdTA2YmVcXHUwNjI3XFx1MDYzMVxcdTA2MmEnOiAnY2MnLCBlZTogJ2NjJywgaG91c2U6ICduYScsIGVnOiAnY2MnLCBlYzogJ2NjJywgdm90ZTogJ25hJywgZXU6ICdjYycsIGV0OiAnY2MnLCBlczogJ2NjJywgZXI6ICdjYycsIHJ1OiAnY2MnLCBydzogJ2NjJywgJ1xcdTBhYWRcXHUwYWJlXFx1MGFiMFxcdTBhYTQnOiAnY2MnLCByczogJ2NjJywgYm91dGlxdWU6ICduYScsIHJlOiAnY2MnLCAnXFx1MDYzM1xcdTA2NDhcXHUwNjMxXFx1MDY0YVxcdTA2MjknOiAnY2MnLCBnb3Y6ICduYScsICdcXHUwNDNlXFx1MDQ0MFxcdTA0MzMnOiAnbmEnLCByZWQ6ICduYScsIGZvdW5kYXRpb246ICduYScsIHB1YjogJ25hJywgdmFjYXRpb25zOiAnbmEnLCBvcmc6ICduYScsIHRyYWluaW5nOiAnbmEnLCByZWNpcGVzOiAnbmEnLCAnXFx1MDQzOFxcdTA0NDFcXHUwNDNmXFx1MDQ0YlxcdTA0NDJcXHUwNDMwXFx1MDQzZFxcdTA0MzhcXHUwNDM1JzogJ25hJywgJ1xcdTRlMmRcXHU2NTg3XFx1N2Y1MSc6ICduYScsIHN1cHBvcnQ6ICduYScsIG9ubDogJ25hJywgJ1xcdTRlMmRcXHU0ZmUxJzogJ25hJywgdm90bzogJ25hJywgZmxvcmlzdDogJ25hJywgJ1xcdTBkYmRcXHUwZDgyXFx1MGQ5YVxcdTBkY2YnOiAnY2MnLCAnXFx1MDQ5YlxcdTA0MzBcXHUwNDM3JzogJ2NjJywgbWFuYWdlbWVudDogJ25hJywgJ1xcdTA2NDVcXHUwNjM1XFx1MDYzMSc6ICdjYycsICdcXHUwNjIyXFx1MDYzMlxcdTA2NDVcXHUwNjI3XFx1MDZjY1xcdTA2MzRcXHUwNmNjJzogJ25hJywga2l3aTogJ25hJywgYWNhZGVteTogJ25hJywgc3k6ICdjYycsIGNhcmRzOiAnbmEnLCAnXFx1MDkzOFxcdTA5MDJcXHUwOTE3XFx1MDkyMFxcdTA5MjgnOiAnbmEnLCBwcm86ICduYScsIGtyZWQ6ICduYScsIHNhOiAnY2MnLCBtaWw6ICduYScsICdcXHU2MjExXFx1NzIzMVxcdTRmNjAnOiAnbmEnLCBhZ2VuY3k6ICduYScsICdcXHUzMDdmXFx1MzA5M1xcdTMwNmEnOiAnbmEnLCBlcXVpcG1lbnQ6ICduYScsIG1hbmdvOiAnbmEnLCBsdXh1cnk6ICduYScsIHZpbGxhczogJ25hJywgJ1xcdTY1M2ZcXHU1MmExJzogJ25hJywgc2luZ2xlczogJ25hJywgc3lzdGVtczogJ25hJywgcGx1bWJpbmc6ICduYScsICdcXHUwM2I0XFx1MDNiZlxcdTAzYmFcXHUwM2I5XFx1MDNiY1xcdTAzYWUnOiAnbmEnLCAnXFx1MDYyYVxcdTA2NDhcXHUwNjQ2XFx1MDYzMyc6ICdjYycsICdcXHUwNjdlXFx1MDYyN1xcdTA2YTlcXHUwNjMzXFx1MDYyYVxcdTA2MjdcXHUwNjQ2JzogJ2NjJywgZ2FsbGVyeTogJ25hJywga2c6ICdjYycsIGtlOiAnY2MnLCAnXFx1MDlhY1xcdTA5YmVcXHUwOTgyXFx1MDliMlxcdTA5YmUnOiAnY2MnLCBraTogJ2NjJywga2g6ICdjYycsIGtuOiAnY2MnLCBrbTogJ2NjJywga3I6ICdjYycsIGtwOiAnY2MnLCBrdzogJ2NjJywgbGluazogJ25hJywga3k6ICdjYycsIHZvdGluZzogJ25hJywgY3J1aXNlczogJ25hJywgJ1xcdTA2MzlcXHUwNjQ1XFx1MDYyN1xcdTA2NDYnOiAnY2MnLCBjaGVhcDogJ25hJywgc29sdXRpb25zOiAnbmEnLCAnXFx1NmUyY1xcdThhNjYnOiAnbmEnLCBuZXVzdGFyOiAnbmEnLCBwYXJ0bmVyczogJ25hJywgJ1xcdTBiODdcXHUwYmE4XFx1MGJjZFxcdTBiYTRcXHUwYmJmXFx1MGJhZlxcdTBiYmUnOiAnY2MnLCBtZW51OiAnbmEnLCBhcnBhOiAnbmEnLCBmbGlnaHRzOiAnbmEnLCByaWNoOiAnbmEnLCBkbzogJ2NjJywgZG06ICdjYycsIGRqOiAnY2MnLCBkazogJ2NjJywgcGhvdG9ncmFwaHk6ICduYScsIGRlOiAnY2MnLCB3YXRjaDogJ25hJywgZHo6ICdjYycsIHN1cHBsaWVzOiAnbmEnLCByZXBvcnQ6ICduYScsIHRpcHM6ICduYScsICdcXHUxMGQyXFx1MTBkNCc6ICdjYycsIGJhcjogJ25hJywgcWE6ICdjYycsIHNoaWtzaGE6ICduYScsICdcXHUwNDQzXFx1MDQzYVxcdTA0NDAnOiAnY2MnLCB2aXNpb246ICduYScsIHdpa2k6ICduYScsICdcXHUwNjQyXFx1MDYzN1xcdTA2MzEnOiAnY2MnLCAnXFx1ZDU1Y1xcdWFkNmQnOiAnY2MnLCBjb21wdXRlcjogJ25hJywgYmVzdDogJ25hJywgdm95YWdlOiAnbmEnLCBleHBlcnQ6ICduYScsIGRpYW1vbmRzOiAnbmEnLCBlbWFpbDogJ25hJywgd2Y6ICdjYycsIGpvYnM6ICduYScsIGJhcmdhaW5zOiAnbmEnLCAnXFx1NzlmYlxcdTUyYTgnOiAnbmEnLCBqcDogJ2NjJywgam06ICdjYycsIGpvOiAnY2MnLCB3czogJ2NjJywgamU6ICdjYycsIGtpdGNoZW46ICduYScsICdcXHUwYTJkXFx1MGEzZVxcdTBhMzBcXHUwYTI0JzogJ2NjJywgJ1xcdTA2MjdcXHUwNmNjXFx1MDYzMVxcdTA2MjdcXHUwNjQ2JzogJ2NjJywgdWE6ICdjYycsIGJ1eno6ICduYScsIGNvbTogJ25hJywgdW5vOiAnbmEnLCBjazogJ2NjJywgY2k6ICdjYycsIGNoOiAnY2MnLCBjbzogJ2NjJywgY246ICdjYycsIGNtOiAnY2MnLCBjbDogJ2NjJywgY2M6ICdjYycsIGNhOiAnY2MnLCBjZzogJ2NjJywgY2Y6ICdjYycsIGNvbW11bml0eTogJ25hJywgY2Q6ICdjYycsIGN6OiAnY2MnLCBjeTogJ2NjJywgY3g6ICdjYycsIGNyOiAnY2MnLCBjdzogJ2NjJywgY3Y6ICdjYycsIGN1OiAnY2MnLCBwcjogJ2NjJywgcHM6ICdjYycsIHB3OiAnY2MnLCBwdDogJ2NjJywgaG9sZGluZ3M6ICduYScsIHdpZW46ICduYScsIHB5OiAnY2MnLCBhaTogJ2NjJywgcGE6ICdjYycsIHBmOiAnY2MnLCBwZzogJ2NjJywgcGU6ICdjYycsIHBrOiAnY2MnLCBwaDogJ2NjJywgcG46ICdjYycsIHBsOiAnY2MnLCBwbTogJ2NjJywgJ1xcdTUzZjBcXHU2ZTdlJzogJ2NjJywgYWVybzogJ25hJywgY2F0ZXJpbmc6ICduYScsIHBob3RvczogJ25hJywgJ1xcdTA5MmFcXHUwOTMwXFx1MDk0MFxcdTA5MTVcXHUwOTRkXFx1MDkzN1xcdTA5M2UnOiAnbmEnLCBncmFwaGljczogJ25hJywgJ1xcdTA2NDFcXHUwNjQ0XFx1MDYzM1xcdTA2MzdcXHUwNjRhXFx1MDY0Nic6ICdjYycsICdcXHUwOWFkXFx1MDliZVxcdTA5YjBcXHUwOWE0JzogJ2NjJywgdmVudHVyZXM6ICduYScsIHZhOiAnY2MnLCB2YzogJ2NjJywgdmU6ICdjYycsIHZnOiAnY2MnLCBpcTogJ2NjJywgdmk6ICdjYycsIGlzOiAnY2MnLCBpcjogJ2NjJywgaXQ6ICdjYycsIHZuOiAnY2MnLCBpbTogJ2NjJywgaWw6ICdjYycsIGlvOiAnY2MnLCBpbjogJ2NjJywgaWU6ICdjYycsIGlkOiAnY2MnLCB0YXR0b286ICduYScsIGVkdWNhdGlvbjogJ25hJywgcGFydHM6ICduYScsIGV2ZW50czogJ25hJywgJ1xcdTBjMmRcXHUwYzNlXFx1MGMzMFxcdTBjMjRcXHUwYzRkJzogJ2NjJywgY2xlYW5pbmc6ICduYScsIGtpbTogJ25hJywgY29udHJhY3RvcnM6ICduYScsIG1vYmk6ICduYScsIGNlbnRlcjogJ25hJywgcGhvdG86ICduYScsIG5mOiAnY2MnLCAnXFx1MDY0NVxcdTA2NDRcXHUwNjRhXFx1MDYzM1xcdTA2NGFcXHUwNjI3JzogJ2NjJywgd2VkOiAnbmEnLCBzdXBwbHk6ICduYScsICdcXHU3ZjUxXFx1N2VkYyc6ICduYScsICdcXHUwNDQxXFx1MDQzMFxcdTA0MzlcXHUwNDQyJzogJ25hJywgY2FyZWVyczogJ25hJywgYnVpbGQ6ICduYScsICdcXHUwNjI3XFx1MDY0NFxcdTA2MjdcXHUwNjMxXFx1MDYyZlxcdTA2NDYnOiAnY2MnLCBiaWQ6ICduYScsIGJpejogJ25hJywgJ1xcdTA2MjdcXHUwNjQ0XFx1MDYzM1xcdTA2MzlcXHUwNjQ4XFx1MDYyZlxcdTA2NGFcXHUwNjI5JzogJ2NjJywgZ2lmdDogJ25hJywgJ1xcdTA0MzRcXHUwNDM1XFx1MDQ0MlxcdTA0MzgnOiAnbmEnLCB3b3JrczogJ25hJywgJ1xcdTZlMzhcXHU2MjBmJzogJ25hJywgdG06ICdjYycsIGV4cG9zZWQ6ICduYScsIHByb2R1Y3Rpb25zOiAnbmEnLCBrb2VsbjogJ25hJywgZGF0aW5nOiAnbmEnLCBjaHJpc3RtYXM6ICduYScsIGJkOiAnY2MnLCBiZTogJ2NjJywgYmY6ICdjYycsIGJnOiAnY2MnLCBiYTogJ2NjJywgYmI6ICdjYycsIGJsOiAnY2MnLCBibTogJ2NjJywgYm46ICdjYycsIGJvOiAnY2MnLCBiaDogJ2NjJywgYmk6ICdjYycsIGJqOiAnY2MnLCBidDogJ2NjJywgYnY6ICdjYycsIGJ3OiAnY2MnLCBicTogJ2NjJywgYnI6ICdjYycsIGJzOiAnY2MnLCBwb3N0OiAnbmEnLCBieTogJ2NjJywgYno6ICdjYycsIG9tOiAnY2MnLCBydWhyOiAnbmEnLCAnXFx1MDYyN1xcdTA2NDVcXHUwNjI3XFx1MDYzMVxcdTA2MjdcXHUwNjJhJzogJ2NjJywgcmVwYWlyOiAnbmEnLCB4eXo6ICduYScsICdcXHUwNjM0XFx1MDYyOFxcdTA2NDNcXHUwNjI5JzogJ25hJywgdmlhamVzOiAnbmEnLCBtdXNldW06ICduYScsIGZpc2g6ICduYScsICdcXHUwNjI3XFx1MDY0NFxcdTA2MmNcXHUwNjMyXFx1MDYyN1xcdTA2MjZcXHUwNjMxJzogJ2NjJywgaHI6ICdjYycsIGh0OiAnY2MnLCBodTogJ2NjJywgaGs6ICdjYycsIGNvbnN0cnVjdGlvbjogJ25hJywgaG46ICdjYycsIHNvbGFyOiAnbmEnLCBobTogJ2NjJywgaW5mbzogJ25hJywgJ1xcdTBiOWFcXHUwYmJmXFx1MGI5OVxcdTBiY2RcXHUwYjk1XFx1MGJhYVxcdTBiY2RcXHUwYmFhXFx1MGJjMlxcdTBiYjBcXHUwYmNkJzogJ2NjJywgdXk6ICdjYycsIHV6OiAnY2MnLCB1czogJ2NjJywgdW06ICdjYycsIHVrOiAnY2MnLCB1ZzogJ2NjJywgYnVpbGRlcnM6ICduYScsIGFjOiAnY2MnLCBjYW1wOiAnbmEnLCBhZTogJ2NjJywgYWQ6ICdjYycsIGFnOiAnY2MnLCBhZjogJ2NjJywgaW50OiAnbmEnLCBhbTogJ2NjJywgYWw6ICdjYycsIGFvOiAnY2MnLCBhbjogJ2NjJywgYXE6ICdjYycsIGFzOiAnY2MnLCBhcjogJ2NjJywgYXU6ICdjYycsIGF0OiAnY2MnLCBhdzogJ2NjJywgYXg6ICdjYycsIGF6OiAnY2MnLCBuaTogJ2NjJywgY29kZXM6ICduYScsIG5sOiAnY2MnLCBubzogJ2NjJywgbmE6ICdjYycsIG5jOiAnY2MnLCBuZTogJ2NjJywgYWN0b3I6ICduYScsIG5nOiAnY2MnLCAnXFx1MDkyZFxcdTA5M2VcXHUwOTMwXFx1MDkyNCc6ICdjYycsIG56OiAnY2MnLCAnXFx1MDYzM1xcdTA2NDhcXHUwNjJmXFx1MDYyN1xcdTA2NDYnOiAnY2MnLCBucDogJ2NjJywgbnI6ICdjYycsIG51OiAnY2MnLCB4eHg6ICduYScsICdcXHU0ZTE2XFx1NzU0Yyc6ICduYScsIGt6OiAnY2MnLCBlbnRlcnByaXNlczogJ25hJywgbGFuZDogJ25hJywgJ1xcdTA2MjdcXHUwNjQ0XFx1MDY0NVxcdTA2M2FcXHUwNjMxXFx1MDYyOCc6ICdjYycsICdcXHU0ZTJkXFx1NTZmZCc6ICdjYycsIGRpcmVjdG9yeTogJ25hJ307XG4iLCJcbmV4cG9ydCBkZWZhdWx0IGZldGNoO1xuZXhwb3J0IHtcbiAgZmV0Y2gsXG4gIEhlYWRlcnMsXG4gIFJlcXVlc3QsXG4gIFJlc3BvbnNlLFxufVxuIiwiZnVuY3Rpb24gc2V0UHJpdmF0ZUZsYWdzKCkge31cbmZ1bmN0aW9uIHNldEJhY2tncm91bmRSZXF1ZXN0KCkge31cbmZ1bmN0aW9uIFhNTEh0dHBSZXF1ZXN0RmFjdG9yeSgpIHtcbiAgcmV0dXJuIFhNTEh0dHBSZXF1ZXN0O1xufVxuXG5leHBvcnQge1xuICBYTUxIdHRwUmVxdWVzdEZhY3RvcnksXG4gIHNldFByaXZhdGVGbGFncyxcbiAgc2V0QmFja2dyb3VuZFJlcXVlc3Rcbn1cbiIsImV4cG9ydCBjb25zdCBjaHJvbWVVcmxIYW5kbGVyID0gZmFsc2U7XG4iLCJpbXBvcnQgKiBhcyBmdGNoIGZyb20gJy4uL3BsYXRmb3JtL2ZldGNoJztcbmltcG9ydCBjb25zb2xlIGZyb20gJy4vY29uc29sZSc7XG5pbXBvcnQgeyBjb21wcmVzcyB9IGZyb20gJy4vZ3ppcCc7XG5pbXBvcnQgeyBYTUxIdHRwUmVxdWVzdEZhY3RvcnksIHNldFByaXZhdGVGbGFncywgc2V0QmFja2dyb3VuZFJlcXVlc3QgfSBmcm9tICcuLi9wbGF0Zm9ybS94bWxodHRwcmVxdWVzdCc7XG5pbXBvcnQgeyBjaHJvbWVVcmxIYW5kbGVyIH0gZnJvbSAnLi4vcGxhdGZvcm0vY2hyb21lLXVybC1oYW5kbGVyJztcblxuZXhwb3J0IGxldCBmZXRjaCA9IGZ0Y2guZmV0Y2g7XG5leHBvcnQgbGV0IEhlYWRlcnMgPSBmdGNoLkhlYWRlcnM7XG5leHBvcnQgbGV0IFJlcXVlc3QgPSBmdGNoLlJlcXVlc3Q7XG5leHBvcnQgbGV0IFJlc3BvbnNlID0gZnRjaC5SZXNwb25zZTtcblxuLyoqIExlZ2FjeSBodHRwSGFuZGxlciBpbXBsZW1lbnRhdGlvbiwgYmFzZWQgb24gWE1MSHR0cFJlcXVlc3QuXG4gKlxuICogIElmIHlvdSB3YW50IHRvIG1ha2UgSFRUUCByZXF1ZXN0cywgcGxlYXNlIGNoZWNrIG91dCB0aGUgZmV0Y2ggQVBJIChwbGF0Zm9ybS9mZXRjaClcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlZmF1bHRIdHRwSGFuZGxlcihtZXRob2QsIHVybCwgY2FsbGJhY2ssIG9uZXJyb3IsIHRpbWVvdXQsIGRhdGEsIHN5bmMsIGVuY29kaW5nLCBiYWNrZ3JvdW5kKSB7XG4gIGlmIChtZXRob2QgPT09ICdHRVQnICYmIHVybC5zdGFydHNXaXRoKCdjaHJvbWU6Ly8nKSAmJiBjaHJvbWVVcmxIYW5kbGVyKSB7XG4gICAgY2hyb21lVXJsSGFuZGxlcih1cmwsIGNhbGxiYWNrLCBvbmVycm9yKTtcbiAgICByZXR1cm47XG4gIH1cbiAgY29uc3QgWE1MSHR0cFJlcXVlc3QgPSBYTUxIdHRwUmVxdWVzdEZhY3RvcnkoKTtcbiAgdmFyIHJlcSA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICByZXEudGltZXN0YW1wID0gKyBuZXcgRGF0ZSgpO1xuICBpZiAoYmFja2dyb3VuZCkge1xuICAgIHNldEJhY2tncm91bmRSZXF1ZXN0KHJlcSk7XG4gIH1cbiAgcmVxLm9wZW4obWV0aG9kLCB1cmwsICFzeW5jKTtcbiAgc2V0UHJpdmF0ZUZsYWdzKHJlcSk7XG4gIHJlcS5vdmVycmlkZU1pbWVUeXBlICYmIHJlcS5vdmVycmlkZU1pbWVUeXBlKCdhcHBsaWNhdGlvbi9qc29uJyk7XG5cbiAgLy8gaGVhZGVycyBmb3IgY29tcHJlc3NlZCBkYXRhXG4gIGlmIChlbmNvZGluZykge1xuICAgICAgcmVxLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtRW5jb2RpbmcnLCBlbmNvZGluZyk7XG4gIH1cblxuICByZXEub25sb2FkID0gZnVuY3Rpb24gKCkge1xuICAgICAgaWYoIXBhcnNlSW50KSByZXR1cm47IC8vcGFyc2VJbnQgaXMgbm90IGEgZnVuY3Rpb24gYWZ0ZXIgZXh0ZW5zaW9uIGRpc2FibGUvdW5pbnN0YWxsXG5cbiAgICAgIHZhciBzdGF0dXNDbGFzcyA9IHBhcnNlSW50KHJlcS5zdGF0dXMgLyAxMDApO1xuICAgICAgaWYoc3RhdHVzQ2xhc3MgPT0gMiB8fCBzdGF0dXNDbGFzcyA9PSAzIHx8IHN0YXR1c0NsYXNzID09IDAgLyogbG9jYWwgZmlsZXMgKi8pe1xuICAgICAgICAgIGNhbGxiYWNrICYmIGNhbGxiYWNrKHJlcSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCBcImxvYWRlZCB3aXRoIG5vbi0yMDAgXCIgKyB1cmwgKyBcIiAoc3RhdHVzPVwiICsgcmVxLnN0YXR1cyArIFwiIFwiICsgcmVxLnN0YXR1c1RleHQgKyBcIilcIiwgXCJDTElRWkVudmlyb25tZW50Lmh0dHBIYW5kbGVyXCIpO1xuICAgICAgICAgIG9uZXJyb3IgJiYgb25lcnJvcigpO1xuICAgICAgfVxuICB9XG4gIHJlcS5vbmVycm9yID0gZnVuY3Rpb24gKCkge1xuICAgIGNvbnNvbGUubG9nKCBcImVycm9yIGxvYWRpbmcgXCIgKyB1cmwgKyBcIiAoc3RhdHVzPVwiICsgcmVxLnN0YXR1cyArIFwiIFwiICsgcmVxLnN0YXR1c1RleHQgKyBcIilcIiwgXCJDTElRWkVudmlyb25tZW50Lmh0dHBIYW5kbGVyXCIpO1xuICAgIG9uZXJyb3IgJiYgb25lcnJvcigpO1xuICB9XG4gIHJlcS5vbnRpbWVvdXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgY29uc29sZS5sb2coIFwidGltZW91dCBmb3IgXCIgKyB1cmwsIFwiQ0xJUVpFbnZpcm9ubWVudC5odHRwSGFuZGxlclwiKTtcbiAgICBvbmVycm9yICYmIG9uZXJyb3IoKTtcbiAgfVxuXG4gIGlmIChjYWxsYmFjaykge1xuICAgICAgaWYgKHRpbWVvdXQpIHtcbiAgICAgICAgICByZXEudGltZW91dCA9IHBhcnNlSW50KHRpbWVvdXQpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlcS50aW1lb3V0ID0gKFsnUE9TVCcsICdQVVQnXS5pbmRleE9mKG1ldGhvZCkgPj0gMCA/IDEwMDAwIDogMTAwMCk7XG4gICAgICB9XG4gIH1cblxuICByZXEuc2VuZChkYXRhKTtcbiAgcmV0dXJuIHJlcTtcbn07XG5cbmxldCBhY3RpdmVIYW5kbGVyID0gZGVmYXVsdEh0dHBIYW5kbGVyO1xuXG5leHBvcnQgZnVuY3Rpb24gaHR0cEhhbmRsZXIoLi4uYXJncykge1xuICByZXR1cm4gYWN0aXZlSGFuZGxlciguLi5hcmdzKTtcbn1cblxuLyoqXG4gKiAgUmVwbGFjZSBkZWZhdWx0IGh0dHAgaGFuZGxlciB3aXRoIGZuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBvdmVycmlkZUh0dHBIYW5kbGVyKGZuKSB7XG4gIGFjdGl2ZUhhbmRsZXIgPSBmbjtcbn1cblxuY29uc3QgY29tcHJlc3Npb25BdmFpbGFibGUgPSBCb29sZWFuKGNvbXByZXNzKTtcbmxldCBjb21wcmVzc2lvbkV4Y2x1c2lvbnMgPSBuZXcgU2V0KCk7XG5cbmZ1bmN0aW9uIGNvbXByZXNzaW9uRW5hYmxlZCh1cmwpIHtcbiAgcmV0dXJuIGNvbXByZXNzaW9uQXZhaWxhYmxlICYmICFjb21wcmVzc2lvbkV4Y2x1c2lvbnMuaGFzKHVybCk7XG59XG5cbi8qKlxuICogIEFkZCBhIHVybCBmb3Igd2hpY2ggd2Ugc2hvdWxkIG5vdCBjb21wcmVzcyB3aGVuIHVzaW5nIHByb21pc2VIdHRwSGFuZGxlclxuICovXG5leHBvcnQgZnVuY3Rpb24gYWRkQ29tcHJlc3Npb25FeGNsdXNpb24odXJsKSB7XG4gIGNvbXByZXNzaW9uRXhjbHVzaW9ucy5hZGQodXJsKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHByb21pc2VIdHRwSGFuZGxlcihtZXRob2QsIHVybCwgZGF0YSwgdGltZW91dCwgY29tcHJlc3NlZFBvc3QpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKCBmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgIC8vIGd6aXAuY29tcHJlc3MgbWF5IGJlIGZhbHNlIGlmIHRoZXJlIGlzIG5vIGltcGxlbWVudGF0aW9uIGZvciB0aGlzIHBsYXRmb3JtXG4gICAvLyBvciBtYXliZSBpdCBpcyBub3QgbG9hZGVkIHlldFxuICAgaWYgKG1ldGhvZCA9PT0gJ1BPU1QnICYmIGNvbXByZXNzZWRQb3N0ICYmIGNvbXByZXNzaW9uRW5hYmxlZCh1cmwpKSB7XG4gICAgIGNvbnN0IGRhdGFMZW5ndGggPSBkYXRhLmxlbmd0aDtcbiAgICAgZGF0YSA9IGNvbXByZXNzKGRhdGEpO1xuICAgICBjb25zb2xlLmxvZyhcIkNvbXByZXNzZWQgcmVxdWVzdCB0byBcIisgdXJsICtcIiwgYnl0ZXMgc2F2ZWQgPSBcIisgKGRhdGFMZW5ndGggLSBkYXRhLmxlbmd0aCkgKyBcIiAoXCIgKyAoMTAwKihkYXRhTGVuZ3RoIC0gZGF0YS5sZW5ndGgpLyBkYXRhTGVuZ3RoKS50b0ZpeGVkKDEpICtcIiUpXCIsIFwiQ0xJUVpFbnZpcm9ubWVudC5odHRwSGFuZGxlclwiKTtcbiAgICAgaHR0cEhhbmRsZXIobWV0aG9kLCB1cmwsIHJlc29sdmUsIHJlamVjdCwgdGltZW91dCwgZGF0YSwgdW5kZWZpbmVkLCAnZ3ppcCcpO1xuICAgfSBlbHNlIHtcbiAgICAgaHR0cEhhbmRsZXIobWV0aG9kLCB1cmwsIHJlc29sdmUsIHJlamVjdCwgdGltZW91dCwgZGF0YSk7XG4gICB9XG4gfSk7XG59O1xuIiwiaW1wb3J0ICogYXMgZ3ppcCBmcm9tIFwiLi4vcGxhdGZvcm0vZ3ppcFwiO1xuXG4vKipcbiAqICBDb21wcmVzcyBhIHN0cmluZ1xuICpcbiAqICBAcGFyYW0ge3N0cmluZ30gc3RyaW5nIHRvIGNvbXByZXNzXG4gKiAgQHJldHVybnMge1VJbnQ4QXJyYXl9IGNvbXByZXNzZWQgZGF0YVxuICovXG5leHBvcnQgbGV0IGNvbXByZXNzID0gZ3ppcC5jb21wcmVzcyB8fCBmYWxzZTtcblxuLyoqXG4gKiAgRGVjb21wcmVzcyBhIEd6aXAgY29tcHJlc3NlZCBzdHJpbmdcbiAqXG4gKiAgQHBhcmFtIHtVSW50OEFycmF5fSBnemlwcGVkIGRhdGFcbiAqICBAcmV0dXJucyB7c3RyaW5nfSBkZWNvbXByZXNzZWQgc3RyaW5nXG4gKi9cbmV4cG9ydCBsZXQgZGVjb21wcmVzcyA9IGd6aXAuZGVjb21wcmVzcyB8fCBmYWxzZTtcbiIsInZhciBDbGlxekxhbmd1YWdlID0ge1xuICBpbml0KCkge30sXG4gIHN0YXRlVG9RdWVyeVN0cmluZzogZnVuY3Rpb24gKCkgeyByZXR1cm4gJyZsYW5nPWRlLGVuJzsgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgQ2xpcXpMYW5ndWFnZTtcbiIsImltcG9ydCBMYW5ndWFnZSBmcm9tICcuLi9wbGF0Zm9ybS9sYW5ndWFnZSc7XG5leHBvcnQgZGVmYXVsdCBMYW5ndWFnZTtcbiIsImV4cG9ydCBmdW5jdGlvbiBpc1VSSSh0ZXh0KSB7XG4gIHJldHVybiBmYWxzZTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZXF1YWwodXJsMSwgdXJsMikge1xuICByZXR1cm4gdXJsMSA9PT0gdXJsMjtcbn1cbiIsImltcG9ydCB7IGlzVVJJIH0gZnJvbSAnLi4vcGxhdGZvcm0vdXJsJztcblxuY29uc3QgVXJsUmVnRXhwID0gL14oKFthLXpcXGRdKFthLXpcXGQtXSpbYS16XFxkXSk/KVxcLikrW2Etel17Mix9KFxcOlxcZCspPyQvaTtcblxuZXhwb3J0IGZ1bmN0aW9uIGlzVXJsKGlucHV0KSB7XG4gIGlmICghaW5wdXQpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgLy8gVE9ETzogaGFuZGxlIGlwIGFkZHJlc3Nlc1xuICBpZiAoaXNVUkkoaW5wdXQpKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0gZWxzZSB7XG4gICAgLy9zdGVwIDEgcmVtb3ZlIGV2ZW50dWFsIHByb3RvY29sXG4gICAgY29uc3QgcHJvdG9jb2xQb3MgPSBpbnB1dC5pbmRleE9mKCc6Ly8nKTtcbiAgICBpZihwcm90b2NvbFBvcyAhPSAtMSAmJiBwcm90b2NvbFBvcyA8PSA2KXtcbiAgICAgIGlucHV0ID0gaW5wdXQuc2xpY2UocHJvdG9jb2xQb3MrMylcbiAgICB9XG4gICAgLy9zdGVwMiByZW1vdmUgcGF0aCAmIGV2ZXJ5dGhpbmcgYWZ0ZXJcbiAgICBpbnB1dCA9IGlucHV0LnNwbGl0KCcvJylbMF07XG4gICAgLy9zdGVwMyBydW4gdGhlIHJlZ2V4XG4gICAgcmV0dXJuIFVybFJlZ0V4cC50ZXN0KGlucHV0KTtcbiAgfVxufVxuXG4vKlxuc3RyaXAgcHJvdG9jb2wgZnJvbSB1cmxcbiovXG5leHBvcnQgZnVuY3Rpb24gdXJsU3RyaXBQcm90b2NvbCh1cmwpIHtcbiAgbGV0IHJlc3VsdFVybCA9IHVybDtcbiAgY29uc3QgdG9SZW1vdmUgPSBbJ2h0dHBzOi8vJywgJ2h0dHA6Ly8nLFxuICAgICd3d3cyLicsICd3d3cuJyxcbiAgICAnbW9iaWxlLicsICdtb2JpbC4nLCAnbS4nXTtcbiAgdG9SZW1vdmUuZm9yRWFjaChwYXJ0ID0+IHtcbiAgICBpZiAocmVzdWx0VXJsLnRvTG93ZXJDYXNlKCkuc3RhcnRzV2l0aChwYXJ0KSkge1xuICAgICAgcmVzdWx0VXJsID0gcmVzdWx0VXJsLnN1YnN0cmluZyhwYXJ0Lmxlbmd0aCk7XG4gICAgfVxuICB9KTtcbiAgLy8gcmVtb3ZlIHRyYWlsaW5nIHNsYXNoIGFzIHdlbGwgdG8gaGF2ZSBhbGwgdXJscyBpbiB0aGUgc2FtZSBmb3JtYXRcbiAgaWYgKHJlc3VsdFVybFtyZXN1bHRVcmwubGVuZ3RoIC0gMV0gPT09ICcvJykge1xuICAgIHJlc3VsdFVybCA9IHJlc3VsdFVybC5zbGljZSgwLCAtMSk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdFVybDtcbn1cblxuZXhwb3J0IHsgZGVmYXVsdCBhcyBlcXVhbHMgfSBmcm9tICcuLi9wbGF0Zm9ybS91cmwnO1xuIiwiaW1wb3J0IENMSVFaRW52aXJvbm1lbnQgZnJvbSBcIi4uL3BsYXRmb3JtL2Vudmlyb25tZW50XCI7XG5pbXBvcnQgY29uc29sZSBmcm9tIFwiLi9jb25zb2xlXCI7XG5pbXBvcnQgcHJlZnMgZnJvbSBcIi4vcHJlZnNcIjtcbmltcG9ydCBTdG9yYWdlIGZyb20gXCIuL3N0b3JhZ2VcIjtcbmltcG9ydCBDbGlxekV2ZW50cyBmcm9tICcuL2V2ZW50cyc7XG5pbXBvcnQgeyBUTERzIH0gZnJvbSBcIi4vdGxkc1wiO1xuaW1wb3J0IHsgaHR0cEhhbmRsZXIsIHByb21pc2VIdHRwSGFuZGxlciB9IGZyb20gJy4vaHR0cCc7XG5pbXBvcnQgZ3ppcCBmcm9tICcuL2d6aXAnO1xuaW1wb3J0IENsaXF6TGFuZ3VhZ2UgZnJvbSAnLi9sYW5ndWFnZSc7XG5pbXBvcnQgeyBpc1VybCB9IGZyb20gJy4vdXJsJztcblxudmFyIFZFUlRJQ0FMX0VOQ09ESU5HUyA9IHtcbiAgICAncGVvcGxlJzoncCcsXG4gICAgJ25ld3MnOiduJyxcbiAgICAndmlkZW8nOid2JyxcbiAgICAnaHEnOidoJyxcbiAgICAnYm0nOiAnbScsXG4gICAgJ3JlY2lwZVJEJzogJ3InLFxuICAgICdnYW1lJzogJ2cnLFxuICAgICdtb3ZpZSc6ICdvJ1xufTtcblxudmFyIENPTE9VUlMgPSBbJyNmZmNlNmQnLCcjZmY2ZjY5JywnIzk2ZTM5NycsJyM1YzdiYTEnLCcjYmZiZmJmJywnIzNiNTU5OCcsJyNmYmI0NGMnLCcjMDBiMmU1JywnI2IzYjNiMycsJyM5OWNjY2MnLCcjZmYwMDI3JywnIzk5OTk5OSddLFxuICAgIExPR09TID0gWyd3aWtpcGVkaWEnLCAnZ29vZ2xlJywgJ2ZhY2Vib29rJywgJ3lvdXR1YmUnLCAnZHVja2R1Y2tnbycsICdzdGVybmVmcmVzc2VyJywgJ3phbGFuZG8nLCAnYmlsZCcsICd3ZWInLCAnZWJheScsICdnbXgnLCAnYW1hem9uJywgJ3Qtb25saW5lJywgJ3dpd28nLCAnd3dlJywgJ3dlaWdodHdhdGNoZXJzJywgJ3JwLW9ubGluZScsICd3bWFnYXppbmUnLCAnY2hpcCcsICdzcGllZ2VsJywgJ3lhaG9vJywgJ3BheXBhbCcsICdpbWRiJywgJ3dpa2lhJywgJ21zbicsICdhdXRvYmlsZCcsICdkYWlseW1vdGlvbicsICdobScsICdob3RtYWlsJywgJ3plaXQnLCAnYmFobicsICdzb2Z0b25pYycsICdoYW5kZWxzYmxhdHQnLCAnc3Rlcm4nLCAnY25uJywgJ21vYmlsZScsICdhZXR2JywgJ3Bvc3RiYW5rJywgJ2RrYicsICdiaW5nJywgJ2Fkb2JlJywgJ2JiYycsICduaWtlJywgJ3N0YXJidWNrcycsICd0ZWNoY3J1bmNoJywgJ3Zldm8nLCAndGltZScsICd0d2l0dGVyJywgJ3dlYXRoZXJ1bmRlcmdyb3VuZCcsICd4aW5nJywgJ3llbHAnLCAneWFuZGV4JywgJ3dlYXRoZXInLCAnZmxpY2tyJ10sXG4gICAgQlJBTkRTX0RBVEFCQVNFID0geyBkb21haW5zOiB7fSwgcGFsZXR0ZTogW1wiOTk5XCJdIH0sXG4gICAgaXB2NF9wYXJ0ID0gXCIwKihbMC05XXxbMS05XVswLTldfDFbMC05XXsyfXwyWzAtNF1bMC05XXwyNVswLTVdKVwiLCAvLyBudW1iZXJzIDAgLSAyNTVcbiAgICBpcHY0X3JlZ2V4ID0gbmV3IFJlZ0V4cChcIl5cIiArIGlwdjRfcGFydCArIFwiXFxcXC5cIisgaXB2NF9wYXJ0ICsgXCJcXFxcLlwiKyBpcHY0X3BhcnQgKyBcIlxcXFwuXCIrIGlwdjRfcGFydCArIFwiKFs6XShbMC05XSkrKT8kXCIpLCAvLyBwb3J0IG51bWJlclxuICAgIGlwdjZfcmVnZXggPSBuZXcgUmVnRXhwKFwiXlxcXFxbPygoWzAtOV18W2EtZl18W0EtRl0pKls6Ll0rKFswLTldfFthLWZdfFtBLUZdKStbOi5dKikrW1xcXFxdXT8oWzpdWzAtOV0rKT8kXCIpO1xuY29uc3Qgc2NoZW1lUkUgPSAvXihcXFMrPyk6KFxcL1xcLyk/KC4qKSQvaTtcblxudmFyIENsaXF6VXRpbHMgPSB7XG4gIGVudmlyb25tZW50OiBDTElRWkVudmlyb25tZW50LFxuICBSRVNVTFRTX1BST1ZJREVSOiAgICAgICAgICAgICAgIENMSVFaRW52aXJvbm1lbnQuUkVTVUxUU19QUk9WSURFUixcbiAgUklDSF9IRUFERVI6ICAgICAgICAgICAgICAgICAgICBDTElRWkVudmlyb25tZW50LlJJQ0hfSEVBREVSLFxuICBSRVNVTFRTX1BST1ZJREVSX0xPRzogICAgICAgICAgICdodHRwczovL2FwaS5jbGlxei5jb20vYXBpL3YxL2xvZ2dpbmc/cT0nLFxuICBSRVNVTFRTX1BST1ZJREVSX1BJTkc6ICAgICAgICAgICdodHRwczovL2FwaS5jbGlxei5jb20vcGluZycsXG4gIENPTkZJR19QUk9WSURFUjogICAgICAgICAgICAgICAgJ2h0dHBzOi8vYXBpLmNsaXF6LmNvbS9hcGkvdjEvY29uZmlnJyxcbiAgU0FGRV9CUk9XU0lORzogICAgICAgICAgICAgICAgICAnaHR0cHM6Ly9zYWZlLWJyb3dzaW5nLmNsaXF6LmNvbScsXG4gIFRVVE9SSUFMX1VSTDogICAgICAgICAgICAgICAgICAgJ2h0dHBzOi8vY2xpcXouY29tL2hvbWUvb25ib2FyZGluZycsXG4gIFVOSU5TVEFMTDogICAgICAgICAgICAgICAgICAgICAgJ2h0dHBzOi8vY2xpcXouY29tL2hvbWUvb2ZmYm9hcmRpbmcnLFxuICBGRUVEQkFDSzogICAgICAgICAgICAgICAgICAgICAgICdodHRwczovL2NsaXF6LmNvbS9mZWVkYmFjay8nLFxuICBTWVNURU1fQkFTRV9VUkw6ICAgICAgICAgICAgICAgIENMSVFaRW52aXJvbm1lbnQuU1lTVEVNX0JBU0VfVVJMLFxuICBQUkVGRVJSRURfTEFOR1VBR0U6ICAgICAgICAgICAgIG51bGwsXG4gIFJFU1VMVFNfVElNRU9VVDogICAgICAgICAgICAgICAgQ0xJUVpFbnZpcm9ubWVudC5SRVNVTFRTX1RJTUVPVVQsXG5cbiAgQlJBTkRTX0RBVEFCQVNFOiBCUkFORFNfREFUQUJBU0UsXG5cbiAgLy93aWxsIGJlIHVwZGF0ZWQgZnJvbSB0aGUgbWl4ZXIgY29uZmlnIGVuZHBvaW50IGV2ZXJ5IHRpbWUgbmV3IGxvZ29zIGFyZSBnZW5lcmF0ZWRcbiAgQlJBTkRTX0RBVEFCQVNFX1ZFUlNJT046IDE0ODM5ODAyMTM2MzAsXG4gIEdFT0xPQ19XQVRDSF9JRDogICAgICAgICAgICAgICAgbnVsbCwgLy8gVGhlIElEIG9mIHRoZSBnZW9sb2NhdGlvbiB3YXRjaGVyIChmdW5jdGlvbiB0aGF0IHVwZGF0ZXMgY2FjaGVkIGdlb2xvY2F0aW9uIG9uIGNoYW5nZSlcbiAgVkVSVElDQUxfVEVNUExBVEVTOiB7XG4gICAgICAgICduJzogJ25ld3MnICAgICxcbiAgICAgICAgJ3AnOiAncGVvcGxlJyAgLFxuICAgICAgICAndic6ICd2aWRlbycgICAsXG4gICAgICAgICdoJzogJ2hxJyAgICAgICxcbiAgICAgICAgJ3InOiAncmVjaXBlJyAsXG4gICAgICAgICdnJzogJ2NwZ2FtZV9tb3ZpZScsXG4gICAgICAgICdvJzogJ2NwZ2FtZV9tb3ZpZSdcbiAgICB9LFxuICBobTogbnVsbCxcbiAgaHc6IG51bGwsXG4gIG1jOiBudWxsLFxuICBURU1QTEFURVNfUEFUSDogQ0xJUVpFbnZpcm9ubWVudC5URU1QTEFURVNfUEFUSCxcbiAgVEVNUExBVEVTOiBDTElRWkVudmlyb25tZW50LlRFTVBMQVRFUyxcbiAgTUVTU0FHRV9URU1QTEFURVM6IENMSVFaRW52aXJvbm1lbnQuTUVTU0FHRV9URU1QTEFURVMsXG4gIFBBUlRJQUxTOiBDTElRWkVudmlyb25tZW50LlBBUlRJQUxTLFxuICBTS0lOX1BBVEg6IENMSVFaRW52aXJvbm1lbnQuU0tJTl9QQVRILFxuICBMT0NBTEVfUEFUSDogQ0xJUVpFbnZpcm9ubWVudC5MT0NBTEVfUEFUSCxcbiAgUkVSQU5LRVJTOiBDTElRWkVudmlyb25tZW50LlJFUkFOS0VSUyxcbiAgQ0xJUVpfT05CT0FSRElORzogQ0xJUVpFbnZpcm9ubWVudC5DTElRWl9PTkJPQVJESU5HLFxuICBDTElRWl9PTkJPQVJESU5HX1VSTDogQ0xJUVpFbnZpcm9ubWVudC5DTElRWl9PTkJPQVJESU5HX1VSTCxcbiAgQlJPV1NFUl9PTkJPQVJESU5HX1BSRUY6IENMSVFaRW52aXJvbm1lbnQuQlJPV1NFUl9PTkJPQVJESU5HX1BSRUYsXG4gIEJST1dTRVJfT05CT0FSRElOR19TVEVQX1BSRUY6IENMSVFaRW52aXJvbm1lbnQuQlJPV1NFUl9PTkJPQVJESU5HX1NURVBfUFJFRixcbiAgQ0xJUVpfTkVXX1RBQjogQ0xJUVpFbnZpcm9ubWVudC5DTElRWl9ORVdfVEFCLFxuICBDTElRWl9ORVdfVEFCX1JFU09VUkNFX1VSTDogQ0xJUVpFbnZpcm9ubWVudC5DTElRWl9ORVdfVEFCX1JFU09VUkNFX1VSTCxcblxuICB0ZWxlbWV0cnlIYW5kbGVyczogW1xuICAgIENMSVFaRW52aXJvbm1lbnQudGVsZW1ldHJ5XG4gIF0sXG5cbiAgaW5pdDogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gICAgaWYgKCFvcHRpb25zLmxhbmcpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChcImxhbmcgbWlzc2luZ1wiKTtcbiAgICB9XG5cbiAgICBDTElRWkVudmlyb25tZW50Lmd6aXAgPSBnemlwO1xuXG4gICAgLy8gY3V0dGluZyBjeWNsaWMgZGVwZW5kZW5jeVxuICAgIENMSVFaRW52aXJvbm1lbnQuZ2V0TG9nb0RldGFpbHMgPSBDbGlxelV0aWxzLmdldExvZ29EZXRhaWxzLmJpbmQoQ2xpcXpVdGlscyk7XG4gICAgQ0xJUVpFbnZpcm9ubWVudC5nZXREZXRhaWxzRnJvbVVybCA9IENsaXF6VXRpbHMuZ2V0RGV0YWlsc0Zyb21VcmwuYmluZChDbGlxelV0aWxzKTtcbiAgICBDTElRWkVudmlyb25tZW50LmdldExvY2FsaXplZFN0cmluZyA9IENsaXF6VXRpbHMuZ2V0TG9jYWxpemVkU3RyaW5nLmJpbmQoQ2xpcXpVdGlscyk7XG4gICAgQ0xJUVpFbnZpcm9ubWVudC5hcHAgPSBDbGlxelV0aWxzLmFwcDtcbiAgICBDbGlxelV0aWxzLmxvZygnSW5pdGlhbGl6ZWQnLCAnQ2xpcXpVdGlscycpO1xuXG4gICAgQ2xpcXpVdGlscy5zZXRMYW5nKG9wdGlvbnMubGFuZyk7XG5cbiAgICBDbGlxelV0aWxzLnRsZEV4dHJhY3RvciA9IENMSVFaRW52aXJvbm1lbnQudGxkRXh0cmFjdG9yIHx8IENsaXF6VXRpbHMuZ2VuZXJpY1RsZEV4dHJhY3RvcjtcbiAgfSxcbiAgZ2V0TGFuZ3VhZ2VGcm9tTG9jYWxlOiBmdW5jdGlvbihsb2NhbGUpIHtcbiAgICByZXR1cm4gbG9jYWxlLm1hdGNoKC8oW2Etel0rKSg/OlstX10oW0EtWl0rKSk/LylbMV07XG4gIH0sXG4gIFNVUFBPUlRFRF9MQU5HUzogeydkZSc6J2RlJywgJ2VuJzonZW4nLCAnZnInOidmcid9LFxuICBnZXRTdXBwb3J0ZWRMYW5ndWFnZTogZnVuY3Rpb24obGFuZykge1xuICAgIHJldHVybiBDbGlxelV0aWxzLlNVUFBPUlRFRF9MQU5HU1tsYW5nXSB8fCAnZW4nO1xuICB9LFxuICBzZXRMYW5nOiBmdW5jdGlvbiAobG9jYWxlKSB7XG4gICAgY29uc3QgbGFuZyA9IENsaXF6VXRpbHMuZ2V0TGFuZ3VhZ2VGcm9tTG9jYWxlKGxvY2FsZSk7XG4gICAgY29uc3Qgc3VwcG9ydGVkTGFuZyA9IENsaXF6VXRpbHMuZ2V0U3VwcG9ydGVkTGFuZ3VhZ2UobGFuZyk7XG4gICAgQ2xpcXpVdGlscy5QUkVGRVJSRURfTEFOR1VBR0UgPSBsb2NhbGU7XG4gICAgQ2xpcXpVdGlscy5nZXRMb2NhbGVGaWxlKHN1cHBvcnRlZExhbmcpO1xuICB9LFxuXG4gIGlzTnVtYmVyOiBmdW5jdGlvbihuKXtcbiAgICAgIC8qXG4gICAgICBOT1RFOiB0aGlzIGZ1bmN0aW9uIGNhbid0IHJlY29nbml6ZSBudW1iZXJzIGluIHRoZSBmb3JtIHN1Y2ggYXM6IFwiMS4yQlwiLCBidXQgaXQgY2FuIGZvciBcIjFlNFwiLiBTZWUgc3BlY2lmaWNhdGlvbiBmb3IgaXNGaW5pdGUoKVxuICAgICAgICovXG4gICAgICByZXR1cm4gIWlzTmFOKHBhcnNlRmxvYXQobikpICYmIGlzRmluaXRlKG4pO1xuICB9LFxuXG4gIC8vcmV0dXJucyB0aGUgdHlwZSBvbmx5IGlmIGl0IGlzIGtub3duXG4gIGdldEtub3duVHlwZTogZnVuY3Rpb24odHlwZSl7XG4gICAgcmV0dXJuIFZFUlRJQ0FMX0VOQ09ESU5HUy5oYXNPd25Qcm9wZXJ0eSh0eXBlKSAmJiB0eXBlO1xuICB9LFxuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3QgYSB1cmkgZnJvbSBhIHVybFxuICAgKiBAcGFyYW0ge3N0cmluZ30gIGFVcmwgLSB1cmxcbiAgICogQHBhcmFtIHtzdHJpbmd9ICBhT3JpZ2luQ2hhcnNldCAtIG9wdGlvbmFsIGNoYXJhY3RlciBzZXQgZm9yIHRoZSBVUklcbiAgICogQHBhcmFtIHtuc0lVUkl9ICBhQmFzZVVSSSAtIGJhc2UgVVJJIGZvciB0aGUgc3BlY1xuICAgKi9cbiAgbWFrZVVyaTogQ0xJUVpFbnZpcm9ubWVudC5tYWtlVXJpLFxuXG4gIHNldExvZ29EYjogZnVuY3Rpb24gKGRiKSB7XG4gICAgQlJBTkRTX0RBVEFCQVNFID0gQ2xpcXpVdGlscy5CUkFORFNfREFUQUJBU0UgPSBkYjtcbiAgfSxcbiAgZ2V0TG9nb0RldGFpbHM6IGZ1bmN0aW9uKHVybERldGFpbHMpe1xuICAgIHZhciBiYXNlID0gdXJsRGV0YWlscy5uYW1lLFxuICAgICAgICBiYXNlQ29yZSA9IGJhc2UucmVwbGFjZSgvWy1dL2csIFwiXCIpLFxuICAgICAgICBjaGVjayA9IGZ1bmN0aW9uKGhvc3QscnVsZSl7XG4gICAgICAgICAgdmFyIGFkZHJlc3MgPSBob3N0Lmxhc3RJbmRleE9mKGJhc2UpLCBwYXJzZWRkb21haW4gPSBob3N0LnN1YnN0cigwLGFkZHJlc3MpICsgXCIkXCIgKyBob3N0LnN1YnN0cihhZGRyZXNzICsgYmFzZS5sZW5ndGgpXG5cbiAgICAgICAgICByZXR1cm4gcGFyc2VkZG9tYWluLmluZGV4T2YocnVsZSkgIT0gLTFcbiAgICAgICAgfSxcbiAgICAgICAgcmVzdWx0ID0ge30sXG4gICAgICAgIGRvbWFpbnMgPSBCUkFORFNfREFUQUJBU0UuZG9tYWlucztcblxuXG5cbiAgICBpZihiYXNlLmxlbmd0aCA9PSAwKVxuICAgICAgcmV0dXJuIHJlc3VsdDtcblxuICAgIGlmIChiYXNlID09IFwiSVBcIikgcmVzdWx0ID0geyB0ZXh0OiBcIklQXCIsIGJhY2tncm91bmRDb2xvcjogXCI5MDc3ZTNcIiB9XG5cbiAgICBlbHNlIGlmIChkb21haW5zW2Jhc2VdKSB7XG4gICAgICBmb3IgKHZhciBpPTAsaW1heD1kb21haW5zW2Jhc2VdLmxlbmd0aDtpPGltYXg7aSsrKSB7XG4gICAgICAgIHZhciBydWxlID0gZG9tYWluc1tiYXNlXVtpXSAvLyByID0gcnVsZSwgYiA9IGJhY2tncm91bmQtY29sb3IsIGwgPSBsb2dvLCB0ID0gdGV4dCwgYyA9IGNvbG9yXG5cbiAgICAgICAgaWYgKGkgPT0gaW1heCAtIDEgfHwgY2hlY2sodXJsRGV0YWlscy5ob3N0LHJ1bGUucikpIHtcbiAgICAgICAgICByZXN1bHQgPSB7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IHJ1bGUuYj9ydWxlLmI6bnVsbCxcbiAgICAgICAgICAgIGJhY2tncm91bmRJbWFnZTogcnVsZS5sP1widXJsKGh0dHBzOi8vY2RuLmNsaXF6LmNvbS9icmFuZHMtZGF0YWJhc2UvZGF0YWJhc2UvXCIgKyB0aGlzLkJSQU5EU19EQVRBQkFTRV9WRVJTSU9OICsgXCIvbG9nb3MvXCIgKyBiYXNlICsgXCIvXCIgKyBydWxlLnIgKyBcIi5zdmcpXCI6XCJcIixcbiAgICAgICAgICAgIHRleHQ6IHJ1bGUudCxcbiAgICAgICAgICAgIGNvbG9yOiBydWxlLmM/XCJcIjpcIiNmZmZcIlxuICAgICAgICAgIH1cblxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmVzdWx0LnRleHQgPSByZXN1bHQudGV4dCB8fCAoYmFzZUNvcmUubGVuZ3RoID4gMSA/ICgoYmFzZUNvcmVbMF0udG9VcHBlckNhc2UoKSArIGJhc2VDb3JlWzFdLnRvTG93ZXJDYXNlKCkpKSA6IFwiXCIpXG4gICAgcmVzdWx0LmJhY2tncm91bmRDb2xvciA9IHJlc3VsdC5iYWNrZ3JvdW5kQ29sb3IgfHwgQlJBTkRTX0RBVEFCQVNFLnBhbGV0dGVbYmFzZS5zcGxpdChcIlwiKS5yZWR1Y2UoZnVuY3Rpb24oYSxiKXsgcmV0dXJuIGEgKyBiLmNoYXJDb2RlQXQoMCkgfSwwKSAlIEJSQU5EU19EQVRBQkFTRS5wYWxldHRlLmxlbmd0aF1cbiAgICB2YXIgY29sb3JJRCA9IEJSQU5EU19EQVRBQkFTRS5wYWxldHRlLmluZGV4T2YocmVzdWx0LmJhY2tncm91bmRDb2xvciksXG4gICAgICAgIGJ1dHRvbkNsYXNzID0gQlJBTkRTX0RBVEFCQVNFLmJ1dHRvbnMgJiYgY29sb3JJRCAhPSAtMSAmJiBCUkFORFNfREFUQUJBU0UuYnV0dG9uc1tjb2xvcklEXT9CUkFORFNfREFUQUJBU0UuYnV0dG9uc1tjb2xvcklEXToxMFxuXG4gICAgcmVzdWx0LmJ1dHRvbnNDbGFzcyA9IFwiY2xpcXotYnJhbmRzLWJ1dHRvbi1cIiArIGJ1dHRvbkNsYXNzXG4gICAgcmVzdWx0LnN0eWxlID0gXCJiYWNrZ3JvdW5kLWNvbG9yOiAjXCIgKyByZXN1bHQuYmFja2dyb3VuZENvbG9yICsgXCI7Y29sb3I6XCIgKyAocmVzdWx0LmNvbG9yIHx8ICcjZmZmJykgKyBcIjtcIlxuXG5cbiAgICBpZiAocmVzdWx0LmJhY2tncm91bmRJbWFnZSkgcmVzdWx0LnN0eWxlICs9IFwiYmFja2dyb3VuZC1pbWFnZTpcIiArIHJlc3VsdC5iYWNrZ3JvdW5kSW1hZ2UgKyBcIjsgdGV4dC1pbmRlbnQ6IC0xMGVtO1wiXG5cbiAgICByZXR1cm4gcmVzdWx0XG4gIH0sXG4gIGh0dHBIYW5kbGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGVycm9ySGFuZGxlciA9IGFyZ3VtZW50c1szXTsgLy8gc2VlIGh0dHBHZXQgb3IgaHR0cFBvc3QgYXJndW1lbnRzXG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBodHRwSGFuZGxlci5hcHBseSh1bmRlZmluZWQsIGFyZ3VtZW50cyk7XG4gICAgfSBjYXRjaChlKSB7XG4gICAgICBpZihlcnJvckhhbmRsZXIpIHtcbiAgICAgICAgZXJyb3JIYW5kbGVyKGUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgQ2xpcXpVdGlscy5sb2coZSwgXCJodHRwSGFuZGxlciBmYWlsZWRcIik7XG4gICAgICB9XG4gICAgfVxuICB9LFxuICBodHRwR2V0OiBmdW5jdGlvbih1cmwsIGNhbGxiYWNrLCBvbmVycm9yLCB0aW1lb3V0LCBfLCBzeW5jKXtcbiAgICByZXR1cm4gQ2xpcXpVdGlscy5odHRwSGFuZGxlcignR0VUJywgdXJsLCBjYWxsYmFjaywgb25lcnJvciwgdGltZW91dCwgXywgc3luYyk7XG4gIH0sXG4gIGh0dHBQb3N0OiBmdW5jdGlvbih1cmwsIGNhbGxiYWNrLCBkYXRhLCBvbmVycm9yLCB0aW1lb3V0KSB7XG4gICAgcmV0dXJuIENsaXF6VXRpbHMuaHR0cEhhbmRsZXIoJ1BPU1QnLCB1cmwsIGNhbGxiYWNrLCBvbmVycm9yLCB0aW1lb3V0LCBkYXRhKTtcbiAgfSxcbiAgaHR0cFB1dDogZnVuY3Rpb24odXJsLCBjYWxsYmFjaywgZGF0YSwgb25lcnJvciwgdGltZW91dCkge1xuICAgIHJldHVybiBDbGlxelV0aWxzLmh0dHBIYW5kbGVyKCdQVVQnLCB1cmwsIGNhbGxiYWNrLCBvbmVycm9yLCB0aW1lb3V0LCBkYXRhKTtcbiAgfSxcbiAgZ2V0TG9jYWxTdG9yYWdlKHVybCkge1xuICAgIHJldHVybiBuZXcgU3RvcmFnZSh1cmwpO1xuICB9LFxuICAvKipcbiAgICogTG9hZHMgYSByZXNvdXJjZSBVUkwgZnJvbSB0aGUgeHBpLlxuICAgKlxuICAgKiBXcmFwcyBodHRwR2V0IGluIGEgdHJ5LWNhdGNoIGNsYXVzZS4gV2UgbmVlZCB0byBkbyB0aGlzLCBiZWNhdXNlIHdoZW5cbiAgICogdHJ5aW5nIHRvIGxvYWQgYSBub24tZXhpc3RpbmcgZmlsZSBmcm9tIGFuIHhwaSB2aWEgeG1saHR0cHJlcXVlc3QsIEZpcmVmb3hcbiAgICogdGhyb3dzIGEgTlNfRVJST1JfRklMRV9OT1RfRk9VTkQgZXhjZXB0aW9uIGluc3RlYWQgb2YgY2FsbGluZyB0aGUgb25lcnJvclxuICAgKiBmdW5jdGlvbi5cbiAgICpcbiAgICogQHNlZSBodHRwczovL2J1Z3ppbGxhLm1vemlsbGEub3JnL3Nob3dfYnVnLmNnaT9pZD04MjcyNDMgKHByb2JhYmx5KS5cbiAgICovXG4gIGxvYWRSZXNvdXJjZTogZnVuY3Rpb24odXJsLCBjYWxsYmFjaywgb25lcnJvcikge1xuICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBDbGlxelV0aWxzLmh0dHBHZXQodXJsLCBjYWxsYmFjaywgb25lcnJvciwgMzAwMCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgQ2xpcXpVdGlscy5sb2coXCJDb3VsZCBub3QgbG9hZCByZXNvdXJjZSBcIiArIHVybCArIFwiIGZyb20gdGhlIHhwaVwiLFxuICAgICAgICAgICAgICAgICAgICAgXCJDbGlxelV0aWxzLmh0dHBIYW5kbGVyXCIpO1xuICAgICAgb25lcnJvciAmJiBvbmVycm9yKCk7XG4gICAgfVxuICB9LFxuICBvcGVuVGFiSW5XaW5kb3c6IENMSVFaRW52aXJvbm1lbnQub3BlblRhYkluV2luZG93LFxuICBnZXRQcmVmOiBwcmVmcy5nZXQsXG4gIHNldFByZWY6IHByZWZzLnNldCxcbiAgaGFzUHJlZjogcHJlZnMuaGFzLFxuICBjbGVhclByZWY6IHByZWZzLmNsZWFyLFxuICBsb2c6IGZ1bmN0aW9uIChtc2csIGtleSkge1xuICAgIGNvbnNvbGUubG9nKGtleSwgbXNnKTtcbiAgfSxcbiAgZ2V0RGF5OiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gTWF0aC5mbG9vcihuZXcgRGF0ZSgpLmdldFRpbWUoKSAvIDg2NDAwMDAwKTtcbiAgfSxcbiAgLy9jcmVhdGVzIGEgcmFuZG9tICdsZW4nIGxvbmcgc3RyaW5nIGZyb20gdGhlIGlucHV0IHNwYWNlXG4gIHJhbmQ6IGZ1bmN0aW9uKGxlbiwgX3NwYWNlKXtcbiAgICAgIHZhciByZXQgPSAnJywgaSxcbiAgICAgICAgICBzcGFjZSA9IF9zcGFjZSB8fCAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODknLFxuICAgICAgICAgIHNMZW4gPSBzcGFjZS5sZW5ndGg7XG5cbiAgICAgIGZvcihpPTA7IGkgPCBsZW47IGkrKyApXG4gICAgICAgICAgcmV0ICs9IHNwYWNlLmNoYXJBdChNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBzTGVuKSk7XG5cbiAgICAgIHJldHVybiByZXQ7XG4gIH0sXG4gIGhhc2g6IGZ1bmN0aW9uKHMpe1xuICAgIHJldHVybiBzLnNwbGl0KCcnKS5yZWR1Y2UoZnVuY3Rpb24oYSxiKXsgcmV0dXJuICgoKGE8PDQpLWEpK2IuY2hhckNvZGVBdCgwKSkgJiAweEVGRkZGRkZ9LCAwKVxuICB9LFxuICBjbGVhbk1vemlsbGFBY3Rpb25zOiBmdW5jdGlvbih1cmwpe1xuICAgIGlmKHVybC5pbmRleE9mKFwibW96LWFjdGlvbjpcIikgPT0gMCkge1xuICAgICAgICB2YXIgWywgYWN0aW9uLCB1cmxdID0gdXJsLm1hdGNoKC9ebW96LWFjdGlvbjooW14sXSspLCguKikkLyk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgLy8gaGFuZGxlIGNhc2VzIGxpa2U6IG1vei1hY3Rpb246dmlzaXR1cmwse1widXJsXCI6IFwiLi4uXCJ9XG4gICAgICAgICAgY29uc3QgbW96QWN0aW9uVXJsID0gSlNPTi5wYXJzZSh1cmwpLnVybDtcbiAgICAgICAgICBpZiAobW96QWN0aW9uVXJsKSB7XG4gICAgICAgICAgICB1cmwgPSBkZWNvZGVVUklDb21wb25lbnQobW96QWN0aW9uVXJsKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gW2FjdGlvbiwgdXJsXTtcbiAgfSxcbiAgY2xlYW5VcmxQcm90b2NvbDogZnVuY3Rpb24odXJsLCBjbGVhbldXVyl7XG4gICAgaWYgKCF1cmwpXG4gICAgICByZXR1cm4gJyc7XG5cbiAgICAvLyByZW1vdmVzIHByb3RvY29sIGlmIGl0J3MgaHR0cChzKS4gU2VlIENMSVFaSVVNLTIxOC5cbiAgICBjb25zdCB1cmxMb3dlcmVkID0gdXJsLnRvTG93ZXJDYXNlKCk7XG4gICAgaWYgKHVybExvd2VyZWQuc3RhcnRzV2l0aCgnaHR0cDovLycpKVxuICAgICAgdXJsID0gdXJsLnNsaWNlKDcpO1xuICAgIGlmICh1cmxMb3dlcmVkLnN0YXJ0c1dpdGgoJ2h0dHBzOi8vJykpXG4gICAgICB1cmwgPSB1cmwuc2xpY2UoOCk7XG5cbiAgICAvLyByZW1vdmVzIHRoZSB3d3cuXG4gICAgaWYgKGNsZWFuV1dXICYmIHVybC50b0xvd2VyQ2FzZSgpLnN0YXJ0c1dpdGgoJ3d3dy4nKSlcbiAgICAgIHVybCA9IHVybC5zbGljZSg0KTtcblxuICAgIHJldHVybiB1cmw7XG4gIH0sXG4gIGdlbmVyaWNUbGRFeHRyYWN0b3I6IGZ1bmN0aW9uIChob3N0KSB7XG4gICAgdmFyIHYgPSBob3N0LnRvTG93ZXJDYXNlKCkuc3BsaXQoJy4nKSxcbiAgICAgICAgdGxkID0gJyc7XG5cbiAgICB2YXIgZmlyc3RfbGV2ZWwgPSBUTERzW3Zbdi5sZW5ndGggLSAxXV07XG4gICAgdGxkID0gdlt2Lmxlbmd0aCAtIDFdO1xuXG4gICAgaWYgKCh2Lmxlbmd0aCA+IDIpICYmIChmaXJzdF9sZXZlbCA9PSAnY2MnKSkge1xuICAgICAgLy8gY2hlY2sgaWYgd2UgYWxzbyBoYXZlIHRvIHJlbW92ZSB0aGUgc2Vjb25kIGxldmVsLCBvbmx5IGlmIDMgb3IgbW9yZVxuICAgICAgLy8gIGxldmVscyBhbmQgdGhlIGZpcnN0X2xldmVsIHdhcyBhIGNvdW50cnkgY29kZVxuICAgICAgaWYgKFRMRHNbdlt2Lmxlbmd0aCAtIDJdXSkge1xuICAgICAgICB0bGQgPSB2W3YubGVuZ3RoIC0gMl0gKyAnLicgKyB0bGQ7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0bGQ7XG4gIH0sXG4gIGdldERldGFpbHNGcm9tVXJsOiBmdW5jdGlvbihvcmlnaW5hbFVybCl7XG4gICAgdmFyIFthY3Rpb24sIG9yaWdpbmFsVXJsXSA9IENsaXF6VXRpbHMuY2xlYW5Nb3ppbGxhQWN0aW9ucyhvcmlnaW5hbFVybCk7XG4gICAgLy8gZXhjbHVkZSBwcm90b2NvbFxuICAgIHZhciB1cmwgPSBvcmlnaW5hbFVybCxcbiAgICAgICAgc2NoZW1lID0gJycsXG4gICAgICAgIHNsYXNoZXMgPSAnJyxcbiAgICAgICAgbmFtZSA9ICcnLFxuICAgICAgICB0bGQgPSAnJyxcbiAgICAgICAgc3ViZG9tYWlucyA9IFtdLFxuICAgICAgICBwYXRoID0gJycsXG4gICAgICAgIHF1ZXJ5ID0nJyxcbiAgICAgICAgZnJhZ21lbnQgPSAnJztcblxuICAgIC8vIHJlbW92ZSBzY2hlbWVcbiAgICBjb25zdCBzY2hlbWVNYXRjaCA9IHNjaGVtZVJFLmV4ZWModXJsKTtcbiAgICBpZiAoc2NoZW1lTWF0Y2gpIHtcbiAgICAgIHNjaGVtZSA9IHNjaGVtZU1hdGNoWzFdO1xuICAgICAgc2xhc2hlcyA9IHNjaGVtZU1hdGNoWzJdO1xuICAgICAgdXJsID0gc2NoZW1lTWF0Y2hbM107XG4gICAgfVxuICAgIGNvbnN0IHNzbCA9IHNjaGVtZSA9PSAnaHR0cHMnO1xuXG4gICAgLy8gc2VwYXJhdGUgaG9zdG5hbWUgZnJvbSBwYXRoLCBldGMuIENvdWxkIGJlIHNlcGFyYXRlZCBmcm9tIHJlc3QgYnkgLywgPyBvciAjXG4gICAgdmFyIGhvc3QgPSB1cmwuc3BsaXQoL1tcXC9cXCNcXD9dLylbMF0udG9Mb3dlckNhc2UoKTtcbiAgICB2YXIgcGF0aCA9IHVybC5yZXBsYWNlKGhvc3QsJycpO1xuXG4gICAgLy8gc2VwYXJhdGUgdXNlcm5hbWU6cGFzc3dvcmRAIGZyb20gaG9zdFxuICAgIHZhciB1c2VycGFzc19ob3N0ID0gaG9zdC5zcGxpdCgnQCcpO1xuICAgIGlmKHVzZXJwYXNzX2hvc3QubGVuZ3RoID4gMSlcbiAgICAgIGhvc3QgPSB1c2VycGFzc19ob3N0WzFdO1xuXG4gICAgLy8gUGFyc2UgUG9ydCBudW1iZXJcbiAgICB2YXIgcG9ydCA9IFwiXCI7XG5cbiAgICB2YXIgaXNJUHY0ID0gaXB2NF9yZWdleC50ZXN0KGhvc3QpO1xuICAgIHZhciBpc0lQdjYgPSBpcHY2X3JlZ2V4LnRlc3QoaG9zdCk7XG5cblxuICAgIHZhciBpbmRleE9mQ29sb24gPSBob3N0LmluZGV4T2YoXCI6XCIpO1xuICAgIGlmICgoIWlzSVB2NiB8fCBpc0lQdjQpICYmIGluZGV4T2ZDb2xvbiA+PSAwKSB7XG4gICAgICBwb3J0ID0gaG9zdC5zdWJzdHIoaW5kZXhPZkNvbG9uKzEpO1xuICAgICAgaG9zdCA9IGhvc3Quc3Vic3RyKDAsaW5kZXhPZkNvbG9uKTtcbiAgICB9XG4gICAgZWxzZSBpZiAoaXNJUHY2KSB7XG4gICAgICAvLyBJZiBhbiBJUHY2IGFkZHJlc3MgaGFzIGEgcG9ydCBudW1iZXIsIGl0IHdpbGwgYmUgcmlnaHQgYWZ0ZXIgYSBjbG9zaW5nIGJyYWNrZXQgXSA6IGZvcm1hdCBbaXBfdjZdOnBvcnRcbiAgICAgIHZhciBlbmRPZklQID0gaG9zdC5pbmRleE9mKCddOicpO1xuICAgICAgaWYgKGVuZE9mSVAgPj0gMCkge1xuICAgICAgICBwb3J0ID0gaG9zdC5zcGxpdCgnXTonKVsxXTtcbiAgICAgICAgaG9zdCA9IGhvc3Quc3BsaXQoJ106JylbMF0ucmVwbGFjZSgnWycsJycpLnJlcGxhY2UoJ10nLCcnKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBleHRyYWN0IHF1ZXJ5IGFuZCBmcmFnbWVudCBmcm9tIHVybFxuICAgIHZhciBxdWVyeSA9ICcnO1xuICAgIHZhciBxdWVyeV9pZHggPSBwYXRoLmluZGV4T2YoJz8nKTtcbiAgICBpZihxdWVyeV9pZHggIT0gLTEpIHtcbiAgICAgIHF1ZXJ5ID0gcGF0aC5zdWJzdHIocXVlcnlfaWR4KzEpO1xuICAgIH1cblxuICAgIHZhciBmcmFnbWVudCA9ICcnO1xuICAgIHZhciBmcmFnbWVudF9pZHggPSBwYXRoLmluZGV4T2YoJyMnKTtcbiAgICBpZihmcmFnbWVudF9pZHggIT0gLTEpIHtcbiAgICAgIGZyYWdtZW50ID0gcGF0aC5zdWJzdHIoZnJhZ21lbnRfaWR4KzEpO1xuICAgIH1cblxuICAgIC8vIHJlbW92ZSBxdWVyeSBhbmQgZnJhZ21lbnQgZnJvbSBwYXRoXG4gICAgcGF0aCA9IHBhdGgucmVwbGFjZSgnPycgKyBxdWVyeSwgJycpO1xuICAgIHBhdGggPSBwYXRoLnJlcGxhY2UoJyMnICsgZnJhZ21lbnQsICcnKTtcbiAgICBxdWVyeSA9IHF1ZXJ5LnJlcGxhY2UoJyMnICsgZnJhZ21lbnQsICcnKTtcblxuICAgIC8vIGV4dHJhIC0gYWxsIHBhdGgsIHF1ZXJ5IGFuZCBmcmFnbWVudFxuICAgIHZhciBleHRyYSA9IHBhdGg7XG4gICAgaWYocXVlcnkpXG4gICAgICBleHRyYSArPSBcIj9cIiArIHF1ZXJ5O1xuICAgIGlmKGZyYWdtZW50KVxuICAgICAgZXh0cmEgKz0gXCIjXCIgKyBmcmFnbWVudDtcblxuICAgIGlzSVB2NCA9IGlwdjRfcmVnZXgudGVzdChob3N0KTtcbiAgICBpc0lQdjYgPSBpcHY2X3JlZ2V4LnRlc3QoaG9zdCk7XG4gICAgdmFyIGlzTG9jYWxob3N0ID0gQ2xpcXpVdGlscy5pc0xvY2FsaG9zdChob3N0LCBpc0lQdjQsIGlzSVB2Nik7XG5cbiAgICAvLyBmaW5kIHBhcnRzIG9mIGhvc3RuYW1lXG4gICAgaWYgKCFpc0lQdjQgJiYgIWlzSVB2NiAmJiAhaXNMb2NhbGhvc3QpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHRsZCA9IENsaXF6VXRpbHMudGxkRXh0cmFjdG9yKGhvc3QpO1xuXG4gICAgICAgIC8vIEdldCB0aGUgZG9tYWluIG5hbWUgdy9vIHN1YmRvbWFpbnMgYW5kIHcvbyBUTERcbiAgICAgICAgbmFtZSA9IGhvc3Quc2xpY2UoMCwgLSh0bGQubGVuZ3RoKzEpKS5zcGxpdCgnLicpLnBvcCgpOyAvLyArMSBmb3IgdGhlICcuJ1xuXG4gICAgICAgIC8vIEdldCBzdWJkb21haW5zXG4gICAgICAgIHZhciBuYW1lX3RsZCA9IG5hbWUgKyBcIi5cIiArIHRsZDtcbiAgICAgICAgc3ViZG9tYWlucyA9IGhvc3Quc2xpY2UoMCwgLW5hbWVfdGxkLmxlbmd0aCkuc3BsaXQoXCIuXCIpLnNsaWNlKDAsIC0xKTtcblxuICAgICAgICAvL3JlbW92ZSB3d3cgaWYgZXhpc3RzXG4gICAgICAgIC8vIFRPRE86IEkgZG9uJ3QgdGhpbmsgdGhpcyBpcyB0aGUgcmlnaHQgcGxhY2UgdG8gZG8gdGhpcy5cbiAgICAgICAgLy8gICAgICAgRGlzYWJsZWQgZm9yIG5vdywgYnV0IGNoZWNrIHRoZXJlIGFyZSBubyBpc3N1ZXMuXG4gICAgICAgIC8vIGhvc3QgPSBob3N0LmluZGV4T2YoJ3d3dy4nKSA9PSAwID8gaG9zdC5zbGljZSg0KSA6IGhvc3Q7XG4gICAgICB9IGNhdGNoKGUpe1xuICAgICAgICBuYW1lID0gXCJcIjtcbiAgICAgICAgaG9zdCA9IFwiXCI7XG4gICAgICAgIC8vQ2xpcXpVdGlscy5sb2coJ1dBUk5JTkcgRmFpbGVkIGZvcjogJyArIG9yaWdpbmFsVXJsLCAnQ2xpcXpVdGlscy5nZXREZXRhaWxzRnJvbVVybCcpO1xuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIG5hbWUgPSBpc0xvY2FsaG9zdCA/IFwibG9jYWxob3N0XCIgOiBcIklQXCI7XG4gICAgfVxuXG4gICAgLy8gcmVtb3ZlIHd3dyBmcm9tIGJlZ2lubmluZywgd2UgbmVlZCBjbGVhbkhvc3QgaW4gdGhlIGZyaWVuZGx5IHVybFxuICAgIHZhciBjbGVhbkhvc3QgPSBob3N0O1xuICAgIGlmKGhvc3QudG9Mb3dlckNhc2UoKS5pbmRleE9mKCd3d3cuJykgPT0gMCkge1xuICAgICAgY2xlYW5Ib3N0ID0gaG9zdC5zbGljZSg0KTtcbiAgICB9XG5cbiAgICB2YXIgZnJpZW5kbHlfdXJsID0gY2xlYW5Ib3N0ICsgZXh0cmE7XG4gICAgaWYgKHNjaGVtZSAmJiBzY2hlbWUgIT0gJ2h0dHAnICYmIHNjaGVtZSAhPSAnaHR0cHMnKVxuICAgICAgZnJpZW5kbHlfdXJsID0gc2NoZW1lICsgXCI6XCIgKyBzbGFzaGVzICsgZnJpZW5kbHlfdXJsO1xuICAgIC8vcmVtb3ZlIHRyYWlsaW5nIHNsYXNoIGZyb20gdGhlIGVuZFxuICAgIGZyaWVuZGx5X3VybCA9IENsaXF6VXRpbHMuc3RyaXBUcmFpbGluZ1NsYXNoKGZyaWVuZGx5X3VybCk7XG5cbiAgICAvL0hhbmRsZSBjYXNlIHdoZXJlIHdlIGhhdmUgb25seSB0bGQgZm9yIGV4YW1wbGUgaHR0cDovL2NsaXF6bmFzXG4gICAgaWYoY2xlYW5Ib3N0ID09PSB0bGQpIHtcbiAgICAgIG5hbWUgPSB0bGQ7XG4gICAgfVxuXG4gICAgdmFyIHVybERldGFpbHMgPSB7XG4gICAgICAgICAgICAgIHNjaGVtZTogc2NoZW1lID8gc2NoZW1lICsgJzonIDogJycsXG4gICAgICAgICAgICAgIG5hbWU6IG5hbWUsXG4gICAgICAgICAgICAgIGRvbWFpbjogdGxkID8gbmFtZSArICcuJyArIHRsZCA6ICcnLFxuICAgICAgICAgICAgICB0bGQ6IHRsZCxcbiAgICAgICAgICAgICAgc3ViZG9tYWluczogc3ViZG9tYWlucyxcbiAgICAgICAgICAgICAgcGF0aDogcGF0aCxcbiAgICAgICAgICAgICAgcXVlcnk6IHF1ZXJ5LFxuICAgICAgICAgICAgICBmcmFnbWVudDogZnJhZ21lbnQsXG4gICAgICAgICAgICAgIGV4dHJhOiBleHRyYSxcbiAgICAgICAgICAgICAgaG9zdDogaG9zdCxcbiAgICAgICAgICAgICAgY2xlYW5Ib3N0OiBjbGVhbkhvc3QsXG4gICAgICAgICAgICAgIHNzbDogc3NsLFxuICAgICAgICAgICAgICBwb3J0OiBwb3J0LFxuICAgICAgICAgICAgICBmcmllbmRseV91cmw6IGZyaWVuZGx5X3VybFxuICAgICAgICB9O1xuXG4gICAgcmV0dXJuIHVybERldGFpbHM7XG4gIH0sXG4gIHN0cmlwVHJhaWxpbmdTbGFzaDogZnVuY3Rpb24oc3RyKSB7XG4gICAgaWYoc3RyLnN1YnN0cigtMSkgPT09ICcvJykge1xuICAgICAgICByZXR1cm4gc3RyLnN1YnN0cigwLCBzdHIubGVuZ3RoIC0gMSk7XG4gICAgfVxuICAgIHJldHVybiBzdHI7XG4gIH0sXG4gIGlzVXJsLFxuICAvLyBDaGVjaGtzIGlmIHRoZSBnaXZlbiBzdHJpbmcgaXMgYSB2YWxpZCBJUHY0IGFkZHJlc1xuICBpc0lQdjQ6IGZ1bmN0aW9uKGlucHV0KSB7XG4gICAgdmFyIGlwdjRfcGFydCA9IFwiMCooWzAtOV18WzEtOV1bMC05XXwxWzAtOV17Mn18MlswLTRdWzAtOV18MjVbMC01XSlcIjsgLy8gbnVtYmVycyAwIC0gMjU1XG4gICAgdmFyIGlwdjRfcmVnZXggPSBuZXcgUmVnRXhwKFwiXlwiICsgaXB2NF9wYXJ0ICsgXCJcXFxcLlwiKyBpcHY0X3BhcnQgKyBcIlxcXFwuXCIrIGlwdjRfcGFydCArIFwiXFxcXC5cIisgaXB2NF9wYXJ0XG4gICAgKyBcIihbOl0oWzAtOV0pKyk/JFwiKTsgLy8gcG9ydCBudW1iZXJcbiAgICByZXR1cm4gaXB2NF9yZWdleC50ZXN0KGlucHV0KTtcbiAgfSxcblxuICBpc0lQdjY6IGZ1bmN0aW9uKGlucHV0KSB7XG5cbiAgICAvLyBDdXJyZW50bHkgdXNpbmcgYSBzaW1wbGUgcmVnZXggZm9yIFwid2hhdCBsb29rcyBsaWtlIGFuIElQdjYgYWRkcmVzc1wiIGZvciByZWFkYWJpbGl0eVxuICAgIHZhciBpcHY2X3JlZ2V4ID0gbmV3IFJlZ0V4cChcIl5cXFxcWz8oKFswLTldfFthLWZdfFtBLUZdKSpbOi5dKyhbMC05XXxbYS1mXXxbQS1GXSkrWzouXSopK1tcXFxcXV0/KFs6XVswLTldKyk/JFwiKVxuICAgIHJldHVybiBpcHY2X3JlZ2V4LnRlc3QoaW5wdXQpO1xuXG4gICAgLyogQSBiZXR0ZXIgKG1vcmUgcHJlY2lzZSkgcmVnZXggdG8gdmFsaWRhdGUgSVBWNiBhZGRyZXNzZXMgZnJvbSBTdGFja092ZXJmbG93OlxuICAgIGxpbms6IGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNTM0OTcvcmVndWxhci1leHByZXNzaW9uLXRoYXQtbWF0Y2hlcy12YWxpZC1pcHY2LWFkZHJlc3Nlc1xuXG4gICAgdmFyIGlwdjZfcmVnZXggPSBuZXcgUmVnRXhwKFwiKChbMC05YS1mQS1GXXsxLDR9Oil7Nyw3fVswLTlhLWZBLUZdezEsNH18KFswLTlhLWZBLUZdezEsNH06KXsxLDd9OnwoWzAtOWEtZkEtRl17MSw0fTopXCJcbiAgICArIFwiezEsNn06WzAtOWEtZkEtRl17MSw0fXwoWzAtOWEtZkEtRl17MSw0fTopezEsNX0oOlswLTlhLWZBLUZdezEsNH0pezEsMn18KFswLTlhLWZBLUZdezEsNH06KXsxLDR9KDpbMC05YS1mQS1GXXsxLFwiXG4gICAgKyBcIjR9KXsxLDN9fChbMC05YS1mQS1GXXsxLDR9Oil7MSwzfSg6WzAtOWEtZkEtRl17MSw0fSl7MSw0fXwoWzAtOWEtZkEtRl17MSw0fTopezEsMn0oOlswLTlhLWZBLUZdezEsNH0pezEsNX18WzAtOWFcIlxuICAgICsgXCItZkEtRl17MSw0fTooKDpbMC05YS1mQS1GXXsxLDR9KXsxLDZ9KXw6KCg6WzAtOWEtZkEtRl17MSw0fSl7MSw3fXw6KXxmZTgwOig6WzAtOWEtZkEtRl17MCw0fSl7MCw0fSVbMC05YS16QS1aXXsxLH1cIlxuICAgICsgXCJ8OjooZmZmZig6MHsxLDR9KXswLDF9Oil7MCwxfSgoMjVbMC01XXwoMlswLTRdfDF7MCwxfVswLTldKXswLDF9WzAtOV0pXFxcXC4pezMsM30oMjVbMC01XXwoMlswLTRdfDF7MCwxfVswLTldKXswLDF9WzAtOV0pXCJcbiAgICArIFwifChbMC05YS1mQS1GXXsxLDR9Oil7MSw0fTooKDI1WzAtNV18KDJbMC00XXwxezAsMX1bMC05XSl7MCwxfVswLTldKVxcXFwuKXszLDN9KDI1WzAtNV18KDJbMC00XXwxezAsMX1bMC05XSl7MCwxfVswLTldKSlcIik7XG4gICAgKi9cbiAgfSxcblxuICBpc0xvY2FsaG9zdDogZnVuY3Rpb24oaG9zdCwgaXNJUHY0LCBpc0lQdjYpIHtcbiAgICBpZiAoaG9zdCA9PSBcImxvY2FsaG9zdFwiKSByZXR1cm4gdHJ1ZTtcbiAgICBpZiAoaXNJUHY0ICYmIGhvc3Quc3Vic3RyKDAsMykgPT0gXCIxMjdcIikgcmV0dXJuIHRydWU7XG4gICAgaWYgKGlzSVB2NiAmJiBob3N0ID09IFwiOjoxXCIpIHJldHVybiB0cnVlO1xuXG4gICAgcmV0dXJuIGZhbHNlO1xuXG4gIH0sXG4gIC8vIGNoZWNrcyBpZiBhIHZhbHVlIHJlcHJlc2VudHMgYW4gdXJsIHdoaWNoIGlzIGEgc2VhY2ggZW5naW5lXG4gIGlzU2VhcmNoOiBmdW5jdGlvbih2YWx1ZSl7XG4gICAgaWYgKENsaXF6VXRpbHMuaXNVcmwodmFsdWUpKSB7XG4gICAgICBjb25zdCB1cmwgPSB0aGlzLmNsZWFuTW96aWxsYUFjdGlvbnModmFsdWUpWzFdO1xuICAgICAgY29uc3Qge25hbWUsIHN1YmRvbWFpbnMsIHBhdGh9ID0gQ2xpcXpVdGlscy5nZXREZXRhaWxzRnJvbVVybCh1cmwpO1xuICAgICAgLy8gYWxsb3cgb25seSAnd3d3JyBhbmQgJ2RlJyAoZm9yIFlhaG9vKSBzdWJkb21haW5zIHRvIGV4Y2x1ZGUgJ21hcHMuZ29vZ2xlLmNvbScgZXRjLlxuICAgICAgLy8gYW5kIGVtcHR5IHBhdGggb25seSB0byBleGNsdWRlICd3d3cuZ29vZ2xlLmNvbS9tYXBzJyBldGMuXG4gICAgICBjb25zdCBmaXJzdFN1YmRvbWFpbiA9IHN1YmRvbWFpbnMubGVuZ3RoID8gc3ViZG9tYWluc1swXSA6ICcnO1xuICAgICAgcmV0dXJuICghcGF0aCB8fCAocGF0aC5sZW5ndGggPT09IDEgJiYgcGF0aFswXSA9PT0gJy8nKSkgJiYgKFxuICAgICAgICAoXG4gICAgICAgICAgbmFtZSA9PT0gJ2dvb2dsZScgfHxcbiAgICAgICAgICBuYW1lID09PSAnYmluZycgfHxcbiAgICAgICAgICBuYW1lID09PSAnZHVja2R1Y2tnbycgfHxcbiAgICAgICAgICBuYW1lID09PSAnc3RhcnRwYWdlJ1xuICAgICAgICApICYmICghZmlyc3RTdWJkb21haW4gfHwgZmlyc3RTdWJkb21haW4gPT09ICd3d3cnKSB8fFxuICAgICAgICAoXG4gICAgICAgICAgbmFtZSA9PT0gJ3lhaG9vJ1xuICAgICAgICApICYmICghZmlyc3RTdWJkb21haW4gfHwgZmlyc3RTdWJkb21haW4gPT09ICdkZScpKTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9LFxuICAvLyBjaGVja3MgaWYgYSBzdHJpbmcgaXMgYSBjb21wbGV0ZSB1cmxcbiAgaXNDb21wbGV0ZVVybDogZnVuY3Rpb24oaW5wdXQpe1xuICAgIHZhciBwYXR0ZXJuID0gLyhmdHB8aHR0cHxodHRwcyk6XFwvXFwvKFxcdys6ezAsMX1cXHcqQCk/KFxcUyspKDpbMC05XSspPyhcXC98XFwvKFtcXHcjITouPys9JiVAIVxcLVxcL10pKT8vO1xuICAgIGlmKCFwYXR0ZXJuLnRlc3QoaW5wdXQpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfSxcbiAgLy8gZXh0cmFjdCBxdWVyeSB0ZXJtIGZyb20gc2VhcmNoIGVuZ2luZSByZXN1bHQgcGFnZSBVUkxzXG4gIGV4dHJhY3RRdWVyeUZyb21Vcmw6IGZ1bmN0aW9uKHVybCkge1xuICAgIC8vIEdvb2dsZVxuICAgIGlmICh1cmwuc2VhcmNoKC9odHRwKHM/KTpcXC9cXC93d3dcXC5nb29nbGVcXC4uKlxcLy4qcT0uKi9pKSA9PT0gMCkge1xuICAgICAgdXJsID0gdXJsLnN1YnN0cmluZyh1cmwubGFzdEluZGV4T2YoJ3E9JykgKyAyKS5zcGxpdCgnJicpWzBdO1xuICAgIC8vIEJpbmdcbiAgICB9IGVsc2UgaWYgKHVybC5zZWFyY2goL2h0dHAocz8pOlxcL1xcL3d3d1xcLmJpbmdcXC4uKlxcLy4qcT0uKi9pKSA9PT0gMCkge1xuICAgICAgdXJsID0gdXJsLnN1YnN0cmluZyh1cmwuaW5kZXhPZigncT0nKSArIDIpLnNwbGl0KCcmJylbMF07XG4gICAgLy8gWWFob29cbiAgICB9IGVsc2UgaWYgKHVybC5zZWFyY2goL2h0dHAocz8pOlxcL1xcLy4qc2VhcmNoXFwueWFob29cXC5jb21cXC9zZWFyY2guKnA9LiovaSkgPT09IDApIHtcbiAgICAgIHVybCA9IHVybC5zdWJzdHJpbmcodXJsLmluZGV4T2YoJ3A9JykgKyAyKS5zcGxpdCgnJicpWzBdO1xuICAgIH0gZWxzZSB7XG4gICAgICB1cmwgPSBudWxsO1xuICAgIH1cbiAgICB2YXIgZGVjb2RlZCA9IHVybCA/IGRlY29kZVVSSUNvbXBvbmVudCh1cmwucmVwbGFjZSgvXFwrL2csJyAnKSkgOiBudWxsO1xuICAgIGlmIChkZWNvZGVkKSByZXR1cm4gZGVjb2RlZDtcbiAgICBlbHNlIHJldHVybiB1cmw7XG4gIH0sXG4gIC8vIFJlbW92ZSBjbHV0dGVyIChodHRwLCB3d3cpIGZyb20gdXJsc1xuICBnZW5lcmFsaXplVXJsOiBmdW5jdGlvbih1cmwsIHNraXBDb3JyZWN0aW9uKSB7XG4gICAgaWYgKCF1cmwpIHtcbiAgICAgIHJldHVybiAnJztcbiAgICB9XG4gICAgdmFyIHZhbCA9IHVybC50b0xvd2VyQ2FzZSgpO1xuICAgIHZhciBjbGVhblBhcnRzID0gQ2xpcXpVdGlscy5jbGVhblVybFByb3RvY29sKHZhbCwgZmFsc2UpLnNwbGl0KCcvJyksXG4gICAgICBob3N0ID0gY2xlYW5QYXJ0c1swXSxcbiAgICAgIHBhdGhMZW5ndGggPSAwLFxuICAgICAgU1lNQk9MUyA9IC8sfFxcLi9nO1xuICAgIGlmICghc2tpcENvcnJlY3Rpb24pIHtcbiAgICAgIGlmIChjbGVhblBhcnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgcGF0aExlbmd0aCA9ICgnLycgKyBjbGVhblBhcnRzLnNsaWNlKDEpLmpvaW4oJy8nKSkubGVuZ3RoO1xuICAgICAgfVxuICAgICAgaWYgKGhvc3QuaW5kZXhPZignd3d3JykgPT09IDAgJiYgaG9zdC5sZW5ndGggPiA0KSB7XG4gICAgICAgIC8vIG9ubHkgZml4IHN5bWJvbHMgaW4gaG9zdFxuICAgICAgICBpZiAoU1lNQk9MUy50ZXN0KGhvc3RbM10pICYmIGhvc3RbNF0gIT0gJyAnKVxuICAgICAgICAvLyByZXBsYWNlIG9ubHkgaXNzdWVzIGluIHRoZSBob3N0IG5hbWUsIG5vdCBldmVyIGluIHRoZSBwYXRoXG4gICAgICAgICAgdmFsID0gdmFsLnN1YnN0cigwLCB2YWwubGVuZ3RoIC0gcGF0aExlbmd0aCkucmVwbGFjZShTWU1CT0xTLCAnLicpICtcbiAgICAgICAgICAocGF0aExlbmd0aCA/IHZhbC5zdWJzdHIoLXBhdGhMZW5ndGgpIDogJycpO1xuICAgICAgfVxuICAgIH1cbiAgICB1cmwgPSBDbGlxelV0aWxzLmNsZWFuVXJsUHJvdG9jb2wodmFsLCB0cnVlKTtcbiAgICByZXR1cm4gdXJsW3VybC5sZW5ndGggLSAxXSA9PSAnLycgPyB1cmwuc2xpY2UoMCwtMSkgOiB1cmw7XG4gIH0sXG4gIC8vIFJlbW92ZSBjbHV0dGVyIGZyb20gdXJscyB0aGF0IHByZXZlbnRzIHBhdHRlcm4gZGV0ZWN0aW9uLCBlLmcuIGNoZWNrc3VtXG4gIHNpbXBsaWZ5VXJsOiBmdW5jdGlvbih1cmwpIHtcbiAgICB2YXIgcTtcbiAgICAvLyBHb29nbGUgcmVkaXJlY3QgdXJsc1xuICAgIGlmICh1cmwuc2VhcmNoKC9odHRwKHM/KTpcXC9cXC93d3dcXC5nb29nbGVcXC4uKlxcL3VybFxcPy4qdXJsPS4qL2kpID09PSAwKSB7XG4gICAgICAvLyBSZXR1cm4gdGFyZ2V0IFVSTCBpbnN0ZWFkXG4gICAgICB1cmwgPSB1cmwuc3Vic3RyaW5nKHVybC5sYXN0SW5kZXhPZigndXJsPScpKS5zcGxpdCgnJicpWzBdO1xuICAgICAgdXJsID0gdXJsLnN1YnN0cig0KTtcbiAgICAgIHJldHVybiBkZWNvZGVVUklDb21wb25lbnQodXJsKTtcblxuICAgICAgLy8gUmVtb3ZlIGNsdXR0ZXIgZnJvbSBHb29nbGUgc2VhcmNoZXNcbiAgICB9IGVsc2UgaWYgKHVybC5zZWFyY2goL2h0dHAocz8pOlxcL1xcL3d3d1xcLmdvb2dsZVxcLi4qXFwvLipxPS4qL2kpID09PSAwKSB7XG4gICAgICBxID0gdXJsLnN1YnN0cmluZyh1cmwubGFzdEluZGV4T2YoJ3E9JykpLnNwbGl0KCcmJylbMF07XG4gICAgICBpZiAocSAhPSAncT0nKSB7XG4gICAgICAgIC8vIHRibSBkZWZpbmVzIGNhdGVnb3J5IChpbWFnZXMvbmV3cy8uLi4pXG4gICAgICAgIHZhciBwYXJhbSA9IHVybC5pbmRleE9mKCcjJykgIT0gLTEgPyB1cmwuc3Vic3RyKHVybC5pbmRleE9mKCcjJykpIDogdXJsLnN1YnN0cih1cmwuaW5kZXhPZignPycpKTtcbiAgICAgICAgdmFyIHRibSA9IHBhcmFtLmluZGV4T2YoJ3RibT0nKSAhPSAtMSA/ICgnJicgKyBwYXJhbS5zdWJzdHJpbmcocGFyYW0ubGFzdEluZGV4T2YoJ3RibT0nKSkuc3BsaXQoJyYnKVswXSkgOiAnJztcbiAgICAgICAgdmFyIHBhZ2UgPSBwYXJhbS5pbmRleE9mKCdzdGFydD0nKSAhPSAtMSA/ICgnJicgKyBwYXJhbS5zdWJzdHJpbmcocGFyYW0ubGFzdEluZGV4T2YoJ3N0YXJ0PScpKS5zcGxpdCgnJicpWzBdKSA6ICcnO1xuICAgICAgICByZXR1cm4gJ2h0dHBzOi8vd3d3Lmdvb2dsZS5jb20vc2VhcmNoPycgKyBxICsgdGJtIC8qKyBwYWdlKi87XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdXJsO1xuICAgICAgfVxuICAgICAgLy8gQmluZ1xuICAgIH0gZWxzZSBpZiAodXJsLnNlYXJjaCgvaHR0cChzPyk6XFwvXFwvd3d3XFwuYmluZ1xcLi4qXFwvLipxPS4qL2kpID09PSAwKSB7XG4gICAgICBxID0gdXJsLnN1YnN0cmluZyh1cmwuaW5kZXhPZigncT0nKSkuc3BsaXQoJyYnKVswXTtcbiAgICAgIGlmIChxICE9ICdxPScpIHtcbiAgICAgICAgaWYgKHVybC5pbmRleE9mKCdzZWFyY2g/JykgIT0gLTEpXG4gICAgICAgICAgcmV0dXJuIHVybC5zdWJzdHIoMCwgdXJsLmluZGV4T2YoJ3NlYXJjaD8nKSkgKyAnc2VhcmNoPycgKyBxO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgcmV0dXJuIHVybC5zdWJzdHIoMCwgdXJsLmluZGV4T2YoJy8/JykpICsgJy8/JyArIHE7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdXJsO1xuICAgICAgfVxuICAgICAgLy8gWWFob28gcmVkaXJlY3RcbiAgICB9IGVsc2UgaWYgKHVybC5zZWFyY2goL2h0dHAocz8pOlxcL1xcL3Iuc2VhcmNoXFwueWFob29cXC5jb21cXC8uKi9pKSA9PT0gMCkge1xuICAgICAgdXJsID0gdXJsLnN1YnN0cmluZyh1cmwubGFzdEluZGV4T2YoJy9SVT0nKSkuc3BsaXQoJy9SSz0nKVswXTtcbiAgICAgIHVybCA9IHVybC5zdWJzdHIoNCk7XG4gICAgICByZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KHVybCk7XG4gICAgICAvLyBZYWhvb1xuICAgIH0gZWxzZSBpZiAodXJsLnNlYXJjaCgvaHR0cChzPyk6XFwvXFwvLipzZWFyY2hcXC55YWhvb1xcLmNvbVxcL3NlYXJjaC4qcD0uKi9pKSA9PT0gMCkge1xuICAgICAgdmFyIHAgPSB1cmwuc3Vic3RyaW5nKHVybC5pbmRleE9mKCdwPScpKS5zcGxpdCgnJicpWzBdO1xuICAgICAgaWYgKHAgIT0gJ3A9JyAmJiB1cmwuaW5kZXhPZignOycpICE9IC0xKSB7XG4gICAgICAgIHJldHVybiB1cmwuc3Vic3RyKDAsIHVybC5pbmRleE9mKCc7JykpICsgJz8nICsgcDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB1cmw7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB1cmw7XG4gICAgfVxuICB9LFxuXG4gIC8vIGVzdGFibGlzaGVzIHRoZSBjb25uZWN0aW9uXG4gIHBpbmdDbGlxelJlc3VsdHM6IGZ1bmN0aW9uKCl7XG4gICAgQ2xpcXpVdGlscy5odHRwSGFuZGxlcignSEVBRCcsIENsaXF6VXRpbHMuUkVTVUxUU19QUk9WSURFUl9QSU5HKTtcbiAgfSxcblxuICBnZXRSZXN1bHRzUHJvdmlkZXJRdWVyeVN0cmluZzogZnVuY3Rpb24ocSkge1xuICAgIGxldCBudW1iZXJSZXN1bHRzID0gNTtcbiAgICBpZiAoQ2xpcXpVdGlscy5nZXRQcmVmKCdsYW5ndWFnZURlZHVwJywgZmFsc2UpKSB7XG4gICAgICBudW1iZXJSZXN1bHRzID0gNztcbiAgICB9XG4gICAgaWYgKENsaXF6VXRpbHMuZ2V0UHJlZignbW9kdWxlcy5jb250ZXh0LXNlYXJjaC5lbmFibGVkJywgZmFsc2UpKSB7XG4gICAgICBudW1iZXJSZXN1bHRzID0gMTA7XG4gICAgfVxuICAgIHJldHVybiBlbmNvZGVVUklDb21wb25lbnQocSkgK1xuICAgICAgICAgICBDbGlxelV0aWxzLmVuY29kZVNlc3Npb25QYXJhbXMoKSArXG4gICAgICAgICAgIENsaXF6TGFuZ3VhZ2Uuc3RhdGVUb1F1ZXJ5U3RyaW5nKCkgK1xuICAgICAgICAgICBDbGlxelV0aWxzLmVuY29kZUxvY2FsZSgpICtcbiAgICAgICAgICAgQ2xpcXpVdGlscy5lbmNvZGVSZXN1bHRPcmRlcigpICtcbiAgICAgICAgICAgQ2xpcXpVdGlscy5lbmNvZGVDb3VudHJ5KCkgK1xuICAgICAgICAgICBDbGlxelV0aWxzLmVuY29kZUZpbHRlcigpICtcbiAgICAgICAgICAgQ2xpcXpVdGlscy5lbmNvZGVMb2NhdGlvbih0cnVlKSArIC8vIEBUT0RPOiByZW1vdmUgdHJ1ZVxuICAgICAgICAgICBDbGlxelV0aWxzLmVuY29kZVJlc3VsdENvdW50KG51bWJlclJlc3VsdHMpICtcbiAgICAgICAgICAgQ2xpcXpVdGlscy5lbm5jb2RlUXVlcnlTdWdnZXN0aW9uUGFyYW0oKSArXG4gICAgICAgICAgIENsaXF6VXRpbHMuZGlzYWJsZVdpa2lEZWR1cCgpO1xuICB9LFxuXG4gIGdldFJpY2hIZWFkZXJRdWVyeVN0cmluZzogZnVuY3Rpb24ocSwgbG9jLCBsb2NhbGUpIHtcbiAgICBsZXQgbnVtYmVyUmVzdWx0cyA9IDU7XG4gICAgaWYgKENsaXF6VXRpbHMuZ2V0UHJlZignbGFuZ3VhZ2VEZWR1cCcsIGZhbHNlKSkge1xuICAgICAgbnVtYmVyUmVzdWx0cyA9IDc7XG4gICAgfVxuICAgIGlmIChDbGlxelV0aWxzLmdldFByZWYoJ21vZHVsZXMuY29udGV4dC1zZWFyY2guZW5hYmxlZCcsIGZhbHNlKSkge1xuICAgICAgbnVtYmVyUmVzdWx0cyA9IDEwO1xuICAgIH1cbiAgICByZXR1cm4gXCImcT1cIiArIGVuY29kZVVSSUNvbXBvbmVudChxKSArIC8vIEBUT0RPOiBzaG91bGQgc3RhcnQgd2l0aCAmcT1cbiAgICAgICAgICAgIENsaXF6VXRpbHMuZW5jb2RlU2Vzc2lvblBhcmFtcygpICtcbiAgICAgICAgICAgIENsaXF6TGFuZ3VhZ2Uuc3RhdGVUb1F1ZXJ5U3RyaW5nKCkgK1xuICAgICAgICAgICAgQ2xpcXpVdGlscy5lbmNvZGVMb2NhbGUobG9jYWxlKSArXG4gICAgICAgICAgICBDbGlxelV0aWxzLmVuY29kZVJlc3VsdE9yZGVyKCkgK1xuICAgICAgICAgICAgQ2xpcXpVdGlscy5lbmNvZGVDb3VudHJ5KCkgK1xuICAgICAgICAgICAgQ2xpcXpVdGlscy5lbmNvZGVGaWx0ZXIoKSArXG4gICAgICAgICAgICBDbGlxelV0aWxzLmVuY29kZUxvY2F0aW9uKHRydWUsIGxvYyAmJiBsb2MubGF0aXR1ZGUsIGxvYyAmJiBsb2MubG9uZ2l0dWRlKSArXG4gICAgICAgICAgICBDbGlxelV0aWxzLmVuY29kZVJlc3VsdENvdW50KG51bWJlclJlc3VsdHMpICtcbiAgICAgICAgICAgIENsaXF6VXRpbHMuZGlzYWJsZVdpa2lEZWR1cCgpO1xuICB9LFxuXG4gIGdldEJhY2tlbmRSZXN1bHRzOiBmdW5jdGlvbihxKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgaWYgKCFDbGlxelV0aWxzLmdldFByZWYoJ2NsaXF6QmFja2VuZFByb3ZpZGVyLmVuYWJsZWQnLCB0cnVlKSkge1xuICAgICAgICByZXNvbHZlKHtcbiAgICAgICAgICByZXNwb25zZToge1xuICAgICAgICAgICAgcmVzdWx0czogW10sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBxdWVyeTogcVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBDbGlxelV0aWxzLl9zZXNzaW9uU2VxKys7XG5cbiAgICAgICAgLy8gaWYgdGhlIHVzZXIgc2VlcyB0aGUgcmVzdWx0cyBtb3JlIHRoYW4gNTAwbXMgd2UgY29uc2lkZXIgdGhhdCBoZSBzdGFydHMgYSBuZXcgcXVlcnlcbiAgICAgICAgaWYoQ2xpcXpVdGlscy5fcXVlcnlMYXN0RHJhdyAmJiAoRGF0ZS5ub3coKSA+IENsaXF6VXRpbHMuX3F1ZXJ5TGFzdERyYXcgKyA1MDApKXtcbiAgICAgICAgICBDbGlxelV0aWxzLl9xdWVyeUNvdW50Kys7XG4gICAgICAgIH1cbiAgICAgICAgQ2xpcXpVdGlscy5fcXVlcnlMYXN0RHJhdyA9IDA7IC8vIHJlc2V0IGxhc3QgRHJhdyAtIHdhaXQgZm9yIHRoZSBhY3R1YWwgZHJhd1xuICAgICAgICBDbGlxelV0aWxzLl9xdWVyeUxhc3RMZW5ndGggPSBxLmxlbmd0aDtcbiAgICAgICAgdmFyIHVybCA9IENsaXF6VXRpbHMuUkVTVUxUU19QUk9WSURFUiArIENsaXF6VXRpbHMuZ2V0UmVzdWx0c1Byb3ZpZGVyUXVlcnlTdHJpbmcocSk7XG4gICAgICAgIENsaXF6VXRpbHMuaHR0cEdldChcbiAgICAgICAgICB1cmwsXG4gICAgICAgICAgZnVuY3Rpb24gKHJlcykge1xuICAgICAgICAgICAgdmFyIHJlc3AgPSBKU09OLnBhcnNlKHJlcy5yZXNwb25zZSB8fCAne30nKVxuICAgICAgICAgICAgaWYgKHJlc3AucmVzdWx0ICE9PSB1bmRlZmluZWQgJiYgcmVzcC5yZXN1bHRzID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgcmVzcC5yZXN1bHRzID0gcmVzcC5yZXN1bHQ7XG4gICAgICAgICAgICAgIGRlbGV0ZSByZXNwLnJlc3VsdDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlc29sdmUoe1xuICAgICAgICAgICAgICByZXNwb25zZTogcmVzcCxcbiAgICAgICAgICAgICAgcXVlcnk6IHFcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgcmVqZWN0XG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG5cbiAgLy8gSVAgZHJpdmVuIGNvbmZpZ3VyYXRpb25cbiAgZmV0Y2hBbmRTdG9yZUNvbmZpZygpe1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgIENsaXF6VXRpbHMuaHR0cEdldChDbGlxelV0aWxzLkNPTkZJR19QUk9WSURFUixcbiAgICAgICAgZnVuY3Rpb24ocmVzKXtcbiAgICAgICAgICBpZihyZXMgJiYgcmVzLnJlc3BvbnNlKXtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIHZhciBjb25maWcgPSBKU09OLnBhcnNlKHJlcy5yZXNwb25zZSk7XG4gICAgICAgICAgICAgIGZvcih2YXIgayBpbiBjb25maWcpe1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgY29uZmlnW2tdID09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgICAgICBDbGlxelV0aWxzLnNldFByZWYoJ2NvbmZpZ18nICsgaywgSlNPTi5zdHJpbmdpZnkoY29uZmlnW2tdKSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIENsaXF6VXRpbHMuc2V0UHJlZignY29uZmlnXycgKyBrLCBjb25maWdba10pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIC8vIHdlIG9ubHkgc2V0IHRoZSBwcmVmZXJlZCBiYWNrZW5kIG9uY2UgYXQgZmlyc3Qgc3RhcnRcbiAgICAgICAgICAgICAgaWYgKENsaXF6VXRpbHMuZ2V0UHJlZignYmFja2VuZF9jb3VudHJ5JywgJycpID09PSAnJykge1xuICAgICAgICAgICAgICAgIC8vIHdhaXRpbmcgYSBiaXQgdG8gYmUgc3VyZSBmaXJzdCBpbml0aWFsaXphdGlvbiBpcyBjb21wbGV0ZVxuICAgICAgICAgICAgICAgIENsaXF6VXRpbHMuc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgQ2xpcXpVdGlscy5zZXREZWZhdWx0SW5kZXhDb3VudHJ5KENsaXF6VXRpbHMuZ2V0UHJlZignY29uZmlnX2xvY2F0aW9uJywgJ2RlJyksIHRydWUpO1xuICAgICAgICAgICAgICAgIH0sIDIwMDApO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGNhdGNoKGUpe1xuICAgICAgICAgICAgICBDbGlxelV0aWxzLmxvZyhlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICB9LFxuICAgICAgICByZXNvbHZlLCAvL29uIGVycm9yIHRoZSBjYWxsYmFjayBzdGlsbCBuZWVkcyB0byBiZSBjYWxsZWRcbiAgICAgICAgMTAwMDBcbiAgICAgICk7XG4gICAgfSk7XG4gIH0sXG4gIHNldERlZmF1bHRJbmRleENvdW50cnk6IGZ1bmN0aW9uKGNvdW50cnksIHJlc3RhcnQpIHtcbiAgICBDbGlxelV0aWxzLnNldFByZWYoJ2JhY2tlbmRfY291bnRyeScsIGNvdW50cnkpO1xuICAgIENsaXF6VXRpbHMuX2NvdW50cnkgPSBjb3VudHJ5O1xuXG4gICAgaWYoY291bnRyeSAhPT0gJ2RlJyl7XG4gICAgICAvLyBzaW1wbGUgVUkgZm9yIG91dHNpZGUgZ2VybWFueVxuICAgICAgQ2xpcXpVdGlscy5zZXRQcmVmKCdkcm9wRG93blN0eWxlJywgJ3NpbXBsZScpO1xuICAgIH0gZWxzZSB7XG4gICAgICBDbGlxelV0aWxzLmNsZWFyUHJlZignZHJvcERvd25TdHlsZScpO1xuICAgIH1cblxuICAgIGlmKHJlc3RhcnQpe1xuICAgICAgQ2xpcXpVdGlscy5zZXRQcmVmKCdtb2R1bGVzLnVpLmVuYWJsZWQnLCBmYWxzZSk7XG5cbiAgICAgIC8vIHdlIG5lZWQgdG8gYXZvaWQgdGhlIHRocm90dGxlIG9uIHByZWZzXG4gICAgICBDbGlxelV0aWxzLnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIENsaXF6VXRpbHMuc2V0UHJlZignbW9kdWxlcy51aS5lbmFibGVkJywgdHJ1ZSk7XG4gICAgICB9LCAwKTtcbiAgICB9XG4gIH0sXG4gIGVuY29kZUxvY2FsZTogZnVuY3Rpb24obG9jYWxlKSB7XG4gICAgdmFyIHByZWZlcnJlZCA9IChDbGlxelV0aWxzLlBSRUZFUlJFRF9MQU5HVUFHRSB8fCBcIlwiKTtcbiAgICBpZihsb2NhbGUpIHtcbiAgICAgIHByZWZlcnJlZCA9IGxvY2FsZTtcbiAgICB9XG4gICAgLy8gc2VuZCBicm93c2VyIGxhbmd1YWdlIHRvIHRoZSBiYWNrLWVuZFxuICAgIC8vcmV0dXJuICcmbG9jYWxlPScgKyAobG9jYWxlID8gbG9jYWxlIDogKENsaXF6VXRpbHMuUFJFRkVSUkVEX0xBTkdVQUdFIHx8IFwiXCIpKTtcbiAgICByZXR1cm4gJyZsb2NhbGU9JysgcHJlZmVycmVkO1xuICB9LFxuICBlbmNvZGVDb3VudHJ5OiBmdW5jdGlvbigpIHtcbiAgICAvL2ludGVybmF0aW9uYWwgcmVzdWx0cyBub3Qgc3VwcG9ydGVkXG4gICAgcmV0dXJuICcmY291bnRyeT0nICsgQ2xpcXpVdGlscy5fY291bnRyeTtcbiAgfSxcbiAgZGlzYWJsZVdpa2lEZWR1cDogZnVuY3Rpb24oKSB7XG4gICAgLy8gZGlzYWJsZSB3aWtpcGVkaWEgZGVkdXBsaWNhdGlvbiBvbiB0aGUgYmFja2VuZCBzaWRlXG4gICAgdmFyIGRvRGVkdXAgPSBDbGlxelV0aWxzLmdldFByZWYoXCJsYW5ndWFnZURlZHVwXCIsIGZhbHNlKTtcbiAgICBpZiAoZG9EZWR1cCkgcmV0dXJuICcmZGRsPTAnO1xuICAgIGVsc2UgcmV0dXJuIFwiXCJcbiAgfSxcbiAgZ2V0QWR1bHRDb250ZW50RmlsdGVyU3RhdGU6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBkYXRhID0ge1xuICAgICAgJ2NvbnNlcnZhdGl2ZSc6IDMsXG4gICAgICAnbW9kZXJhdGUnOiAwLFxuICAgICAgJ2xpYmVyYWwnOiAxXG4gICAgfSxcbiAgICBwcmVmID0gQ2xpcXpVdGlscy5nZXRQcmVmKCdhZHVsdENvbnRlbnRGaWx0ZXInLCAnbW9kZXJhdGUnKTtcbiAgICByZXR1cm4gZGF0YVtwcmVmXTtcbiAgfSxcbiAgZW5jb2RlRmlsdGVyOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gJyZhZHVsdD0nICsgQ2xpcXpVdGlscy5nZXRBZHVsdENvbnRlbnRGaWx0ZXJTdGF0ZSgpO1xuICB9LFxuICBlbmNvZGVSZXN1bHRDb3VudDogZnVuY3Rpb24oY291bnQpIHtcbiAgICBjb3VudCA9IGNvdW50IHx8IDU7XG4gICAgcmV0dXJuICcmY291bnQ9JyArIGNvdW50O1xuICB9LFxuICBlbm5jb2RlUXVlcnlTdWdnZXN0aW9uUGFyYW06IGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCBzdWdnZXN0aW9uc0VuYWJsZWQgPSBDbGlxelV0aWxzLmdldFByZWYoXCJzdWdnZXN0aW9uc0VuYWJsZWRcIiwgZmFsc2UpO1xuICAgIHJldHVybiBgJnN1Z2dlc3Q9JHtzdWdnZXN0aW9uc0VuYWJsZWQgPyAxIDogMH1gO1xuICB9LFxuICBlbmNvZGVSZXN1bHRUeXBlOiBmdW5jdGlvbih0eXBlKXtcbiAgICBpZih0eXBlLmluZGV4T2YoJ2FjdGlvbicpICE9PSAtMSkgcmV0dXJuIFsnVCddO1xuICAgIGVsc2UgaWYodHlwZS5pbmRleE9mKCdjbGlxei1yZXN1bHRzJykgPT0gMCkgcmV0dXJuIENsaXF6VXRpbHMuZW5jb2RlQ2xpcXpSZXN1bHRUeXBlKHR5cGUpO1xuICAgIGVsc2UgaWYodHlwZS5pbmRleE9mKCdjbGlxei1wYXR0ZXJuJykgPT0gMCkgcmV0dXJuIFsnQyddO1xuICAgIGVsc2UgaWYodHlwZSA9PT0gJ2NsaXF6LWV4dHJhJykgcmV0dXJuIFsnWCddO1xuICAgIGVsc2UgaWYodHlwZSA9PT0gJ2NsaXF6LXNlcmllcycpIHJldHVybiBbJ1MnXTtcblxuICAgIGVsc2UgaWYodHlwZS5pbmRleE9mKCdib29rbWFyaycpID09IDAgfHxcbiAgICAgICAgICAgIHR5cGUuaW5kZXhPZigndGFnJykgPT0gMCkgcmV0dXJuIFsnQiddLmNvbmNhdChDbGlxelV0aWxzLmVuY29kZUNsaXF6UmVzdWx0VHlwZSh0eXBlKSk7XG5cbiAgICBlbHNlIGlmKHR5cGUuaW5kZXhPZignZmF2aWNvbicpID09IDAgfHxcbiAgICAgICAgICAgIHR5cGUuaW5kZXhPZignaGlzdG9yeScpID09IDApIHJldHVybiBbJ0gnXS5jb25jYXQoQ2xpcXpVdGlscy5lbmNvZGVDbGlxelJlc3VsdFR5cGUodHlwZSkpO1xuXG4gICAgLy8gY2xpcXogdHlwZSA9IFwiY2xpcXotY3VzdG9tIHNvdXJjZXMtWFwiXG4gICAgZWxzZSBpZih0eXBlLmluZGV4T2YoJ2NsaXF6LWN1c3RvbScpID09IDApIHJldHVybiB0eXBlLnN1YnN0cigyMSk7XG5cbiAgICByZXR1cm4gdHlwZTsgLy9zaG91bGQgbmV2ZXIgaGFwcGVuXG4gIH0sXG4gIC8vZWcgdHlwZXM6IFsgXCJIXCIsIFwibVwiIF0sIFsgXCJIfGluc3RhbnRcIiwgXCJYfDExXCIgXVxuICBpc1ByaXZhdGVSZXN1bHRUeXBlOiBmdW5jdGlvbih0eXBlKSB7XG4gICAgdmFyIG9ubHlUeXBlID0gdHlwZVswXS5zcGxpdCgnfCcpWzBdO1xuICAgIHJldHVybiAnSEJUQ1MnLmluZGV4T2Yob25seVR5cGUpICE9IC0xICYmIHR5cGUubGVuZ3RoID09IDE7XG4gIH0sXG4gIC8vIGNsaXF6IHR5cGUgPSBcImNsaXF6LXJlc3VsdHMgc291cmNlcy1YWFhYWFwiIG9yIFwiZmF2aWNvbiBzb3VyY2VzLVhYWFhYXCIgaWYgY29tYmluZWQgd2l0aCBoaXN0b3J5XG4gIGVuY29kZUNsaXF6UmVzdWx0VHlwZTogZnVuY3Rpb24odHlwZSl7XG4gICAgdmFyIHBvcyA9IHR5cGUuaW5kZXhPZignc291cmNlcy0nKVxuICAgIGlmKHBvcyAhPSAtMSlcbiAgICAgIHJldHVybiBDbGlxelV0aWxzLmVuY29kZVNvdXJjZXModHlwZS5zdWJzdHIocG9zKzgpKTtcbiAgICBlbHNlXG4gICAgICByZXR1cm4gW107XG4gIH0sXG4gIC8vIHJhbmRvbSBJRCBnZW5lcmF0ZWQgYXQgZWFjaCB1cmxiYXIgZm9jdXNcbiAgX3NlYXJjaFNlc3Npb246ICcnLFxuICAvLyBudW1iZXIgb2Ygc2VxdWVuY2VzIGluIGVhY2ggc2Vzc2lvblxuICBfc2Vzc2lvblNlcTogMCxcbiAgX3F1ZXJ5TGFzdExlbmd0aDogbnVsbCxcbiAgX3F1ZXJ5TGFzdERyYXc6IG51bGwsXG4gIC8vIG51bWJlciBvZiBxdWVyaWVzIGluIHNlYXJjaCBzZXNzaW9uXG4gIF9xdWVyeUNvdW50OiBudWxsLFxuICBzZXRTZWFyY2hTZXNzaW9uOiBmdW5jdGlvbihyYW5kKXtcbiAgICBDbGlxelV0aWxzLl9jb3VudHJ5ID0gQ2xpcXpVdGlscy5nZXRQcmVmKCdiYWNrZW5kX2NvdW50cnknKTtcbiAgICBDbGlxelV0aWxzLl9zZWFyY2hTZXNzaW9uID0gcmFuZDtcbiAgICBDbGlxelV0aWxzLl9zZXNzaW9uU2VxID0gMDtcbiAgICBDbGlxelV0aWxzLl9xdWVyeUNvdW50ID0gMDtcbiAgICBDbGlxelV0aWxzLl9xdWVyeUxhc3RMZW5ndGggPSAwO1xuICAgIENsaXF6VXRpbHMuX3F1ZXJ5TGFzdERyYXcgPSAwO1xuICB9LFxuICBlbmNvZGVTZXNzaW9uUGFyYW1zOiBmdW5jdGlvbigpe1xuICAgIGlmKENsaXF6VXRpbHMuX3NlYXJjaFNlc3Npb24ubGVuZ3RoKXtcbiAgICAgIHJldHVybiAnJnM9JyArIGVuY29kZVVSSUNvbXBvbmVudChDbGlxelV0aWxzLl9zZWFyY2hTZXNzaW9uKSArXG4gICAgICAgICAgICAgJyZuPScgKyBDbGlxelV0aWxzLl9zZXNzaW9uU2VxICtcbiAgICAgICAgICAgICAnJnFjPScgKyBDbGlxelV0aWxzLl9xdWVyeUNvdW50XG4gICAgfSBlbHNlIHJldHVybiAnJztcbiAgfSxcblxuICBlbmNvZGVMb2NhdGlvbjogZnVuY3Rpb24oc3BlY2lmeVNvdXJjZSwgbGF0LCBsbmcpIHtcbiAgICB2YXIgcXMgPSBbXG4gICAgICcmbG9jX3ByZWY9JyxcbiAgICAgQ2xpcXpVdGlscy5nZXRQcmVmKCdzaGFyZV9sb2NhdGlvbicsJ2FzaycpXG4gICAgXS5qb2luKCcnKVxuXG4gICAgaWYgKENsaXF6VXRpbHMuVVNFUl9MQVQgJiYgQ2xpcXpVdGlscy5VU0VSX0xORyB8fCBsYXQgJiYgbG5nKSB7XG4gICAgICBxcyArPSBbXG4gICAgICAgICcmbG9jPScsXG4gICAgICAgIGxhdCB8fCBDbGlxelV0aWxzLlVTRVJfTEFULFxuICAgICAgICAnLCcsXG4gICAgICAgIGxuZyB8fCBDbGlxelV0aWxzLlVTRVJfTE5HLFxuICAgICAgICAoc3BlY2lmeVNvdXJjZSA/ICcsVScgOiAnJylcbiAgICAgIF0uam9pbignJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHFzO1xuICB9LFxuICBlbmNvZGVTb3VyY2VzOiBmdW5jdGlvbihzb3VyY2VzKXtcbiAgICByZXR1cm4gc291cmNlcy50b0xvd2VyQ2FzZSgpLnNwbGl0KCcsICcpLm1hcChcbiAgICAgIGZ1bmN0aW9uKHMpe1xuICAgICAgICBpZihzLmluZGV4T2YoJ2NhY2hlJykgPT0gMCkgLy8gdG8gY2F0Y2ggJ2NhY2hlLSonIGZvciBzcGVjaWZpYyBjb3VudHJpZXNcbiAgICAgICAgICByZXR1cm4gJ2QnXG4gICAgICAgIGVsc2VcbiAgICAgICAgICByZXR1cm4gVkVSVElDQUxfRU5DT0RJTkdTW3NdIHx8IHM7XG4gICAgICB9KTtcbiAgfSxcbiAgaXNQcml2YXRlOiBDTElRWkVudmlyb25tZW50LmlzUHJpdmF0ZSxcbiAgdGVsZW1ldHJ5OiBmdW5jdGlvbiAoKSB7XG4gICAgY29uc3QgYXJncyA9IGFyZ3VtZW50cztcbiAgICBDbGlxelV0aWxzLnRlbGVtZXRyeUhhbmRsZXJzLmZvckVhY2goaGFuZGxlciA9PiBoYW5kbGVyLmFwcGx5KG51bGwsIGFyZ3MpKTtcbiAgfSxcbiAgcmVzdWx0VGVsZW1ldHJ5OiBmdW5jdGlvbihxdWVyeSwgcXVlcnlBdXRvY29tcGxldGVkLCByZXN1bHRJbmRleCwgcmVzdWx0VXJsLCByZXN1bHRPcmRlciwgZXh0cmEpIHtcbiAgICBDbGlxelV0aWxzLnNldFJlc3VsdE9yZGVyKHJlc3VsdE9yZGVyKTtcbiAgICBDbGlxekV2ZW50cy5wdWIoXCJodW1hbi13ZWI6c2FuaXRpemUtcmVzdWx0LXRlbGVtZXRyeVwiLFxuICAgICAgeyB0eXBlOiAnZXh0ZW5zaW9uLXJlc3VsdC10ZWxlbWV0cnknLFxuICAgICAgICBxOiBxdWVyeSxcbiAgICAgICAgczogQ2xpcXpVdGlscy5lbmNvZGVTZXNzaW9uUGFyYW1zKCksXG4gICAgICAgIG1zZzoge1xuICAgICAgICAgIGk6IHJlc3VsdEluZGV4LFxuICAgICAgICAgIG86IENsaXF6VXRpbHMuZW5jb2RlUmVzdWx0T3JkZXIoKSxcbiAgICAgICAgICB1OiAocmVzdWx0VXJsID8gcmVzdWx0VXJsIDogJycpLFxuICAgICAgICAgIGE6IHF1ZXJ5QXV0b2NvbXBsZXRlZCxcbiAgICAgICAgICBlOiBleHRyYVxuICAgICAgICB9LFxuICAgICAgICBlbmRwb2ludDogQ2xpcXpVdGlscy5SRVNVTFRTX1BST1ZJREVSX0xPRyxcbiAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxuICAgICAgfVxuICAgICk7XG4gICAgQ2xpcXpVdGlscy5zZXRSZXN1bHRPcmRlcignJyk7XG4gIH0sXG4gIF9yZXN1bHRPcmRlcjogJycsXG4gIHNldFJlc3VsdE9yZGVyOiBmdW5jdGlvbihyZXN1bHRPcmRlcikge1xuICAgIENsaXF6VXRpbHMuX3Jlc3VsdE9yZGVyID0gcmVzdWx0T3JkZXI7XG4gIH0sXG4gIGVuY29kZVJlc3VsdE9yZGVyOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gQ2xpcXpVdGlscy5fcmVzdWx0T3JkZXIgJiYgQ2xpcXpVdGlscy5fcmVzdWx0T3JkZXIubGVuZ3RoID8gJyZvPScgKyBlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoQ2xpcXpVdGlscy5fcmVzdWx0T3JkZXIpKSA6ICcnO1xuICB9LFxuICBzZXRJbnRlcnZhbDogQ0xJUVpFbnZpcm9ubWVudC5zZXRJbnRlcnZhbCxcbiAgc2V0VGltZW91dDogQ0xJUVpFbnZpcm9ubWVudC5zZXRUaW1lb3V0LFxuICBjbGVhclRpbWVvdXQ6IENMSVFaRW52aXJvbm1lbnQuY2xlYXJUaW1lb3V0LFxuICBjbGVhckludGVydmFsOiBDTElRWkVudmlyb25tZW50LmNsZWFyVGltZW91dCxcbiAgUHJvbWlzZTogQ0xJUVpFbnZpcm9ubWVudC5Qcm9taXNlLFxuICBsb2NhbGU6IHt9LFxuICBjdXJyTG9jYWxlOiBudWxsLFxuICBnZXRMb2NhbGVGaWxlOiBmdW5jdGlvbiAobG9jYWxlKSB7XG4gICAgLy8gbG9jYWxlIGZpbGUgbWlnaHQgbm90IGV4aXN0IG9uIG1vYmlsZVxuICAgIGlmIChDbGlxelV0aWxzLkxPQ0FMRV9QQVRIKSB7XG4gICAgICBjb25zdCB1cmwgPSBDbGlxelV0aWxzLkxPQ0FMRV9QQVRIICsgbG9jYWxlICsgJy9jbGlxei5qc29uJztcbiAgICAgIC8vIFN5bmNocm9ub3VzIHJlcXVlc3QgaXMgZGVwcmljYXRlZFxuICAgICAgY29uc3QgcmVxID0gQ2xpcXpVdGlscy5odHRwR2V0KHVybCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgdHJ1ZSk7XG4gICAgICBDbGlxelV0aWxzLmN1cnJMb2NhbGUgPSBsb2NhbGU7XG4gICAgICBDbGlxelV0aWxzLmxvY2FsZS5kZWZhdWx0ID0gQ2xpcXpVdGlscy5sb2NhbGVbbG9jYWxlXSA9IEpTT04ucGFyc2UocmVxLnJlc3BvbnNlKTtcbiAgICB9XG4gIH0sXG4gIGdldExvY2FsaXplZFN0cmluZzogZnVuY3Rpb24oa2V5LCBzdWJzdGl0dXRpb25zKXtcbiAgICBpZigha2V5KSByZXR1cm4gJyc7XG5cbiAgICB2YXIgc3RyID0ga2V5LFxuICAgICAgICBsb2NhbE1lc3NhZ2VzO1xuXG4gICAgaWYgKENsaXF6VXRpbHMuY3VyckxvY2FsZSAhPSBudWxsICYmIENsaXF6VXRpbHMubG9jYWxlW0NsaXF6VXRpbHMuY3VyckxvY2FsZV1cbiAgICAgICAgICAgICYmIENsaXF6VXRpbHMubG9jYWxlW0NsaXF6VXRpbHMuY3VyckxvY2FsZV1ba2V5XSkge1xuICAgICAgICBzdHIgPSBDbGlxelV0aWxzLmxvY2FsZVtDbGlxelV0aWxzLmN1cnJMb2NhbGVdW2tleV0ubWVzc2FnZTtcbiAgICAgICAgbG9jYWxNZXNzYWdlcyA9IENsaXF6VXRpbHMubG9jYWxlW0NsaXF6VXRpbHMuY3VyckxvY2FsZV07XG4gICAgfSBlbHNlIGlmIChDbGlxelV0aWxzLmxvY2FsZS5kZWZhdWx0ICYmIENsaXF6VXRpbHMubG9jYWxlLmRlZmF1bHRba2V5XSkge1xuICAgICAgICBzdHIgPSBDbGlxelV0aWxzLmxvY2FsZS5kZWZhdWx0W2tleV0ubWVzc2FnZTtcbiAgICAgICAgbG9jYWxNZXNzYWdlcyA9IENsaXF6VXRpbHMubG9jYWxlLmRlZmF1bHQ7XG4gICAgfVxuXG4gICAgaWYgKCFzdWJzdGl0dXRpb25zKSB7XG4gICAgICBzdWJzdGl0dXRpb25zID0gW107XG4gICAgfVxuICAgIGlmICghQXJyYXkuaXNBcnJheShzdWJzdGl0dXRpb25zKSkge1xuICAgICAgc3Vic3RpdHV0aW9ucyA9IFtzdWJzdGl0dXRpb25zXTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZXBsYWNlcihtYXRjaGVkLCBpbmRleCwgZG9sbGFyU2lnbnMpIHtcbiAgICAgIGlmIChpbmRleCkge1xuICAgICAgICBpbmRleCA9IHBhcnNlSW50KGluZGV4LCAxMCkgLSAxO1xuICAgICAgICByZXR1cm4gaW5kZXggaW4gc3Vic3RpdHV0aW9ucyA/IHN1YnN0aXR1dGlvbnNbaW5kZXhdIDogXCJcIjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIEZvciBhbnkgc2VyaWVzIG9mIGNvbnRpZ3VvdXMgYCRgcywgdGhlIGZpcnN0IGlzIGRyb3BwZWQsIGFuZFxuICAgICAgICAvLyB0aGUgcmVzdCByZW1haW4gaW4gdGhlIG91dHB1dCBzdHJpbmcuXG4gICAgICAgIHJldHVybiBkb2xsYXJTaWducztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHN0ci5yZXBsYWNlKC9cXCQoPzooWzEtOV1cXGQqKXwoXFwkKykpL2csIHJlcGxhY2VyKTtcbiAgfSxcbiAgLy8gZ2V0cyBhbGwgdGhlIGVsZW1lbnRzIHdpdGggdGhlIGNsYXNzICdjbGlxei1sb2NhbGUnIGFuZCBhZGRzXG4gIC8vIHRoZSBsb2NhbGl6ZWQgc3RyaW5nIC0ga2V5IGF0dHJpYnV0ZSAtIGFzIGNvbnRlbnRcbiAgbG9jYWxpemVEb2M6IGZ1bmN0aW9uKGRvYyl7XG4gICAgdmFyIGxvY2FsZSA9IGRvYy5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdjbGlxei1sb2NhbGUnKTtcbiAgICBmb3IodmFyIGkgPSAwOyBpIDwgbG9jYWxlLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgdmFyIGVsID0gbG9jYWxlW2ldO1xuICAgICAgICBlbC50ZXh0Q29udGVudCA9IENsaXF6VXRpbHMuZ2V0TG9jYWxpemVkU3RyaW5nKGVsLmdldEF0dHJpYnV0ZSgna2V5JykpO1xuICAgIH1cbiAgfSxcbiAgaXNXaW5kb3dzOiBmdW5jdGlvbigpe1xuICAgIHJldHVybiBDTElRWkVudmlyb25tZW50Lk9TLmluZGV4T2YoXCJ3aW5cIikgPT09IDA7XG4gIH0sXG4gIGlzTWFjOiBmdW5jdGlvbigpe1xuICAgIHJldHVybiBDTElRWkVudmlyb25tZW50Lk9TLmluZGV4T2YoXCJkYXJ3aW5cIikgPT09IDA7XG4gIH0sXG4gIGlzTGludXg6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBDTElRWkVudmlyb25tZW50Lk9TLmluZGV4T2YoXCJsaW51eFwiKSA9PT0gMDtcbiAgfSxcbiAgZ2V0V2luZG93OiBDTElRWkVudmlyb25tZW50LmdldFdpbmRvdyxcbiAgZ2V0V2luZG93SUQ6IENMSVFaRW52aXJvbm1lbnQuZ2V0V2luZG93SUQsXG4gIC8qKlxuICAgKiBCaW5kIGZ1bmN0aW9ucyBjb250ZXh0cyB0byBhIHNwZWNpZmllZCBvYmplY3QuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBmcm9tIC0gQW4gb2JqZWN0LCB3aG9zZSBmdW5jdGlvbiBwcm9wZXJ0aWVzIHdpbGwgYmUgcHJvY2Vzc2VkLlxuICAgKiBAcGFyYW0ge09iamVjdH0gdG8gLSBBbiBvYmplY3QsIHdoaWNoIHdpbGwgYmUgdGhlIGNvbnRleHQgKHRoaXMpIG9mIHByb2Nlc3NlZCBmdW5jdGlvbnMuXG4gICAqL1xuICBiaW5kT2JqZWN0RnVuY3Rpb25zOiBmdW5jdGlvbihmcm9tLCB0bykge1xuICAgIGZvciAodmFyIGZ1bmNOYW1lIGluIGZyb20pIHtcbiAgICAgIHZhciBmdW5jID0gZnJvbVtmdW5jTmFtZV07XG4gICAgICBpZiAoIWZyb20uaGFzT3duUHJvcGVydHkoZnVuY05hbWUpKVxuICAgICAgICBjb250aW51ZTtcbiAgICAgIC8vIENhbid0IGNvbXBhcmUgd2l0aCBwcm90b3R5cGUgb2Ygb2JqZWN0IGZyb20gYSBkaWZmZXJlbnQgbW9kdWxlLlxuICAgICAgaWYgKHR5cGVvZiBmdW5jICE9IFwiZnVuY3Rpb25cIilcbiAgICAgICAgY29udGludWU7XG4gICAgICBmcm9tW2Z1bmNOYW1lXSA9IGZ1bmMuYmluZCh0byk7XG4gICAgfVxuICB9LFxuICB0cnlEZWNvZGVVUklDb21wb25lbnQ6IGZ1bmN0aW9uKHMpIHtcbiAgICAvLyBhdm9pZGUgZXJyb3IgZnJvbSBkZWNvZGVVUklDb21wb25lbnQoJyUyJylcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIGRlY29kZVVSSUNvbXBvbmVudChzKTtcbiAgICB9IGNhdGNoKGUpIHtcbiAgICAgIHJldHVybiBzO1xuICAgIH1cbiAgfSxcbiAgdHJ5RW5jb2RlVVJJQ29tcG9uZW50OiBmdW5jdGlvbihzKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBlbmNvZGVVUklDb21wb25lbnQocyk7XG4gICAgfSBjYXRjaChlKSB7XG4gICAgICByZXR1cm4gcztcbiAgICB9XG4gIH0sXG4gIHBhcnNlUXVlcnlTdHJpbmc6IGZ1bmN0aW9uKHFzdHIpIHtcbiAgICB2YXIgcXVlcnkgPSB7fTtcbiAgICB2YXIgYSA9IChxc3RyIHx8ICcnKS5zcGxpdCgnJicpO1xuICAgIGZvciAodmFyIGkgaW4gYSlcbiAgICB7XG4gICAgICB2YXIgYiA9IGFbaV0uc3BsaXQoJz0nKTtcbiAgICAgIHF1ZXJ5W0NsaXF6VXRpbHMudHJ5RGVjb2RlVVJJQ29tcG9uZW50KGJbMF0pXSA9IENsaXF6VXRpbHMudHJ5RGVjb2RlVVJJQ29tcG9uZW50KGJbMV0pO1xuICAgIH1cblxuICAgIHJldHVybiBxdWVyeTtcbiAgfSxcbiAgcm91bmRUb0RlY2ltYWw6IGZ1bmN0aW9uKG51bWJlciwgZGlnaXRzKSB7XG4gICAgdmFyIG11bHRpcGxpZXIgPSBNYXRoLnBvdygxMCwgZGlnaXRzKTtcbiAgICByZXR1cm4gTWF0aC5yb3VuZChudW1iZXIgKiBtdWx0aXBsaWVyKSAvIG11bHRpcGxpZXI7XG4gIH0sXG4gIGdldEFkdWx0RmlsdGVyU3RhdGU6IGZ1bmN0aW9uKCl7XG4gICAgdmFyIGRhdGEgPSB7XG4gICAgICAnY29uc2VydmF0aXZlJzoge1xuICAgICAgICAgICAgICBuYW1lOiBDbGlxelV0aWxzLmdldExvY2FsaXplZFN0cmluZygnYWx3YXlzJyksXG4gICAgICAgICAgICAgIHNlbGVjdGVkOiBmYWxzZVxuICAgICAgfSxcbiAgICAgICdtb2RlcmF0ZSc6IHtcbiAgICAgICAgICAgICAgbmFtZTogQ2xpcXpVdGlscy5nZXRMb2NhbGl6ZWRTdHJpbmcoJ2Fsd2F5c19hc2snKSxcbiAgICAgICAgICAgICAgc2VsZWN0ZWQ6IGZhbHNlXG4gICAgICB9LFxuICAgICAgJ2xpYmVyYWwnOiB7XG4gICAgICAgICAgbmFtZTogQ2xpcXpVdGlscy5nZXRMb2NhbGl6ZWRTdHJpbmcoJ25ldmVyJyksXG4gICAgICAgICAgc2VsZWN0ZWQ6IGZhbHNlXG4gICAgICB9XG4gICAgfTtcblxuICAgIGRhdGFbQ2xpcXpVdGlscy5nZXRQcmVmKCdhZHVsdENvbnRlbnRGaWx0ZXInLCAnbW9kZXJhdGUnKV0uc2VsZWN0ZWQgPSB0cnVlO1xuXG4gICAgcmV0dXJuIGRhdGE7XG4gIH0sXG4gIGdldExvY2F0aW9uUGVybVN0YXRlKCl7XG4gICAgdmFyIGRhdGEgPSB7XG4gICAgICAneWVzJzoge1xuICAgICAgICBuYW1lOiBDbGlxelV0aWxzLmdldExvY2FsaXplZFN0cmluZygnYWx3YXlzJyksXG4gICAgICAgIHNlbGVjdGVkOiBmYWxzZVxuICAgICAgfSxcbiAgICAgICdhc2snOiB7XG4gICAgICAgIG5hbWU6IENsaXF6VXRpbHMuZ2V0TG9jYWxpemVkU3RyaW5nKCdhbHdheXNfYXNrJyksXG4gICAgICAgIHNlbGVjdGVkOiBmYWxzZVxuICAgICAgfSxcbiAgICAgICdubyc6IHtcbiAgICAgICAgbmFtZTogQ2xpcXpVdGlscy5nZXRMb2NhbGl6ZWRTdHJpbmcoJ25ldmVyJyksXG4gICAgICAgIHNlbGVjdGVkOiBmYWxzZVxuICAgICAgfVxuICAgIH07XG5cbiAgICBkYXRhW0NsaXF6VXRpbHMuZ2V0UHJlZignc2hhcmVfbG9jYXRpb24nLCAnYXNrJyldLnNlbGVjdGVkID0gdHJ1ZTtcblxuICAgIHJldHVybiBkYXRhO1xuICB9LFxuXG4gIC8vIFJldHVybnMgcmVzdWx0IGVsZW1lbnRzIHNlbGVjYXRibGUgYW5kIG5hdmlnYXRhYmxlIGZyb20ga2V5Ym9hcmQuXG4gIC8vIHxjb250YWluZXJ8IHNlYXJjaCBjb250ZXh0LCB1c3VhbGx5IGl0J3MgYENMSVFaLlVJLmdDbGlxekJveGAuXG4gIGV4dHJhY3RTZWxlY3RhYmxlRWxlbWVudHMoY29udGFpbmVyKSB7XG4gICAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKFxuICAgICAgICBjb250YWluZXIucXVlcnlTZWxlY3RvckFsbCgnW2Fycm93XScpKS5maWx0ZXIoXG4gICAgICAgICAgICBmdW5jdGlvbihlbCkge1xuICAgICAgICAgICAgICAvLyBkb250IGNvbnNpZGVyIGhpZGRlbiBlbGVtZW50c1xuICAgICAgICAgICAgICBpZihlbC5vZmZzZXRQYXJlbnQgPT0gbnVsbClcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgICAgICAgaWYoIWVsLmdldEF0dHJpYnV0ZSgnYXJyb3ctaWYtdmlzaWJsZScpKVxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuXG4gICAgICAgICAgICAgIC8vIGNoZWNrIGlmIHRoZSBlbGVtZW50IGlzIHZpc2libGVcbiAgICAgICAgICAgICAgLy9cbiAgICAgICAgICAgICAgLy8gZm9yIG5vdyB0aGlzIGNoZWNrIGlzIGVub3VnaCBidXQgd2UgbWlnaHQgYmUgZm9yY2VkIHRvIHN3aXRjaCB0byBhXG4gICAgICAgICAgICAgIC8vIG1vcmUgZ2VuZXJpYyBhcHByb2FjaCAtIG1heWJlIHVzaW5nIGRvY3VtZW50LmVsZW1lbnRGcm9tUG9pbnQoeCwgeSlcbiAgICAgICAgICAgICAgaWYgKGVsLm9mZnNldExlZnQgKyBlbC5vZmZzZXRXaWR0aCA+IGVsLnBhcmVudEVsZW1lbnQub2Zmc2V0V2lkdGgpXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfSk7XG4gIH0sXG5cbiAgZ2V0Tm9SZXN1bHRzOiBDTElRWkVudmlyb25tZW50LmdldE5vUmVzdWx0cyxcbiAgZ2V0UGFyYW1ldGVyQnlOYW1lOiBmdW5jdGlvbihuYW1lLCBsb2NhdGlvbikge1xuICAgIG5hbWUgPSBuYW1lLnJlcGxhY2UoL1tcXFtdLywgXCJcXFxcW1wiKS5yZXBsYWNlKC9bXFxdXS8sIFwiXFxcXF1cIik7XG4gICAgdmFyIHJlZ2V4ID0gbmV3IFJlZ0V4cChcIltcXFxcPyZdXCIgKyBuYW1lICsgXCI9KFteJiNdKilcIiksXG4gICAgcmVzdWx0cyA9IHJlZ2V4LmV4ZWMobG9jYXRpb24uc2VhcmNoKTtcbiAgICByZXR1cm4gcmVzdWx0cyA9PT0gbnVsbCA/IFwiXCIgOiBkZWNvZGVVUklDb21wb25lbnQocmVzdWx0c1sxXS5yZXBsYWNlKC9cXCsvZywgXCIgXCIpKTtcbiAgfSxcbiAgYWRkRXZlbnRMaXN0ZW5lclRvRWxlbWVudHM6IENMSVFaRW52aXJvbm1lbnQuYWRkRXZlbnRMaXN0ZW5lclRvRWxlbWVudHMsXG4gIHNlYXJjaDogQ0xJUVpFbnZpcm9ubWVudC5zZWFyY2gsXG4gIGRpc3RhbmNlOiBmdW5jdGlvbihsb24xLCBsYXQxLCBsb24yID0gQ2xpcXpVdGlscy5VU0VSX0xORywgbGF0MiA9IENsaXF6VXRpbHMuVVNFUl9MQVQpIHtcbiAgICAvKiogQ29udmVydHMgbnVtZXJpYyBkZWdyZWVzIHRvIHJhZGlhbnMgKi9cbiAgICBmdW5jdGlvbiBkZWdyZWVzVG9SYWQoZGVncmVlKXtcbiAgICAgIHJldHVybiBkZWdyZWUgKiBNYXRoLlBJIC8gMTgwO1xuICAgIH1cblxuICAgIHZhciBSID0gNjM3MTsgLy8gUmFkaXVzIG9mIHRoZSBlYXJ0aCBpbiBrbVxuICAgIGlmKCFsb24yIHx8ICFsb24xIHx8ICFsYXQyIHx8ICFsYXQxKSB7IHJldHVybiAtMTsgfVxuICAgIHZhciBkTGF0ID0gZGVncmVlc1RvUmFkKGxhdDItbGF0MSk7ICAvLyBKYXZhc2NyaXB0IGZ1bmN0aW9ucyBpbiByYWRpYW5zXG4gICAgdmFyIGRMb24gPSBkZWdyZWVzVG9SYWQobG9uMi1sb24xKTtcbiAgICB2YXIgYSA9IE1hdGguc2luKGRMYXQvMikgKiBNYXRoLnNpbihkTGF0LzIpICtcbiAgICAgICAgICAgIE1hdGguY29zKGRlZ3JlZXNUb1JhZChsYXQxKSkgKiBNYXRoLmNvcyhkZWdyZWVzVG9SYWQobGF0MikpICpcbiAgICAgICAgICAgIE1hdGguc2luKGRMb24vMikgKiBNYXRoLnNpbihkTG9uLzIpO1xuICAgIHZhciBjID0gMiAqIE1hdGguYXRhbjIoTWF0aC5zcXJ0KGEpLCBNYXRoLnNxcnQoMS1hKSk7XG4gICAgdmFyIGQgPSBSICogYzsgLy8gRGlzdGFuY2UgaW4ga21cbiAgICByZXR1cm4gZDtcbiAgfSxcbiAgZ2V0RGVmYXVsdFNlYXJjaEVuZ2luZTogQ0xJUVpFbnZpcm9ubWVudC5nZXREZWZhdWx0U2VhcmNoRW5naW5lLFxuICBjb3B5UmVzdWx0OiBDTElRWkVudmlyb25tZW50LmNvcHlSZXN1bHQsXG4gIG9wZW5Qb3B1cDogQ0xJUVpFbnZpcm9ubWVudC5vcGVuUG9wdXAsXG4gIGlzT25Qcml2YXRlVGFiOiBDTElRWkVudmlyb25tZW50LmlzT25Qcml2YXRlVGFiLFxuICBnZXRBbGxDbGlxelByZWZzOiBDTElRWkVudmlyb25tZW50LmdldEFsbENsaXF6UHJlZnMsXG4gIGlzRGVmYXVsdEJyb3dzZXI6IENMSVFaRW52aXJvbm1lbnQuaXNEZWZhdWx0QnJvd3NlcixcbiAgc2V0RGVmYXVsdFNlYXJjaEVuZ2luZTogQ0xJUVpFbnZpcm9ubWVudC5zZXREZWZhdWx0U2VhcmNoRW5naW5lLFxuICBpc1Vua25vd25UZW1wbGF0ZTogQ0xJUVpFbnZpcm9ubWVudC5pc1Vua25vd25UZW1wbGF0ZSxcbiAgaGlzdG9yeVNlYXJjaDogQ0xJUVpFbnZpcm9ubWVudC5oaXN0b3J5U2VhcmNoLFxuICBnZXRFbmdpbmVCeU5hbWU6IENMSVFaRW52aXJvbm1lbnQuZ2V0RW5naW5lQnlOYW1lLFxuICBhZGRFbmdpbmVXaXRoRGV0YWlsczogQ0xJUVpFbnZpcm9ubWVudC5hZGRFbmdpbmVXaXRoRGV0YWlscyxcbiAgZ2V0RW5naW5lQnlBbGlhczogQ0xJUVpFbnZpcm9ubWVudC5nZXRFbmdpbmVCeUFsaWFzLFxuICBnZXRTZWFyY2hFbmdpbmVzOiBDTElRWkVudmlyb25tZW50LmdldFNlYXJjaEVuZ2luZXMsXG4gIGJsYWNrTGlzdGVkRW5naW5lczogQ0xJUVpFbnZpcm9ubWVudC5ibGFja0xpc3RlZEVuZ2luZXMsXG4gIHVwZGF0ZUFsaWFzOiBDTElRWkVudmlyb25tZW50LnVwZGF0ZUFsaWFzLFxuICBvcGVuTGluazogQ0xJUVpFbnZpcm9ubWVudC5vcGVuTGluayxcbiAgZ2V0Q2xpcXpQcmVmcygpIHtcbiAgICBmdW5jdGlvbiBmaWx0ZXJlcihlbnRyeSkge1xuICAgICAgICAvLyBhdm9pZCBwcml2YXkgbGVha2luZyBwcmVmcyAoJ2JhY2t1cCcpLlxuICAgICAgICAvLyBhdm9pZCBpcnJlbGV2YW50IGRlZXAgcHJlZnMgKHNvbWV0aGluZy5vdGhlcnRoaW5nLngueSlcbiAgICAgICAgLy8gYWxsb3cgJ2VuYWJsZWQnIHByZWZzXG4gICAgICAgIHJldHVybiAoKGVudHJ5LmluZGV4T2YoJy4nKSA9PSAtMSAmJiBlbnRyeS5pbmRleE9mKCdiYWNrdXAnKSA9PSAtMSlcbiAgICAgICAgICAgICAgICB8fCBlbnRyeS5pbmRleE9mKCcuZW5hYmxlZCcpICE9IC0xKTtcbiAgICAgIH1cblxuICAgICAgbGV0IGNsaXF6UHJlZnMgPSB7fVxuICAgICAgbGV0IGNsaXF6UHJlZnNLZXlzID0gQ2xpcXpVdGlscy5nZXRBbGxDbGlxelByZWZzKCkuZmlsdGVyKGZpbHRlcmVyKTtcblxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjbGlxelByZWZzS2V5cy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjbGlxelByZWZzW2NsaXF6UHJlZnNLZXlzW2ldXSA9IHByZWZzLmdldChjbGlxelByZWZzS2V5c1tpXSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBjbGlxelByZWZzO1xuICB9LFxuICBwcm9taXNlSHR0cEhhbmRsZXI6IHByb21pc2VIdHRwSGFuZGxlcixcbiAgcmVnaXN0ZXJSZXN1bHRQcm92aWRlcjogZnVuY3Rpb24gKG8pIHtcbiAgICBDTElRWkVudmlyb25tZW50LkNsaXF6UmVzdWx0UHJvdmlkZXJzID0gby5SZXN1bHRQcm92aWRlcnM7XG4gICAgQ0xJUVpFbnZpcm9ubWVudC5SZXN1bHQgPSBvLlJlc3VsdDtcbiAgfSxcbiAgbGFzdFJlbmRlcmVkUmVzdWx0czogW10sXG4gIGxhc3RSZW5kZXJlZFVSTHM6IFtdLFxuICBsYXN0U2VsZWN0aW9uOiAtMSxcbiAgb25SZW5kZXJDb21wbGV0ZTogZnVuY3Rpb24gb25SZW5kZXJDb21wbGV0ZShxdWVyeSwgYm94KSB7XG4gICAgaWYgKCFDTElRWkVudmlyb25tZW50Lm9uUmVuZGVyQ29tcGxldGUpIHJldHVybjtcblxuICAgIENsaXF6VXRpbHMubGFzdFJlbmRlcmVkUmVzdWx0cyA9IHRoaXMuZXh0cmFjdFNlbGVjdGFibGVFbGVtZW50cyhib3gpLmZpbHRlcihmdW5jdGlvbiAobm9kZSkge1xuICAgICAgcmV0dXJuICEhKG5vZGUuZ2V0QXR0cmlidXRlKFwidXJsXCIpIHx8IG5vZGUuZ2V0QXR0cmlidXRlKFwiaHJlZlwiKSk7XG4gICAgfSk7XG4gICAgQ2xpcXpVdGlscy5sYXN0UmVuZGVyZWRVUkxzID0gQ2xpcXpVdGlscy5sYXN0UmVuZGVyZWRSZXN1bHRzXG4gICAgICAubWFwKGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgIHJldHVybiBub2RlLmdldEF0dHJpYnV0ZShcInVybFwiKSB8fCBub2RlLmdldEF0dHJpYnV0ZShcImhyZWZcIik7XG4gICAgICB9KTtcblxuICAgIENMSVFaRW52aXJvbm1lbnQub25SZW5kZXJDb21wbGV0ZShxdWVyeSwgQ2xpcXpVdGlscy5sYXN0UmVuZGVyZWRVUkxzKTtcbiAgfSxcbiAgb25TZWxlY3Rpb25DaGFuZ2U6IGZ1bmN0aW9uIG9uU2VsZWN0aW9uQ2hhbmdlKGVsZW1lbnQpIHtcbiAgICBpZiAoIWVsZW1lbnQpIHJldHVybjtcblxuICAgIHZhciBjdXJyZW50ID0gQ2xpcXpVdGlscy5sYXN0UmVuZGVyZWRSZXN1bHRzLmluZGV4T2YoZWxlbWVudCk7XG4gICAgaWYgKGN1cnJlbnQgPT0gLTEpIHtcbiAgICAgIGN1cnJlbnQgPSBDbGlxelV0aWxzLmxhc3RSZW5kZXJlZFVSTHMuaW5kZXhPZihcbiAgICAgICAgICBlbGVtZW50LmdldEF0dHJpYnV0ZShcInVybFwiKSk7XG4gICAgfVxuXG4gICAgaWYgKENsaXF6VXRpbHMubGFzdFNlbGVjdGlvbiA9PSBjdXJyZW50KVxuICAgICAgcmV0dXJuO1xuICAgIENsaXF6VXRpbHMubGFzdFNlbGVjdGlvbiA9IGN1cnJlbnQ7XG5cbiAgICBpZiAoIUNMSVFaRW52aXJvbm1lbnQub25SZXN1bHRTZWxlY3Rpb25DaGFuZ2UpIHJldHVybjtcbiAgICBDTElRWkVudmlyb25tZW50Lm9uUmVzdWx0U2VsZWN0aW9uQ2hhbmdlKGN1cnJlbnQpO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBDbGlxelV0aWxzO1xuIiwiLypcbiAqIFRoaXMgbWV0aG9kIGltcGxlbWVudHMgdGhlIHB1Ymxpc2ggc3Vic2NyaWJlIGRlc2lnbiBwYXR0ZXJuXG4gKlxuICogRXZlbnQgbmFtaW5nIHNjaGVtZTpcbiAqICAgIGNsaXF6Lm1vZHVsZV9uYW1lLmV2ZW50X25hbWVcbiAqXG4gKiAgc2luZ2xlIHNlbmRlciAtPiBtdWx0aXBsZSBwb3RlbnRpYWwgcmVjaXBpZW50c1xuICogICAgZm9yIGV4YW1wbGU6IGNsaXF6LmNvcmUudXJsYmFyX2ZvY3VzIChpbmZvcm0gb3RoZXJzIGFib3V0IHVybGJhciBmb2N1cylcbiAqICAgIG1vZHVsZV9uYW1lIGRlc2NyaWJlcyBzZW5kZXJcbiAqICBtdWx0aXBsZSBwb3RlbnRpYWwgc2VuZGVycyAtPiBzaW5nbGUgcmVjaXBpZW50XG4gKiAgICBmb3IgZXhhbXBsZTogY2xpcXoubXNnX2NlbnRlci5zaG93X21lc3NhZ2UgKHRlbGwgdGhlIG1lc3NhZ2UgY2VudGVyIHRvIHNob3cgYSBtZXNzYWdlKVxuICogICAgbW9kdWxlX25hbWUgZGVzY3JpYmVzIHJlY2lwaWVudCAodGhpcyBpcyBtb3JlIGxpa2UgYSBSUEMpXG4gKi9cblxuaW1wb3J0IGNvbnNvbGUgZnJvbSBcIi4vY29uc29sZVwiO1xuaW1wb3J0IENsaXF6VXRpbHMgZnJvbSBcIi4vdXRpbHNcIjtcblxudmFyIENsaXF6RXZlbnRzID0gQ2xpcXpFdmVudHMgfHwge1xuICAvL3VzZSBhIGphdmFzY3JpcHQgb2JqZWN0IHRvIHB1c2ggdGhlIG1lc3NhZ2UgaWRzIGFuZCB0aGUgY2FsbGJhY2tzXG4gIGNhY2hlOiB7fSxcbiAgdGlja0NhbGxiYWNrczogW10sXG4gIC8qXG4gICAqIFB1Ymxpc2ggZXZlbnRzIG9mIGludGVyZXN0IHdpdGggYSBzcGVjaWZpYyBpZFxuICAgKi9cbiAgcXVldWU6IFtdLFxuXG4gIHB1YjogZnVuY3Rpb24gKGlkKSB7XG4gICAgY29uc3QgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG5cbiAgICBjb25zdCBjYWxsYmFja3MgPSAoQ2xpcXpFdmVudHMuY2FjaGVbaWRdIHx8IFtdKS5tYXAoZXYgPT4ge1xuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgICBDbGlxelV0aWxzLnNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBldi5hcHBseShudWxsLCBhcmdzKTtcbiAgICAgICAgICB9IGNhdGNoKGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYENsaXF6RXZlbnRzIGVycm9yOiAke2lkfWAsIGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgIH0sIDApO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBjb25zdCBmaW5pc2hlZFByb21pc2UgPSBQcm9taXNlLmFsbChjYWxsYmFja3MpLnRoZW4oKCkgPT4ge1xuICAgICAgY29uc3QgaW5kZXggPSB0aGlzLnF1ZXVlLmluZGV4T2YoZmluaXNoZWRQcm9taXNlKTtcbiAgICAgIHRoaXMucXVldWUuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgIGlmICh0aGlzLnF1ZXVlLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICB0aGlzLnRyaWdnZXJOZXh0VGljaygpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHRoaXMucXVldWUucHVzaChmaW5pc2hlZFByb21pc2UpO1xuICB9LFxuXG4gIHRyaWdnZXJOZXh0VGljaygpIHtcbiAgICB0aGlzLnRpY2tDYWxsYmFja3MuZm9yRWFjaChjYiA9PiB7XG4gICAgICB0cnkge1xuICAgICAgICBjYigpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgfVxuICAgIH0pO1xuICAgIHRoaXMudGlja0NhbGxiYWNrcyA9IFtdO1xuICB9LFxuXG4gIG5leHRUaWNrKGNiID0gKCkgPT4ge30pIHtcbiAgICB0aGlzLnRpY2tDYWxsYmFja3MgPSB0aGlzLnRpY2tDYWxsYmFja3MgfHwgW107XG4gICAgdGhpcy50aWNrQ2FsbGJhY2tzLnB1c2goY2IpO1xuICB9LFxuXG4gIC8qIFN1YnNjcmliZSB0byBldmVudHMgb2YgaW50ZXJlc3RcbiAgICogd2l0aCBhIHNwZWNpZmljIGlkIGFuZCBhIGNhbGxiYWNrXG4gICAqIHRvIGJlIGV4ZWN1dGVkIHdoZW4gdGhlIGV2ZW50IGlzIG9ic2VydmVkXG4gICAqL1xuICBzdWI6IGZ1bmN0aW9uIChpZCwgZm4pIHtcbiAgICBDbGlxekV2ZW50cy5jYWNoZVtpZF0gPSBDbGlxekV2ZW50cy5jYWNoZVtpZF0gfHwgW107XG4gICAgQ2xpcXpFdmVudHMuY2FjaGVbaWRdLnB1c2goZm4pO1xuICB9LFxuXG4gIHN1YnNjcmliZShldmVudE5hbWUsIGNhbGxiYWNrLCB0aGF0KSB7XG4gICAgbGV0IGNiO1xuICAgIGlmICh0aGF0KSB7XG4gICAgICBjYiA9IGNhbGxiYWNrLmJpbmQodGhhdClcbiAgICB9IGVsc2Uge1xuICAgICAgY2IgPSBjYWxsYmFjaztcbiAgICB9XG5cbiAgICBDbGlxekV2ZW50cy5zdWIoZXZlbnROYW1lLCBjYik7XG5cbiAgICByZXR1cm4ge1xuICAgICAgdW5zdWJzY3JpYmUoKSB7XG4gICAgICAgIENsaXF6RXZlbnRzLnVuX3N1YihldmVudE5hbWUsIGNiKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgdW5fc3ViOiBmdW5jdGlvbiAoaWQsIGZuKSB7XG4gICAgaWYgKCFDbGlxekV2ZW50cy5jYWNoZVtpZF0gfHwgQ2xpcXpFdmVudHMuY2FjaGVbaWRdLmxlbmd0aCA9PT0gMCkge1xuICAgICAgY29uc29sZS5lcnJvcihcIlRyeWluZyB0byB1bnN1YnNjcmliZSBldmVudCB0aGF0IGhhZCBubyBzdWJzY3JpYmVyc1wiKVxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCBpbmRleCA9IENsaXF6RXZlbnRzLmNhY2hlW2lkXS5pbmRleE9mKGZuKTtcbiAgICBpZiAoaW5kZXggPiAtMSkge1xuICAgICAgQ2xpcXpFdmVudHMuY2FjaGVbaWRdLnNwbGljZShpbmRleCwgMSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJUcnlpbmcgdG8gdW5zdWJzY3JpYmUgYW4gdW5rbm93biBsaXN0ZW5lclwiKTtcbiAgICB9XG4gIH0sXG5cbiAgY2xlYW5fY2hhbm5lbDogZnVuY3Rpb24oaWQpIHtcbiAgICBpZiAoIUNsaXF6RXZlbnRzLmNhY2hlW2lkXSkge1xuICAgICAgdGhyb3cgXCJUcnlpbmcgdG8gdW5zdWJzY3JpYmUgYW4gdW5rbm93biBjaGFubmVsXCI7XG4gICAgfVxuICAgIENsaXF6RXZlbnRzLmNhY2hlW2lkXSA9IFtdO1xuICB9LFxuXG4gIC8qKlxuICAgKiBBZGRzIGEgbGlzdGVuZXIgdG8gZXZlbnRUYXJnZXQgZm9yIGV2ZW50cyBvZiB0eXBlIGV2ZW50VHlwZSwgYW5kIHJlcHVibGlzaGVzIHRoZW1cbiAgICogIHRocm91Z2ggQ2xpcXpFdmVudHMgd2l0aCBpZCBjbGlxekV2ZW50TmFtZS5cbiAgICovXG4gIHByb3h5RXZlbnQoY2xpcXpFdmVudE5hbWUsIGV2ZW50VGFyZ2V0LCBldmVudFR5cGUsIHByb3BhZ2F0ZSA9IGZhbHNlLCB0cmFuc2Zvcm0pICB7XG4gICAgY29uc3QgcHVibGlzaGVyID0gQ2xpcXpFdmVudHMucHViLmJpbmQoQ2xpcXpFdmVudHMsIGNsaXF6RXZlbnROYW1lKTtcblxuICAgIGZ1bmN0aW9uIGhhbmRsZXIoKSB7XG4gICAgICBjb25zdCBhcmdzID0gdHJhbnNmb3JtID8gdHJhbnNmb3JtLmFwcGx5KG51bGwsIGFyZ3VtZW50cykgOiBhcmd1bWVudHM7XG4gICAgICBwdWJsaXNoZXIuYXBwbHkobnVsbCwgYXJncyk7XG4gICAgfVxuXG4gICAgZXZlbnRUYXJnZXQuYWRkRXZlbnRMaXN0ZW5lcihldmVudFR5cGUsIGhhbmRsZXIsIHByb3BhZ2F0ZSk7XG4gICAgcmV0dXJuIHtcbiAgICAgIHVuc3Vic2NyaWJlKCkge1xuICAgICAgICBldmVudFRhcmdldC5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50VHlwZSwgaGFuZGxlcik7XG4gICAgICB9XG4gICAgfTtcbiAgfSxcblxuICBuZXh0SWQ6IGZ1bmN0aW9uIG5leHRJZCgpIHtcbiAgICBuZXh0SWQuaWQgPSBuZXh0SWQuaWQgfHwgMDtcbiAgICBuZXh0SWQuaWQgKz0gMTtcbiAgICByZXR1cm4gbmV4dElkLmlkO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBDbGlxekV2ZW50cztcbmV4cG9ydCBsZXQgc3Vic2NyaWJlID0gQ2xpcXpFdmVudHMuc3Vic2NyaWJlO1xuIiwiaW1wb3J0IFN0b3JhZ2UgZnJvbSAnLi4vY29yZS9zdG9yYWdlJztcbmltcG9ydCBldmVudHMgZnJvbSAnLi4vY29yZS9ldmVudHMnO1xuXG5jb25zdCBzdG9yYWdlID0gbmV3IFN0b3JhZ2UoKTtcblxuZXhwb3J0IGZ1bmN0aW9uIGdldFByZWYocHJlZiwgbm90Rm91bmQpIHtcbiAgY29uc3QgbXlwcmVmID0gc3RvcmFnZS5nZXRJdGVtKHByZWYpO1xuICBpZiAobXlwcmVmKSB7XG4gICAgaWYgKG15cHJlZiA9PT0gJ2ZhbHNlJykge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBpZiAobXlwcmVmID09PSAndHJ1ZScpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBpZiAoIWlzTmFOKG15cHJlZikpIHtcbiAgICAgIHJldHVybiBwYXJzZUludChteXByZWYsIDEwKTtcbiAgICB9XG4gICAgcmV0dXJuIG15cHJlZjtcbiAgfVxuICByZXR1cm4gbm90Rm91bmQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXRQcmVmKHByZWYsIHZhbCkge1xuICBzdG9yYWdlLnNldEl0ZW0ocHJlZiwgdmFsKTtcbiAgZXZlbnRzLnB1YigncHJlZmNoYW5nZScsIHByZWYpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaGFzUHJlZihwcmVmKSB7XG4gIHJldHVybiBzdG9yYWdlLmdldEl0ZW0ocHJlZikgIT09IG51bGw7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjbGVhclByZWYocHJlZikge1xuICBzdG9yYWdlLnJlbW92ZUl0ZW0ocHJlZik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBlbmFibGVDaGFuZ2VFdmVudHMoKSB7XG4gIHRocm93IG5ldyBFcnJvcignbm90IGltcGxlbWVudGVkIC0gcHJlZnMuZW5hYmxlQ2hhbmdlRXZlbnRzJyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkaXNhYmxlQ2hhbmdlRXZlbnRzKCkge1xuICB0aHJvdyBuZXcgRXJyb3IoJ25vdCBpbXBsZW1lbnRlZCAtIHByZWZzLmRpc2FibGVDaGFuZ2VFdmVudHMnKTtcbn1cbiIsImltcG9ydCB7IGdldFByZWYsIHNldFByZWYsIGhhc1ByZWYsIGNsZWFyUHJlZiwgZW5hYmxlQ2hhbmdlRXZlbnRzLCBkaXNhYmxlQ2hhbmdlRXZlbnRzIH0gZnJvbSBcIi4uL3BsYXRmb3JtL3ByZWZzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgLyoqXG4gICAqIEdldCBhIHZhbHVlIGZyb20gcHJlZmVyZW5jZXMgZGJcbiAgICogQHBhcmFtIHtzdHJpbmd9ICBwcmVmIC0gcHJlZmVyZW5jZSBpZGVudGlmaWVyXG4gICAqIEBwYXJhbSB7Kj19ICAgICAgZGVmYXV0bFZhbHVlIC0gcmV0dXJuZWQgdmFsdWUgaW4gY2FzZSBwcmVmIGlzIG5vdCBkZWZpbmVkXG4gICAqIEBwYXJhbSB7c3RyaW5nPX0gcHJlZml4IC0gcHJlZml4IGZvciBwcmVmXG4gICAqL1xuICBnZXQ6IGdldFByZWYsXG4gIC8qKlxuICAgKiBTZXQgYSB2YWx1ZSBpbiBwcmVmZXJlbmNlcyBkYlxuICAgKiBAcGFyYW0ge3N0cmluZ30gIHByZWYgLSBwcmVmZXJlbmNlIGlkZW50aWZpZXJcbiAgICogQHBhcmFtIHtzdHJpbmc9fSBwcmVmaXggLSBwcmVmaXggZm9yIHByZWZcbiAgICovXG4gIHNldDogc2V0UHJlZixcbiAgLyoqXG4gICAqIENoZWNrIGlmIHRoZXJlIGlzIGEgdmFsdWUgaW4gcHJlZmVyZW5jZXMgZGJcbiAgICogQHBhcmFtIHtzdHJpbmd9ICBwcmVmIC0gcHJlZmVyZW5jZSBpZGVudGlmaWVyXG4gICAqIEBwYXJhbSB7c3RyaW5nPX0gcHJlZml4IC0gcHJlZml4IGZvciBwcmVmXG4gICAqL1xuICBoYXM6IGhhc1ByZWYsXG4gIC8qKlxuICAgKiBDbGVhciB2YWx1ZSBpbiBwcmVmZXJlbmNlcyBkYlxuICAgKiBAcGFyYW0ge3N0cmluZ30gIHByZWYgLSBwcmVmZXJlbmNlIGlkZW50aWZpZXJcbiAgICogQHBhcmFtIHtzdHJpbmc9fSBwcmVmaXggLSBwcmVmaXggZm9yIHByZWZcbiAgICovXG4gIGNsZWFyOiBjbGVhclByZWYsXG5cbiAgZW5hYmxlQ2hhbmdlRXZlbnRzLFxuXG4gIGRpc2FibGVDaGFuZ2VFdmVudHMsXG59O1xuIiwiaW1wb3J0IGNvbnNvbGUgZnJvbSBcIi4uL3BsYXRmb3JtL2NvbnNvbGVcIjtcbmltcG9ydCBwcmVmcyBmcm9tIFwiLi9wcmVmc1wiO1xuXG5jb25zdCBpc0xvZ2dpbmdFbmFibGVkID0gcHJlZnMuZ2V0KCdzaG93Q29uc29sZUxvZ3MnLCBmYWxzZSk7XG5cbmxldCBsb2c7XG5sZXQgZXJyb3I7XG5sZXQgZGVidWc7XG5cbmlmIChpc0xvZ2dpbmdFbmFibGVkKSB7XG4gIGxvZyA9IGNvbnNvbGUubG9nLmJpbmQoY29uc29sZSwgJ0NMSVFaJyk7XG4gIGVycm9yID0gY29uc29sZS5lcnJvci5iaW5kKGNvbnNvbGUsICdDTElRWiBlcnJvcicpO1xuICBpZiAocHJlZnMuZ2V0KCdkZXZlbG9wZXInKSkge1xuICAgIGRlYnVnID0gbG9nO1xuICB9IGVsc2Uge1xuICAgIGRlYnVnID0gKCkgPT4ge307XG4gIH1cbn0gZWxzZSB7XG4gIGxvZyA9ICgpID0+IHt9O1xuICBlcnJvciA9ICgpID0+IHt9O1xuICBkZWJ1ZyA9ICgpID0+IHt9O1xufVxuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGxvZyxcbiAgZXJyb3IsXG4gIGRlYnVnLFxufTtcbiIsImltcG9ydCBDbGlxelNlY3VyZU1lc3NhZ2UgZnJvbSAnLi9tYWluJztcbmltcG9ydCBjb25zb2xlIGZyb20gJy4uL2NvcmUvY29uc29sZSc7XG5cbi8qXG5GdW5jdGlvbiB0byBjcmVhdGUgaHR0cCB1cmxcbiovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlSHR0cFVybChob3N0KSB7XG4gIHJldHVybiAnaHR0cDovLycgKyBob3N0ICsgJy92ZXJpZnknO1xufVxuXG4vKlxuQ29udmVydHMgZ2l2ZW4gYXJyYXkgdG8gZ2VuZXJhdG9yIGxpa2Ugb2JqZWN0LlxuKi9cbmV4cG9ydCBmdW5jdGlvbiB0cmtHZW4oX3Ryaykge1xuICBjb25zdCB0cmsgPSBfdHJrO1xuICBsZXQgaWR4ID0gLTE7XG4gIHJldHVybiB7XG4gICAgbmV4dDogZnVuY3Rpb24oKSB7XG4gICAgICBpZHggKz0gMTtcbiAgICAgIGlmIChpZHggPCB0cmsubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgdmFsdWU6IGlkeCwgLy8gUmV0dXJuIHRoZSBmaXJzdCB5aWVsZGVkIHZhbHVlLlxuICAgICAgICAgIGRvbmU6IGZhbHNlLFxuICAgICAgICB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICB2YWx1ZTogdW5kZWZpbmVkLCAvLyBSZXR1cm4gdW5kZWZpbmVkLlxuICAgICAgICAgIGRvbmU6IHRydWUsXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfSxcbiAgfTtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gcHJ1bmVsb2NhbFRlbXBvcmFsVW5pcSgpIHtcbiAgaWYgKENsaXF6U2VjdXJlTWVzc2FnZS5sb2NhbFRlbXBvcmFsVW5pcSAmJiBPYmplY3Qua2V5cyhDbGlxelNlY3VyZU1lc3NhZ2UubG9jYWxUZW1wb3JhbFVuaXEpLmxlbmd0aCA+IDApIHtcbiAgICBjb25zdCBjdXJyVGltZSA9IERhdGUubm93KCk7XG4gICAgbGV0IHBpID0gMDtcbiAgICBPYmplY3Qua2V5cyhDbGlxelNlY3VyZU1lc3NhZ2UubG9jYWxUZW1wb3JhbFVuaXEpLmZvckVhY2goIGUgPT4ge1xuICAgICAgY29uc3QgZCA9IENsaXF6U2VjdXJlTWVzc2FnZS5sb2NhbFRlbXBvcmFsVW5pcVtlXS50cztcbiAgICAgIGNvbnN0IGRpZmYgPSAoY3VyclRpbWUgLSBkKTtcbiAgICAgIGlmIChkaWZmID49ICgyNCAqIDYwICogNjAgKiAxMDAwKSkge1xuICAgICAgICBkZWxldGUgQ2xpcXpTZWN1cmVNZXNzYWdlLmxvY2FsVGVtcG9yYWxVbmlxW2VdO1xuICAgICAgICBwaSArPSAxO1xuICAgICAgfVxuICAgIH0pO1xuICAgIC8qXG4gICAgaWYoQ2xpcXpIdW1hbldlYi5hY3Rpb25TdGF0cykge1xuICAgICAgICBjb25zdCBpdGVtc0xvY2FsVmFsaWRhdGlvbiA9IE9iamVjdC5rZXlzKENsaXF6U2VjdXJlTWVzc2FnZS5sb2NhbFRlbXBvcmFsVW5pcSkubGVuZ3RoO1xuICAgICAgICBDbGlxekh1bWFuV2ViLmFjdGlvblN0YXRzLml0ZW1zTG9jYWxWYWxpZGF0aW9uID0gaXRlbXNMb2NhbFZhbGlkYXRpb247XG4gICAgfVxuICAgICovXG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFJhbmRvbUludEluY2x1c2l2ZShtaW4sIG1heCkge1xuICBtaW4gPSBNYXRoLmNlaWwobWluKTtcbiAgbWF4ID0gTWF0aC5mbG9vcihtYXgpO1xuICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbiArIDEpKSArIG1pbjtcbn1cbiIsImltcG9ydCBDbGlxelV0aWxzIGZyb20gJy4uL2NvcmUvdXRpbHMnO1xuaW1wb3J0IGNvbnNvbGUgZnJvbSAnLi4vY29yZS9jb25zb2xlJztcbmltcG9ydCBQcm94eUZpbHRlciBmcm9tICcuLi9wbGF0Zm9ybS9wcm94eS1maWx0ZXInO1xuaW1wb3J0IHsgZ2V0UmFuZG9tSW50SW5jbHVzaXZlIH1mcm9tICcuL3V0aWxzJztcbmltcG9ydCBDbGlxelNlY3VyZU1lc3NhZ2UgZnJvbSAnLi9tYWluJztcbi8qXG5QaWNrZWQgdXAgZnJvbSB1bmJsb2NrIHByb3h5LmVzXG4qL1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBleHRlbmRzIFByb3h5RmlsdGVyIHtcbiAgLyoqXG4gICogV3JhcHBlciBmb3IgcnVsZS1iYXNlZCB1cmwgcHJveHlpbmc6IGltcGxlbWVudGF0aW9uIGZvciBGaXJlZm94XG4gICogQGNsYXNzIFByb3h5XG4gICogQG5hbWVzcGFjZSB1bmJsb2NrXG4gICogQGNvbnN0cnVjdG9yXG4gICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5tZXRob2QgPSBcInNvY2tzXCI7XG4gICAgdGhpcy5wb3J0ID0gOTAwNDtcbiAgfVxuXG4gIHNob3VsZFByb3h5KHVybCkge1xuICAgIGNvbnN0IHdpbmRvdyA9IENsaXF6VXRpbHMuZ2V0V2luZG93KCk7XG4gICAgcmV0dXJuICh1cmwuc2NoZW1lID09PSBcImh0dHBzXCIpICYmXG4gICAgICAoQ2xpcXpTZWN1cmVNZXNzYWdlLnNlcnZpY2VzVG9Qcm94eS5pbmRleE9mKHVybC5ob3N0KSA+IC0xKSAmJlxuICAgICAgKFxuICAgICAgICBDbGlxelV0aWxzLmdldFByZWYoJ2hwbi1xdWVyeScsIGZhbHNlKSB8fFxuICAgICAgICBDbGlxelV0aWxzLmlzT25Qcml2YXRlVGFiKHdpbmRvdylcbiAgICAgICk7XG4gIH1cblxuICBwcm94eSgpIHtcbiAgICBpZiAoIUNsaXF6U2VjdXJlTWVzc2FnZS5wcm94eUxpc3QpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgcHJveHlJZHggPSBnZXRSYW5kb21JbnRJbmNsdXNpdmUoMCwzKTtcbiAgICBjb25zdCBwcm94eUlQID0gQ2xpcXpTZWN1cmVNZXNzYWdlLnByb3h5TGlzdFtwcm94eUlkeF07XG4gICAgY29uc29sZS5sb2coXCJQcm94eWluZyBRdWVyeTogXCIgKyBwcm94eUlQKTtcblxuICAgIGlmIChDbGlxelNlY3VyZU1lc3NhZ2UucHJveHlJbmZvT2JqW3Byb3h5SVBdKSB7XG4gICAgICByZXR1cm4gQ2xpcXpTZWN1cmVNZXNzYWdlLnByb3h5SW5mb09ialtwcm94eUlQXTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3Qgb2IgPSB0aGlzLm5ld1Byb3h5KHRoaXMubWV0aG9kLCBwcm94eUlQLCB0aGlzLnBvcnQsIG51bGwsIDEwMDAsIG51bGwpO1xuICAgICAgQ2xpcXpTZWN1cmVNZXNzYWdlLnByb3h5SW5mb09ialtwcm94eUlQXSA9IG9iO1xuICAgICAgcmV0dXJuIG9iO1xuICAgIH1cbiAgfVxufTtcbiIsIi8qXG4gVGhpcyBtb2R1bGUgaXMgdXNlZCBmb3Igc2VuZGluZyB0aGUgZXZlbnRzIGZvciBwdXJwb3NlIG9mXG4gaHVtYW4td2ViLCBhbnRpLXRyYWNraW5nIHZpYSBhIHNlY3VyZSBjaGFubmVsLlxuKi9cblxuaW1wb3J0IFN0b3JhZ2UgZnJvbSAnLi4vcGxhdGZvcm0vaHBuL3N0b3JhZ2UnO1xuaW1wb3J0IENsaXF6VXRpbHMgZnJvbSAnLi4vY29yZS91dGlscyc7XG5pbXBvcnQgY29uZmlnIGZyb20gJy4uL2NvcmUvY29uZmlnJztcbmltcG9ydCBSZXNvdXJjZUxvYWRlciBmcm9tICcuLi9jb3JlL3Jlc291cmNlLWxvYWRlcic7XG5pbXBvcnQgeyBzZW5kTSB9IGZyb20gJy4vc2VuZC1tZXNzYWdlJztcbmltcG9ydCAqIGFzIGhwblV0aWxzIGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHsgb3ZlclJpZGVDbGlxelJlc3VsdHMgfSBmcm9tICcuL2h0dHAtaGFuZGxlci1wYXRjaCc7XG5pbXBvcnQgUHJveHlGaWx0ZXIgZnJvbSAnLi9wcm94eS1maWx0ZXInO1xuaW1wb3J0IENyeXB0b1dvcmtlciBmcm9tICcuL2NyeXB0by13b3JrZXInO1xuXG4vKiBHbG9iYWwgdmFyaWFibGVzXG4qL1xubGV0IHByb3h5Q291bnRlciA9IDA7XG5cbmNvbnN0IENsaXF6U2VjdXJlTWVzc2FnZSA9IHtcbiAgVkVSU0lPTjogJzAuMScsXG4gIExPR19LRVk6ICdzZWN1cmVtZXNzYWdlJyxcbiAgZGVidWc6IGZhbHNlLFxuICBjb3VudGVyOiAwLFxuICBzZWN1cmVMb2dnZXI6IHt9LFxuICB1UEs6IHt9LFxuICBkc1BLOiB7fSxcbiAgcm91dGVUYWJsZTogbnVsbCxcbiAgcm91dGVUYWJsZUxvYWRlcjogbnVsbCxcbiAgUlNBS2V5OiAnJyxcbiAgZXZlbnRJRDoge30sXG4gIHNvdXJjZU1hcDogbnVsbCxcbiAgc291cmNlTWFwTG9hZGVyOiBudWxsLFxuICB0bXVsdDogNCxcbiAgdHBhY2U6IDI1MCxcbiAgU09VUkNFX01BUF9QUk9WSURFUjogY29uZmlnLnNldHRpbmdzLkVORFBPSU5UX1NPVVJDRV9NQVBfUFJPVklERVIsXG4gIExPT0tVUF9UQUJMRV9QUk9WSURFUjogY29uZmlnLnNldHRpbmdzLkVORFBPSU5UX0xPT0tVUF9UQUJMRV9QUk9WSURFUixcbiAgS0VZU19QUk9WSURFUjogY29uZmlnLnNldHRpbmdzLkVORFBPSU5UX0tFWVNfUFJPVklERVIsXG4gIHByb3h5TGlzdDogbnVsbCxcbiAgcHJveHlMaXN0TG9hZGVyOiBudWxsLFxuICBwcm94eVN0YXRzOiB7fSxcbiAgUFJPWFlfTElTVF9QUk9WSURFUjogY29uZmlnLnNldHRpbmdzLkVORFBPSU5UX1BST1hZX0xJU1RfUFJPVklERVIsXG4gIEJMSU5EX1NJR05FUjogY29uZmlnLnNldHRpbmdzLkVORFBPSU5UX0JMSU5EX1NJR05FUixcbiAgVVNFUl9SRUc6IGNvbmZpZy5zZXR0aW5ncy5FTkRQT0lOVF9VU0VSX1JFRyxcbiAgbG9jYWxUZW1wb3JhbFVuaXE6IG51bGwsXG4gIHdDcnlwdG86IG51bGwsXG4gIHF1ZXJpZXNJRDoge30sXG4gIHNlcnZpY2VzVG9Qcm94eSA6IFtcImFwaS5jbGlxei5jb21cIiwgXCJhbnRpcGhpc2hpbmcuY2xpcXouY29tXCJdLFxuICBwcm94eUluZm9PYmo6IHt9LFxuICBxdWVyeVByb3h5RmlsdGVyOiBudWxsLFxuICBwYWNlbWFrZXI6IGZ1bmN0aW9uICgpIHtcbiAgICBDbGlxelNlY3VyZU1lc3NhZ2UuY291bnRlciArPSAxO1xuXG4gICAgaWYgKChDbGlxelNlY3VyZU1lc3NhZ2UuY291bnRlciAvIENsaXF6U2VjdXJlTWVzc2FnZS50bXVsdCkgJSAxMCA9PT0gMCkge1xuICAgICAgaWYgKENsaXF6U2VjdXJlTWVzc2FnZS5kZWJ1Zykge1xuICAgICAgICBDbGlxelV0aWxzLmxvZygnUGFjZW1ha2VyOiAnICsgQ2xpcXpTZWN1cmVNZXNzYWdlLmNvdW50ZXIgLyBDbGlxelNlY3VyZU1lc3NhZ2UudG11bHQsIENsaXF6U2VjdXJlTWVzc2FnZS5MT0dfS0VZKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoKENsaXF6U2VjdXJlTWVzc2FnZS5jb3VudGVyIC8gQ2xpcXpTZWN1cmVNZXNzYWdlLnRtdWx0KSAlIDUgPT09IDApIHtcbiAgICAgIGNvbnN0IGN1cnJlbnRUaW1lID0gRGF0ZS5ub3coKTtcblxuXG4gICAgICBpZiAoIUNsaXF6VXRpbHMuZ2V0V2luZG93KCkgfHwgIUNsaXF6VXRpbHMuZ2V0V2luZG93KCkuQ0xJUVogfHwgIUNsaXF6VXRpbHMuZ2V0V2luZG93KCkuQ0xJUVouVUkpIHJldHVybjtcbiAgICAgIGNvbnN0IHREaWZmID0gY3VycmVudFRpbWUgLSBDbGlxelV0aWxzLmdldFdpbmRvdygpLkNMSVFaLlVJLmxhc3RJbnB1dFRpbWU7XG5cbiAgICAgIGlmICh0RGlmZiA+IDAgJiYgdERpZmYgPiAoMTAwMCAqIDIgKiAxKSkge1xuICAgICAgICBDbGlxelNlY3VyZU1lc3NhZ2UucHJveHlJUCgpO1xuICAgICAgfVxuXG4gICAgICBpZiAoKCFDbGlxelNlY3VyZU1lc3NhZ2UudVBLLnB1YmxpY0tleUI2NCkgfHwgKCFDbGlxelNlY3VyZU1lc3NhZ2UudVBLLnByaXZhdGVLZXkpKSB7XG4gICAgICAgIENsaXF6U2VjdXJlTWVzc2FnZS5yZWdpc3RlclVzZXIoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoKENsaXF6U2VjdXJlTWVzc2FnZS5jb3VudGVyIC8gQ2xpcXpTZWN1cmVNZXNzYWdlLnRtdWx0KSAlICg2MCAqIDE1ICogMSkgPT09IDApIHtcbiAgICAgIGlmIChDbGlxelNlY3VyZU1lc3NhZ2UuZGVidWcpIHtcbiAgICAgICAgQ2xpcXpVdGlscy5sb2coJ0NsZWFuIGxvY2FsIHRlbXAgcXVldWUnLCBDbGlxelNlY3VyZU1lc3NhZ2UuTE9HX0tFWSk7XG4gICAgICB9XG4gICAgICBocG5VdGlscy5wcnVuZWxvY2FsVGVtcG9yYWxVbmlxKCk7XG4gICAgfVxuICB9LFxuICAvLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gIC8vIHRlbGVtZXRyeSwgUFJFRkVSIE5PVCBUTyBTSEFSRSBXSVRIIENsaXF6VXRpbHMgZm9yIHNhZmV0eSwgYmxhdGFudCByaXAtb2ZmIHRob3VnaFxuICAvLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gIHRyazogW10sXG4gIHRya1RpbWVyOiBudWxsLFxuICB0ZWxlbWV0cnk6IGZ1bmN0aW9uKG1zZywgaW5zdGFudFB1c2gpIHtcbiAgICBpZiAoIUNsaXF6U2VjdXJlTWVzc2FnZSB8fCAvLyBtaWdodCBiZSBjYWxsZWQgYWZ0ZXIgdGhlIG1vZHVsZSBnZXRzIHVubG9hZGVkXG4gICAgICAgIENsaXF6VXRpbHMuZ2V0UHJlZignZG50JywgZmFsc2UpIHx8XG4gICAgICAgIENsaXF6VXRpbHMuaXNQcml2YXRlKENsaXF6VXRpbHMuZ2V0V2luZG93KCkpKSByZXR1cm47XG5cbiAgICBpZiAobXNnKSBDbGlxelNlY3VyZU1lc3NhZ2UudHJrLnB1c2gobXNnKTtcbiAgICBDbGlxelV0aWxzLmNsZWFyVGltZW91dChDbGlxelNlY3VyZU1lc3NhZ2UudHJrVGltZXIpO1xuICAgIGlmIChpbnN0YW50UHVzaCB8fCBDbGlxelNlY3VyZU1lc3NhZ2UudHJrLmxlbmd0aCAlIDIwID09PSAwKSB7XG4gICAgICBDbGlxelNlY3VyZU1lc3NhZ2UucHVzaFRlbGVtZXRyeSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBDbGlxelNlY3VyZU1lc3NhZ2UudHJrVGltZXIgPSBDbGlxelV0aWxzLnNldFRpbWVvdXQoQ2xpcXpTZWN1cmVNZXNzYWdlLnB1c2hUZWxlbWV0cnksIDEwMDAwKTtcbiAgICB9XG4gIH0sXG4gIF90ZWxlbWV0cnlfcmVxOiBudWxsLFxuICBfdGVsZW1ldHJ5X3NlbmRpbmc6IFtdLFxuICB0ZWxlbWV0cnlfTUFYX1NJWkU6IDUwMCxcbiAgcHJldmlvdXNEYXRhUG9zdDogbnVsbCxcbiAgcHVzaE1lc3NhZ2UgOiBbXSxcbiAgcm91dGVIYXNoVGFibGU6IG51bGwsXG4gIGVhY2VtYWtlcklkOiBudWxsLFxuICBxdWVyeVByb3h5SVA6IG51bGwsXG4gIHBlcmZvcm1hbmNlOiBudWxsLFxuICBwdXNoVGVsZW1ldHJ5OiBmdW5jdGlvbigpIHtcbiAgICBDbGlxelNlY3VyZU1lc3NhZ2UuX3RlbGVtZXRyeV9zZW5kaW5nID0gQ2xpcXpTZWN1cmVNZXNzYWdlLnRyay5zcGxpY2UoMCk7XG4gICAgQ2xpcXpTZWN1cmVNZXNzYWdlLnB1c2hNZXNzYWdlID0gaHBuVXRpbHMudHJrR2VuKENsaXF6U2VjdXJlTWVzc2FnZS5fdGVsZW1ldHJ5X3NlbmRpbmcpO1xuICAgIGNvbnN0IG5leHRNc2cgPSBDbGlxelNlY3VyZU1lc3NhZ2UubmV4dE1lc3NhZ2UoKTtcbiAgICBpZiAobmV4dE1zZykge1xuICAgICAgcmV0dXJuIHNlbmRNKG5leHRNc2cpO1xuICAgIH1cbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKFtdKTtcbiAgfSxcbiAgbmV4dE1lc3NhZ2U6IGZ1bmN0aW9uKCkge1xuICAgIGlmIChDbGlxelNlY3VyZU1lc3NhZ2UuX3RlbGVtZXRyeV9zZW5kaW5nLmxlbmd0aCA+IDApIHtcbiAgICAgIHJldHVybiBDbGlxelNlY3VyZU1lc3NhZ2UuX3RlbGVtZXRyeV9zZW5kaW5nW0NsaXF6U2VjdXJlTWVzc2FnZS5wdXNoTWVzc2FnZS5uZXh0KCkudmFsdWVdO1xuICAgIH1cbiAgfSxcbiAgaW5pdEF0V2luZG93OiBmdW5jdGlvbih3aW5kb3cpIHtcbiAgfSxcbiAgaW5pdDogZnVuY3Rpb24oKSB7XG4gICAgLy8gRG9pbmcgaXQgaGVyZSwgYmVjYXVzZSB0aGlzIGxpYi4gdXNlcyBuYXZpZ2F0b3IgYW5kIHdpbmRvdyBvYmplY3RzLlxuICAgIC8vIEJldHRlciBtZXRob2QgYXBwcmljaWF0ZWQuXG5cbiAgICBpZiAoQ2xpcXpTZWN1cmVNZXNzYWdlLnBhY2VtYWtlcklkID09IG51bGwpIHtcbiAgICAgIENsaXF6U2VjdXJlTWVzc2FnZS5wYWNlbWFrZXJJZCA9IENsaXF6VXRpbHMuc2V0SW50ZXJ2YWwoQ2xpcXpTZWN1cmVNZXNzYWdlLnBhY2VtYWtlci5iaW5kKHRoaXMpLCBDbGlxelNlY3VyZU1lc3NhZ2UudHBhY2UsIG51bGwpO1xuICAgIH1cblxuICAgIC8vIFRPRE86IGRvIG5vdCBwYXNzIHRoaXMgdG8gc3RvcmFnZVxuICAgIHRoaXMuc3RvcmFnZSA9IG5ldyBTdG9yYWdlKHRoaXMpO1xuXG4gICAgaWYgKCFDbGlxelNlY3VyZU1lc3NhZ2UubG9jYWxUZW1wb3JhbFVuaXEpIHRoaXMuc3RvcmFnZS5sb2FkTG9jYWxDaGVja1RhYmxlKCk7XG5cbiAgICAvLyBMb2FkIHNvdXJjZSBtYXAuIFVwZGF0ZSBpdCBvbmNlIGFuIGhvdXIuXG4gICAgdGhpcy5zb3VyY2VNYXBMb2FkZXIgPSBuZXcgUmVzb3VyY2VMb2FkZXIoXG4gICAgICAgIFtcImhwblwiLFwic291cmNlbWFwLmpzb25cIl0sXG4gICAgICAgIHtcbiAgICAgICAgICByZW1vdGVVUkw6IENsaXF6U2VjdXJlTWVzc2FnZS5TT1VSQ0VfTUFQX1BST1ZJREVSXG4gICAgICAgIH1cbiAgICApO1xuXG4gICAgdGhpcy5zb3VyY2VNYXBMb2FkZXIubG9hZCgpLnRoZW4oIGUgPT4ge1xuICAgICAgQ2xpcXpTZWN1cmVNZXNzYWdlLnNvdXJjZU1hcCA9IGU7XG4gICAgfSlcblxuICAgIHRoaXMuc291cmNlTWFwTG9hZGVyLm9uVXBkYXRlKGUgPT4gQ2xpcXpTZWN1cmVNZXNzYWdlLnNvdXJjZU1hcCA9IGUpO1xuXG4gICAgLy8gTG9hZCBwcm94eSBsaXN0LiBVcGRhdGUgZXZlcnkgNSBtaW51dGVzLlxuICAgIHRoaXMucHJveHlMaXN0TG9hZGVyID0gbmV3IFJlc291cmNlTG9hZGVyKFxuICAgICAgICBbXCJocG5cIixcInByb3h5bGlzdC5qc29uXCJdLFxuICAgICAgICB7XG4gICAgICAgICAgcmVtb3RlVVJMOiBDbGlxelNlY3VyZU1lc3NhZ2UuUFJPWFlfTElTVF9QUk9WSURFUixcbiAgICAgICAgICBjcm9uOiAxICogNSAqIDYwICogMTAwMCxcbiAgICAgICAgICB1cGRhdGVJbnRlcnZhbDogMSAqIDUgKiA2MCAqIDEwMDAsXG4gICAgICAgIH1cbiAgICApO1xuXG4gICAgdGhpcy5wcm94eUxpc3RMb2FkZXIubG9hZCgpLnRoZW4oIGUgPT4ge1xuICAgICAgQ2xpcXpTZWN1cmVNZXNzYWdlLnByb3h5TGlzdCA9IGU7XG4gICAgfSlcblxuICAgIHRoaXMucHJveHlMaXN0TG9hZGVyLm9uVXBkYXRlKGUgPT4gQ2xpcXpTZWN1cmVNZXNzYWdlLnByb3h5TGlzdCA9IGUpO1xuXG4gICAgLy8gTG9hZCBsb29rdXB0YWJsZS4gVXBkYXRlIGV2ZXJ5IDUgbWludXRlcy5cbiAgICB0aGlzLnJvdXRlVGFibGVMb2FkZXIgPSBuZXcgUmVzb3VyY2VMb2FkZXIoXG4gICAgICAgIFtcImhwblwiLFwicm91dGVUYWJsZS5qc29uXCJdLFxuICAgICAgICB7XG4gICAgICAgICAgcmVtb3RlVVJMOiBDbGlxelNlY3VyZU1lc3NhZ2UuTE9PS1VQX1RBQkxFX1BST1ZJREVSLFxuICAgICAgICAgIGNyb246IDEgKiA1ICogNjAgKiAxMDAwLFxuICAgICAgICAgIHVwZGF0ZUludGVydmFsOiAxICogNSAqIDYwICogMTAwMCxcbiAgICAgICAgfVxuICAgICk7XG5cbiAgICB0aGlzLnJvdXRlVGFibGVMb2FkZXIubG9hZCgpLnRoZW4oIGUgPT4ge1xuICAgICAgQ2xpcXpTZWN1cmVNZXNzYWdlLnJvdXRlVGFibGUgPSBlO1xuICAgIH0pXG5cbiAgICB0aGlzLnJvdXRlVGFibGVMb2FkZXIub25VcGRhdGUoZSA9PiBDbGlxelNlY3VyZU1lc3NhZ2Uucm91dGVUYWJsZSA9IGUpO1xuXG4gICAgQ2xpcXpTZWN1cmVNZXNzYWdlLmRzUEsucHViS2V5QjY0ID0gY29uZmlnLnNldHRpbmdzLktFWV9EU19QVUJLRVk7XG4gICAgQ2xpcXpTZWN1cmVNZXNzYWdlLnNlY3VyZUxvZ2dlci5wdWJsaWNLZXlCNjQgPSBjb25maWcuc2V0dGluZ3MuS0VZX1NFQ1VSRV9MT0dHRVJfUFVCS0VZO1xuXG4gICAgaWYgKENsaXF6VXRpbHMuZ2V0UHJlZigncHJveHlOZXR3b3JrJywgdHJ1ZSkpIHtcbiAgICAgIG92ZXJSaWRlQ2xpcXpSZXN1bHRzKCk7XG4gICAgfVxuICAgIC8vIENoZWNrIHVzZXIta2V5IHByZXNlbnQgb3Igbm90LlxuICAgIENsaXF6U2VjdXJlTWVzc2FnZS5yZWdpc3RlclVzZXIoKTtcblxuICAgIC8vIFJlZ2lzdGVyIHByb3h5IGZyIHF1ZXJ5LlxuXG4gICAgQ2xpcXpTZWN1cmVNZXNzYWdlLnF1ZXJ5UHJveHlGaWx0ZXIgPSBuZXcgUHJveHlGaWx0ZXIoKTtcbiAgICBDbGlxelNlY3VyZU1lc3NhZ2UucXVlcnlQcm94eUZpbHRlci5pbml0KCk7XG4gIH0sXG4gIHVubG9hZDogZnVuY3Rpb24oKSB7XG4gICAgQ2xpcXpTZWN1cmVNZXNzYWdlLnF1ZXJ5UHJveHlGaWx0ZXIudW5sb2FkKCk7XG4gICAgdGhpcy5zdG9yYWdlLnNhdmVMb2NhbENoZWNrVGFibGUoKTtcbiAgICBDbGlxelNlY3VyZU1lc3NhZ2UucHVzaFRlbGVtZXRyeSgpO1xuICAgIHRoaXMuc291cmNlTWFwTG9hZGVyLnN0b3AoKTtcbiAgICB0aGlzLnByb3h5TGlzdExvYWRlci5zdG9wKCk7XG4gICAgdGhpcy5yb3V0ZVRhYmxlTG9hZGVyLnN0b3AoKTtcbiAgICBDbGlxelV0aWxzLmNsZWFyVGltZW91dChDbGlxelNlY3VyZU1lc3NhZ2UucGFjZW1ha2VySWQpO1xuICAgIHRoaXMuc3RvcmFnZS5jbG9zZSgpO1xuICB9LFxuICBwcm94eUlQOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCFDbGlxelNlY3VyZU1lc3NhZ2UucHJveHlMaXN0KSByZXR1cm47XG5cbiAgICBpZiAocHJveHlDb3VudGVyID49IENsaXF6U2VjdXJlTWVzc2FnZS5wcm94eUxpc3QubGVuZ3RoKSBwcm94eUNvdW50ZXIgPSAwO1xuICAgIGNvbnN0IHVybCA9IGhwblV0aWxzLmNyZWF0ZUh0dHBVcmwoQ2xpcXpTZWN1cmVNZXNzYWdlLnByb3h5TGlzdFtwcm94eUNvdW50ZXJdKTtcbiAgICBDbGlxelNlY3VyZU1lc3NhZ2UucXVlcnlQcm94eUlQID0gdXJsO1xuICAgIHByb3h5Q291bnRlciArPSAxO1xuICB9LFxuICByZWdpc3RlclVzZXI6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuc3RvcmFnZS5sb2FkS2V5cygpLnRoZW4odXNlcktleSA9PiB7XG4gICAgICBpZiAoIXVzZXJLZXkpIHtcbiAgICAgICAgY29uc3QgdXNlckNyeXB0byA9IG5ldyBDcnlwdG9Xb3JrZXIoKTtcblxuICAgICAgICB1c2VyQ3J5cHRvLm9ubWVzc2FnZSA9IChlKSA9PiB7XG4gICAgICAgICAgICBpZiAoZS5kYXRhLnN0YXR1cykge1xuICAgICAgICAgICAgICBjb25zdCB1SyA9IHt9O1xuICAgICAgICAgICAgICB1Sy5wcml2YXRlS2V5ID0gZS5kYXRhLnByaXZhdGVLZXk7XG4gICAgICAgICAgICAgIHVLLnB1YmxpY0tleSA9IGUuZGF0YS5wdWJsaWNLZXk7XG4gICAgICAgICAgICAgIHVLLnRzID0gRGF0ZS5ub3coKTtcbiAgICAgICAgICAgICAgdGhpcy5zdG9yYWdlLnNhdmVLZXlzKHVLKS50aGVuKCByZXNwb25zZSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLnN0YXR1cykge1xuICAgICAgICAgICAgICAgICAgQ2xpcXpTZWN1cmVNZXNzYWdlLnVQSy5wdWJsaWNLZXlCNjQgPSByZXNwb25zZS5kYXRhLnB1YmxpY0tleTtcbiAgICAgICAgICAgICAgICAgIENsaXF6U2VjdXJlTWVzc2FnZS51UEsucHJpdmF0ZUtleSA9IHJlc3BvbnNlLmRhdGEucHJpdmF0ZUtleTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdXNlckNyeXB0by50ZXJtaW5hdGUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHVzZXJDcnlwdG8ucG9zdE1lc3NhZ2Uoe1xuICAgICAgICAgIHR5cGU6ICd1c2VyLWtleSdcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBDbGlxelNlY3VyZU1lc3NhZ2UudVBLLnB1YmxpY0tleUI2NCA9IHVzZXJLZXkucHVibGljS2V5O1xuICAgICAgICBDbGlxelNlY3VyZU1lc3NhZ2UudVBLLnByaXZhdGVLZXkgPSB1c2VyS2V5LnByaXZhdGVLZXk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG59O1xuZXhwb3J0IGRlZmF1bHQgQ2xpcXpTZWN1cmVNZXNzYWdlO1xuIiwiZXhwb3J0IGRlZmF1bHQge1xuICBcInBsYXRmb3JtXCI6IFwiY2hyb21pdW1cIixcbiAgXCJicm9jZmlsZVwiOiBcIkJyb2NmaWxlLndlYmV4dGVuc2lvbmh3LmpzXCIsXG4gIFwiYmFzZVVSTFwiOiBcIi9tb2R1bGVzL1wiLFxuICBcInRlc3RzQmFzZVBhdGhcIjogXCJcIixcbiAgXCJzZXR0aW5nc1wiOiB7XG4gICAgXCJDT05GSUdfUFJPVklERVJcIjogXCJodHRwczovL3NhZmUtYnJvd3NpbmcuZ2hvc3RlcnkuY29tL2NvbmZpZ1wiLFxuICAgIFwiRU5EUE9JTlRfQkxJTkRfU0lHTkVSXCI6IFwiaHR0cHM6Ly9naG9zdGVyeS1zaWduLmdob3N0ZXJ5LmNvbS9zaWduXCIsXG4gICAgXCJFTkRQT0lOVF9VU0VSX1JFR1wiOiBcImh0dHBzOi8vZ2hvc3Rlcnktc2lnbi5naG9zdGVyeS5jb20vcmVnaXN0ZXJcIixcbiAgICBcIkVORFBPSU5UX1NPVVJDRV9NQVBfUFJPVklERVJcIjogXCJodHRwczovL2dob3N0ZXJ5LWNvbGxlY3Rvci5naG9zdGVyeS5jb20vc291cmNlbWFwanNvblwiLFxuICAgIFwiRU5EUE9JTlRfTE9PS1VQX1RBQkxFX1BST1ZJREVSXCI6IFwiaHR0cHM6Ly9naG9zdGVyeS1jb2xsZWN0b3IuZ2hvc3RlcnkuY29tL2xvb2t1cHRhYmxlXCIsXG4gICAgXCJFTkRQT0lOVF9LRVlTX1BST1ZJREVSXCI6IFwiaHR0cHM6Ly9naG9zdGVyeS1jb2xsZWN0b3IuZ2hvc3RlcnkuY29tL3NpZ25lcktleVwiLFxuICAgIFwiRU5EUE9JTlRfUFJPWFlfTElTVF9QUk9WSURFUlwiOiBcImh0dHBzOi8vZ2hvc3RlcnktY29sbGVjdG9yLmdob3N0ZXJ5LmNvbS9wcm94eUxpc3RcIixcbiAgICBcIkVORFBPSU5UX1BBVFRFUk5TVVJMXCI6IFwiaHR0cHM6Ly9zYWZlLWJyb3dzaW5nLmdob3N0ZXJ5LmNvbS9wYXR0ZXJuc1wiLFxuICAgIFwiRU5EUE9JTlRfQU5PTlBBVFRFUk5TVVJMXCI6IFwiaHR0cHM6Ly9zYWZlLWJyb3dzaW5nLmdob3N0ZXJ5LmNvbS9wYXR0ZXJucy1hbm9uXCIsXG4gICAgXCJFTkRQT0lOVF9DT05GSUdVUkxcIjogXCJodHRwczovL3NhZmUtYnJvd3NpbmcuZ2hvc3RlcnkuY29tL3RzLWNvbmZpZ1wiLFxuICAgIFwiRU5EUE9JTlRfU0FGRV9RVU9SVU1fRU5EUE9JTlRcIjogXCJodHRwczovL3NhZmUtYnJvd3NpbmctcXVvcnVtLmdob3N0ZXJ5LmNvbS9cIixcbiAgICBcIkVORFBPSU5UX1NBRkVfUVVPUlVNX1BST1ZJREVSXCI6IFwiaHR0cHM6Ly9zYWZlLWJyb3dzaW5nLXF1b3J1bS5naG9zdGVyeS5jb20vY29uZmlnXCIsXG4gICAgXCJNU0dDSEFOTkVMXCI6IFwid2ViLWV4dGVuc2lvblwiLFxuICAgIFwiS0VZX0RTX1BVQktFWVwiOiBcIk1JSUJJakFOQmdrcWhraUc5dzBCQVFFRkFBT0NBUThBTUlJQkNnS0NBUUVBd1hvNGhYdmJvS0hDZ2dOSjBVTkZ2WlFmRFdpMGpOY0Yxa0JIdGh4aWxNdTZMQi9oRnJTTVErL0ZnVHFWRTM2Y0NleldFMEsxVWN3bVlHVnN1cXhjdnFsODJSZkNtWVVWQnJvSjNVRkc4cW5ldFlmVTVGT2s0M0M1NTVwNWw1SHpsRjhRaWxjQ1VCQ080U0NqOWxFWjMvOEZKYm9DdXBUcXhFVXE3bndVZ2FOWk9pR0tNZERVQlpKTzF0VzRMU0g0bGo5SUFaY2NFSjVIS1ZtSktvcFEzaG16V2dEcW93eG5pNE5ReiswRG5zU2ZDR0F1cEthSkR4amZhakpvc1g1aTY3NHJnZEhiWkd0Z0hCM005amhjNkhGTlBjbXRVZ0x3Z3RVdFJ3TWhTbnlhNnEvTzA2ZXVvdU5pMWgwbTVlUnJXZU1SbEpTZFVuZWxMU1U4UU55N0xRSURBUUFCXCIsXG4gICAgXCJLRVlfU0VDVVJFX0xPR0dFUl9QVUJLRVlcIjogXCJNSUlDSWpBTkJna3Foa2lHOXcwQkFRRUZBQU9DQWc4QU1JSUNDZ0tDQWdFQWg1SGhjUkFuNis2d29YUVhsL050WitmT29vTmdsWmN0L0hTcFl1cWtjbXJQYXVIVzdFdU9TcTVidnBCWlJURFJPalIva1VQb21xVlpJenFoZENGUEE4QndYU0N6N2hBZWwyUTE1N3Z0QnZoOXNuZ01NTFhiNUZnemVmNU40RXVLTzhwTDVLclMrSTl0ZlphYzQxdkZKU2RwZ0FpclpZaGgrdGRjUVExejBRdi9SdzB6T1hqZnZkZEN6M2dFdjJnQjlLc0xNVm5UUzFKNFlPT2dmemEyYWRnOUViejF6OTlEaUY0dnRDd24wSVV3SC8zVG9UQndKTGJNbkMzT2w0M3lCTms4cmdLMm1rZ0NpNjE0dk9TRDNoblZtaW8raVc2K0FVa2xNOFZQbDZsN2hFSzljbGpKWSs5VXNNVm1UcnZhRmJNUHdTNkFkWkNYS1RtTmRhTUpjeTN6U09YdTV6dnppaG9RTHdBdTlMTTNsMmVWazBNdzBLN0pYT1AyMGZjOEJ0eldDT0xZVlAzMnI0UjBCTnVoVHR2R3FqSE5aSFBKTjVPd2F4a0xwbjJkdWpMOXVEV0dqUmlPSXRLTVZxL25PcW1OR2docmJmOElPYUtUN1ZRaHFPVTRjWFJrQi91RjFVallFVEJhdndVWkF4eDlXZC9jTWNBR21LaUR4aWdoeHhRMjlqRHVmbCsyV0cwNjV0bUp6K3pDeG1nclBoNlpiM0tGVXhQVGU2eWtzQWhXSmhtR1NoQTl2MjB0ODRNNWM2TnBaWG9Vc0ZjVmphNlh4ekhlU0I4ZFdxOVV1NVFjWjgzR3ovcm9ud2RFalQyT0dUdEJnT0ZlVERxTFlVZ3BoQzFnY1VFSE9DblROWFJNUU9YcUd3QmZaSHArTXE2MVFjTXEyck5TN3hFQ0F3RUFBUT09XCIsXG4gICAgXCJmcmFtZVNjcmlwdFdoaXRlbGlzdFwiOiBbXG4gICAgICBcImh0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9cIlxuICAgIF1cbiAgfSxcbiAgXCJwcmlvcml0eVwiOiBbXSxcbiAgXCJtb2R1bGVzXCI6IFtcbiAgICBcImNvcmVcIixcbiAgICBcImhwblwiXG4gIF0sXG4gIFwic3VicHJvamVjdHNcIjogW10sXG4gIFwiZW52aXJvbm1lbnRcIjogXCJkZXZlbG9wbWVudFwiLFxuICBcInNvdXJjZU1hcHNcIjogdHJ1ZSxcbiAgXCJFWFRFTlNJT05fVkVSU0lPTlwiOiBcIjEuMTYuMFwiXG59IiwiaW1wb3J0IGNvbmZpZyBmcm9tICcuLi9jb3JlL2NvbmZpZyc7XG5cbmNsYXNzIENyeXB0b1dvcmtlciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMud29ya2VyID0gbmV3IFdvcmtlcihgJHtjb25maWcuYmFzZVVSTH1ocG4vd29ya2VyLmJ1bmRsZS5qc2ApO1xuICB9XG5cbiAgc2V0IG9ubWVzc2FnZShmbikge1xuICAgIHRoaXMud29ya2VyLm9ubWVzc2FnZSA9IGZuO1xuICB9XG5cbiAgcG9zdE1lc3NhZ2UoLi4uYXJncykge1xuICAgIHRoaXMud29ya2VyLnBvc3RNZXNzYWdlKC4uLmFyZ3MpO1xuICB9XG5cbiAgdGVybWluYXRlKCkge1xuICAgIHRoaXMud29ya2VyLnRlcm1pbmF0ZSgpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IENyeXB0b1dvcmtlcjtcbiIsImltcG9ydCBDbGlxelV0aWxzIGZyb20gJy4uL2NvcmUvdXRpbHMnO1xuaW1wb3J0IGJhY2tncm91bmQgZnJvbSAnLi4vY29yZS9iYXNlL2JhY2tncm91bmQnO1xuaW1wb3J0IHsgaXNQbGF0Zm9ybUF0TGVhc3RJblZlcnNpb24gfSBmcm9tICcuLi9jb3JlL3BsYXRmb3JtJztcbmltcG9ydCBDbGlxelNlY3VyZU1lc3NhZ2UgZnJvbSAnLi9tYWluJztcbmltcG9ydCBDcnlwdG9Xb3JrZXIgZnJvbSAnLi9jcnlwdG8td29ya2VyJztcblxuLyoqXG4qIEBuYW1lc3BhY2UgaHBuXG4qIEBjbGFzcyBCYWNrZ3JvdW5kXG4qL1xuZXhwb3J0IGRlZmF1bHQgYmFja2dyb3VuZCh7XG4gIC8qKlxuICAqIEBtZXRob2QgaW5pdFxuICAqL1xuICBpbml0KCkge1xuICAgIGNvbnN0IEZGNDhfT1JfQUJPVkUgPSBpc1BsYXRmb3JtQXRMZWFzdEluVmVyc2lvbignNDguMCcpO1xuXG4gICAgaWYgKEZGNDhfT1JfQUJPVkUpIHtcbiAgICAgIC8vIFdlIG5lZWQgdG8gdXNlIHRoaXMgZnVuY3Rpb24sICdsb2FkJyBldmVudHMgZG8gbm90IHNlZW0gdG8gYmUgZmlyaW5nLi4uXG4gICAgICB0aGlzLmVuYWJsZWQgPSB0cnVlO1xuICAgICAgdGhpcy5DbGlxelNlY3VyZU1lc3NhZ2UgPSBDbGlxelNlY3VyZU1lc3NhZ2U7XG4gICAgICBDbGlxelNlY3VyZU1lc3NhZ2UuaW5pdCgpO1xuICAgICAgQ2xpcXpTZWN1cmVNZXNzYWdlLndDcnlwdG8gPSBuZXcgQ3J5cHRvV29ya2VyKCk7XG4gICAgICBDbGlxelNlY3VyZU1lc3NhZ2Uud0NyeXB0by5vbm1lc3NhZ2UgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICBpZiAoZS5kYXRhLnR5cGUgPT09ICdpbnN0YW50Jykge1xuICAgICAgICAgIGNvbnN0IGNhbGxiYWNrID0gQ2xpcXpTZWN1cmVNZXNzYWdlLnF1ZXJpZXNJRFtlLmRhdGEudWlkXTtcbiAgICAgICAgICBkZWxldGUgQ2xpcXpTZWN1cmVNZXNzYWdlLnF1ZXJpZXNJRFtlLmRhdGEudWlkXTtcbiAgICAgICAgICBjYWxsYmFjayAmJiBjYWxsYmFjayh7IHJlc3BvbnNlOiBlLmRhdGEucmVzIH0pO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cbiAgfSxcbiAgLyoqXG4gICogQG1ldGhvZCB1bmxvYWRcbiAgKi9cbiAgdW5sb2FkKCkge1xuICAgIGlmICh0aGlzLmVuYWJsZWQpIHtcbiAgICAgIENsaXF6U2VjdXJlTWVzc2FnZS53Q3J5cHRvLnRlcm1pbmF0ZSgpO1xuICAgICAgQ2xpcXpTZWN1cmVNZXNzYWdlLnVubG9hZCgpO1xuICAgIH1cbiAgfSxcblxuICBhY3Rpb25zOiB7XG4gICAgc2hhMShzKSB7XG4gICAgICBsZXQgcHJvbWlzZSA9IG5ldyBQcm9taXNlKCAocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGxldCB3Q3J5cHRvID0gbmV3IENyeXB0b1dvcmtlcigpO1xuXG4gICAgICAgIHdDcnlwdG8ub25tZXNzYWdlID0gZnVuY3Rpb24oZSl7XG4gICAgICAgICAgbGV0IHJlc3VsdCA9IGUuZGF0YS5yZXN1bHQ7XG4gICAgICAgICAgd0NyeXB0by50ZXJtaW5hdGUoKTtcbiAgICAgICAgICByZXNvbHZlKHJlc3VsdCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgd0NyeXB0by5wb3N0TWVzc2FnZSh7XG4gICAgICAgICAgXCJtc2dcIjogcyxcbiAgICAgICAgICBcInR5cGVcIjpcImh3LXNoYTFcIlxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgfSxcblxuICAgIHNlbmRUZWxlbWV0cnkobXNnKSB7XG4gICAgICByZXR1cm4gQ2xpcXpTZWN1cmVNZXNzYWdlLnRlbGVtZXRyeShtc2cpO1xuICAgIH0sXG5cbiAgICBzZW5kSW5zdGFudE1lc3NhZ2UocnAsIHBheWxvYWQpIHtcbiAgICAgIENsaXF6U2VjdXJlTWVzc2FnZS5wcm94eUlQKCk7XG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBjb25zdCB3Q3J5cHRvID0gbmV3IENyeXB0b1dvcmtlcigpO1xuXG4gICAgICAgIHdDcnlwdG8ub25tZXNzYWdlID0gZnVuY3Rpb24oZSl7XG4gICAgICAgICAgY29uc3QgcmVzdWx0ID0gSlNPTi5wYXJzZShlLmRhdGEucmVzKS5yZXN1bHQ7XG4gICAgICAgICAgd0NyeXB0by50ZXJtaW5hdGUoKTtcbiAgICAgICAgICByZXNvbHZlKHJlc3VsdCk7XG4gICAgICAgIH07XG4gICAgICAgIHdDcnlwdG8ucG9zdE1lc3NhZ2Uoe1xuICAgICAgICAgIG1zZzoge1xuICAgICAgICAgICAgYWN0aW9uOiAnaW5zdGFudCcsXG4gICAgICAgICAgICB0eXBlOiAnY2xpcXonLFxuICAgICAgICAgICAgdHM6ICcnLFxuICAgICAgICAgICAgdmVyOiAnMS41JyxcbiAgICAgICAgICAgIHBheWxvYWQ6IHBheWxvYWQsXG4gICAgICAgICAgICBycDogcnAsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB1aWQ6ICcnLFxuICAgICAgICAgIHR5cGU6ICdpbnN0YW50JyxcbiAgICAgICAgICBzb3VyY2VtYXA6IENsaXF6U2VjdXJlTWVzc2FnZS5zb3VyY2VNYXAsXG4gICAgICAgICAgdXBrOiBDbGlxelNlY3VyZU1lc3NhZ2UudVBLLFxuICAgICAgICAgIGRzcGs6IENsaXF6U2VjdXJlTWVzc2FnZS5kc1BLLFxuICAgICAgICAgIHNzcGs6IENsaXF6U2VjdXJlTWVzc2FnZS5zZWN1cmVMb2dnZXIsXG4gICAgICAgICAgcXVlcnlwcm94eWlwOiBDbGlxelNlY3VyZU1lc3NhZ2UucXVlcnlQcm94eUlQLFxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSxcbn0pO1xuIiwiaW1wb3J0IHV0aWxzIGZyb20gJy4uL2NvcmUvdXRpbHMnO1xuaW1wb3J0IGJhY2tncm91bmQgZnJvbSAnLi9iYWNrZ3JvdW5kJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3Mge1xuXG4gIGNvbnN0cnVjdG9yKHNldHRpbmdzKSB7XG4gICAgdGhpcy53aW5kb3cgPSBzZXR0aW5ncy53aW5kb3c7XG4gIH1cblxuICBpbml0KCkge1xuICAgIGlmIChiYWNrZ3JvdW5kLkNsaXF6U2VjdXJlTWVzc2FnZSkge1xuICAgICAgYmFja2dyb3VuZC5DbGlxelNlY3VyZU1lc3NhZ2UuaW5pdEF0V2luZG93KHRoaXMud2luZG93KTtcbiAgICB9XG4gIH1cblxuICB1bmxvYWQoKSB7XG4gIH1cblxuICBzdGF0dXMoKSB7XG4gICAgaWYgKGJhY2tncm91bmQuQ2xpcXpTZWN1cmVNZXNzYWdlICYmICF1dGlscy5nZXRQcmVmKCdjbGlxel9jb3JlX2Rpc2FibGVkJywgZmFsc2UpKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB2aXNpYmxlOiB0cnVlLFxuICAgICAgICBzdGF0ZTogdXRpbHMuZ2V0UHJlZignaHBuLXF1ZXJ5JyksXG4gICAgICB9O1xuICAgIH1cbiAgfVxufVxuIiwiaW1wb3J0IEJhY2tncm91bmQgZnJvbSAnLi9iYWNrZ3JvdW5kJztcbmltcG9ydCBXaW5kb3cgZnJvbSAnLi93aW5kb3cnO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIEJhY2tncm91bmQsXG4gIFdpbmRvdyxcbn07XG4iLCIvKiBnbG9iYWxzIHdpbmRvdyAqL1xuLy8gRklYTUU6IHN0b3AgdXNpbmcgdGhpcyBmaWxlIGFzIHNvb24gYXMgc3VicHJvamVjdCBjaHJvbWUtdGVzdC1ody1ocG4gaXMga2lsbGVkXG5pbXBvcnQgaHBuIGZyb20gJy4vaW5kZXgnO1xuXG53aW5kb3cuQ2xpcXpTZWN1cmVNZXNzYWdlID0ge1xuICBpbml0KCkge1xuICAgIHRoaXMuYmFja2dyb3VuZCA9IGhwbi5CYWNrZ3JvdW5kO1xuICAgIHRoaXMubG9hZGluZ1Byb21pc2UgPSB0aGlzLmJhY2tncm91bmQuaW5pdCgpO1xuICAgIHJldHVybiB0aGlzLmxvYWRpbmdQcm9taXNlO1xuICB9LFxuXG4gIHRlbGVtZXRyeShtc2cpIHtcbiAgICByZXR1cm4gdGhpcy5sb2FkaW5nUHJvbWlzZS50aGVuKFxuICAgICAgKCkgPT4gdGhpcy5iYWNrZ3JvdW5kLmFjdGlvbnMuc2VuZFRlbGVtZXRyeShtc2cpXG4gICAgKTtcbiAgfSxcbiAgc2hhMShtc2cpIHtcbiAgICByZXR1cm4gdGhpcy5sb2FkaW5nUHJvbWlzZS50aGVuKFxuICAgICgpID0+IHRoaXMuYmFja2dyb3VuZC5hY3Rpb25zLnNoYTEobXNnKVxuICAgICk7XG4gIH0sXG5cbiAgc2VuZEluc3RhbnRNZXNzYWdlKHJwLCBwYXlsb2FkKSB7XG4gICAgcmV0dXJuIHRoaXMubG9hZGluZ1Byb21pc2UudGhlbihcbiAgICAgICgpID0+IHRoaXMuYmFja2dyb3VuZC5hY3Rpb25zLnNlbmRJbnN0YW50TWVzc2FnZShycCwgcGF5bG9hZClcbiAgICApO1xuICB9XG59O1xuIl19