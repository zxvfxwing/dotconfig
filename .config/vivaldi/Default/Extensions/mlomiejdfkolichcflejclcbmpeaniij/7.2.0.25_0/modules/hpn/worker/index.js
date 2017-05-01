System.register(['./message-context', './crypto-utils', './user-pk', './blind-signature', '../../core/config'], function (_export) {

  // Global variables
  'use strict';

  var messageContext, sha1, userPK, parseDSKey, config, CliqzSecureMessage, localTemporalUniq;
  return {
    setters: [function (_messageContext) {
      messageContext = _messageContext['default'];
    }, function (_cryptoUtils) {
      sha1 = _cryptoUtils.sha1;
    }, function (_userPk) {
      userPK = _userPk['default'];
    }, function (_blindSignature) {
      parseDSKey = _blindSignature.parseDSKey;
    }, function (_coreConfig) {
      config = _coreConfig['default'];
    }],
    execute: function () {
      CliqzSecureMessage = {};
      localTemporalUniq = {};

      _export('localTemporalUniq', localTemporalUniq);

      CliqzSecureMessage.BLIND_SIGNER = config.settings.ENDPOINT_BLIND_SIGNER;
      CliqzSecureMessage.USER_REG = config.settings.ENDPOINT_USER_REG;

      self.onmessage = function (e) {
        var msgType = e.data.type;

        if (msgType === 'instant') {
          (function () {
            var msg = e.data.msg;
            var uid = e.data.uid;
            var response = {};
            CliqzSecureMessage.sourceMap = e.data.sourcemap;
            CliqzSecureMessage.uPK = e.data.upk;
            CliqzSecureMessage.queryProxyIP = e.data.queryproxyip;
            CliqzSecureMessage.dsPK = e.data.dspk;
            CliqzSecureMessage.secureLogger = e.data.sspk;

            var mc = new messageContext(msg);
            mc.query().then(function (result) {
              response.res = result;
              response.uid = uid;
              response.type = 'instant';
              postMessage(response);
            });
          })();
        }

        if (msgType === 'telemetry') {
          var _ret2 = (function () {
            var msg = e.data.msg;
            var response = {};
            response.type = 'telemetry';
            var mc = null;
            CliqzSecureMessage.sourceMap = e.data.sourcemap;
            CliqzSecureMessage.uPK = e.data.upk;
            CliqzSecureMessage.dsPK = e.data.dspk;
            CliqzSecureMessage.secureLogger = e.data.sspk;
            CliqzSecureMessage.routeTable = e.data.routetable;
            _export('localTemporalUniq', localTemporalUniq = e.data.localTemporalUniq);

            try {
              mc = new messageContext(msg);
            } catch (err) {
              response.localTemporalUniq = localTemporalUniq;
              postMessage(response);
              return {
                v: undefined
              };
            }

            parseDSKey().then(function (e) {
              mc.encryptedTelemetry().then(function (result) {
                response.localTemporalUniq = localTemporalUniq;
                postMessage(response);
              })['catch'](function (err) {
                response.localTemporalUniq = localTemporalUniq;
                postMessage(response);
              });
            });
          })();

          if (typeof _ret2 === 'object') return _ret2.v;
        }

        if (msgType === 'user-key') {
          var upk = new userPK();
          upk.generateKey().then(function (e) {
            postMessage(e);
          })['catch'](function (e) {
            return postMessage(e);
          });
        }

        if (msgType === 'test') {
          (function () {
            var msg = e.data.msg;
            var response = {};
            response.type = 'test';
            CliqzSecureMessage.sourceMap = e.data.sourcemap;
            CliqzSecureMessage.uPK = e.data.upk;
            CliqzSecureMessage.dsPK = e.data.dspk;
            CliqzSecureMessage.routeTable = e.data.routetable;
            _export('localTemporalUniq', localTemporalUniq = e.data.localTemporalUniq);

            var mc = new messageContext(msg);
            mc.getproxyCoordinator().then(function (e) {
              response.mc = mc;
              postMessage(response);
            });
          })();
        }

        if (msgType === 'test-sha1' || msgType === 'hw-sha1') {
          sha1(e.data.msg).then(function (result) {
            var response = {};
            response.result = result;
            postMessage(response);
          });
        }

        if (msgType === 'test-rsa-sign') {
          (function () {
            var msg = e.data.msg;
            var response = {};
            CliqzSecureMessage.uPK = { 'privateKey': e.data.upk };
            var uPK = new userPK(msg);

            uPK.sign(msg).then(function (result) {
              response.result = result;
              postMessage(response);
            })['catch'](function (err) {
              response.result = false;
              postMessage(response);
            });
          })();
        }

        if (msgType === 'test-rsa-verify') {
          (function () {
            var signature = e.data.sig;
            var msg = e.data.msg;
            var response = {};

            CliqzSecureMessage.uPK = { 'privateKey': e.data.upk };
            var uPK = new userPK(msg);

            uPK.verify(signature, msg).then(function (result) {
              response.result = result;
              postMessage(response);
            })['catch'](function (err) {
              response.result = false;
              postMessage(response);
            });
          })();
        }
      };

      _export('default', CliqzSecureMessage);
    }
  };
});
//# sourceMappingURL=data:application/json;base64,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O0FBQ2Ysc0JBQVEsQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0FBQ3pCLHlCQUFXLENBQUMsUUFBUSxDQUFDLENBQUM7YUFDdkIsQ0FBQyxTQUNJLENBQUUsVUFBQSxHQUFHLEVBQUk7QUFDYixzQkFBUSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7QUFDeEIseUJBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQzthQUN2QixDQUFDLENBQUM7O1NBQ047O0FBRUQsWUFBSyxPQUFPLEtBQUssaUJBQWlCLEVBQUU7O0FBQ2xDLGdCQUFNLFNBQVMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQztBQUM3QixnQkFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7QUFDdkIsZ0JBQU0sUUFBUSxHQUFHLEVBQUUsQ0FBQzs7QUFFcEIsOEJBQWtCLENBQUMsR0FBRyxHQUFHLEVBQUMsWUFBWSxFQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFDLENBQUM7QUFDckQsZ0JBQU0sR0FBRyxHQUFHLElBQUksTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDOztBQUU1QixlQUFHLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxHQUFHLENBQUMsQ0FDdkIsSUFBSSxDQUFFLFVBQUEsTUFBTSxFQUFJO0FBQ2Ysc0JBQVEsQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0FBQ3pCLHlCQUFXLENBQUMsUUFBUSxDQUFDLENBQUM7YUFDdkIsQ0FBQyxTQUNJLENBQUUsVUFBQSxHQUFHLEVBQUk7QUFDYixzQkFBUSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7QUFDeEIseUJBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQzthQUN2QixDQUFDLENBQUM7O1NBQ047T0FDRixDQUFDOzt5QkFFYSxrQkFBa0IiLCJmaWxlIjoiaHBuL3dvcmtlci9pbmRleC5lcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBtZXNzYWdlQ29udGV4dCBmcm9tICcuL21lc3NhZ2UtY29udGV4dCc7XG5pbXBvcnQgeyBzaGExIH0gZnJvbSAnLi9jcnlwdG8tdXRpbHMnO1xuaW1wb3J0IHVzZXJQSyBmcm9tICcuL3VzZXItcGsnO1xuaW1wb3J0IHsgcGFyc2VEU0tleSB9IGZyb20gJy4vYmxpbmQtc2lnbmF0dXJlJztcbmltcG9ydCBjb25maWcgZnJvbSAnLi4vLi4vY29yZS9jb25maWcnO1xuXG4vLyBHbG9iYWwgdmFyaWFibGVzXG5jb25zdCBDbGlxelNlY3VyZU1lc3NhZ2UgPSB7fTtcbmV4cG9ydCBsZXQgbG9jYWxUZW1wb3JhbFVuaXEgPSB7fTtcbkNsaXF6U2VjdXJlTWVzc2FnZS5CTElORF9TSUdORVIgPSBjb25maWcuc2V0dGluZ3MuRU5EUE9JTlRfQkxJTkRfU0lHTkVSO1xuQ2xpcXpTZWN1cmVNZXNzYWdlLlVTRVJfUkVHID0gY29uZmlnLnNldHRpbmdzLkVORFBPSU5UX1VTRVJfUkVHO1xuXG5zZWxmLm9ubWVzc2FnZSA9IGZ1bmN0aW9uKGUpIHtcbiAgY29uc3QgbXNnVHlwZSA9IGUuZGF0YS50eXBlO1xuXG4gIGlmKCBtc2dUeXBlID09PSAnaW5zdGFudCcgKSB7XG4gICAgY29uc3QgbXNnID0gZS5kYXRhLm1zZztcbiAgICBjb25zdCB1aWQgPSAgZS5kYXRhLnVpZDtcbiAgICBjb25zdCByZXNwb25zZSA9IHt9O1xuICAgIENsaXF6U2VjdXJlTWVzc2FnZS5zb3VyY2VNYXAgPSBlLmRhdGEuc291cmNlbWFwO1xuICAgIENsaXF6U2VjdXJlTWVzc2FnZS51UEsgPSBlLmRhdGEudXBrO1xuICAgIENsaXF6U2VjdXJlTWVzc2FnZS5xdWVyeVByb3h5SVAgPSBlLmRhdGEucXVlcnlwcm94eWlwO1xuICAgIENsaXF6U2VjdXJlTWVzc2FnZS5kc1BLID0gZS5kYXRhLmRzcGs7XG4gICAgQ2xpcXpTZWN1cmVNZXNzYWdlLnNlY3VyZUxvZ2dlciA9IGUuZGF0YS5zc3BrO1xuXG4gICAgY29uc3QgbWMgPSBuZXcgbWVzc2FnZUNvbnRleHQobXNnKTtcbiAgICBtYy5xdWVyeSgpLnRoZW4oIHJlc3VsdCA9PiB7XG4gICAgICByZXNwb25zZS5yZXMgPSByZXN1bHQ7XG4gICAgICByZXNwb25zZS51aWQgPSB1aWQ7XG4gICAgICByZXNwb25zZS50eXBlID0gJ2luc3RhbnQnO1xuICAgICAgcG9zdE1lc3NhZ2UocmVzcG9uc2UpO1xuICAgIH0pO1xuICB9XG5cbiAgaWYgKG1zZ1R5cGUgPT09ICd0ZWxlbWV0cnknKSB7XG4gICAgY29uc3QgbXNnID0gZS5kYXRhLm1zZztcbiAgICBjb25zdCByZXNwb25zZSA9IHt9O1xuICAgIHJlc3BvbnNlLnR5cGUgPSAndGVsZW1ldHJ5JztcbiAgICBsZXQgbWMgPSBudWxsO1xuICAgIENsaXF6U2VjdXJlTWVzc2FnZS5zb3VyY2VNYXAgPSBlLmRhdGEuc291cmNlbWFwO1xuICAgIENsaXF6U2VjdXJlTWVzc2FnZS51UEsgPSBlLmRhdGEudXBrO1xuICAgIENsaXF6U2VjdXJlTWVzc2FnZS5kc1BLID0gZS5kYXRhLmRzcGs7XG4gICAgQ2xpcXpTZWN1cmVNZXNzYWdlLnNlY3VyZUxvZ2dlciA9IGUuZGF0YS5zc3BrO1xuICAgIENsaXF6U2VjdXJlTWVzc2FnZS5yb3V0ZVRhYmxlID0gZS5kYXRhLnJvdXRldGFibGU7XG4gICAgbG9jYWxUZW1wb3JhbFVuaXEgPSBlLmRhdGEubG9jYWxUZW1wb3JhbFVuaXE7XG5cbiAgICB0cnkge1xuICAgICAgbWMgPSBuZXcgbWVzc2FnZUNvbnRleHQobXNnKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgcmVzcG9uc2UubG9jYWxUZW1wb3JhbFVuaXEgPSBsb2NhbFRlbXBvcmFsVW5pcTtcbiAgICAgICAgcG9zdE1lc3NhZ2UocmVzcG9uc2UpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgcGFyc2VEU0tleSgpLnRoZW4oIGUgPT4ge1xuICAgICAgbWMuZW5jcnlwdGVkVGVsZW1ldHJ5KCkudGhlbiggcmVzdWx0ID0+IHtcbiAgICAgICAgcmVzcG9uc2UubG9jYWxUZW1wb3JhbFVuaXEgPSBsb2NhbFRlbXBvcmFsVW5pcTtcbiAgICAgICAgcG9zdE1lc3NhZ2UocmVzcG9uc2UpO1xuICAgICAgfSkuY2F0Y2goIGVyciA9PiB7XG4gICAgICAgIHJlc3BvbnNlLmxvY2FsVGVtcG9yYWxVbmlxID0gbG9jYWxUZW1wb3JhbFVuaXE7XG4gICAgICAgIHBvc3RNZXNzYWdlKHJlc3BvbnNlKTtcbiAgICAgIH0pO1xuICAgIH0pXG4gIH1cblxuICBpZiAobXNnVHlwZSA9PT0gJ3VzZXIta2V5Jykge1xuICAgIGNvbnN0IHVwayA9IG5ldyB1c2VyUEsoKTtcbiAgICB1cGsuZ2VuZXJhdGVLZXkoKS50aGVuKCBlID0+IHtcbiAgICAgIHBvc3RNZXNzYWdlKGUpO1xuICAgIH0pLmNhdGNoKCBlID0+IHBvc3RNZXNzYWdlKGUpKTtcbiAgfVxuXG4gIGlmIChtc2dUeXBlID09PSAndGVzdCcpIHtcbiAgICBjb25zdCBtc2cgPSBlLmRhdGEubXNnO1xuICAgIGNvbnN0IHJlc3BvbnNlID0ge307XG4gICAgcmVzcG9uc2UudHlwZSA9ICd0ZXN0JztcbiAgICBDbGlxelNlY3VyZU1lc3NhZ2Uuc291cmNlTWFwID0gZS5kYXRhLnNvdXJjZW1hcDtcbiAgICBDbGlxelNlY3VyZU1lc3NhZ2UudVBLID0gZS5kYXRhLnVwaztcbiAgICBDbGlxelNlY3VyZU1lc3NhZ2UuZHNQSyA9IGUuZGF0YS5kc3BrO1xuICAgIENsaXF6U2VjdXJlTWVzc2FnZS5yb3V0ZVRhYmxlID0gZS5kYXRhLnJvdXRldGFibGU7XG4gICAgbG9jYWxUZW1wb3JhbFVuaXEgPSBlLmRhdGEubG9jYWxUZW1wb3JhbFVuaXE7XG5cbiAgICBjb25zdCBtYyA9IG5ldyBtZXNzYWdlQ29udGV4dChtc2cpO1xuICAgIG1jLmdldHByb3h5Q29vcmRpbmF0b3IoKVxuICAgICAgLnRoZW4oIGUgPT4ge1xuICAgICAgICByZXNwb25zZS5tYyA9IG1jO1xuICAgICAgICBwb3N0TWVzc2FnZShyZXNwb25zZSk7XG4gICAgICB9KTtcbiAgfVxuXG4gIGlmIChtc2dUeXBlID09PSAndGVzdC1zaGExJyB8fCBtc2dUeXBlID09PSAnaHctc2hhMScpIHtcbiAgICBzaGExKGUuZGF0YS5tc2cpXG4gICAgICAudGhlbiggcmVzdWx0ID0+IHtcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSB7fTtcbiAgICAgICAgcmVzcG9uc2UucmVzdWx0ID0gcmVzdWx0O1xuICAgICAgICBwb3N0TWVzc2FnZShyZXNwb25zZSk7XG4gICAgICB9KTtcbiAgfVxuXG4gIGlmIChtc2dUeXBlID09PSAndGVzdC1yc2Etc2lnbicpIHtcbiAgICBjb25zdCBtc2cgPSBlLmRhdGEubXNnO1xuICAgIGNvbnN0IHJlc3BvbnNlID0ge307XG4gICAgQ2xpcXpTZWN1cmVNZXNzYWdlLnVQSyA9IHsncHJpdmF0ZUtleScgOiBlLmRhdGEudXBrfTtcbiAgICBjb25zdCB1UEsgPSBuZXcgdXNlclBLKG1zZyk7XG5cbiAgICB1UEsuc2lnbihtc2cpXG4gICAgICAudGhlbiggcmVzdWx0ID0+IHtcbiAgICAgICAgcmVzcG9uc2UucmVzdWx0ID0gcmVzdWx0O1xuICAgICAgICBwb3N0TWVzc2FnZShyZXNwb25zZSk7XG4gICAgICB9KVxuICAgICAgLmNhdGNoKCBlcnIgPT4ge1xuICAgICAgICByZXNwb25zZS5yZXN1bHQgPSBmYWxzZTtcbiAgICAgICAgcG9zdE1lc3NhZ2UocmVzcG9uc2UpO1xuICAgICAgfSk7XG4gIH1cblxuICBpZiAoIG1zZ1R5cGUgPT09ICd0ZXN0LXJzYS12ZXJpZnknICl7XG4gICAgY29uc3Qgc2lnbmF0dXJlID0gZS5kYXRhLnNpZztcbiAgICBjb25zdCBtc2cgPSBlLmRhdGEubXNnO1xuICAgIGNvbnN0IHJlc3BvbnNlID0ge307XG5cbiAgICBDbGlxelNlY3VyZU1lc3NhZ2UudVBLID0geydwcml2YXRlS2V5JyA6IGUuZGF0YS51cGt9O1xuICAgIGNvbnN0IHVQSyA9IG5ldyB1c2VyUEsobXNnKTtcblxuICAgIHVQSy52ZXJpZnkoc2lnbmF0dXJlLCBtc2cpXG4gICAgICAudGhlbiggcmVzdWx0ID0+IHtcbiAgICAgICAgcmVzcG9uc2UucmVzdWx0ID0gcmVzdWx0O1xuICAgICAgICBwb3N0TWVzc2FnZShyZXNwb25zZSk7XG4gICAgICB9KVxuICAgICAgLmNhdGNoKCBlcnIgPT4ge1xuICAgICAgICByZXNwb25zZS5yZXN1bHQgPSBmYWxzZTtcbiAgICAgICAgcG9zdE1lc3NhZ2UocmVzcG9uc2UpO1xuICAgICAgfSk7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IENsaXF6U2VjdXJlTWVzc2FnZTtcbiJdfQ==