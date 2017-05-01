System.register(['md5', './index', './user-pk', './crypto-utils', './utils', './blind-signature', './http-worker'], function (_export) {
  /**
  * Creates object for message recieved+
  * Only excepts valid JSON messages with the following fields:
  * Type : Humanweb / Antitracking etc.
  * Actions : Valid actions like Page, query etc.
  * @returns string with payload created.
  */

  // FIXME: remove circular dependency
  'use strict';

  var md5, CliqzSecureMessage, localTemporalUniq, userPK, base64_decode, base64_encode, padMessage, sha1, isJson, stringToByteArray, byteArrayToHexString, byteArrayToString, hexStringToByteArray, hexToBinary, createPayloadBlindSignature, createPayloadProxy, getRouteHash, createHttpUrl, _unBlindMessage, blindSignContext, _http, _default;

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  return {
    setters: [function (_md5) {
      md5 = _md5.md5;
    }, function (_index) {
      CliqzSecureMessage = _index['default'];
      localTemporalUniq = _index.localTemporalUniq;
    }, function (_userPk) {
      userPK = _userPk['default'];
    }, function (_cryptoUtils) {
      base64_decode = _cryptoUtils.base64_decode;
      base64_encode = _cryptoUtils.base64_encode;
      padMessage = _cryptoUtils.padMessage;
      sha1 = _cryptoUtils.sha1;
      isJson = _cryptoUtils.isJson;
      stringToByteArray = _cryptoUtils.stringToByteArray;
      byteArrayToHexString = _cryptoUtils.byteArrayToHexString;
      byteArrayToString = _cryptoUtils.byteArrayToString;
      hexStringToByteArray = _cryptoUtils.hexStringToByteArray;
      hexToBinary = _cryptoUtils.hexToBinary;
    }, function (_utils) {
      createPayloadBlindSignature = _utils.createPayloadBlindSignature;
      createPayloadProxy = _utils.createPayloadProxy;
      getRouteHash = _utils.getRouteHash;
      createHttpUrl = _utils.createHttpUrl;
    }, function (_blindSignature) {
      _unBlindMessage = _blindSignature.unBlindMessage;
      blindSignContext = _blindSignature.blindSignContext;
    }, function (_httpWorker) {
      _http = _httpWorker['default'];
    }],
    execute: function () {
      _default = (function () {
        function _default(msg) {
          _classCallCheck(this, _default);

          // FIXME: isJson is called 3 times on same object
          // TODO: don't use isJSON - try / catch should be sufficient
          if (!msg || !isJson(msg)) return;
          this.orgMessage = isJson(msg) ? JSON.stringify(msg) : msg;
          this.jMessage = isJson(msg) ? msg : JSON.parse(msg);
          this.signed = null;
          this.encrypted = null;
          this.routeHash = null;
          this.type = this.jMessage.type || null;
          this.action = this.jMessage.action || null;
          this.sha256 = null;
          this.interval = null;
          this.rateLimit = null;
          this.endPoint = null;
          this.mE = null;
          this.mK = null;
          this.mP = null;
          this.dm = null;
          this.proxyValidators = null;
        }

        _createClass(_default, [{
          key: 'log',
          value: function log(msg) {
            console.log("Message Context: " + msg);
          }
        }, {
          key: 'getproxyCoordinator',
          value: function getproxyCoordinator() {
            var _this = this;
            var msg = _this.jMessage;
            _this.endPoint = CliqzSecureMessage.sourceMap[this.action]["endpoint"];
            _this.md5Hash = md5(this.action);
            var promise = new Promise(function (resolve, reject) {
              var _this2 = this;

              try {
                var hash = "";
                // var _msg = msg || this.orgMessage;
                var stringRouteHash = getRouteHash(msg);
                sha1(stringRouteHash).then(function (hashM) {
                  _this.sha1 = hashM;
                  var dmC = hexToBinary(hashM)['result'].slice(0, 13);
                  var routeHash = parseInt(dmC, 2);
                  _this.fullHash = hashM;
                  _this.dmC = dmC;
                  var totalProxies = 4096;
                  var modRoute = routeHash % totalProxies;
                  var proxyIP = createHttpUrl(CliqzSecureMessage.routeTable[modRoute]);
                  _this.proxyCoordinator = proxyIP;
                  resolve(_this2);
                })['catch'](function (err) {
                  console.log("ERROR >> " + err);
                  reject(err);
                });
              } catch (e) {
                reject(e);
              }
            });
            return promise;
          }

          /**
           * Method to generate an AES-CBC 128 bit key.
           * @returns crypto object of AES KEY.
           */
        }, {
          key: 'aesGenerateKey',
          value: function aesGenerateKey() {
            var _this = this;
            var promise = new Promise(function (resolve, reject) {
              crypto.subtle.generateKey({
                name: "AES-CBC",
                length: 128
              }, true, ["encrypt", "decrypt"]).then(function (key) {
                resolve(key);
              })['catch'](function (err) {
                console.log("Error in generating key: " + err);
                reject(err);
              });
            });
            return promise;
          }

          /**
           * Method to generate an AES-CBC 128 bit key.
           * @returns crypto object of AES KEY.
           */
        }, {
          key: 'aesExportKey',
          value: function aesExportKey(key) {
            var _this = this;
            var promise = new Promise(function (resolve, reject) {
              crypto.subtle.exportKey('raw', key).then(function (result) {
                _this.aesKey = byteArrayToHexString(new Uint8Array(result));
                resolve(key);
              })['catch'](function (err) {
                console.log("Error in exporting key: " + err);
                reject(err);
              });
            });
            return promise;
          }

          /**
           * Method to parse a message and encrypt with AES.
           * @throws {string} Will throw 'msgtoobig' if message size exceeds a threshold.
           * @returns string of AES encrypted message.
           */
        }, {
          key: 'aesEncryption',
          value: function aesEncryption(key, _iv, msgEncrypt) {
            var _this = this;
            var promise = new Promise(function (resolve, reject) {
              crypto.subtle.encrypt({
                name: "AES-CBC",
                iv: _iv
              }, key, stringToByteArray(msgEncrypt) //ArrayBuffer of data you want to encrypt
              ).then(function (encrypted) {
                resolve(encrypted);
              })['catch'](function (err) {
                console.log("Error in aes encryption: " + err);
                reject(err);
              });
            });
            return promise;
          }
        }, {
          key: 'rsaEncrypt',
          value: function rsaEncrypt(msg) {
            var _this = this;
            var promise = new Promise(function (resolve, reject) {
              //let publicKey = "MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAh5HhcRAn6+6woXQXl/NtZ+fOooNglZct/HSpYuqkcmrPauHW7EuOSq5bvpBZRTDROjR/kUPomqVZIzqhdCFPA8BwXSCz7hAel2Q157vtBvh9sngMMLXb5Fgzef5N4EuKO8pL5KrS+I9tfZac41vFJSdpgAirZYhh+tdcQQ1z0Qv/Rw0zOXjfvddCz3gEv2gB9KsLMVnTS1J4YOOgfza2adg9Ebz1z99DiF4vtCwn0IUwH/3ToTBwJLbMnC3Ol43yBNk8rgK2mkgCi614vOSD3hnVmio+iW6+AUklM8VPl6l7hEK9cljJY+9UsMVmTrvaFbMPwS6AdZCXKTmNdaMJcy3zSOXu5zvzihoQLwAu9LM3l2eVk0Mw0K7JXOP20fc8BtzWCOLYVP32r4R0BNuhTtvGqjHNZHPJN5OwaxkLpn2dujL9uDWGjRiOItKMVq/nOqmNGghrbf8IOaKT7VQhqOU4cXRkB/uF1UjYETBavwUZAxx9Wd/cMcAGmKiDxighxxQ29jDufl+2WG065tmJz+zCxmgrPh6Zb3KFUxPTe6yksAhWJhmGShA9v20t84M5c6NpZXoUsFcVja6XxzHeSB8dWq9Uu5QcZ83Gz/ronwdEjT2OGTtBgOFeTDqLYUgphC1gcUEHOCnTNXRMQOXqGwBfZHp+Mq61QcMq2rNS7xECAwEAAQ==";
              var publicKey = CliqzSecureMessage.secureLogger.publicKeyB64;
              crypto.subtle.importKey('spki', base64_decode(publicKey), {
                name: 'RSA-OAEP',
                hash: { name: 'SHA-1' }
              }, false, ['encrypt']).then(function (key) {
                crypto.subtle.encrypt({
                  name: "RSA-OAEP"
                }, key, stringToByteArray(msg)).then(function (encrypted) {
                  resolve(base64_encode(new Uint8Array(encrypted)));
                })['catch'](function (err) {
                  console.error("Error during rsa encryption: " + err);
                  reject(err);
                });
              });
            });
            return promise;
          }

          /**
           * Method to parse a message and encrypt with AES.
           * @throws {string} Will throw 'msgtoobig' if message size exceeds a threshold.
           * @returns string of AES encrypted message.
           */
        }, {
          key: 'aesEncrypt',
          value: function aesEncrypt(type) {
            var _this = this;
            var promise = new Promise(function (resolve, reject) {
              var _iv = crypto.getRandomValues(new Uint8Array(16));
              var eventID = ('' + byteArrayToHexString(_iv)).substring(0, 5);
              var aesKeyBytes;
              // console.log(">> IV: " + byteArrayToHexString(_iv));
              // console.log(">> E" + eventID);
              _this.eventID = eventID;
              _this.iv = byteArrayToHexString(_iv);
              _this.mID = eventID;
              _this.oiv = _iv;

              _this.aesGenerateKey().then(function (key) {
                return _this.aesExportKey(key);
              }).then(function (key) {
                var encryptionPaylod = {};
                encryptionPaylod['msg'] = _this.orgMessage;
                encryptionPaylod['endpoint'] = _this.endPoint;
                var msgEncrypt = JSON.stringify(encryptionPaylod);
                if (type === "telemetry") {
                  try {
                    msgEncrypt = padMessage(JSON.stringify(encryptionPaylod));
                  } catch (e) {
                    reject(e);
                    return;
                  }
                }

                _this.aesEncryption(key, _iv, msgEncrypt).then(function (encryptedResult) {
                  _this.mE = base64_encode(new Uint8Array(encryptedResult));
                  resolve(_this.mE);
                });
              });
            });
            return promise;
          }

          /**
           * Method to parse a message and decrypt with AES.
           * @returns string of AES decrypted message.
           */
        }, {
          key: 'aesDecrypt',
          value: function aesDecrypt(msg) {
            var _this = this;
            var promise = new Promise(function (resolve, reject) {
              var _msg = base64_decode(msg.split(";")[1]);
              var hashKey = _this.aesKey;
              var _iv = _this.iv;
              crypto.subtle.importKey("raw", //can be "jwk" or "raw"
              hexStringToByteArray(hashKey), "AES-CBC", false, //whether the key is extractable (i.e. can be used in exportKey)
              ["decrypt"] //can be "encrypt", "decrypt", "wrapKey", or "unwrapKey"
              ).then(function (key) {
                //returns the symmetric key
                // console.log("key");
                // console.log(key);
                crypto.subtle.decrypt({
                  name: "AES-CBC",
                  iv: hexStringToByteArray(_iv) }, //The initialization vector you used to encrypt
                key, //from generateKey or importKey above
                _msg //ArrayBuffer of the data
                ).then(function (decrypted) {
                  //returns an ArrayBuffer containing the decrypted data
                  // console.log("Decrypted>>> " + byteArrayToString(new Uint8Array(decrypted)));
                  resolve(byteArrayToString(new Uint8Array(decrypted)));
                })['catch'](function (err) {
                  console.error(err);
                });
              })['catch'](function (err) {
                console.error(err);
              });
            });

            return promise;
          }

          /**
           * Method to sign the AES encryptiong key with Aggregator Public key.
           * Calculate mK = {AESKey;iv;endPoint}
           * @returns string of encrypted key.
           */
        }, {
          key: 'signKey',
          value: function signKey() {
            var _this = this;
            var promise = new Promise(function (resolve, reject) {
              try {
                // To protect from padding oracle attacks, we need to send the hash of
                // mE.
                var mI = md5(_this.mE); // replace it with web-crypto md5.
                var messageToSign = _this.aesKey + ";" + _this.iv + ";endPoint;" + mI;
                _this.rsaEncrypt(messageToSign).then(function (encryptedResponse) {
                  _this.signedKey = encryptedResponse;
                  _this.mK = encryptedResponse;
                  resolve(encryptedResponse);
                });
              } catch (e) {
                reject(e);
              }
            });
            return promise;
          }

          /**
           * Method to create MP
           * Calculate mP = <mID, mK, mE>
           * @returns string called mP.
           */
        }, {
          key: 'getMP',
          value: function getMP() {
            var mP = this.mID + ";" + this.mK + ";" + this.mE;
            this.mP = mP;
            return mP;
          }
        }, {
          key: 'rsaE',
          value: function rsaE() {
            rsaEncrypt();
          }
        }, {
          key: 'checkLocalUniq',
          value: function checkLocalUniq() {
            var _this = this;
            var promise = new Promise(function (resolve, reject) {
              // Check for local temporal uniquness
              var uniqKey = _this.dmC;
              if (localTemporalUniq && Object.keys(localTemporalUniq).indexOf(uniqKey) > -1) {
                if (localTemporalUniq[uniqKey]["fullhash"]) {
                  if (_this.fullHash === localTemporalUniq[uniqKey]["fullhash"]) {
                    reject("exact-duplicate");
                  } else {
                    reject("collision");
                  }
                }
              } else {
                resolve(true);
              }
            });
            return promise;
          }
        }, {
          key: 'blindMessage',
          value: function blindMessage() {
            var _this = this;
            var promise = new Promise(function (resolve, reject) {
              var _this3 = this;

              // After the message is SIGNED, we need to start the blind signature.
              _this.getMP();

              var uPK = CliqzSecureMessage.uPK.publicKeyB64;

              // Messages to be blinded.
              _this.m1 = _this.mP;
              _this.m2 = _this.mP + ";" + uPK;
              _this.m3 = _this.mP + ";" + _this.dmC; // + ";" + uPK;

              var _bm1 = new blindSignContext(_this.m1);
              var _bm2 = new blindSignContext(_this.m2);
              var _bm3 = new blindSignContext(_this.m3);

              _this.r1 = _bm1.getBlindingNonce();
              _this.r2 = _bm2.getBlindingNonce();
              _this.r3 = _bm3.getBlindingNonce();

              // Get Unblinder - to unblind the message
              _this.u1 = _bm1.getUnBlinder();
              _this.u2 = _bm2.getUnBlinder();
              _this.u3 = _bm3.getUnBlinder();

              // Blind the message
              _bm1.blindMessage().then(function (bm1) {
                _this.bm1 = bm1;
                return _bm2.blindMessage();
              }).then(function (bm2) {
                _this.bm2 = bm2;
                return _bm3.blindMessage();
              }).then(function (bm3) {
                _this.bm3 = bm3;
                resolve(_this3);
              });
            });
            return promise;
          }
        }, {
          key: 'userSign',
          value: function userSign() {
            var _this = this;
            var promise = new Promise(function (resolve, reject) {
              var _this4 = this;

              var uPK = CliqzSecureMessage.uPK.publicKeyB64;
              var payloadMsg = uPK + ";" + _this.bm1 + ";" + _this.bm2 + ";" + _this.bm3;
              var _uPK = new userPK(payloadMsg);
              return _uPK.sign(payloadMsg).then(function (signedData) {
                _this.signedData = signedData;
                resolve(_this4);
              });
            });
            return promise;
          }
        }, {
          key: 'sendBlindPayload',
          value: function sendBlindPayload() {
            var _this = this;
            var promise = new Promise(function (resolve, reject) {
              var _this5 = this;

              var payload = createPayloadBlindSignature(CliqzSecureMessage.uPK.publicKeyB64, _this.bm1, _this.bm2, _this.bm3, _this.signedData);
              return _http(CliqzSecureMessage.BLIND_SIGNER).post(JSON.stringify(payload)).then(function (response) {
                _this.bsResponse = JSON.parse(response);
                resolve(_this5);
              });
            });
            return promise;
          }
        }, {
          key: 'unBlindMessage',
          value: function unBlindMessage() {
            var _this = this;
            var promise = new Promise(function (resolve, reject) {
              var res = _this.bsResponse;
              // Capture the response
              var bs1 = res["bs1"];
              var bs2 = res["bs2"];
              var bs3 = res["bs3"];
              var suPK = res["suPK"];

              // Unblind the message to get the signature.
              _this.us1 = _unBlindMessage(bs1, _this.u1);
              _this.us2 = _unBlindMessage(bs2, _this.u2);
              _this.us3 = _unBlindMessage(bs3, _this.u3);
              _this.suPK = suPK;
              resolve(this);
            });
            return promise;
          }
        }, {
          key: 'signUnblindedMessage',
          value: function signUnblindedMessage() {
            var _this = this;
            var promise = new Promise(function (resolve, reject) {
              var _this6 = this;

              var payload = CliqzSecureMessage.uPK.publicKeyB64 + ";" + _this.mP + ";" + _this.dmC + ";" + _this.us1 + ";" + _this.us2 + ";" + _this.us3;
              var _uPK = new userPK(payload);
              return _uPK.sign(payload).then(function (signedMessageProxy) {
                _this.signedMessageProxy = signedMessageProxy;
                resolve(_this6);
              });
            });
            return promise;
          }
        }, {
          key: 'sendMessageProxy',
          value: function sendMessageProxy() {
            var _this = this;
            var promise = new Promise(function (resolve, reject) {
              var _this7 = this;

              var payload = createPayloadProxy(CliqzSecureMessage.uPK.publicKeyB64, _this.suPK, _this.mP, _this.dmC, _this.us1, _this.us2, _this.us3, _this.signedMessageProxy);
              return _http(_this.proxyCoordinator).post(JSON.stringify(payload)).then(function () {
                return resolve(_this7);
              })['catch'](function (err) {
                reject(err);
              });
            });
            return promise;
          }
        }, {
          key: 'saveLocalCheckTable',
          value: function saveLocalCheckTable() {
            var _this = this;
            var promise = new Promise(function (resolve, reject) {
              // Save the hash in temporal unique queue.
              var tt = new Date().getTime();
              localTemporalUniq[_this.dmC] = { "ts": tt, "fullhash": _this.fullHash };
              resolve(this);
            });
            return promise;
          }
        }, {
          key: 'query',
          value: function query() {
            var _this = this;
            var promise = new Promise(function (resolve, reject) {
              _this.aesEncrypt().then(function (e) {
                return _this.signKey();
              }).then(function (e) {
                var data = { "mP": _this.getMP() };
                return _http(CliqzSecureMessage.queryProxyIP).post(JSON.stringify(data), "instant");
              }).then(function (res) {
                // Got response, let's decrypt it.
                _this.aesDecrypt(JSON.parse(res)["data"]).then(function (decryptedRes) {
                  resolve(decryptedRes);
                });
              })['catch'](function (err) {
                return _this.log(err);
              });
            });
            return promise;
          }
        }, {
          key: 'encryptedTelemetry',
          value: function encryptedTelemetry() {
            var _this = this;
            var promise = new Promise(function (resolve, reject) {
              try {
                return _this.getproxyCoordinator().then(function () {
                  return _this.checkLocalUniq();
                }).then(function () {
                  return _this.aesEncrypt("telemetry");
                }).then(function () {
                  return _this.signKey();
                }).then(function () {
                  return _this.blindMessage();
                }).then(function () {
                  return _this.userSign();
                }).then(function () {
                  return _this.sendBlindPayload();
                }).then(function () {
                  return _this.unBlindMessage();
                }).then(function () {
                  return _this.signUnblindedMessage();
                }).then(function () {
                  return _this.sendMessageProxy();
                }).then(function () {
                  return _this.saveLocalCheckTable();
                }).then(function () {
                  return resolve(true);
                })['catch'](function (err) {
                  console.log(err);
                  reject(err);
                });
              } catch (err) {
                console.log("Error creating mc: " + err);
                reject(err);
              }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImhwbi93b3JrZXIvbWVzc2FnZS1jb250ZXh0LmVzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O2lCQVFTLEdBQUc7OztpQ0FFaUIsaUJBQWlCOzs7O21DQUc1QyxhQUFhO21DQUNiLGFBQWE7Z0NBQ2IsVUFBVTswQkFDVixJQUFJOzRCQUNKLE1BQU07dUNBQ04saUJBQWlCOzBDQUNqQixvQkFBb0I7dUNBQ3BCLGlCQUFpQjswQ0FDakIsb0JBQW9CO2lDQUNwQixXQUFXOzsyQ0FHWCwyQkFBMkI7a0NBQzNCLGtCQUFrQjs0QkFDbEIsWUFBWTs2QkFDWixhQUFhOzt3Q0FFTixjQUFjO3lDQUFFLGdCQUFnQjs7Ozs7O0FBSTVCLDBCQUFDLEdBQUcsRUFBRTs7Ozs7QUFHaEIsY0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRSxPQUFPO0FBQy9CLGNBQUksQ0FBQyxVQUFVLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDO0FBQzFELGNBQUksQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3BELGNBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO0FBQ25CLGNBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO0FBQ3RCLGNBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO0FBQ3RCLGNBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDO0FBQ3ZDLGNBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDO0FBQzNDLGNBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO0FBQ25CLGNBQUks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Q1QsdUJBQU8sQ0FBQyxHQUFHLENBQUMscUJBQXFCLEdBQUcsR0FBRyxDQUFDLENBQUM7QUFDekMsc0JBQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztlQUNiO2FBQ0YsQ0FBQyxDQUFDO0FBQ0gsbUJBQU8sT0FBTyxDQUFDO1dBQ2hCOzs7Ozs7OztBQUNGLE9BQUMiLCJmaWxlIjoiaHBuL3dvcmtlci9tZXNzYWdlLWNvbnRleHQuZXMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiogQ3JlYXRlcyBvYmplY3QgZm9yIG1lc3NhZ2UgcmVjaWV2ZWQrXG4qIE9ubHkgZXhjZXB0cyB2YWxpZCBKU09OIG1lc3NhZ2VzIHdpdGggdGhlIGZvbGxvd2luZyBmaWVsZHM6XG4qIFR5cGUgOiBIdW1hbndlYiAvIEFudGl0cmFja2luZyBldGMuXG4qIEFjdGlvbnMgOiBWYWxpZCBhY3Rpb25zIGxpa2UgUGFnZSwgcXVlcnkgZXRjLlxuKiBAcmV0dXJucyBzdHJpbmcgd2l0aCBwYXlsb2FkIGNyZWF0ZWQuXG4qL1xuXG5pbXBvcnQgeyBtZDUgfSBmcm9tICdtZDUnO1xuLy8gRklYTUU6IHJlbW92ZSBjaXJjdWxhciBkZXBlbmRlbmN5XG5pbXBvcnQgQ2xpcXpTZWN1cmVNZXNzYWdlLCB7IGxvY2FsVGVtcG9yYWxVbmlxIH0gZnJvbSAnLi9pbmRleCc7XG5pbXBvcnQgdXNlclBLIGZyb20gJy4vdXNlci1wayc7XG5pbXBvcnQge1xuICBiYXNlNjRfZGVjb2RlLFxuICBiYXNlNjRfZW5jb2RlLFxuICBwYWRNZXNzYWdlLFxuICBzaGExLFxuICBpc0pzb24sXG4gIHN0cmluZ1RvQnl0ZUFycmF5LFxuICBieXRlQXJyYXlUb0hleFN0cmluZyxcbiAgYnl0ZUFycmF5VG9TdHJpbmcsXG4gIGhleFN0cmluZ1RvQnl0ZUFycmF5LFxuICBoZXhUb0JpbmFyeSxcbn0gZnJvbSAnLi9jcnlwdG8tdXRpbHMnO1xuaW1wb3J0IHtcbiAgY3JlYXRlUGF5bG9hZEJsaW5kU2lnbmF0dXJlLFxuICBjcmVhdGVQYXlsb2FkUHJveHksXG4gIGdldFJvdXRlSGFzaCxcbiAgY3JlYXRlSHR0cFVybFxufSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCB7IHVuQmxpbmRNZXNzYWdlLCBibGluZFNpZ25Db250ZXh0IH0gZnJvbSAnLi9ibGluZC1zaWduYXR1cmUnO1xuaW1wb3J0IF9odHRwIGZyb20gJy4vaHR0cC13b3JrZXInO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyB7XG4gIGNvbnN0cnVjdG9yKG1zZykge1xuICAgIC8vIEZJWE1FOiBpc0pzb24gaXMgY2FsbGVkIDMgdGltZXMgb24gc2FtZSBvYmplY3RcbiAgICAvLyBUT0RPOiBkb24ndCB1c2UgaXNKU09OIC0gdHJ5IC8gY2F0Y2ggc2hvdWxkIGJlIHN1ZmZpY2llbnRcbiAgXHRpZighbXNnIHx8ICFpc0pzb24obXNnKSkgcmV0dXJuO1xuICAgIHRoaXMub3JnTWVzc2FnZSA9IGlzSnNvbihtc2cpID8gSlNPTi5zdHJpbmdpZnkobXNnKSA6IG1zZztcbiAgICB0aGlzLmpNZXNzYWdlID0gaXNKc29uKG1zZykgPyBtc2cgOiBKU09OLnBhcnNlKG1zZyk7XG4gICAgdGhpcy5zaWduZWQgPSBudWxsO1xuICAgIHRoaXMuZW5jcnlwdGVkID0gbnVsbDtcbiAgICB0aGlzLnJvdXRlSGFzaCA9IG51bGw7XG4gICAgdGhpcy50eXBlID0gdGhpcy5qTWVzc2FnZS50eXBlIHx8IG51bGw7XG4gICAgdGhpcy5hY3Rpb24gPSB0aGlzLmpNZXNzYWdlLmFjdGlvbiB8fCBudWxsO1xuICAgIHRoaXMuc2hhMjU2ID0gbnVsbDtcbiAgICB0aGlzLmludGVydmFsID0gbnVsbDtcbiAgICB0aGlzLnJhdGVMaW1pdCA9IG51bGw7XG4gICAgdGhpcy5lbmRQb2ludCA9IG51bGw7XG4gICAgdGhpcy5tRSA9IG51bGw7XG4gICAgdGhpcy5tSyA9IG51bGw7XG4gICAgdGhpcy5tUCA9IG51bGw7XG4gICAgdGhpcy5kbSA9IG51bGw7XG4gICAgdGhpcy5wcm94eVZhbGlkYXRvcnMgPSBudWxsO1xuICB9XG5cbiAgbG9nKG1zZyl7XG4gICAgY29uc29sZS5sb2coXCJNZXNzYWdlIENvbnRleHQ6IFwiICsgbXNnKTtcbiAgfVxuXG5cdGdldHByb3h5Q29vcmRpbmF0b3IoKXtcblx0XHR2YXIgX3RoaXMgPSB0aGlzO1xuXHRcdHZhciBtc2cgPSBfdGhpcy5qTWVzc2FnZTtcbiAgICBfdGhpcy5lbmRQb2ludCA9IENsaXF6U2VjdXJlTWVzc2FnZS5zb3VyY2VNYXBbdGhpcy5hY3Rpb25dW1wiZW5kcG9pbnRcIl07XG4gICAgX3RoaXMubWQ1SGFzaCA9IG1kNSh0aGlzLmFjdGlvbik7XG5cdFx0dmFyIHByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xuXHRcdFx0dHJ5e1xuXHRcdFx0XHR2YXIgaGFzaCA9IFwiXCI7XG5cdFx0XHRcdC8vIHZhciBfbXNnID0gbXNnIHx8IHRoaXMub3JnTWVzc2FnZTtcblx0XHRcdFx0dmFyIHN0cmluZ1JvdXRlSGFzaCA9IGdldFJvdXRlSGFzaChtc2cpO1xuXHRcdFx0XHRzaGExKHN0cmluZ1JvdXRlSGFzaClcblx0XHRcdFx0LnRoZW4oaGFzaE0gPT4ge1xuICAgICAgICAgIF90aGlzLnNoYTEgPSBoYXNoTTtcblx0XHRcdFx0XHR2YXIgZG1DID0gaGV4VG9CaW5hcnkoaGFzaE0pWydyZXN1bHQnXS5zbGljZSgwLDEzKTtcblx0XHRcdFx0XHR2YXIgcm91dGVIYXNoID0gcGFyc2VJbnQoZG1DLCAyKTtcblx0XHRcdFx0XHRfdGhpcy5mdWxsSGFzaCA9IGhhc2hNO1xuXHRcdFx0XHRcdF90aGlzLmRtQyA9IGRtQztcblx0XHRcdFx0XHR2YXIgdG90YWxQcm94aWVzID0gNDA5Njtcblx0XHRcdFx0XHR2YXIgbW9kUm91dGUgPSByb3V0ZUhhc2ggJSB0b3RhbFByb3hpZXM7XG5cdFx0XHRcdFx0dmFyIHByb3h5SVAgPSBjcmVhdGVIdHRwVXJsKENsaXF6U2VjdXJlTWVzc2FnZS5yb3V0ZVRhYmxlW21vZFJvdXRlXSk7XG5cdFx0XHRcdFx0X3RoaXMucHJveHlDb29yZGluYXRvciA9IHByb3h5SVA7XG5cdFx0XHRcdFx0cmVzb2x2ZSh0aGlzKTtcblx0XHRcdFx0fSlcblx0XHRcdFx0LmNhdGNoKGVycj0+e1xuICAgICAgICAgIGNvbnNvbGUubG9nKFwiRVJST1IgPj4gXCIgKyBlcnIpO1xuXHRcdFx0XHRcdHJlamVjdChlcnIpO1xuXHRcdFx0XHR9KVxuXG5cblx0XHRcdH1cblx0XHRcdGNhdGNoKGUpe1xuXHRcdFx0XHRyZWplY3QoZSk7XG5cdFx0XHR9XG5cdFx0fSlcblx0XHRyZXR1cm4gcHJvbWlzZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBNZXRob2QgdG8gZ2VuZXJhdGUgYW4gQUVTLUNCQyAxMjggYml0IGtleS5cblx0ICogQHJldHVybnMgY3J5cHRvIG9iamVjdCBvZiBBRVMgS0VZLlxuXHQgKi9cbiAgYWVzR2VuZXJhdGVLZXkoKXtcbiAgICBsZXQgX3RoaXMgPSB0aGlzO1xuICBcdGxldCBwcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KXtcbiAgICAgIGNyeXB0by5zdWJ0bGUuZ2VuZXJhdGVLZXkoXG4gICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6IFwiQUVTLUNCQ1wiLFxuICAgICAgICAgICAgbGVuZ3RoOiAxMjgsXG4gICAgICAgIH0sXG4gICAgICAgIHRydWUsXG4gICAgICAgIFtcImVuY3J5cHRcIiwgXCJkZWNyeXB0XCJdXG4gICAgICApLnRoZW4oIGtleSA9PiB7XG4gICAgICAgIHJlc29sdmUoa2V5KTtcbiAgICAgIH0pLmNhdGNoKCBlcnIgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhcIkVycm9yIGluIGdlbmVyYXRpbmcga2V5OiBcIiArIGVycik7XG4gICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgfSk7XG4gIFx0fSlcbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuXG5cdC8qKlxuXHQgKiBNZXRob2QgdG8gZ2VuZXJhdGUgYW4gQUVTLUNCQyAxMjggYml0IGtleS5cblx0ICogQHJldHVybnMgY3J5cHRvIG9iamVjdCBvZiBBRVMgS0VZLlxuXHQgKi9cblx0YWVzRXhwb3J0S2V5KGtleSl7XG4gICAgbGV0IF90aGlzID0gdGhpcztcbiAgICBsZXQgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCl7XG4gICAgICBjcnlwdG8uc3VidGxlLmV4cG9ydEtleSgncmF3Jywga2V5KS50aGVuKCByZXN1bHQgPT4ge1xuICAgICAgICBfdGhpcy5hZXNLZXkgPSBieXRlQXJyYXlUb0hleFN0cmluZyhuZXcgVWludDhBcnJheShyZXN1bHQpKTtcbiAgICAgICAgcmVzb2x2ZShrZXkpO1xuICAgICAgfSkuY2F0Y2ggKCBlcnIgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhcIkVycm9yIGluIGV4cG9ydGluZyBrZXk6IFwiICsgZXJyKTtcbiAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICB9KVxuICAgIH0pO1xuICAgIHJldHVybiBwcm9taXNlO1xuXHR9XG4gIC8qKlxuICAgKiBNZXRob2QgdG8gcGFyc2UgYSBtZXNzYWdlIGFuZCBlbmNyeXB0IHdpdGggQUVTLlxuICAgKiBAdGhyb3dzIHtzdHJpbmd9IFdpbGwgdGhyb3cgJ21zZ3Rvb2JpZycgaWYgbWVzc2FnZSBzaXplIGV4Y2VlZHMgYSB0aHJlc2hvbGQuXG4gICAqIEByZXR1cm5zIHN0cmluZyBvZiBBRVMgZW5jcnlwdGVkIG1lc3NhZ2UuXG4gICAqL1xuICBhZXNFbmNyeXB0aW9uKCBrZXksIF9pdiwgbXNnRW5jcnlwdCApe1xuICAgIGxldCBfdGhpcyA9IHRoaXM7XG4gICAgbGV0IHByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xuICAgICAgY3J5cHRvLnN1YnRsZS5lbmNyeXB0KFxuICAgICAgICB7XG4gICAgICAgICAgICBuYW1lOiBcIkFFUy1DQkNcIixcbiAgICAgICAgICAgIGl2OiBfaXYsXG4gICAgICAgIH0sXG4gICAgICAgIGtleSxcbiAgICAgICAgc3RyaW5nVG9CeXRlQXJyYXkobXNnRW5jcnlwdCkgLy9BcnJheUJ1ZmZlciBvZiBkYXRhIHlvdSB3YW50IHRvIGVuY3J5cHRcbiAgICAgICkudGhlbiggZW5jcnlwdGVkID0+IHtcbiAgICAgICAgcmVzb2x2ZShlbmNyeXB0ZWQpO1xuICAgICAgfSkuY2F0Y2goIGVyciA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiRXJyb3IgaW4gYWVzIGVuY3J5cHRpb246IFwiICsgZXJyKTtcbiAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICB9KVxuICAgIH0pXG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cblxuICByc2FFbmNyeXB0KG1zZyl7XG4gICAgbGV0IF90aGlzID0gdGhpcztcbiAgICBsZXQgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCl7XG4gICAgICAvL2xldCBwdWJsaWNLZXkgPSBcIk1JSUNJakFOQmdrcWhraUc5dzBCQVFFRkFBT0NBZzhBTUlJQ0NnS0NBZ0VBaDVIaGNSQW42KzZ3b1hRWGwvTnRaK2ZPb29OZ2xaY3QvSFNwWXVxa2NtclBhdUhXN0V1T1NxNWJ2cEJaUlREUk9qUi9rVVBvbXFWWkl6cWhkQ0ZQQThCd1hTQ3o3aEFlbDJRMTU3dnRCdmg5c25nTU1MWGI1Rmd6ZWY1TjRFdUtPOHBMNUtyUytJOXRmWmFjNDF2RkpTZHBnQWlyWlloaCt0ZGNRUTF6MFF2L1J3MHpPWGpmdmRkQ3ozZ0V2MmdCOUtzTE1WblRTMUo0WU9PZ2Z6YTJhZGc5RWJ6MXo5OURpRjR2dEN3bjBJVXdILzNUb1RCd0pMYk1uQzNPbDQzeUJOazhyZ0sybWtnQ2k2MTR2T1NEM2huVm1pbytpVzYrQVVrbE04VlBsNmw3aEVLOWNsakpZKzlVc01WbVRydmFGYk1Qd1M2QWRaQ1hLVG1OZGFNSmN5M3pTT1h1NXp2emlob1FMd0F1OUxNM2wyZVZrME13MEs3SlhPUDIwZmM4QnR6V0NPTFlWUDMycjRSMEJOdWhUdHZHcWpITlpIUEpONU93YXhrTHBuMmR1akw5dURXR2pSaU9JdEtNVnEvbk9xbU5HZ2hyYmY4SU9hS1Q3VlFocU9VNGNYUmtCL3VGMVVqWUVUQmF2d1VaQXh4OVdkL2NNY0FHbUtpRHhpZ2h4eFEyOWpEdWZsKzJXRzA2NXRtSnorekN4bWdyUGg2WmIzS0ZVeFBUZTZ5a3NBaFdKaG1HU2hBOXYyMHQ4NE01YzZOcFpYb1VzRmNWamE2WHh6SGVTQjhkV3E5VXU1UWNaODNHei9yb253ZEVqVDJPR1R0QmdPRmVURHFMWVVncGhDMWdjVUVIT0NuVE5YUk1RT1hxR3dCZlpIcCtNcTYxUWNNcTJyTlM3eEVDQXdFQUFRPT1cIjtcbiAgICAgIGxldCBwdWJsaWNLZXkgPSBDbGlxelNlY3VyZU1lc3NhZ2Uuc2VjdXJlTG9nZ2VyLnB1YmxpY0tleUI2NDtcbiAgICAgIGNyeXB0by5zdWJ0bGUuaW1wb3J0S2V5KFxuICAgICAgICdzcGtpJyxcbiAgICAgICAgYmFzZTY0X2RlY29kZShwdWJsaWNLZXkpLFxuICAgICAgICB7XG4gICAgICAgICAgbmFtZTogJ1JTQS1PQUVQJyxcbiAgICAgICAgICBoYXNoOiB7IG5hbWU6ICdTSEEtMScgfVxuICAgICAgICB9LFxuICAgICAgICBmYWxzZSxcbiAgICAgICAgWydlbmNyeXB0J11cbiAgICAgICkudGhlbigga2V5PT4ge1xuICAgICAgY3J5cHRvLnN1YnRsZS5lbmNyeXB0KFxuICAgICAgICAgIHtcbiAgICAgICAgICAgICAgbmFtZTogXCJSU0EtT0FFUFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAga2V5LFxuICAgICAgICAgIHN0cmluZ1RvQnl0ZUFycmF5KG1zZylcbiAgICAgICAgKVxuICAgICAgICAudGhlbihmdW5jdGlvbihlbmNyeXB0ZWQpe1xuICAgICAgICAgIHJlc29sdmUoYmFzZTY0X2VuY29kZShuZXcgVWludDhBcnJheShlbmNyeXB0ZWQpKSk7XG4gICAgICAgIH0pXG4gICAgICAgIC5jYXRjaChmdW5jdGlvbihlcnIpe1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkVycm9yIGR1cmluZyByc2EgZW5jcnlwdGlvbjogXCIgKyBlcnIpO1xuICAgICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSlcbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuXHQvKipcblx0ICogTWV0aG9kIHRvIHBhcnNlIGEgbWVzc2FnZSBhbmQgZW5jcnlwdCB3aXRoIEFFUy5cblx0ICogQHRocm93cyB7c3RyaW5nfSBXaWxsIHRocm93ICdtc2d0b29iaWcnIGlmIG1lc3NhZ2Ugc2l6ZSBleGNlZWRzIGEgdGhyZXNob2xkLlxuXHQgKiBAcmV0dXJucyBzdHJpbmcgb2YgQUVTIGVuY3J5cHRlZCBtZXNzYWdlLlxuXHQgKi9cblx0YWVzRW5jcnlwdCh0eXBlKXtcblx0XHR2YXIgX3RoaXMgPSB0aGlzO1xuXHRcdHZhciBwcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KXtcbiAgICAgIHZhciBfaXYgPSBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKG5ldyBVaW50OEFycmF5KDE2KSk7XG4gICAgICB2YXIgZXZlbnRJRCA9ICgnJyArIGJ5dGVBcnJheVRvSGV4U3RyaW5nKF9pdikpLnN1YnN0cmluZygwLDUpO1xuICAgICAgdmFyIGFlc0tleUJ5dGVzO1xuICAgICAgLy8gY29uc29sZS5sb2coXCI+PiBJVjogXCIgKyBieXRlQXJyYXlUb0hleFN0cmluZyhfaXYpKTtcbiAgICAgIC8vIGNvbnNvbGUubG9nKFwiPj4gRVwiICsgZXZlbnRJRCk7XG4gICAgICBfdGhpcy5ldmVudElEID0gZXZlbnRJRDtcbiAgICAgIF90aGlzLml2ID0gYnl0ZUFycmF5VG9IZXhTdHJpbmcoX2l2KTtcbiAgICAgIF90aGlzLm1JRCA9IGV2ZW50SUQ7XG4gICAgICBfdGhpcy5vaXYgPSBfaXY7XG5cbiAgICAgIF90aGlzLmFlc0dlbmVyYXRlS2V5KCkudGhlbigga2V5ID0+IHtcbiAgICAgICAgcmV0dXJuIF90aGlzLmFlc0V4cG9ydEtleShrZXkpXG4gICAgICB9KS50aGVuKCBrZXkgPT4ge1xuICAgICAgICAgIGxldCBlbmNyeXB0aW9uUGF5bG9kID0ge307XG4gICAgICAgICAgZW5jcnlwdGlvblBheWxvZFsnbXNnJ10gPSBfdGhpcy5vcmdNZXNzYWdlO1xuICAgICAgICAgIGVuY3J5cHRpb25QYXlsb2RbJ2VuZHBvaW50J10gPSBfdGhpcy5lbmRQb2ludDtcbiAgICAgICAgICBsZXQgbXNnRW5jcnlwdCA9IEpTT04uc3RyaW5naWZ5KGVuY3J5cHRpb25QYXlsb2QpO1xuICAgICAgICAgIGlmKHR5cGUgPT09IFwidGVsZW1ldHJ5XCIpe1xuICAgICAgICAgICAgdHJ5e1xuICAgICAgICAgICAgICBtc2dFbmNyeXB0ID0gcGFkTWVzc2FnZShKU09OLnN0cmluZ2lmeShlbmNyeXB0aW9uUGF5bG9kKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaChlKXtcbiAgICAgICAgICAgICAgcmVqZWN0KGUpO1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgX3RoaXMuYWVzRW5jcnlwdGlvbihrZXksIF9pdiwgbXNnRW5jcnlwdCkudGhlbiggZW5jcnlwdGVkUmVzdWx0ID0+IHtcbiAgICAgICAgICAgIF90aGlzLm1FID0gYmFzZTY0X2VuY29kZShuZXcgVWludDhBcnJheShlbmNyeXB0ZWRSZXN1bHQpKTtcbiAgICAgICAgICAgIHJlc29sdmUoX3RoaXMubUUpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHByb21pc2U7XG5cdH1cblxuXHQvKipcblx0ICogTWV0aG9kIHRvIHBhcnNlIGEgbWVzc2FnZSBhbmQgZGVjcnlwdCB3aXRoIEFFUy5cblx0ICogQHJldHVybnMgc3RyaW5nIG9mIEFFUyBkZWNyeXB0ZWQgbWVzc2FnZS5cblx0ICovXG5cdGFlc0RlY3J5cHQobXNnKXtcblx0XHR2YXIgX3RoaXMgPSB0aGlzO1xuXHRcdHZhciBwcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KXtcbiAgICAgIHZhciBfbXNnID1iYXNlNjRfZGVjb2RlKG1zZy5zcGxpdChcIjtcIilbMV0pO1xuICAgICAgdmFyIGhhc2hLZXkgPSBfdGhpcy5hZXNLZXk7XG4gICAgICB2YXIgX2l2ID0gX3RoaXMuaXY7XG4gICAgICBjcnlwdG8uc3VidGxlLmltcG9ydEtleShcbiAgICAgICAgICBcInJhd1wiLCAvL2NhbiBiZSBcImp3a1wiIG9yIFwicmF3XCJcbiAgICAgICAgICBoZXhTdHJpbmdUb0J5dGVBcnJheShoYXNoS2V5KSxcbiAgICAgICAgICBcIkFFUy1DQkNcIixcbiAgICAgICAgICBmYWxzZSwgLy93aGV0aGVyIHRoZSBrZXkgaXMgZXh0cmFjdGFibGUgKGkuZS4gY2FuIGJlIHVzZWQgaW4gZXhwb3J0S2V5KVxuICAgICAgICAgIFtcImRlY3J5cHRcIl0gLy9jYW4gYmUgXCJlbmNyeXB0XCIsIFwiZGVjcnlwdFwiLCBcIndyYXBLZXlcIiwgb3IgXCJ1bndyYXBLZXlcIlxuICAgICAgKVxuICAgICAgLnRoZW4oZnVuY3Rpb24oa2V5KXtcbiAgICAgICAgICAvL3JldHVybnMgdGhlIHN5bW1ldHJpYyBrZXlcbiAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcImtleVwiKTtcbiAgICAgICAgICAvLyBjb25zb2xlLmxvZyhrZXkpO1xuICAgICAgICBjcnlwdG8uc3VidGxlLmRlY3J5cHQoXG4gICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6IFwiQUVTLUNCQ1wiLFxuICAgICAgICAgICAgaXY6IGhleFN0cmluZ1RvQnl0ZUFycmF5KF9pdiksIC8vVGhlIGluaXRpYWxpemF0aW9uIHZlY3RvciB5b3UgdXNlZCB0byBlbmNyeXB0XG4gICAgICAgIH0sXG4gICAgICAgIGtleSwgLy9mcm9tIGdlbmVyYXRlS2V5IG9yIGltcG9ydEtleSBhYm92ZVxuICAgICAgICBfbXNnICAvL0FycmF5QnVmZmVyIG9mIHRoZSBkYXRhXG4gICAgICAgIClcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24oZGVjcnlwdGVkKXtcbiAgICAgICAgICAgIC8vcmV0dXJucyBhbiBBcnJheUJ1ZmZlciBjb250YWluaW5nIHRoZSBkZWNyeXB0ZWQgZGF0YVxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJEZWNyeXB0ZWQ+Pj4gXCIgKyBieXRlQXJyYXlUb1N0cmluZyhuZXcgVWludDhBcnJheShkZWNyeXB0ZWQpKSk7XG4gICAgICAgICAgICByZXNvbHZlKGJ5dGVBcnJheVRvU3RyaW5nKG5ldyBVaW50OEFycmF5KGRlY3J5cHRlZCkpKTtcbiAgICAgICAgfSlcbiAgICAgICAgLmNhdGNoKGZ1bmN0aW9uKGVycil7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycik7XG4gICAgICAgIH0pO1xuICAgICAgfSlcbiAgICAgIC5jYXRjaChmdW5jdGlvbihlcnIpe1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICAgIH0pO1xuXG5cdFx0fSlcblxuXHRcdHJldHVybiBwcm9taXNlO1xuXHR9XG5cblx0LyoqXG5cdCAqIE1ldGhvZCB0byBzaWduIHRoZSBBRVMgZW5jcnlwdGlvbmcga2V5IHdpdGggQWdncmVnYXRvciBQdWJsaWMga2V5LlxuXHQgKiBDYWxjdWxhdGUgbUsgPSB7QUVTS2V5O2l2O2VuZFBvaW50fVxuXHQgKiBAcmV0dXJucyBzdHJpbmcgb2YgZW5jcnlwdGVkIGtleS5cblx0ICovXG5cdHNpZ25LZXkoKXtcblx0XHR2YXIgX3RoaXMgPSB0aGlzO1xuXHRcdHZhciBwcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KXtcblx0XHRcdHRyeXtcblx0XHRcdFx0Ly8gVG8gcHJvdGVjdCBmcm9tIHBhZGRpbmcgb3JhY2xlIGF0dGFja3MsIHdlIG5lZWQgdG8gc2VuZCB0aGUgaGFzaCBvZlxuXHRcdFx0XHQvLyBtRS5cblx0XHRcdFx0dmFyIG1JID0gbWQ1KF90aGlzLm1FKTsgLy8gcmVwbGFjZSBpdCB3aXRoIHdlYi1jcnlwdG8gbWQ1LlxuXHRcdFx0XHR2YXIgbWVzc2FnZVRvU2lnbiA9IF90aGlzLmFlc0tleSArIFwiO1wiICsgX3RoaXMuaXYgKyBcIjtlbmRQb2ludDtcIiArIG1JO1xuICAgICAgICBfdGhpcy5yc2FFbmNyeXB0KG1lc3NhZ2VUb1NpZ24pLnRoZW4oIGVuY3J5cHRlZFJlc3BvbnNlID0+IHtcbiAgICAgICAgICBfdGhpcy5zaWduZWRLZXkgPSBlbmNyeXB0ZWRSZXNwb25zZTtcbiAgICAgICAgICBfdGhpcy5tSyA9IGVuY3J5cHRlZFJlc3BvbnNlO1xuICAgICAgICAgIHJlc29sdmUoZW5jcnlwdGVkUmVzcG9uc2UpO1xuICAgICAgICB9KVxuXG5cdFx0XHR9XG5cdFx0XHRjYXRjaChlKXtcblx0XHRcdFx0cmVqZWN0KGUpO1xuXHRcdFx0fVxuXHRcdH0pXG5cdFx0cmV0dXJuIHByb21pc2U7XG5cdH1cblxuXHQvKipcblx0ICogTWV0aG9kIHRvIGNyZWF0ZSBNUFxuXHQgKiBDYWxjdWxhdGUgbVAgPSA8bUlELCBtSywgbUU+XG5cdCAqIEByZXR1cm5zIHN0cmluZyBjYWxsZWQgbVAuXG5cdCAqL1xuXHRnZXRNUCgpe1xuXHRcdHZhciBtUCA9IHRoaXMubUlEICsgXCI7XCIgKyB0aGlzLm1LICtcIjtcIiArIHRoaXMubUU7XG5cdFx0dGhpcy5tUCA9IG1QO1xuXHRcdHJldHVybiBtUFxuXHR9XG5cblx0cnNhRSgpe1xuXHRcdHJzYUVuY3J5cHQoKTtcblx0fVxuXG4gIGNoZWNrTG9jYWxVbmlxKCl7XG4gICAgbGV0IF90aGlzID0gdGhpcztcbiAgICBsZXQgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCl7XG4gICAgICAvLyBDaGVjayBmb3IgbG9jYWwgdGVtcG9yYWwgdW5pcXVuZXNzXG4gICAgICB2YXIgdW5pcUtleSA9IF90aGlzLmRtQztcbiAgICAgIGlmKGxvY2FsVGVtcG9yYWxVbmlxICYmIE9iamVjdC5rZXlzKGxvY2FsVGVtcG9yYWxVbmlxKS5pbmRleE9mKHVuaXFLZXkpID4gLTEpIHtcbiAgICAgICAgaWYobG9jYWxUZW1wb3JhbFVuaXFbdW5pcUtleV1bXCJmdWxsaGFzaFwiXSl7XG4gICAgICAgICAgaWYoX3RoaXMuZnVsbEhhc2ggPT09IGxvY2FsVGVtcG9yYWxVbmlxW3VuaXFLZXldW1wiZnVsbGhhc2hcIl0pe1xuICAgICAgICAgICAgcmVqZWN0KFwiZXhhY3QtZHVwbGljYXRlXCIpO1xuICAgICAgICAgIH0gZWxzZXtcbiAgICAgICAgICAgIHJlamVjdChcImNvbGxpc2lvblwiKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGVsc2V7XG4gICAgICAgIHJlc29sdmUodHJ1ZSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cblxuICBibGluZE1lc3NhZ2UoKXtcbiAgICBsZXQgX3RoaXMgPSB0aGlzO1xuICAgIGxldCBwcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KXtcbiAgICAgIC8vIEFmdGVyIHRoZSBtZXNzYWdlIGlzIFNJR05FRCwgd2UgbmVlZCB0byBzdGFydCB0aGUgYmxpbmQgc2lnbmF0dXJlLlxuICAgICAgX3RoaXMuZ2V0TVAoKTtcblxuICAgICAgdmFyIHVQSyA9IENsaXF6U2VjdXJlTWVzc2FnZS51UEsucHVibGljS2V5QjY0O1xuXG4gICAgICAvLyBNZXNzYWdlcyB0byBiZSBibGluZGVkLlxuICAgICAgX3RoaXMubTEgPSBfdGhpcy5tUCA7XG4gICAgICBfdGhpcy5tMiA9IF90aGlzLm1QICsgXCI7XCIgKyB1UEs7XG4gICAgICBfdGhpcy5tMyA9IF90aGlzLm1QICsgXCI7XCIgKyBfdGhpcy5kbUM7IC8vICsgXCI7XCIgKyB1UEs7XG5cbiAgICAgIHZhciBfYm0xID0gbmV3IGJsaW5kU2lnbkNvbnRleHQoX3RoaXMubTEpO1xuICAgICAgdmFyIF9ibTIgPSBuZXcgYmxpbmRTaWduQ29udGV4dChfdGhpcy5tMik7XG4gICAgICB2YXIgX2JtMyA9IG5ldyBibGluZFNpZ25Db250ZXh0KF90aGlzLm0zKTtcblxuICAgICAgX3RoaXMucjEgPSBfYm0xLmdldEJsaW5kaW5nTm9uY2UoKTtcbiAgICAgIF90aGlzLnIyID0gX2JtMi5nZXRCbGluZGluZ05vbmNlKCk7XG4gICAgICBfdGhpcy5yMyA9IF9ibTMuZ2V0QmxpbmRpbmdOb25jZSgpO1xuXG5cbiAgICAgIC8vIEdldCBVbmJsaW5kZXIgLSB0byB1bmJsaW5kIHRoZSBtZXNzYWdlXG4gICAgICBfdGhpcy51MSA9IF9ibTEuZ2V0VW5CbGluZGVyKCk7XG4gICAgICBfdGhpcy51MiA9IF9ibTIuZ2V0VW5CbGluZGVyKCk7XG4gICAgICBfdGhpcy51MyA9IF9ibTMuZ2V0VW5CbGluZGVyKCk7XG5cbiAgICAgIC8vIEJsaW5kIHRoZSBtZXNzYWdlXG4gICAgICAgX2JtMS5ibGluZE1lc3NhZ2UoKVxuICAgICAgICAudGhlbiggYm0xID0+IHtcbiAgICAgICAgICBfdGhpcy5ibTEgPSBibTE7XG4gICAgICAgICAgcmV0dXJuIF9ibTIuYmxpbmRNZXNzYWdlKClcbiAgICAgICAgfSlcbiAgICAgICAgLnRoZW4oIGJtMiA9PiB7XG4gICAgICAgICAgX3RoaXMuYm0yID0gYm0yO1xuICAgICAgICAgIHJldHVybiBfYm0zLmJsaW5kTWVzc2FnZSgpO1xuICAgICAgICB9KVxuICAgICAgICAudGhlbiggYm0zID0+IHtcbiAgICAgICAgICBfdGhpcy5ibTMgPSBibTM7XG4gICAgICAgICAgcmVzb2x2ZSh0aGlzKTtcbiAgICAgICAgfSlcbiAgICB9KVxuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG5cbiAgdXNlclNpZ24oKXtcbiAgICBsZXQgX3RoaXMgPSB0aGlzO1xuICAgIGxldCBwcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KXtcbiAgICAgIGxldCB1UEsgPSBDbGlxelNlY3VyZU1lc3NhZ2UudVBLLnB1YmxpY0tleUI2NDtcbiAgICAgIGxldCBwYXlsb2FkTXNnID0gdVBLICsgXCI7XCIgKyBfdGhpcy5ibTEgKyBcIjtcIiArIF90aGlzLmJtMiArIFwiO1wiICsgX3RoaXMuYm0zO1xuICAgICAgbGV0IF91UEsgPSBuZXcgdXNlclBLKHBheWxvYWRNc2cpO1xuICAgICAgcmV0dXJuIF91UEsuc2lnbihwYXlsb2FkTXNnKS50aGVuKCBzaWduZWREYXRhID0+IHtcbiAgICAgICAgX3RoaXMuc2lnbmVkRGF0YSA9IHNpZ25lZERhdGE7XG4gICAgICAgIHJlc29sdmUodGhpcyk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuXG4gIHNlbmRCbGluZFBheWxvYWQoKXtcbiAgICBsZXQgX3RoaXMgPSB0aGlzO1xuICAgIGxldCBwcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KXtcbiAgICAgIHZhciBwYXlsb2FkID0gY3JlYXRlUGF5bG9hZEJsaW5kU2lnbmF0dXJlKENsaXF6U2VjdXJlTWVzc2FnZS51UEsucHVibGljS2V5QjY0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMuYm0xLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMuYm0yLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMuYm0zLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMuc2lnbmVkRGF0YSk7XG4gICAgICByZXR1cm4gX2h0dHAoQ2xpcXpTZWN1cmVNZXNzYWdlLkJMSU5EX1NJR05FUilcbiAgICAgICAgICAgICAgLnBvc3QoSlNPTi5zdHJpbmdpZnkocGF5bG9hZCkpXG4gICAgICAgICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHtcbiAgICAgICAgICAgICAgICBfdGhpcy5ic1Jlc3BvbnNlID0gSlNPTi5wYXJzZShyZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSh0aGlzKTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cblxuICB1bkJsaW5kTWVzc2FnZSgpe1xuICAgIGxldCBfdGhpcyA9IHRoaXM7XG4gICAgbGV0IHByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xuICAgICAgbGV0IHJlcyA9IF90aGlzLmJzUmVzcG9uc2U7XG4gICAgICAvLyBDYXB0dXJlIHRoZSByZXNwb25zZVxuICAgICAgdmFyIGJzMSA9IHJlc1tcImJzMVwiXTtcbiAgICAgIHZhciBiczIgPSByZXNbXCJiczJcIl07XG4gICAgICB2YXIgYnMzID0gcmVzW1wiYnMzXCJdO1xuICAgICAgdmFyIHN1UEsgPSByZXNbXCJzdVBLXCJdO1xuXG4gICAgICAvLyBVbmJsaW5kIHRoZSBtZXNzYWdlIHRvIGdldCB0aGUgc2lnbmF0dXJlLlxuICAgICAgX3RoaXMudXMxID0gdW5CbGluZE1lc3NhZ2UoYnMxLCBfdGhpcy51MSk7XG4gICAgICBfdGhpcy51czIgPSB1bkJsaW5kTWVzc2FnZShiczIsIF90aGlzLnUyKTtcbiAgICAgIF90aGlzLnVzMyA9IHVuQmxpbmRNZXNzYWdlKGJzMywgX3RoaXMudTMpO1xuICAgICAgX3RoaXMuc3VQSyA9IHN1UEs7XG4gICAgICByZXNvbHZlKHRoaXMpO1xuICAgIH0pO1xuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG5cbiBzaWduVW5ibGluZGVkTWVzc2FnZSgpe1xuICAgIGxldCBfdGhpcyA9IHRoaXM7XG4gICAgbGV0IHByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xuICAgICAgbGV0IHBheWxvYWQgPSBDbGlxelNlY3VyZU1lc3NhZ2UudVBLLnB1YmxpY0tleUI2NCArIFwiO1wiICsgX3RoaXMubVAgK1wiO1wiKyAgX3RoaXMuZG1DICsgXCI7XCIgKyBfdGhpcy51czEgKyBcIjtcIiArIF90aGlzLnVzMiArIFwiO1wiICsgX3RoaXMudXMzO1xuICAgICAgbGV0IF91UEsgPSBuZXcgdXNlclBLKHBheWxvYWQpO1xuICAgICAgICByZXR1cm4gX3VQSy5zaWduKHBheWxvYWQpLnRoZW4oc2lnbmVkTWVzc2FnZVByb3h5ID0+IHtcbiAgICAgICAgICBfdGhpcy5zaWduZWRNZXNzYWdlUHJveHkgPSBzaWduZWRNZXNzYWdlUHJveHk7XG4gICAgICAgICAgcmVzb2x2ZSh0aGlzKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cblxuICBzZW5kTWVzc2FnZVByb3h5KCl7XG4gICAgbGV0IF90aGlzID0gdGhpcztcbiAgICBsZXQgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCl7XG4gICAgICBsZXQgcGF5bG9hZCA9IGNyZWF0ZVBheWxvYWRQcm94eShDbGlxelNlY3VyZU1lc3NhZ2UudVBLLnB1YmxpY0tleUI2NCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMuc3VQSyAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLm1QLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5kbUMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLnVzMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMudXMyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy51czMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLnNpZ25lZE1lc3NhZ2VQcm94eSk7XG4gICAgICByZXR1cm4gX2h0dHAoX3RoaXMucHJveHlDb29yZGluYXRvcilcbiAgICAgICAgICAgICAgLnBvc3QoSlNPTi5zdHJpbmdpZnkocGF5bG9hZCkpXG4gICAgICAgICAgICAgIC50aGVuKCgpID0+IHJlc29sdmUodGhpcykpXG4gICAgICAgICAgICAgIC5jYXRjaChlcnIgPT4ge1xuICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgICB9KTtcbiAgICB9KTtcbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuXG4gIHNhdmVMb2NhbENoZWNrVGFibGUoKXtcbiAgICBsZXQgX3RoaXMgPSB0aGlzO1xuICAgIGxldCBwcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KXtcbiAgICAgIC8vIFNhdmUgdGhlIGhhc2ggaW4gdGVtcG9yYWwgdW5pcXVlIHF1ZXVlLlxuICAgICAgdmFyIHR0ID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgICBsb2NhbFRlbXBvcmFsVW5pcVtfdGhpcy5kbUNdID0ge1widHNcIjp0dCwgXCJmdWxsaGFzaFwiOiBfdGhpcy5mdWxsSGFzaH07XG4gICAgICByZXNvbHZlKHRoaXMpO1xuICAgIH0pO1xuICAgIHJldHVybiBwcm9taXNlO1xuXG4gIH1cbiAgcXVlcnkoKXtcbiAgICBsZXQgX3RoaXMgPSB0aGlzO1xuICAgIGxldCBwcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KXtcbiAgICAgIF90aGlzLmFlc0VuY3J5cHQoKS50aGVuKCBlID0+IHtcbiAgICAgICAgcmV0dXJuIF90aGlzLnNpZ25LZXkoKTtcbiAgICAgIH0pLnRoZW4oIGUgPT4ge1xuICAgICAgICBsZXQgZGF0YSA9IHtcIm1QXCI6X3RoaXMuZ2V0TVAoKX07XG4gICAgICAgIHJldHVybiBfaHR0cChDbGlxelNlY3VyZU1lc3NhZ2UucXVlcnlQcm94eUlQKVxuICAgICAgICAgICAgLnBvc3QoSlNPTi5zdHJpbmdpZnkoZGF0YSksIFwiaW5zdGFudFwiKTtcbiAgICAgICAgfSkudGhlbiAoIHJlcyA9PiB7XG4gICAgICAgICAgICAvLyBHb3QgcmVzcG9uc2UsIGxldCdzIGRlY3J5cHQgaXQuXG4gICAgICAgICAgICBfdGhpcy5hZXNEZWNyeXB0KEpTT04ucGFyc2UocmVzKVtcImRhdGFcIl0pLnRoZW4oIGRlY3J5cHRlZFJlcyA9PiB7XG4gICAgICAgICAgICAgIHJlc29sdmUoZGVjcnlwdGVkUmVzKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KS5jYXRjaCggZXJyID0+IF90aGlzLmxvZyhlcnIpKTtcbiAgICB9KTtcbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuXG4gIGVuY3J5cHRlZFRlbGVtZXRyeSgpe1xuICAgIGxldCBfdGhpcyA9IHRoaXM7XG4gICAgbGV0IHByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xuICAgICAgdHJ5e1xuICAgICAgICByZXR1cm4gX3RoaXMuZ2V0cHJveHlDb29yZGluYXRvcigpXG4gICAgICAgICAgLnRoZW4oKCkgPT4gX3RoaXMuY2hlY2tMb2NhbFVuaXEoKSlcbiAgICAgICAgICAudGhlbigoKSA9PiBfdGhpcy5hZXNFbmNyeXB0KFwidGVsZW1ldHJ5XCIpKVxuICAgICAgICAgIC50aGVuKCgpID0+IF90aGlzLnNpZ25LZXkoKSlcbiAgICAgICAgICAudGhlbigoKSA9PiBfdGhpcy5ibGluZE1lc3NhZ2UoKSlcbiAgICAgICAgICAudGhlbigoKSA9PiBfdGhpcy51c2VyU2lnbigpKVxuICAgICAgICAgIC50aGVuKCgpID0+IF90aGlzLnNlbmRCbGluZFBheWxvYWQoKSlcbiAgICAgICAgICAudGhlbigoKSA9PiBfdGhpcy51bkJsaW5kTWVzc2FnZSgpKVxuICAgICAgICAgIC50aGVuKCgpID0+IF90aGlzLnNpZ25VbmJsaW5kZWRNZXNzYWdlKCkpXG4gICAgICAgICAgLnRoZW4oKCkgPT4gX3RoaXMuc2VuZE1lc3NhZ2VQcm94eSgpKVxuICAgICAgICAgIC50aGVuKCgpID0+IF90aGlzLnNhdmVMb2NhbENoZWNrVGFibGUoKSlcbiAgICAgICAgICAudGhlbigoKSA9PiByZXNvbHZlKHRydWUpKVxuICAgICAgICAgIC5jYXRjaCggZXJyID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGNhdGNoIChlcnIpe1xuICAgICAgICBjb25zb2xlLmxvZyhcIkVycm9yIGNyZWF0aW5nIG1jOiBcIiArIGVycik7XG4gICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG59O1xuIl19