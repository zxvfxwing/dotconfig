System.register(['../platform/hpn/storage', '../core/utils', '../core/config', '../core/resource-loader', './send-message', './utils', './http-handler-patch', './proxy-filter', './crypto-worker'], function (_export) {
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
//# sourceMappingURL=data:application/json;base64,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RUFBRSxHQUFHLEVBQUUsQ0FBQztBQUNkLHNCQUFFLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDO0FBQ2xDLHNCQUFFLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDO0FBQ2hDLHNCQUFFLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUNuQiwwQkFBSyxPQUFPLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBRSxVQUFBLFFBQVEsRUFBSTtBQUMxQywwQkFBSSxRQUFRLENBQUMsTUFBTSxFQUFFO0FBQ25CLDBDQUFrQixDQUFDLEdBQUcsQ0FBQyxZQUFZLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUM7QUFDOUQsMENBQWtCLENBQUMsR0FBRyxDQUFDLFVBQVUsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQzt1QkFDOUQ7cUJBQ0YsQ0FBQyxDQUFDO21CQUNKO0FBQ0QsNEJBQVUsQ0FBQyxTQUFTLEVBQUUsQ0FBQztpQkFDMUIsQ0FBQTs7QUFFRCwwQkFBVSxDQUFDLFdBQVcsQ0FBQztBQUNyQixzQkFBSSxFQUFFLFVBQVU7aUJBQ2pCLENBQUMsQ0FBQzs7YUFDSixNQUFNO0FBQ0wsZ0NBQWtCLENBQUMsR0FBRyxDQUFDLFlBQVksR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDO0FBQ3hELGdDQUFrQixDQUFDLEdBQUcsQ0FBQyxVQUFVLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQzthQUN4RDtXQUNGLENBQUMsQ0FBQztTQUNKO09BQ0Y7O3lCQUNjLGtCQUFrQiIsImZpbGUiOiJocG4vbWFpbi5lcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gVGhpcyBtb2R1bGUgaXMgdXNlZCBmb3Igc2VuZGluZyB0aGUgZXZlbnRzIGZvciBwdXJwb3NlIG9mXG4gaHVtYW4td2ViLCBhbnRpLXRyYWNraW5nIHZpYSBhIHNlY3VyZSBjaGFubmVsLlxuKi9cblxuaW1wb3J0IFN0b3JhZ2UgZnJvbSAnLi4vcGxhdGZvcm0vaHBuL3N0b3JhZ2UnO1xuaW1wb3J0IENsaXF6VXRpbHMgZnJvbSAnLi4vY29yZS91dGlscyc7XG5pbXBvcnQgY29uZmlnIGZyb20gJy4uL2NvcmUvY29uZmlnJztcbmltcG9ydCBSZXNvdXJjZUxvYWRlciBmcm9tICcuLi9jb3JlL3Jlc291cmNlLWxvYWRlcic7XG5pbXBvcnQgeyBzZW5kTSB9IGZyb20gJy4vc2VuZC1tZXNzYWdlJztcbmltcG9ydCAqIGFzIGhwblV0aWxzIGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHsgb3ZlclJpZGVDbGlxelJlc3VsdHMgfSBmcm9tICcuL2h0dHAtaGFuZGxlci1wYXRjaCc7XG5pbXBvcnQgUHJveHlGaWx0ZXIgZnJvbSAnLi9wcm94eS1maWx0ZXInO1xuaW1wb3J0IENyeXB0b1dvcmtlciBmcm9tICcuL2NyeXB0by13b3JrZXInO1xuXG4vKiBHbG9iYWwgdmFyaWFibGVzXG4qL1xubGV0IHByb3h5Q291bnRlciA9IDA7XG5cbmNvbnN0IENsaXF6U2VjdXJlTWVzc2FnZSA9IHtcbiAgVkVSU0lPTjogJzAuMScsXG4gIExPR19LRVk6ICdzZWN1cmVtZXNzYWdlJyxcbiAgZGVidWc6IGZhbHNlLFxuICBjb3VudGVyOiAwLFxuICBzZWN1cmVMb2dnZXI6IHt9LFxuICB1UEs6IHt9LFxuICBkc1BLOiB7fSxcbiAgcm91dGVUYWJsZTogbnVsbCxcbiAgcm91dGVUYWJsZUxvYWRlcjogbnVsbCxcbiAgUlNBS2V5OiAnJyxcbiAgZXZlbnRJRDoge30sXG4gIHNvdXJjZU1hcDogbnVsbCxcbiAgc291cmNlTWFwTG9hZGVyOiBudWxsLFxuICB0bXVsdDogNCxcbiAgdHBhY2U6IDI1MCxcbiAgU09VUkNFX01BUF9QUk9WSURFUjogY29uZmlnLnNldHRpbmdzLkVORFBPSU5UX1NPVVJDRV9NQVBfUFJPVklERVIsXG4gIExPT0tVUF9UQUJMRV9QUk9WSURFUjogY29uZmlnLnNldHRpbmdzLkVORFBPSU5UX0xPT0tVUF9UQUJMRV9QUk9WSURFUixcbiAgS0VZU19QUk9WSURFUjogY29uZmlnLnNldHRpbmdzLkVORFBPSU5UX0tFWVNfUFJPVklERVIsXG4gIHByb3h5TGlzdDogbnVsbCxcbiAgcHJveHlMaXN0TG9hZGVyOiBudWxsLFxuICBwcm94eVN0YXRzOiB7fSxcbiAgUFJPWFlfTElTVF9QUk9WSURFUjogY29uZmlnLnNldHRpbmdzLkVORFBPSU5UX1BST1hZX0xJU1RfUFJPVklERVIsXG4gIEJMSU5EX1NJR05FUjogY29uZmlnLnNldHRpbmdzLkVORFBPSU5UX0JMSU5EX1NJR05FUixcbiAgVVNFUl9SRUc6IGNvbmZpZy5zZXR0aW5ncy5FTkRQT0lOVF9VU0VSX1JFRyxcbiAgbG9jYWxUZW1wb3JhbFVuaXE6IG51bGwsXG4gIHdDcnlwdG86IG51bGwsXG4gIHF1ZXJpZXNJRDoge30sXG4gIHNlcnZpY2VzVG9Qcm94eSA6IFtcImFwaS5jbGlxei5jb21cIiwgXCJhbnRpcGhpc2hpbmcuY2xpcXouY29tXCJdLFxuICBwcm94eUluZm9PYmo6IHt9LFxuICBxdWVyeVByb3h5RmlsdGVyOiBudWxsLFxuICBwYWNlbWFrZXI6IGZ1bmN0aW9uICgpIHtcbiAgICBDbGlxelNlY3VyZU1lc3NhZ2UuY291bnRlciArPSAxO1xuXG4gICAgaWYgKChDbGlxelNlY3VyZU1lc3NhZ2UuY291bnRlciAvIENsaXF6U2VjdXJlTWVzc2FnZS50bXVsdCkgJSAxMCA9PT0gMCkge1xuICAgICAgaWYgKENsaXF6U2VjdXJlTWVzc2FnZS5kZWJ1Zykge1xuICAgICAgICBDbGlxelV0aWxzLmxvZygnUGFjZW1ha2VyOiAnICsgQ2xpcXpTZWN1cmVNZXNzYWdlLmNvdW50ZXIgLyBDbGlxelNlY3VyZU1lc3NhZ2UudG11bHQsIENsaXF6U2VjdXJlTWVzc2FnZS5MT0dfS0VZKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoKENsaXF6U2VjdXJlTWVzc2FnZS5jb3VudGVyIC8gQ2xpcXpTZWN1cmVNZXNzYWdlLnRtdWx0KSAlIDUgPT09IDApIHtcbiAgICAgIGNvbnN0IGN1cnJlbnRUaW1lID0gRGF0ZS5ub3coKTtcblxuXG4gICAgICBpZiAoIUNsaXF6VXRpbHMuZ2V0V2luZG93KCkgfHwgIUNsaXF6VXRpbHMuZ2V0V2luZG93KCkuQ0xJUVogfHwgIUNsaXF6VXRpbHMuZ2V0V2luZG93KCkuQ0xJUVouVUkpIHJldHVybjtcbiAgICAgIGNvbnN0IHREaWZmID0gY3VycmVudFRpbWUgLSBDbGlxelV0aWxzLmdldFdpbmRvdygpLkNMSVFaLlVJLmxhc3RJbnB1dFRpbWU7XG5cbiAgICAgIGlmICh0RGlmZiA+IDAgJiYgdERpZmYgPiAoMTAwMCAqIDIgKiAxKSkge1xuICAgICAgICBDbGlxelNlY3VyZU1lc3NhZ2UucHJveHlJUCgpO1xuICAgICAgfVxuXG4gICAgICBpZiAoKCFDbGlxelNlY3VyZU1lc3NhZ2UudVBLLnB1YmxpY0tleUI2NCkgfHwgKCFDbGlxelNlY3VyZU1lc3NhZ2UudVBLLnByaXZhdGVLZXkpKSB7XG4gICAgICAgIENsaXF6U2VjdXJlTWVzc2FnZS5yZWdpc3RlclVzZXIoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoKENsaXF6U2VjdXJlTWVzc2FnZS5jb3VudGVyIC8gQ2xpcXpTZWN1cmVNZXNzYWdlLnRtdWx0KSAlICg2MCAqIDE1ICogMSkgPT09IDApIHtcbiAgICAgIGlmIChDbGlxelNlY3VyZU1lc3NhZ2UuZGVidWcpIHtcbiAgICAgICAgQ2xpcXpVdGlscy5sb2coJ0NsZWFuIGxvY2FsIHRlbXAgcXVldWUnLCBDbGlxelNlY3VyZU1lc3NhZ2UuTE9HX0tFWSk7XG4gICAgICB9XG4gICAgICBocG5VdGlscy5wcnVuZWxvY2FsVGVtcG9yYWxVbmlxKCk7XG4gICAgfVxuICB9LFxuICAvLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gIC8vIHRlbGVtZXRyeSwgUFJFRkVSIE5PVCBUTyBTSEFSRSBXSVRIIENsaXF6VXRpbHMgZm9yIHNhZmV0eSwgYmxhdGFudCByaXAtb2ZmIHRob3VnaFxuICAvLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gIHRyazogW10sXG4gIHRya1RpbWVyOiBudWxsLFxuICB0ZWxlbWV0cnk6IGZ1bmN0aW9uKG1zZywgaW5zdGFudFB1c2gpIHtcbiAgICBpZiAoIUNsaXF6U2VjdXJlTWVzc2FnZSB8fCAvLyBtaWdodCBiZSBjYWxsZWQgYWZ0ZXIgdGhlIG1vZHVsZSBnZXRzIHVubG9hZGVkXG4gICAgICAgIENsaXF6VXRpbHMuZ2V0UHJlZignZG50JywgZmFsc2UpIHx8XG4gICAgICAgIENsaXF6VXRpbHMuaXNQcml2YXRlKENsaXF6VXRpbHMuZ2V0V2luZG93KCkpKSByZXR1cm47XG5cbiAgICBpZiAobXNnKSBDbGlxelNlY3VyZU1lc3NhZ2UudHJrLnB1c2gobXNnKTtcbiAgICBDbGlxelV0aWxzLmNsZWFyVGltZW91dChDbGlxelNlY3VyZU1lc3NhZ2UudHJrVGltZXIpO1xuICAgIGlmIChpbnN0YW50UHVzaCB8fCBDbGlxelNlY3VyZU1lc3NhZ2UudHJrLmxlbmd0aCAlIDIwID09PSAwKSB7XG4gICAgICBDbGlxelNlY3VyZU1lc3NhZ2UucHVzaFRlbGVtZXRyeSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBDbGlxelNlY3VyZU1lc3NhZ2UudHJrVGltZXIgPSBDbGlxelV0aWxzLnNldFRpbWVvdXQoQ2xpcXpTZWN1cmVNZXNzYWdlLnB1c2hUZWxlbWV0cnksIDEwMDAwKTtcbiAgICB9XG4gIH0sXG4gIF90ZWxlbWV0cnlfcmVxOiBudWxsLFxuICBfdGVsZW1ldHJ5X3NlbmRpbmc6IFtdLFxuICB0ZWxlbWV0cnlfTUFYX1NJWkU6IDUwMCxcbiAgcHJldmlvdXNEYXRhUG9zdDogbnVsbCxcbiAgcHVzaE1lc3NhZ2UgOiBbXSxcbiAgcm91dGVIYXNoVGFibGU6IG51bGwsXG4gIGVhY2VtYWtlcklkOiBudWxsLFxuICBxdWVyeVByb3h5SVA6IG51bGwsXG4gIHBlcmZvcm1hbmNlOiBudWxsLFxuICBwdXNoVGVsZW1ldHJ5OiBmdW5jdGlvbigpIHtcbiAgICBDbGlxelNlY3VyZU1lc3NhZ2UuX3RlbGVtZXRyeV9zZW5kaW5nID0gQ2xpcXpTZWN1cmVNZXNzYWdlLnRyay5zcGxpY2UoMCk7XG4gICAgQ2xpcXpTZWN1cmVNZXNzYWdlLnB1c2hNZXNzYWdlID0gaHBuVXRpbHMudHJrR2VuKENsaXF6U2VjdXJlTWVzc2FnZS5fdGVsZW1ldHJ5X3NlbmRpbmcpO1xuICAgIGNvbnN0IG5leHRNc2cgPSBDbGlxelNlY3VyZU1lc3NhZ2UubmV4dE1lc3NhZ2UoKTtcbiAgICBpZiAobmV4dE1zZykge1xuICAgICAgcmV0dXJuIHNlbmRNKG5leHRNc2cpO1xuICAgIH1cbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKFtdKTtcbiAgfSxcbiAgbmV4dE1lc3NhZ2U6IGZ1bmN0aW9uKCkge1xuICAgIGlmIChDbGlxelNlY3VyZU1lc3NhZ2UuX3RlbGVtZXRyeV9zZW5kaW5nLmxlbmd0aCA+IDApIHtcbiAgICAgIHJldHVybiBDbGlxelNlY3VyZU1lc3NhZ2UuX3RlbGVtZXRyeV9zZW5kaW5nW0NsaXF6U2VjdXJlTWVzc2FnZS5wdXNoTWVzc2FnZS5uZXh0KCkudmFsdWVdO1xuICAgIH1cbiAgfSxcbiAgaW5pdEF0V2luZG93OiBmdW5jdGlvbih3aW5kb3cpIHtcbiAgfSxcbiAgaW5pdDogZnVuY3Rpb24oKSB7XG4gICAgLy8gRG9pbmcgaXQgaGVyZSwgYmVjYXVzZSB0aGlzIGxpYi4gdXNlcyBuYXZpZ2F0b3IgYW5kIHdpbmRvdyBvYmplY3RzLlxuICAgIC8vIEJldHRlciBtZXRob2QgYXBwcmljaWF0ZWQuXG5cbiAgICBpZiAoQ2xpcXpTZWN1cmVNZXNzYWdlLnBhY2VtYWtlcklkID09IG51bGwpIHtcbiAgICAgIENsaXF6U2VjdXJlTWVzc2FnZS5wYWNlbWFrZXJJZCA9IENsaXF6VXRpbHMuc2V0SW50ZXJ2YWwoQ2xpcXpTZWN1cmVNZXNzYWdlLnBhY2VtYWtlci5iaW5kKHRoaXMpLCBDbGlxelNlY3VyZU1lc3NhZ2UudHBhY2UsIG51bGwpO1xuICAgIH1cblxuICAgIC8vIFRPRE86IGRvIG5vdCBwYXNzIHRoaXMgdG8gc3RvcmFnZVxuICAgIHRoaXMuc3RvcmFnZSA9IG5ldyBTdG9yYWdlKHRoaXMpO1xuXG4gICAgaWYgKCFDbGlxelNlY3VyZU1lc3NhZ2UubG9jYWxUZW1wb3JhbFVuaXEpIHRoaXMuc3RvcmFnZS5sb2FkTG9jYWxDaGVja1RhYmxlKCk7XG5cbiAgICAvLyBMb2FkIHNvdXJjZSBtYXAuIFVwZGF0ZSBpdCBvbmNlIGFuIGhvdXIuXG4gICAgdGhpcy5zb3VyY2VNYXBMb2FkZXIgPSBuZXcgUmVzb3VyY2VMb2FkZXIoXG4gICAgICAgIFtcImhwblwiLFwic291cmNlbWFwLmpzb25cIl0sXG4gICAgICAgIHtcbiAgICAgICAgICByZW1vdGVVUkw6IENsaXF6U2VjdXJlTWVzc2FnZS5TT1VSQ0VfTUFQX1BST1ZJREVSXG4gICAgICAgIH1cbiAgICApO1xuXG4gICAgdGhpcy5zb3VyY2VNYXBMb2FkZXIubG9hZCgpLnRoZW4oIGUgPT4ge1xuICAgICAgQ2xpcXpTZWN1cmVNZXNzYWdlLnNvdXJjZU1hcCA9IGU7XG4gICAgfSlcblxuICAgIHRoaXMuc291cmNlTWFwTG9hZGVyLm9uVXBkYXRlKGUgPT4gQ2xpcXpTZWN1cmVNZXNzYWdlLnNvdXJjZU1hcCA9IGUpO1xuXG4gICAgLy8gTG9hZCBwcm94eSBsaXN0LiBVcGRhdGUgZXZlcnkgNSBtaW51dGVzLlxuICAgIHRoaXMucHJveHlMaXN0TG9hZGVyID0gbmV3IFJlc291cmNlTG9hZGVyKFxuICAgICAgICBbXCJocG5cIixcInByb3h5bGlzdC5qc29uXCJdLFxuICAgICAgICB7XG4gICAgICAgICAgcmVtb3RlVVJMOiBDbGlxelNlY3VyZU1lc3NhZ2UuUFJPWFlfTElTVF9QUk9WSURFUixcbiAgICAgICAgICBjcm9uOiAxICogNSAqIDYwICogMTAwMCxcbiAgICAgICAgICB1cGRhdGVJbnRlcnZhbDogMSAqIDUgKiA2MCAqIDEwMDAsXG4gICAgICAgIH1cbiAgICApO1xuXG4gICAgdGhpcy5wcm94eUxpc3RMb2FkZXIubG9hZCgpLnRoZW4oIGUgPT4ge1xuICAgICAgQ2xpcXpTZWN1cmVNZXNzYWdlLnByb3h5TGlzdCA9IGU7XG4gICAgfSlcblxuICAgIHRoaXMucHJveHlMaXN0TG9hZGVyLm9uVXBkYXRlKGUgPT4gQ2xpcXpTZWN1cmVNZXNzYWdlLnByb3h5TGlzdCA9IGUpO1xuXG4gICAgLy8gTG9hZCBsb29rdXB0YWJsZS4gVXBkYXRlIGV2ZXJ5IDUgbWludXRlcy5cbiAgICB0aGlzLnJvdXRlVGFibGVMb2FkZXIgPSBuZXcgUmVzb3VyY2VMb2FkZXIoXG4gICAgICAgIFtcImhwblwiLFwicm91dGVUYWJsZS5qc29uXCJdLFxuICAgICAgICB7XG4gICAgICAgICAgcmVtb3RlVVJMOiBDbGlxelNlY3VyZU1lc3NhZ2UuTE9PS1VQX1RBQkxFX1BST1ZJREVSLFxuICAgICAgICAgIGNyb246IDEgKiA1ICogNjAgKiAxMDAwLFxuICAgICAgICAgIHVwZGF0ZUludGVydmFsOiAxICogNSAqIDYwICogMTAwMCxcbiAgICAgICAgfVxuICAgICk7XG5cbiAgICB0aGlzLnJvdXRlVGFibGVMb2FkZXIubG9hZCgpLnRoZW4oIGUgPT4ge1xuICAgICAgQ2xpcXpTZWN1cmVNZXNzYWdlLnJvdXRlVGFibGUgPSBlO1xuICAgIH0pXG5cbiAgICB0aGlzLnJvdXRlVGFibGVMb2FkZXIub25VcGRhdGUoZSA9PiBDbGlxelNlY3VyZU1lc3NhZ2Uucm91dGVUYWJsZSA9IGUpO1xuXG4gICAgQ2xpcXpTZWN1cmVNZXNzYWdlLmRzUEsucHViS2V5QjY0ID0gY29uZmlnLnNldHRpbmdzLktFWV9EU19QVUJLRVk7XG4gICAgQ2xpcXpTZWN1cmVNZXNzYWdlLnNlY3VyZUxvZ2dlci5wdWJsaWNLZXlCNjQgPSBjb25maWcuc2V0dGluZ3MuS0VZX1NFQ1VSRV9MT0dHRVJfUFVCS0VZO1xuXG4gICAgaWYgKENsaXF6VXRpbHMuZ2V0UHJlZigncHJveHlOZXR3b3JrJywgdHJ1ZSkpIHtcbiAgICAgIG92ZXJSaWRlQ2xpcXpSZXN1bHRzKCk7XG4gICAgfVxuICAgIC8vIENoZWNrIHVzZXIta2V5IHByZXNlbnQgb3Igbm90LlxuICAgIENsaXF6U2VjdXJlTWVzc2FnZS5yZWdpc3RlclVzZXIoKTtcblxuICAgIC8vIFJlZ2lzdGVyIHByb3h5IGZyIHF1ZXJ5LlxuXG4gICAgQ2xpcXpTZWN1cmVNZXNzYWdlLnF1ZXJ5UHJveHlGaWx0ZXIgPSBuZXcgUHJveHlGaWx0ZXIoKTtcbiAgICBDbGlxelNlY3VyZU1lc3NhZ2UucXVlcnlQcm94eUZpbHRlci5pbml0KCk7XG4gIH0sXG4gIHVubG9hZDogZnVuY3Rpb24oKSB7XG4gICAgQ2xpcXpTZWN1cmVNZXNzYWdlLnF1ZXJ5UHJveHlGaWx0ZXIudW5sb2FkKCk7XG4gICAgdGhpcy5zdG9yYWdlLnNhdmVMb2NhbENoZWNrVGFibGUoKTtcbiAgICBDbGlxelNlY3VyZU1lc3NhZ2UucHVzaFRlbGVtZXRyeSgpO1xuICAgIHRoaXMuc291cmNlTWFwTG9hZGVyLnN0b3AoKTtcbiAgICB0aGlzLnByb3h5TGlzdExvYWRlci5zdG9wKCk7XG4gICAgdGhpcy5yb3V0ZVRhYmxlTG9hZGVyLnN0b3AoKTtcbiAgICBDbGlxelV0aWxzLmNsZWFyVGltZW91dChDbGlxelNlY3VyZU1lc3NhZ2UucGFjZW1ha2VySWQpO1xuICAgIHRoaXMuc3RvcmFnZS5jbG9zZSgpO1xuICB9LFxuICBwcm94eUlQOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCFDbGlxelNlY3VyZU1lc3NhZ2UucHJveHlMaXN0KSByZXR1cm47XG5cbiAgICBpZiAocHJveHlDb3VudGVyID49IENsaXF6U2VjdXJlTWVzc2FnZS5wcm94eUxpc3QubGVuZ3RoKSBwcm94eUNvdW50ZXIgPSAwO1xuICAgIGNvbnN0IHVybCA9IGhwblV0aWxzLmNyZWF0ZUh0dHBVcmwoQ2xpcXpTZWN1cmVNZXNzYWdlLnByb3h5TGlzdFtwcm94eUNvdW50ZXJdKTtcbiAgICBDbGlxelNlY3VyZU1lc3NhZ2UucXVlcnlQcm94eUlQID0gdXJsO1xuICAgIHByb3h5Q291bnRlciArPSAxO1xuICB9LFxuICByZWdpc3RlclVzZXI6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuc3RvcmFnZS5sb2FkS2V5cygpLnRoZW4odXNlcktleSA9PiB7XG4gICAgICBpZiAoIXVzZXJLZXkpIHtcbiAgICAgICAgY29uc3QgdXNlckNyeXB0byA9IG5ldyBDcnlwdG9Xb3JrZXIoKTtcblxuICAgICAgICB1c2VyQ3J5cHRvLm9ubWVzc2FnZSA9IChlKSA9PiB7XG4gICAgICAgICAgICBpZiAoZS5kYXRhLnN0YXR1cykge1xuICAgICAgICAgICAgICBjb25zdCB1SyA9IHt9O1xuICAgICAgICAgICAgICB1Sy5wcml2YXRlS2V5ID0gZS5kYXRhLnByaXZhdGVLZXk7XG4gICAgICAgICAgICAgIHVLLnB1YmxpY0tleSA9IGUuZGF0YS5wdWJsaWNLZXk7XG4gICAgICAgICAgICAgIHVLLnRzID0gRGF0ZS5ub3coKTtcbiAgICAgICAgICAgICAgdGhpcy5zdG9yYWdlLnNhdmVLZXlzKHVLKS50aGVuKCByZXNwb25zZSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLnN0YXR1cykge1xuICAgICAgICAgICAgICAgICAgQ2xpcXpTZWN1cmVNZXNzYWdlLnVQSy5wdWJsaWNLZXlCNjQgPSByZXNwb25zZS5kYXRhLnB1YmxpY0tleTtcbiAgICAgICAgICAgICAgICAgIENsaXF6U2VjdXJlTWVzc2FnZS51UEsucHJpdmF0ZUtleSA9IHJlc3BvbnNlLmRhdGEucHJpdmF0ZUtleTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdXNlckNyeXB0by50ZXJtaW5hdGUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHVzZXJDcnlwdG8ucG9zdE1lc3NhZ2Uoe1xuICAgICAgICAgIHR5cGU6ICd1c2VyLWtleSdcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBDbGlxelNlY3VyZU1lc3NhZ2UudVBLLnB1YmxpY0tleUI2NCA9IHVzZXJLZXkucHVibGljS2V5O1xuICAgICAgICBDbGlxelNlY3VyZU1lc3NhZ2UudVBLLnByaXZhdGVLZXkgPSB1c2VyS2V5LnByaXZhdGVLZXk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG59O1xuZXhwb3J0IGRlZmF1bHQgQ2xpcXpTZWN1cmVNZXNzYWdlO1xuIl19