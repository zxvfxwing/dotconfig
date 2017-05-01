System.register(['bigint', './index', './crypto-utils'], function (_export) {
    'use strict';

    var randBigInt, CliqzSecureMessage, base64_decode, base64UrlDecode, byteArrayToHexString, stringToByteArray, h2d, blindSignContext;

    _export('parseDSKey', parseDSKey);

    _export('unBlindMessage', unBlindMessage);

    function parseDSKey() {
        // Parse key contents.
        var _this = this;
        return new Promise(function (resolve, reject) {
            crypto.subtle.importKey('spki', base64_decode(CliqzSecureMessage.dsPK.pubKeyB64), {
                name: 'RSA-OAEP',
                hash: { name: 'SHA-1' }
            }, true, ['encrypt']).then(function (key) {
                crypto.subtle.exportKey("jwk", key).then(function (key) {
                    // base64url-decode modulus
                    var modulus = base64UrlDecode(key.n);
                    CliqzSecureMessage.dsPK["n"] = h2d(byteArrayToHexString(modulus));
                    // base64url-decode exponent
                    var exponent = base64UrlDecode(key.e);
                    CliqzSecureMessage.dsPK["e"] = '' + h2d(byteArrayToHexString(exponent));
                    resolve();
                    // modulus and exponent are now Uint8Arrays
                })['catch'](function (err) {
                    return console.log(err);
                });
            });
        });
    }

    function unBlindMessage(blindSignedMessage, unBlinder) {
        // Unblind the message before sending it for verification.
        // s = u*(bs) mod n
        var _us = multMod(unBlinder, str2bigInt(blindSignedMessage, 16), str2bigInt(CliqzSecureMessage.dsPK.n, 10));
        var us = bigInt2str(_us, 10, 0);
        return us;
    }

    function verifyBlindSignature(signedMessage, hashedOriginalMessage) {
        // Verify the message to see, the signer is not the problem.
        // m = s^e mod n

        var message_signed = bigInt2str(powMod(str2bigInt(signedMessage, 10, 0), str2bigInt(CliqzSecureMessage.dsPK.e, 10), str2bigInt(CliqzSecureMessage.dsPK.n, 10)), 10);
        var original_message = bigInt2str(str2bigInt(hashedOriginalMessage, 16), 10);

        if (original_message === message_signed.toLowerCase()) {
            return true;
        } else {
            return false;
        }
    }
    // Set the context for blind signatures right.
    return {
        setters: [function (_bigint) {
            randBigInt = _bigint.randBigInt;
        }, function (_index) {
            CliqzSecureMessage = _index['default'];
        }, function (_cryptoUtils) {
            base64_decode = _cryptoUtils.base64_decode;
            base64UrlDecode = _cryptoUtils.base64UrlDecode;
            byteArrayToHexString = _cryptoUtils.byteArrayToHexString;
            stringToByteArray = _cryptoUtils.stringToByteArray;
            h2d = _cryptoUtils.h2d;
        }],
        execute: function () {
            blindSignContext = function blindSignContext(msg) {
                /*
                Initialize it with the following:
                1. Signer Public Key
                2. Signer Public Exponent
                3. Signer Public Modulous
                */

                // this.keyObj = new JSEncrypt();
                this.randomNumber = null;
                this.blindingNonce = null;
                this.blinder = null;
                this.unblinder = null;
                this.keySize = 4096;
                this.hashedMessage = "";
                this.bm = "";
                this.signedMessage = "";
                this.msg = msg;
            };

            _export('blindSignContext', blindSignContext);

            blindSignContext.prototype.exponent = function () {
                // Return the public exponent
                return this.e;
            };

            blindSignContext.prototype.modulus = function () {
                // Return the public modulous
                return this.n;
            };

            blindSignContext.prototype.log = function (msg) {
                console.log(msg, "Blind Signature");
            };

            blindSignContext.prototype.hashMessage = function () {
                // Need sha256 digest the message.
                var _this = this;
                var promise = new Promise(function (resolve, reject) {
                    crypto.subtle.digest("SHA-256", stringToByteArray(_this.msg)).then(function (hash) {
                        resolve(byteArrayToHexString(new Uint8Array(hash)));
                    });
                });
                return promise;
                /*
                var msg = this.msg;
                this.hashedMessage = sha256_digest(msg);
                return this.hashedMessage;
                */
            };

            blindSignContext.prototype.getBlindingNonce = function () {
                // Create a random value.

                var randomNumber = randBigInt(this.keySize, 1);
                this.blindingNonce = randomNumber;
                return randomNumber;
            };

            blindSignContext.prototype.getBlinder = function () {
                // Calculate blinder.
                // b = r ^ e mod n
                var b = powMod(this.blindingNonce, str2bigInt(CliqzSecureMessage.dsPK.e, 10), str2bigInt(CliqzSecureMessage.dsPK.n, 10));
                this.blinder = b;
                return b;
            };

            blindSignContext.prototype.getUnBlinder = function () {
                // Calculate blinder.
                // b = r ^ e mod n
                var u = inverseMod(this.blindingNonce, str2bigInt(CliqzSecureMessage.dsPK.n, 10));
                this.unblinder = u;
                return u;
            };

            blindSignContext.prototype.blindMessage = function () {
                // Blind the message before sending it for signing.
                // bm = b*m mod n
                var _this = this;
                var promise = new Promise(function (resolve, reject) {
                    _this.hashMessage().then(function (hashMessage) {
                        // var rnd = this.getBlindingNonce();
                        var blinder = _this.getBlinder();
                        var bm = multMod(blinder, str2bigInt(hashMessage, 16), str2bigInt(CliqzSecureMessage.dsPK.n, 10));
                        _this.bm = bigInt2str(bm, 10);
                        resolve(_this.bm);
                    });
                });
                return promise;
            };

            blindSignContext.prototype.unBlindMessage = function (blindSignedMessage) {
                // Unblind the message before sending it for verification.
                // s = u*(bs) mod n

                var bs = blindSignedMessage;
                var us = multMod(this.unblinder, str2bigInt(bs, 16), str2bigInt(CliqzSecureMessage.dsPK.n, 10));
                var us = bigInt2str(_us, 10, 0);
                this.signedMessage = us;
                return us;
            };

            blindSignContext.prototype.verify = function () {
                // Verify the message to see, the signer is not the problem.
                // m = s^e mod n
                var _this = this;
                return new Promise(function (resolve, reject) {
                    var message_signed = bigInt2str(powMod(str2bigInt(_this.signedMessage, 10, 0), str2bigInt(_this.e, 10), str2bigInt(_this.n, 10)), 10);
                    var original_message = bigInt2str(str2bigInt(_this.hashedMessage, 16), 10);
                    // var original_message = _this.hashedMessage;
                    _this.log("Org message:" + original_message);
                    _this.log("Sign message:" + message_signed);
                    if (original_message === message_signed.toLowerCase()) {
                        resolve(true);
                    } else {
                        // Need to replace this with reject.
                        resolve(false);
                    }
                });
            };
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImhwbi93b3JrZXIvYmxpbmQtc2lnbmF0dXJlLmVzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztzSEErRFcsZ0JBQWdCOzs7Ozs7QUFyRHBCLGFBQVMsVUFBVSxHQUFFOztBQUV4QixZQUFJLEtBQUssR0FBRyxJQUFJLENBQUM7QUFDakIsZUFBTyxJQUFJLE9BQU8sQ0FBQyxVQUFTLE9BQU8sRUFBRSxNQUFNLEVBQUM7QUFDeEMsa0JBQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUN0QixNQUFNLEVBQ0wsYUFBYSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsRUFDaEQ7QUFDRSxvQkFBSSxFQUFFLFVBQVU7QUFDaEIsb0JBQUksRUFBRSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUU7YUFDeEIsRUFDRCxJQUFJLEVBQ0osQ0FBQyxTQUFTLENBQUMsQ0FDWixDQUFDLElBQUksQ0FBRSxVQUFBLEdBQUcsRUFBRztBQUNaLHNCQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUNwQyxVQUFTLEdBQUcsRUFBRTs7QUFFWix3QkFBSSxPQUFPLEdBQUcsZUFBZSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNyQyxzQ0FBa0IsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDLG9CQUFvQixDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7O0FBRWxFLHdCQUFJLFFBQVEsR0FBRyxlQUFlLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3RDLHNDQUFrQixDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsR0FBRyxDQUFDLG9CQUFvQixDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7QUFDeEUsMkJBQU8sRUFBRSxDQUFDOztpQkFFZixDQUFDLFNBQ0ksQ0FBQyxVQUFBLEdBQUc7MkJBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxH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QixDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsWUFBVTs7O0FBRzFDLG9CQUFJLEtBQUssR0FBRyxJQUFJLENBQUM7QUFDakIsdUJBQU8sSUFBSSxPQUFPLENBQUMsVUFBUyxPQUFPLEVBQUUsTUFBTSxFQUFDO0FBQ3hDLHdCQUFJLGNBQWMsR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsYUFBYSxFQUFDLEVBQUUsRUFBQyxDQUFDLENBQUMsRUFBRSxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ25JLHdCQUFJLGdCQUFnQixHQUFHLFVBQVUsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLGFBQWEsRUFBQyxFQUFFLENBQUMsRUFBQyxFQUFFLENBQUMsQ0FBQzs7QUFFekUseUJBQUssQ0FBQyxHQUFHLENBQUMsY0FBYyxHQUFHLGdCQUFnQixDQUFDLENBQUM7QUFDN0MseUJBQUssQ0FBQyxHQUFHLENBQUMsZUFBZSxHQUFHLGNBQWMsQ0FBQyxDQUFDO0FBQzVDLHdCQUFHLGdCQUFnQixLQUFLLGNBQWMsQ0FBQyxXQUFXLEVBQUUsRUFBQztBQUNqRCwrQkFBTyxDQUFDLElBQUksQ0FBQyxDQUFDO3FCQUNqQixNQUNHOztBQUVBLCtCQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7cUJBQ2xCO2lCQUVKLENBQUMsQ0FBQTthQUVMLENBQUEiLCJmaWxlIjoiaHBuL3dvcmtlci9ibGluZC1zaWduYXR1cmUuZXMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyByYW5kQmlnSW50IH0gZnJvbSAnYmlnaW50JztcbmltcG9ydCBDbGlxelNlY3VyZU1lc3NhZ2UgZnJvbSAnLi9pbmRleCc7XG5pbXBvcnQge1xuICBiYXNlNjRfZGVjb2RlLFxuICBiYXNlNjRVcmxEZWNvZGUsXG4gIGJ5dGVBcnJheVRvSGV4U3RyaW5nLFxuICBzdHJpbmdUb0J5dGVBcnJheSxcbiAgaDJkXG59IGZyb20gJy4vY3J5cHRvLXV0aWxzJztcblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlRFNLZXkoKXtcbiAgICAvLyBQYXJzZSBrZXkgY29udGVudHMuXG4gICAgdmFyIF90aGlzID0gdGhpcztcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KXtcbiAgICAgICAgY3J5cHRvLnN1YnRsZS5pbXBvcnRLZXkoXG4gICAgICAgICAnc3BraScsXG4gICAgICAgICAgYmFzZTY0X2RlY29kZShDbGlxelNlY3VyZU1lc3NhZ2UuZHNQSy5wdWJLZXlCNjQpLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6ICdSU0EtT0FFUCcsXG4gICAgICAgICAgICBoYXNoOiB7IG5hbWU6ICdTSEEtMScgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgdHJ1ZSxcbiAgICAgICAgICBbJ2VuY3J5cHQnXVxuICAgICAgICApLnRoZW4oIGtleT0+IHtcbiAgICAgICAgICBjcnlwdG8uc3VidGxlLmV4cG9ydEtleShcImp3a1wiLCBrZXkpLnRoZW4oXG4gICAgICAgICAgICAgIGZ1bmN0aW9uKGtleSkge1xuICAgICAgICAgICAgICAgIC8vIGJhc2U2NHVybC1kZWNvZGUgbW9kdWx1c1xuICAgICAgICAgICAgICAgIHZhciBtb2R1bHVzID0gYmFzZTY0VXJsRGVjb2RlKGtleS5uKTtcbiAgICAgICAgICAgICAgICBDbGlxelNlY3VyZU1lc3NhZ2UuZHNQS1tcIm5cIl0gPSBoMmQoYnl0ZUFycmF5VG9IZXhTdHJpbmcobW9kdWx1cykpO1xuICAgICAgICAgICAgICAgIC8vIGJhc2U2NHVybC1kZWNvZGUgZXhwb25lbnRcbiAgICAgICAgICAgICAgICB2YXIgZXhwb25lbnQgPSBiYXNlNjRVcmxEZWNvZGUoa2V5LmUpO1xuICAgICAgICAgICAgICAgIENsaXF6U2VjdXJlTWVzc2FnZS5kc1BLW1wiZVwiXSA9ICcnICsgaDJkKGJ5dGVBcnJheVRvSGV4U3RyaW5nKGV4cG9uZW50KSk7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgIC8vIG1vZHVsdXMgYW5kIGV4cG9uZW50IGFyZSBub3cgVWludDhBcnJheXNcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdW5CbGluZE1lc3NhZ2UoYmxpbmRTaWduZWRNZXNzYWdlLCB1bkJsaW5kZXIpe1xuICAvLyBVbmJsaW5kIHRoZSBtZXNzYWdlIGJlZm9yZSBzZW5kaW5nIGl0IGZvciB2ZXJpZmljYXRpb24uXG4gIC8vIHMgPSB1KihicykgbW9kIG5cbiAgdmFyIF91cyA9IG11bHRNb2QodW5CbGluZGVyLCBzdHIyYmlnSW50KGJsaW5kU2lnbmVkTWVzc2FnZSwgMTYpLCBzdHIyYmlnSW50KENsaXF6U2VjdXJlTWVzc2FnZS5kc1BLLm4sIDEwKSk7XG4gIHZhciB1cyA9IGJpZ0ludDJzdHIoX3VzLDEwLCAwKTtcbiAgcmV0dXJuIHVzO1xufVxuXG5mdW5jdGlvbiB2ZXJpZnlCbGluZFNpZ25hdHVyZShzaWduZWRNZXNzYWdlLCBoYXNoZWRPcmlnaW5hbE1lc3NhZ2Upe1xuICAgIC8vIFZlcmlmeSB0aGUgbWVzc2FnZSB0byBzZWUsIHRoZSBzaWduZXIgaXMgbm90IHRoZSBwcm9ibGVtLlxuICAgIC8vIG0gPSBzXmUgbW9kIG5cblxuICAgIHZhciBtZXNzYWdlX3NpZ25lZCA9IGJpZ0ludDJzdHIocG93TW9kKHN0cjJiaWdJbnQoc2lnbmVkTWVzc2FnZSwxMCwwKSwgc3RyMmJpZ0ludChDbGlxelNlY3VyZU1lc3NhZ2UuZHNQSy5lLCAxMCksIHN0cjJiaWdJbnQoQ2xpcXpTZWN1cmVNZXNzYWdlLmRzUEsubiwgMTApKSwxMCk7XG4gICAgdmFyIG9yaWdpbmFsX21lc3NhZ2UgPSBiaWdJbnQyc3RyKHN0cjJiaWdJbnQoaGFzaGVkT3JpZ2luYWxNZXNzYWdlLDE2KSwxMCk7XG5cbiAgICBpZihvcmlnaW5hbF9tZXNzYWdlID09PSBtZXNzYWdlX3NpZ25lZC50b0xvd2VyQ2FzZSgpKXtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGVsc2V7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG59XG4vLyBTZXQgdGhlIGNvbnRleHQgZm9yIGJsaW5kIHNpZ25hdHVyZXMgcmlnaHQuXG5leHBvcnQgbGV0IGJsaW5kU2lnbkNvbnRleHQgPSBmdW5jdGlvbiAobXNnKSB7XG4gICAgLypcbiAgICBJbml0aWFsaXplIGl0IHdpdGggdGhlIGZvbGxvd2luZzpcbiAgICAxLiBTaWduZXIgUHVibGljIEtleVxuICAgIDIuIFNpZ25lciBQdWJsaWMgRXhwb25lbnRcbiAgICAzLiBTaWduZXIgUHVibGljIE1vZHVsb3VzXG4gICAgKi9cblxuICAgIC8vIHRoaXMua2V5T2JqID0gbmV3IEpTRW5jcnlwdCgpO1xuICAgIHRoaXMucmFuZG9tTnVtYmVyID0gbnVsbDtcbiAgICB0aGlzLmJsaW5kaW5nTm9uY2UgPSBudWxsO1xuICAgIHRoaXMuYmxpbmRlciA9IG51bGw7XG4gICAgdGhpcy51bmJsaW5kZXIgPSBudWxsO1xuICAgIHRoaXMua2V5U2l6ZSA9IDQwOTY7XG4gICAgdGhpcy5oYXNoZWRNZXNzYWdlID0gXCJcIjtcbiAgICB0aGlzLmJtID0gXCJcIjtcbiAgICB0aGlzLnNpZ25lZE1lc3NhZ2UgPSBcIlwiO1xuICAgIHRoaXMubXNnID0gbXNnO1xufVxuXG5ibGluZFNpZ25Db250ZXh0LnByb3RvdHlwZS5leHBvbmVudCA9IGZ1bmN0aW9uKCl7XG4gICAgLy8gUmV0dXJuIHRoZSBwdWJsaWMgZXhwb25lbnRcbiAgICByZXR1cm4gdGhpcy5lO1xufVxuXG5ibGluZFNpZ25Db250ZXh0LnByb3RvdHlwZS5tb2R1bHVzID0gZnVuY3Rpb24oKXtcbiAgICAvLyBSZXR1cm4gdGhlIHB1YmxpYyBtb2R1bG91c1xuICAgIHJldHVybiB0aGlzLm47XG59XG5cbmJsaW5kU2lnbkNvbnRleHQucHJvdG90eXBlLmxvZyA9ICBmdW5jdGlvbihtc2cpe1xuICBjb25zb2xlLmxvZyhtc2csIFwiQmxpbmQgU2lnbmF0dXJlXCIpO1xuXG59XG5cbmJsaW5kU2lnbkNvbnRleHQucHJvdG90eXBlLmhhc2hNZXNzYWdlID0gZnVuY3Rpb24oKXtcbiAgICAvLyBOZWVkIHNoYTI1NiBkaWdlc3QgdGhlIG1lc3NhZ2UuXG4gICAgbGV0IF90aGlzID0gdGhpcztcbiAgICBsZXQgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCl7XG4gICAgICBjcnlwdG8uc3VidGxlLmRpZ2VzdChcIlNIQS0yNTZcIiwgc3RyaW5nVG9CeXRlQXJyYXkoX3RoaXMubXNnKSkudGhlbiggaGFzaCA9PiB7XG4gICAgICAgIHJlc29sdmUoYnl0ZUFycmF5VG9IZXhTdHJpbmcobmV3IFVpbnQ4QXJyYXkoaGFzaCkpKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIHJldHVybiBwcm9taXNlO1xuICAgIC8qXG4gICAgdmFyIG1zZyA9IHRoaXMubXNnO1xuICAgIHRoaXMuaGFzaGVkTWVzc2FnZSA9IHNoYTI1Nl9kaWdlc3QobXNnKTtcbiAgICByZXR1cm4gdGhpcy5oYXNoZWRNZXNzYWdlO1xuICAgICovXG59XG5cbmJsaW5kU2lnbkNvbnRleHQucHJvdG90eXBlLmdldEJsaW5kaW5nTm9uY2UgPSBmdW5jdGlvbigpe1xuICAgIC8vIENyZWF0ZSBhIHJhbmRvbSB2YWx1ZS5cblxuICAgIHZhciByYW5kb21OdW1iZXIgPSByYW5kQmlnSW50KHRoaXMua2V5U2l6ZSwxKTtcbiAgICB0aGlzLmJsaW5kaW5nTm9uY2UgPSByYW5kb21OdW1iZXI7XG4gICAgcmV0dXJuIHJhbmRvbU51bWJlcjtcbn1cblxuYmxpbmRTaWduQ29udGV4dC5wcm90b3R5cGUuZ2V0QmxpbmRlciA9IGZ1bmN0aW9uKCl7XG4gICAgLy8gQ2FsY3VsYXRlIGJsaW5kZXIuXG4gICAgLy8gYiA9IHIgXiBlIG1vZCBuXG4gICAgdmFyIGIgPSBwb3dNb2QodGhpcy5ibGluZGluZ05vbmNlLCBzdHIyYmlnSW50KENsaXF6U2VjdXJlTWVzc2FnZS5kc1BLLmUsIDEwKSwgc3RyMmJpZ0ludChDbGlxelNlY3VyZU1lc3NhZ2UuZHNQSy5uLCAxMCkpO1xuICAgIHRoaXMuYmxpbmRlciA9IGI7XG4gICAgcmV0dXJuIGI7XG59XG5cbmJsaW5kU2lnbkNvbnRleHQucHJvdG90eXBlLmdldFVuQmxpbmRlciA9IGZ1bmN0aW9uKCl7XG4gICAgLy8gQ2FsY3VsYXRlIGJsaW5kZXIuXG4gICAgLy8gYiA9IHIgXiBlIG1vZCBuXG4gICAgdmFyIHUgPSBpbnZlcnNlTW9kKHRoaXMuYmxpbmRpbmdOb25jZSwgc3RyMmJpZ0ludChDbGlxelNlY3VyZU1lc3NhZ2UuZHNQSy5uLCAxMCkpO1xuICAgIHRoaXMudW5ibGluZGVyID0gdTtcbiAgICByZXR1cm4gdTtcbn1cblxuYmxpbmRTaWduQ29udGV4dC5wcm90b3R5cGUuYmxpbmRNZXNzYWdlID0gZnVuY3Rpb24oKXtcbiAgICAvLyBCbGluZCB0aGUgbWVzc2FnZSBiZWZvcmUgc2VuZGluZyBpdCBmb3Igc2lnbmluZy5cbiAgICAvLyBibSA9IGIqbSBtb2QgblxuICAgIGxldCBfdGhpcyA9IHRoaXM7XG4gICAgbGV0IHByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xuICAgICAgX3RoaXMuaGFzaE1lc3NhZ2UoKS50aGVuKCBoYXNoTWVzc2FnZSA9PiB7XG4gICAgICAgIC8vIHZhciBybmQgPSB0aGlzLmdldEJsaW5kaW5nTm9uY2UoKTtcbiAgICAgICAgdmFyIGJsaW5kZXIgPSBfdGhpcy5nZXRCbGluZGVyKCk7XG4gICAgICAgIHZhciBibSA9IG11bHRNb2QoYmxpbmRlciwgc3RyMmJpZ0ludChoYXNoTWVzc2FnZSwgMTYpLCBzdHIyYmlnSW50KENsaXF6U2VjdXJlTWVzc2FnZS5kc1BLLm4sIDEwKSk7XG4gICAgICAgIF90aGlzLmJtID0gYmlnSW50MnN0cihibSwgMTApO1xuICAgICAgICByZXNvbHZlKF90aGlzLmJtKTtcbiAgICAgIH0pO1xuICAgIH0pXG4gICAgcmV0dXJuIHByb21pc2U7XG59XG5cblxuYmxpbmRTaWduQ29udGV4dC5wcm90b3R5cGUudW5CbGluZE1lc3NhZ2UgPSBmdW5jdGlvbihibGluZFNpZ25lZE1lc3NhZ2Upe1xuICAgIC8vIFVuYmxpbmQgdGhlIG1lc3NhZ2UgYmVmb3JlIHNlbmRpbmcgaXQgZm9yIHZlcmlmaWNhdGlvbi5cbiAgICAvLyBzID0gdSooYnMpIG1vZCBuXG5cbiAgICB2YXIgYnMgPSBibGluZFNpZ25lZE1lc3NhZ2U7XG4gICAgdmFyIHVzID0gbXVsdE1vZCh0aGlzLnVuYmxpbmRlciwgc3RyMmJpZ0ludChicywgMTYpLCBzdHIyYmlnSW50KENsaXF6U2VjdXJlTWVzc2FnZS5kc1BLLm4sIDEwKSk7XG4gICAgdmFyIHVzID0gYmlnSW50MnN0cihfdXMsMTAsIDApXG4gICAgdGhpcy5zaWduZWRNZXNzYWdlID0gdXM7XG4gICAgcmV0dXJuIHVzO1xufVxuXG5ibGluZFNpZ25Db250ZXh0LnByb3RvdHlwZS52ZXJpZnkgPSBmdW5jdGlvbigpe1xuICAgIC8vIFZlcmlmeSB0aGUgbWVzc2FnZSB0byBzZWUsIHRoZSBzaWduZXIgaXMgbm90IHRoZSBwcm9ibGVtLlxuICAgIC8vIG0gPSBzXmUgbW9kIG5cbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xuICAgICAgICB2YXIgbWVzc2FnZV9zaWduZWQgPSBiaWdJbnQyc3RyKHBvd01vZChzdHIyYmlnSW50KF90aGlzLnNpZ25lZE1lc3NhZ2UsMTAsMCksIHN0cjJiaWdJbnQoX3RoaXMuZSwgMTApLCBzdHIyYmlnSW50KF90aGlzLm4sIDEwKSksMTApO1xuICAgICAgICB2YXIgb3JpZ2luYWxfbWVzc2FnZSA9IGJpZ0ludDJzdHIoc3RyMmJpZ0ludChfdGhpcy5oYXNoZWRNZXNzYWdlLDE2KSwxMCk7XG4gICAgICAgIC8vIHZhciBvcmlnaW5hbF9tZXNzYWdlID0gX3RoaXMuaGFzaGVkTWVzc2FnZTtcbiAgICAgICAgX3RoaXMubG9nKFwiT3JnIG1lc3NhZ2U6XCIgKyBvcmlnaW5hbF9tZXNzYWdlKTtcbiAgICAgICAgX3RoaXMubG9nKFwiU2lnbiBtZXNzYWdlOlwiICsgbWVzc2FnZV9zaWduZWQpO1xuICAgICAgICBpZihvcmlnaW5hbF9tZXNzYWdlID09PSBtZXNzYWdlX3NpZ25lZC50b0xvd2VyQ2FzZSgpKXtcbiAgICAgICAgICAgIHJlc29sdmUodHJ1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZXtcbiAgICAgICAgICAgIC8vIE5lZWQgdG8gcmVwbGFjZSB0aGlzIHdpdGggcmVqZWN0LlxuICAgICAgICAgICAgcmVzb2x2ZShmYWxzZSk7XG4gICAgICAgIH1cblxuICAgIH0pXG5cbn1cbiJdfQ==