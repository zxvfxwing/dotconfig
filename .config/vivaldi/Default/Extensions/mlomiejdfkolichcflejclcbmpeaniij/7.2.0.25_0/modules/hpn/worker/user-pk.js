System.register(['./index', './pkcs-conversion', './crypto-utils', './http-worker'], function (_export) {
  'use strict';

  var CliqzSecureMessage, privateKeytoKeypair, exportPrivateKey, exportPublicKey, stringToByteArray, byteArrayToHexString, hexStringToByteArray, base64ToByteArray, _http, _default;

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  return {
    setters: [function (_index) {
      CliqzSecureMessage = _index['default'];
    }, function (_pkcsConversion) {
      privateKeytoKeypair = _pkcsConversion.privateKeytoKeypair;
      exportPrivateKey = _pkcsConversion.exportPrivateKey;
      exportPublicKey = _pkcsConversion.exportPublicKey;
    }, function (_cryptoUtils) {
      stringToByteArray = _cryptoUtils.stringToByteArray;
      byteArrayToHexString = _cryptoUtils.byteArrayToHexString;
      hexStringToByteArray = _cryptoUtils.hexStringToByteArray;
      base64ToByteArray = _cryptoUtils.base64ToByteArray;
    }, function (_httpWorker) {
      _http = _httpWorker['default'];
    }],
    execute: function () {
      _default = (function () {
        function _default(msg) {
          _classCallCheck(this, _default);

          this.privateKey = "";
          this.publicKey = "";
        }

        /**
         * Method to sign the str using userSK.
         * @returns signature in hex format.
         */

        _createClass(_default, [{
          key: 'sign',
          value: function sign(msg) {
            var promise = new Promise(function (resolve, reject) {
              var ppk = privateKeytoKeypair(CliqzSecureMessage.uPK.privateKey);
              crypto.subtle.importKey("pkcs8", base64ToByteArray(ppk[1]), { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["sign"]).then(function (privateKey) {
                var documentBytes = stringToByteArray(msg);
                crypto.subtle.sign({ name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, privateKey, documentBytes).then(function (signatureBuffer) {
                  var signatureBytes = new Uint8Array(signatureBuffer);
                  var signatureHex = byteArrayToHexString(signatureBytes);
                  resolve(signatureHex);
                })['catch'](function (err) {
                  return reject(err);
                });
              })['catch'](function (err) {
                return reject(err);
              });
            });
            return promise;
          }
        }, {
          key: 'verify',
          value: function verify(sig, msg) {
            var promise = new Promise(function (resolve, reject) {
              var ppk = privateKeytoKeypair(CliqzSecureMessage.uPK.privateKey);
              crypto.subtle.importKey("spki", base64ToByteArray(ppk[0]), { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["verify"]).then(function (publicKey) {
                var signatureBytes = hexStringToByteArray(sig);
                var documentBytes = stringToByteArray(msg);
                crypto.subtle.verify({ name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, publicKey, signatureBytes, documentBytes).then(function (validSignature) {
                  resolve(validSignature);
                })['catch'](function (err) {
                  return console.log(err);
                });
              });
            });
            return promise;
          }
        }, {
          key: 'generateKey',
          value: function generateKey() {
            var _this = this;
            var promise = new Promise(function (resolve, reject) {
              crypto.subtle.generateKey({
                name: "RSASSA-PKCS1-v1_5",
                modulusLength: 2048,
                publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
                hash: { name: "SHA-256" }
              }, true, ["sign", "verify"]).then(function (key) {
                return crypto.subtle.exportKey("jwk", key.privateKey);
              }).then(function (key) {
                var return_data = {};
                return_data["privKeyB64"] = exportPrivateKey(key);
                return_data["publicKeyB64"] = exportPublicKey(key);
                _this.privateKey = return_data["privKeyB64"];
                _this.publicKey = return_data["publicKeyB64"];
                return return_data;
              }).then(function (keys) {
                return _http(CliqzSecureMessage.USER_REG).post(JSON.stringify({ "pk": keys["publicKeyB64"] }));
              }).then(function (e) {
                return resolve({ "status": true, "privateKey": _this.privateKey, "publicKey": _this.publicKey });
              })['catch'](function (e) {
                return reject({ "status": e.message });
              });
            });
            return promise;
          }
        }]);

        return _default;
      })();

      _export('default', _default);

      ;
    }
  };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImhwbi93b3JrZXIvdXNlci1way5lcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OzRDQUVFLG1CQUFtQjt5Q0FDbkIsZ0JBQWdCO3dDQUNoQixlQUFlOzt1Q0FHZixpQkFBaUI7MENBQ2pCLG9CQUFvQjswQ0FDcEIsb0JBQW9CO3VDQUNwQixpQkFBaUI7Ozs7OztBQUtOLDBCQUFDLEdBQUcsRUFBRTs7O0FBQ2YsY0FBSSxDQUFDLFVBQVUsR0FBRyxFQUFFLENBQUM7QUFDckIsY0FBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7U0FDckI7Ozs7Ozs7OztpQkFNRyxjQUFDLEdBQUcsRUFBQztBQUNQLGdCQUFJLE9BQU8sR0FBRyxJQUFJLE9BQU8sQ0FBQyxVQUFTLE9BQU8sRUFBRSxNQUFNLEVBQUM7QUFDakQsa0JBQUksR0FBRyxHQUFHLG1CQUFtQixDQUFDLGtCQUFrQixDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNqRSxvQkFBTSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQ3JCLE9BQU8sRUFDUCxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDekIsRUFBQyxJQUFJLEVBQUUsbUJBQW1CLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBQyxFQUM1QyxLQUFLLEVBQ0wsQ0FBQyxNQUFNLENBQUMsQ0FDVCxDQUNBLElBQUksQ0FBQyxVQUFTLFVBQVUsRUFBRTtBQUN6QixvQkFBSSxhQUFhLEdBQUcsaUJBQWlCLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDM0Msc0JBQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUNoQixFQUFDLElBQUksRUFBRSxtQkFBbUIsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFDLEVBQzVDLFVBQVUsRUFDVixhQUFhLENBQ2QsQ0FDQSxJQUFJLENBQUMsVUFBUyxlQUFlLEVBQUU7QUFDOUIsc0JBQUksY0FBYyxHQUFHLElBQUksVUFBVSxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQ3JELHNCQUFJLFlBQVksR0FBRyxvQkFBb0IsQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUN4RCx5QkFBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO2lCQUN2QixDQUFDLFNBQU0sQ0FBRSxVQUFBLEdBQUc7eUJBQUksTUFBTSxDQUFDLEdBQUcsQ0FBQztpQkFBQSxDQUFDLENBQUM7ZUFDL0IsQ0FBQyxTQUFNLENBQUMsVUFBQSxHQUFHO3VCQUFJLE1BQU0sQ0FBQyxHQUFHLENBQUM7ZUFBQSxDQUFDLENBQUM7YUFDOUIsQ0FBQyxDQUFDO0FBQ0gsbUJBQU8sT0FBTyxDQUFDO1dBQ2hCOzs7aUJBRUssZ0JBQUMsR0FBRyxFQUFFLEdBQUcsRUFBQztBQUNkLGdCQUFJLE9BQU8sR0FBRyxJQUFJLE9BQU8sQ0FBQyxVQUFTLE9BQU8sRUFBRSxNQUFNLEVBQUM7QUFDakQsa0JBQUksR0FBRyxHQUFHLG1CQUFtQixDQUFDLGtCQUFrQixDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNqRSxvQkFBTSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQ3JCLE1BQU0sRUFDTixpQkFBaUIsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDekIsRUFBQyxJQUFJLEVBQUUsbUJBQW1CLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBQyxFQUM1QyxLQUFLLEVBQ0wsQ0FBQyxRQUFRLENBQUMsQ0FDWCxDQUNBLElBQUksQ0FBQyxVQUFTLFNBQVMsRUFBRTtBQUN4QixvQkFBSSxjQUFjLEdBQUcsb0JBQW9CLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDL0Msb0JBQUksYUFBYSxHQUFHLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQzNDLHNCQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FDbEIsRUFBQyxJQUFJLEVBQUUsbUJBQW1CLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBQyxFQUM1QyxTQUFTLEVBQ1QsY0FBYyxFQUNkLGFBQWEsQ0FDZCxDQUNBLElBQUksQ0FBQyxVQUFTLGNBQWMsRUFBRTtBQUM3Qix5QkFBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDO2lCQUN6QixDQUFDLFNBQU0sQ0FBRSxVQUFBLEdBQUc7eUJBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7aUJBQUEsQ0FBQyxDQUFDO2VBQ3BDLENBQUMsQ0FBQzthQUNKLENBQUMsQ0FBQztBQUNILG1CQUFPLE9BQU8sQ0FBQztXQUNoQjs7O2lCQUVVLHVCQUFHO0FBQ1osZ0JBQUksS0FBSyxHQUFHLElBQUksQ0FBQztBQUNqQixnQkFBSSxPQUFPLEdBQUcsSUFBSSxPQUFPLENBQUMsVUFBUyxPQUFPLEVBQUUsTUFBTSxFQUFDO0FBQ2pELG9CQUFNLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FDdEI7QUFDRyxvQkFBSSxFQUFFLG1CQUFtQjtBQUN6Qiw2QkFBYSxFQUFFLElBQUk7QUFDbkIsOEJBQWMsRUFBRSxJQUFJLFVBQVUsQ0FBQyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDbEQsb0JBQUksRUFBRSxFQUFDLElBQUksRUFBRSxTQUFTLEVBQUM7ZUFDekIsRUFDQSxJQUFJLEVBQ0wsQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQ3BCLENBQUMsSUFBSSxDQUFFLFVBQUEsR0FBRyxFQUFJO0FBQ2IsdUJBQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQTtlQUN0RCxDQUFDLENBQUMsSUFBSSxDQUFFLFVBQUEsR0FBRyxFQUFJO0FBQ2Isb0JBQUksV0FBVyxHQUFHLEVBQUUsQ0FBQTtBQUNwQiwyQkFBVyxDQUFDLFlBQVksQ0FBQyxHQUFHLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2xELDJCQUFXLENBQUMsY0FBYyxDQUFDLEdBQUcsZUFBZSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ25ELHFCQUFLLENBQUMsVUFBVSxHQUFHLFdBQVcsQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUM3QyxxQkFBSyxDQUFDLFNBQVMsR0FBRyxXQUFXLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDOUMsdUJBQU8sV0FBVyxDQUFDO2VBQ3JCLENBQUMsQ0FBQyxJQUFJLENBQUUsVUFBQSxJQUFJLEVBQUk7QUFDZCx1QkFBTyxLQUFLLENBQUMsa0JBQWtCLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBQyxJQUFJLEVBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDO2VBQzlGLENBQUMsQ0FBQyxJQUFJLENBQUUsVUFBQSxDQUFDO3VCQUFJLE9BQU8sQ0FBQyxFQUFDLFFBQVEsRUFBQyxJQUFJLEVBQUMsWUFBWSxFQUFDLEtBQUssQ0FBQyxVQUFVLEVBQUMsV0FBVyxFQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUMsQ0FBQztlQUFBLENBQUMsU0FDM0YsQ0FBRSxVQUFBLENBQUM7dUJBQUksTUFBTSxDQUFDLEVBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxPQUFPLEVBQUMsQ0FBQztlQUFBLENBQUMsQ0FBQzthQUM3QyxDQUFDLENBQUM7QUFDSCxtQkFBTyxPQUFPLENBQUM7V0FDaEI7Ozs7Ozs7O0FBQ0YsT0FBQyIsImZpbGUiOiJocG4vd29ya2VyL3VzZXItcGsuZXMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQ2xpcXpTZWN1cmVNZXNzYWdlIGZyb20gJy4vaW5kZXgnO1xuaW1wb3J0IHtcbiAgcHJpdmF0ZUtleXRvS2V5cGFpcixcbiAgZXhwb3J0UHJpdmF0ZUtleSxcbiAgZXhwb3J0UHVibGljS2V5LFxufSBmcm9tICcuL3BrY3MtY29udmVyc2lvbic7XG5pbXBvcnQge1xuICBzdHJpbmdUb0J5dGVBcnJheSxcbiAgYnl0ZUFycmF5VG9IZXhTdHJpbmcsXG4gIGhleFN0cmluZ1RvQnl0ZUFycmF5LFxuICBiYXNlNjRUb0J5dGVBcnJheSxcbn0gZnJvbSAnLi9jcnlwdG8tdXRpbHMnO1xuaW1wb3J0IF9odHRwIGZyb20gJy4vaHR0cC13b3JrZXInO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyB7XG4gIGNvbnN0cnVjdG9yKG1zZykge1xuICAgIHRoaXMucHJpdmF0ZUtleSA9IFwiXCI7XG4gICAgdGhpcy5wdWJsaWNLZXkgPSBcIlwiO1xuICB9XG5cbiAgLyoqXG4gICAqIE1ldGhvZCB0byBzaWduIHRoZSBzdHIgdXNpbmcgdXNlclNLLlxuICAgKiBAcmV0dXJucyBzaWduYXR1cmUgaW4gaGV4IGZvcm1hdC5cbiAgICovXG4gIHNpZ24obXNnKXtcbiAgICB2YXIgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCl7XG4gICAgICB2YXIgcHBrID0gcHJpdmF0ZUtleXRvS2V5cGFpcihDbGlxelNlY3VyZU1lc3NhZ2UudVBLLnByaXZhdGVLZXkpO1xuICAgICAgY3J5cHRvLnN1YnRsZS5pbXBvcnRLZXkoXG4gICAgICAgIFwicGtjczhcIixcbiAgICAgICAgYmFzZTY0VG9CeXRlQXJyYXkocHBrWzFdKSxcbiAgICAgICAge25hbWU6IFwiUlNBU1NBLVBLQ1MxLXYxXzVcIiwgaGFzaDogXCJTSEEtMjU2XCJ9LFxuICAgICAgICBmYWxzZSxcbiAgICAgICAgW1wic2lnblwiXVxuICAgICAgKVxuICAgICAgLnRoZW4oZnVuY3Rpb24ocHJpdmF0ZUtleSkge1xuICAgICAgICB2YXIgZG9jdW1lbnRCeXRlcyA9IHN0cmluZ1RvQnl0ZUFycmF5KG1zZyk7XG4gICAgICAgIGNyeXB0by5zdWJ0bGUuc2lnbihcbiAgICAgICAgICB7bmFtZTogXCJSU0FTU0EtUEtDUzEtdjFfNVwiLCBoYXNoOiBcIlNIQS0yNTZcIn0sXG4gICAgICAgICAgcHJpdmF0ZUtleSxcbiAgICAgICAgICBkb2N1bWVudEJ5dGVzXG4gICAgICAgIClcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24oc2lnbmF0dXJlQnVmZmVyKSB7XG4gICAgICAgICAgdmFyIHNpZ25hdHVyZUJ5dGVzID0gbmV3IFVpbnQ4QXJyYXkoc2lnbmF0dXJlQnVmZmVyKTtcbiAgICAgICAgICB2YXIgc2lnbmF0dXJlSGV4ID0gYnl0ZUFycmF5VG9IZXhTdHJpbmcoc2lnbmF0dXJlQnl0ZXMpO1xuICAgICAgICAgIHJlc29sdmUoc2lnbmF0dXJlSGV4KTtcbiAgICAgICAgfSkuY2F0Y2goIGVyciA9PiByZWplY3QoZXJyKSk7XG4gICAgICB9KS5jYXRjaChlcnIgPT4gcmVqZWN0KGVycikpO1xuICAgIH0pO1xuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG5cbiAgdmVyaWZ5KHNpZywgbXNnKXtcbiAgICB2YXIgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCl7XG4gICAgICB2YXIgcHBrID0gcHJpdmF0ZUtleXRvS2V5cGFpcihDbGlxelNlY3VyZU1lc3NhZ2UudVBLLnByaXZhdGVLZXkpO1xuICAgICAgY3J5cHRvLnN1YnRsZS5pbXBvcnRLZXkoXG4gICAgICAgIFwic3BraVwiLFxuICAgICAgICBiYXNlNjRUb0J5dGVBcnJheShwcGtbMF0pLFxuICAgICAgICB7bmFtZTogXCJSU0FTU0EtUEtDUzEtdjFfNVwiLCBoYXNoOiBcIlNIQS0yNTZcIn0sXG4gICAgICAgIGZhbHNlLFxuICAgICAgICBbXCJ2ZXJpZnlcIl1cbiAgICAgIClcbiAgICAgIC50aGVuKGZ1bmN0aW9uKHB1YmxpY0tleSkge1xuICAgICAgICB2YXIgc2lnbmF0dXJlQnl0ZXMgPSBoZXhTdHJpbmdUb0J5dGVBcnJheShzaWcpO1xuICAgICAgICB2YXIgZG9jdW1lbnRCeXRlcyA9IHN0cmluZ1RvQnl0ZUFycmF5KG1zZyk7XG4gICAgICAgIGNyeXB0by5zdWJ0bGUudmVyaWZ5KFxuICAgICAgICAgIHtuYW1lOiBcIlJTQVNTQS1QS0NTMS12MV81XCIsIGhhc2g6IFwiU0hBLTI1NlwifSxcbiAgICAgICAgICBwdWJsaWNLZXksXG4gICAgICAgICAgc2lnbmF0dXJlQnl0ZXMsXG4gICAgICAgICAgZG9jdW1lbnRCeXRlc1xuICAgICAgICApXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uKHZhbGlkU2lnbmF0dXJlKSB7XG4gICAgICAgICAgcmVzb2x2ZSh2YWxpZFNpZ25hdHVyZSk7XG4gICAgICAgIH0pLmNhdGNoKCBlcnIgPT4gY29uc29sZS5sb2coZXJyKSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuXG4gIGdlbmVyYXRlS2V5KCkge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgdmFyIHByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xuICAgICAgY3J5cHRvLnN1YnRsZS5nZW5lcmF0ZUtleShcbiAgICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6IFwiUlNBU1NBLVBLQ1MxLXYxXzVcIixcbiAgICAgICAgICAgIG1vZHVsdXNMZW5ndGg6IDIwNDgsXG4gICAgICAgICAgICBwdWJsaWNFeHBvbmVudDogbmV3IFVpbnQ4QXJyYXkoWzB4MDEsIDB4MDAsIDB4MDFdKSxcbiAgICAgICAgICAgIGhhc2g6IHtuYW1lOiBcIlNIQS0yNTZcIn0sXG4gICAgICAgICB9LFxuICAgICAgICAgIHRydWUsXG4gICAgICAgICBbXCJzaWduXCIsIFwidmVyaWZ5XCJdXG4gICAgICApLnRoZW4oIGtleSA9PiB7XG4gICAgICAgIHJldHVybiBjcnlwdG8uc3VidGxlLmV4cG9ydEtleShcImp3a1wiLCBrZXkucHJpdmF0ZUtleSlcbiAgICAgIH0pLnRoZW4oIGtleSA9PiB7XG4gICAgICAgICB2YXIgcmV0dXJuX2RhdGEgPSB7fVxuICAgICAgICAgcmV0dXJuX2RhdGFbXCJwcml2S2V5QjY0XCJdID0gZXhwb3J0UHJpdmF0ZUtleShrZXkpO1xuICAgICAgICAgcmV0dXJuX2RhdGFbXCJwdWJsaWNLZXlCNjRcIl0gPSBleHBvcnRQdWJsaWNLZXkoa2V5KTtcbiAgICAgICAgIF90aGlzLnByaXZhdGVLZXkgPSByZXR1cm5fZGF0YVtcInByaXZLZXlCNjRcIl07XG4gICAgICAgICBfdGhpcy5wdWJsaWNLZXkgPSByZXR1cm5fZGF0YVtcInB1YmxpY0tleUI2NFwiXTtcbiAgICAgICAgIHJldHVybiByZXR1cm5fZGF0YTtcbiAgICAgIH0pLnRoZW4oIGtleXMgPT4ge1xuICAgICAgICAgcmV0dXJuIF9odHRwKENsaXF6U2VjdXJlTWVzc2FnZS5VU0VSX1JFRykucG9zdChKU09OLnN0cmluZ2lmeSh7XCJwa1wiOmtleXNbXCJwdWJsaWNLZXlCNjRcIl19KSk7XG4gICAgICB9KS50aGVuKCBlID0+IHJlc29sdmUoe1wic3RhdHVzXCI6dHJ1ZSxcInByaXZhdGVLZXlcIjpfdGhpcy5wcml2YXRlS2V5LFwicHVibGljS2V5XCI6X3RoaXMucHVibGljS2V5fSkpXG4gICAgICAuY2F0Y2goIGUgPT4gcmVqZWN0KHtcInN0YXR1c1wiOiBlLm1lc3NhZ2V9KSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cbn07XG4iXX0=