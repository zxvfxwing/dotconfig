System.register(['../core/utils', '../core/base/background', '../core/platform', './main', './crypto-worker'], function (_export) {

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
//# sourceMappingURL=data:application/json;base64,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QyxXQUFXLENBQUM7QUFDbEIsbUJBQUcsRUFBRTtBQUNILHdCQUFNLEVBQUUsU0FBUztBQUNqQixzQkFBSSxFQUFFLE9BQU87QUFDYixvQkFBRSxFQUFFLEVBQUU7QUFDTixxQkFBRyxFQUFFLEtBQUs7QUFDVix5QkFBTyxFQUFFLE9BQU87QUFDaEIsb0JBQUUsRUFBRSxFQUFFO2lCQUNQO0FBQ0QsbUJBQUcsRUFBRSxFQUFFO0FBQ1Asb0JBQUksRUFBRSxTQUFTO0FBQ2YseUJBQVMsRUFBRSxrQkFBa0IsQ0FBQyxTQUFTO0FBQ3ZDLG1CQUFHLEVBQUUsa0JBQWtCLENBQUMsR0FBRztBQUMzQixvQkFBSSxFQUFFLGtCQUFrQixDQUFDLElBQUk7QUFDN0Isb0JBQUksRUFBRSxrQkFBa0IsQ0FBQyxZQUFZO0FBQ3JDLDRCQUFZLEVBQUUsa0JBQWtCLENBQUMsWUFBWTtlQUM5QyxDQUFDLENBQUM7YUFDSixDQUFDLENBQUM7V0FDSjtTQUNGO09BQ0YsQ0FBQyIsImZpbGUiOiJocG4vYmFja2dyb3VuZC5lcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBDbGlxelV0aWxzIGZyb20gJy4uL2NvcmUvdXRpbHMnO1xuaW1wb3J0IGJhY2tncm91bmQgZnJvbSAnLi4vY29yZS9iYXNlL2JhY2tncm91bmQnO1xuaW1wb3J0IHsgaXNQbGF0Zm9ybUF0TGVhc3RJblZlcnNpb24gfSBmcm9tICcuLi9jb3JlL3BsYXRmb3JtJztcbmltcG9ydCBDbGlxelNlY3VyZU1lc3NhZ2UgZnJvbSAnLi9tYWluJztcbmltcG9ydCBDcnlwdG9Xb3JrZXIgZnJvbSAnLi9jcnlwdG8td29ya2VyJztcblxuLyoqXG4qIEBuYW1lc3BhY2UgaHBuXG4qIEBjbGFzcyBCYWNrZ3JvdW5kXG4qL1xuZXhwb3J0IGRlZmF1bHQgYmFja2dyb3VuZCh7XG4gIC8qKlxuICAqIEBtZXRob2QgaW5pdFxuICAqL1xuICBpbml0KCkge1xuICAgIGNvbnN0IEZGNDhfT1JfQUJPVkUgPSBpc1BsYXRmb3JtQXRMZWFzdEluVmVyc2lvbignNDguMCcpO1xuXG4gICAgaWYgKEZGNDhfT1JfQUJPVkUpIHtcbiAgICAgIC8vIFdlIG5lZWQgdG8gdXNlIHRoaXMgZnVuY3Rpb24sICdsb2FkJyBldmVudHMgZG8gbm90IHNlZW0gdG8gYmUgZmlyaW5nLi4uXG4gICAgICB0aGlzLmVuYWJsZWQgPSB0cnVlO1xuICAgICAgdGhpcy5DbGlxelNlY3VyZU1lc3NhZ2UgPSBDbGlxelNlY3VyZU1lc3NhZ2U7XG4gICAgICBDbGlxelNlY3VyZU1lc3NhZ2UuaW5pdCgpO1xuICAgICAgQ2xpcXpTZWN1cmVNZXNzYWdlLndDcnlwdG8gPSBuZXcgQ3J5cHRvV29ya2VyKCk7XG4gICAgICBDbGlxelNlY3VyZU1lc3NhZ2Uud0NyeXB0by5vbm1lc3NhZ2UgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICBpZiAoZS5kYXRhLnR5cGUgPT09ICdpbnN0YW50Jykge1xuICAgICAgICAgIGNvbnN0IGNhbGxiYWNrID0gQ2xpcXpTZWN1cmVNZXNzYWdlLnF1ZXJpZXNJRFtlLmRhdGEudWlkXTtcbiAgICAgICAgICBkZWxldGUgQ2xpcXpTZWN1cmVNZXNzYWdlLnF1ZXJpZXNJRFtlLmRhdGEudWlkXTtcbiAgICAgICAgICBjYWxsYmFjayAmJiBjYWxsYmFjayh7IHJlc3BvbnNlOiBlLmRhdGEucmVzIH0pO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cbiAgfSxcbiAgLyoqXG4gICogQG1ldGhvZCB1bmxvYWRcbiAgKi9cbiAgdW5sb2FkKCkge1xuICAgIGlmICh0aGlzLmVuYWJsZWQpIHtcbiAgICAgIENsaXF6U2VjdXJlTWVzc2FnZS53Q3J5cHRvLnRlcm1pbmF0ZSgpO1xuICAgICAgQ2xpcXpTZWN1cmVNZXNzYWdlLnVubG9hZCgpO1xuICAgIH1cbiAgfSxcblxuICBhY3Rpb25zOiB7XG4gICAgc2hhMShzKSB7XG4gICAgICBsZXQgcHJvbWlzZSA9IG5ldyBQcm9taXNlKCAocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGxldCB3Q3J5cHRvID0gbmV3IENyeXB0b1dvcmtlcigpO1xuXG4gICAgICAgIHdDcnlwdG8ub25tZXNzYWdlID0gZnVuY3Rpb24oZSl7XG4gICAgICAgICAgbGV0IHJlc3VsdCA9IGUuZGF0YS5yZXN1bHQ7XG4gICAgICAgICAgd0NyeXB0by50ZXJtaW5hdGUoKTtcbiAgICAgICAgICByZXNvbHZlKHJlc3VsdCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgd0NyeXB0by5wb3N0TWVzc2FnZSh7XG4gICAgICAgICAgXCJtc2dcIjogcyxcbiAgICAgICAgICBcInR5cGVcIjpcImh3LXNoYTFcIlxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgfSxcblxuICAgIHNlbmRUZWxlbWV0cnkobXNnKSB7XG4gICAgICByZXR1cm4gQ2xpcXpTZWN1cmVNZXNzYWdlLnRlbGVtZXRyeShtc2cpO1xuICAgIH0sXG5cbiAgICBzZW5kSW5zdGFudE1lc3NhZ2UocnAsIHBheWxvYWQpIHtcbiAgICAgIENsaXF6U2VjdXJlTWVzc2FnZS5wcm94eUlQKCk7XG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBjb25zdCB3Q3J5cHRvID0gbmV3IENyeXB0b1dvcmtlcigpO1xuXG4gICAgICAgIHdDcnlwdG8ub25tZXNzYWdlID0gZnVuY3Rpb24oZSl7XG4gICAgICAgICAgY29uc3QgcmVzdWx0ID0gSlNPTi5wYXJzZShlLmRhdGEucmVzKS5yZXN1bHQ7XG4gICAgICAgICAgd0NyeXB0by50ZXJtaW5hdGUoKTtcbiAgICAgICAgICByZXNvbHZlKHJlc3VsdCk7XG4gICAgICAgIH07XG4gICAgICAgIHdDcnlwdG8ucG9zdE1lc3NhZ2Uoe1xuICAgICAgICAgIG1zZzoge1xuICAgICAgICAgICAgYWN0aW9uOiAnaW5zdGFudCcsXG4gICAgICAgICAgICB0eXBlOiAnY2xpcXonLFxuICAgICAgICAgICAgdHM6ICcnLFxuICAgICAgICAgICAgdmVyOiAnMS41JyxcbiAgICAgICAgICAgIHBheWxvYWQ6IHBheWxvYWQsXG4gICAgICAgICAgICBycDogcnAsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB1aWQ6ICcnLFxuICAgICAgICAgIHR5cGU6ICdpbnN0YW50JyxcbiAgICAgICAgICBzb3VyY2VtYXA6IENsaXF6U2VjdXJlTWVzc2FnZS5zb3VyY2VNYXAsXG4gICAgICAgICAgdXBrOiBDbGlxelNlY3VyZU1lc3NhZ2UudVBLLFxuICAgICAgICAgIGRzcGs6IENsaXF6U2VjdXJlTWVzc2FnZS5kc1BLLFxuICAgICAgICAgIHNzcGs6IENsaXF6U2VjdXJlTWVzc2FnZS5zZWN1cmVMb2dnZXIsXG4gICAgICAgICAgcXVlcnlwcm94eWlwOiBDbGlxelNlY3VyZU1lc3NhZ2UucXVlcnlQcm94eUlQLFxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSxcbn0pO1xuIl19