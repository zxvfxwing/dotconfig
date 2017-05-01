!function(e){function r(e,r,o){return 4===arguments.length?t.apply(this,arguments):void n(e,{declarative:!0,deps:r,declare:o})}function t(e,r,t,o){n(e,{declarative:!1,deps:r,executingRequire:t,execute:o})}function n(e,r){r.name=e,e in v||(v[e]=r),r.normalizedDeps=r.deps}function o(e,r){if(r[e.groupIndex]=r[e.groupIndex]||[],-1==g.call(r[e.groupIndex],e)){r[e.groupIndex].push(e);for(var t=0,n=e.normalizedDeps.length;n>t;t++){var a=e.normalizedDeps[t],u=v[a];if(u&&!u.evaluated){var d=e.groupIndex+(u.declarative!=e.declarative);if(void 0===u.groupIndex||u.groupIndex<d){if(void 0!==u.groupIndex&&(r[u.groupIndex].splice(g.call(r[u.groupIndex],u),1),0==r[u.groupIndex].length))throw new TypeError("Mixed dependency cycle detected");u.groupIndex=d}o(u,r)}}}}function a(e){var r=v[e];r.groupIndex=0;var t=[];o(r,t);for(var n=!!r.declarative==t.length%2,a=t.length-1;a>=0;a--){for(var u=t[a],i=0;i<u.length;i++){var s=u[i];n?d(s):l(s)}n=!n}}function u(e){return y[e]||(y[e]={name:e,dependencies:[],exports:{},importers:[]})}function d(r){if(!r.module){var t=r.module=u(r.name),n=r.module.exports,o=r.declare.call(e,function(e,r){if(t.locked=!0,"object"==typeof e)for(var o in e)n[o]=e[o];else n[e]=r;for(var a=0,u=t.importers.length;u>a;a++){var d=t.importers[a];if(!d.locked)for(var i=0;i<d.dependencies.length;++i)d.dependencies[i]===t&&d.setters[i](n)}return t.locked=!1,r},{id:r.name});t.setters=o.setters,t.execute=o.execute;for(var a=0,i=r.normalizedDeps.length;i>a;a++){var l,s=r.normalizedDeps[a],c=v[s],f=y[s];f?l=f.exports:c&&!c.declarative?l=c.esModule:c?(d(c),f=c.module,l=f.exports):l=p(s),f&&f.importers?(f.importers.push(t),t.dependencies.push(f)):t.dependencies.push(null),t.setters[a]&&t.setters[a](l)}}}function i(e){var r,t=v[e];if(t)t.declarative?f(e,[]):t.evaluated||l(t),r=t.module.exports;else if(r=p(e),!r)throw new Error("Unable to load dependency "+e+".");return(!t||t.declarative)&&r&&r.__useDefault?r["default"]:r}function l(r){if(!r.module){var t={},n=r.module={exports:t,id:r.name};if(!r.executingRequire)for(var o=0,a=r.normalizedDeps.length;a>o;o++){var u=r.normalizedDeps[o],d=v[u];d&&l(d)}r.evaluated=!0;var c=r.execute.call(e,function(e){for(var t=0,n=r.deps.length;n>t;t++)if(r.deps[t]==e)return i(r.normalizedDeps[t]);throw new TypeError("Module "+e+" not declared as a dependency.")},t,n);void 0!==c&&(n.exports=c),t=n.exports,t&&t.__esModule?r.esModule=t:r.esModule=s(t)}}function s(r){var t={};if(("object"==typeof r||"function"==typeof r)&&r!==e)if(m)for(var n in r)"default"!==n&&c(t,r,n);else{var o=r&&r.hasOwnProperty;for(var n in r)"default"===n||o&&!r.hasOwnProperty(n)||(t[n]=r[n])}return t["default"]=r,x(t,"__useDefault",{value:!0}),t}function c(e,r,t){try{var n;(n=Object.getOwnPropertyDescriptor(r,t))&&x(e,t,n)}catch(o){return e[t]=r[t],!1}}function f(r,t){var n=v[r];if(n&&!n.evaluated&&n.declarative){t.push(r);for(var o=0,a=n.normalizedDeps.length;a>o;o++){var u=n.normalizedDeps[o];-1==g.call(t,u)&&(v[u]?f(u,t):p(u))}n.evaluated||(n.evaluated=!0,n.module.execute.call(e))}}function p(e){if(I[e])return I[e];if("@node/"==e.substr(0,6))return I[e]=s(D(e.substr(6)));var r=v[e];if(!r)throw"Module "+e+" not present.";return a(e),f(e,[]),v[e]=void 0,r.declarative&&x(r.module.exports,"__esModule",{value:!0}),I[e]=r.declarative?r.module.exports:r.esModule}var v={},g=Array.prototype.indexOf||function(e){for(var r=0,t=this.length;t>r;r++)if(this[r]===e)return r;return-1},m=!0;try{Object.getOwnPropertyDescriptor({a:0},"a")}catch(h){m=!1}var x;!function(){try{Object.defineProperty({},"a",{})&&(x=Object.defineProperty)}catch(e){x=function(e,r,t){try{e[r]=t.value||t.get.call(e)}catch(n){}}}}();var y={},D="undefined"!=typeof System&&System._nodeRequire||"undefined"!=typeof require&&"undefined"!=typeof require.resolve&&"undefined"!=typeof process&&process.platform&&require,I={"@empty":{}};return function(e,n,o,a){return function(u){u(function(u){for(var d={_nodeRequire:D,register:r,registerDynamic:t,get:p,set:function(e,r){I[e]=r},newModule:function(e){return e}},i=0;i<n.length;i++)(function(e,r){r&&r.__esModule?I[e]=r:I[e]=s(r)})(n[i],arguments[i]);a(d);var l=p(e[0]);if(e.length>1)for(var i=1;i<e.length;i++)p(e[i]);return o?l["default"]:l})}}}("undefined"!=typeof self?self:global)

(["1"], [], false, function($__System) {
var require = this.require, exports = this.exports, module = this.module;
!function(e){function r(e,r){for(var n=e.split(".");n.length;)r=r[n.shift()];return r}function n(n){if("string"==typeof n)return r(n,e);if(!(n instanceof Array))throw new Error("Global exports must be a string or array.");for(var t={},o=!0,f=0;f<n.length;f++){var i=r(n[f],e);o&&(t["default"]=i,o=!1),t[n[f].split(".").pop()]=i}return t}function t(r){if(Object.keys)Object.keys(e).forEach(r);else for(var n in e)a.call(e,n)&&r(n)}function o(r){t(function(n){if(-1==l.call(s,n)){try{var t=e[n]}catch(o){s.push(n)}r(n,t)}})}var f,i=$__System,a=Object.prototype.hasOwnProperty,l=Array.prototype.indexOf||function(e){for(var r=0,n=this.length;n>r;r++)if(this[r]===e)return r;return-1},s=["_g","sessionStorage","localStorage","clipboardData","frames","frameElement","external","mozAnimationStartTime","webkitStorageInfo","webkitIndexedDB","mozInnerScreenY","mozInnerScreenX"];i.set("@@global-helpers",i.newModule({prepareGlobal:function(r,t,i){var a=e.define;e.define=void 0;var l;if(i){l={};for(var s in i)l[s]=e[s],e[s]=i[s]}return t||(f={},o(function(e,r){f[e]=r})),function(){var r;if(t)r=n(t);else{r={};var i,s;o(function(e,n){f[e]!==n&&"undefined"!=typeof n&&(r[e]=n,"undefined"!=typeof i?s||i===n||(s=!0):i=n)}),r=s?r:i}if(l)for(var u in l)e[u]=l[u];return e.define=a,r}}}))}("undefined"!=typeof self?self:global);
$__System.registerDynamic('2', [], false, function ($__require, $__exports, $__module) {
  var _retrieveGlobal = $__System.get("@@global-helpers").prepareGlobal($__module.id, null, null);

  (function ($__global) {
    $__global['md5'] = md5;
    $__global['hex'] = hex;
    $__global['rhex'] = rhex;
    $__global['md51'] = md51;
    $__global['md5blk'] = md5blk;
    $__global['md5cycle'] = md5cycle;
    $__global['ii'] = ii;
    $__global['hh'] = hh;
    $__global['gg'] = gg;
    $__global['ff'] = ff;
    $__global['cmn'] = cmn;
    $__global['add32'] = add32;
    // WARNING: for utf-8 strings result will be different than 'standard' md5.
    // This is because unicode values instead of utf-8 bytes are used (to avoid
    // conversion overhead). Using this to not break anything, since it has been
    // used for long time in several places in our code. If you need a 'standard'
    // md5 function, use another one.

    // Copied from http://www.myersdaily.org/joseph/javascript/md5-text.html
    // and adapted to match our coding style guide

    /* this function is much faster,
    so if possible we use it. Some IEs
    are the only ones I know of that
    need the idiotic second function,
    generated by an if clause.  */
    function add32(a, b) {
      return a + b & 0xFFFFFFFF;
    }

    function cmn(q, a, b, x, s, t) {
      const aa = add32(add32(a, q), add32(x, t));
      return add32(aa << s | aa >>> 32 - s, b);
    }

    function ff(a, b, c, d, x, s, t) {
      return cmn(b & c | ~b & d, a, b, x, s, t);
    }

    function gg(a, b, c, d, x, s, t) {
      return cmn(b & d | c & ~d, a, b, x, s, t);
    }

    function hh(a, b, c, d, x, s, t) {
      return cmn(b ^ c ^ d, a, b, x, s, t);
    }

    function ii(a, b, c, d, x, s, t) {
      return cmn(c ^ (b | ~d), a, b, x, s, t);
    }

    function md5cycle(x, k) {
      let a = x[0];
      let b = x[1];
      let c = x[2];
      let d = x[3];
      const xx = x;

      a = ff(a, b, c, d, k[0], 7, -680876936);
      d = ff(d, a, b, c, k[1], 12, -389564586);
      c = ff(c, d, a, b, k[2], 17, 606105819);
      b = ff(b, c, d, a, k[3], 22, -1044525330);
      a = ff(a, b, c, d, k[4], 7, -176418897);
      d = ff(d, a, b, c, k[5], 12, 1200080426);
      c = ff(c, d, a, b, k[6], 17, -1473231341);
      b = ff(b, c, d, a, k[7], 22, -45705983);
      a = ff(a, b, c, d, k[8], 7, 1770035416);
      d = ff(d, a, b, c, k[9], 12, -1958414417);
      c = ff(c, d, a, b, k[10], 17, -42063);
      b = ff(b, c, d, a, k[11], 22, -1990404162);
      a = ff(a, b, c, d, k[12], 7, 1804603682);
      d = ff(d, a, b, c, k[13], 12, -40341101);
      c = ff(c, d, a, b, k[14], 17, -1502002290);
      b = ff(b, c, d, a, k[15], 22, 1236535329);

      a = gg(a, b, c, d, k[1], 5, -165796510);
      d = gg(d, a, b, c, k[6], 9, -1069501632);
      c = gg(c, d, a, b, k[11], 14, 643717713);
      b = gg(b, c, d, a, k[0], 20, -373897302);
      a = gg(a, b, c, d, k[5], 5, -701558691);
      d = gg(d, a, b, c, k[10], 9, 38016083);
      c = gg(c, d, a, b, k[15], 14, -660478335);
      b = gg(b, c, d, a, k[4], 20, -405537848);
      a = gg(a, b, c, d, k[9], 5, 568446438);
      d = gg(d, a, b, c, k[14], 9, -1019803690);
      c = gg(c, d, a, b, k[3], 14, -187363961);
      b = gg(b, c, d, a, k[8], 20, 1163531501);
      a = gg(a, b, c, d, k[13], 5, -1444681467);
      d = gg(d, a, b, c, k[2], 9, -51403784);
      c = gg(c, d, a, b, k[7], 14, 1735328473);
      b = gg(b, c, d, a, k[12], 20, -1926607734);

      a = hh(a, b, c, d, k[5], 4, -378558);
      d = hh(d, a, b, c, k[8], 11, -2022574463);
      c = hh(c, d, a, b, k[11], 16, 1839030562);
      b = hh(b, c, d, a, k[14], 23, -35309556);
      a = hh(a, b, c, d, k[1], 4, -1530992060);
      d = hh(d, a, b, c, k[4], 11, 1272893353);
      c = hh(c, d, a, b, k[7], 16, -155497632);
      b = hh(b, c, d, a, k[10], 23, -1094730640);
      a = hh(a, b, c, d, k[13], 4, 681279174);
      d = hh(d, a, b, c, k[0], 11, -358537222);
      c = hh(c, d, a, b, k[3], 16, -722521979);
      b = hh(b, c, d, a, k[6], 23, 76029189);
      a = hh(a, b, c, d, k[9], 4, -640364487);
      d = hh(d, a, b, c, k[12], 11, -421815835);
      c = hh(c, d, a, b, k[15], 16, 530742520);
      b = hh(b, c, d, a, k[2], 23, -995338651);

      a = ii(a, b, c, d, k[0], 6, -198630844);
      d = ii(d, a, b, c, k[7], 10, 1126891415);
      c = ii(c, d, a, b, k[14], 15, -1416354905);
      b = ii(b, c, d, a, k[5], 21, -57434055);
      a = ii(a, b, c, d, k[12], 6, 1700485571);
      d = ii(d, a, b, c, k[3], 10, -1894986606);
      c = ii(c, d, a, b, k[10], 15, -1051523);
      b = ii(b, c, d, a, k[1], 21, -2054922799);
      a = ii(a, b, c, d, k[8], 6, 1873313359);
      d = ii(d, a, b, c, k[15], 10, -30611744);
      c = ii(c, d, a, b, k[6], 15, -1560198380);
      b = ii(b, c, d, a, k[13], 21, 1309151649);
      a = ii(a, b, c, d, k[4], 6, -145523070);
      d = ii(d, a, b, c, k[11], 10, -1120210379);
      c = ii(c, d, a, b, k[2], 15, 718787259);
      b = ii(b, c, d, a, k[9], 21, -343485551);

      xx[0] = add32(a, x[0]);
      xx[1] = add32(b, x[1]);
      xx[2] = add32(c, x[2]);
      xx[3] = add32(d, x[3]);
    }

    /* there needs to be support for Unicode here,
     * unless we pretend that we can redefine the MD-5
     * algorithm for multi-byte characters (perhaps
     * by adding every four 16-bit characters and
     * shortening the sum to 32 bits). Otherwise
     * I suggest performing MD-5 as if every character
     * was two bytes--e.g., 0040 0025 = @%--but then
     * how will an ordinary MD-5 sum be matched?
     * There is no way to standardize text to something
     * like UTF-8 before transformation; speed cost is
     * utterly prohibitive. The JavaScript standard
     * itself needs to look at this: it should start
     * providing access to strings as preformed UTF-8
     * 8-bit unsigned value arrays.
     */
    function md5blk(s) {
      /* I figured global was faster.   */
      const md5blks = [];
      let i; /* Andy King said do it this way. */
      for (i = 0; i < 64; i += 4) {
        md5blks[i >> 2] = s.charCodeAt(i) + (s.charCodeAt(i + 1) << 8) + (s.charCodeAt(i + 2) << 16) + (s.charCodeAt(i + 3) << 24);
      }
      return md5blks;
    }

    function md51(s) {
      const n = s.length;
      const state = [1732584193, -271733879, -1732584194, 271733878];
      let i;
      for (i = 64; i <= s.length; i += 64) {
        md5cycle(state, md5blk(s.substring(i - 64, i)));
      }
      const ss = s.substring(i - 64);
      const tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      for (i = 0; i < ss.length; i++) {
        tail[i >> 2] |= ss.charCodeAt(i) << (i % 4 << 3);
      }
      tail[i >> 2] |= 0x80 << (i % 4 << 3);
      if (i > 55) {
        md5cycle(state, tail);
        for (i = 0; i < 16; i++) tail[i] = 0;
      }
      tail[14] = n * 8;
      md5cycle(state, tail);
      return state;
    }

    const hexChr = '0123456789abcdef'.split('');

    function rhex(n) {
      let s = '';
      let j = 0;
      for (; j < 4; j++) {
        s += hexChr[n >> j * 8 + 4 & 0x0F] + hexChr[n >> j * 8 & 0x0F];
      }
      return s;
    }

    function hex(x) {
      const xx = x;
      for (let i = 0; i < x.length; i++) {
        xx[i] = rhex(x[i]);
      }
      return x.join('');
    }

    function md5(s) {
      let l = s.length;
      var _md5 = hex(md51(s));
      return _md5;
    }
  })(this);

  return _retrieveGlobal();
});
$__System.register('3', ['4'], function (_export) {
  // FIXME: remove cirtular dependency

  /*
  Function to clean string for calculating route hash
  */
  'use strict';

  var CliqzSecureMessage, punctuation, regex;

  /* This method will return the string based on mapping of which keys to use to hash for routing.
  */

  _export('createHttpUrl', createHttpUrl);

  /*
  Converts given array to generator like object.
  */

  _export('getRouteHash', getRouteHash);

  /**
   * Method to create payload to send to proxy.
   * The payload needs to consist of <uPK,
                                      dmC,
                                      {H{mP}*r1}Dsk, // BlindSigned1
                                      {H(mP, uPK)}Dsk, // BlindSigned2
                                      {H(mP, dmC)}Dsk, // BlindSigned3
                                      SIG(uPK;dmC;bs1;bs2;bs3)
                                      >
   * @returns string with payload created.
   */

  _export('createPayloadBlindSignature', createPayloadBlindSignature);

  _export('createPayloadProxy', createPayloadProxy);

  function cleanStr(s) {
    // Replace all spaces

    // Because in some telemetry message we only create uniqu based on anti-duplicate.
    // Anti-duplicate is not a string, hence converting it to string.
    s = '' + s;

    // Decode uri component
    // Need to find lua equivalent

    try {
      s = decodeURIComponent(s);
    } catch (e) {};

    s = s.replace(/\s+/g, '');

    // Convert to lower
    s = s.toLowerCase();

    // Trim
    s = s.trim();

    // Clean the URL
    s = s.replace(/^http:\/\//, "");
    s = s.replace(/^https:\/\//, "");
    s = s.replace(/^www\./, '');

    // Remove all punctuation marks
    s = s.replace(regex, '');

    return s;
  }

  function getField(obj, path) {
    return path.split(/[\.\[\]]+/).filter(function (x) {
      return x;
    }).reduce(function (o, i) {
      return o[i];
    }, obj);
  }

  function orderedStringify(t, res, onlyKeys) {
    if (!t || typeof t !== 'object') {
      if (t === undefined) {
        throw 'Found undefined field when trying to calculate msg routehash';
      }
      res.push(cleanStr(t));
    } else {
      (function () {
        var keys = Object.keys(t);
        keys.sort();
        var isArray = Array.isArray(t);
        keys.forEach(function (k) {
          if (!isArray) {
            res.push(cleanStr(k));
          }
          if (!onlyKeys) {
            orderedStringify(t[k], res);
          }
        });
      })();
    }
  }

  function getRouteHashStr(obj, sourceMap) {
    var action = obj.action;
    var keys = sourceMap[action].keys;
    var staticKeys = sourceMap[action]['static'] || [];
    var res = [];
    keys.forEach(function (k) {
      return orderedStringify(getField(obj, k), res, staticKeys.some(function (sk) {
        return k.endsWith(sk);
      }));
    });
    return res.join('');
  }

  // TODO: remove this function - it has almost not value and a misleading name
  /*
  Function to create http url
  */

  function createHttpUrl(host) {
    return "http://" + host + "/verify";
  }

  function getRouteHash(msg) {
    return getRouteHashStr(msg, CliqzSecureMessage.sourceMap);
  }

  function trkGen(trk) {
    var trk = trk;
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

  /**
   * Method to create payload to send for blind signature.
   * The payload needs to consist of <uPK,
                                      {mP}*r1, // BM1
                                      {mP, uPK}*r2, // BM2
                                      {DmC, uPK} * r3, // BM3
                                      SIG(uPK;bm1;bm2;bm3)
                                      >
   * @returns string with payload created.
  */

  function createPayloadBlindSignature(uPK, bm1, bm2, bm3, sig) {
    var payload = {};
    payload["uPK"] = uPK;
    payload["bm1"] = bm1;
    payload["bm2"] = bm2;
    payload["bm3"] = bm3;
    payload["sig"] = sig;
    return payload;
  }

  function createPayloadProxy(uPK, suPK, mP, dmC, bs1, bs2, bs3, sig) {
    var payload = {};
    payload["uPK"] = uPK;
    payload["suPK"] = suPK;
    payload["mP"] = mP;
    payload["dmC"] = dmC;
    payload["bs1"] = bs1;
    payload["bs2"] = bs2;
    payload["bs3"] = bs3;
    payload["sig"] = sig;
    return payload;
  }

  return {
    setters: [function (_index) {
      CliqzSecureMessage = _index['default'];
    }],
    execute: function () {
      punctuation = '!"\'()*,-./:;?[\\]^_`{|}~%$=&+#';
      regex = new RegExp("[" + punctuation + "]", "g");
    }
  };
});
$__System.register('5', ['2', '4', '6', '7', '3', '8', '9'], function (_export) {
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
      _default = function () {
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
      }();

      _export('default', _default);

      ;
    }
  };
});
$__System.register('a', ['7'], function (_export) {

    // This is blatant rip-off of conversion function in cliqz-p2p crytpo.
    'use strict';

    var base64_decode, base64_encode;

    _export('exportPrivateKey', exportPrivateKey);

    _export('exportPublicKey', exportPublicKey);

    _export('privateKeytoKeypair', privateKeytoKeypair);

    function ByteBuffer(length) {
        this.buffer = new Uint8Array(length);
        this.pos = 0;
    }

    function bytesToEncode(len) {
        var sum = len + 1;
        if (len < 1 << 7) {
            sum += 1;
        } else if (len < 1 << 8) {
            sum += 2;
        } else if (len < 1 << 16) {
            sum += 3;
        } else if (len < 1 << 24) {
            sum += 4;
        } else if (len < 1 << 32) {
            sum += 5;
        } else {
            throw 'value too big ' + len;
        }
        return sum;
    }

    function pushLength(buffer, len) {
        if (len < 1 << 7) {
            buffer.pushByte(len);
        } else if (len < 1 << 8) {
            buffer.pushByte(0x81);
            buffer.pushByte(len);
        } else if (len < 1 << 16) {
            buffer.pushByte(0x82);
            buffer.pushByte(len >> 8);
            buffer.pushByte(len & 0xFF);
        } else if (len < 1 << 24) {
            buffer.pushByte(0x83);
            buffer.pushByte(len >> 16);
            buffer.pushByte(len >> 8 & 0xFF);
            buffer.pushByte(len & 0xFF);
        } else if (len < 1 << 32) {
            buffer.pushByte(0x84);
            buffer.pushByte(len >> 24);
            buffer.pushByte(len >> 16 & 0xFF);
            buffer.pushByte(len >> 8 & 0xFF);
            buffer.pushByte(len & 0xFF);
        } else {
            throw 'value too big ' + len;
        }
    }

    function fromBase64url(data) {
        data = data.replace(/-/g, '+').replace(/_/g, '/');
        var pads = (4 - data.length % 4) % 4;
        if (pads === 3) {
            throw 'illegal base64 string: ' + data;
        }
        for (var i = 0; i < pads; i++) {
            data += '=';
        }
        return data;
    }

    function toBase64url(data) {
        data = data.replace(/\+/g, '-').replace(/\//g, '_');
        for (var i = 0; i < 2; ++i) {
            if (data[data.length - 1] === '=') {
                data = data.substring(0, data.length - 1);
            }
        }
        return data;
    }

    function padIfSigned(array) {
        if (array[0] & 0x80) {
            var newArray = new Uint8Array(array.length + 1);
            newArray[0] = 0;
            newArray.set(array, 1);
            return newArray;
        }
        return array;
    }
    /*RSAPrivateKey ::= SEQUENCE {
      version           0,
      modulus           INTEGER,  -- n
      publicExponent    INTEGER,  -- e
      privateExponent   INTEGER,  -- d
      prime1            INTEGER,  -- p
      prime2            INTEGER,  -- q
      exponent1         INTEGER,  -- d mod (p-1)
      exponent2         INTEGER,  -- d mod (q-1)
      coefficient       INTEGER,  -- (inverse of q) mod p
    }*/

    /*RSAPublicKey ::= SEQUENCE {
        modulus           INTEGER,  -- n
        publicExponent    INTEGER   -- e
    }*/

    function exportPrivateKey(key) {
        var orig_values = ['AA==', key.n, key.e, key.d, key.p, key.q, key.dp, key.dq, key.qi];
        var values = orig_values.map(function (x) {
            return padIfSigned(base64_decode(fromBase64url(x)));
        });
        var buffer = new ByteBuffer(2000);

        buffer.pushByte(0x30); //SEQUENCE
        var numBytes = values.reduce(function (a, x) {
            return a + bytesToEncode(x.length);
        }, 0);
        pushLength(buffer, numBytes);

        values.forEach(function (x) {
            buffer.pushByte(0x02); // INTEGER
            pushLength(buffer, x.length);
            buffer.pushBytes(x);
        });
        return buffer.toBase64();
    }

    /*RSAPublicKey ::= SEQUENCE {
        modulus           INTEGER,  -- n
        publicExponent    INTEGER   -- e
    }*/

    // SEQUENCE(2 elem)
    // SEQUENCE(2 elem)
    // OBJECT IDENTIFIER 1.2.840.113549.1.1.1
    // NULL
    // BIT STRING(1 elem)
    // SEQUENCE(2 elem)
    // INTEGER(2048 bit) n
    // INTEGER e

    function exportPublicKey(key) {
        var orig_values = [key.n, key.e];
        var values = orig_values.map(function (x) {
            return padIfSigned(base64_decode(fromBase64url(x)));
        });
        var numBytes = values.reduce(function (a, x) {
            return a + bytesToEncode(x.length);
        }, 0);

        var buffer = new ByteBuffer(2000);

        buffer.pushByte(0x30); //SEQUENCE
        pushLength(buffer, bytesToEncode(bytesToEncode(numBytes) + 1) + 15);

        buffer.pushBytes(new Uint8Array([0x30, 0x0D, 0x06, 0x09, 0x2A, 0x86, 0x48, 0x86, 0xF7, 0x0D, 0x01, 0x01, 0x01, 0x05, 0x00]));
        buffer.pushByte(0x03); //BIT STRING
        pushLength(buffer, bytesToEncode(numBytes) + 1);
        buffer.pushByte(0x00);

        buffer.pushByte(0x30); //SEQUENCE
        pushLength(buffer, numBytes);

        values.forEach(function (x) {
            buffer.pushByte(0x02); // INTEGER
            pushLength(buffer, x.length);
            buffer.pushBytes(x);
        });
        return buffer.toBase64();
    }

    function exportPublicKeySPKI(key) {
        return exportPublicKey(key);
    }

    function exportPrivateKeyPKCS8(key) {
        var orig_values = ['AA==', key.n, key.e, key.d, key.p, key.q, key.dp, key.dq, key.qi];
        var values = orig_values.map(function (x) {
            return padIfSigned(base64_decode(fromBase64url(x)));
        });
        var numBytes = values.reduce(function (a, x) {
            return a + bytesToEncode(x.length);
        }, 0);

        var buffer = new ByteBuffer(2000);

        buffer.pushByte(0x30); //SEQUENCE
        pushLength(buffer, 3 + 15 + bytesToEncode(bytesToEncode(numBytes)));
        buffer.pushBytes(new Uint8Array([0x02, 0x01, 0x00]));
        buffer.pushBytes(new Uint8Array([0x30, 0x0D, 0x06, 0x09, 0x2A, 0x86, 0x48, 0x86, 0xF7, 0x0D, 0x01, 0x01, 0x01, 0x05, 0x00]));
        buffer.pushByte(0x04); //OCTET STRING
        pushLength(buffer, bytesToEncode(numBytes));

        buffer.pushByte(0x30); //SEQUENCE
        pushLength(buffer, numBytes);

        values.forEach(function (x) {
            buffer.pushByte(0x02); // INTEGER
            pushLength(buffer, x.length);
            buffer.pushBytes(x);
        });
        return buffer.toBase64();
    }

    function readLength(buffer) {
        var first = buffer.readByte();
        if (first & 0x80) {
            var numBytes = first & 0x7F;
            var res = 0;
            while (numBytes--) {
                res = res << 8 | buffer.readByte();
            }
            return res;
        } else {
            return first;
        }
    }

    function readInteger(buffer) {
        var tag = buffer.readByte();
        if (tag !== 0x02) {
            throw 'invalid tag for integer value';
        }
        var len = readLength(buffer);
        var val = buffer.readBytes(len);
        if (val[0] === 0) {
            // Remove padding?
            val = val.subarray(1);
        }
        return val;
    }

    function __importKey(buffer, values) {
        var key = {};
        if (buffer.readByte() === 0x30) {
            readLength(buffer);
            for (var i = 0; i < values.length; ++i) {
                var val = readInteger(buffer);
                val = toBase64url(base64_encode(val));
                key[values[i]] = val;
            }
        } else {
            throw 'first value not correct';
        }
        if (buffer.pos !== buffer.buffer.length) {
            throw 'not all input data consumed';
        }
        key.alg = 'RS256';
        key.ext = true;
        key.kty = 'RSA';
        return key;
    }

    function _importKey(data, values) {
        var buffer = new ByteBuffer(0);
        buffer.setData(base64_decode(data));
        return __importKey(buffer, values);
    }

    function importPublicKey(data) {
        var buffer = new ByteBuffer(0);
        buffer.setData(base64_decode(data));
        if (buffer.readByte() === 0x30) {
            readLength(buffer);
            buffer.readBytes(15);
            if (buffer.readByte() !== 0x03) {
                throw 'format not correct';
            }
            readLength(buffer);
            if (buffer.readByte() !== 0x00) {
                throw 'format not correct';
            }
        } else {
            throw 'format not correct';
        }
        return __importKey(buffer, ['n', 'e']);
    }

    function importPrivateKey(data) {
        var res = _importKey(data, ['version', 'n', 'e', 'd', 'p', 'q', 'dp', 'dq', 'qi']);
        delete res.version;
        return res;
    }
    function privateKeytoKeypair(privateKey) {
        var key = importPrivateKey(privateKey);
        return [exportPublicKeySPKI(key), exportPrivateKeyPKCS8(key)];
    }

    return {
        setters: [function (_cryptoUtils) {
            base64_decode = _cryptoUtils.base64_decode;
            base64_encode = _cryptoUtils.base64_encode;
        }],
        execute: function () {
            ByteBuffer.prototype.setData = function (data) {
                this.buffer = data;
                this.pos = 0;
            };

            ByteBuffer.prototype.readByte = function () {
                if (this.pos + 1 > this.buffer.length) {
                    throw 'Tried to read past the buffer length';
                }
                return this.buffer[this.pos++];
            };

            ByteBuffer.prototype.readBytes = function (length) {
                if (this.pos + length > this.buffer.length) {
                    throw 'Tried to read past the buffer length';
                }
                var res = this.buffer.subarray(this.pos, this.pos + length);
                this.pos += length;
                return res;
            };

            ByteBuffer.prototype.resetPointer = function () {
                this.pos = 0;
            };

            ByteBuffer.prototype.pushByte = function (byte) {
                if (this.pos + 1 > this.buffer.length) {
                    var newBuffer = new Uint8Array(this.buffer.length * 2);
                    newBuffer.set(this.buffer);
                    this.buffer = newBuffer;
                }
                this.buffer[this.pos++] = byte;
            };

            ByteBuffer.prototype.pushBytes = function (bytes) {
                if (this.pos + bytes.length > this.buffer.length) {
                    var newBuffer = new Uint8Array((this.pos + bytes.length) * 2);
                    newBuffer.set(this.buffer);
                    this.buffer = newBuffer;
                }
                this.buffer.set(bytes, this.pos);
                this.pos += bytes.length;
            };

            ByteBuffer.prototype.toBase64 = function () {
                return base64_encode(this.buffer.subarray(0, this.pos));
            };

            ByteBuffer.prototype.fromBase64 = function (data) {
                this.pushBytes(base64_decode(data));
            };;;;;;;

            ;
        }
    };
});
$__System.register("9", [], function (_export) {
  "use strict";

  return {
    setters: [],
    execute: function () {
      _export("default", function (url) {

        var core = {

          // Method that performs request
          req: function req(method, url, data, type) {
            // Creating a promise
            var promise = new Promise(function (resolve, reject) {

              // Instantiates the XMLHttpRequest
              var client = new XMLHttpRequest();
              var uri = url;
              var ts = new Date().getTime();

              client.open(method, uri, true);
              client.setRequestHeader("x-type", type ? type : "delayed");
              client.overrideMimeType('application/json');
              //client.setRequestHeader("Content-Type", "application/json;charset=utf-8");
              client.send(data);

              client.onload = function () {
                var statusClass = parseInt(client.status / 100);
                if (statusClass == 2 || statusClass == 3 || statusClass == 0 /* local files */) {
                    // Performs the function "resolve" when this.status is equal to 2xx
                    resolve(this.response);
                  } else {
                  // Performs the function "reject" when this.status is different than 2xx

                  reject(this.statusText);
                }
              };
              client.onerror = function () {
                reject(this.statusText);
              };
              client.ontimeout = function () {
                reject(this.statusText);
              };
            });

            // Return the promise
            return promise;
          }
        };

        return {
          'get': function get(args) {
            return core.req('GET', url, args);
          },
          'post': function post(args, type) {
            return core.req('POST', url, args, type);
          }
        };
      });
    }
  };
});
$__System.register('6', ['4', 'a', '7', '9'], function (_export) {
  'use strict';

  var CliqzSecureMessage, privateKeytoKeypair, exportPrivateKey, exportPublicKey, stringToByteArray, byteArrayToHexString, hexStringToByteArray, base64ToByteArray, _http, _default;

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
      _default = function () {
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
      }();

      _export('default', _default);

      ;
    }
  };
});
$__System.registerDynamic('b', [], false, function ($__require, $__exports, $__module) {
  var _retrieveGlobal = $__System.get("@@global-helpers").prepareGlobal($__module.id, null, null);

  (function ($__global) {
    $__global['mont_'] = mont_;
    $__global['powMod_'] = powMod_;
    $__global['trim'] = trim;
    $__global['squareMod_'] = squareMod_;
    $__global['multMod_'] = multMod_;
    $__global['mod_'] = mod_;
    $__global['mult_'] = mult_;
    $__global['add_'] = add_;
    $__global['sub_'] = sub_;
    $__global['subShift_'] = subShift_;
    $__global['addShift_'] = addShift_;
    $__global['linCombShift_'] = linCombShift_;
    $__global['linComb_'] = linComb_;
    $__global['divInt_'] = divInt_;
    $__global['multInt_'] = multInt_;
    $__global['leftShift_'] = leftShift_;
    $__global['halve_'] = halve_;
    $__global['rightShift_'] = rightShift_;
    $__global['addInt_'] = addInt_;
    $__global['copyInt_'] = copyInt_;
    $__global['copy_'] = copy_;
    $__global['dup'] = dup;
    $__global['bigInt2str'] = bigInt2str;
    $__global['isZero'] = isZero;
    $__global['equals'] = equals;
    $__global['equalsInt'] = equalsInt;
    $__global['str2bigInt'] = str2bigInt;
    $__global['int2bigInt'] = int2bigInt;
    $__global['modInt'] = modInt;
    $__global['carry_'] = carry_;
    $__global['divide_'] = divide_;
    $__global['greater'] = greater;
    $__global['greaterShift'] = greaterShift;
    $__global['negative'] = negative;
    $__global['eGCD_'] = eGCD_;
    $__global['inverseModInt_'] = inverseModInt_;
    $__global['inverseModInt'] = inverseModInt;
    $__global['inverseMod_'] = inverseMod_;
    $__global['GCD_'] = GCD_;
    $__global['GCD'] = GCD;
    $__global['randBigInt_'] = randBigInt_;
    $__global['randBigInt'] = randBigInt;
    $__global['randTruePrime_'] = randTruePrime_;
    $__global['multMod'] = multMod;
    $__global['inverseMod'] = inverseMod;
    $__global['add'] = add;
    $__global['sub'] = sub;
    $__global['powMod'] = powMod;
    $__global['mult'] = mult;
    $__global['addInt'] = addInt;
    $__global['mod'] = mod;
    $__global['randProbPrimeRounds'] = randProbPrimeRounds;
    $__global['randProbPrime'] = randProbPrime;
    $__global['randTruePrime'] = randTruePrime;
    $__global['expand'] = expand;
    $__global['bitSize'] = bitSize;
    $__global['millerRabin'] = millerRabin;
    $__global['millerRabinInt'] = millerRabinInt;
    $__global['findPrimes'] = findPrimes;
    ////////////////////////////////////////////////////////////////////////////////////////
    // Big Integer Library v. 5.5
    // Created 2000, last modified 2013
    // Leemon Baird
    // www.leemon.com
    //
    // Version history:
    // v 5.5  17 Mar 2013
    //   - two lines of a form like "if (x<0) x+=n" had the "if" changed to "while" to
    //     handle the case when x<-n. (Thanks to James Ansell for finding that bug)
    // v 5.4  3 Oct 2009
    //   - added "var i" to greaterShift() so i is not global. (Thanks to PŽter Szab— for finding that bug)
    //
    // v 5.3  21 Sep 2009
    //   - added randProbPrime(k) for probable primes
    //   - unrolled loop in mont_ (slightly faster)
    //   - millerRabin now takes a bigInt parameter rather than an int
    //
    // v 5.2  15 Sep 2009
    //   - fixed capitalization in call to int2bigInt in randBigInt
    //     (thanks to Emili Evripidou, Reinhold Behringer, and Samuel Macaleese for finding that bug)
    //
    // v 5.1  8 Oct 2007
    //   - renamed inverseModInt_ to inverseModInt since it doesn't change its parameters
    //   - added functions GCD and randBigInt, which call GCD_ and randBigInt_
    //   - fixed a bug found by Rob Visser (see comment with his name below)
    //   - improved comments
    //
    // This file is public domain.   You can use it for any purpose without restriction.
    // I do not guarantee that it is correct, so use it at your own risk.  If you use
    // it for something interesting, I'd appreciate hearing about it.  If you find
    // any bugs or make any improvements, I'd appreciate hearing about those too.
    // It would also be nice if my name and URL were left in the comments.  But none
    // of that is required.
    //
    // This code defines a bigInt library for arbitrary-precision integers.
    // A bigInt is an array of integers storing the value in chunks of bpe bits,
    // little endian (buff[0] is the least significant word).
    // Negative bigInts are stored two's complement.  Almost all the functions treat
    // bigInts as nonnegative.  The few that view them as two's complement say so
    // in their comments.  Some functions assume their parameters have at least one
    // leading zero element. Functions with an underscore at the end of the name put
    // their answer into one of the arrays passed in, and have unpredictable behavior
    // in case of overflow, so the caller must make sure the arrays are big enough to
    // hold the answer.  But the average user should never have to call any of the
    // underscored functions.  Each important underscored function has a wrapper function
    // of the same name without the underscore that takes care of the details for you.
    // For each underscored function where a parameter is modified, that same variable
    // must not be used as another argument too.  So, you cannot square x by doing
    // multMod_(x,x,n).  You must use squareMod_(x,n) instead, or do y=dup(x); multMod_(x,y,n).
    // Or simply use the multMod(x,x,n) function without the underscore, where
    // such issues never arise, because non-underscored functions never change
    // their parameters; they always allocate new memory for the answer that is returned.
    //
    // These functions are designed to avoid frequent dynamic memory allocation in the inner loop.
    // For most functions, if it needs a BigInt as a local variable it will actually use
    // a global, and will only allocate to it only when it's not the right size.  This ensures
    // that when a function is called repeatedly with same-sized parameters, it only allocates
    // memory on the first call.
    //
    // Note that for cryptographic purposes, the calls to Math.random() must
    // be replaced with calls to a better pseudorandom number generator.
    //
    // In the following, "bigInt" means a bigInt with at least one leading zero element,
    // and "integer" means a nonnegative integer less than radix.  In some cases, integer
    // can be negative.  Negative bigInts are 2s complement.
    //
    // The following functions do not modify their inputs.
    // Those returning a bigInt, string, or Array will dynamically allocate memory for that value.
    // Those returning a boolean will return the integer 0 (false) or 1 (true).
    // Those returning boolean or int will not allocate memory except possibly on the first
    // time they're called with a given parameter size.
    //
    // bigInt  add(x,y)               //return (x+y) for bigIntstr x and y.
    // bigInt  addInt(x,n)            //return (x+n) where x is a bigInt and n is an integer.
    // string  bigInt2str(x,base)     //return a string form of bigInt x in a given base, with 2 <= base <= 95
    // int     bitSize(x)             //return how many bits long the bigInt x is, not counting leading zeros
    // bigInt  dup(x)                 //return a copy of bigInt x
    // boolean equals(x,y)            //is the bigInt x equal to the bigint y?
    // boolean equalsInt(x,y)         //is bigint x equal to integer y?
    // bigInt  expand(x,n)            //return a copy of x with at least n elements, adding leading zeros if needed
    // Array   findPrimes(n)          //return array of all primes less than integer n
    // bigInt  GCD(x,y)               //return greatest common divisor of bigInts x and y (each with same number of elements).
    // boolean greater(x,y)           //is x>y?  (x and y are nonnegative bigInts)
    // boolean greaterShift(x,y,shift)//is (x <<(shift*bpe)) > y?
    // bigInt  int2bigInt(t,n,m)      //return a bigInt equal to integer t, with at least n bits and m array elements
    // bigInt  inverseMod(x,n)        //return (x**(-1) mod n) for bigInts x and n.  If no inverse exists, it returns null
    // int     inverseModInt(x,n)     //return x**(-1) mod n, for integers x and n.  Return 0 if there is no inverse
    // boolean isZero(x)              //is the bigInt x equal to zero?
    // boolean millerRabin(x,b)       //does one round of Miller-Rabin base integer b say that bigInt x is possibly prime? (b is bigInt, 1<b<x)
    // boolean millerRabinInt(x,b)    //does one round of Miller-Rabin base integer b say that bigInt x is possibly prime? (b is int,    1<b<x)
    // bigInt  mod(x,n)               //return a new bigInt equal to (x mod n) for bigInts x and n.
    // int     modInt(x,n)            //return x mod n for bigInt x and integer n.
    // bigInt  mult(x,y)              //return x*y for bigInts x and y. This is faster when y<x.
    // bigInt  multMod(x,y,n)         //return (x*y mod n) for bigInts x,y,n.  For greater speed, let y<x.
    // boolean negative(x)            //is bigInt x negative?
    // bigInt  powMod(x,y,n)          //return (x**y mod n) where x,y,n are bigInts and ** is exponentiation.  0**0=1. Faster for odd n.
    // bigInt  randBigInt(n,s)        //return an n-bit random BigInt (n>=1).  If s=1, then the most significant of those n bits is set to 1.
    // bigInt  randTruePrime(k)       //return a new, random, k-bit, true prime bigInt using Maurer's algorithm.
    // bigInt  randProbPrime(k)       //return a new, random, k-bit, probable prime bigInt (probability it's composite less than 2^-80).
    // bigInt  str2bigInt(s,b,n,m)    //return a bigInt for number represented in string s in base b with at least n bits and m array elements
    // bigInt  sub(x,y)               //return (x-y) for bigInts x and y.  Negative answers will be 2s complement
    // bigInt  trim(x,k)              //return a copy of x with exactly k leading zero elements
    //
    //
    // The following functions each have a non-underscored version, which most users should call instead.
    // These functions each write to a single parameter, and the caller is responsible for ensuring the array
    // passed in is large enough to hold the result.
    //
    // void    addInt_(x,n)          //do x=x+n where x is a bigInt and n is an integer
    // void    add_(x,y)             //do x=x+y for bigInts x and y
    // void    copy_(x,y)            //do x=y on bigInts x and y
    // void    copyInt_(x,n)         //do x=n on bigInt x and integer n
    // void    GCD_(x,y)             //set x to the greatest common divisor of bigInts x and y, (y is destroyed).  (This never overflows its array).
    // boolean inverseMod_(x,n)      //do x=x**(-1) mod n, for bigInts x and n. Returns 1 (0) if inverse does (doesn't) exist
    // void    mod_(x,n)             //do x=x mod n for bigInts x and n. (This never overflows its array).
    // void    mult_(x,y)            //do x=x*y for bigInts x and y.
    // void    multMod_(x,y,n)       //do x=x*y  mod n for bigInts x,y,n.
    // void    powMod_(x,y,n)        //do x=x**y mod n, where x,y,n are bigInts (n is odd) and ** is exponentiation.  0**0=1.
    // void    randBigInt_(b,n,s)    //do b = an n-bit random BigInt. if s=1, then nth bit (most significant bit) is set to 1. n>=1.
    // void    randTruePrime_(ans,k) //do ans = a random k-bit true random prime (not just probable prime) with 1 in the msb.
    // void    sub_(x,y)             //do x=x-y for bigInts x and y. Negative answers will be 2s complement.
    //
    // The following functions do NOT have a non-underscored version.
    // They each write a bigInt result to one or more parameters.  The caller is responsible for
    // ensuring the arrays passed in are large enough to hold the results.
    //
    // void addShift_(x,y,ys)       //do x=x+(y<<(ys*bpe))
    // void carry_(x)               //do carries and borrows so each element of the bigInt x fits in bpe bits.
    // void divide_(x,y,q,r)        //divide x by y giving quotient q and remainder r
    // int  divInt_(x,n)            //do x=floor(x/n) for bigInt x and integer n, and return the remainder. (This never overflows its array).
    // int  eGCD_(x,y,d,a,b)        //sets a,b,d to positive bigInts such that d = GCD_(x,y) = a*x-b*y
    // void halve_(x)               //do x=floor(|x|/2)*sgn(x) for bigInt x in 2's complement.  (This never overflows its array).
    // void leftShift_(x,n)         //left shift bigInt x by n bits.  n<bpe.
    // void linComb_(x,y,a,b)       //do x=a*x+b*y for bigInts x and y and integers a and b
    // void linCombShift_(x,y,b,ys) //do x=x+b*(y<<(ys*bpe)) for bigInts x and y, and integers b and ys
    // void mont_(x,y,n,np)         //Montgomery multiplication (see comments where the function is defined)
    // void multInt_(x,n)           //do x=x*n where x is a bigInt and n is an integer.
    // void rightShift_(x,n)        //right shift bigInt x by n bits.  0 <= n < bpe. (This never overflows its array).
    // void squareMod_(x,n)         //do x=x*x  mod n for bigInts x,n
    // void subShift_(x,y,ys)       //do x=x-(y<<(ys*bpe)). Negative answers will be 2s complement.
    //
    // The following functions are based on algorithms from the _Handbook of Applied Cryptography_
    //    powMod_()           = algorithm 14.94, Montgomery exponentiation
    //    eGCD_,inverseMod_() = algorithm 14.61, Binary extended GCD_
    //    GCD_()              = algorothm 14.57, Lehmer's algorithm
    //    mont_()             = algorithm 14.36, Montgomery multiplication
    //    divide_()           = algorithm 14.20  Multiple-precision division
    //    squareMod_()        = algorithm 14.16  Multiple-precision squaring
    //    randTruePrime_()    = algorithm  4.62, Maurer's algorithm
    //    millerRabin()       = algorithm  4.24, Miller-Rabin algorithm
    //
    // Profiling shows:
    //     randTruePrime_() spends:
    //         10% of its time in calls to powMod_()
    //         85% of its time in calls to millerRabin()
    //     millerRabin() spends:
    //         99% of its time in calls to powMod_()   (always with a base of 2)
    //     powMod_() spends:
    //         94% of its time in calls to mont_()  (almost always with x==y)
    //
    // This suggests there are several ways to speed up this library slightly:
    //     - convert powMod_ to use a Montgomery form of k-ary window (or maybe a Montgomery form of sliding window)
    //         -- this should especially focus on being fast when raising 2 to a power mod n
    //     - convert randTruePrime_() to use a minimum r of 1/3 instead of 1/2 with the appropriate change to the test
    //     - tune the parameters in randTruePrime_(), including c, m, and recLimit
    //     - speed up the single loop in mont_() that takes 95% of the runtime, perhaps by reducing checking
    //       within the loop when all the parameters are the same length.
    //
    // There are several ideas that look like they wouldn't help much at all:
    //     - replacing trial division in randTruePrime_() with a sieve (that speeds up something taking almost no time anyway)
    //     - increase bpe from 15 to 30 (that would help if we had a 32*32->64 multiplier, but not with JavaScript's 32*32->32)
    //     - speeding up mont_(x,y,n,np) when x==y by doing a non-modular, non-Montgomery square
    //       followed by a Montgomery reduction.  The intermediate answer will be twice as long as x, so that
    //       method would be slower.  This is unfortunate because the code currently spends almost all of its time
    //       doing mont_(x,x,...), both for randTruePrime_() and powMod_().  A faster method for Montgomery squaring
    //       would have a large impact on the speed of randTruePrime_() and powMod_().  HAC has a couple of poorly-worded
    //       sentences that seem to imply it's faster to do a non-modular square followed by a single
    //       Montgomery reduction, but that's obviously wrong.
    ////////////////////////////////////////////////////////////////////////////////////////

    //globals
    bpe = 0; //bits stored per array element
    mask = 0; //AND this with an array element to chop it down to bpe bits
    radix = mask + 1; //equals 2^bpe.  A single 1 bit to the left of the last bit of mask.

    //the digits for converting to different bases
    digitsStr = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_=!@#$%^&*()[]{}|;:,.<>/?`~ \\\'\"+-';

    //initialize the global variables
    for (bpe = 0; 1 << bpe + 1 > 1 << bpe; bpe++); //bpe=number of bits in the mantissa on this platform
    bpe >>= 1; //bpe=number of bits in one element of the array representing the bigInt
    mask = (1 << bpe) - 1; //AND the mask with an integer to get its bpe least significant bits
    radix = mask + 1; //2^bpe.  a single 1 bit to the left of the first bit of mask
    one = int2bigInt(1, 1, 1); //constant used in powMod_()

    //the following global variables are scratchpad memory to
    //reduce dynamic memory allocation in the inner loop
    t = new Array(0);
    ss = t; //used in mult_()
    s0 = t; //used in multMod_(), squareMod_()
    s1 = t; //used in powMod_(), multMod_(), squareMod_()
    s2 = t; //used in powMod_(), multMod_()
    s3 = t; //used in powMod_()
    s4 = t;s5 = t; //used in mod_()
    s6 = t; //used in bigInt2str()
    s7 = t; //used in powMod_()
    T = t; //used in GCD_()
    sa = t; //used in mont_()
    mr_x1 = t;mr_r = t;mr_a = t; //used in millerRabin()
    eg_v = t;eg_u = t;eg_A = t;eg_B = t;eg_C = t;eg_D = t; //used in eGCD_(), inverseMod_()
    md_q1 = t;md_q2 = t;md_q3 = t;md_r = t;md_r1 = t;md_r2 = t;md_tt = t; //used in mod_()

    primes = t;pows = t;s_i = t;s_i2 = t;s_R = t;s_rm = t;s_q = t;s_n1 = t;
    s_a = t;s_r2 = t;s_n = t;s_b = t;s_d = t;s_x1 = t;s_x2 = t, s_aa = t; //used in randTruePrime_()

    rpprb = t; //used in randProbPrimeRounds() (which also uses "primes")

    ////////////////////////////////////////////////////////////////////////////////////////


    //return array of all primes less than integer n
    function findPrimes(n) {
      var i, s, p, ans;
      s = new Array(n);
      for (i = 0; i < n; i++) s[i] = 0;
      s[0] = 2;
      p = 0; //first p elements of s are primes, the rest are a sieve
      for (; s[p] < n;) {
        //s[p] is the pth prime
        for (i = s[p] * s[p]; i < n; i += s[p]) //mark multiples of s[p]
        s[i] = 1;
        p++;
        s[p] = s[p - 1] + 1;
        for (; s[p] < n && s[s[p]]; s[p]++); //find next prime (where s[p]==0)
      }
      ans = new Array(p);
      for (i = 0; i < p; i++) ans[i] = s[i];
      return ans;
    }

    //does a single round of Miller-Rabin base b consider x to be a possible prime?
    //x is a bigInt, and b is an integer, with b<x
    function millerRabinInt(x, b) {
      if (mr_x1.length != x.length) {
        mr_x1 = dup(x);
        mr_r = dup(x);
        mr_a = dup(x);
      }

      copyInt_(mr_a, b);
      return millerRabin(x, mr_a);
    }

    //does a single round of Miller-Rabin base b consider x to be a possible prime?
    //x and b are bigInts with b<x
    function millerRabin(x, b) {
      var i, j, k, s;

      if (mr_x1.length != x.length) {
        mr_x1 = dup(x);
        mr_r = dup(x);
        mr_a = dup(x);
      }

      copy_(mr_a, b);
      copy_(mr_r, x);
      copy_(mr_x1, x);

      addInt_(mr_r, -1);
      addInt_(mr_x1, -1);

      //s=the highest power of two that divides mr_r
      k = 0;
      for (i = 0; i < mr_r.length; i++) for (j = 1; j < mask; j <<= 1) if (x[i] & j) {
        s = k < mr_r.length + bpe ? k : 0;
        i = mr_r.length;
        j = mask;
      } else k++;

      if (s) rightShift_(mr_r, s);

      powMod_(mr_a, mr_r, x);

      if (!equalsInt(mr_a, 1) && !equals(mr_a, mr_x1)) {
        j = 1;
        while (j <= s - 1 && !equals(mr_a, mr_x1)) {
          squareMod_(mr_a, x);
          if (equalsInt(mr_a, 1)) {
            return 0;
          }
          j++;
        }
        if (!equals(mr_a, mr_x1)) {
          return 0;
        }
      }
      return 1;
    }

    //returns how many bits long the bigInt is, not counting leading zeros.
    function bitSize(x) {
      var j, z, w;
      for (j = x.length - 1; x[j] == 0 && j > 0; j--);
      for (z = 0, w = x[j]; w; w >>= 1, z++);
      z += bpe * j;
      return z;
    }

    //return a copy of x with at least n elements, adding leading zeros if needed
    function expand(x, n) {
      var ans = int2bigInt(0, (x.length > n ? x.length : n) * bpe, 0);
      copy_(ans, x);
      return ans;
    }

    //return a k-bit true random prime using Maurer's algorithm.
    function randTruePrime(k) {
      var ans = int2bigInt(0, k, 0);
      randTruePrime_(ans, k);
      return trim(ans, 1);
    }

    //return a k-bit random probable prime with probability of error < 2^-80
    function randProbPrime(k) {
      if (k >= 600) return randProbPrimeRounds(k, 2); //numbers from HAC table 4.3
      if (k >= 550) return randProbPrimeRounds(k, 4);
      if (k >= 500) return randProbPrimeRounds(k, 5);
      if (k >= 400) return randProbPrimeRounds(k, 6);
      if (k >= 350) return randProbPrimeRounds(k, 7);
      if (k >= 300) return randProbPrimeRounds(k, 9);
      if (k >= 250) return randProbPrimeRounds(k, 12); //numbers from HAC table 4.4
      if (k >= 200) return randProbPrimeRounds(k, 15);
      if (k >= 150) return randProbPrimeRounds(k, 18);
      if (k >= 100) return randProbPrimeRounds(k, 27);
      return randProbPrimeRounds(k, 40); //number from HAC remark 4.26 (only an estimate)
    }

    //return a k-bit probable random prime using n rounds of Miller Rabin (after trial division with small primes)
    function randProbPrimeRounds(k, n) {
      var ans, i, divisible, B;
      B = 30000; //B is largest prime to use in trial division
      ans = int2bigInt(0, k, 0);

      //optimization: try larger and smaller B to find the best limit.

      if (primes.length == 0) primes = findPrimes(30000); //check for divisibility by primes <=30000

      if (rpprb.length != ans.length) rpprb = dup(ans);

      for (;;) {
        //keep trying random values for ans until one appears to be prime
        //optimization: pick a random number times L=2*3*5*...*p, plus a
        //   random element of the list of all numbers in [0,L) not divisible by any prime up to p.
        //   This can reduce the amount of random number generation.

        randBigInt_(ans, k, 0); //ans = a random odd number to check
        ans[0] |= 1;
        divisible = 0;

        //check ans for divisibility by small primes up to B
        for (i = 0; i < primes.length && primes[i] <= B; i++) if (modInt(ans, primes[i]) == 0 && !equalsInt(ans, primes[i])) {
          divisible = 1;
          break;
        }

        //optimization: change millerRabin so the base can be bigger than the number being checked, then eliminate the while here.

        //do n rounds of Miller Rabin, with random bases less than ans
        for (i = 0; i < n && !divisible; i++) {
          randBigInt_(rpprb, k, 0);
          while (!greater(ans, rpprb)) //pick a random rpprb that's < ans
          randBigInt_(rpprb, k, 0);
          if (!millerRabin(ans, rpprb)) divisible = 1;
        }

        if (!divisible) return ans;
      }
    }

    //return a new bigInt equal to (x mod n) for bigInts x and n.
    function mod(x, n) {
      var ans = dup(x);
      mod_(ans, n);
      return trim(ans, 1);
    }

    //return (x+n) where x is a bigInt and n is an integer.
    function addInt(x, n) {
      var ans = expand(x, x.length + 1);
      addInt_(ans, n);
      return trim(ans, 1);
    }

    //return x*y for bigInts x and y. This is faster when y<x.
    function mult(x, y) {
      var ans = expand(x, x.length + y.length);
      mult_(ans, y);
      return trim(ans, 1);
    }

    //return (x**y mod n) where x,y,n are bigInts and ** is exponentiation.  0**0=1. Faster for odd n.
    function powMod(x, y, n) {
      var ans = expand(x, n.length);
      powMod_(ans, trim(y, 2), trim(n, 2), 0); //this should work without the trim, but doesn't
      return trim(ans, 1);
    }

    //return (x-y) for bigInts x and y.  Negative answers will be 2s complement
    function sub(x, y) {
      var ans = expand(x, x.length > y.length ? x.length + 1 : y.length + 1);
      sub_(ans, y);
      return trim(ans, 1);
    }

    //return (x+y) for bigInts x and y.
    function add(x, y) {
      var ans = expand(x, x.length > y.length ? x.length + 1 : y.length + 1);
      add_(ans, y);
      return trim(ans, 1);
    }

    //return (x**(-1) mod n) for bigInts x and n.  If no inverse exists, it returns null
    function inverseMod(x, n) {
      var ans = expand(x, n.length);
      var s;
      s = inverseMod_(ans, n);
      return s ? trim(ans, 1) : null;
    }

    //return (x*y mod n) for bigInts x,y,n.  For greater speed, let y<x.
    function multMod(x, y, n) {
      var ans = expand(x, n.length);
      multMod_(ans, y, n);
      return trim(ans, 1);
    }

    //generate a k-bit true random prime using Maurer's algorithm,
    //and put it into ans.  The bigInt ans must be large enough to hold it.
    function randTruePrime_(ans, k) {
      var c, m, pm, dd, j, r, B, divisible, z, zz, recSize;

      if (primes.length == 0) primes = findPrimes(30000); //check for divisibility by primes <=30000

      if (pows.length == 0) {
        pows = new Array(512);
        for (j = 0; j < 512; j++) {
          pows[j] = Math.pow(2, j / 511. - 1.);
        }
      }

      //c and m should be tuned for a particular machine and value of k, to maximize speed
      c = 0.1; //c=0.1 in HAC
      m = 20; //generate this k-bit number by first recursively generating a number that has between k/2 and k-m bits
      recLimit = 20; //stop recursion when k <=recLimit.  Must have recLimit >= 2

      if (s_i2.length != ans.length) {
        s_i2 = dup(ans);
        s_R = dup(ans);
        s_n1 = dup(ans);
        s_r2 = dup(ans);
        s_d = dup(ans);
        s_x1 = dup(ans);
        s_x2 = dup(ans);
        s_b = dup(ans);
        s_n = dup(ans);
        s_i = dup(ans);
        s_rm = dup(ans);
        s_q = dup(ans);
        s_a = dup(ans);
        s_aa = dup(ans);
      }

      if (k <= recLimit) {
        //generate small random primes by trial division up to its square root
        pm = (1 << (k + 2 >> 1)) - 1; //pm is binary number with all ones, just over sqrt(2^k)
        copyInt_(ans, 0);
        for (dd = 1; dd;) {
          dd = 0;
          ans[0] = 1 | 1 << k - 1 | Math.floor(Math.random() * (1 << k)); //random, k-bit, odd integer, with msb 1
          for (j = 1; j < primes.length && (primes[j] & pm) == primes[j]; j++) {
            //trial division by all primes 3...sqrt(2^k)
            if (0 == ans[0] % primes[j]) {
              dd = 1;
              break;
            }
          }
        }
        carry_(ans);
        return;
      }

      B = c * k * k; //try small primes up to B (or all the primes[] array if the largest is less than B).
      if (k > 2 * m) //generate this k-bit number by first recursively generating a number that has between k/2 and k-m bits
        for (r = 1; k - k * r <= m;) r = pows[Math.floor(Math.random() * 512)]; //r=Math.pow(2,Math.random()-1);
      else r = .5;

      //simulation suggests the more complex algorithm using r=.333 is only slightly faster.

      recSize = Math.floor(r * k) + 1;

      randTruePrime_(s_q, recSize);
      copyInt_(s_i2, 0);
      s_i2[Math.floor((k - 2) / bpe)] |= 1 << (k - 2) % bpe; //s_i2=2^(k-2)
      divide_(s_i2, s_q, s_i, s_rm); //s_i=floor((2^(k-1))/(2q))

      z = bitSize(s_i);

      for (;;) {
        for (;;) {
          //generate z-bit numbers until one falls in the range [0,s_i-1]
          randBigInt_(s_R, z, 0);
          if (greater(s_i, s_R)) break;
        } //now s_R is in the range [0,s_i-1]
        addInt_(s_R, 1); //now s_R is in the range [1,s_i]
        add_(s_R, s_i); //now s_R is in the range [s_i+1,2*s_i]

        copy_(s_n, s_q);
        mult_(s_n, s_R);
        multInt_(s_n, 2);
        addInt_(s_n, 1); //s_n=2*s_R*s_q+1

        copy_(s_r2, s_R);
        multInt_(s_r2, 2); //s_r2=2*s_R

        //check s_n for divisibility by small primes up to B
        for (divisible = 0, j = 0; j < primes.length && primes[j] < B; j++) if (modInt(s_n, primes[j]) == 0 && !equalsInt(s_n, primes[j])) {
          divisible = 1;
          break;
        }

        if (!divisible) //if it passes small primes check, then try a single Miller-Rabin base 2
          if (!millerRabinInt(s_n, 2)) //this line represents 75% of the total runtime for randTruePrime_
            divisible = 1;

        if (!divisible) {
          //if it passes that test, continue checking s_n
          addInt_(s_n, -3);
          for (j = s_n.length - 1; s_n[j] == 0 && j > 0; j--); //strip leading zeros
          for (zz = 0, w = s_n[j]; w; w >>= 1, zz++);
          zz += bpe * j; //zz=number of bits in s_n, ignoring leading zeros
          for (;;) {
            //generate z-bit numbers until one falls in the range [0,s_n-1]
            randBigInt_(s_a, zz, 0);
            if (greater(s_n, s_a)) break;
          } //now s_a is in the range [0,s_n-1]
          addInt_(s_n, 3); //now s_a is in the range [0,s_n-4]
          addInt_(s_a, 2); //now s_a is in the range [2,s_n-2]
          copy_(s_b, s_a);
          copy_(s_n1, s_n);
          addInt_(s_n1, -1);
          powMod_(s_b, s_n1, s_n); //s_b=s_a^(s_n-1) modulo s_n
          addInt_(s_b, -1);
          if (isZero(s_b)) {
            copy_(s_b, s_a);
            powMod_(s_b, s_r2, s_n);
            addInt_(s_b, -1);
            copy_(s_aa, s_n);
            copy_(s_d, s_b);
            GCD_(s_d, s_n); //if s_b and s_n are relatively prime, then s_n is a prime
            if (equalsInt(s_d, 1)) {
              copy_(ans, s_aa);
              return; //if we've made it this far, then s_n is absolutely guaranteed to be prime
            }
          }
        }
      }
    }

    //Return an n-bit random BigInt (n>=1).  If s=1, then the most significant of those n bits is set to 1.
    function randBigInt(n, s) {
      var a, b;
      a = Math.floor((n - 1) / bpe) + 2; //# array elements to hold the BigInt with a leading 0 element
      b = int2bigInt(0, 0, a);
      randBigInt_(b, n, s);
      return b;
    }

    //Set b to an n-bit random BigInt.  If s=1, then the most significant of those n bits is set to 1.
    //Array b must be big enough to hold the result. Must have n>=1
    function randBigInt_(b, n, s) {
      var i, a;
      for (i = 0; i < b.length; i++) b[i] = 0;
      a = Math.floor((n - 1) / bpe) + 1; //# array elements to hold the BigInt
      for (i = 0; i < a; i++) {
        b[i] = Math.floor(Math.random() * (1 << bpe - 1));
      }
      b[a - 1] &= (2 << (n - 1) % bpe) - 1;
      if (s == 1) b[a - 1] |= 1 << (n - 1) % bpe;
    }

    //Return the greatest common divisor of bigInts x and y (each with same number of elements).
    function GCD(x, y) {
      var xc, yc;
      xc = dup(x);
      yc = dup(y);
      GCD_(xc, yc);
      return xc;
    }

    //set x to the greatest common divisor of bigInts x and y (each with same number of elements).
    //y is destroyed.
    function GCD_(x, y) {
      var i, xp, yp, A, B, C, D, q, sing;
      if (T.length != x.length) T = dup(x);

      sing = 1;
      while (sing) {
        //while y has nonzero elements other than y[0]
        sing = 0;
        for (i = 1; i < y.length; i++) //check if y has nonzero elements other than 0
        if (y[i]) {
          sing = 1;
          break;
        }
        if (!sing) break; //quit when y all zero elements except possibly y[0]

        for (i = x.length; !x[i] && i >= 0; i--); //find most significant element of x
        xp = x[i];
        yp = y[i];
        A = 1;B = 0;C = 0;D = 1;
        while (yp + C && yp + D) {
          q = Math.floor((xp + A) / (yp + C));
          qp = Math.floor((xp + B) / (yp + D));
          if (q != qp) break;
          t = A - q * C;A = C;C = t; //  do (A,B,xp, C,D,yp) = (C,D,yp, A,B,xp) - q*(0,0,0, C,D,yp)
          t = B - q * D;B = D;D = t;
          t = xp - q * yp;xp = yp;yp = t;
        }
        if (B) {
          copy_(T, x);
          linComb_(x, y, A, B); //x=A*x+B*y
          linComb_(y, T, D, C); //y=D*y+C*T
        } else {
          mod_(x, y);
          copy_(T, x);
          copy_(x, y);
          copy_(y, T);
        }
      }
      if (y[0] == 0) return;
      t = modInt(x, y[0]);
      copyInt_(x, y[0]);
      y[0] = t;
      while (y[0]) {
        x[0] %= y[0];
        t = x[0];x[0] = y[0];y[0] = t;
      }
    }

    //do x=x**(-1) mod n, for bigInts x and n.
    //If no inverse exists, it sets x to zero and returns 0, else it returns 1.
    //The x array must be at least as large as the n array.
    function inverseMod_(x, n) {
      var k = 1 + 2 * Math.max(x.length, n.length);

      if (!(x[0] & 1) && !(n[0] & 1)) {
        //if both inputs are even, then inverse doesn't exist
        copyInt_(x, 0);
        return 0;
      }

      if (eg_u.length != k) {
        eg_u = new Array(k);
        eg_v = new Array(k);
        eg_A = new Array(k);
        eg_B = new Array(k);
        eg_C = new Array(k);
        eg_D = new Array(k);
      }

      copy_(eg_u, x);
      copy_(eg_v, n);
      copyInt_(eg_A, 1);
      copyInt_(eg_B, 0);
      copyInt_(eg_C, 0);
      copyInt_(eg_D, 1);
      for (;;) {
        while (!(eg_u[0] & 1)) {
          //while eg_u is even
          halve_(eg_u);
          if (!(eg_A[0] & 1) && !(eg_B[0] & 1)) {
            //if eg_A==eg_B==0 mod 2
            halve_(eg_A);
            halve_(eg_B);
          } else {
            add_(eg_A, n);halve_(eg_A);
            sub_(eg_B, x);halve_(eg_B);
          }
        }

        while (!(eg_v[0] & 1)) {
          //while eg_v is even
          halve_(eg_v);
          if (!(eg_C[0] & 1) && !(eg_D[0] & 1)) {
            //if eg_C==eg_D==0 mod 2
            halve_(eg_C);
            halve_(eg_D);
          } else {
            add_(eg_C, n);halve_(eg_C);
            sub_(eg_D, x);halve_(eg_D);
          }
        }

        if (!greater(eg_v, eg_u)) {
          //eg_v <= eg_u
          sub_(eg_u, eg_v);
          sub_(eg_A, eg_C);
          sub_(eg_B, eg_D);
        } else {
          //eg_v > eg_u
          sub_(eg_v, eg_u);
          sub_(eg_C, eg_A);
          sub_(eg_D, eg_B);
        }

        if (equalsInt(eg_u, 0)) {
          while (negative(eg_C)) //make sure answer is nonnegative
          add_(eg_C, n);
          copy_(x, eg_C);

          if (!equalsInt(eg_v, 1)) {
            //if GCD_(x,n)!=1, then there is no inverse
            copyInt_(x, 0);
            return 0;
          }
          return 1;
        }
      }
    }

    //return x**(-1) mod n, for integers x and n.  Return 0 if there is no inverse
    function inverseModInt(x, n) {
      var a = 1,
          b = 0,
          t;
      for (;;) {
        if (x == 1) return a;
        if (x == 0) return 0;
        b -= a * Math.floor(n / x);
        n %= x;

        if (n == 1) return b; //to avoid negatives, change this b to n-b, and each -= to +=
        if (n == 0) return 0;
        a -= b * Math.floor(x / n);
        x %= n;
      }
    }

    //this deprecated function is for backward compatibility only.
    function inverseModInt_(x, n) {
      return inverseModInt(x, n);
    }

    //Given positive bigInts x and y, change the bigints v, a, and b to positive bigInts such that:
    //     v = GCD_(x,y) = a*x-b*y
    //The bigInts v, a, b, must have exactly as many elements as the larger of x and y.
    function eGCD_(x, y, v, a, b) {
      var g = 0;
      var k = Math.max(x.length, y.length);
      if (eg_u.length != k) {
        eg_u = new Array(k);
        eg_A = new Array(k);
        eg_B = new Array(k);
        eg_C = new Array(k);
        eg_D = new Array(k);
      }
      while (!(x[0] & 1) && !(y[0] & 1)) {
        //while x and y both even
        halve_(x);
        halve_(y);
        g++;
      }
      copy_(eg_u, x);
      copy_(v, y);
      copyInt_(eg_A, 1);
      copyInt_(eg_B, 0);
      copyInt_(eg_C, 0);
      copyInt_(eg_D, 1);
      for (;;) {
        while (!(eg_u[0] & 1)) {
          //while u is even
          halve_(eg_u);
          if (!(eg_A[0] & 1) && !(eg_B[0] & 1)) {
            //if A==B==0 mod 2
            halve_(eg_A);
            halve_(eg_B);
          } else {
            add_(eg_A, y);halve_(eg_A);
            sub_(eg_B, x);halve_(eg_B);
          }
        }

        while (!(v[0] & 1)) {
          //while v is even
          halve_(v);
          if (!(eg_C[0] & 1) && !(eg_D[0] & 1)) {
            //if C==D==0 mod 2
            halve_(eg_C);
            halve_(eg_D);
          } else {
            add_(eg_C, y);halve_(eg_C);
            sub_(eg_D, x);halve_(eg_D);
          }
        }

        if (!greater(v, eg_u)) {
          //v<=u
          sub_(eg_u, v);
          sub_(eg_A, eg_C);
          sub_(eg_B, eg_D);
        } else {
          //v>u
          sub_(v, eg_u);
          sub_(eg_C, eg_A);
          sub_(eg_D, eg_B);
        }
        if (equalsInt(eg_u, 0)) {
          while (negative(eg_C)) {
            //make sure a (C) is nonnegative
            add_(eg_C, y);
            sub_(eg_D, x);
          }
          multInt_(eg_D, -1); ///make sure b (D) is nonnegative
          copy_(a, eg_C);
          copy_(b, eg_D);
          leftShift_(v, g);
          return;
        }
      }
    }

    //is bigInt x negative?
    function negative(x) {
      return x[x.length - 1] >> bpe - 1 & 1;
    }

    //is (x << (shift*bpe)) > y?
    //x and y are nonnegative bigInts
    //shift is a nonnegative integer
    function greaterShift(x, y, shift) {
      var i,
          kx = x.length,
          ky = y.length;
      k = kx + shift < ky ? kx + shift : ky;
      for (i = ky - 1 - shift; i < kx && i >= 0; i++) if (x[i] > 0) return 1; //if there are nonzeros in x to the left of the first column of y, then x is bigger
      for (i = kx - 1 + shift; i < ky; i++) if (y[i] > 0) return 0; //if there are nonzeros in y to the left of the first column of x, then x is not bigger
      for (i = k - 1; i >= shift; i--) if (x[i - shift] > y[i]) return 1;else if (x[i - shift] < y[i]) return 0;
      return 0;
    }

    //is x > y? (x and y both nonnegative)
    function greater(x, y) {
      var i;
      var k = x.length < y.length ? x.length : y.length;

      for (i = x.length; i < y.length; i++) if (y[i]) return 0; //y has more digits

      for (i = y.length; i < x.length; i++) if (x[i]) return 1; //x has more digits

      for (i = k - 1; i >= 0; i--) if (x[i] > y[i]) return 1;else if (x[i] < y[i]) return 0;
      return 0;
    }

    //divide x by y giving quotient q and remainder r.  (q=floor(x/y),  r=x mod y).  All 4 are bigints.
    //x must have at least one leading zero element.
    //y must be nonzero.
    //q and r must be arrays that are exactly the same length as x. (Or q can have more).
    //Must have x.length >= y.length >= 2.
    function divide_(x, y, q, r) {
      var kx, ky;
      var i, j, y1, y2, c, a, b;
      copy_(r, x);
      for (ky = y.length; y[ky - 1] == 0; ky--); //ky is number of elements in y, not including leading zeros

      //normalize: ensure the most significant element of y has its highest bit set
      b = y[ky - 1];
      for (a = 0; b; a++) b >>= 1;
      a = bpe - a; //a is how many bits to shift so that the high order bit of y is leftmost in its array element
      leftShift_(y, a); //multiply both by 1<<a now, then divide both by that at the end
      leftShift_(r, a);

      //Rob Visser discovered a bug: the following line was originally just before the normalization.
      for (kx = r.length; r[kx - 1] == 0 && kx > ky; kx--); //kx is number of elements in normalized x, not including leading zeros

      copyInt_(q, 0); // q=0
      while (!greaterShift(y, r, kx - ky)) {
        // while (leftShift_(y,kx-ky) <= r) {
        subShift_(r, y, kx - ky); //   r=r-leftShift_(y,kx-ky)
        q[kx - ky]++; //   q[kx-ky]++;
      } // }

      for (i = kx - 1; i >= ky; i--) {
        if (r[i] == y[ky - 1]) q[i - ky] = mask;else q[i - ky] = Math.floor((r[i] * radix + r[i - 1]) / y[ky - 1]);

        //The following for(;;) loop is equivalent to the commented while loop,
        //except that the uncommented version avoids overflow.
        //The commented loop comes from HAC, which assumes r[-1]==y[-1]==0
        //  while (q[i-ky]*(y[ky-1]*radix+y[ky-2]) > r[i]*radix*radix+r[i-1]*radix+r[i-2])
        //    q[i-ky]--;
        for (;;) {
          y2 = (ky > 1 ? y[ky - 2] : 0) * q[i - ky];
          c = y2 >> bpe;
          y2 = y2 & mask;
          y1 = c + q[i - ky] * y[ky - 1];
          c = y1 >> bpe;
          y1 = y1 & mask;

          if (c == r[i] ? y1 == r[i - 1] ? y2 > (i > 1 ? r[i - 2] : 0) : y1 > r[i - 1] : c > r[i]) q[i - ky]--;else break;
        }

        linCombShift_(r, y, -q[i - ky], i - ky); //r=r-q[i-ky]*leftShift_(y,i-ky)
        if (negative(r)) {
          addShift_(r, y, i - ky); //r=r+leftShift_(y,i-ky)
          q[i - ky]--;
        }
      }

      rightShift_(y, a); //undo the normalization step
      rightShift_(r, a); //undo the normalization step
    }

    //do carries and borrows so each element of the bigInt x fits in bpe bits.
    function carry_(x) {
      var i, k, c, b;
      k = x.length;
      c = 0;
      for (i = 0; i < k; i++) {
        c += x[i];
        b = 0;
        if (c < 0) {
          b = -(c >> bpe);
          c += b * radix;
        }
        x[i] = c & mask;
        c = (c >> bpe) - b;
      }
    }

    //return x mod n for bigInt x and integer n.
    function modInt(x, n) {
      var i,
          c = 0;
      for (i = x.length - 1; i >= 0; i--) c = (c * radix + x[i]) % n;
      return c;
    }

    //convert the integer t into a bigInt with at least the given number of bits.
    //the returned array stores the bigInt in bpe-bit chunks, little endian (buff[0] is least significant word)
    //Pad the array with leading zeros so that it has at least minSize elements.
    //There will always be at least one leading 0 element.
    function int2bigInt(t, bits, minSize) {
      var i, k;
      k = Math.ceil(bits / bpe) + 1;
      k = minSize > k ? minSize : k;
      buff = new Array(k);
      copyInt_(buff, t);
      return buff;
    }

    //return the bigInt given a string representation in a given base.
    //Pad the array with leading zeros so that it has at least minSize elements.
    //If base=-1, then it reads in a space-separated list of array elements in decimal.
    //The array will always have at least one leading zero, unless base=-1.
    function str2bigInt(s, base, minSize) {
      var d, i, j, x, y, kk;
      var k = s.length;
      if (base == -1) {
        //comma-separated list of array elements in decimal
        x = new Array(0);
        for (;;) {
          y = new Array(x.length + 1);
          for (i = 0; i < x.length; i++) y[i + 1] = x[i];
          y[0] = parseInt(s, 10);
          x = y;
          d = s.indexOf(',', 0);
          if (d < 1) break;
          s = s.substring(d + 1);
          if (s.length == 0) break;
        }
        if (x.length < minSize) {
          y = new Array(minSize);
          copy_(y, x);
          return y;
        }
        return x;
      }

      x = int2bigInt(0, base * k, 0);
      for (i = 0; i < k; i++) {
        d = digitsStr.indexOf(s.substring(i, i + 1), 0);
        if (base <= 36 && d >= 36) //convert lowercase to uppercase if base<=36
          d -= 26;
        if (d >= base || d < 0) {
          //stop at first illegal character
          break;
        }
        multInt_(x, base);
        addInt_(x, d);
      }

      for (k = x.length; k > 0 && !x[k - 1]; k--); //strip off leading zeros
      k = minSize > k + 1 ? minSize : k + 1;
      y = new Array(k);
      kk = k < x.length ? k : x.length;
      for (i = 0; i < kk; i++) y[i] = x[i];
      for (; i < k; i++) y[i] = 0;
      return y;
    }

    //is bigint x equal to integer y?
    //y must have less than bpe bits
    function equalsInt(x, y) {
      var i;
      if (x[0] != y) return 0;
      for (i = 1; i < x.length; i++) if (x[i]) return 0;
      return 1;
    }

    //are bigints x and y equal?
    //this works even if x and y are different lengths and have arbitrarily many leading zeros
    function equals(x, y) {
      var i;
      var k = x.length < y.length ? x.length : y.length;
      for (i = 0; i < k; i++) if (x[i] != y[i]) return 0;
      if (x.length > y.length) {
        for (; i < x.length; i++) if (x[i]) return 0;
      } else {
        for (; i < y.length; i++) if (y[i]) return 0;
      }
      return 1;
    }

    //is the bigInt x equal to zero?
    function isZero(x) {
      var i;
      for (i = 0; i < x.length; i++) if (x[i]) return 0;
      return 1;
    }

    //convert a bigInt into a string in a given base, from base 2 up to base 95.
    //Base -1 prints the contents of the array representing the number.
    function bigInt2str(x, base) {
      var i,
          t,
          s = "";

      if (s6.length != x.length) s6 = dup(x);else copy_(s6, x);

      if (base == -1) {
        //return the list of array contents
        for (i = x.length - 1; i > 0; i--) s += x[i] + ',';
        s += x[0];
      } else {
        //return it in the given base
        while (!isZero(s6)) {
          t = divInt_(s6, base); //t=s6 % base; s6=floor(s6/base);
          s = digitsStr.substring(t, t + 1) + s;
        }
      }
      if (s.length == 0) s = "0";
      return s;
    }

    //returns a duplicate of bigInt x
    function dup(x) {
      var i;
      buff = new Array(x.length);
      copy_(buff, x);
      return buff;
    }

    //do x=y on bigInts x and y.  x must be an array at least as big as y (not counting the leading zeros in y).
    function copy_(x, y) {
      var i;
      var k = x.length < y.length ? x.length : y.length;
      for (i = 0; i < k; i++) x[i] = y[i];
      for (i = k; i < x.length; i++) x[i] = 0;
    }

    //do x=y on bigInt x and integer y.
    function copyInt_(x, n) {
      var i, c;
      for (c = n, i = 0; i < x.length; i++) {
        x[i] = c & mask;
        c >>= bpe;
      }
    }

    //do x=x+n where x is a bigInt and n is an integer.
    //x must be large enough to hold the result.
    function addInt_(x, n) {
      var i, k, c, b;
      x[0] += n;
      k = x.length;
      c = 0;
      for (i = 0; i < k; i++) {
        c += x[i];
        b = 0;
        if (c < 0) {
          b = -(c >> bpe);
          c += b * radix;
        }
        x[i] = c & mask;
        c = (c >> bpe) - b;
        if (!c) return; //stop carrying as soon as the carry is zero
      }
    }

    //right shift bigInt x by n bits.  0 <= n < bpe.
    function rightShift_(x, n) {
      var i;
      var k = Math.floor(n / bpe);
      if (k) {
        for (i = 0; i < x.length - k; i++) //right shift x by k elements
        x[i] = x[i + k];
        for (; i < x.length; i++) x[i] = 0;
        n %= bpe;
      }
      for (i = 0; i < x.length - 1; i++) {
        x[i] = mask & (x[i + 1] << bpe - n | x[i] >> n);
      }
      x[i] >>= n;
    }

    //do x=floor(|x|/2)*sgn(x) for bigInt x in 2's complement
    function halve_(x) {
      var i;
      for (i = 0; i < x.length - 1; i++) {
        x[i] = mask & (x[i + 1] << bpe - 1 | x[i] >> 1);
      }
      x[i] = x[i] >> 1 | x[i] & radix >> 1; //most significant bit stays the same
    }

    //left shift bigInt x by n bits.
    function leftShift_(x, n) {
      var i;
      var k = Math.floor(n / bpe);
      if (k) {
        for (i = x.length; i >= k; i--) //left shift x by k elements
        x[i] = x[i - k];
        for (; i >= 0; i--) x[i] = 0;
        n %= bpe;
      }
      if (!n) return;
      for (i = x.length - 1; i > 0; i--) {
        x[i] = mask & (x[i] << n | x[i - 1] >> bpe - n);
      }
      x[i] = mask & x[i] << n;
    }

    //do x=x*n where x is a bigInt and n is an integer.
    //x must be large enough to hold the result.
    function multInt_(x, n) {
      var i, k, c, b;
      if (!n) return;
      k = x.length;
      c = 0;
      for (i = 0; i < k; i++) {
        c += x[i] * n;
        b = 0;
        if (c < 0) {
          b = -(c >> bpe);
          c += b * radix;
        }
        x[i] = c & mask;
        c = (c >> bpe) - b;
      }
    }

    //do x=floor(x/n) for bigInt x and integer n, and return the remainder
    function divInt_(x, n) {
      var i,
          r = 0,
          s;
      for (i = x.length - 1; i >= 0; i--) {
        s = r * radix + x[i];
        x[i] = Math.floor(s / n);
        r = s % n;
      }
      return r;
    }

    //do the linear combination x=a*x+b*y for bigInts x and y, and integers a and b.
    //x must be large enough to hold the answer.
    function linComb_(x, y, a, b) {
      var i, c, k, kk;
      k = x.length < y.length ? x.length : y.length;
      kk = x.length;
      for (c = 0, i = 0; i < k; i++) {
        c += a * x[i] + b * y[i];
        x[i] = c & mask;
        c >>= bpe;
      }
      for (i = k; i < kk; i++) {
        c += a * x[i];
        x[i] = c & mask;
        c >>= bpe;
      }
    }

    //do the linear combination x=a*x+b*(y<<(ys*bpe)) for bigInts x and y, and integers a, b and ys.
    //x must be large enough to hold the answer.
    function linCombShift_(x, y, b, ys) {
      var i, c, k, kk;
      k = x.length < ys + y.length ? x.length : ys + y.length;
      kk = x.length;
      for (c = 0, i = ys; i < k; i++) {
        c += x[i] + b * y[i - ys];
        x[i] = c & mask;
        c >>= bpe;
      }
      for (i = k; c && i < kk; i++) {
        c += x[i];
        x[i] = c & mask;
        c >>= bpe;
      }
    }

    //do x=x+(y<<(ys*bpe)) for bigInts x and y, and integers a,b and ys.
    //x must be large enough to hold the answer.
    function addShift_(x, y, ys) {
      var i, c, k, kk;
      k = x.length < ys + y.length ? x.length : ys + y.length;
      kk = x.length;
      for (c = 0, i = ys; i < k; i++) {
        c += x[i] + y[i - ys];
        x[i] = c & mask;
        c >>= bpe;
      }
      for (i = k; c && i < kk; i++) {
        c += x[i];
        x[i] = c & mask;
        c >>= bpe;
      }
    }

    //do x=x-(y<<(ys*bpe)) for bigInts x and y, and integers a,b and ys.
    //x must be large enough to hold the answer.
    function subShift_(x, y, ys) {
      var i, c, k, kk;
      k = x.length < ys + y.length ? x.length : ys + y.length;
      kk = x.length;
      for (c = 0, i = ys; i < k; i++) {
        c += x[i] - y[i - ys];
        x[i] = c & mask;
        c >>= bpe;
      }
      for (i = k; c && i < kk; i++) {
        c += x[i];
        x[i] = c & mask;
        c >>= bpe;
      }
    }

    //do x=x-y for bigInts x and y.
    //x must be large enough to hold the answer.
    //negative answers will be 2s complement
    function sub_(x, y) {
      var i, c, k, kk;
      k = x.length < y.length ? x.length : y.length;
      for (c = 0, i = 0; i < k; i++) {
        c += x[i] - y[i];
        x[i] = c & mask;
        c >>= bpe;
      }
      for (i = k; c && i < x.length; i++) {
        c += x[i];
        x[i] = c & mask;
        c >>= bpe;
      }
    }

    //do x=x+y for bigInts x and y.
    //x must be large enough to hold the answer.
    function add_(x, y) {
      var i, c, k, kk;
      k = x.length < y.length ? x.length : y.length;
      for (c = 0, i = 0; i < k; i++) {
        c += x[i] + y[i];
        x[i] = c & mask;
        c >>= bpe;
      }
      for (i = k; c && i < x.length; i++) {
        c += x[i];
        x[i] = c & mask;
        c >>= bpe;
      }
    }

    //do x=x*y for bigInts x and y.  This is faster when y<x.
    function mult_(x, y) {
      var i;
      if (ss.length != 2 * x.length) ss = new Array(2 * x.length);
      copyInt_(ss, 0);
      for (i = 0; i < y.length; i++) if (y[i]) linCombShift_(ss, x, y[i], i); //ss=1*ss+y[i]*(x<<(i*bpe))
      copy_(x, ss);
    }

    //do x=x mod n for bigInts x and n.
    function mod_(x, n) {
      if (s4.length != x.length) s4 = dup(x);else copy_(s4, x);
      if (s5.length != x.length) s5 = dup(x);
      divide_(s4, n, s5, x); //x = remainder of s4 / n
    }

    //do x=x*y mod n for bigInts x,y,n.
    //for greater speed, let y<x.
    function multMod_(x, y, n) {
      var i;
      if (s0.length != 2 * x.length) s0 = new Array(2 * x.length);
      copyInt_(s0, 0);
      for (i = 0; i < y.length; i++) if (y[i]) linCombShift_(s0, x, y[i], i); //s0=1*s0+y[i]*(x<<(i*bpe))
      mod_(s0, n);
      copy_(x, s0);
    }

    //do x=x*x mod n for bigInts x,n.
    function squareMod_(x, n) {
      var i, j, d, c, kx, kn, k;
      for (kx = x.length; kx > 0 && !x[kx - 1]; kx--); //ignore leading zeros in x
      k = kx > n.length ? 2 * kx : 2 * n.length; //k=# elements in the product, which is twice the elements in the larger of x and n
      if (s0.length != k) s0 = new Array(k);
      copyInt_(s0, 0);
      for (i = 0; i < kx; i++) {
        c = s0[2 * i] + x[i] * x[i];
        s0[2 * i] = c & mask;
        c >>= bpe;
        for (j = i + 1; j < kx; j++) {
          c = s0[i + j] + 2 * x[i] * x[j] + c;
          s0[i + j] = c & mask;
          c >>= bpe;
        }
        s0[i + kx] = c;
      }
      mod_(s0, n);
      copy_(x, s0);
    }

    //return x with exactly k leading zero elements
    function trim(x, k) {
      var i, y;
      for (i = x.length; i > 0 && !x[i - 1]; i--);
      y = new Array(i + k);
      copy_(y, x);
      return y;
    }

    //do x=x**y mod n, where x,y,n are bigInts and ** is exponentiation.  0**0=1.
    //this is faster when n is odd.  x usually needs to have as many elements as n.
    function powMod_(x, y, n) {
      var k1, k2, kn, np;
      if (s7.length != n.length) s7 = dup(n);

      //for even modulus, use a simple square-and-multiply algorithm,
      //rather than using the more complex Montgomery algorithm.
      if ((n[0] & 1) == 0) {
        copy_(s7, x);
        copyInt_(x, 1);
        while (!equalsInt(y, 0)) {
          if (y[0] & 1) multMod_(x, s7, n);
          divInt_(y, 2);
          squareMod_(s7, n);
        }
        return;
      }

      //calculate np from n for the Montgomery multiplications
      copyInt_(s7, 0);
      for (kn = n.length; kn > 0 && !n[kn - 1]; kn--);
      np = radix - inverseModInt(modInt(n, radix), radix);
      s7[kn] = 1;
      multMod_(x, s7, n); // x = x * 2**(kn*bp) mod n

      if (s3.length != x.length) s3 = dup(x);else copy_(s3, x);

      for (k1 = y.length - 1; k1 > 0 & !y[k1]; k1--); //k1=first nonzero element of y
      if (y[k1] == 0) {
        //anything to the 0th power is 1
        copyInt_(x, 1);
        return;
      }
      for (k2 = 1 << bpe - 1; k2 && !(y[k1] & k2); k2 >>= 1); //k2=position of first 1 bit in y[k1]
      for (;;) {
        if (!(k2 >>= 1)) {
          //look at next bit of y
          k1--;
          if (k1 < 0) {
            mont_(x, one, n, np);
            return;
          }
          k2 = 1 << bpe - 1;
        }
        mont_(x, x, n, np);

        if (k2 & y[k1]) //if next bit is a 1
          mont_(x, s3, n, np);
      }
    }

    //do x=x*y*Ri mod n for bigInts x,y,n,
    //  where Ri = 2**(-kn*bpe) mod n, and kn is the
    //  number of elements in the n array, not
    //  counting leading zeros.
    //x array must have at least as many elemnts as the n array
    //It's OK if x and y are the same variable.
    //must have:
    //  x,y < n
    //  n is odd
    //  np = -(n^(-1)) mod radix
    function mont_(x, y, n, np) {
      var i, j, c, ui, t, ks;
      var kn = n.length;
      var ky = y.length;

      if (sa.length != kn) sa = new Array(kn);

      copyInt_(sa, 0);

      for (; kn > 0 && n[kn - 1] == 0; kn--); //ignore leading zeros of n
      for (; ky > 0 && y[ky - 1] == 0; ky--); //ignore leading zeros of y
      ks = sa.length - 1; //sa will never have more than this many nonzero elements.

      //the following loop consumes 95% of the runtime for randTruePrime_() and powMod_() for large numbers
      for (i = 0; i < kn; i++) {
        t = sa[0] + x[i] * y[0];
        ui = (t & mask) * np & mask; //the inner "& mask" was needed on Safari (but not MSIE) at one time
        c = t + ui * n[0] >> bpe;
        t = x[i];

        //do sa=(sa+x[i]*y+ui*n)/b   where b=2**bpe.  Loop is unrolled 5-fold for speed
        j = 1;
        for (; j < ky - 4;) {
          c += sa[j] + ui * n[j] + t * y[j];sa[j - 1] = c & mask;c >>= bpe;j++;
          c += sa[j] + ui * n[j] + t * y[j];sa[j - 1] = c & mask;c >>= bpe;j++;
          c += sa[j] + ui * n[j] + t * y[j];sa[j - 1] = c & mask;c >>= bpe;j++;
          c += sa[j] + ui * n[j] + t * y[j];sa[j - 1] = c & mask;c >>= bpe;j++;
          c += sa[j] + ui * n[j] + t * y[j];sa[j - 1] = c & mask;c >>= bpe;j++;
        }
        for (; j < ky;) {
          c += sa[j] + ui * n[j] + t * y[j];sa[j - 1] = c & mask;c >>= bpe;j++;
        }
        for (; j < kn - 4;) {
          c += sa[j] + ui * n[j];sa[j - 1] = c & mask;c >>= bpe;j++;
          c += sa[j] + ui * n[j];sa[j - 1] = c & mask;c >>= bpe;j++;
          c += sa[j] + ui * n[j];sa[j - 1] = c & mask;c >>= bpe;j++;
          c += sa[j] + ui * n[j];sa[j - 1] = c & mask;c >>= bpe;j++;
          c += sa[j] + ui * n[j];sa[j - 1] = c & mask;c >>= bpe;j++;
        }
        for (; j < kn;) {
          c += sa[j] + ui * n[j];sa[j - 1] = c & mask;c >>= bpe;j++;
        }
        for (; j < ks;) {
          c += sa[j];sa[j - 1] = c & mask;c >>= bpe;j++;
        }
        sa[j - 1] = c & mask;
      }

      if (!greater(n, sa)) sub_(sa, n);
      copy_(x, sa);
    }
  })(this);

  return _retrieveGlobal();
});
$__System.register('7', [], function (_export) {
    //UTILS
    'use strict';

    var encoding_table, decoding_table, encoding_table_hex, decoding_table_hex, mod_table;

    //Returns Uint8Array, expects base64 encoded string

    _export('base64_encode', base64_encode);

    _export('base64_decode', base64_decode);

    _export('byteArrayToHexString', byteArrayToHexString);

    _export('hexStringToByteArray', hexStringToByteArray);

    _export('stringToByteArray', stringToByteArray);

    /* This method will ensure that we have the same length for all the mesages
    */

    _export('byteArrayToString', byteArrayToString);

    _export('padMessage', padMessage);

    _export('isJson', isJson);

    _export('hexToBinary', hexToBinary);

    _export('base64ToByteArray', base64ToByteArray);

    _export('base64UrlDecode', base64UrlDecode);

    _export('h2d', h2d);

    _export('sha1', sha1);

    // Returns base64 encoded string, expects Uint8Array

    function base64_encode(data) {
        if (!data.buffer) {
            data = new Uint8Array(data);
        }
        var input_length = data.byteLength;
        var output_length = 4 * Math.floor((input_length + 2) / 3);

        var encoded_data = new Array(output_length);

        for (var i = 0, j = 0; i < input_length;) {
            var octet_a = i < input_length ? data[i++] : 0;
            var octet_b = i < input_length ? data[i++] : 0;
            var octet_c = i < input_length ? data[i++] : 0;

            var triple = (octet_a << 0x10) + (octet_b << 0x08) + octet_c;

            encoded_data[j++] = encoding_table[triple >> 3 * 6 & 0x3F];
            encoded_data[j++] = encoding_table[triple >> 2 * 6 & 0x3F];
            encoded_data[j++] = encoding_table[triple >> 1 * 6 & 0x3F];
            encoded_data[j++] = encoding_table[triple >> 0 * 6 & 0x3F];
        }

        for (var i = 0; i < mod_table[input_length % 3]; i++) encoded_data[output_length - 1 - i] = '=';

        return encoded_data.join('');
    }

    function base64_decode(data) {
        var input_length = data.length;
        if (input_length % 4 !== 0) return;

        var output_length = Math.floor(input_length / 4) * 3;
        if (data[input_length - 1] === '=') output_length--;
        if (data[input_length - 2] === '=') output_length--;

        var decoded_data = new Uint8Array(output_length);
        for (var i = 0, j = 0; i < input_length;) {
            var sextet_a = data[i] === '=' ? 0 & i++ : decoding_table[data[i++].charCodeAt()]; // TODO: check accesses are correct
            var sextet_b = data[i] === '=' ? 0 & i++ : decoding_table[data[i++].charCodeAt()];
            var sextet_c = data[i] === '=' ? 0 & i++ : decoding_table[data[i++].charCodeAt()];
            var sextet_d = data[i] === '=' ? 0 & i++ : decoding_table[data[i++].charCodeAt()];

            var triple = (sextet_a << 3 * 6) + (sextet_b << 2 * 6) + (sextet_c << 1 * 6) + (sextet_d << 0 * 6);
            if (j < output_length) decoded_data[j++] = triple >> 2 * 8 & 0xFF;
            if (j < output_length) decoded_data[j++] = triple >> 1 * 8 & 0xFF;
            if (j < output_length) decoded_data[j++] = triple >> 0 * 8 & 0xFF;
        }
        return decoded_data;
    }

    function byteArrayToHexString(byteArray) {
        var hexString = '';
        var nextHexByte;
        for (var i = 0; i < byteArray.byteLength; i++) {
            nextHexByte = byteArray[i].toString(16); // Integer to base 16
            if (nextHexByte.length < 2) {
                nextHexByte = "0" + nextHexByte; // Otherwise 10 becomes just a instead of 0a
            }
            hexString += nextHexByte;
        }
        return hexString;
    }

    function hexStringToByteArray(hexString) {
        if (hexString.length % 2 !== 0) {
            throw "Must have an even number of hex digits to convert to bytes";
        }
        var numBytes = hexString.length / 2;
        var byteArray = new Uint8Array(numBytes);
        for (var i = 0; i < numBytes; i++) {
            byteArray[i] = parseInt(hexString.substr(i * 2, 2), 16);
        }
        return byteArray;
    }

    function stringToByteArray(s) {
        if (typeof TextEncoder != 'undefined') {
            var encoder = new TextEncoder();
            return encoder.encode(s);
        }

        // Otherwise, fall back to 7-bit ASCII only
        var result = new Uint8Array(s.length);
        for (var i = 0; i < s.length; i++) {
            result[i] = s.charCodeAt(i);
        }
        return result;
    }

    function byteArrayToString(byteArray) {
        if (typeof TextEncoder != 'undefined') {
            var decoder = new TextDecoder();
            return decoder.decode(byteArray);
        }

        // Otherwise, fall back to 7-bit ASCII only
        var result = "";
        for (var i = 0; i < byteArray.byteLength; i++) {
            result += String.fromCharCode(byteArray[i]);
        }
        return result;
    }

    function padMessage(msg) {
        var mxLen = 14000;
        var padLen = mxLen - msg.length + 1;
        if (padLen < 0) {
            throw 'msgtoobig';
        }
        return msg + new Array(padLen).join("\n");
    }

    function isJson(str) {
        // If can be parsed that means it's a str.
        // If cannot be parsed and is an object then it's a JSON.
        try {
            JSON.parse(str);
        } catch (e) {
            if (typeof str == 'object') return true;
        }
        return false;
    }

    function hexToBinary(s) {
        var i,
            k,
            part,
            ret = '';
        // lookup table for easier conversion. '0' characters are padded for '1' to '7'
        var lookupTable = {
            '0': '0000', '1': '0001', '2': '0010', '3': '0011', '4': '0100',
            '5': '0101', '6': '0110', '7': '0111', '8': '1000', '9': '1001',
            'a': '1010', 'b': '1011', 'c': '1100', 'd': '1101',
            'e': '1110', 'f': '1111',
            'A': '1010', 'B': '1011', 'C': '1100', 'D': '1101',
            'E': '1110', 'F': '1111'
        };
        for (i = 0; i < s.length; i += 1) {
            if (lookupTable.hasOwnProperty(s[i])) {
                ret += lookupTable[s[i]];
            } else {
                return { valid: false };
            }
        }
        return { valid: true, result: ret };
    }

    function base64ToByteArray(base64String) {
        var binaryString = atob(base64String);
        var byteArray = new Uint8Array(binaryString.length);
        for (var i = 0; i < binaryString.length; i++) {
            byteArray[i] += binaryString.charCodeAt(i);
        }
        return byteArray;
    }

    function byteArrayToBase64(byteArray) {
        var binaryString = "";
        for (var i = 0; i < byteArray.byteLength; i++) {
            binaryString += String.fromCharCode(byteArray[i]);
        }
        var base64String = btoa(binaryString);
        return base64String;
    }

    function base64UrlDecode(str) {
        str = atob(str.replace(/-/g, '+').replace(/_/g, '/'));
        var buffer = new Uint8Array(str.length);
        for (var i = 0; i < str.length; ++i) {
            buffer[i] = str.charCodeAt(i);
        }
        return buffer;
    }

    function h2d(s) {

        function add(x, y) {
            var c = 0,
                r = [];
            var x = x.split('').map(Number);
            var y = y.split('').map(Number);
            while (x.length || y.length) {
                var s = (x.pop() || 0) + (y.pop() || 0) + c;
                r.unshift(s < 10 ? s : s - 10);
                c = s < 10 ? 0 : 1;
            }
            if (c) r.unshift(c);
            return r.join('');
        }

        var dec = '0';
        s.split('').forEach(function (chr) {
            var n = parseInt(chr, 16);
            for (var t = 8; t; t >>= 1) {
                dec = add(dec, dec);
                if (n & t) dec = add(dec, '1');
            }
        });
        return dec;
    }

    function sha1(msg) {
        var promise = new Promise(function (resolve, reject) {
            crypto.subtle.digest("SHA-1", stringToByteArray(msg)).then(function (hash) {
                resolve(byteArrayToHexString(new Uint8Array(hash)));
            });
        });
        return promise;
    }

    function sha256(msg) {
        var promise = new Promise(function (resolve, reject) {
            crypto.subtle.digest("SHA-256", stringToByteArray(msg)).then(function (hash) {
                resolve(byteArrayToHexString(new Uint8Array(hash)));
            });
        });
        return promise;
    }
    return {
        setters: [],
        execute: function () {
            encoding_table = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
            decoding_table = [,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,, 62,,,, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61,,,,,,,, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25,,,,,,, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51];
            encoding_table_hex = '0123456789abcdef';
            decoding_table_hex = [,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,, 10, 11, 12, 13, 14, 15];
            mod_table = [0, 2, 1];
        }
    };
});
$__System.register('8', ['b', '4', '7'], function (_export) {
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
$__System.register("c", [], function (_export) {
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
$__System.register('4', ['5', '7', '6', '8', 'c'], function (_export) {

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
          var _ret2 = function () {
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
          }();

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
$__System.register('1', ['4'], function (_export) {
  'use strict';

  return {
    setters: [function (_workerIndex) {}],
    execute: function () {}
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2Jvd2VyX2NvbXBvbmVudHMvbWQ1L2luZGV4LmpzIiwid29ya2VyL2hwbi93b3JrZXIvdXRpbHMuZXMiLCJ3b3JrZXIvaHBuL3dvcmtlci9tZXNzYWdlLWNvbnRleHQuZXMiLCJ3b3JrZXIvaHBuL3dvcmtlci9wa2NzLWNvbnZlcnNpb24uZXMiLCJ3b3JrZXIvaHBuL3dvcmtlci9odHRwLXdvcmtlci5lcyIsIndvcmtlci9ocG4vd29ya2VyL3VzZXItcGsuZXMiLCIuLi8uLi8uLi9ib3dlcl9jb21wb25lbnRzL2JpZ2ludC9pbmRleC5qcyIsIndvcmtlci9ocG4vd29ya2VyL2NyeXB0by11dGlscy5lcyIsIndvcmtlci9ocG4vd29ya2VyL2JsaW5kLXNpZ25hdHVyZS5lcyIsIi4uL2NvcmUvY29yZS9jb25maWcuZXMiLCJ3b3JrZXIvaHBuL3dvcmtlci9pbmRleC5lcyJdLCJuYW1lcyI6WyJtZDUiLCJoZXgiLCJyaGV4IiwibWQ1MSIsIm1kNWJsayIsIm1kNWN5Y2xlIiwiaWkiLCJoaCIsImdnIiwiZmYiLCJjbW4iLCJhZGQzMiIsImEiLCJiIiwicSIsIngiLCJzIiwidCIsImFhIiwiYyIsImQiLCJrIiwieHgiLCJtZDVibGtzIiwiaSIsImNoYXJDb2RlQXQiLCJuIiwibGVuZ3RoIiwic3RhdGUiLCJzdWJzdHJpbmciLCJzcyIsInRhaWwiLCJoZXhDaHIiLCJzcGxpdCIsImoiLCJqb2luIiwibCIsIl9tZDUiLCJtb250XyIsInBvd01vZF8iLCJ0cmltIiwic3F1YXJlTW9kXyIsIm11bHRNb2RfIiwibW9kXyIsIm11bHRfIiwiYWRkXyIsInN1Yl8iLCJzdWJTaGlmdF8iLCJhZGRTaGlmdF8iLCJsaW5Db21iU2hpZnRfIiwibGluQ29tYl8iLCJkaXZJbnRfIiwibXVsdEludF8iLCJsZWZ0U2hpZnRfIiwiaGFsdmVfIiwicmlnaHRTaGlmdF8iLCJhZGRJbnRfIiwiY29weUludF8iLCJjb3B5XyIsImR1cCIsImJpZ0ludDJzdHIiLCJpc1plcm8iLCJlcXVhbHMiLCJlcXVhbHNJbnQiLCJzdHIyYmlnSW50IiwiaW50MmJpZ0ludCIsIm1vZEludCIsImNhcnJ5XyIsImRpdmlkZV8iLCJncmVhdGVyIiwiZ3JlYXRlclNoaWZ0IiwibmVnYXRpdmUiLCJlR0NEXyIsImludmVyc2VNb2RJbnRfIiwiaW52ZXJzZU1vZEludCIsImludmVyc2VNb2RfIiwiR0NEXyIsIkdDRCIsInJhbmRCaWdJbnRfIiwicmFuZEJpZ0ludCIsInJhbmRUcnVlUHJpbWVfIiwibXVsdE1vZCIsImludmVyc2VNb2QiLCJhZGQiLCJzdWIiLCJwb3dNb2QiLCJtdWx0IiwiYWRkSW50IiwibW9kIiwicmFuZFByb2JQcmltZVJvdW5kcyIsInJhbmRQcm9iUHJpbWUiLCJyYW5kVHJ1ZVByaW1lIiwiZXhwYW5kIiwiYml0U2l6ZSIsIm1pbGxlclJhYmluIiwibWlsbGVyUmFiaW5JbnQiLCJmaW5kUHJpbWVzIiwiYnBlIiwibWFzayIsInJhZGl4IiwiZGlnaXRzU3RyIiwib25lIiwiQXJyYXkiLCJzMCIsInMxIiwiczIiLCJzMyIsInM0IiwiczUiLCJzNiIsInM3IiwiVCIsInNhIiwibXJfeDEiLCJtcl9yIiwibXJfYSIsImVnX3YiLCJlZ191IiwiZWdfQSIsImVnX0IiLCJlZ19DIiwiZWdfRCIsIm1kX3ExIiwibWRfcTIiLCJtZF9xMyIsIm1kX3IiLCJtZF9yMSIsIm1kX3IyIiwibWRfdHQiLCJwcmltZXMiLCJwb3dzIiwic19pIiwic19pMiIsInNfUiIsInNfcm0iLCJzX3EiLCJzX24xIiwic19hIiwic19yMiIsInNfbiIsInNfYiIsInNfZCIsInNfeDEiLCJzX3gyIiwic19hYSIsInJwcHJiIiwicCIsImFucyIsInoiLCJ3IiwiZGl2aXNpYmxlIiwiQiIsInkiLCJtIiwicG0iLCJkZCIsInIiLCJ6eiIsInJlY1NpemUiLCJNYXRoIiwicG93IiwicmVjTGltaXQiLCJmbG9vciIsInJhbmRvbSIsInhjIiwieWMiLCJ4cCIsInlwIiwiQSIsIkMiLCJEIiwic2luZyIsInFwIiwibWF4IiwidiIsImciLCJzaGlmdCIsImt4Iiwia3kiLCJ5MSIsInkyIiwiYml0cyIsIm1pblNpemUiLCJjZWlsIiwiYnVmZiIsImJhc2UiLCJrayIsInBhcnNlSW50IiwiaW5kZXhPZiIsInlzIiwia24iLCJrMSIsImsyIiwibnAiLCJ1aSIsImtzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7dUJBNkxTQTt1QkFSQUM7d0JBVEFDO3dCQXhCQUM7MEJBWkFDOzRCQWpHQUM7c0JBSkFDO3NCQUpBQztzQkFKQUM7c0JBSkFDO3VCQUxBQzt5QkFKQUM7QUFkVDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7Ozs7O0FBS0EsYUFBU0EsS0FBVCxDQUFlQyxDQUFmLEVBQWtCQyxDQUFsQixFQUFxQjtBQUNuQixhQUFRRCxJQUFJQyxDQUFMLEdBQVUsVUFBakI7QUFDRDs7QUFFRCxhQUFTSCxHQUFULENBQWFJLENBQWIsRUFBZ0JGLENBQWhCLEVBQW1CQyxDQUFuQixFQUFzQkUsQ0FBdEIsRUFBeUJDLENBQXpCLEVBQTRCQyxDQUE1QixFQUErQjtBQUM3QixZQUFNQyxLQUFLUCxNQUFNQSxNQUFNQyxDQUFOLEVBQVNFLENBQVQsQ0FBTixFQUFtQkgsTUFBTUksQ0FBTixFQUFTRSxDQUFULENBQW5CLENBQVg7QUFDQSxhQUFPTixNQUFPTyxNQUFNRixDQUFQLEdBQWFFLE9BQVEsS0FBS0YsQ0FBaEMsRUFBcUNILENBQXJDLENBQVA7QUFDRDs7QUFFRCxhQUFTSixFQUFULENBQVlHLENBQVosRUFBZUMsQ0FBZixFQUFrQk0sQ0FBbEIsRUFBcUJDLENBQXJCLEVBQXdCTCxDQUF4QixFQUEyQkMsQ0FBM0IsRUFBOEJDLENBQTlCLEVBQWlDO0FBQy9CLGFBQU9QLElBQUtHLElBQUlNLENBQUwsR0FBWSxDQUFDTixDQUFGLEdBQU9PLENBQXRCLEVBQTBCUixDQUExQixFQUE2QkMsQ0FBN0IsRUFBZ0NFLENBQWhDLEVBQW1DQyxDQUFuQyxFQUFzQ0MsQ0FBdEMsQ0FBUDtBQUNEOztBQUVELGFBQVNULEVBQVQsQ0FB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QUFLLEFBQUMsQUFDeEI7QUFBVywwQkFBQyxBQUFRLEFBQUMsQUFBQztBQUN2QixBQUFDLEFBQUM7O0FBQ04sQUFFRDs7WUFBSyxBQUFPLFlBQUssQUFBaUIsbUJBQUU7dUJBQ2xDO2dCQUFNLEFBQVMsWUFBRyxBQUFDLEVBQUMsQUFBSSxLQUFDLEFBQUcsQUFBQyxBQUM3QjtnQkFBTSxBQUFHLE1BQUcsQUFBQyxFQUFDLEFBQUksS0FBQyxBQUFHLEFBQUMsQUFDdkI7Z0JBQU0sQUFBUSxXQUFHLEFBQUUsQUFBQyxBQUVwQjs7QUFBa0IsK0JBQUMsQUFBRyxNQUFHLEVBQUMsQUFBWSxjQUFHLEFBQUMsRUFBQyxBQUFJLEtBQUMsQUFBRyxBQUFDLEFBQUMsQUFDckQ7Z0JBQU0sQUFBRyxNQUFHLElBQUksQUFBTSxPQUFDLEFBQUcsQUFBQyxBQUFDLEFBRTVCOztBQUFHLGdCQUFDLEFBQU0sT0FBQyxBQUFTLFdBQUUsQUFBRyxBQUFDLEtBQ3ZCLEFBQUksS0FBRSxVQUFBLEFBQU0sUUFBSSxBQUNmO0FBQVEsdUJBQUMsQUFBTSxTQUFHLEFBQU0sQUFBQyxBQUN6QjtBQUFXLDBCQUFDLEFBQVEsQUFBQyxBQUFDO0FBQ3ZCLEFBQUMsZUFDSSxTQUFFLFVBQUEsQUFBRyxLQUFJLEFBQ2I7QUFBUSx1QkFBQyxBQUFNLFNBQUcsQUFBSyxBQUFDLEFBQ3hCO0FBQVcsMEJBQUMsQUFBUSxBQUFDLEFBQUM7QUFDdkIsQUFBQyxBQUFDOztBQUNOO0FBQ0YsQUFBQzs7eUJBRWEsQUFBa0IiLCJmaWxlIjoid29ya2VyLmJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIFdBUk5JTkc6IGZvciB1dGYtOCBzdHJpbmdzIHJlc3VsdCB3aWxsIGJlIGRpZmZlcmVudCB0aGFuICdzdGFuZGFyZCcgbWQ1LlxuLy8gVGhpcyBpcyBiZWNhdXNlIHVuaWNvZGUgdmFsdWVzIGluc3RlYWQgb2YgdXRmLTggYnl0ZXMgYXJlIHVzZWQgKHRvIGF2b2lkXG4vLyBjb252ZXJzaW9uIG92ZXJoZWFkKS4gVXNpbmcgdGhpcyB0byBub3QgYnJlYWsgYW55dGhpbmcsIHNpbmNlIGl0IGhhcyBiZWVuXG4vLyB1c2VkIGZvciBsb25nIHRpbWUgaW4gc2V2ZXJhbCBwbGFjZXMgaW4gb3VyIGNvZGUuIElmIHlvdSBuZWVkIGEgJ3N0YW5kYXJkJ1xuLy8gbWQ1IGZ1bmN0aW9uLCB1c2UgYW5vdGhlciBvbmUuXG5cbi8vIENvcGllZCBmcm9tIGh0dHA6Ly93d3cubXllcnNkYWlseS5vcmcvam9zZXBoL2phdmFzY3JpcHQvbWQ1LXRleHQuaHRtbFxuLy8gYW5kIGFkYXB0ZWQgdG8gbWF0Y2ggb3VyIGNvZGluZyBzdHlsZSBndWlkZVxuXG4vKiB0aGlzIGZ1bmN0aW9uIGlzIG11Y2ggZmFzdGVyLFxuc28gaWYgcG9zc2libGUgd2UgdXNlIGl0LiBTb21lIElFc1xuYXJlIHRoZSBvbmx5IG9uZXMgSSBrbm93IG9mIHRoYXRcbm5lZWQgdGhlIGlkaW90aWMgc2Vjb25kIGZ1bmN0aW9uLFxuZ2VuZXJhdGVkIGJ5IGFuIGlmIGNsYXVzZS4gICovXG5mdW5jdGlvbiBhZGQzMihhLCBiKSB7XG4gIHJldHVybiAoYSArIGIpICYgMHhGRkZGRkZGRjtcbn1cblxuZnVuY3Rpb24gY21uKHEsIGEsIGIsIHgsIHMsIHQpIHtcbiAgY29uc3QgYWEgPSBhZGQzMihhZGQzMihhLCBxKSwgYWRkMzIoeCwgdCkpO1xuICByZXR1cm4gYWRkMzIoKGFhIDw8IHMpIHwgKGFhID4+PiAoMzIgLSBzKSksIGIpO1xufVxuXG5mdW5jdGlvbiBmZihhLCBiLCBjLCBkLCB4LCBzLCB0KSB7XG4gIHJldHVybiBjbW4oKGIgJiBjKSB8ICgofmIpICYgZCksIGEsIGIsIHgsIHMsIHQpO1xufVxuXG5mdW5jdGlvbiBnZyhhLCBiLCBjLCBkLCB4LCBzLCB0KSB7XG4gIHJldHVybiBjbW4oKGIgJiBkKSB8IChjICYgKH5kKSksIGEsIGIsIHgsIHMsIHQpO1xufVxuXG5mdW5jdGlvbiBoaChhLCBiLCBjLCBkLCB4LCBzLCB0KSB7XG4gIHJldHVybiBjbW4oYiBeIGMgXiBkLCBhLCBiLCB4LCBzLCB0KTtcbn1cblxuZnVuY3Rpb24gaWkoYSwgYiwgYywgZCwgeCwgcywgdCkge1xuICByZXR1cm4gY21uKGMgXiAoYiB8ICh+ZCkpLCBhLCBiLCB4LCBzLCB0KTtcbn1cblxuZnVuY3Rpb24gbWQ1Y3ljbGUoeCwgaykge1xuICBsZXQgYSA9IHhbMF07XG4gIGxldCBiID0geFsxXTtcbiAgbGV0IGMgPSB4WzJdO1xuICBsZXQgZCA9IHhbM107XG4gIGNvbnN0IHh4ID0geDtcblxuICBhID0gZmYoYSwgYiwgYywgZCwga1swXSwgNywgLTY4MDg3NjkzNik7XG4gIGQgPSBmZihkLCBhLCBiLCBjLCBrWzFdLCAxMiwgLTM4OTU2NDU4Nik7XG4gIGMgPSBmZihjLCBkLCBhLCBiLCBrWzJdLCAxNywgNjA2MTA1ODE5KTtcbiAgYiA9IGZmKGIsIGMsIGQsIGEsIGtbM10sIDIyLCAtMTA0NDUyNTMzMCk7XG4gIGEgPSBmZihhLCBiLCBjLCBkLCBrWzRdLCA3LCAtMTc2NDE4ODk3KTtcbiAgZCA9IGZmKGQsIGEsIGIsIGMsIGtbNV0sIDEyLCAxMjAwMDgwNDI2KTtcbiAgYyA9IGZmKGMsIGQsIGEsIGIsIGtbNl0sIDE3LCAtMTQ3MzIzMTM0MSk7XG4gIGIgPSBmZihiLCBjLCBkLCBhLCBrWzddLCAyMiwgLTQ1NzA1OTgzKTtcbiAgYSA9IGZmKGEsIGIsIGMsIGQsIGtbOF0sIDcsIDE3NzAwMzU0MTYpO1xuICBkID0gZmYoZCwgYSwgYiwgYywga1s5XSwgMTIsIC0xOTU4NDE0NDE3KTtcbiAgYyA9IGZmKGMsIGQsIGEsIGIsIGtbMTBdLCAxNywgLTQyMDYzKTtcbiAgYiA9IGZmKGIsIGMsIGQsIGEsIGtbMTFdLCAyMiwgLTE5OTA0MDQxNjIpO1xuICBhID0gZmYoYSwgYiwgYywgZCwga1sxMl0sIDcsIDE4MDQ2MDM2ODIpO1xuICBkID0gZmYoZCwgYSwgYiwgYywga1sxM10sIDEyLCAtNDAzNDExMDEpO1xuICBjID0gZmYoYywgZCwgYSwgYiwga1sxNF0sIDE3LCAtMTUwMjAwMjI5MCk7XG4gIGIgPSBmZihiLCBjLCBkLCBhLCBrWzE1XSwgMjIsIDEyMzY1MzUzMjkpO1xuXG4gIGEgPSBnZyhhLCBiLCBjLCBkLCBrWzFdLCA1LCAtMTY1Nzk2NTEwKTtcbiAgZCA9IGdnKGQsIGEsIGIsIGMsIGtbNl0sIDksIC0xMDY5NTAxNjMyKTtcbiAgYyA9IGdnKGMsIGQsIGEsIGIsIGtbMTFdLCAxNCwgNjQzNzE3NzEzKTtcbiAgYiA9IGdnKGIsIGMsIGQsIGEsIGtbMF0sIDIwLCAtMzczODk3MzAyKTtcbiAgYSA9IGdnKGEsIGIsIGMsIGQsIGtbNV0sIDUsIC03MDE1NTg2OTEpO1xuICBkID0gZ2coZCwgYSwgYiwgYywga1sxMF0sIDksIDM4MDE2MDgzKTtcbiAgYyA9IGdnKGMsIGQsIGEsIGIsIGtbMTVdLCAxNCwgLTY2MDQ3ODMzNSk7XG4gIGIgPSBnZyhiLCBjLCBkLCBhLCBrWzRdLCAyMCwgLTQwNTUzNzg0OCk7XG4gIGEgPSBnZyhhLCBiLCBjLCBkLCBrWzldLCA1LCA1Njg0NDY0MzgpO1xuICBkID0gZ2coZCwgYSwgYiwgYywga1sxNF0sIDksIC0xMDE5ODAzNjkwKTtcbiAgYyA9IGdnKGMsIGQsIGEsIGIsIGtbM10sIDE0LCAtMTg3MzYzOTYxKTtcbiAgYiA9IGdnKGIsIGMsIGQsIGEsIGtbOF0sIDIwLCAxMTYzNTMxNTAxKTtcbiAgYSA9IGdnKGEsIGIsIGMsIGQsIGtbMTNdLCA1LCAtMTQ0NDY4MTQ2Nyk7XG4gIGQgPSBnZyhkLCBhLCBiLCBjLCBrWzJdLCA5LCAtNTE0MDM3ODQpO1xuICBjID0gZ2coYywgZCwgYSwgYiwga1s3XSwgMTQsIDE3MzUzMjg0NzMpO1xuICBiID0gZ2coYiwgYywgZCwgYSwga1sxMl0sIDIwLCAtMTkyNjYwNzczNCk7XG5cbiAgYSA9IGhoKGEsIGIsIGMsIGQsIGtbNV0sIDQsIC0zNzg1NTgpO1xuICBkID0gaGgoZCwgYSwgYiwgYywga1s4XSwgMTEsIC0yMDIyNTc0NDYzKTtcbiAgYyA9IGhoKGMsIGQsIGEsIGIsIGtbMTFdLCAxNiwgMTgzOTAzMDU2Mik7XG4gIGIgPSBoaChiLCBjLCBkLCBhLCBrWzE0XSwgMjMsIC0zNTMwOTU1Nik7XG4gIGEgPSBoaChhLCBiLCBjLCBkLCBrWzFdLCA0LCAtMTUzMDk5MjA2MCk7XG4gIGQgPSBoaChkLCBhLCBiLCBjLCBrWzRdLCAxMSwgMTI3Mjg5MzM1Myk7XG4gIGMgPSBoaChjLCBkLCBhLCBiLCBrWzddLCAxNiwgLTE1NTQ5NzYzMik7XG4gIGIgPSBoaChiLCBjLCBkLCBhLCBrWzEwXSwgMjMsIC0xMDk0NzMwNjQwKTtcbiAgYSA9IGhoKGEsIGIsIGMsIGQsIGtbMTNdLCA0LCA2ODEyNzkxNzQpO1xuICBkID0gaGgoZCwgYSwgYiwgYywga1swXSwgMTEsIC0zNTg1MzcyMjIpO1xuICBjID0gaGgoYywgZCwgYSwgYiwga1szXSwgMTYsIC03MjI1MjE5NzkpO1xuICBiID0gaGgoYiwgYywgZCwgYSwga1s2XSwgMjMsIDc2MDI5MTg5KTtcbiAgYSA9IGhoKGEsIGIsIGMsIGQsIGtbOV0sIDQsIC02NDAzNjQ0ODcpO1xuICBkID0gaGgoZCwgYSwgYiwgYywga1sxMl0sIDExLCAtNDIxODE1ODM1KTtcbiAgYyA9IGhoKGMsIGQsIGEsIGIsIGtbMTVdLCAxNiwgNTMwNzQyNTIwKTtcbiAgYiA9IGhoKGIsIGMsIGQsIGEsIGtbMl0sIDIzLCAtOTk1MzM4NjUxKTtcblxuICBhID0gaWkoYSwgYiwgYywgZCwga1swXSwgNiwgLTE5ODYzMDg0NCk7XG4gIGQgPSBpaShkLCBhLCBiLCBjLCBrWzddLCAxMCwgMTEyNjg5MTQxNSk7XG4gIGMgPSBpaShjLCBkLCBhLCBiLCBrWzE0XSwgMTUsIC0xNDE2MzU0OTA1KTtcbiAgYiA9IGlpKGIsIGMsIGQsIGEsIGtbNV0sIDIxLCAtNTc0MzQwNTUpO1xuICBhID0gaWkoYSwgYiwgYywgZCwga1sxMl0sIDYsIDE3MDA0ODU1NzEpO1xuICBkID0gaWkoZCwgYSwgYiwgYywga1szXSwgMTAsIC0xODk0OTg2NjA2KTtcbiAgYyA9IGlpKGMsIGQsIGEsIGIsIGtbMTBdLCAxNSwgLTEwNTE1MjMpO1xuICBiID0gaWkoYiwgYywgZCwgYSwga1sxXSwgMjEsIC0yMDU0OTIyNzk5KTtcbiAgYSA9IGlpKGEsIGIsIGMsIGQsIGtbOF0sIDYsIDE4NzMzMTMzNTkpO1xuICBkID0gaWkoZCwgYSwgYiwgYywga1sxNV0sIDEwLCAtMzA2MTE3NDQpO1xuICBjID0gaWkoYywgZCwgYSwgYiwga1s2XSwgMTUsIC0xNTYwMTk4MzgwKTtcbiAgYiA9IGlpKGIsIGMsIGQsIGEsIGtbMTNdLCAyMSwgMTMwOTE1MTY0OSk7XG4gIGEgPSBpaShhLCBiLCBjLCBkLCBrWzRdLCA2LCAtMTQ1NTIzMDcwKTtcbiAgZCA9IGlpKGQsIGEsIGIsIGMsIGtbMTFdLCAxMCwgLTExMjAyMTAzNzkpO1xuICBjID0gaWkoYywgZCwgYSwgYiwga1syXSwgMTUsIDcxODc4NzI1OSk7XG4gIGIgPSBpaShiLCBjLCBkLCBhLCBrWzldLCAyMSwgLTM0MzQ4NTU1MSk7XG5cbiAgeHhbMF0gPSBhZGQzMihhLCB4WzBdKTtcbiAgeHhbMV0gPSBhZGQzMihiLCB4WzFdKTtcbiAgeHhbMl0gPSBhZGQzMihjLCB4WzJdKTtcbiAgeHhbM10gPSBhZGQzMihkLCB4WzNdKTtcbn1cblxuXG4vKiB0aGVyZSBuZWVkcyB0byBiZSBzdXBwb3J0IGZvciBVbmljb2RlIGhlcmUsXG4gKiB1bmxlc3Mgd2UgcHJldGVuZCB0aGF0IHdlIGNhbiByZWRlZmluZSB0aGUgTUQtNVxuICogYWxnb3JpdGhtIGZvciBtdWx0aS1ieXRlIGNoYXJhY3RlcnMgKHBlcmhhcHNcbiAqIGJ5IGFkZGluZyBldmVyeSBmb3VyIDE2LWJpdCBjaGFyYWN0ZXJzIGFuZFxuICogc2hvcnRlbmluZyB0aGUgc3VtIHRvIDMyIGJpdHMpLiBPdGhlcndpc2VcbiAqIEkgc3VnZ2VzdCBwZXJmb3JtaW5nIE1ELTUgYXMgaWYgZXZlcnkgY2hhcmFjdGVyXG4gKiB3YXMgdHdvIGJ5dGVzLS1lLmcuLCAwMDQwIDAwMjUgPSBAJS0tYnV0IHRoZW5cbiAqIGhvdyB3aWxsIGFuIG9yZGluYXJ5IE1ELTUgc3VtIGJlIG1hdGNoZWQ/XG4gKiBUaGVyZSBpcyBubyB3YXkgdG8gc3RhbmRhcmRpemUgdGV4dCB0byBzb21ldGhpbmdcbiAqIGxpa2UgVVRGLTggYmVmb3JlIHRyYW5zZm9ybWF0aW9uOyBzcGVlZCBjb3N0IGlzXG4gKiB1dHRlcmx5IHByb2hpYml0aXZlLiBUaGUgSmF2YVNjcmlwdCBzdGFuZGFyZFxuICogaXRzZWxmIG5lZWRzIHRvIGxvb2sgYXQgdGhpczogaXQgc2hvdWxkIHN0YXJ0XG4gKiBwcm92aWRpbmcgYWNjZXNzIHRvIHN0cmluZ3MgYXMgcHJlZm9ybWVkIFVURi04XG4gKiA4LWJpdCB1bnNpZ25lZCB2YWx1ZSBhcnJheXMuXG4gKi9cbmZ1bmN0aW9uIG1kNWJsayhzKSB7IC8qIEkgZmlndXJlZCBnbG9iYWwgd2FzIGZhc3Rlci4gICAqL1xuICBjb25zdCBtZDVibGtzID0gW107XG4gIGxldCBpOyAvKiBBbmR5IEtpbmcgc2FpZCBkbyBpdCB0aGlzIHdheS4gKi9cbiAgZm9yIChpID0gMDsgaSA8IDY0OyBpICs9IDQpIHtcbiAgICBtZDVibGtzW2kgPj4gMl0gPSBzLmNoYXJDb2RlQXQoaSlcbisgKHMuY2hhckNvZGVBdChpICsgMSkgPDwgOClcbisgKHMuY2hhckNvZGVBdChpICsgMikgPDwgMTYpXG4rIChzLmNoYXJDb2RlQXQoaSArIDMpIDw8IDI0KTtcbiAgfVxuICByZXR1cm4gbWQ1Ymxrcztcbn1cblxuZnVuY3Rpb24gbWQ1MShzKSB7XG4gIGNvbnN0IG4gPSBzLmxlbmd0aDtcbiAgY29uc3Qgc3RhdGUgPSBbMTczMjU4NDE5MywgLTI3MTczMzg3OSwgLTE3MzI1ODQxOTQsIDI3MTczMzg3OF07XG4gIGxldCBpO1xuICBmb3IgKGkgPSA2NDsgaSA8PSBzLmxlbmd0aDsgaSArPSA2NCkge1xuICAgIG1kNWN5Y2xlKHN0YXRlLCBtZDVibGsocy5zdWJzdHJpbmcoaSAtIDY0LCBpKSkpO1xuICB9XG4gIGNvbnN0IHNzID0gcy5zdWJzdHJpbmcoaSAtIDY0KTtcbiAgY29uc3QgdGFpbCA9IFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXTtcbiAgZm9yIChpID0gMDsgaSA8IHNzLmxlbmd0aDsgaSsrKSB7XG4gICAgdGFpbFtpID4+IDJdIHw9IHNzLmNoYXJDb2RlQXQoaSkgPDwgKChpICUgNCkgPDwgMyk7XG4gIH1cbiAgdGFpbFtpID4+IDJdIHw9IDB4ODAgPDwgKChpICUgNCkgPDwgMyk7XG4gIGlmIChpID4gNTUpIHtcbiAgICBtZDVjeWNsZShzdGF0ZSwgdGFpbCk7XG4gICAgZm9yIChpID0gMDsgaSA8IDE2OyBpKyspIHRhaWxbaV0gPSAwO1xuICB9XG4gIHRhaWxbMTRdID0gbiAqIDg7XG4gIG1kNWN5Y2xlKHN0YXRlLCB0YWlsKTtcbiAgcmV0dXJuIHN0YXRlO1xufVxuXG5jb25zdCBoZXhDaHIgPSAnMDEyMzQ1Njc4OWFiY2RlZicuc3BsaXQoJycpO1xuXG5mdW5jdGlvbiByaGV4KG4pIHtcbiAgbGV0IHMgPSAnJztcbiAgbGV0IGogPSAwO1xuICBmb3IgKDsgaiA8IDQ7IGorKykge1xuICAgIHMgKz0gaGV4Q2hyWyhuID4+IChqICogOCArIDQpKSAmIDB4MEZdICsgaGV4Q2hyWyhuID4+IChqICogOCkpICYgMHgwRl07XG4gIH1cbiAgcmV0dXJuIHM7XG59XG5cbmZ1bmN0aW9uIGhleCh4KSB7XG4gIGNvbnN0IHh4ID0geDtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCB4Lmxlbmd0aDsgaSsrKSB7XG4gICAgeHhbaV0gPSByaGV4KHhbaV0pO1xuICB9XG4gIHJldHVybiB4LmpvaW4oJycpO1xufVxuXG5mdW5jdGlvbiBtZDUocykge1xuICBsZXQgbCA9IHMubGVuZ3RoO1xuICB2YXIgX21kNSA9IGhleChtZDUxKHMpKTtcbiAgcmV0dXJuIF9tZDU7XG59IiwiLy8gRklYTUU6IHJlbW92ZSBjaXJ0dWxhciBkZXBlbmRlbmN5XG5pbXBvcnQgQ2xpcXpTZWN1cmVNZXNzYWdlIGZyb20gJy4vaW5kZXgnO1xuXG4vKlxuRnVuY3Rpb24gdG8gY2xlYW4gc3RyaW5nIGZvciBjYWxjdWxhdGluZyByb3V0ZSBoYXNoXG4qL1xudmFyIHB1bmN0dWF0aW9uID0gJyFcIlxcJygpKiwtLi86Oz9bXFxcXF1eX2B7fH1+JSQ9JisjJ1xudmFyIHJlZ2V4ID0gIG5ldyBSZWdFeHAoXCJbXCIgKyBwdW5jdHVhdGlvbiArIFwiXVwiLFwiZ1wiKTtcbmZ1bmN0aW9uIGNsZWFuU3RyKHMpe1xuICAvLyBSZXBsYWNlIGFsbCBzcGFjZXNcblxuICAvLyBCZWNhdXNlIGluIHNvbWUgdGVsZW1ldHJ5IG1lc3NhZ2Ugd2Ugb25seSBjcmVhdGUgdW5pcXUgYmFzZWQgb24gYW50aS1kdXBsaWNhdGUuXG4gIC8vIEFudGktZHVwbGljYXRlIGlzIG5vdCBhIHN0cmluZywgaGVuY2UgY29udmVydGluZyBpdCB0byBzdHJpbmcuXG4gIHMgPSAnJyArIHM7XG5cbiAgLy8gRGVjb2RlIHVyaSBjb21wb25lbnRcbiAgLy8gTmVlZCB0byBmaW5kIGx1YSBlcXVpdmFsZW50XG5cbiAgdHJ5e1xuICAgIHMgPSBkZWNvZGVVUklDb21wb25lbnQocyk7XG4gIH1jYXRjaChlKXt9O1xuXG5cbiAgcyA9IHMucmVwbGFjZSgvXFxzKy9nLCcnKTtcblxuICAvLyBDb252ZXJ0IHRvIGxvd2VyXG4gIHMgPSBzLnRvTG93ZXJDYXNlKCk7XG5cbiAgLy8gVHJpbVxuICBzID0gcy50cmltKCk7XG5cbiAgLy8gQ2xlYW4gdGhlIFVSTFxuICBzID0gcy5yZXBsYWNlKC9eaHR0cDpcXC9cXC8vLCBcIlwiKTtcbiAgcyA9IHMucmVwbGFjZSgvXmh0dHBzOlxcL1xcLy8sIFwiXCIpO1xuICBzID0gcy5yZXBsYWNlKC9ed3d3XFwuLywnJyk7XG5cblxuICAvLyBSZW1vdmUgYWxsIHB1bmN0dWF0aW9uIG1hcmtzXG4gIHMgPSBzLnJlcGxhY2UocmVnZXgsJycpO1xuXG4gIHJldHVybiBzO1xuXG59XG5cbmZ1bmN0aW9uIGdldEZpZWxkKG9iaiwgcGF0aCkge1xuICByZXR1cm4gcGF0aC5zcGxpdCgvW1xcLlxcW1xcXV0rLykuZmlsdGVyKHggPT4geCkucmVkdWNlKChvLCBpKSA9PiBvW2ldLCBvYmopO1xufVxuXG5mdW5jdGlvbiBvcmRlcmVkU3RyaW5naWZ5KHQsIHJlcywgb25seUtleXMpIHtcbiAgaWYgKCF0IHx8IHR5cGVvZiB0ICE9PSAnb2JqZWN0Jykge1xuICAgIGlmICh0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93ICdGb3VuZCB1bmRlZmluZWQgZmllbGQgd2hlbiB0cnlpbmcgdG8gY2FsY3VsYXRlIG1zZyByb3V0ZWhhc2gnO1xuICAgIH1cbiAgICByZXMucHVzaChjbGVhblN0cih0KSk7XG4gIH0gZWxzZSB7XG4gICAgbGV0IGtleXMgPSBPYmplY3Qua2V5cyh0KTtcbiAgICBrZXlzLnNvcnQoKTtcbiAgICBsZXQgaXNBcnJheSA9IEFycmF5LmlzQXJyYXkodCk7XG4gICAga2V5cy5mb3JFYWNoKGsgPT4ge1xuICAgICAgaWYgKCFpc0FycmF5KSB7XG4gICAgICAgIHJlcy5wdXNoKGNsZWFuU3RyKGspKTtcbiAgICAgIH1cbiAgICAgIGlmICghb25seUtleXMpIHtcbiAgICAgICAgb3JkZXJlZFN0cmluZ2lmeSh0W2tdLCByZXMpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG5cbmZ1bmN0aW9uIGdldFJvdXRlSGFzaFN0cihvYmosIHNvdXJjZU1hcCkge1xuICBsZXQgYWN0aW9uID0gb2JqLmFjdGlvbjtcbiAgbGV0IGtleXMgPSBzb3VyY2VNYXBbYWN0aW9uXS5rZXlzO1xuICBsZXQgc3RhdGljS2V5cyA9IHNvdXJjZU1hcFthY3Rpb25dLnN0YXRpY3x8W107XG4gIGxldCByZXMgPSBbXTtcbiAga2V5cy5mb3JFYWNoKGsgPT4gb3JkZXJlZFN0cmluZ2lmeShnZXRGaWVsZChvYmosIGspLCByZXMsIHN0YXRpY0tleXMuc29tZShzayA9PiBrLmVuZHNXaXRoKHNrKSkpKTtcbiAgcmV0dXJuIHJlcy5qb2luKCcnKTtcbn1cblxuXG4vLyBUT0RPOiByZW1vdmUgdGhpcyBmdW5jdGlvbiAtIGl0IGhhcyBhbG1vc3Qgbm90IHZhbHVlIGFuZCBhIG1pc2xlYWRpbmcgbmFtZVxuLypcbkZ1bmN0aW9uIHRvIGNyZWF0ZSBodHRwIHVybFxuKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVIdHRwVXJsKGhvc3Qpe1xuXHRyZXR1cm4gXCJodHRwOi8vXCIgKyBob3N0ICsgXCIvdmVyaWZ5XCI7XG59XG5cbi8qIFRoaXMgbWV0aG9kIHdpbGwgcmV0dXJuIHRoZSBzdHJpbmcgYmFzZWQgb24gbWFwcGluZyBvZiB3aGljaCBrZXlzIHRvIHVzZSB0byBoYXNoIGZvciByb3V0aW5nLlxuKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRSb3V0ZUhhc2gobXNnKXtcblx0cmV0dXJuIGdldFJvdXRlSGFzaFN0cihtc2csIENsaXF6U2VjdXJlTWVzc2FnZS5zb3VyY2VNYXApO1xufVxuXG4vKlxuQ29udmVydHMgZ2l2ZW4gYXJyYXkgdG8gZ2VuZXJhdG9yIGxpa2Ugb2JqZWN0LlxuKi9cbmZ1bmN0aW9uIHRya0dlbih0cmspIHtcbiAgdmFyIHRyayA9IHRyaztcbiAgdmFyIGlkeCA9IC0xO1xuICByZXR1cm4ge1xuICAgIG5leHQ6IGZ1bmN0aW9uKCkge1xuICAgICAgaWR4ICs9IDFcbiAgICAgIGlmKGlkeCA8IHRyay5sZW5ndGgpe1xuICAgICAgICByZXR1cm57XG4gICAgICAgICAgdmFsdWU6IGlkeCwgLy8gUmV0dXJuIHRoZSBmaXJzdCB5aWVsZGVkIHZhbHVlLlxuICAgICAgICAgIGRvbmU6IGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGVsc2V7XG4gICAgICAgIHJldHVybntcbiAgICAgICAgIHZhbHVlOiB1bmRlZmluZWQsIC8vIFJldHVybiB1bmRlZmluZWQuXG4gICAgICAgICBkb25lOiB0cnVlXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBNZXRob2QgdG8gY3JlYXRlIHBheWxvYWQgdG8gc2VuZCBmb3IgYmxpbmQgc2lnbmF0dXJlLlxuICogVGhlIHBheWxvYWQgbmVlZHMgdG8gY29uc2lzdCBvZiA8dVBLLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge21QfSpyMSwgLy8gQk0xXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7bVAsIHVQS30qcjIsIC8vIEJNMlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge0RtQywgdVBLfSAqIHIzLCAvLyBCTTNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFNJRyh1UEs7Ym0xO2JtMjtibTMpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA+XG4gKiBAcmV0dXJucyBzdHJpbmcgd2l0aCBwYXlsb2FkIGNyZWF0ZWQuXG4qL1xuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlUGF5bG9hZEJsaW5kU2lnbmF0dXJlKHVQSywgYm0xLCBibTIsIGJtMywgc2lnKXtcbiAgICB2YXIgcGF5bG9hZCA9IHt9O1xuICAgIHBheWxvYWRbXCJ1UEtcIl0gPSB1UEs7XG4gICAgcGF5bG9hZFtcImJtMVwiXSA9IGJtMTtcbiAgICBwYXlsb2FkW1wiYm0yXCJdID0gYm0yO1xuICAgIHBheWxvYWRbXCJibTNcIl0gPSBibTM7XG4gICAgcGF5bG9hZFtcInNpZ1wiXSA9IHNpZztcbiAgICByZXR1cm4gcGF5bG9hZDtcbiB9XG5cbi8qKlxuICogTWV0aG9kIHRvIGNyZWF0ZSBwYXlsb2FkIHRvIHNlbmQgdG8gcHJveHkuXG4gKiBUaGUgcGF5bG9hZCBuZWVkcyB0byBjb25zaXN0IG9mIDx1UEssXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkbUMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7SHttUH0qcjF9RHNrLCAvLyBCbGluZFNpZ25lZDFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtIKG1QLCB1UEspfURzaywgLy8gQmxpbmRTaWduZWQyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7SChtUCwgZG1DKX1Ec2ssIC8vIEJsaW5kU2lnbmVkM1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgU0lHKHVQSztkbUM7YnMxO2JzMjticzMpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA+XG4gKiBAcmV0dXJucyBzdHJpbmcgd2l0aCBwYXlsb2FkIGNyZWF0ZWQuXG4gKi9cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVBheWxvYWRQcm94eSh1UEssIHN1UEssIG1QLCBkbUMsIGJzMSwgYnMyLCBiczMsIHNpZyl7XG4gICAgdmFyIHBheWxvYWQgPSB7fTtcbiAgICBwYXlsb2FkW1widVBLXCJdID0gdVBLO1xuICAgIHBheWxvYWRbXCJzdVBLXCJdID0gc3VQSztcbiAgICBwYXlsb2FkW1wibVBcIl0gPSBtUDtcbiAgICBwYXlsb2FkW1wiZG1DXCJdID0gZG1DO1xuICAgIHBheWxvYWRbXCJiczFcIl0gPSBiczE7XG4gICAgcGF5bG9hZFtcImJzMlwiXSA9IGJzMjtcbiAgICBwYXlsb2FkW1wiYnMzXCJdID0gYnMzO1xuICAgIHBheWxvYWRbXCJzaWdcIl0gPSBzaWc7XG4gICAgcmV0dXJuIHBheWxvYWQ7XG59XG5cbiIsIi8qKlxuKiBDcmVhdGVzIG9iamVjdCBmb3IgbWVzc2FnZSByZWNpZXZlZCtcbiogT25seSBleGNlcHRzIHZhbGlkIEpTT04gbWVzc2FnZXMgd2l0aCB0aGUgZm9sbG93aW5nIGZpZWxkczpcbiogVHlwZSA6IEh1bWFud2ViIC8gQW50aXRyYWNraW5nIGV0Yy5cbiogQWN0aW9ucyA6IFZhbGlkIGFjdGlvbnMgbGlrZSBQYWdlLCBxdWVyeSBldGMuXG4qIEByZXR1cm5zIHN0cmluZyB3aXRoIHBheWxvYWQgY3JlYXRlZC5cbiovXG5cbmltcG9ydCB7IG1kNSB9IGZyb20gJ21kNSc7XG4vLyBGSVhNRTogcmVtb3ZlIGNpcmN1bGFyIGRlcGVuZGVuY3lcbmltcG9ydCBDbGlxelNlY3VyZU1lc3NhZ2UsIHsgbG9jYWxUZW1wb3JhbFVuaXEgfSBmcm9tICcuL2luZGV4JztcbmltcG9ydCB1c2VyUEsgZnJvbSAnLi91c2VyLXBrJztcbmltcG9ydCB7XG4gIGJhc2U2NF9kZWNvZGUsXG4gIGJhc2U2NF9lbmNvZGUsXG4gIHBhZE1lc3NhZ2UsXG4gIHNoYTEsXG4gIGlzSnNvbixcbiAgc3RyaW5nVG9CeXRlQXJyYXksXG4gIGJ5dGVBcnJheVRvSGV4U3RyaW5nLFxuICBieXRlQXJyYXlUb1N0cmluZyxcbiAgaGV4U3RyaW5nVG9CeXRlQXJyYXksXG4gIGhleFRvQmluYXJ5LFxufSBmcm9tICcuL2NyeXB0by11dGlscyc7XG5pbXBvcnQge1xuICBjcmVhdGVQYXlsb2FkQmxpbmRTaWduYXR1cmUsXG4gIGNyZWF0ZVBheWxvYWRQcm94eSxcbiAgZ2V0Um91dGVIYXNoLFxuICBjcmVhdGVIdHRwVXJsXG59IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHsgdW5CbGluZE1lc3NhZ2UsIGJsaW5kU2lnbkNvbnRleHQgfSBmcm9tICcuL2JsaW5kLXNpZ25hdHVyZSc7XG5pbXBvcnQgX2h0dHAgZnJvbSAnLi9odHRwLXdvcmtlcic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIHtcbiAgY29uc3RydWN0b3IobXNnKSB7XG4gICAgLy8gRklYTUU6IGlzSnNvbiBpcyBjYWxsZWQgMyB0aW1lcyBvbiBzYW1lIG9iamVjdFxuICAgIC8vIFRPRE86IGRvbid0IHVzZSBpc0pTT04gLSB0cnkgLyBjYXRjaCBzaG91bGQgYmUgc3VmZmljaWVudFxuICBcdGlmKCFtc2cgfHwgIWlzSnNvbihtc2cpKSByZXR1cm47XG4gICAgdGhpcy5vcmdNZXNzYWdlID0gaXNKc29uKG1zZykgPyBKU09OLnN0cmluZ2lmeShtc2cpIDogbXNnO1xuICAgIHRoaXMuak1lc3NhZ2UgPSBpc0pzb24obXNnKSA/IG1zZyA6IEpTT04ucGFyc2UobXNnKTtcbiAgICB0aGlzLnNpZ25lZCA9IG51bGw7XG4gICAgdGhpcy5lbmNyeXB0ZWQgPSBudWxsO1xuICAgIHRoaXMucm91dGVIYXNoID0gbnVsbDtcbiAgICB0aGlzLnR5cGUgPSB0aGlzLmpNZXNzYWdlLnR5cGUgfHwgbnVsbDtcbiAgICB0aGlzLmFjdGlvbiA9IHRoaXMuak1lc3NhZ2UuYWN0aW9uIHx8IG51bGw7XG4gICAgdGhpcy5zaGEyNTYgPSBudWxsO1xuICAgIHRoaXMuaW50ZXJ2YWwgPSBudWxsO1xuICAgIHRoaXMucmF0ZUxpbWl0ID0gbnVsbDtcbiAgICB0aGlzLmVuZFBvaW50ID0gbnVsbDtcbiAgICB0aGlzLm1FID0gbnVsbDtcbiAgICB0aGlzLm1LID0gbnVsbDtcbiAgICB0aGlzLm1QID0gbnVsbDtcbiAgICB0aGlzLmRtID0gbnVsbDtcbiAgICB0aGlzLnByb3h5VmFsaWRhdG9ycyA9IG51bGw7XG4gIH1cblxuICBsb2cobXNnKXtcbiAgICBjb25zb2xlLmxvZyhcIk1lc3NhZ2UgQ29udGV4dDogXCIgKyBtc2cpO1xuICB9XG5cblx0Z2V0cHJveHlDb29yZGluYXRvcigpe1xuXHRcdHZhciBfdGhpcyA9IHRoaXM7XG5cdFx0dmFyIG1zZyA9IF90aGlzLmpNZXNzYWdlO1xuICAgIF90aGlzLmVuZFBvaW50ID0gQ2xpcXpTZWN1cmVNZXNzYWdlLnNvdXJjZU1hcFt0aGlzLmFjdGlvbl1bXCJlbmRwb2ludFwiXTtcbiAgICBfdGhpcy5tZDVIYXNoID0gbWQ1KHRoaXMuYWN0aW9uKTtcblx0XHR2YXIgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCl7XG5cdFx0XHR0cnl7XG5cdFx0XHRcdHZhciBoYXNoID0gXCJcIjtcblx0XHRcdFx0Ly8gdmFyIF9tc2cgPSBtc2cgfHwgdGhpcy5vcmdNZXNzYWdlO1xuXHRcdFx0XHR2YXIgc3RyaW5nUm91dGVIYXNoID0gZ2V0Um91dGVIYXNoKG1zZyk7XG5cdFx0XHRcdHNoYTEoc3RyaW5nUm91dGVIYXNoKVxuXHRcdFx0XHQudGhlbihoYXNoTSA9PiB7XG4gICAgICAgICAgX3RoaXMuc2hhMSA9IGhhc2hNO1xuXHRcdFx0XHRcdHZhciBkbUMgPSBoZXhUb0JpbmFyeShoYXNoTSlbJ3Jlc3VsdCddLnNsaWNlKDAsMTMpO1xuXHRcdFx0XHRcdHZhciByb3V0ZUhhc2ggPSBwYXJzZUludChkbUMsIDIpO1xuXHRcdFx0XHRcdF90aGlzLmZ1bGxIYXNoID0gaGFzaE07XG5cdFx0XHRcdFx0X3RoaXMuZG1DID0gZG1DO1xuXHRcdFx0XHRcdHZhciB0b3RhbFByb3hpZXMgPSA0MDk2O1xuXHRcdFx0XHRcdHZhciBtb2RSb3V0ZSA9IHJvdXRlSGFzaCAlIHRvdGFsUHJveGllcztcblx0XHRcdFx0XHR2YXIgcHJveHlJUCA9IGNyZWF0ZUh0dHBVcmwoQ2xpcXpTZWN1cmVNZXNzYWdlLnJvdXRlVGFibGVbbW9kUm91dGVdKTtcblx0XHRcdFx0XHRfdGhpcy5wcm94eUNvb3JkaW5hdG9yID0gcHJveHlJUDtcblx0XHRcdFx0XHRyZXNvbHZlKHRoaXMpO1xuXHRcdFx0XHR9KVxuXHRcdFx0XHQuY2F0Y2goZXJyPT57XG4gICAgICAgICAgY29uc29sZS5sb2coXCJFUlJPUiA+PiBcIiArIGVycik7XG5cdFx0XHRcdFx0cmVqZWN0KGVycik7XG5cdFx0XHRcdH0pXG5cblxuXHRcdFx0fVxuXHRcdFx0Y2F0Y2goZSl7XG5cdFx0XHRcdHJlamVjdChlKTtcblx0XHRcdH1cblx0XHR9KVxuXHRcdHJldHVybiBwcm9taXNlO1xuXHR9XG5cblx0LyoqXG5cdCAqIE1ldGhvZCB0byBnZW5lcmF0ZSBhbiBBRVMtQ0JDIDEyOCBiaXQga2V5LlxuXHQgKiBAcmV0dXJucyBjcnlwdG8gb2JqZWN0IG9mIEFFUyBLRVkuXG5cdCAqL1xuICBhZXNHZW5lcmF0ZUtleSgpe1xuICAgIGxldCBfdGhpcyA9IHRoaXM7XG4gIFx0bGV0IHByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xuICAgICAgY3J5cHRvLnN1YnRsZS5nZW5lcmF0ZUtleShcbiAgICAgICAge1xuICAgICAgICAgICAgbmFtZTogXCJBRVMtQ0JDXCIsXG4gICAgICAgICAgICBsZW5ndGg6IDEyOCxcbiAgICAgICAgfSxcbiAgICAgICAgdHJ1ZSxcbiAgICAgICAgW1wiZW5jcnlwdFwiLCBcImRlY3J5cHRcIl1cbiAgICAgICkudGhlbigga2V5ID0+IHtcbiAgICAgICAgcmVzb2x2ZShrZXkpO1xuICAgICAgfSkuY2F0Y2goIGVyciA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiRXJyb3IgaW4gZ2VuZXJhdGluZyBrZXk6IFwiICsgZXJyKTtcbiAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICB9KTtcbiAgXHR9KVxuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG5cblx0LyoqXG5cdCAqIE1ldGhvZCB0byBnZW5lcmF0ZSBhbiBBRVMtQ0JDIDEyOCBiaXQga2V5LlxuXHQgKiBAcmV0dXJucyBjcnlwdG8gb2JqZWN0IG9mIEFFUyBLRVkuXG5cdCAqL1xuXHRhZXNFeHBvcnRLZXkoa2V5KXtcbiAgICBsZXQgX3RoaXMgPSB0aGlzO1xuICAgIGxldCBwcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KXtcbiAgICAgIGNyeXB0by5zdWJ0bGUuZXhwb3J0S2V5KCdyYXcnLCBrZXkpLnRoZW4oIHJlc3VsdCA9PiB7XG4gICAgICAgIF90aGlzLmFlc0tleSA9IGJ5dGVBcnJheVRvSGV4U3RyaW5nKG5ldyBVaW50OEFycmF5KHJlc3VsdCkpO1xuICAgICAgICByZXNvbHZlKGtleSk7XG4gICAgICB9KS5jYXRjaCAoIGVyciA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiRXJyb3IgaW4gZXhwb3J0aW5nIGtleTogXCIgKyBlcnIpO1xuICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgIH0pXG4gICAgfSk7XG4gICAgcmV0dXJuIHByb21pc2U7XG5cdH1cbiAgLyoqXG4gICAqIE1ldGhvZCB0byBwYXJzZSBhIG1lc3NhZ2UgYW5kIGVuY3J5cHQgd2l0aCBBRVMuXG4gICAqIEB0aHJvd3Mge3N0cmluZ30gV2lsbCB0aHJvdyAnbXNndG9vYmlnJyBpZiBtZXNzYWdlIHNpemUgZXhjZWVkcyBhIHRocmVzaG9sZC5cbiAgICogQHJldHVybnMgc3RyaW5nIG9mIEFFUyBlbmNyeXB0ZWQgbWVzc2FnZS5cbiAgICovXG4gIGFlc0VuY3J5cHRpb24oIGtleSwgX2l2LCBtc2dFbmNyeXB0ICl7XG4gICAgbGV0IF90aGlzID0gdGhpcztcbiAgICBsZXQgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCl7XG4gICAgICBjcnlwdG8uc3VidGxlLmVuY3J5cHQoXG4gICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6IFwiQUVTLUNCQ1wiLFxuICAgICAgICAgICAgaXY6IF9pdixcbiAgICAgICAgfSxcbiAgICAgICAga2V5LFxuICAgICAgICBzdHJpbmdUb0J5dGVBcnJheShtc2dFbmNyeXB0KSAvL0FycmF5QnVmZmVyIG9mIGRhdGEgeW91IHdhbnQgdG8gZW5jcnlwdFxuICAgICAgKS50aGVuKCBlbmNyeXB0ZWQgPT4ge1xuICAgICAgICByZXNvbHZlKGVuY3J5cHRlZCk7XG4gICAgICB9KS5jYXRjaCggZXJyID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coXCJFcnJvciBpbiBhZXMgZW5jcnlwdGlvbjogXCIgKyBlcnIpO1xuICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgIH0pXG4gICAgfSlcbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuXG4gIHJzYUVuY3J5cHQobXNnKXtcbiAgICBsZXQgX3RoaXMgPSB0aGlzO1xuICAgIGxldCBwcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KXtcbiAgICAgIC8vbGV0IHB1YmxpY0tleSA9IFwiTUlJQ0lqQU5CZ2txaGtpRzl3MEJBUUVGQUFPQ0FnOEFNSUlDQ2dLQ0FnRUFoNUhoY1JBbjYrNndvWFFYbC9OdForZk9vb05nbFpjdC9IU3BZdXFrY21yUGF1SFc3RXVPU3E1YnZwQlpSVERST2pSL2tVUG9tcVZaSXpxaGRDRlBBOEJ3WFNDejdoQWVsMlExNTd2dEJ2aDlzbmdNTUxYYjVGZ3plZjVONEV1S084cEw1S3JTK0k5dGZaYWM0MXZGSlNkcGdBaXJaWWhoK3RkY1FRMXowUXYvUncwek9YamZ2ZGRDejNnRXYyZ0I5S3NMTVZuVFMxSjRZT09nZnphMmFkZzlFYnoxejk5RGlGNHZ0Q3duMElVd0gvM1RvVEJ3SkxiTW5DM09sNDN5Qk5rOHJnSzJta2dDaTYxNHZPU0QzaG5WbWlvK2lXNitBVWtsTThWUGw2bDdoRUs5Y2xqSlkrOVVzTVZtVHJ2YUZiTVB3UzZBZFpDWEtUbU5kYU1KY3kzelNPWHU1enZ6aWhvUUx3QXU5TE0zbDJlVmswTXcwSzdKWE9QMjBmYzhCdHpXQ09MWVZQMzJyNFIwQk51aFR0dkdxakhOWkhQSk41T3dheGtMcG4yZHVqTDl1RFdHalJpT0l0S01WcS9uT3FtTkdnaHJiZjhJT2FLVDdWUWhxT1U0Y1hSa0IvdUYxVWpZRVRCYXZ3VVpBeHg5V2QvY01jQUdtS2lEeGlnaHh4UTI5akR1ZmwrMldHMDY1dG1Keit6Q3htZ3JQaDZaYjNLRlV4UFRlNnlrc0FoV0pobUdTaEE5djIwdDg0TTVjNk5wWlhvVXNGY1ZqYTZYeHpIZVNCOGRXcTlVdTVRY1o4M0d6L3JvbndkRWpUMk9HVHRCZ09GZVREcUxZVWdwaEMxZ2NVRUhPQ25UTlhSTVFPWHFHd0JmWkhwK01xNjFRY01xMnJOUzd4RUNBd0VBQVE9PVwiO1xuICAgICAgbGV0IHB1YmxpY0tleSA9IENsaXF6U2VjdXJlTWVzc2FnZS5zZWN1cmVMb2dnZXIucHVibGljS2V5QjY0O1xuICAgICAgY3J5cHRvLnN1YnRsZS5pbXBvcnRLZXkoXG4gICAgICAgJ3Nwa2knLFxuICAgICAgICBiYXNlNjRfZGVjb2RlKHB1YmxpY0tleSksXG4gICAgICAgIHtcbiAgICAgICAgICBuYW1lOiAnUlNBLU9BRVAnLFxuICAgICAgICAgIGhhc2g6IHsgbmFtZTogJ1NIQS0xJyB9XG4gICAgICAgIH0sXG4gICAgICAgIGZhbHNlLFxuICAgICAgICBbJ2VuY3J5cHQnXVxuICAgICAgKS50aGVuKCBrZXk9PiB7XG4gICAgICBjcnlwdG8uc3VidGxlLmVuY3J5cHQoXG4gICAgICAgICAge1xuICAgICAgICAgICAgICBuYW1lOiBcIlJTQS1PQUVQXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBrZXksXG4gICAgICAgICAgc3RyaW5nVG9CeXRlQXJyYXkobXNnKVxuICAgICAgICApXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uKGVuY3J5cHRlZCl7XG4gICAgICAgICAgcmVzb2x2ZShiYXNlNjRfZW5jb2RlKG5ldyBVaW50OEFycmF5KGVuY3J5cHRlZCkpKTtcbiAgICAgICAgfSlcbiAgICAgICAgLmNhdGNoKGZ1bmN0aW9uKGVycil7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiRXJyb3IgZHVyaW5nIHJzYSBlbmNyeXB0aW9uOiBcIiArIGVycik7XG4gICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KVxuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG5cdC8qKlxuXHQgKiBNZXRob2QgdG8gcGFyc2UgYSBtZXNzYWdlIGFuZCBlbmNyeXB0IHdpdGggQUVTLlxuXHQgKiBAdGhyb3dzIHtzdHJpbmd9IFdpbGwgdGhyb3cgJ21zZ3Rvb2JpZycgaWYgbWVzc2FnZSBzaXplIGV4Y2VlZHMgYSB0aHJlc2hvbGQuXG5cdCAqIEByZXR1cm5zIHN0cmluZyBvZiBBRVMgZW5jcnlwdGVkIG1lc3NhZ2UuXG5cdCAqL1xuXHRhZXNFbmNyeXB0KHR5cGUpe1xuXHRcdHZhciBfdGhpcyA9IHRoaXM7XG5cdFx0dmFyIHByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xuICAgICAgdmFyIF9pdiA9IGNyeXB0by5nZXRSYW5kb21WYWx1ZXMobmV3IFVpbnQ4QXJyYXkoMTYpKTtcbiAgICAgIHZhciBldmVudElEID0gKCcnICsgYnl0ZUFycmF5VG9IZXhTdHJpbmcoX2l2KSkuc3Vic3RyaW5nKDAsNSk7XG4gICAgICB2YXIgYWVzS2V5Qnl0ZXM7XG4gICAgICAvLyBjb25zb2xlLmxvZyhcIj4+IElWOiBcIiArIGJ5dGVBcnJheVRvSGV4U3RyaW5nKF9pdikpO1xuICAgICAgLy8gY29uc29sZS5sb2coXCI+PiBFXCIgKyBldmVudElEKTtcbiAgICAgIF90aGlzLmV2ZW50SUQgPSBldmVudElEO1xuICAgICAgX3RoaXMuaXYgPSBieXRlQXJyYXlUb0hleFN0cmluZyhfaXYpO1xuICAgICAgX3RoaXMubUlEID0gZXZlbnRJRDtcbiAgICAgIF90aGlzLm9pdiA9IF9pdjtcblxuICAgICAgX3RoaXMuYWVzR2VuZXJhdGVLZXkoKS50aGVuKCBrZXkgPT4ge1xuICAgICAgICByZXR1cm4gX3RoaXMuYWVzRXhwb3J0S2V5KGtleSlcbiAgICAgIH0pLnRoZW4oIGtleSA9PiB7XG4gICAgICAgICAgbGV0IGVuY3J5cHRpb25QYXlsb2QgPSB7fTtcbiAgICAgICAgICBlbmNyeXB0aW9uUGF5bG9kWydtc2cnXSA9IF90aGlzLm9yZ01lc3NhZ2U7XG4gICAgICAgICAgZW5jcnlwdGlvblBheWxvZFsnZW5kcG9pbnQnXSA9IF90aGlzLmVuZFBvaW50O1xuICAgICAgICAgIGxldCBtc2dFbmNyeXB0ID0gSlNPTi5zdHJpbmdpZnkoZW5jcnlwdGlvblBheWxvZCk7XG4gICAgICAgICAgaWYodHlwZSA9PT0gXCJ0ZWxlbWV0cnlcIil7XG4gICAgICAgICAgICB0cnl7XG4gICAgICAgICAgICAgIG1zZ0VuY3J5cHQgPSBwYWRNZXNzYWdlKEpTT04uc3RyaW5naWZ5KGVuY3J5cHRpb25QYXlsb2QpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoKGUpe1xuICAgICAgICAgICAgICByZWplY3QoZSk7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBfdGhpcy5hZXNFbmNyeXB0aW9uKGtleSwgX2l2LCBtc2dFbmNyeXB0KS50aGVuKCBlbmNyeXB0ZWRSZXN1bHQgPT4ge1xuICAgICAgICAgICAgX3RoaXMubUUgPSBiYXNlNjRfZW5jb2RlKG5ldyBVaW50OEFycmF5KGVuY3J5cHRlZFJlc3VsdCkpO1xuICAgICAgICAgICAgcmVzb2x2ZShfdGhpcy5tRSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gcHJvbWlzZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBNZXRob2QgdG8gcGFyc2UgYSBtZXNzYWdlIGFuZCBkZWNyeXB0IHdpdGggQUVTLlxuXHQgKiBAcmV0dXJucyBzdHJpbmcgb2YgQUVTIGRlY3J5cHRlZCBtZXNzYWdlLlxuXHQgKi9cblx0YWVzRGVjcnlwdChtc2cpe1xuXHRcdHZhciBfdGhpcyA9IHRoaXM7XG5cdFx0dmFyIHByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xuICAgICAgdmFyIF9tc2cgPWJhc2U2NF9kZWNvZGUobXNnLnNwbGl0KFwiO1wiKVsxXSk7XG4gICAgICB2YXIgaGFzaEtleSA9IF90aGlzLmFlc0tleTtcbiAgICAgIHZhciBfaXYgPSBfdGhpcy5pdjtcbiAgICAgIGNyeXB0by5zdWJ0bGUuaW1wb3J0S2V5KFxuICAgICAgICAgIFwicmF3XCIsIC8vY2FuIGJlIFwiandrXCIgb3IgXCJyYXdcIlxuICAgICAgICAgIGhleFN0cmluZ1RvQnl0ZUFycmF5KGhhc2hLZXkpLFxuICAgICAgICAgIFwiQUVTLUNCQ1wiLFxuICAgICAgICAgIGZhbHNlLCAvL3doZXRoZXIgdGhlIGtleSBpcyBleHRyYWN0YWJsZSAoaS5lLiBjYW4gYmUgdXNlZCBpbiBleHBvcnRLZXkpXG4gICAgICAgICAgW1wiZGVjcnlwdFwiXSAvL2NhbiBiZSBcImVuY3J5cHRcIiwgXCJkZWNyeXB0XCIsIFwid3JhcEtleVwiLCBvciBcInVud3JhcEtleVwiXG4gICAgICApXG4gICAgICAudGhlbihmdW5jdGlvbihrZXkpe1xuICAgICAgICAgIC8vcmV0dXJucyB0aGUgc3ltbWV0cmljIGtleVxuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwia2V5XCIpO1xuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGtleSk7XG4gICAgICAgIGNyeXB0by5zdWJ0bGUuZGVjcnlwdChcbiAgICAgICAge1xuICAgICAgICAgICAgbmFtZTogXCJBRVMtQ0JDXCIsXG4gICAgICAgICAgICBpdjogaGV4U3RyaW5nVG9CeXRlQXJyYXkoX2l2KSwgLy9UaGUgaW5pdGlhbGl6YXRpb24gdmVjdG9yIHlvdSB1c2VkIHRvIGVuY3J5cHRcbiAgICAgICAgfSxcbiAgICAgICAga2V5LCAvL2Zyb20gZ2VuZXJhdGVLZXkgb3IgaW1wb3J0S2V5IGFib3ZlXG4gICAgICAgIF9tc2cgIC8vQXJyYXlCdWZmZXIgb2YgdGhlIGRhdGFcbiAgICAgICAgKVxuICAgICAgICAudGhlbihmdW5jdGlvbihkZWNyeXB0ZWQpe1xuICAgICAgICAgICAgLy9yZXR1cm5zIGFuIEFycmF5QnVmZmVyIGNvbnRhaW5pbmcgdGhlIGRlY3J5cHRlZCBkYXRhXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkRlY3J5cHRlZD4+PiBcIiArIGJ5dGVBcnJheVRvU3RyaW5nKG5ldyBVaW50OEFycmF5KGRlY3J5cHRlZCkpKTtcbiAgICAgICAgICAgIHJlc29sdmUoYnl0ZUFycmF5VG9TdHJpbmcobmV3IFVpbnQ4QXJyYXkoZGVjcnlwdGVkKSkpO1xuICAgICAgICB9KVxuICAgICAgICAuY2F0Y2goZnVuY3Rpb24oZXJyKXtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICAgICAgfSk7XG4gICAgICB9KVxuICAgICAgLmNhdGNoKGZ1bmN0aW9uKGVycil7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xuICAgICAgfSk7XG5cblx0XHR9KVxuXG5cdFx0cmV0dXJuIHByb21pc2U7XG5cdH1cblxuXHQvKipcblx0ICogTWV0aG9kIHRvIHNpZ24gdGhlIEFFUyBlbmNyeXB0aW9uZyBrZXkgd2l0aCBBZ2dyZWdhdG9yIFB1YmxpYyBrZXkuXG5cdCAqIENhbGN1bGF0ZSBtSyA9IHtBRVNLZXk7aXY7ZW5kUG9pbnR9XG5cdCAqIEByZXR1cm5zIHN0cmluZyBvZiBlbmNyeXB0ZWQga2V5LlxuXHQgKi9cblx0c2lnbktleSgpe1xuXHRcdHZhciBfdGhpcyA9IHRoaXM7XG5cdFx0dmFyIHByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xuXHRcdFx0dHJ5e1xuXHRcdFx0XHQvLyBUbyBwcm90ZWN0IGZyb20gcGFkZGluZyBvcmFjbGUgYXR0YWNrcywgd2UgbmVlZCB0byBzZW5kIHRoZSBoYXNoIG9mXG5cdFx0XHRcdC8vIG1FLlxuXHRcdFx0XHR2YXIgbUkgPSBtZDUoX3RoaXMubUUpOyAvLyByZXBsYWNlIGl0IHdpdGggd2ViLWNyeXB0byBtZDUuXG5cdFx0XHRcdHZhciBtZXNzYWdlVG9TaWduID0gX3RoaXMuYWVzS2V5ICsgXCI7XCIgKyBfdGhpcy5pdiArIFwiO2VuZFBvaW50O1wiICsgbUk7XG4gICAgICAgIF90aGlzLnJzYUVuY3J5cHQobWVzc2FnZVRvU2lnbikudGhlbiggZW5jcnlwdGVkUmVzcG9uc2UgPT4ge1xuICAgICAgICAgIF90aGlzLnNpZ25lZEtleSA9IGVuY3J5cHRlZFJlc3BvbnNlO1xuICAgICAgICAgIF90aGlzLm1LID0gZW5jcnlwdGVkUmVzcG9uc2U7XG4gICAgICAgICAgcmVzb2x2ZShlbmNyeXB0ZWRSZXNwb25zZSk7XG4gICAgICAgIH0pXG5cblx0XHRcdH1cblx0XHRcdGNhdGNoKGUpe1xuXHRcdFx0XHRyZWplY3QoZSk7XG5cdFx0XHR9XG5cdFx0fSlcblx0XHRyZXR1cm4gcHJvbWlzZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBNZXRob2QgdG8gY3JlYXRlIE1QXG5cdCAqIENhbGN1bGF0ZSBtUCA9IDxtSUQsIG1LLCBtRT5cblx0ICogQHJldHVybnMgc3RyaW5nIGNhbGxlZCBtUC5cblx0ICovXG5cdGdldE1QKCl7XG5cdFx0dmFyIG1QID0gdGhpcy5tSUQgKyBcIjtcIiArIHRoaXMubUsgK1wiO1wiICsgdGhpcy5tRTtcblx0XHR0aGlzLm1QID0gbVA7XG5cdFx0cmV0dXJuIG1QXG5cdH1cblxuXHRyc2FFKCl7XG5cdFx0cnNhRW5jcnlwdCgpO1xuXHR9XG5cbiAgY2hlY2tMb2NhbFVuaXEoKXtcbiAgICBsZXQgX3RoaXMgPSB0aGlzO1xuICAgIGxldCBwcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KXtcbiAgICAgIC8vIENoZWNrIGZvciBsb2NhbCB0ZW1wb3JhbCB1bmlxdW5lc3NcbiAgICAgIHZhciB1bmlxS2V5ID0gX3RoaXMuZG1DO1xuICAgICAgaWYobG9jYWxUZW1wb3JhbFVuaXEgJiYgT2JqZWN0LmtleXMobG9jYWxUZW1wb3JhbFVuaXEpLmluZGV4T2YodW5pcUtleSkgPiAtMSkge1xuICAgICAgICBpZihsb2NhbFRlbXBvcmFsVW5pcVt1bmlxS2V5XVtcImZ1bGxoYXNoXCJdKXtcbiAgICAgICAgICBpZihfdGhpcy5mdWxsSGFzaCA9PT0gbG9jYWxUZW1wb3JhbFVuaXFbdW5pcUtleV1bXCJmdWxsaGFzaFwiXSl7XG4gICAgICAgICAgICByZWplY3QoXCJleGFjdC1kdXBsaWNhdGVcIik7XG4gICAgICAgICAgfSBlbHNle1xuICAgICAgICAgICAgcmVqZWN0KFwiY29sbGlzaW9uXCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZWxzZXtcbiAgICAgICAgcmVzb2x2ZSh0cnVlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuXG4gIGJsaW5kTWVzc2FnZSgpe1xuICAgIGxldCBfdGhpcyA9IHRoaXM7XG4gICAgbGV0IHByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xuICAgICAgLy8gQWZ0ZXIgdGhlIG1lc3NhZ2UgaXMgU0lHTkVELCB3ZSBuZWVkIHRvIHN0YXJ0IHRoZSBibGluZCBzaWduYXR1cmUuXG4gICAgICBfdGhpcy5nZXRNUCgpO1xuXG4gICAgICB2YXIgdVBLID0gQ2xpcXpTZWN1cmVNZXNzYWdlLnVQSy5wdWJsaWNLZXlCNjQ7XG5cbiAgICAgIC8vIE1lc3NhZ2VzIHRvIGJlIGJsaW5kZWQuXG4gICAgICBfdGhpcy5tMSA9IF90aGlzLm1QIDtcbiAgICAgIF90aGlzLm0yID0gX3RoaXMubVAgKyBcIjtcIiArIHVQSztcbiAgICAgIF90aGlzLm0zID0gX3RoaXMubVAgKyBcIjtcIiArIF90aGlzLmRtQzsgLy8gKyBcIjtcIiArIHVQSztcblxuICAgICAgdmFyIF9ibTEgPSBuZXcgYmxpbmRTaWduQ29udGV4dChfdGhpcy5tMSk7XG4gICAgICB2YXIgX2JtMiA9IG5ldyBibGluZFNpZ25Db250ZXh0KF90aGlzLm0yKTtcbiAgICAgIHZhciBfYm0zID0gbmV3IGJsaW5kU2lnbkNvbnRleHQoX3RoaXMubTMpO1xuXG4gICAgICBfdGhpcy5yMSA9IF9ibTEuZ2V0QmxpbmRpbmdOb25jZSgpO1xuICAgICAgX3RoaXMucjIgPSBfYm0yLmdldEJsaW5kaW5nTm9uY2UoKTtcbiAgICAgIF90aGlzLnIzID0gX2JtMy5nZXRCbGluZGluZ05vbmNlKCk7XG5cblxuICAgICAgLy8gR2V0IFVuYmxpbmRlciAtIHRvIHVuYmxpbmQgdGhlIG1lc3NhZ2VcbiAgICAgIF90aGlzLnUxID0gX2JtMS5nZXRVbkJsaW5kZXIoKTtcbiAgICAgIF90aGlzLnUyID0gX2JtMi5nZXRVbkJsaW5kZXIoKTtcbiAgICAgIF90aGlzLnUzID0gX2JtMy5nZXRVbkJsaW5kZXIoKTtcblxuICAgICAgLy8gQmxpbmQgdGhlIG1lc3NhZ2VcbiAgICAgICBfYm0xLmJsaW5kTWVzc2FnZSgpXG4gICAgICAgIC50aGVuKCBibTEgPT4ge1xuICAgICAgICAgIF90aGlzLmJtMSA9IGJtMTtcbiAgICAgICAgICByZXR1cm4gX2JtMi5ibGluZE1lc3NhZ2UoKVxuICAgICAgICB9KVxuICAgICAgICAudGhlbiggYm0yID0+IHtcbiAgICAgICAgICBfdGhpcy5ibTIgPSBibTI7XG4gICAgICAgICAgcmV0dXJuIF9ibTMuYmxpbmRNZXNzYWdlKCk7XG4gICAgICAgIH0pXG4gICAgICAgIC50aGVuKCBibTMgPT4ge1xuICAgICAgICAgIF90aGlzLmJtMyA9IGJtMztcbiAgICAgICAgICByZXNvbHZlKHRoaXMpO1xuICAgICAgICB9KVxuICAgIH0pXG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cblxuICB1c2VyU2lnbigpe1xuICAgIGxldCBfdGhpcyA9IHRoaXM7XG4gICAgbGV0IHByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xuICAgICAgbGV0IHVQSyA9IENsaXF6U2VjdXJlTWVzc2FnZS51UEsucHVibGljS2V5QjY0O1xuICAgICAgbGV0IHBheWxvYWRNc2cgPSB1UEsgKyBcIjtcIiArIF90aGlzLmJtMSArIFwiO1wiICsgX3RoaXMuYm0yICsgXCI7XCIgKyBfdGhpcy5ibTM7XG4gICAgICBsZXQgX3VQSyA9IG5ldyB1c2VyUEsocGF5bG9hZE1zZyk7XG4gICAgICByZXR1cm4gX3VQSy5zaWduKHBheWxvYWRNc2cpLnRoZW4oIHNpZ25lZERhdGEgPT4ge1xuICAgICAgICBfdGhpcy5zaWduZWREYXRhID0gc2lnbmVkRGF0YTtcbiAgICAgICAgcmVzb2x2ZSh0aGlzKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG5cbiAgc2VuZEJsaW5kUGF5bG9hZCgpe1xuICAgIGxldCBfdGhpcyA9IHRoaXM7XG4gICAgbGV0IHByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xuICAgICAgdmFyIHBheWxvYWQgPSBjcmVhdGVQYXlsb2FkQmxpbmRTaWduYXR1cmUoQ2xpcXpTZWN1cmVNZXNzYWdlLnVQSy5wdWJsaWNLZXlCNjQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5ibTEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5ibTIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5ibTMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5zaWduZWREYXRhKTtcbiAgICAgIHJldHVybiBfaHR0cChDbGlxelNlY3VyZU1lc3NhZ2UuQkxJTkRfU0lHTkVSKVxuICAgICAgICAgICAgICAucG9zdChKU09OLnN0cmluZ2lmeShwYXlsb2FkKSlcbiAgICAgICAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgICAgICAgICAgIF90aGlzLmJzUmVzcG9uc2UgPSBKU09OLnBhcnNlKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICByZXNvbHZlKHRoaXMpO1xuICAgICAgICAgICAgICB9KTtcbiAgICB9KTtcbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuXG4gIHVuQmxpbmRNZXNzYWdlKCl7XG4gICAgbGV0IF90aGlzID0gdGhpcztcbiAgICBsZXQgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCl7XG4gICAgICBsZXQgcmVzID0gX3RoaXMuYnNSZXNwb25zZTtcbiAgICAgIC8vIENhcHR1cmUgdGhlIHJlc3BvbnNlXG4gICAgICB2YXIgYnMxID0gcmVzW1wiYnMxXCJdO1xuICAgICAgdmFyIGJzMiA9IHJlc1tcImJzMlwiXTtcbiAgICAgIHZhciBiczMgPSByZXNbXCJiczNcIl07XG4gICAgICB2YXIgc3VQSyA9IHJlc1tcInN1UEtcIl07XG5cbiAgICAgIC8vIFVuYmxpbmQgdGhlIG1lc3NhZ2UgdG8gZ2V0IHRoZSBzaWduYXR1cmUuXG4gICAgICBfdGhpcy51czEgPSB1bkJsaW5kTWVzc2FnZShiczEsIF90aGlzLnUxKTtcbiAgICAgIF90aGlzLnVzMiA9IHVuQmxpbmRNZXNzYWdlKGJzMiwgX3RoaXMudTIpO1xuICAgICAgX3RoaXMudXMzID0gdW5CbGluZE1lc3NhZ2UoYnMzLCBfdGhpcy51Myk7XG4gICAgICBfdGhpcy5zdVBLID0gc3VQSztcbiAgICAgIHJlc29sdmUodGhpcyk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cblxuIHNpZ25VbmJsaW5kZWRNZXNzYWdlKCl7XG4gICAgbGV0IF90aGlzID0gdGhpcztcbiAgICBsZXQgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCl7XG4gICAgICBsZXQgcGF5bG9hZCA9IENsaXF6U2VjdXJlTWVzc2FnZS51UEsucHVibGljS2V5QjY0ICsgXCI7XCIgKyBfdGhpcy5tUCArXCI7XCIrICBfdGhpcy5kbUMgKyBcIjtcIiArIF90aGlzLnVzMSArIFwiO1wiICsgX3RoaXMudXMyICsgXCI7XCIgKyBfdGhpcy51czM7XG4gICAgICBsZXQgX3VQSyA9IG5ldyB1c2VyUEsocGF5bG9hZCk7XG4gICAgICAgIHJldHVybiBfdVBLLnNpZ24ocGF5bG9hZCkudGhlbihzaWduZWRNZXNzYWdlUHJveHkgPT4ge1xuICAgICAgICAgIF90aGlzLnNpZ25lZE1lc3NhZ2VQcm94eSA9IHNpZ25lZE1lc3NhZ2VQcm94eTtcbiAgICAgICAgICByZXNvbHZlKHRoaXMpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuXG4gIHNlbmRNZXNzYWdlUHJveHkoKXtcbiAgICBsZXQgX3RoaXMgPSB0aGlzO1xuICAgIGxldCBwcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KXtcbiAgICAgIGxldCBwYXlsb2FkID0gY3JlYXRlUGF5bG9hZFByb3h5KENsaXF6U2VjdXJlTWVzc2FnZS51UEsucHVibGljS2V5QjY0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5zdVBLICxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMubVAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLmRtQyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMudXMxLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy51czIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLnVzMyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMuc2lnbmVkTWVzc2FnZVByb3h5KTtcbiAgICAgIHJldHVybiBfaHR0cChfdGhpcy5wcm94eUNvb3JkaW5hdG9yKVxuICAgICAgICAgICAgICAucG9zdChKU09OLnN0cmluZ2lmeShwYXlsb2FkKSlcbiAgICAgICAgICAgICAgLnRoZW4oKCkgPT4gcmVzb2x2ZSh0aGlzKSlcbiAgICAgICAgICAgICAgLmNhdGNoKGVyciA9PiB7XG4gICAgICAgICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgICAgIH0pO1xuICAgIH0pO1xuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG5cbiAgc2F2ZUxvY2FsQ2hlY2tUYWJsZSgpe1xuICAgIGxldCBfdGhpcyA9IHRoaXM7XG4gICAgbGV0IHByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xuICAgICAgLy8gU2F2ZSB0aGUgaGFzaCBpbiB0ZW1wb3JhbCB1bmlxdWUgcXVldWUuXG4gICAgICB2YXIgdHQgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgIGxvY2FsVGVtcG9yYWxVbmlxW190aGlzLmRtQ10gPSB7XCJ0c1wiOnR0LCBcImZ1bGxoYXNoXCI6IF90aGlzLmZ1bGxIYXNofTtcbiAgICAgIHJlc29sdmUodGhpcyk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHByb21pc2U7XG5cbiAgfVxuICBxdWVyeSgpe1xuICAgIGxldCBfdGhpcyA9IHRoaXM7XG4gICAgbGV0IHByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xuICAgICAgX3RoaXMuYWVzRW5jcnlwdCgpLnRoZW4oIGUgPT4ge1xuICAgICAgICByZXR1cm4gX3RoaXMuc2lnbktleSgpO1xuICAgICAgfSkudGhlbiggZSA9PiB7XG4gICAgICAgIGxldCBkYXRhID0ge1wibVBcIjpfdGhpcy5nZXRNUCgpfTtcbiAgICAgICAgcmV0dXJuIF9odHRwKENsaXF6U2VjdXJlTWVzc2FnZS5xdWVyeVByb3h5SVApXG4gICAgICAgICAgICAucG9zdChKU09OLnN0cmluZ2lmeShkYXRhKSwgXCJpbnN0YW50XCIpO1xuICAgICAgICB9KS50aGVuICggcmVzID0+IHtcbiAgICAgICAgICAgIC8vIEdvdCByZXNwb25zZSwgbGV0J3MgZGVjcnlwdCBpdC5cbiAgICAgICAgICAgIF90aGlzLmFlc0RlY3J5cHQoSlNPTi5wYXJzZShyZXMpW1wiZGF0YVwiXSkudGhlbiggZGVjcnlwdGVkUmVzID0+IHtcbiAgICAgICAgICAgICAgcmVzb2x2ZShkZWNyeXB0ZWRSZXMpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pLmNhdGNoKCBlcnIgPT4gX3RoaXMubG9nKGVycikpO1xuICAgIH0pO1xuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG5cbiAgZW5jcnlwdGVkVGVsZW1ldHJ5KCl7XG4gICAgbGV0IF90aGlzID0gdGhpcztcbiAgICBsZXQgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCl7XG4gICAgICB0cnl7XG4gICAgICAgIHJldHVybiBfdGhpcy5nZXRwcm94eUNvb3JkaW5hdG9yKClcbiAgICAgICAgICAudGhlbigoKSA9PiBfdGhpcy5jaGVja0xvY2FsVW5pcSgpKVxuICAgICAgICAgIC50aGVuKCgpID0+IF90aGlzLmFlc0VuY3J5cHQoXCJ0ZWxlbWV0cnlcIikpXG4gICAgICAgICAgLnRoZW4oKCkgPT4gX3RoaXMuc2lnbktleSgpKVxuICAgICAgICAgIC50aGVuKCgpID0+IF90aGlzLmJsaW5kTWVzc2FnZSgpKVxuICAgICAgICAgIC50aGVuKCgpID0+IF90aGlzLnVzZXJTaWduKCkpXG4gICAgICAgICAgLnRoZW4oKCkgPT4gX3RoaXMuc2VuZEJsaW5kUGF5bG9hZCgpKVxuICAgICAgICAgIC50aGVuKCgpID0+IF90aGlzLnVuQmxpbmRNZXNzYWdlKCkpXG4gICAgICAgICAgLnRoZW4oKCkgPT4gX3RoaXMuc2lnblVuYmxpbmRlZE1lc3NhZ2UoKSlcbiAgICAgICAgICAudGhlbigoKSA9PiBfdGhpcy5zZW5kTWVzc2FnZVByb3h5KCkpXG4gICAgICAgICAgLnRoZW4oKCkgPT4gX3RoaXMuc2F2ZUxvY2FsQ2hlY2tUYWJsZSgpKVxuICAgICAgICAgIC50aGVuKCgpID0+IHJlc29sdmUodHJ1ZSkpXG4gICAgICAgICAgLmNhdGNoKCBlcnIgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgY2F0Y2ggKGVycil7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiRXJyb3IgY3JlYXRpbmcgbWM6IFwiICsgZXJyKTtcbiAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cbn07XG4iLCJpbXBvcnQgeyBiYXNlNjRfZGVjb2RlLCBiYXNlNjRfZW5jb2RlIH0gZnJvbSAnLi9jcnlwdG8tdXRpbHMnO1xuXG4vLyBUaGlzIGlzIGJsYXRhbnQgcmlwLW9mZiBvZiBjb252ZXJzaW9uIGZ1bmN0aW9uIGluIGNsaXF6LXAycCBjcnl0cG8uXG5mdW5jdGlvbiBCeXRlQnVmZmVyKGxlbmd0aCkge1xuICAgIHRoaXMuYnVmZmVyID0gbmV3IFVpbnQ4QXJyYXkobGVuZ3RoKTtcbiAgICB0aGlzLnBvcyA9IDA7XG59XG5cbkJ5dGVCdWZmZXIucHJvdG90eXBlLnNldERhdGEgPSBmdW5jdGlvbihkYXRhKSB7XG4gICAgdGhpcy5idWZmZXIgPSBkYXRhO1xuICAgIHRoaXMucG9zID0gMDtcbn07XG5cbkJ5dGVCdWZmZXIucHJvdG90eXBlLnJlYWRCeXRlID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKHRoaXMucG9zICsgMSA+IHRoaXMuYnVmZmVyLmxlbmd0aCkge1xuICAgICAgICB0aHJvdyAnVHJpZWQgdG8gcmVhZCBwYXN0IHRoZSBidWZmZXIgbGVuZ3RoJztcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuYnVmZmVyW3RoaXMucG9zKytdO1xufTtcblxuQnl0ZUJ1ZmZlci5wcm90b3R5cGUucmVhZEJ5dGVzID0gZnVuY3Rpb24obGVuZ3RoKSB7XG4gICAgaWYgKHRoaXMucG9zICsgbGVuZ3RoID4gdGhpcy5idWZmZXIubGVuZ3RoKSB7XG4gICAgICAgIHRocm93ICdUcmllZCB0byByZWFkIHBhc3QgdGhlIGJ1ZmZlciBsZW5ndGgnO1xuICAgIH1cbiAgICB2YXIgcmVzID0gdGhpcy5idWZmZXIuc3ViYXJyYXkodGhpcy5wb3MsIHRoaXMucG9zICsgbGVuZ3RoKTtcbiAgICB0aGlzLnBvcyArPSBsZW5ndGg7XG4gICAgcmV0dXJuIHJlcztcbn07XG5cbkJ5dGVCdWZmZXIucHJvdG90eXBlLnJlc2V0UG9pbnRlciA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMucG9zID0gMDtcbn07XG5cbkJ5dGVCdWZmZXIucHJvdG90eXBlLnB1c2hCeXRlID0gZnVuY3Rpb24oYnl0ZSkge1xuICAgIGlmICh0aGlzLnBvcyArIDEgPiB0aGlzLmJ1ZmZlci5sZW5ndGgpIHtcbiAgICAgICAgdmFyIG5ld0J1ZmZlciA9IG5ldyBVaW50OEFycmF5KHRoaXMuYnVmZmVyLmxlbmd0aCoyKTtcbiAgICAgICAgbmV3QnVmZmVyLnNldCh0aGlzLmJ1ZmZlcik7XG4gICAgICAgIHRoaXMuYnVmZmVyID0gbmV3QnVmZmVyO1xuICAgIH1cbiAgICB0aGlzLmJ1ZmZlclt0aGlzLnBvcysrXSA9IGJ5dGU7XG59O1xuXG5CeXRlQnVmZmVyLnByb3RvdHlwZS5wdXNoQnl0ZXMgPSBmdW5jdGlvbihieXRlcykge1xuICAgIGlmICh0aGlzLnBvcyArIGJ5dGVzLmxlbmd0aCA+IHRoaXMuYnVmZmVyLmxlbmd0aCkge1xuICAgICAgICB2YXIgbmV3QnVmZmVyID0gbmV3IFVpbnQ4QXJyYXkoKHRoaXMucG9zICsgYnl0ZXMubGVuZ3RoKSoyKTtcbiAgICAgICAgbmV3QnVmZmVyLnNldCh0aGlzLmJ1ZmZlcik7XG4gICAgICAgIHRoaXMuYnVmZmVyID0gbmV3QnVmZmVyO1xuICAgIH1cbiAgICB0aGlzLmJ1ZmZlci5zZXQoYnl0ZXMsIHRoaXMucG9zKTtcbiAgICB0aGlzLnBvcyArPSBieXRlcy5sZW5ndGg7XG59O1xuXG5CeXRlQnVmZmVyLnByb3RvdHlwZS50b0Jhc2U2NCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBiYXNlNjRfZW5jb2RlKHRoaXMuYnVmZmVyLnN1YmFycmF5KDAsIHRoaXMucG9zKSk7XG59O1xuXG5CeXRlQnVmZmVyLnByb3RvdHlwZS5mcm9tQmFzZTY0ID0gZnVuY3Rpb24oZGF0YSkge1xuICAgIHRoaXMucHVzaEJ5dGVzKGJhc2U2NF9kZWNvZGUoZGF0YSkpO1xufTtcblxuZnVuY3Rpb24gYnl0ZXNUb0VuY29kZShsZW4pIHtcbiAgICB2YXIgc3VtID0gbGVuICsgMTtcbiAgICBpZiAobGVuIDwgKDE8PDcpKSB7XG4gICAgICAgIHN1bSArPSAxO1xuICAgIH1cbiAgICBlbHNlIGlmIChsZW4gPCAoMTw8OCkpIHtcbiAgICAgICAgc3VtICs9IDI7XG4gICAgfVxuICAgIGVsc2UgaWYgKGxlbiA8ICgxPDwxNikpIHtcbiAgICAgICAgc3VtICs9IDM7XG4gICAgfVxuICAgIGVsc2UgaWYgKGxlbiA8ICgxPDwyNCkpIHtcbiAgICAgICAgc3VtICs9IDQ7XG4gICAgfVxuICAgIGVsc2UgaWYgKGxlbiA8ICgxPDwzMikpIHtcbiAgICAgICAgc3VtICs9IDU7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICB0aHJvdyAndmFsdWUgdG9vIGJpZyAnICsgbGVuO1xuICAgIH1cbiAgICByZXR1cm4gc3VtO1xufVxuXG5mdW5jdGlvbiBwdXNoTGVuZ3RoKGJ1ZmZlciwgbGVuKSB7XG4gICAgaWYgKGxlbiA8ICgxPDw3KSkge1xuICAgICAgICBidWZmZXIucHVzaEJ5dGUobGVuKTtcbiAgICB9XG4gICAgZWxzZSBpZiAobGVuIDwgKDE8PDgpKSB7XG4gICAgICAgIGJ1ZmZlci5wdXNoQnl0ZSgweDgxKTtcbiAgICAgICAgYnVmZmVyLnB1c2hCeXRlKGxlbik7XG4gICAgfVxuICAgIGVsc2UgaWYgKGxlbiA8ICgxPDwxNikpIHtcbiAgICAgICAgYnVmZmVyLnB1c2hCeXRlKDB4ODIpO1xuICAgICAgICBidWZmZXIucHVzaEJ5dGUobGVuID4+IDgpO1xuICAgICAgICBidWZmZXIucHVzaEJ5dGUobGVuJjB4RkYpO1xuICAgIH1cbiAgICBlbHNlIGlmIChsZW4gPCAoMTw8MjQpKSB7XG4gICAgICAgIGJ1ZmZlci5wdXNoQnl0ZSgweDgzKTtcbiAgICAgICAgYnVmZmVyLnB1c2hCeXRlKGxlbiA+PiAxNik7XG4gICAgICAgIGJ1ZmZlci5wdXNoQnl0ZSgobGVuID4+IDgpJjB4RkYpO1xuICAgICAgICBidWZmZXIucHVzaEJ5dGUobGVuJjB4RkYpO1xuICAgIH1cbiAgICBlbHNlIGlmIChsZW4gPCAoMTw8MzIpKSB7XG4gICAgICAgIGJ1ZmZlci5wdXNoQnl0ZSgweDg0KTtcbiAgICAgICAgYnVmZmVyLnB1c2hCeXRlKGxlbiA+PiAyNCk7XG4gICAgICAgIGJ1ZmZlci5wdXNoQnl0ZSgobGVuID4+IDE2KSYweEZGKTtcbiAgICAgICAgYnVmZmVyLnB1c2hCeXRlKChsZW4gPj4gOCkmMHhGRik7XG4gICAgICAgIGJ1ZmZlci5wdXNoQnl0ZShsZW4mMHhGRik7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICB0aHJvdyAndmFsdWUgdG9vIGJpZyAnICsgbGVuO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZnJvbUJhc2U2NHVybChkYXRhKSB7XG4gICAgZGF0YSA9IGRhdGEucmVwbGFjZSgvLS9nLCAnKycpLnJlcGxhY2UoL18vZywgJy8nKTtcbiAgICB2YXIgcGFkcyA9ICg0IC0gZGF0YS5sZW5ndGglNCklNDtcbiAgICBpZiAocGFkcyA9PT0gMykge1xuICAgICAgICB0aHJvdyAnaWxsZWdhbCBiYXNlNjQgc3RyaW5nOiAnICsgZGF0YTtcbiAgICB9XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwYWRzOyBpKyspIHtcbiAgICAgICAgZGF0YSArPSAnPSc7XG4gICAgfVxuICAgIHJldHVybiBkYXRhO1xufVxuXG5cbmZ1bmN0aW9uIHRvQmFzZTY0dXJsKGRhdGEpIHtcbiAgICBkYXRhID0gZGF0YS5yZXBsYWNlKC9cXCsvZywgJy0nKS5yZXBsYWNlKC9cXC8vZywgJ18nKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IDI7ICsraSkge1xuICAgICAgICBpZiAoZGF0YVtkYXRhLmxlbmd0aCAtIDFdID09PSAnPScpIHtcbiAgICAgICAgICAgIGRhdGEgPSBkYXRhLnN1YnN0cmluZygwLCBkYXRhLmxlbmd0aCAtIDEpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBkYXRhO1xufVxuXG5mdW5jdGlvbiBwYWRJZlNpZ25lZChhcnJheSkge1xuICAgIGlmIChhcnJheVswXSYweDgwKSB7XG4gICAgICAgIHZhciBuZXdBcnJheSA9IG5ldyBVaW50OEFycmF5KGFycmF5Lmxlbmd0aCArIDEpO1xuICAgICAgICBuZXdBcnJheVswXSA9IDA7XG4gICAgICAgIG5ld0FycmF5LnNldChhcnJheSwgMSk7XG4gICAgICAgIHJldHVybiBuZXdBcnJheTtcbiAgICB9XG4gICAgcmV0dXJuIGFycmF5O1xufVxuLypSU0FQcml2YXRlS2V5IDo6PSBTRVFVRU5DRSB7XG4gIHZlcnNpb24gICAgICAgICAgIDAsXG4gIG1vZHVsdXMgICAgICAgICAgIElOVEVHRVIsICAtLSBuXG4gIHB1YmxpY0V4cG9uZW50ICAgIElOVEVHRVIsICAtLSBlXG4gIHByaXZhdGVFeHBvbmVudCAgIElOVEVHRVIsICAtLSBkXG4gIHByaW1lMSAgICAgICAgICAgIElOVEVHRVIsICAtLSBwXG4gIHByaW1lMiAgICAgICAgICAgIElOVEVHRVIsICAtLSBxXG4gIGV4cG9uZW50MSAgICAgICAgIElOVEVHRVIsICAtLSBkIG1vZCAocC0xKVxuICBleHBvbmVudDIgICAgICAgICBJTlRFR0VSLCAgLS0gZCBtb2QgKHEtMSlcbiAgY29lZmZpY2llbnQgICAgICAgSU5URUdFUiwgIC0tIChpbnZlcnNlIG9mIHEpIG1vZCBwXG59Ki9cblxuLypSU0FQdWJsaWNLZXkgOjo9IFNFUVVFTkNFIHtcbiAgICBtb2R1bHVzICAgICAgICAgICBJTlRFR0VSLCAgLS0gblxuICAgIHB1YmxpY0V4cG9uZW50ICAgIElOVEVHRVIgICAtLSBlXG59Ki9cbmV4cG9ydCBmdW5jdGlvbiBleHBvcnRQcml2YXRlS2V5KGtleSkge1xuICAgIHZhciBvcmlnX3ZhbHVlcyA9IFsnQUE9PScsIGtleS5uLCBrZXkuZSwga2V5LmQsIGtleS5wLCBrZXkucSwga2V5LmRwLCBrZXkuZHEsIGtleS5xaV07XG4gICAgdmFyIHZhbHVlcyA9IG9yaWdfdmFsdWVzLm1hcCh4ID0+IHBhZElmU2lnbmVkKGJhc2U2NF9kZWNvZGUoZnJvbUJhc2U2NHVybCh4KSkpKTtcbiAgICB2YXIgYnVmZmVyID0gbmV3IEJ5dGVCdWZmZXIoMjAwMCk7XG5cbiAgICBidWZmZXIucHVzaEJ5dGUoMHgzMCk7IC8vU0VRVUVOQ0VcbiAgICB2YXIgbnVtQnl0ZXMgPSB2YWx1ZXMucmVkdWNlKChhLCB4KSA9PiBhICsgYnl0ZXNUb0VuY29kZSh4Lmxlbmd0aCksIDApO1xuICAgIHB1c2hMZW5ndGgoYnVmZmVyLCBudW1CeXRlcyk7XG5cbiAgICB2YWx1ZXMuZm9yRWFjaCh4ID0+IHtcbiAgICAgICAgYnVmZmVyLnB1c2hCeXRlKDB4MDIpOyAvLyBJTlRFR0VSXG4gICAgICAgIHB1c2hMZW5ndGgoYnVmZmVyLCB4Lmxlbmd0aCk7XG4gICAgICAgIGJ1ZmZlci5wdXNoQnl0ZXMoeCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIGJ1ZmZlci50b0Jhc2U2NCgpO1xufTtcbi8qUlNBUHVibGljS2V5IDo6PSBTRVFVRU5DRSB7XG4gICAgbW9kdWx1cyAgICAgICAgICAgSU5URUdFUiwgIC0tIG5cbiAgICBwdWJsaWNFeHBvbmVudCAgICBJTlRFR0VSICAgLS0gZVxufSovXG5cblxuLy8gU0VRVUVOQ0UoMiBlbGVtKVxuICAgIC8vIFNFUVVFTkNFKDIgZWxlbSlcbiAgICAgICAgLy8gT0JKRUNUIElERU5USUZJRVIgMS4yLjg0MC4xMTM1NDkuMS4xLjFcbiAgICAgICAgLy8gTlVMTFxuICAgIC8vIEJJVCBTVFJJTkcoMSBlbGVtKVxuICAgICAgICAvLyBTRVFVRU5DRSgyIGVsZW0pXG4gICAgICAgICAgICAvLyBJTlRFR0VSKDIwNDggYml0KSBuXG4gICAgICAgICAgICAvLyBJTlRFR0VSIGVcbmV4cG9ydCBmdW5jdGlvbiBleHBvcnRQdWJsaWNLZXkoa2V5KSB7XG4gICAgdmFyIG9yaWdfdmFsdWVzID0gW2tleS5uLCBrZXkuZV07XG4gICAgdmFyIHZhbHVlcyA9IG9yaWdfdmFsdWVzLm1hcCh4ID0+IHBhZElmU2lnbmVkKGJhc2U2NF9kZWNvZGUoZnJvbUJhc2U2NHVybCh4KSkpKTtcbiAgICB2YXIgbnVtQnl0ZXMgPSB2YWx1ZXMucmVkdWNlKChhLCB4KSA9PiBhICsgYnl0ZXNUb0VuY29kZSh4Lmxlbmd0aCksIDApO1xuXG4gICAgdmFyIGJ1ZmZlciA9IG5ldyBCeXRlQnVmZmVyKDIwMDApO1xuXG4gICAgYnVmZmVyLnB1c2hCeXRlKDB4MzApOyAvL1NFUVVFTkNFXG4gICAgcHVzaExlbmd0aChidWZmZXIsIGJ5dGVzVG9FbmNvZGUoYnl0ZXNUb0VuY29kZShudW1CeXRlcykgKyAxKSArIDE1KTtcblxuICAgIGJ1ZmZlci5wdXNoQnl0ZXMobmV3IFVpbnQ4QXJyYXkoWzB4MzAsIDB4MEQsIDB4MDYsIDB4MDksIDB4MkEsIDB4ODYsIDB4NDgsIDB4ODYsIDB4RjcsIDB4MEQsIDB4MDEsIDB4MDEsIDB4MDEsIDB4MDUsIDB4MDBdKSk7XG4gICAgYnVmZmVyLnB1c2hCeXRlKDB4MDMpOyAvL0JJVCBTVFJJTkdcbiAgICBwdXNoTGVuZ3RoKGJ1ZmZlciwgYnl0ZXNUb0VuY29kZShudW1CeXRlcykgKyAxKTtcbiAgICBidWZmZXIucHVzaEJ5dGUoMHgwMCk7XG5cbiAgICBidWZmZXIucHVzaEJ5dGUoMHgzMCk7IC8vU0VRVUVOQ0VcbiAgICBwdXNoTGVuZ3RoKGJ1ZmZlciwgbnVtQnl0ZXMpO1xuXG4gICAgdmFsdWVzLmZvckVhY2goeCA9PiB7XG4gICAgICAgIGJ1ZmZlci5wdXNoQnl0ZSgweDAyKTsgLy8gSU5URUdFUlxuICAgICAgICBwdXNoTGVuZ3RoKGJ1ZmZlciwgeC5sZW5ndGgpO1xuICAgICAgICBidWZmZXIucHVzaEJ5dGVzKHgpO1xuICAgIH0pO1xuICAgIHJldHVybiBidWZmZXIudG9CYXNlNjQoKTtcbn07XG5cbmZ1bmN0aW9uIGV4cG9ydFB1YmxpY0tleVNQS0koa2V5KSB7XG4gICAgcmV0dXJuIGV4cG9ydFB1YmxpY0tleShrZXkpO1xufTtcblxuZnVuY3Rpb24gZXhwb3J0UHJpdmF0ZUtleVBLQ1M4KGtleSkge1xuICAgIHZhciBvcmlnX3ZhbHVlcyA9IFsnQUE9PScsIGtleS5uLCBrZXkuZSwga2V5LmQsIGtleS5wLCBrZXkucSwga2V5LmRwLCBrZXkuZHEsIGtleS5xaV07XG4gICAgdmFyIHZhbHVlcyA9IG9yaWdfdmFsdWVzLm1hcCh4ID0+IHBhZElmU2lnbmVkKGJhc2U2NF9kZWNvZGUoZnJvbUJhc2U2NHVybCh4KSkpKTtcbiAgICB2YXIgbnVtQnl0ZXMgPSB2YWx1ZXMucmVkdWNlKChhLCB4KSA9PiBhICsgYnl0ZXNUb0VuY29kZSh4Lmxlbmd0aCksIDApO1xuXG4gICAgdmFyIGJ1ZmZlciA9IG5ldyBCeXRlQnVmZmVyKDIwMDApO1xuXG4gICAgYnVmZmVyLnB1c2hCeXRlKDB4MzApOyAvL1NFUVVFTkNFXG4gICAgcHVzaExlbmd0aChidWZmZXIsIDMgKyAxNSArIGJ5dGVzVG9FbmNvZGUoYnl0ZXNUb0VuY29kZShudW1CeXRlcykpKTtcbiAgICBidWZmZXIucHVzaEJ5dGVzKG5ldyBVaW50OEFycmF5KFsweDAyLCAweDAxLCAweDAwXSkpO1xuICAgIGJ1ZmZlci5wdXNoQnl0ZXMobmV3IFVpbnQ4QXJyYXkoWzB4MzAsIDB4MEQsIDB4MDYsIDB4MDksIDB4MkEsIDB4ODYsIDB4NDgsIDB4ODYsIDB4RjcsIDB4MEQsIDB4MDEsIDB4MDEsIDB4MDEsIDB4MDUsIDB4MDBdKSk7XG4gICAgYnVmZmVyLnB1c2hCeXRlKDB4MDQpOyAvL09DVEVUIFNUUklOR1xuICAgIHB1c2hMZW5ndGgoYnVmZmVyLCBieXRlc1RvRW5jb2RlKG51bUJ5dGVzKSk7XG5cbiAgICBidWZmZXIucHVzaEJ5dGUoMHgzMCk7IC8vU0VRVUVOQ0VcbiAgICBwdXNoTGVuZ3RoKGJ1ZmZlciwgbnVtQnl0ZXMpO1xuXG4gICAgdmFsdWVzLmZvckVhY2goeCA9PiB7XG4gICAgICAgIGJ1ZmZlci5wdXNoQnl0ZSgweDAyKTsgLy8gSU5URUdFUlxuICAgICAgICBwdXNoTGVuZ3RoKGJ1ZmZlciwgeC5sZW5ndGgpO1xuICAgICAgICBidWZmZXIucHVzaEJ5dGVzKHgpO1xuICAgIH0pO1xuICAgIHJldHVybiBidWZmZXIudG9CYXNlNjQoKTtcbn07XG5cbmZ1bmN0aW9uIHJlYWRMZW5ndGgoYnVmZmVyKSB7XG4gICAgdmFyIGZpcnN0ID0gYnVmZmVyLnJlYWRCeXRlKCk7XG4gICAgaWYgKGZpcnN0JjB4ODApIHtcbiAgICAgICAgdmFyIG51bUJ5dGVzID0gZmlyc3QmMHg3RjtcbiAgICAgICAgdmFyIHJlcyA9IDA7XG4gICAgICAgIHdoaWxlIChudW1CeXRlcy0tKSB7XG4gICAgICAgICAgICByZXMgPSAocmVzIDw8IDgpfGJ1ZmZlci5yZWFkQnl0ZSgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXM7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICByZXR1cm4gZmlyc3Q7XG4gICAgfVxufVxuXG5mdW5jdGlvbiByZWFkSW50ZWdlcihidWZmZXIpIHtcbiAgICB2YXIgdGFnID0gYnVmZmVyLnJlYWRCeXRlKCk7XG4gICAgaWYgKHRhZyAhPT0gMHgwMikge1xuICAgICAgICB0aHJvdyAnaW52YWxpZCB0YWcgZm9yIGludGVnZXIgdmFsdWUnO1xuICAgIH1cbiAgICB2YXIgbGVuID0gcmVhZExlbmd0aChidWZmZXIpO1xuICAgIHZhciB2YWwgPSBidWZmZXIucmVhZEJ5dGVzKGxlbik7XG4gICAgaWYgKHZhbFswXSA9PT0gMCkgeyAvLyBSZW1vdmUgcGFkZGluZz9cbiAgICAgICAgdmFsID0gdmFsLnN1YmFycmF5KDEpO1xuICAgIH1cbiAgICByZXR1cm4gdmFsO1xufVxuXG5mdW5jdGlvbiBfX2ltcG9ydEtleShidWZmZXIsIHZhbHVlcykge1xuICAgIHZhciBrZXkgPSB7fTtcbiAgICBpZiAoYnVmZmVyLnJlYWRCeXRlKCkgPT09IDB4MzApIHtcbiAgICAgICAgcmVhZExlbmd0aChidWZmZXIpO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZhbHVlcy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgdmFyIHZhbCA9IHJlYWRJbnRlZ2VyKGJ1ZmZlcik7XG4gICAgICAgICAgICB2YWwgPSB0b0Jhc2U2NHVybChiYXNlNjRfZW5jb2RlKHZhbCkpO1xuICAgICAgICAgICAga2V5W3ZhbHVlc1tpXV0gPSB2YWw7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHRocm93ICdmaXJzdCB2YWx1ZSBub3QgY29ycmVjdCc7XG4gICAgfVxuICAgIGlmIChidWZmZXIucG9zICE9PSBidWZmZXIuYnVmZmVyLmxlbmd0aCkge1xuICAgICAgICB0aHJvdyAnbm90IGFsbCBpbnB1dCBkYXRhIGNvbnN1bWVkJztcbiAgICB9XG4gICAga2V5LmFsZyA9ICdSUzI1Nic7XG4gICAga2V5LmV4dCA9IHRydWU7XG4gICAga2V5Lmt0eSA9ICdSU0EnO1xuICAgIHJldHVybiBrZXk7XG59XG5cbmZ1bmN0aW9uIF9pbXBvcnRLZXkoZGF0YSwgdmFsdWVzKSB7XG4gICAgdmFyIGJ1ZmZlciA9IG5ldyBCeXRlQnVmZmVyKDApO1xuICAgIGJ1ZmZlci5zZXREYXRhKGJhc2U2NF9kZWNvZGUoZGF0YSkpO1xuICAgIHJldHVybiBfX2ltcG9ydEtleShidWZmZXIsIHZhbHVlcyk7XG59XG5cbmZ1bmN0aW9uIGltcG9ydFB1YmxpY0tleShkYXRhKSB7XG4gICAgdmFyIGJ1ZmZlciA9IG5ldyBCeXRlQnVmZmVyKDApO1xuICAgIGJ1ZmZlci5zZXREYXRhKGJhc2U2NF9kZWNvZGUoZGF0YSkpO1xuICAgIGlmIChidWZmZXIucmVhZEJ5dGUoKSA9PT0gMHgzMCkge1xuICAgICAgICByZWFkTGVuZ3RoKGJ1ZmZlcik7XG4gICAgICAgIGJ1ZmZlci5yZWFkQnl0ZXMoMTUpO1xuICAgICAgICBpZiAoYnVmZmVyLnJlYWRCeXRlKCkgIT09IDB4MDMpIHtcbiAgICAgICAgICAgIHRocm93ICdmb3JtYXQgbm90IGNvcnJlY3QnO1xuICAgICAgICB9XG4gICAgICAgIHJlYWRMZW5ndGgoYnVmZmVyKTtcbiAgICAgICAgaWYgKGJ1ZmZlci5yZWFkQnl0ZSgpICE9PSAweDAwKSB7XG4gICAgICAgICAgICB0aHJvdyAnZm9ybWF0IG5vdCBjb3JyZWN0JztcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgdGhyb3cgJ2Zvcm1hdCBub3QgY29ycmVjdCc7XG4gICAgfVxuICAgIHJldHVybiBfX2ltcG9ydEtleShidWZmZXIsIFsnbicsICdlJ10pO1xufTtcblxuZnVuY3Rpb24gaW1wb3J0UHJpdmF0ZUtleShkYXRhKSB7XG4gICAgdmFyIHJlcyA9IF9pbXBvcnRLZXkoZGF0YSwgWyd2ZXJzaW9uJywgJ24nLCAnZScsICdkJywgJ3AnLCAncScsICdkcCcsICdkcScsICdxaSddKTtcbiAgICBkZWxldGUgcmVzLnZlcnNpb247XG4gICAgcmV0dXJuIHJlcztcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBwcml2YXRlS2V5dG9LZXlwYWlyKHByaXZhdGVLZXkpIHtcbiAgICB2YXIga2V5ID0gaW1wb3J0UHJpdmF0ZUtleShwcml2YXRlS2V5KTtcbiAgICByZXR1cm4gW2V4cG9ydFB1YmxpY0tleVNQS0koa2V5KSwgZXhwb3J0UHJpdmF0ZUtleVBLQ1M4KGtleSldO1xufTtcbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uICh1cmwpIHtcblxuXHR2YXIgY29yZSA9IHtcblxuICAgIC8vIE1ldGhvZCB0aGF0IHBlcmZvcm1zIHJlcXVlc3RcbiAgICByZXEgOiBmdW5jdGlvbiAobWV0aG9kLCB1cmwsIGRhdGEsIHR5cGUpIHtcblx0ICAgICAgLy8gQ3JlYXRpbmcgYSBwcm9taXNlXG5cdCAgIHZhciBwcm9taXNlID0gbmV3IFByb21pc2UoIGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcblxuICAgICAgICAvLyBJbnN0YW50aWF0ZXMgdGhlIFhNTEh0dHBSZXF1ZXN0XG4gICAgICAgIHZhciBjbGllbnQgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgdmFyIHVyaSA9IHVybDtcbiAgICAgICAgdmFyIHRzID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG5cbiAgICAgICAgY2xpZW50Lm9wZW4obWV0aG9kLCB1cmksIHRydWUpO1xuICAgICAgICBjbGllbnQuc2V0UmVxdWVzdEhlYWRlcihcIngtdHlwZVwiLCB0eXBlID8gdHlwZSA6IFwiZGVsYXllZFwiKTtcbiAgICAgICAgY2xpZW50Lm92ZXJyaWRlTWltZVR5cGUoJ2FwcGxpY2F0aW9uL2pzb24nKTtcbiAgICAgICAgLy9jbGllbnQuc2V0UmVxdWVzdEhlYWRlcihcIkNvbnRlbnQtVHlwZVwiLCBcImFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtOFwiKTtcbiAgICAgICAgY2xpZW50LnNlbmQoZGF0YSk7XG5cbiAgICAgICAgY2xpZW50Lm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgXHR2YXIgc3RhdHVzQ2xhc3MgPSBwYXJzZUludChjbGllbnQuc3RhdHVzIC8gMTAwKTtcbiAgICAgICAgICBpZihzdGF0dXNDbGFzcyA9PSAyIHx8IHN0YXR1c0NsYXNzID09IDMgfHwgc3RhdHVzQ2xhc3MgPT0gMCAvKiBsb2NhbCBmaWxlcyAqLyl7XG4gICAgICAgICAgICAvLyBQZXJmb3JtcyB0aGUgZnVuY3Rpb24gXCJyZXNvbHZlXCIgd2hlbiB0aGlzLnN0YXR1cyBpcyBlcXVhbCB0byAyeHhcbiAgICAgICAgICAgIHJlc29sdmUodGhpcy5yZXNwb25zZSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIFBlcmZvcm1zIHRoZSBmdW5jdGlvbiBcInJlamVjdFwiIHdoZW4gdGhpcy5zdGF0dXMgaXMgZGlmZmVyZW50IHRoYW4gMnh4XG5cbiAgICAgICAgICAgIHJlamVjdCh0aGlzLnN0YXR1c1RleHQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgY2xpZW50Lm9uZXJyb3IgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIFx0cmVqZWN0KHRoaXMuc3RhdHVzVGV4dCk7XG4gICAgICAgIH07XG4gICAgICAgIGNsaWVudC5vbnRpbWVvdXQgPSBmdW5jdGlvbigpe1xuICAgICAgICBcdHJlamVjdCh0aGlzLnN0YXR1c1RleHQpO1xuICAgICAgICB9O1xuICAgICAgfSk7XG5cbiAgICAgIC8vIFJldHVybiB0aGUgcHJvbWlzZVxuICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgfVxuICB9O1xuXG5cbiAgcmV0dXJuIHtcbiAgXHQnZ2V0JyA6IGZ1bmN0aW9uKGFyZ3MpIHtcbiAgXHRcdHJldHVybiBjb3JlLnJlcSgnR0VUJywgdXJsLCBhcmdzKTtcbiAgXHR9LFxuICBcdCdwb3N0JyA6IGZ1bmN0aW9uKGFyZ3MsIHR5cGUpIHtcbiAgXHRcdHJldHVybiBjb3JlLnJlcSgnUE9TVCcsIHVybCwgYXJncywgdHlwZSk7XG4gIFx0fVxuICB9O1xufVxuIiwiaW1wb3J0IENsaXF6U2VjdXJlTWVzc2FnZSBmcm9tICcuL2luZGV4JztcbmltcG9ydCB7XG4gIHByaXZhdGVLZXl0b0tleXBhaXIsXG4gIGV4cG9ydFByaXZhdGVLZXksXG4gIGV4cG9ydFB1YmxpY0tleSxcbn0gZnJvbSAnLi9wa2NzLWNvbnZlcnNpb24nO1xuaW1wb3J0IHtcbiAgc3RyaW5nVG9CeXRlQXJyYXksXG4gIGJ5dGVBcnJheVRvSGV4U3RyaW5nLFxuICBoZXhTdHJpbmdUb0J5dGVBcnJheSxcbiAgYmFzZTY0VG9CeXRlQXJyYXksXG59IGZyb20gJy4vY3J5cHRvLXV0aWxzJztcbmltcG9ydCBfaHR0cCBmcm9tICcuL2h0dHAtd29ya2VyJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3Mge1xuICBjb25zdHJ1Y3Rvcihtc2cpIHtcbiAgICB0aGlzLnByaXZhdGVLZXkgPSBcIlwiO1xuICAgIHRoaXMucHVibGljS2V5ID0gXCJcIjtcbiAgfVxuXG4gIC8qKlxuICAgKiBNZXRob2QgdG8gc2lnbiB0aGUgc3RyIHVzaW5nIHVzZXJTSy5cbiAgICogQHJldHVybnMgc2lnbmF0dXJlIGluIGhleCBmb3JtYXQuXG4gICAqL1xuICBzaWduKG1zZyl7XG4gICAgdmFyIHByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xuICAgICAgdmFyIHBwayA9IHByaXZhdGVLZXl0b0tleXBhaXIoQ2xpcXpTZWN1cmVNZXNzYWdlLnVQSy5wcml2YXRlS2V5KTtcbiAgICAgIGNyeXB0by5zdWJ0bGUuaW1wb3J0S2V5KFxuICAgICAgICBcInBrY3M4XCIsXG4gICAgICAgIGJhc2U2NFRvQnl0ZUFycmF5KHBwa1sxXSksXG4gICAgICAgIHtuYW1lOiBcIlJTQVNTQS1QS0NTMS12MV81XCIsIGhhc2g6IFwiU0hBLTI1NlwifSxcbiAgICAgICAgZmFsc2UsXG4gICAgICAgIFtcInNpZ25cIl1cbiAgICAgIClcbiAgICAgIC50aGVuKGZ1bmN0aW9uKHByaXZhdGVLZXkpIHtcbiAgICAgICAgdmFyIGRvY3VtZW50Qnl0ZXMgPSBzdHJpbmdUb0J5dGVBcnJheShtc2cpO1xuICAgICAgICBjcnlwdG8uc3VidGxlLnNpZ24oXG4gICAgICAgICAge25hbWU6IFwiUlNBU1NBLVBLQ1MxLXYxXzVcIiwgaGFzaDogXCJTSEEtMjU2XCJ9LFxuICAgICAgICAgIHByaXZhdGVLZXksXG4gICAgICAgICAgZG9jdW1lbnRCeXRlc1xuICAgICAgICApXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uKHNpZ25hdHVyZUJ1ZmZlcikge1xuICAgICAgICAgIHZhciBzaWduYXR1cmVCeXRlcyA9IG5ldyBVaW50OEFycmF5KHNpZ25hdHVyZUJ1ZmZlcik7XG4gICAgICAgICAgdmFyIHNpZ25hdHVyZUhleCA9IGJ5dGVBcnJheVRvSGV4U3RyaW5nKHNpZ25hdHVyZUJ5dGVzKTtcbiAgICAgICAgICByZXNvbHZlKHNpZ25hdHVyZUhleCk7XG4gICAgICAgIH0pLmNhdGNoKCBlcnIgPT4gcmVqZWN0KGVycikpO1xuICAgICAgfSkuY2F0Y2goZXJyID0+IHJlamVjdChlcnIpKTtcbiAgICB9KTtcbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuXG4gIHZlcmlmeShzaWcsIG1zZyl7XG4gICAgdmFyIHByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xuICAgICAgdmFyIHBwayA9IHByaXZhdGVLZXl0b0tleXBhaXIoQ2xpcXpTZWN1cmVNZXNzYWdlLnVQSy5wcml2YXRlS2V5KTtcbiAgICAgIGNyeXB0by5zdWJ0bGUuaW1wb3J0S2V5KFxuICAgICAgICBcInNwa2lcIixcbiAgICAgICAgYmFzZTY0VG9CeXRlQXJyYXkocHBrWzBdKSxcbiAgICAgICAge25hbWU6IFwiUlNBU1NBLVBLQ1MxLXYxXzVcIiwgaGFzaDogXCJTSEEtMjU2XCJ9LFxuICAgICAgICBmYWxzZSxcbiAgICAgICAgW1widmVyaWZ5XCJdXG4gICAgICApXG4gICAgICAudGhlbihmdW5jdGlvbihwdWJsaWNLZXkpIHtcbiAgICAgICAgdmFyIHNpZ25hdHVyZUJ5dGVzID0gaGV4U3RyaW5nVG9CeXRlQXJyYXkoc2lnKTtcbiAgICAgICAgdmFyIGRvY3VtZW50Qnl0ZXMgPSBzdHJpbmdUb0J5dGVBcnJheShtc2cpO1xuICAgICAgICBjcnlwdG8uc3VidGxlLnZlcmlmeShcbiAgICAgICAgICB7bmFtZTogXCJSU0FTU0EtUEtDUzEtdjFfNVwiLCBoYXNoOiBcIlNIQS0yNTZcIn0sXG4gICAgICAgICAgcHVibGljS2V5LFxuICAgICAgICAgIHNpZ25hdHVyZUJ5dGVzLFxuICAgICAgICAgIGRvY3VtZW50Qnl0ZXNcbiAgICAgICAgKVxuICAgICAgICAudGhlbihmdW5jdGlvbih2YWxpZFNpZ25hdHVyZSkge1xuICAgICAgICAgIHJlc29sdmUodmFsaWRTaWduYXR1cmUpO1xuICAgICAgICB9KS5jYXRjaCggZXJyID0+IGNvbnNvbGUubG9nKGVycikpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cblxuICBnZW5lcmF0ZUtleSgpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgIHZhciBwcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KXtcbiAgICAgIGNyeXB0by5zdWJ0bGUuZ2VuZXJhdGVLZXkoXG4gICAgICAgICB7XG4gICAgICAgICAgICBuYW1lOiBcIlJTQVNTQS1QS0NTMS12MV81XCIsXG4gICAgICAgICAgICBtb2R1bHVzTGVuZ3RoOiAyMDQ4LFxuICAgICAgICAgICAgcHVibGljRXhwb25lbnQ6IG5ldyBVaW50OEFycmF5KFsweDAxLCAweDAwLCAweDAxXSksXG4gICAgICAgICAgICBoYXNoOiB7bmFtZTogXCJTSEEtMjU2XCJ9LFxuICAgICAgICAgfSxcbiAgICAgICAgICB0cnVlLFxuICAgICAgICAgW1wic2lnblwiLCBcInZlcmlmeVwiXVxuICAgICAgKS50aGVuKCBrZXkgPT4ge1xuICAgICAgICByZXR1cm4gY3J5cHRvLnN1YnRsZS5leHBvcnRLZXkoXCJqd2tcIiwga2V5LnByaXZhdGVLZXkpXG4gICAgICB9KS50aGVuKCBrZXkgPT4ge1xuICAgICAgICAgdmFyIHJldHVybl9kYXRhID0ge31cbiAgICAgICAgIHJldHVybl9kYXRhW1wicHJpdktleUI2NFwiXSA9IGV4cG9ydFByaXZhdGVLZXkoa2V5KTtcbiAgICAgICAgIHJldHVybl9kYXRhW1wicHVibGljS2V5QjY0XCJdID0gZXhwb3J0UHVibGljS2V5KGtleSk7XG4gICAgICAgICBfdGhpcy5wcml2YXRlS2V5ID0gcmV0dXJuX2RhdGFbXCJwcml2S2V5QjY0XCJdO1xuICAgICAgICAgX3RoaXMucHVibGljS2V5ID0gcmV0dXJuX2RhdGFbXCJwdWJsaWNLZXlCNjRcIl07XG4gICAgICAgICByZXR1cm4gcmV0dXJuX2RhdGE7XG4gICAgICB9KS50aGVuKCBrZXlzID0+IHtcbiAgICAgICAgIHJldHVybiBfaHR0cChDbGlxelNlY3VyZU1lc3NhZ2UuVVNFUl9SRUcpLnBvc3QoSlNPTi5zdHJpbmdpZnkoe1wicGtcIjprZXlzW1wicHVibGljS2V5QjY0XCJdfSkpO1xuICAgICAgfSkudGhlbiggZSA9PiByZXNvbHZlKHtcInN0YXR1c1wiOnRydWUsXCJwcml2YXRlS2V5XCI6X3RoaXMucHJpdmF0ZUtleSxcInB1YmxpY0tleVwiOl90aGlzLnB1YmxpY0tleX0pKVxuICAgICAgLmNhdGNoKCBlID0+IHJlamVjdCh7XCJzdGF0dXNcIjogZS5tZXNzYWdlfSkpO1xuICAgIH0pO1xuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG59O1xuIiwiLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gQmlnIEludGVnZXIgTGlicmFyeSB2LiA1LjVcbi8vIENyZWF0ZWQgMjAwMCwgbGFzdCBtb2RpZmllZCAyMDEzXG4vLyBMZWVtb24gQmFpcmRcbi8vIHd3dy5sZWVtb24uY29tXG4vL1xuLy8gVmVyc2lvbiBoaXN0b3J5OlxuLy8gdiA1LjUgIDE3IE1hciAyMDEzXG4vLyAgIC0gdHdvIGxpbmVzIG9mIGEgZm9ybSBsaWtlIFwiaWYgKHg8MCkgeCs9blwiIGhhZCB0aGUgXCJpZlwiIGNoYW5nZWQgdG8gXCJ3aGlsZVwiIHRvXG4vLyAgICAgaGFuZGxlIHRoZSBjYXNlIHdoZW4geDwtbi4gKFRoYW5rcyB0byBKYW1lcyBBbnNlbGwgZm9yIGZpbmRpbmcgdGhhdCBidWcpXG4vLyB2IDUuNCAgMyBPY3QgMjAwOVxuLy8gICAtIGFkZGVkIFwidmFyIGlcIiB0byBncmVhdGVyU2hpZnQoKSBzbyBpIGlzIG5vdCBnbG9iYWwuIChUaGFua3MgdG8gUMW9dGVyIFN6YWLigJQgZm9yIGZpbmRpbmcgdGhhdCBidWcpXG4vL1xuLy8gdiA1LjMgIDIxIFNlcCAyMDA5XG4vLyAgIC0gYWRkZWQgcmFuZFByb2JQcmltZShrKSBmb3IgcHJvYmFibGUgcHJpbWVzXG4vLyAgIC0gdW5yb2xsZWQgbG9vcCBpbiBtb250XyAoc2xpZ2h0bHkgZmFzdGVyKVxuLy8gICAtIG1pbGxlclJhYmluIG5vdyB0YWtlcyBhIGJpZ0ludCBwYXJhbWV0ZXIgcmF0aGVyIHRoYW4gYW4gaW50XG4vL1xuLy8gdiA1LjIgIDE1IFNlcCAyMDA5XG4vLyAgIC0gZml4ZWQgY2FwaXRhbGl6YXRpb24gaW4gY2FsbCB0byBpbnQyYmlnSW50IGluIHJhbmRCaWdJbnRcbi8vICAgICAodGhhbmtzIHRvIEVtaWxpIEV2cmlwaWRvdSwgUmVpbmhvbGQgQmVocmluZ2VyLCBhbmQgU2FtdWVsIE1hY2FsZWVzZSBmb3IgZmluZGluZyB0aGF0IGJ1Zylcbi8vXG4vLyB2IDUuMSAgOCBPY3QgMjAwN1xuLy8gICAtIHJlbmFtZWQgaW52ZXJzZU1vZEludF8gdG8gaW52ZXJzZU1vZEludCBzaW5jZSBpdCBkb2Vzbid0IGNoYW5nZSBpdHMgcGFyYW1ldGVyc1xuLy8gICAtIGFkZGVkIGZ1bmN0aW9ucyBHQ0QgYW5kIHJhbmRCaWdJbnQsIHdoaWNoIGNhbGwgR0NEXyBhbmQgcmFuZEJpZ0ludF9cbi8vICAgLSBmaXhlZCBhIGJ1ZyBmb3VuZCBieSBSb2IgVmlzc2VyIChzZWUgY29tbWVudCB3aXRoIGhpcyBuYW1lIGJlbG93KVxuLy8gICAtIGltcHJvdmVkIGNvbW1lbnRzXG4vL1xuLy8gVGhpcyBmaWxlIGlzIHB1YmxpYyBkb21haW4uICAgWW91IGNhbiB1c2UgaXQgZm9yIGFueSBwdXJwb3NlIHdpdGhvdXQgcmVzdHJpY3Rpb24uXG4vLyBJIGRvIG5vdCBndWFyYW50ZWUgdGhhdCBpdCBpcyBjb3JyZWN0LCBzbyB1c2UgaXQgYXQgeW91ciBvd24gcmlzay4gIElmIHlvdSB1c2Vcbi8vIGl0IGZvciBzb21ldGhpbmcgaW50ZXJlc3RpbmcsIEknZCBhcHByZWNpYXRlIGhlYXJpbmcgYWJvdXQgaXQuICBJZiB5b3UgZmluZFxuLy8gYW55IGJ1Z3Mgb3IgbWFrZSBhbnkgaW1wcm92ZW1lbnRzLCBJJ2QgYXBwcmVjaWF0ZSBoZWFyaW5nIGFib3V0IHRob3NlIHRvby5cbi8vIEl0IHdvdWxkIGFsc28gYmUgbmljZSBpZiBteSBuYW1lIGFuZCBVUkwgd2VyZSBsZWZ0IGluIHRoZSBjb21tZW50cy4gIEJ1dCBub25lXG4vLyBvZiB0aGF0IGlzIHJlcXVpcmVkLlxuLy9cbi8vIFRoaXMgY29kZSBkZWZpbmVzIGEgYmlnSW50IGxpYnJhcnkgZm9yIGFyYml0cmFyeS1wcmVjaXNpb24gaW50ZWdlcnMuXG4vLyBBIGJpZ0ludCBpcyBhbiBhcnJheSBvZiBpbnRlZ2VycyBzdG9yaW5nIHRoZSB2YWx1ZSBpbiBjaHVua3Mgb2YgYnBlIGJpdHMsXG4vLyBsaXR0bGUgZW5kaWFuIChidWZmWzBdIGlzIHRoZSBsZWFzdCBzaWduaWZpY2FudCB3b3JkKS5cbi8vIE5lZ2F0aXZlIGJpZ0ludHMgYXJlIHN0b3JlZCB0d28ncyBjb21wbGVtZW50LiAgQWxtb3N0IGFsbCB0aGUgZnVuY3Rpb25zIHRyZWF0XG4vLyBiaWdJbnRzIGFzIG5vbm5lZ2F0aXZlLiAgVGhlIGZldyB0aGF0IHZpZXcgdGhlbSBhcyB0d28ncyBjb21wbGVtZW50IHNheSBzb1xuLy8gaW4gdGhlaXIgY29tbWVudHMuICBTb21lIGZ1bmN0aW9ucyBhc3N1bWUgdGhlaXIgcGFyYW1ldGVycyBoYXZlIGF0IGxlYXN0IG9uZVxuLy8gbGVhZGluZyB6ZXJvIGVsZW1lbnQuIEZ1bmN0aW9ucyB3aXRoIGFuIHVuZGVyc2NvcmUgYXQgdGhlIGVuZCBvZiB0aGUgbmFtZSBwdXRcbi8vIHRoZWlyIGFuc3dlciBpbnRvIG9uZSBvZiB0aGUgYXJyYXlzIHBhc3NlZCBpbiwgYW5kIGhhdmUgdW5wcmVkaWN0YWJsZSBiZWhhdmlvclxuLy8gaW4gY2FzZSBvZiBvdmVyZmxvdywgc28gdGhlIGNhbGxlciBtdXN0IG1ha2Ugc3VyZSB0aGUgYXJyYXlzIGFyZSBiaWcgZW5vdWdoIHRvXG4vLyBob2xkIHRoZSBhbnN3ZXIuICBCdXQgdGhlIGF2ZXJhZ2UgdXNlciBzaG91bGQgbmV2ZXIgaGF2ZSB0byBjYWxsIGFueSBvZiB0aGVcbi8vIHVuZGVyc2NvcmVkIGZ1bmN0aW9ucy4gIEVhY2ggaW1wb3J0YW50IHVuZGVyc2NvcmVkIGZ1bmN0aW9uIGhhcyBhIHdyYXBwZXIgZnVuY3Rpb25cbi8vIG9mIHRoZSBzYW1lIG5hbWUgd2l0aG91dCB0aGUgdW5kZXJzY29yZSB0aGF0IHRha2VzIGNhcmUgb2YgdGhlIGRldGFpbHMgZm9yIHlvdS5cbi8vIEZvciBlYWNoIHVuZGVyc2NvcmVkIGZ1bmN0aW9uIHdoZXJlIGEgcGFyYW1ldGVyIGlzIG1vZGlmaWVkLCB0aGF0IHNhbWUgdmFyaWFibGVcbi8vIG11c3Qgbm90IGJlIHVzZWQgYXMgYW5vdGhlciBhcmd1bWVudCB0b28uICBTbywgeW91IGNhbm5vdCBzcXVhcmUgeCBieSBkb2luZ1xuLy8gbXVsdE1vZF8oeCx4LG4pLiAgWW91IG11c3QgdXNlIHNxdWFyZU1vZF8oeCxuKSBpbnN0ZWFkLCBvciBkbyB5PWR1cCh4KTsgbXVsdE1vZF8oeCx5LG4pLlxuLy8gT3Igc2ltcGx5IHVzZSB0aGUgbXVsdE1vZCh4LHgsbikgZnVuY3Rpb24gd2l0aG91dCB0aGUgdW5kZXJzY29yZSwgd2hlcmVcbi8vIHN1Y2ggaXNzdWVzIG5ldmVyIGFyaXNlLCBiZWNhdXNlIG5vbi11bmRlcnNjb3JlZCBmdW5jdGlvbnMgbmV2ZXIgY2hhbmdlXG4vLyB0aGVpciBwYXJhbWV0ZXJzOyB0aGV5IGFsd2F5cyBhbGxvY2F0ZSBuZXcgbWVtb3J5IGZvciB0aGUgYW5zd2VyIHRoYXQgaXMgcmV0dXJuZWQuXG4vL1xuLy8gVGhlc2UgZnVuY3Rpb25zIGFyZSBkZXNpZ25lZCB0byBhdm9pZCBmcmVxdWVudCBkeW5hbWljIG1lbW9yeSBhbGxvY2F0aW9uIGluIHRoZSBpbm5lciBsb29wLlxuLy8gRm9yIG1vc3QgZnVuY3Rpb25zLCBpZiBpdCBuZWVkcyBhIEJpZ0ludCBhcyBhIGxvY2FsIHZhcmlhYmxlIGl0IHdpbGwgYWN0dWFsbHkgdXNlXG4vLyBhIGdsb2JhbCwgYW5kIHdpbGwgb25seSBhbGxvY2F0ZSB0byBpdCBvbmx5IHdoZW4gaXQncyBub3QgdGhlIHJpZ2h0IHNpemUuICBUaGlzIGVuc3VyZXNcbi8vIHRoYXQgd2hlbiBhIGZ1bmN0aW9uIGlzIGNhbGxlZCByZXBlYXRlZGx5IHdpdGggc2FtZS1zaXplZCBwYXJhbWV0ZXJzLCBpdCBvbmx5IGFsbG9jYXRlc1xuLy8gbWVtb3J5IG9uIHRoZSBmaXJzdCBjYWxsLlxuLy9cbi8vIE5vdGUgdGhhdCBmb3IgY3J5cHRvZ3JhcGhpYyBwdXJwb3NlcywgdGhlIGNhbGxzIHRvIE1hdGgucmFuZG9tKCkgbXVzdFxuLy8gYmUgcmVwbGFjZWQgd2l0aCBjYWxscyB0byBhIGJldHRlciBwc2V1ZG9yYW5kb20gbnVtYmVyIGdlbmVyYXRvci5cbi8vXG4vLyBJbiB0aGUgZm9sbG93aW5nLCBcImJpZ0ludFwiIG1lYW5zIGEgYmlnSW50IHdpdGggYXQgbGVhc3Qgb25lIGxlYWRpbmcgemVybyBlbGVtZW50LFxuLy8gYW5kIFwiaW50ZWdlclwiIG1lYW5zIGEgbm9ubmVnYXRpdmUgaW50ZWdlciBsZXNzIHRoYW4gcmFkaXguICBJbiBzb21lIGNhc2VzLCBpbnRlZ2VyXG4vLyBjYW4gYmUgbmVnYXRpdmUuICBOZWdhdGl2ZSBiaWdJbnRzIGFyZSAycyBjb21wbGVtZW50LlxuLy9cbi8vIFRoZSBmb2xsb3dpbmcgZnVuY3Rpb25zIGRvIG5vdCBtb2RpZnkgdGhlaXIgaW5wdXRzLlxuLy8gVGhvc2UgcmV0dXJuaW5nIGEgYmlnSW50LCBzdHJpbmcsIG9yIEFycmF5IHdpbGwgZHluYW1pY2FsbHkgYWxsb2NhdGUgbWVtb3J5IGZvciB0aGF0IHZhbHVlLlxuLy8gVGhvc2UgcmV0dXJuaW5nIGEgYm9vbGVhbiB3aWxsIHJldHVybiB0aGUgaW50ZWdlciAwIChmYWxzZSkgb3IgMSAodHJ1ZSkuXG4vLyBUaG9zZSByZXR1cm5pbmcgYm9vbGVhbiBvciBpbnQgd2lsbCBub3QgYWxsb2NhdGUgbWVtb3J5IGV4Y2VwdCBwb3NzaWJseSBvbiB0aGUgZmlyc3Rcbi8vIHRpbWUgdGhleSdyZSBjYWxsZWQgd2l0aCBhIGdpdmVuIHBhcmFtZXRlciBzaXplLlxuLy9cbi8vIGJpZ0ludCAgYWRkKHgseSkgICAgICAgICAgICAgICAvL3JldHVybiAoeCt5KSBmb3IgYmlnSW50c3RyIHggYW5kIHkuXG4vLyBiaWdJbnQgIGFkZEludCh4LG4pICAgICAgICAgICAgLy9yZXR1cm4gKHgrbikgd2hlcmUgeCBpcyBhIGJpZ0ludCBhbmQgbiBpcyBhbiBpbnRlZ2VyLlxuLy8gc3RyaW5nICBiaWdJbnQyc3RyKHgsYmFzZSkgICAgIC8vcmV0dXJuIGEgc3RyaW5nIGZvcm0gb2YgYmlnSW50IHggaW4gYSBnaXZlbiBiYXNlLCB3aXRoIDIgPD0gYmFzZSA8PSA5NVxuLy8gaW50ICAgICBiaXRTaXplKHgpICAgICAgICAgICAgIC8vcmV0dXJuIGhvdyBtYW55IGJpdHMgbG9uZyB0aGUgYmlnSW50IHggaXMsIG5vdCBjb3VudGluZyBsZWFkaW5nIHplcm9zXG4vLyBiaWdJbnQgIGR1cCh4KSAgICAgICAgICAgICAgICAgLy9yZXR1cm4gYSBjb3B5IG9mIGJpZ0ludCB4XG4vLyBib29sZWFuIGVxdWFscyh4LHkpICAgICAgICAgICAgLy9pcyB0aGUgYmlnSW50IHggZXF1YWwgdG8gdGhlIGJpZ2ludCB5P1xuLy8gYm9vbGVhbiBlcXVhbHNJbnQoeCx5KSAgICAgICAgIC8vaXMgYmlnaW50IHggZXF1YWwgdG8gaW50ZWdlciB5P1xuLy8gYmlnSW50ICBleHBhbmQoeCxuKSAgICAgICAgICAgIC8vcmV0dXJuIGEgY29weSBvZiB4IHdpdGggYXQgbGVhc3QgbiBlbGVtZW50cywgYWRkaW5nIGxlYWRpbmcgemVyb3MgaWYgbmVlZGVkXG4vLyBBcnJheSAgIGZpbmRQcmltZXMobikgICAgICAgICAgLy9yZXR1cm4gYXJyYXkgb2YgYWxsIHByaW1lcyBsZXNzIHRoYW4gaW50ZWdlciBuXG4vLyBiaWdJbnQgIEdDRCh4LHkpICAgICAgICAgICAgICAgLy9yZXR1cm4gZ3JlYXRlc3QgY29tbW9uIGRpdmlzb3Igb2YgYmlnSW50cyB4IGFuZCB5IChlYWNoIHdpdGggc2FtZSBudW1iZXIgb2YgZWxlbWVudHMpLlxuLy8gYm9vbGVhbiBncmVhdGVyKHgseSkgICAgICAgICAgIC8vaXMgeD55PyAgKHggYW5kIHkgYXJlIG5vbm5lZ2F0aXZlIGJpZ0ludHMpXG4vLyBib29sZWFuIGdyZWF0ZXJTaGlmdCh4LHksc2hpZnQpLy9pcyAoeCA8PChzaGlmdCpicGUpKSA+IHk/XG4vLyBiaWdJbnQgIGludDJiaWdJbnQodCxuLG0pICAgICAgLy9yZXR1cm4gYSBiaWdJbnQgZXF1YWwgdG8gaW50ZWdlciB0LCB3aXRoIGF0IGxlYXN0IG4gYml0cyBhbmQgbSBhcnJheSBlbGVtZW50c1xuLy8gYmlnSW50ICBpbnZlcnNlTW9kKHgsbikgICAgICAgIC8vcmV0dXJuICh4KiooLTEpIG1vZCBuKSBmb3IgYmlnSW50cyB4IGFuZCBuLiAgSWYgbm8gaW52ZXJzZSBleGlzdHMsIGl0IHJldHVybnMgbnVsbFxuLy8gaW50ICAgICBpbnZlcnNlTW9kSW50KHgsbikgICAgIC8vcmV0dXJuIHgqKigtMSkgbW9kIG4sIGZvciBpbnRlZ2VycyB4IGFuZCBuLiAgUmV0dXJuIDAgaWYgdGhlcmUgaXMgbm8gaW52ZXJzZVxuLy8gYm9vbGVhbiBpc1plcm8oeCkgICAgICAgICAgICAgIC8vaXMgdGhlIGJpZ0ludCB4IGVxdWFsIHRvIHplcm8/XG4vLyBib29sZWFuIG1pbGxlclJhYmluKHgsYikgICAgICAgLy9kb2VzIG9uZSByb3VuZCBvZiBNaWxsZXItUmFiaW4gYmFzZSBpbnRlZ2VyIGIgc2F5IHRoYXQgYmlnSW50IHggaXMgcG9zc2libHkgcHJpbWU/IChiIGlzIGJpZ0ludCwgMTxiPHgpXG4vLyBib29sZWFuIG1pbGxlclJhYmluSW50KHgsYikgICAgLy9kb2VzIG9uZSByb3VuZCBvZiBNaWxsZXItUmFiaW4gYmFzZSBpbnRlZ2VyIGIgc2F5IHRoYXQgYmlnSW50IHggaXMgcG9zc2libHkgcHJpbWU/IChiIGlzIGludCwgICAgMTxiPHgpXG4vLyBiaWdJbnQgIG1vZCh4LG4pICAgICAgICAgICAgICAgLy9yZXR1cm4gYSBuZXcgYmlnSW50IGVxdWFsIHRvICh4IG1vZCBuKSBmb3IgYmlnSW50cyB4IGFuZCBuLlxuLy8gaW50ICAgICBtb2RJbnQoeCxuKSAgICAgICAgICAgIC8vcmV0dXJuIHggbW9kIG4gZm9yIGJpZ0ludCB4IGFuZCBpbnRlZ2VyIG4uXG4vLyBiaWdJbnQgIG11bHQoeCx5KSAgICAgICAgICAgICAgLy9yZXR1cm4geCp5IGZvciBiaWdJbnRzIHggYW5kIHkuIFRoaXMgaXMgZmFzdGVyIHdoZW4geTx4LlxuLy8gYmlnSW50ICBtdWx0TW9kKHgseSxuKSAgICAgICAgIC8vcmV0dXJuICh4KnkgbW9kIG4pIGZvciBiaWdJbnRzIHgseSxuLiAgRm9yIGdyZWF0ZXIgc3BlZWQsIGxldCB5PHguXG4vLyBib29sZWFuIG5lZ2F0aXZlKHgpICAgICAgICAgICAgLy9pcyBiaWdJbnQgeCBuZWdhdGl2ZT9cbi8vIGJpZ0ludCAgcG93TW9kKHgseSxuKSAgICAgICAgICAvL3JldHVybiAoeCoqeSBtb2Qgbikgd2hlcmUgeCx5LG4gYXJlIGJpZ0ludHMgYW5kICoqIGlzIGV4cG9uZW50aWF0aW9uLiAgMCoqMD0xLiBGYXN0ZXIgZm9yIG9kZCBuLlxuLy8gYmlnSW50ICByYW5kQmlnSW50KG4scykgICAgICAgIC8vcmV0dXJuIGFuIG4tYml0IHJhbmRvbSBCaWdJbnQgKG4+PTEpLiAgSWYgcz0xLCB0aGVuIHRoZSBtb3N0IHNpZ25pZmljYW50IG9mIHRob3NlIG4gYml0cyBpcyBzZXQgdG8gMS5cbi8vIGJpZ0ludCAgcmFuZFRydWVQcmltZShrKSAgICAgICAvL3JldHVybiBhIG5ldywgcmFuZG9tLCBrLWJpdCwgdHJ1ZSBwcmltZSBiaWdJbnQgdXNpbmcgTWF1cmVyJ3MgYWxnb3JpdGhtLlxuLy8gYmlnSW50ICByYW5kUHJvYlByaW1lKGspICAgICAgIC8vcmV0dXJuIGEgbmV3LCByYW5kb20sIGstYml0LCBwcm9iYWJsZSBwcmltZSBiaWdJbnQgKHByb2JhYmlsaXR5IGl0J3MgY29tcG9zaXRlIGxlc3MgdGhhbiAyXi04MCkuXG4vLyBiaWdJbnQgIHN0cjJiaWdJbnQocyxiLG4sbSkgICAgLy9yZXR1cm4gYSBiaWdJbnQgZm9yIG51bWJlciByZXByZXNlbnRlZCBpbiBzdHJpbmcgcyBpbiBiYXNlIGIgd2l0aCBhdCBsZWFzdCBuIGJpdHMgYW5kIG0gYXJyYXkgZWxlbWVudHNcbi8vIGJpZ0ludCAgc3ViKHgseSkgICAgICAgICAgICAgICAvL3JldHVybiAoeC15KSBmb3IgYmlnSW50cyB4IGFuZCB5LiAgTmVnYXRpdmUgYW5zd2VycyB3aWxsIGJlIDJzIGNvbXBsZW1lbnRcbi8vIGJpZ0ludCAgdHJpbSh4LGspICAgICAgICAgICAgICAvL3JldHVybiBhIGNvcHkgb2YgeCB3aXRoIGV4YWN0bHkgayBsZWFkaW5nIHplcm8gZWxlbWVudHNcbi8vXG4vL1xuLy8gVGhlIGZvbGxvd2luZyBmdW5jdGlvbnMgZWFjaCBoYXZlIGEgbm9uLXVuZGVyc2NvcmVkIHZlcnNpb24sIHdoaWNoIG1vc3QgdXNlcnMgc2hvdWxkIGNhbGwgaW5zdGVhZC5cbi8vIFRoZXNlIGZ1bmN0aW9ucyBlYWNoIHdyaXRlIHRvIGEgc2luZ2xlIHBhcmFtZXRlciwgYW5kIHRoZSBjYWxsZXIgaXMgcmVzcG9uc2libGUgZm9yIGVuc3VyaW5nIHRoZSBhcnJheVxuLy8gcGFzc2VkIGluIGlzIGxhcmdlIGVub3VnaCB0byBob2xkIHRoZSByZXN1bHQuXG4vL1xuLy8gdm9pZCAgICBhZGRJbnRfKHgsbikgICAgICAgICAgLy9kbyB4PXgrbiB3aGVyZSB4IGlzIGEgYmlnSW50IGFuZCBuIGlzIGFuIGludGVnZXJcbi8vIHZvaWQgICAgYWRkXyh4LHkpICAgICAgICAgICAgIC8vZG8geD14K3kgZm9yIGJpZ0ludHMgeCBhbmQgeVxuLy8gdm9pZCAgICBjb3B5Xyh4LHkpICAgICAgICAgICAgLy9kbyB4PXkgb24gYmlnSW50cyB4IGFuZCB5XG4vLyB2b2lkICAgIGNvcHlJbnRfKHgsbikgICAgICAgICAvL2RvIHg9biBvbiBiaWdJbnQgeCBhbmQgaW50ZWdlciBuXG4vLyB2b2lkICAgIEdDRF8oeCx5KSAgICAgICAgICAgICAvL3NldCB4IHRvIHRoZSBncmVhdGVzdCBjb21tb24gZGl2aXNvciBvZiBiaWdJbnRzIHggYW5kIHksICh5IGlzIGRlc3Ryb3llZCkuICAoVGhpcyBuZXZlciBvdmVyZmxvd3MgaXRzIGFycmF5KS5cbi8vIGJvb2xlYW4gaW52ZXJzZU1vZF8oeCxuKSAgICAgIC8vZG8geD14KiooLTEpIG1vZCBuLCBmb3IgYmlnSW50cyB4IGFuZCBuLiBSZXR1cm5zIDEgKDApIGlmIGludmVyc2UgZG9lcyAoZG9lc24ndCkgZXhpc3Rcbi8vIHZvaWQgICAgbW9kXyh4LG4pICAgICAgICAgICAgIC8vZG8geD14IG1vZCBuIGZvciBiaWdJbnRzIHggYW5kIG4uIChUaGlzIG5ldmVyIG92ZXJmbG93cyBpdHMgYXJyYXkpLlxuLy8gdm9pZCAgICBtdWx0Xyh4LHkpICAgICAgICAgICAgLy9kbyB4PXgqeSBmb3IgYmlnSW50cyB4IGFuZCB5LlxuLy8gdm9pZCAgICBtdWx0TW9kXyh4LHksbikgICAgICAgLy9kbyB4PXgqeSAgbW9kIG4gZm9yIGJpZ0ludHMgeCx5LG4uXG4vLyB2b2lkICAgIHBvd01vZF8oeCx5LG4pICAgICAgICAvL2RvIHg9eCoqeSBtb2Qgbiwgd2hlcmUgeCx5LG4gYXJlIGJpZ0ludHMgKG4gaXMgb2RkKSBhbmQgKiogaXMgZXhwb25lbnRpYXRpb24uICAwKiowPTEuXG4vLyB2b2lkICAgIHJhbmRCaWdJbnRfKGIsbixzKSAgICAvL2RvIGIgPSBhbiBuLWJpdCByYW5kb20gQmlnSW50LiBpZiBzPTEsIHRoZW4gbnRoIGJpdCAobW9zdCBzaWduaWZpY2FudCBiaXQpIGlzIHNldCB0byAxLiBuPj0xLlxuLy8gdm9pZCAgICByYW5kVHJ1ZVByaW1lXyhhbnMsaykgLy9kbyBhbnMgPSBhIHJhbmRvbSBrLWJpdCB0cnVlIHJhbmRvbSBwcmltZSAobm90IGp1c3QgcHJvYmFibGUgcHJpbWUpIHdpdGggMSBpbiB0aGUgbXNiLlxuLy8gdm9pZCAgICBzdWJfKHgseSkgICAgICAgICAgICAgLy9kbyB4PXgteSBmb3IgYmlnSW50cyB4IGFuZCB5LiBOZWdhdGl2ZSBhbnN3ZXJzIHdpbGwgYmUgMnMgY29tcGxlbWVudC5cbi8vXG4vLyBUaGUgZm9sbG93aW5nIGZ1bmN0aW9ucyBkbyBOT1QgaGF2ZSBhIG5vbi11bmRlcnNjb3JlZCB2ZXJzaW9uLlxuLy8gVGhleSBlYWNoIHdyaXRlIGEgYmlnSW50IHJlc3VsdCB0byBvbmUgb3IgbW9yZSBwYXJhbWV0ZXJzLiAgVGhlIGNhbGxlciBpcyByZXNwb25zaWJsZSBmb3Jcbi8vIGVuc3VyaW5nIHRoZSBhcnJheXMgcGFzc2VkIGluIGFyZSBsYXJnZSBlbm91Z2ggdG8gaG9sZCB0aGUgcmVzdWx0cy5cbi8vXG4vLyB2b2lkIGFkZFNoaWZ0Xyh4LHkseXMpICAgICAgIC8vZG8geD14Kyh5PDwoeXMqYnBlKSlcbi8vIHZvaWQgY2FycnlfKHgpICAgICAgICAgICAgICAgLy9kbyBjYXJyaWVzIGFuZCBib3Jyb3dzIHNvIGVhY2ggZWxlbWVudCBvZiB0aGUgYmlnSW50IHggZml0cyBpbiBicGUgYml0cy5cbi8vIHZvaWQgZGl2aWRlXyh4LHkscSxyKSAgICAgICAgLy9kaXZpZGUgeCBieSB5IGdpdmluZyBxdW90aWVudCBxIGFuZCByZW1haW5kZXIgclxuLy8gaW50ICBkaXZJbnRfKHgsbikgICAgICAgICAgICAvL2RvIHg9Zmxvb3IoeC9uKSBmb3IgYmlnSW50IHggYW5kIGludGVnZXIgbiwgYW5kIHJldHVybiB0aGUgcmVtYWluZGVyLiAoVGhpcyBuZXZlciBvdmVyZmxvd3MgaXRzIGFycmF5KS5cbi8vIGludCAgZUdDRF8oeCx5LGQsYSxiKSAgICAgICAgLy9zZXRzIGEsYixkIHRvIHBvc2l0aXZlIGJpZ0ludHMgc3VjaCB0aGF0IGQgPSBHQ0RfKHgseSkgPSBhKngtYip5XG4vLyB2b2lkIGhhbHZlXyh4KSAgICAgICAgICAgICAgIC8vZG8geD1mbG9vcih8eHwvMikqc2duKHgpIGZvciBiaWdJbnQgeCBpbiAyJ3MgY29tcGxlbWVudC4gIChUaGlzIG5ldmVyIG92ZXJmbG93cyBpdHMgYXJyYXkpLlxuLy8gdm9pZCBsZWZ0U2hpZnRfKHgsbikgICAgICAgICAvL2xlZnQgc2hpZnQgYmlnSW50IHggYnkgbiBiaXRzLiAgbjxicGUuXG4vLyB2b2lkIGxpbkNvbWJfKHgseSxhLGIpICAgICAgIC8vZG8geD1hKngrYip5IGZvciBiaWdJbnRzIHggYW5kIHkgYW5kIGludGVnZXJzIGEgYW5kIGJcbi8vIHZvaWQgbGluQ29tYlNoaWZ0Xyh4LHksYix5cykgLy9kbyB4PXgrYiooeTw8KHlzKmJwZSkpIGZvciBiaWdJbnRzIHggYW5kIHksIGFuZCBpbnRlZ2VycyBiIGFuZCB5c1xuLy8gdm9pZCBtb250Xyh4LHksbixucCkgICAgICAgICAvL01vbnRnb21lcnkgbXVsdGlwbGljYXRpb24gKHNlZSBjb21tZW50cyB3aGVyZSB0aGUgZnVuY3Rpb24gaXMgZGVmaW5lZClcbi8vIHZvaWQgbXVsdEludF8oeCxuKSAgICAgICAgICAgLy9kbyB4PXgqbiB3aGVyZSB4IGlzIGEgYmlnSW50IGFuZCBuIGlzIGFuIGludGVnZXIuXG4vLyB2b2lkIHJpZ2h0U2hpZnRfKHgsbikgICAgICAgIC8vcmlnaHQgc2hpZnQgYmlnSW50IHggYnkgbiBiaXRzLiAgMCA8PSBuIDwgYnBlLiAoVGhpcyBuZXZlciBvdmVyZmxvd3MgaXRzIGFycmF5KS5cbi8vIHZvaWQgc3F1YXJlTW9kXyh4LG4pICAgICAgICAgLy9kbyB4PXgqeCAgbW9kIG4gZm9yIGJpZ0ludHMgeCxuXG4vLyB2b2lkIHN1YlNoaWZ0Xyh4LHkseXMpICAgICAgIC8vZG8geD14LSh5PDwoeXMqYnBlKSkuIE5lZ2F0aXZlIGFuc3dlcnMgd2lsbCBiZSAycyBjb21wbGVtZW50LlxuLy9cbi8vIFRoZSBmb2xsb3dpbmcgZnVuY3Rpb25zIGFyZSBiYXNlZCBvbiBhbGdvcml0aG1zIGZyb20gdGhlIF9IYW5kYm9vayBvZiBBcHBsaWVkIENyeXB0b2dyYXBoeV9cbi8vICAgIHBvd01vZF8oKSAgICAgICAgICAgPSBhbGdvcml0aG0gMTQuOTQsIE1vbnRnb21lcnkgZXhwb25lbnRpYXRpb25cbi8vICAgIGVHQ0RfLGludmVyc2VNb2RfKCkgPSBhbGdvcml0aG0gMTQuNjEsIEJpbmFyeSBleHRlbmRlZCBHQ0RfXG4vLyAgICBHQ0RfKCkgICAgICAgICAgICAgID0gYWxnb3JvdGhtIDE0LjU3LCBMZWhtZXIncyBhbGdvcml0aG1cbi8vICAgIG1vbnRfKCkgICAgICAgICAgICAgPSBhbGdvcml0aG0gMTQuMzYsIE1vbnRnb21lcnkgbXVsdGlwbGljYXRpb25cbi8vICAgIGRpdmlkZV8oKSAgICAgICAgICAgPSBhbGdvcml0aG0gMTQuMjAgIE11bHRpcGxlLXByZWNpc2lvbiBkaXZpc2lvblxuLy8gICAgc3F1YXJlTW9kXygpICAgICAgICA9IGFsZ29yaXRobSAxNC4xNiAgTXVsdGlwbGUtcHJlY2lzaW9uIHNxdWFyaW5nXG4vLyAgICByYW5kVHJ1ZVByaW1lXygpICAgID0gYWxnb3JpdGhtICA0LjYyLCBNYXVyZXIncyBhbGdvcml0aG1cbi8vICAgIG1pbGxlclJhYmluKCkgICAgICAgPSBhbGdvcml0aG0gIDQuMjQsIE1pbGxlci1SYWJpbiBhbGdvcml0aG1cbi8vXG4vLyBQcm9maWxpbmcgc2hvd3M6XG4vLyAgICAgcmFuZFRydWVQcmltZV8oKSBzcGVuZHM6XG4vLyAgICAgICAgIDEwJSBvZiBpdHMgdGltZSBpbiBjYWxscyB0byBwb3dNb2RfKClcbi8vICAgICAgICAgODUlIG9mIGl0cyB0aW1lIGluIGNhbGxzIHRvIG1pbGxlclJhYmluKClcbi8vICAgICBtaWxsZXJSYWJpbigpIHNwZW5kczpcbi8vICAgICAgICAgOTklIG9mIGl0cyB0aW1lIGluIGNhbGxzIHRvIHBvd01vZF8oKSAgIChhbHdheXMgd2l0aCBhIGJhc2Ugb2YgMilcbi8vICAgICBwb3dNb2RfKCkgc3BlbmRzOlxuLy8gICAgICAgICA5NCUgb2YgaXRzIHRpbWUgaW4gY2FsbHMgdG8gbW9udF8oKSAgKGFsbW9zdCBhbHdheXMgd2l0aCB4PT15KVxuLy9cbi8vIFRoaXMgc3VnZ2VzdHMgdGhlcmUgYXJlIHNldmVyYWwgd2F5cyB0byBzcGVlZCB1cCB0aGlzIGxpYnJhcnkgc2xpZ2h0bHk6XG4vLyAgICAgLSBjb252ZXJ0IHBvd01vZF8gdG8gdXNlIGEgTW9udGdvbWVyeSBmb3JtIG9mIGstYXJ5IHdpbmRvdyAob3IgbWF5YmUgYSBNb250Z29tZXJ5IGZvcm0gb2Ygc2xpZGluZyB3aW5kb3cpXG4vLyAgICAgICAgIC0tIHRoaXMgc2hvdWxkIGVzcGVjaWFsbHkgZm9jdXMgb24gYmVpbmcgZmFzdCB3aGVuIHJhaXNpbmcgMiB0byBhIHBvd2VyIG1vZCBuXG4vLyAgICAgLSBjb252ZXJ0IHJhbmRUcnVlUHJpbWVfKCkgdG8gdXNlIGEgbWluaW11bSByIG9mIDEvMyBpbnN0ZWFkIG9mIDEvMiB3aXRoIHRoZSBhcHByb3ByaWF0ZSBjaGFuZ2UgdG8gdGhlIHRlc3Rcbi8vICAgICAtIHR1bmUgdGhlIHBhcmFtZXRlcnMgaW4gcmFuZFRydWVQcmltZV8oKSwgaW5jbHVkaW5nIGMsIG0sIGFuZCByZWNMaW1pdFxuLy8gICAgIC0gc3BlZWQgdXAgdGhlIHNpbmdsZSBsb29wIGluIG1vbnRfKCkgdGhhdCB0YWtlcyA5NSUgb2YgdGhlIHJ1bnRpbWUsIHBlcmhhcHMgYnkgcmVkdWNpbmcgY2hlY2tpbmdcbi8vICAgICAgIHdpdGhpbiB0aGUgbG9vcCB3aGVuIGFsbCB0aGUgcGFyYW1ldGVycyBhcmUgdGhlIHNhbWUgbGVuZ3RoLlxuLy9cbi8vIFRoZXJlIGFyZSBzZXZlcmFsIGlkZWFzIHRoYXQgbG9vayBsaWtlIHRoZXkgd291bGRuJ3QgaGVscCBtdWNoIGF0IGFsbDpcbi8vICAgICAtIHJlcGxhY2luZyB0cmlhbCBkaXZpc2lvbiBpbiByYW5kVHJ1ZVByaW1lXygpIHdpdGggYSBzaWV2ZSAodGhhdCBzcGVlZHMgdXAgc29tZXRoaW5nIHRha2luZyBhbG1vc3Qgbm8gdGltZSBhbnl3YXkpXG4vLyAgICAgLSBpbmNyZWFzZSBicGUgZnJvbSAxNSB0byAzMCAodGhhdCB3b3VsZCBoZWxwIGlmIHdlIGhhZCBhIDMyKjMyLT42NCBtdWx0aXBsaWVyLCBidXQgbm90IHdpdGggSmF2YVNjcmlwdCdzIDMyKjMyLT4zMilcbi8vICAgICAtIHNwZWVkaW5nIHVwIG1vbnRfKHgseSxuLG5wKSB3aGVuIHg9PXkgYnkgZG9pbmcgYSBub24tbW9kdWxhciwgbm9uLU1vbnRnb21lcnkgc3F1YXJlXG4vLyAgICAgICBmb2xsb3dlZCBieSBhIE1vbnRnb21lcnkgcmVkdWN0aW9uLiAgVGhlIGludGVybWVkaWF0ZSBhbnN3ZXIgd2lsbCBiZSB0d2ljZSBhcyBsb25nIGFzIHgsIHNvIHRoYXRcbi8vICAgICAgIG1ldGhvZCB3b3VsZCBiZSBzbG93ZXIuICBUaGlzIGlzIHVuZm9ydHVuYXRlIGJlY2F1c2UgdGhlIGNvZGUgY3VycmVudGx5IHNwZW5kcyBhbG1vc3QgYWxsIG9mIGl0cyB0aW1lXG4vLyAgICAgICBkb2luZyBtb250Xyh4LHgsLi4uKSwgYm90aCBmb3IgcmFuZFRydWVQcmltZV8oKSBhbmQgcG93TW9kXygpLiAgQSBmYXN0ZXIgbWV0aG9kIGZvciBNb250Z29tZXJ5IHNxdWFyaW5nXG4vLyAgICAgICB3b3VsZCBoYXZlIGEgbGFyZ2UgaW1wYWN0IG9uIHRoZSBzcGVlZCBvZiByYW5kVHJ1ZVByaW1lXygpIGFuZCBwb3dNb2RfKCkuICBIQUMgaGFzIGEgY291cGxlIG9mIHBvb3JseS13b3JkZWRcbi8vICAgICAgIHNlbnRlbmNlcyB0aGF0IHNlZW0gdG8gaW1wbHkgaXQncyBmYXN0ZXIgdG8gZG8gYSBub24tbW9kdWxhciBzcXVhcmUgZm9sbG93ZWQgYnkgYSBzaW5nbGVcbi8vICAgICAgIE1vbnRnb21lcnkgcmVkdWN0aW9uLCBidXQgdGhhdCdzIG9idmlvdXNseSB3cm9uZy5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuLy9nbG9iYWxzXG5icGU9MDsgICAgICAgICAvL2JpdHMgc3RvcmVkIHBlciBhcnJheSBlbGVtZW50XG5tYXNrPTA7ICAgICAgICAvL0FORCB0aGlzIHdpdGggYW4gYXJyYXkgZWxlbWVudCB0byBjaG9wIGl0IGRvd24gdG8gYnBlIGJpdHNcbnJhZGl4PW1hc2srMTsgIC8vZXF1YWxzIDJeYnBlLiAgQSBzaW5nbGUgMSBiaXQgdG8gdGhlIGxlZnQgb2YgdGhlIGxhc3QgYml0IG9mIG1hc2suXG5cbi8vdGhlIGRpZ2l0cyBmb3IgY29udmVydGluZyB0byBkaWZmZXJlbnQgYmFzZXNcbmRpZ2l0c1N0cj0nMDEyMzQ1Njc4OUFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXpfPSFAIyQlXiYqKClbXXt9fDs6LC48Pi8/YH4gXFxcXFxcJ1xcXCIrLSc7XG5cbi8vaW5pdGlhbGl6ZSB0aGUgZ2xvYmFsIHZhcmlhYmxlc1xuZm9yIChicGU9MDsgKDE8PChicGUrMSkpID4gKDE8PGJwZSk7IGJwZSsrKTsgIC8vYnBlPW51bWJlciBvZiBiaXRzIGluIHRoZSBtYW50aXNzYSBvbiB0aGlzIHBsYXRmb3JtXG5icGU+Pj0xOyAgICAgICAgICAgICAgICAgICAvL2JwZT1udW1iZXIgb2YgYml0cyBpbiBvbmUgZWxlbWVudCBvZiB0aGUgYXJyYXkgcmVwcmVzZW50aW5nIHRoZSBiaWdJbnRcbm1hc2s9KDE8PGJwZSktMTsgICAgICAgICAgIC8vQU5EIHRoZSBtYXNrIHdpdGggYW4gaW50ZWdlciB0byBnZXQgaXRzIGJwZSBsZWFzdCBzaWduaWZpY2FudCBiaXRzXG5yYWRpeD1tYXNrKzE7ICAgICAgICAgICAgICAvLzJeYnBlLiAgYSBzaW5nbGUgMSBiaXQgdG8gdGhlIGxlZnQgb2YgdGhlIGZpcnN0IGJpdCBvZiBtYXNrXG5vbmU9aW50MmJpZ0ludCgxLDEsMSk7ICAgICAvL2NvbnN0YW50IHVzZWQgaW4gcG93TW9kXygpXG5cbi8vdGhlIGZvbGxvd2luZyBnbG9iYWwgdmFyaWFibGVzIGFyZSBzY3JhdGNocGFkIG1lbW9yeSB0b1xuLy9yZWR1Y2UgZHluYW1pYyBtZW1vcnkgYWxsb2NhdGlvbiBpbiB0aGUgaW5uZXIgbG9vcFxudD1uZXcgQXJyYXkoMCk7XG5zcz10OyAgICAgICAvL3VzZWQgaW4gbXVsdF8oKVxuczA9dDsgICAgICAgLy91c2VkIGluIG11bHRNb2RfKCksIHNxdWFyZU1vZF8oKVxuczE9dDsgICAgICAgLy91c2VkIGluIHBvd01vZF8oKSwgbXVsdE1vZF8oKSwgc3F1YXJlTW9kXygpXG5zMj10OyAgICAgICAvL3VzZWQgaW4gcG93TW9kXygpLCBtdWx0TW9kXygpXG5zMz10OyAgICAgICAvL3VzZWQgaW4gcG93TW9kXygpXG5zND10OyBzNT10OyAvL3VzZWQgaW4gbW9kXygpXG5zNj10OyAgICAgICAvL3VzZWQgaW4gYmlnSW50MnN0cigpXG5zNz10OyAgICAgICAvL3VzZWQgaW4gcG93TW9kXygpXG5UPXQ7ICAgICAgICAvL3VzZWQgaW4gR0NEXygpXG5zYT10OyAgICAgICAvL3VzZWQgaW4gbW9udF8oKVxubXJfeDE9dDsgbXJfcj10OyBtcl9hPXQ7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL3VzZWQgaW4gbWlsbGVyUmFiaW4oKVxuZWdfdj10OyBlZ191PXQ7IGVnX0E9dDsgZWdfQj10OyBlZ19DPXQ7IGVnX0Q9dDsgICAgICAgICAgICAgICAvL3VzZWQgaW4gZUdDRF8oKSwgaW52ZXJzZU1vZF8oKVxubWRfcTE9dDsgbWRfcTI9dDsgbWRfcTM9dDsgbWRfcj10OyBtZF9yMT10OyBtZF9yMj10OyBtZF90dD10OyAvL3VzZWQgaW4gbW9kXygpXG5cbnByaW1lcz10OyBwb3dzPXQ7IHNfaT10OyBzX2kyPXQ7IHNfUj10OyBzX3JtPXQ7IHNfcT10OyBzX24xPXQ7XG4gIHNfYT10OyBzX3IyPXQ7IHNfbj10OyBzX2I9dDsgc19kPXQ7IHNfeDE9dDsgc194Mj10LCBzX2FhPXQ7IC8vdXNlZCBpbiByYW5kVHJ1ZVByaW1lXygpXG5cbnJwcHJiPXQ7IC8vdXNlZCBpbiByYW5kUHJvYlByaW1lUm91bmRzKCkgKHdoaWNoIGFsc28gdXNlcyBcInByaW1lc1wiKVxuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cblxuLy9yZXR1cm4gYXJyYXkgb2YgYWxsIHByaW1lcyBsZXNzIHRoYW4gaW50ZWdlciBuXG5mdW5jdGlvbiBmaW5kUHJpbWVzKG4pIHtcbiAgdmFyIGkscyxwLGFucztcbiAgcz1uZXcgQXJyYXkobik7XG4gIGZvciAoaT0wO2k8bjtpKyspXG4gICAgc1tpXT0wO1xuICBzWzBdPTI7XG4gIHA9MDsgICAgLy9maXJzdCBwIGVsZW1lbnRzIG9mIHMgYXJlIHByaW1lcywgdGhlIHJlc3QgYXJlIGEgc2lldmVcbiAgZm9yKDtzW3BdPG47KSB7ICAgICAgICAgICAgICAgICAgLy9zW3BdIGlzIHRoZSBwdGggcHJpbWVcbiAgICBmb3IoaT1zW3BdKnNbcF07IGk8bjsgaSs9c1twXSkgLy9tYXJrIG11bHRpcGxlcyBvZiBzW3BdXG4gICAgICBzW2ldPTE7XG4gICAgcCsrO1xuICAgIHNbcF09c1twLTFdKzE7XG4gICAgZm9yKDsgc1twXTxuICYmIHNbc1twXV07IHNbcF0rKyk7IC8vZmluZCBuZXh0IHByaW1lICh3aGVyZSBzW3BdPT0wKVxuICB9XG4gIGFucz1uZXcgQXJyYXkocCk7XG4gIGZvcihpPTA7aTxwO2krKylcbiAgICBhbnNbaV09c1tpXTtcbiAgcmV0dXJuIGFucztcbn1cblxuXG4vL2RvZXMgYSBzaW5nbGUgcm91bmQgb2YgTWlsbGVyLVJhYmluIGJhc2UgYiBjb25zaWRlciB4IHRvIGJlIGEgcG9zc2libGUgcHJpbWU/XG4vL3ggaXMgYSBiaWdJbnQsIGFuZCBiIGlzIGFuIGludGVnZXIsIHdpdGggYjx4XG5mdW5jdGlvbiBtaWxsZXJSYWJpbkludCh4LGIpIHtcbiAgaWYgKG1yX3gxLmxlbmd0aCE9eC5sZW5ndGgpIHtcbiAgICBtcl94MT1kdXAoeCk7XG4gICAgbXJfcj1kdXAoeCk7XG4gICAgbXJfYT1kdXAoeCk7XG4gIH1cblxuICBjb3B5SW50Xyhtcl9hLGIpO1xuICByZXR1cm4gbWlsbGVyUmFiaW4oeCxtcl9hKTtcbn1cblxuLy9kb2VzIGEgc2luZ2xlIHJvdW5kIG9mIE1pbGxlci1SYWJpbiBiYXNlIGIgY29uc2lkZXIgeCB0byBiZSBhIHBvc3NpYmxlIHByaW1lP1xuLy94IGFuZCBiIGFyZSBiaWdJbnRzIHdpdGggYjx4XG5mdW5jdGlvbiBtaWxsZXJSYWJpbih4LGIpIHtcbiAgdmFyIGksaixrLHM7XG5cbiAgaWYgKG1yX3gxLmxlbmd0aCE9eC5sZW5ndGgpIHtcbiAgICBtcl94MT1kdXAoeCk7XG4gICAgbXJfcj1kdXAoeCk7XG4gICAgbXJfYT1kdXAoeCk7XG4gIH1cblxuICBjb3B5Xyhtcl9hLGIpO1xuICBjb3B5Xyhtcl9yLHgpO1xuICBjb3B5Xyhtcl94MSx4KTtcblxuICBhZGRJbnRfKG1yX3IsLTEpO1xuICBhZGRJbnRfKG1yX3gxLC0xKTtcblxuICAvL3M9dGhlIGhpZ2hlc3QgcG93ZXIgb2YgdHdvIHRoYXQgZGl2aWRlcyBtcl9yXG4gIGs9MDtcbiAgZm9yIChpPTA7aTxtcl9yLmxlbmd0aDtpKyspXG4gICAgZm9yIChqPTE7ajxtYXNrO2o8PD0xKVxuICAgICAgaWYgKHhbaV0gJiBqKSB7XG4gICAgICAgIHM9KGs8bXJfci5sZW5ndGgrYnBlID8gayA6IDApO1xuICAgICAgICAgaT1tcl9yLmxlbmd0aDtcbiAgICAgICAgIGo9bWFzaztcbiAgICAgIH0gZWxzZVxuICAgICAgICBrKys7XG5cbiAgaWYgKHMpXG4gICAgcmlnaHRTaGlmdF8obXJfcixzKTtcblxuICBwb3dNb2RfKG1yX2EsbXJfcix4KTtcblxuICBpZiAoIWVxdWFsc0ludChtcl9hLDEpICYmICFlcXVhbHMobXJfYSxtcl94MSkpIHtcbiAgICBqPTE7XG4gICAgd2hpbGUgKGo8PXMtMSAmJiAhZXF1YWxzKG1yX2EsbXJfeDEpKSB7XG4gICAgICBzcXVhcmVNb2RfKG1yX2EseCk7XG4gICAgICBpZiAoZXF1YWxzSW50KG1yX2EsMSkpIHtcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgICB9XG4gICAgICBqKys7XG4gICAgfVxuICAgIGlmICghZXF1YWxzKG1yX2EsbXJfeDEpKSB7XG4gICAgICByZXR1cm4gMDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIDE7XG59XG5cbi8vcmV0dXJucyBob3cgbWFueSBiaXRzIGxvbmcgdGhlIGJpZ0ludCBpcywgbm90IGNvdW50aW5nIGxlYWRpbmcgemVyb3MuXG5mdW5jdGlvbiBiaXRTaXplKHgpIHtcbiAgdmFyIGoseix3O1xuICBmb3IgKGo9eC5sZW5ndGgtMTsgKHhbal09PTApICYmIChqPjApOyBqLS0pO1xuICBmb3IgKHo9MCx3PXhbal07IHc7ICh3Pj49MSkseisrKTtcbiAgeis9YnBlKmo7XG4gIHJldHVybiB6O1xufVxuXG4vL3JldHVybiBhIGNvcHkgb2YgeCB3aXRoIGF0IGxlYXN0IG4gZWxlbWVudHMsIGFkZGluZyBsZWFkaW5nIHplcm9zIGlmIG5lZWRlZFxuZnVuY3Rpb24gZXhwYW5kKHgsbikge1xuICB2YXIgYW5zPWludDJiaWdJbnQoMCwoeC5sZW5ndGg+biA/IHgubGVuZ3RoIDogbikqYnBlLDApO1xuICBjb3B5XyhhbnMseCk7XG4gIHJldHVybiBhbnM7XG59XG5cbi8vcmV0dXJuIGEgay1iaXQgdHJ1ZSByYW5kb20gcHJpbWUgdXNpbmcgTWF1cmVyJ3MgYWxnb3JpdGhtLlxuZnVuY3Rpb24gcmFuZFRydWVQcmltZShrKSB7XG4gIHZhciBhbnM9aW50MmJpZ0ludCgwLGssMCk7XG4gIHJhbmRUcnVlUHJpbWVfKGFucyxrKTtcbiAgcmV0dXJuIHRyaW0oYW5zLDEpO1xufVxuXG4vL3JldHVybiBhIGstYml0IHJhbmRvbSBwcm9iYWJsZSBwcmltZSB3aXRoIHByb2JhYmlsaXR5IG9mIGVycm9yIDwgMl4tODBcbmZ1bmN0aW9uIHJhbmRQcm9iUHJpbWUoaykge1xuICBpZiAoaz49NjAwKSByZXR1cm4gcmFuZFByb2JQcmltZVJvdW5kcyhrLDIpOyAvL251bWJlcnMgZnJvbSBIQUMgdGFibGUgNC4zXG4gIGlmIChrPj01NTApIHJldHVybiByYW5kUHJvYlByaW1lUm91bmRzKGssNCk7XG4gIGlmIChrPj01MDApIHJldHVybiByYW5kUHJvYlByaW1lUm91bmRzKGssNSk7XG4gIGlmIChrPj00MDApIHJldHVybiByYW5kUHJvYlByaW1lUm91bmRzKGssNik7XG4gIGlmIChrPj0zNTApIHJldHVybiByYW5kUHJvYlByaW1lUm91bmRzKGssNyk7XG4gIGlmIChrPj0zMDApIHJldHVybiByYW5kUHJvYlByaW1lUm91bmRzKGssOSk7XG4gIGlmIChrPj0yNTApIHJldHVybiByYW5kUHJvYlByaW1lUm91bmRzKGssMTIpOyAvL251bWJlcnMgZnJvbSBIQUMgdGFibGUgNC40XG4gIGlmIChrPj0yMDApIHJldHVybiByYW5kUHJvYlByaW1lUm91bmRzKGssMTUpO1xuICBpZiAoaz49MTUwKSByZXR1cm4gcmFuZFByb2JQcmltZVJvdW5kcyhrLDE4KTtcbiAgaWYgKGs+PTEwMCkgcmV0dXJuIHJhbmRQcm9iUHJpbWVSb3VuZHMoaywyNyk7XG4gICAgICAgICAgICAgIHJldHVybiByYW5kUHJvYlByaW1lUm91bmRzKGssNDApOyAvL251bWJlciBmcm9tIEhBQyByZW1hcmsgNC4yNiAob25seSBhbiBlc3RpbWF0ZSlcbn1cblxuLy9yZXR1cm4gYSBrLWJpdCBwcm9iYWJsZSByYW5kb20gcHJpbWUgdXNpbmcgbiByb3VuZHMgb2YgTWlsbGVyIFJhYmluIChhZnRlciB0cmlhbCBkaXZpc2lvbiB3aXRoIHNtYWxsIHByaW1lcylcbmZ1bmN0aW9uIHJhbmRQcm9iUHJpbWVSb3VuZHMoayxuKSB7XG4gIHZhciBhbnMsIGksIGRpdmlzaWJsZSwgQjtcbiAgQj0zMDAwMDsgIC8vQiBpcyBsYXJnZXN0IHByaW1lIHRvIHVzZSBpbiB0cmlhbCBkaXZpc2lvblxuICBhbnM9aW50MmJpZ0ludCgwLGssMCk7XG5cbiAgLy9vcHRpbWl6YXRpb246IHRyeSBsYXJnZXIgYW5kIHNtYWxsZXIgQiB0byBmaW5kIHRoZSBiZXN0IGxpbWl0LlxuXG4gIGlmIChwcmltZXMubGVuZ3RoPT0wKVxuICAgIHByaW1lcz1maW5kUHJpbWVzKDMwMDAwKTsgIC8vY2hlY2sgZm9yIGRpdmlzaWJpbGl0eSBieSBwcmltZXMgPD0zMDAwMFxuXG4gIGlmIChycHByYi5sZW5ndGghPWFucy5sZW5ndGgpXG4gICAgcnBwcmI9ZHVwKGFucyk7XG5cbiAgZm9yICg7OykgeyAvL2tlZXAgdHJ5aW5nIHJhbmRvbSB2YWx1ZXMgZm9yIGFucyB1bnRpbCBvbmUgYXBwZWFycyB0byBiZSBwcmltZVxuICAgIC8vb3B0aW1pemF0aW9uOiBwaWNrIGEgcmFuZG9tIG51bWJlciB0aW1lcyBMPTIqMyo1Ki4uLipwLCBwbHVzIGFcbiAgICAvLyAgIHJhbmRvbSBlbGVtZW50IG9mIHRoZSBsaXN0IG9mIGFsbCBudW1iZXJzIGluIFswLEwpIG5vdCBkaXZpc2libGUgYnkgYW55IHByaW1lIHVwIHRvIHAuXG4gICAgLy8gICBUaGlzIGNhbiByZWR1Y2UgdGhlIGFtb3VudCBvZiByYW5kb20gbnVtYmVyIGdlbmVyYXRpb24uXG5cbiAgICByYW5kQmlnSW50XyhhbnMsaywwKTsgLy9hbnMgPSBhIHJhbmRvbSBvZGQgbnVtYmVyIHRvIGNoZWNrXG4gICAgYW5zWzBdIHw9IDE7XG4gICAgZGl2aXNpYmxlPTA7XG5cbiAgICAvL2NoZWNrIGFucyBmb3IgZGl2aXNpYmlsaXR5IGJ5IHNtYWxsIHByaW1lcyB1cCB0byBCXG4gICAgZm9yIChpPTA7IChpPHByaW1lcy5sZW5ndGgpICYmIChwcmltZXNbaV08PUIpOyBpKyspXG4gICAgICBpZiAobW9kSW50KGFucyxwcmltZXNbaV0pPT0wICYmICFlcXVhbHNJbnQoYW5zLHByaW1lc1tpXSkpIHtcbiAgICAgICAgZGl2aXNpYmxlPTE7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgLy9vcHRpbWl6YXRpb246IGNoYW5nZSBtaWxsZXJSYWJpbiBzbyB0aGUgYmFzZSBjYW4gYmUgYmlnZ2VyIHRoYW4gdGhlIG51bWJlciBiZWluZyBjaGVja2VkLCB0aGVuIGVsaW1pbmF0ZSB0aGUgd2hpbGUgaGVyZS5cblxuICAgIC8vZG8gbiByb3VuZHMgb2YgTWlsbGVyIFJhYmluLCB3aXRoIHJhbmRvbSBiYXNlcyBsZXNzIHRoYW4gYW5zXG4gICAgZm9yIChpPTA7IGk8biAmJiAhZGl2aXNpYmxlOyBpKyspIHtcbiAgICAgIHJhbmRCaWdJbnRfKHJwcHJiLGssMCk7XG4gICAgICB3aGlsZSghZ3JlYXRlcihhbnMscnBwcmIpKSAvL3BpY2sgYSByYW5kb20gcnBwcmIgdGhhdCdzIDwgYW5zXG4gICAgICAgIHJhbmRCaWdJbnRfKHJwcHJiLGssMCk7XG4gICAgICBpZiAoIW1pbGxlclJhYmluKGFucyxycHByYikpXG4gICAgICAgIGRpdmlzaWJsZT0xO1xuICAgIH1cblxuICAgIGlmKCFkaXZpc2libGUpXG4gICAgICByZXR1cm4gYW5zO1xuICB9XG59XG5cbi8vcmV0dXJuIGEgbmV3IGJpZ0ludCBlcXVhbCB0byAoeCBtb2QgbikgZm9yIGJpZ0ludHMgeCBhbmQgbi5cbmZ1bmN0aW9uIG1vZCh4LG4pIHtcbiAgdmFyIGFucz1kdXAoeCk7XG4gIG1vZF8oYW5zLG4pO1xuICByZXR1cm4gdHJpbShhbnMsMSk7XG59XG5cbi8vcmV0dXJuICh4K24pIHdoZXJlIHggaXMgYSBiaWdJbnQgYW5kIG4gaXMgYW4gaW50ZWdlci5cbmZ1bmN0aW9uIGFkZEludCh4LG4pIHtcbiAgdmFyIGFucz1leHBhbmQoeCx4Lmxlbmd0aCsxKTtcbiAgYWRkSW50XyhhbnMsbik7XG4gIHJldHVybiB0cmltKGFucywxKTtcbn1cblxuLy9yZXR1cm4geCp5IGZvciBiaWdJbnRzIHggYW5kIHkuIFRoaXMgaXMgZmFzdGVyIHdoZW4geTx4LlxuZnVuY3Rpb24gbXVsdCh4LHkpIHtcbiAgdmFyIGFucz1leHBhbmQoeCx4Lmxlbmd0aCt5Lmxlbmd0aCk7XG4gIG11bHRfKGFucyx5KTtcbiAgcmV0dXJuIHRyaW0oYW5zLDEpO1xufVxuXG4vL3JldHVybiAoeCoqeSBtb2Qgbikgd2hlcmUgeCx5LG4gYXJlIGJpZ0ludHMgYW5kICoqIGlzIGV4cG9uZW50aWF0aW9uLiAgMCoqMD0xLiBGYXN0ZXIgZm9yIG9kZCBuLlxuZnVuY3Rpb24gcG93TW9kKHgseSxuKSB7XG4gIHZhciBhbnM9ZXhwYW5kKHgsbi5sZW5ndGgpO1xuICBwb3dNb2RfKGFucyx0cmltKHksMiksdHJpbShuLDIpLDApOyAgLy90aGlzIHNob3VsZCB3b3JrIHdpdGhvdXQgdGhlIHRyaW0sIGJ1dCBkb2Vzbid0XG4gIHJldHVybiB0cmltKGFucywxKTtcbn1cblxuLy9yZXR1cm4gKHgteSkgZm9yIGJpZ0ludHMgeCBhbmQgeS4gIE5lZ2F0aXZlIGFuc3dlcnMgd2lsbCBiZSAycyBjb21wbGVtZW50XG5mdW5jdGlvbiBzdWIoeCx5KSB7XG4gIHZhciBhbnM9ZXhwYW5kKHgsKHgubGVuZ3RoPnkubGVuZ3RoID8geC5sZW5ndGgrMSA6IHkubGVuZ3RoKzEpKTtcbiAgc3ViXyhhbnMseSk7XG4gIHJldHVybiB0cmltKGFucywxKTtcbn1cblxuLy9yZXR1cm4gKHgreSkgZm9yIGJpZ0ludHMgeCBhbmQgeS5cbmZ1bmN0aW9uIGFkZCh4LHkpIHtcbiAgdmFyIGFucz1leHBhbmQoeCwoeC5sZW5ndGg+eS5sZW5ndGggPyB4Lmxlbmd0aCsxIDogeS5sZW5ndGgrMSkpO1xuICBhZGRfKGFucyx5KTtcbiAgcmV0dXJuIHRyaW0oYW5zLDEpO1xufVxuXG4vL3JldHVybiAoeCoqKC0xKSBtb2QgbikgZm9yIGJpZ0ludHMgeCBhbmQgbi4gIElmIG5vIGludmVyc2UgZXhpc3RzLCBpdCByZXR1cm5zIG51bGxcbmZ1bmN0aW9uIGludmVyc2VNb2QoeCxuKSB7XG4gIHZhciBhbnM9ZXhwYW5kKHgsbi5sZW5ndGgpO1xuICB2YXIgcztcbiAgcz1pbnZlcnNlTW9kXyhhbnMsbik7XG4gIHJldHVybiBzID8gdHJpbShhbnMsMSkgOiBudWxsO1xufVxuXG4vL3JldHVybiAoeCp5IG1vZCBuKSBmb3IgYmlnSW50cyB4LHksbi4gIEZvciBncmVhdGVyIHNwZWVkLCBsZXQgeTx4LlxuZnVuY3Rpb24gbXVsdE1vZCh4LHksbikge1xuICB2YXIgYW5zPWV4cGFuZCh4LG4ubGVuZ3RoKTtcbiAgbXVsdE1vZF8oYW5zLHksbik7XG4gIHJldHVybiB0cmltKGFucywxKTtcbn1cblxuLy9nZW5lcmF0ZSBhIGstYml0IHRydWUgcmFuZG9tIHByaW1lIHVzaW5nIE1hdXJlcidzIGFsZ29yaXRobSxcbi8vYW5kIHB1dCBpdCBpbnRvIGFucy4gIFRoZSBiaWdJbnQgYW5zIG11c3QgYmUgbGFyZ2UgZW5vdWdoIHRvIGhvbGQgaXQuXG5mdW5jdGlvbiByYW5kVHJ1ZVByaW1lXyhhbnMsaykge1xuICB2YXIgYyxtLHBtLGRkLGoscixCLGRpdmlzaWJsZSx6LHp6LHJlY1NpemU7XG5cbiAgaWYgKHByaW1lcy5sZW5ndGg9PTApXG4gICAgcHJpbWVzPWZpbmRQcmltZXMoMzAwMDApOyAgLy9jaGVjayBmb3IgZGl2aXNpYmlsaXR5IGJ5IHByaW1lcyA8PTMwMDAwXG5cbiAgaWYgKHBvd3MubGVuZ3RoPT0wKSB7XG4gICAgcG93cz1uZXcgQXJyYXkoNTEyKTtcbiAgICBmb3IgKGo9MDtqPDUxMjtqKyspIHtcbiAgICAgIHBvd3Nbal09TWF0aC5wb3coMixqLzUxMS4tMS4pO1xuICAgIH1cbiAgfVxuXG4gIC8vYyBhbmQgbSBzaG91bGQgYmUgdHVuZWQgZm9yIGEgcGFydGljdWxhciBtYWNoaW5lIGFuZCB2YWx1ZSBvZiBrLCB0byBtYXhpbWl6ZSBzcGVlZFxuICBjPTAuMTsgIC8vYz0wLjEgaW4gSEFDXG4gIG09MjA7ICAgLy9nZW5lcmF0ZSB0aGlzIGstYml0IG51bWJlciBieSBmaXJzdCByZWN1cnNpdmVseSBnZW5lcmF0aW5nIGEgbnVtYmVyIHRoYXQgaGFzIGJldHdlZW4gay8yIGFuZCBrLW0gYml0c1xuICByZWNMaW1pdD0yMDsgLy9zdG9wIHJlY3Vyc2lvbiB3aGVuIGsgPD1yZWNMaW1pdC4gIE11c3QgaGF2ZSByZWNMaW1pdCA+PSAyXG5cbiAgaWYgKHNfaTIubGVuZ3RoIT1hbnMubGVuZ3RoKSB7XG4gICAgc19pMj1kdXAoYW5zKTtcbiAgICBzX1IgPWR1cChhbnMpO1xuICAgIHNfbjE9ZHVwKGFucyk7XG4gICAgc19yMj1kdXAoYW5zKTtcbiAgICBzX2QgPWR1cChhbnMpO1xuICAgIHNfeDE9ZHVwKGFucyk7XG4gICAgc194Mj1kdXAoYW5zKTtcbiAgICBzX2IgPWR1cChhbnMpO1xuICAgIHNfbiA9ZHVwKGFucyk7XG4gICAgc19pID1kdXAoYW5zKTtcbiAgICBzX3JtPWR1cChhbnMpO1xuICAgIHNfcSA9ZHVwKGFucyk7XG4gICAgc19hID1kdXAoYW5zKTtcbiAgICBzX2FhPWR1cChhbnMpO1xuICB9XG5cbiAgaWYgKGsgPD0gcmVjTGltaXQpIHsgIC8vZ2VuZXJhdGUgc21hbGwgcmFuZG9tIHByaW1lcyBieSB0cmlhbCBkaXZpc2lvbiB1cCB0byBpdHMgc3F1YXJlIHJvb3RcbiAgICBwbT0oMTw8KChrKzIpPj4xKSktMTsgLy9wbSBpcyBiaW5hcnkgbnVtYmVyIHdpdGggYWxsIG9uZXMsIGp1c3Qgb3ZlciBzcXJ0KDJeaylcbiAgICBjb3B5SW50XyhhbnMsMCk7XG4gICAgZm9yIChkZD0xO2RkOykge1xuICAgICAgZGQ9MDtcbiAgICAgIGFuc1swXT0gMSB8ICgxPDwoay0xKSkgfCBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkqKDE8PGspKTsgIC8vcmFuZG9tLCBrLWJpdCwgb2RkIGludGVnZXIsIHdpdGggbXNiIDFcbiAgICAgIGZvciAoaj0xOyhqPHByaW1lcy5sZW5ndGgpICYmICgocHJpbWVzW2pdJnBtKT09cHJpbWVzW2pdKTtqKyspIHsgLy90cmlhbCBkaXZpc2lvbiBieSBhbGwgcHJpbWVzIDMuLi5zcXJ0KDJeaylcbiAgICAgICAgaWYgKDA9PShhbnNbMF0lcHJpbWVzW2pdKSkge1xuICAgICAgICAgIGRkPTE7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgY2FycnlfKGFucyk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgQj1jKmsqazsgICAgLy90cnkgc21hbGwgcHJpbWVzIHVwIHRvIEIgKG9yIGFsbCB0aGUgcHJpbWVzW10gYXJyYXkgaWYgdGhlIGxhcmdlc3QgaXMgbGVzcyB0aGFuIEIpLlxuICBpZiAoaz4yKm0pICAvL2dlbmVyYXRlIHRoaXMgay1iaXQgbnVtYmVyIGJ5IGZpcnN0IHJlY3Vyc2l2ZWx5IGdlbmVyYXRpbmcgYSBudW1iZXIgdGhhdCBoYXMgYmV0d2VlbiBrLzIgYW5kIGstbSBiaXRzXG4gICAgZm9yIChyPTE7IGstaypyPD1tOyApXG4gICAgICByPXBvd3NbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpKjUxMildOyAgIC8vcj1NYXRoLnBvdygyLE1hdGgucmFuZG9tKCktMSk7XG4gIGVsc2VcbiAgICByPS41O1xuXG4gIC8vc2ltdWxhdGlvbiBzdWdnZXN0cyB0aGUgbW9yZSBjb21wbGV4IGFsZ29yaXRobSB1c2luZyByPS4zMzMgaXMgb25seSBzbGlnaHRseSBmYXN0ZXIuXG5cbiAgcmVjU2l6ZT1NYXRoLmZsb29yKHIqaykrMTtcblxuICByYW5kVHJ1ZVByaW1lXyhzX3EscmVjU2l6ZSk7XG4gIGNvcHlJbnRfKHNfaTIsMCk7XG4gIHNfaTJbTWF0aC5mbG9vcigoay0yKS9icGUpXSB8PSAoMTw8KChrLTIpJWJwZSkpOyAgIC8vc19pMj0yXihrLTIpXG4gIGRpdmlkZV8oc19pMixzX3Esc19pLHNfcm0pOyAgICAgICAgICAgICAgICAgICAgICAgIC8vc19pPWZsb29yKCgyXihrLTEpKS8oMnEpKVxuXG4gIHo9Yml0U2l6ZShzX2kpO1xuXG4gIGZvciAoOzspIHtcbiAgICBmb3IgKDs7KSB7ICAvL2dlbmVyYXRlIHotYml0IG51bWJlcnMgdW50aWwgb25lIGZhbGxzIGluIHRoZSByYW5nZSBbMCxzX2ktMV1cbiAgICAgIHJhbmRCaWdJbnRfKHNfUix6LDApO1xuICAgICAgaWYgKGdyZWF0ZXIoc19pLHNfUikpXG4gICAgICAgIGJyZWFrO1xuICAgIH0gICAgICAgICAgICAgICAgLy9ub3cgc19SIGlzIGluIHRoZSByYW5nZSBbMCxzX2ktMV1cbiAgICBhZGRJbnRfKHNfUiwxKTsgIC8vbm93IHNfUiBpcyBpbiB0aGUgcmFuZ2UgWzEsc19pXVxuICAgIGFkZF8oc19SLHNfaSk7ICAgLy9ub3cgc19SIGlzIGluIHRoZSByYW5nZSBbc19pKzEsMipzX2ldXG5cbiAgICBjb3B5XyhzX24sc19xKTtcbiAgICBtdWx0XyhzX24sc19SKTtcbiAgICBtdWx0SW50XyhzX24sMik7XG4gICAgYWRkSW50XyhzX24sMSk7ICAgIC8vc19uPTIqc19SKnNfcSsxXG5cbiAgICBjb3B5XyhzX3IyLHNfUik7XG4gICAgbXVsdEludF8oc19yMiwyKTsgIC8vc19yMj0yKnNfUlxuXG4gICAgLy9jaGVjayBzX24gZm9yIGRpdmlzaWJpbGl0eSBieSBzbWFsbCBwcmltZXMgdXAgdG8gQlxuICAgIGZvciAoZGl2aXNpYmxlPTAsaj0wOyAoajxwcmltZXMubGVuZ3RoKSAmJiAocHJpbWVzW2pdPEIpOyBqKyspXG4gICAgICBpZiAobW9kSW50KHNfbixwcmltZXNbal0pPT0wICYmICFlcXVhbHNJbnQoc19uLHByaW1lc1tqXSkpIHtcbiAgICAgICAgZGl2aXNpYmxlPTE7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgaWYgKCFkaXZpc2libGUpICAgIC8vaWYgaXQgcGFzc2VzIHNtYWxsIHByaW1lcyBjaGVjaywgdGhlbiB0cnkgYSBzaW5nbGUgTWlsbGVyLVJhYmluIGJhc2UgMlxuICAgICAgaWYgKCFtaWxsZXJSYWJpbkludChzX24sMikpIC8vdGhpcyBsaW5lIHJlcHJlc2VudHMgNzUlIG9mIHRoZSB0b3RhbCBydW50aW1lIGZvciByYW5kVHJ1ZVByaW1lX1xuICAgICAgICBkaXZpc2libGU9MTtcblxuICAgIGlmICghZGl2aXNpYmxlKSB7ICAvL2lmIGl0IHBhc3NlcyB0aGF0IHRlc3QsIGNvbnRpbnVlIGNoZWNraW5nIHNfblxuICAgICAgYWRkSW50XyhzX24sLTMpO1xuICAgICAgZm9yIChqPXNfbi5sZW5ndGgtMTsoc19uW2pdPT0wKSAmJiAoaj4wKTsgai0tKTsgIC8vc3RyaXAgbGVhZGluZyB6ZXJvc1xuICAgICAgZm9yICh6ej0wLHc9c19uW2pdOyB3OyAodz4+PTEpLHp6KyspO1xuICAgICAgenorPWJwZSpqOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy96ej1udW1iZXIgb2YgYml0cyBpbiBzX24sIGlnbm9yaW5nIGxlYWRpbmcgemVyb3NcbiAgICAgIGZvciAoOzspIHsgIC8vZ2VuZXJhdGUgei1iaXQgbnVtYmVycyB1bnRpbCBvbmUgZmFsbHMgaW4gdGhlIHJhbmdlIFswLHNfbi0xXVxuICAgICAgICByYW5kQmlnSW50XyhzX2EsenosMCk7XG4gICAgICAgIGlmIChncmVhdGVyKHNfbixzX2EpKVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgfSAgICAgICAgICAgICAgICAvL25vdyBzX2EgaXMgaW4gdGhlIHJhbmdlIFswLHNfbi0xXVxuICAgICAgYWRkSW50XyhzX24sMyk7ICAvL25vdyBzX2EgaXMgaW4gdGhlIHJhbmdlIFswLHNfbi00XVxuICAgICAgYWRkSW50XyhzX2EsMik7ICAvL25vdyBzX2EgaXMgaW4gdGhlIHJhbmdlIFsyLHNfbi0yXVxuICAgICAgY29weV8oc19iLHNfYSk7XG4gICAgICBjb3B5XyhzX24xLHNfbik7XG4gICAgICBhZGRJbnRfKHNfbjEsLTEpO1xuICAgICAgcG93TW9kXyhzX2Isc19uMSxzX24pOyAgIC8vc19iPXNfYV4oc19uLTEpIG1vZHVsbyBzX25cbiAgICAgIGFkZEludF8oc19iLC0xKTtcbiAgICAgIGlmIChpc1plcm8oc19iKSkge1xuICAgICAgICBjb3B5XyhzX2Isc19hKTtcbiAgICAgICAgcG93TW9kXyhzX2Isc19yMixzX24pO1xuICAgICAgICBhZGRJbnRfKHNfYiwtMSk7XG4gICAgICAgIGNvcHlfKHNfYWEsc19uKTtcbiAgICAgICAgY29weV8oc19kLHNfYik7XG4gICAgICAgIEdDRF8oc19kLHNfbik7ICAvL2lmIHNfYiBhbmQgc19uIGFyZSByZWxhdGl2ZWx5IHByaW1lLCB0aGVuIHNfbiBpcyBhIHByaW1lXG4gICAgICAgIGlmIChlcXVhbHNJbnQoc19kLDEpKSB7XG4gICAgICAgICAgY29weV8oYW5zLHNfYWEpO1xuICAgICAgICAgIHJldHVybjsgICAgIC8vaWYgd2UndmUgbWFkZSBpdCB0aGlzIGZhciwgdGhlbiBzX24gaXMgYWJzb2x1dGVseSBndWFyYW50ZWVkIHRvIGJlIHByaW1lXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuLy9SZXR1cm4gYW4gbi1iaXQgcmFuZG9tIEJpZ0ludCAobj49MSkuICBJZiBzPTEsIHRoZW4gdGhlIG1vc3Qgc2lnbmlmaWNhbnQgb2YgdGhvc2UgbiBiaXRzIGlzIHNldCB0byAxLlxuZnVuY3Rpb24gcmFuZEJpZ0ludChuLHMpIHtcbiAgdmFyIGEsYjtcbiAgYT1NYXRoLmZsb29yKChuLTEpL2JwZSkrMjsgLy8jIGFycmF5IGVsZW1lbnRzIHRvIGhvbGQgdGhlIEJpZ0ludCB3aXRoIGEgbGVhZGluZyAwIGVsZW1lbnRcbiAgYj1pbnQyYmlnSW50KDAsMCxhKTtcbiAgcmFuZEJpZ0ludF8oYixuLHMpO1xuICByZXR1cm4gYjtcbn1cblxuLy9TZXQgYiB0byBhbiBuLWJpdCByYW5kb20gQmlnSW50LiAgSWYgcz0xLCB0aGVuIHRoZSBtb3N0IHNpZ25pZmljYW50IG9mIHRob3NlIG4gYml0cyBpcyBzZXQgdG8gMS5cbi8vQXJyYXkgYiBtdXN0IGJlIGJpZyBlbm91Z2ggdG8gaG9sZCB0aGUgcmVzdWx0LiBNdXN0IGhhdmUgbj49MVxuZnVuY3Rpb24gcmFuZEJpZ0ludF8oYixuLHMpIHtcbiAgdmFyIGksYTtcbiAgZm9yIChpPTA7aTxiLmxlbmd0aDtpKyspXG4gICAgYltpXT0wO1xuICBhPU1hdGguZmxvb3IoKG4tMSkvYnBlKSsxOyAvLyMgYXJyYXkgZWxlbWVudHMgdG8gaG9sZCB0aGUgQmlnSW50XG4gIGZvciAoaT0wO2k8YTtpKyspIHtcbiAgICBiW2ldPU1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSooMTw8KGJwZS0xKSkpO1xuICB9XG4gIGJbYS0xXSAmPSAoMjw8KChuLTEpJWJwZSkpLTE7XG4gIGlmIChzPT0xKVxuICAgIGJbYS0xXSB8PSAoMTw8KChuLTEpJWJwZSkpO1xufVxuXG4vL1JldHVybiB0aGUgZ3JlYXRlc3QgY29tbW9uIGRpdmlzb3Igb2YgYmlnSW50cyB4IGFuZCB5IChlYWNoIHdpdGggc2FtZSBudW1iZXIgb2YgZWxlbWVudHMpLlxuZnVuY3Rpb24gR0NEKHgseSkge1xuICB2YXIgeGMseWM7XG4gIHhjPWR1cCh4KTtcbiAgeWM9ZHVwKHkpO1xuICBHQ0RfKHhjLHljKTtcbiAgcmV0dXJuIHhjO1xufVxuXG4vL3NldCB4IHRvIHRoZSBncmVhdGVzdCBjb21tb24gZGl2aXNvciBvZiBiaWdJbnRzIHggYW5kIHkgKGVhY2ggd2l0aCBzYW1lIG51bWJlciBvZiBlbGVtZW50cykuXG4vL3kgaXMgZGVzdHJveWVkLlxuZnVuY3Rpb24gR0NEXyh4LHkpIHtcbiAgdmFyIGkseHAseXAsQSxCLEMsRCxxLHNpbmc7XG4gIGlmIChULmxlbmd0aCE9eC5sZW5ndGgpXG4gICAgVD1kdXAoeCk7XG5cbiAgc2luZz0xO1xuICB3aGlsZSAoc2luZykgeyAvL3doaWxlIHkgaGFzIG5vbnplcm8gZWxlbWVudHMgb3RoZXIgdGhhbiB5WzBdXG4gICAgc2luZz0wO1xuICAgIGZvciAoaT0xO2k8eS5sZW5ndGg7aSsrKSAvL2NoZWNrIGlmIHkgaGFzIG5vbnplcm8gZWxlbWVudHMgb3RoZXIgdGhhbiAwXG4gICAgICBpZiAoeVtpXSkge1xuICAgICAgICBzaW5nPTE7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIGlmICghc2luZykgYnJlYWs7IC8vcXVpdCB3aGVuIHkgYWxsIHplcm8gZWxlbWVudHMgZXhjZXB0IHBvc3NpYmx5IHlbMF1cblxuICAgIGZvciAoaT14Lmxlbmd0aDsheFtpXSAmJiBpPj0wO2ktLSk7ICAvL2ZpbmQgbW9zdCBzaWduaWZpY2FudCBlbGVtZW50IG9mIHhcbiAgICB4cD14W2ldO1xuICAgIHlwPXlbaV07XG4gICAgQT0xOyBCPTA7IEM9MDsgRD0xO1xuICAgIHdoaWxlICgoeXArQykgJiYgKHlwK0QpKSB7XG4gICAgICBxID1NYXRoLmZsb29yKCh4cCtBKS8oeXArQykpO1xuICAgICAgcXA9TWF0aC5mbG9vcigoeHArQikvKHlwK0QpKTtcbiAgICAgIGlmIChxIT1xcClcbiAgICAgICAgYnJlYWs7XG4gICAgICB0PSBBLXEqQzsgICBBPUM7ICAgQz10OyAgICAvLyAgZG8gKEEsQix4cCwgQyxELHlwKSA9IChDLEQseXAsIEEsQix4cCkgLSBxKigwLDAsMCwgQyxELHlwKVxuICAgICAgdD0gQi1xKkQ7ICAgQj1EOyAgIEQ9dDtcbiAgICAgIHQ9eHAtcSp5cDsgeHA9eXA7IHlwPXQ7XG4gICAgfVxuICAgIGlmIChCKSB7XG4gICAgICBjb3B5XyhULHgpO1xuICAgICAgbGluQ29tYl8oeCx5LEEsQik7IC8veD1BKngrQip5XG4gICAgICBsaW5Db21iXyh5LFQsRCxDKTsgLy95PUQqeStDKlRcbiAgICB9IGVsc2Uge1xuICAgICAgbW9kXyh4LHkpO1xuICAgICAgY29weV8oVCx4KTtcbiAgICAgIGNvcHlfKHgseSk7XG4gICAgICBjb3B5Xyh5LFQpO1xuICAgIH1cbiAgfVxuICBpZiAoeVswXT09MClcbiAgICByZXR1cm47XG4gIHQ9bW9kSW50KHgseVswXSk7XG4gIGNvcHlJbnRfKHgseVswXSk7XG4gIHlbMF09dDtcbiAgd2hpbGUgKHlbMF0pIHtcbiAgICB4WzBdJT15WzBdO1xuICAgIHQ9eFswXTsgeFswXT15WzBdOyB5WzBdPXQ7XG4gIH1cbn1cblxuLy9kbyB4PXgqKigtMSkgbW9kIG4sIGZvciBiaWdJbnRzIHggYW5kIG4uXG4vL0lmIG5vIGludmVyc2UgZXhpc3RzLCBpdCBzZXRzIHggdG8gemVybyBhbmQgcmV0dXJucyAwLCBlbHNlIGl0IHJldHVybnMgMS5cbi8vVGhlIHggYXJyYXkgbXVzdCBiZSBhdCBsZWFzdCBhcyBsYXJnZSBhcyB0aGUgbiBhcnJheS5cbmZ1bmN0aW9uIGludmVyc2VNb2RfKHgsbikge1xuICB2YXIgaz0xKzIqTWF0aC5tYXgoeC5sZW5ndGgsbi5sZW5ndGgpO1xuXG4gIGlmKCEoeFswXSYxKSAgJiYgIShuWzBdJjEpKSB7ICAvL2lmIGJvdGggaW5wdXRzIGFyZSBldmVuLCB0aGVuIGludmVyc2UgZG9lc24ndCBleGlzdFxuICAgIGNvcHlJbnRfKHgsMCk7XG4gICAgcmV0dXJuIDA7XG4gIH1cblxuICBpZiAoZWdfdS5sZW5ndGghPWspIHtcbiAgICBlZ191PW5ldyBBcnJheShrKTtcbiAgICBlZ192PW5ldyBBcnJheShrKTtcbiAgICBlZ19BPW5ldyBBcnJheShrKTtcbiAgICBlZ19CPW5ldyBBcnJheShrKTtcbiAgICBlZ19DPW5ldyBBcnJheShrKTtcbiAgICBlZ19EPW5ldyBBcnJheShrKTtcbiAgfVxuXG4gIGNvcHlfKGVnX3UseCk7XG4gIGNvcHlfKGVnX3Ysbik7XG4gIGNvcHlJbnRfKGVnX0EsMSk7XG4gIGNvcHlJbnRfKGVnX0IsMCk7XG4gIGNvcHlJbnRfKGVnX0MsMCk7XG4gIGNvcHlJbnRfKGVnX0QsMSk7XG4gIGZvciAoOzspIHtcbiAgICB3aGlsZSghKGVnX3VbMF0mMSkpIHsgIC8vd2hpbGUgZWdfdSBpcyBldmVuXG4gICAgICBoYWx2ZV8oZWdfdSk7XG4gICAgICBpZiAoIShlZ19BWzBdJjEpICYmICEoZWdfQlswXSYxKSkgeyAvL2lmIGVnX0E9PWVnX0I9PTAgbW9kIDJcbiAgICAgICAgaGFsdmVfKGVnX0EpO1xuICAgICAgICBoYWx2ZV8oZWdfQik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhZGRfKGVnX0Esbik7ICBoYWx2ZV8oZWdfQSk7XG4gICAgICAgIHN1Yl8oZWdfQix4KTsgIGhhbHZlXyhlZ19CKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB3aGlsZSAoIShlZ192WzBdJjEpKSB7ICAvL3doaWxlIGVnX3YgaXMgZXZlblxuICAgICAgaGFsdmVfKGVnX3YpO1xuICAgICAgaWYgKCEoZWdfQ1swXSYxKSAmJiAhKGVnX0RbMF0mMSkpIHsgLy9pZiBlZ19DPT1lZ19EPT0wIG1vZCAyXG4gICAgICAgIGhhbHZlXyhlZ19DKTtcbiAgICAgICAgaGFsdmVfKGVnX0QpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYWRkXyhlZ19DLG4pOyAgaGFsdmVfKGVnX0MpO1xuICAgICAgICBzdWJfKGVnX0QseCk7ICBoYWx2ZV8oZWdfRCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCFncmVhdGVyKGVnX3YsZWdfdSkpIHsgLy9lZ192IDw9IGVnX3VcbiAgICAgIHN1Yl8oZWdfdSxlZ192KTtcbiAgICAgIHN1Yl8oZWdfQSxlZ19DKTtcbiAgICAgIHN1Yl8oZWdfQixlZ19EKTtcbiAgICB9IGVsc2UgeyAgICAgICAgICAgICAgICAgICAvL2VnX3YgPiBlZ191XG4gICAgICBzdWJfKGVnX3YsZWdfdSk7XG4gICAgICBzdWJfKGVnX0MsZWdfQSk7XG4gICAgICBzdWJfKGVnX0QsZWdfQik7XG4gICAgfVxuXG4gICAgaWYgKGVxdWFsc0ludChlZ191LDApKSB7XG4gICAgICB3aGlsZSAobmVnYXRpdmUoZWdfQykpIC8vbWFrZSBzdXJlIGFuc3dlciBpcyBub25uZWdhdGl2ZVxuICAgICAgICBhZGRfKGVnX0Msbik7XG4gICAgICBjb3B5Xyh4LGVnX0MpO1xuXG4gICAgICBpZiAoIWVxdWFsc0ludChlZ192LDEpKSB7IC8vaWYgR0NEXyh4LG4pIT0xLCB0aGVuIHRoZXJlIGlzIG5vIGludmVyc2VcbiAgICAgICAgY29weUludF8oeCwwKTtcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgICB9XG4gICAgICByZXR1cm4gMTtcbiAgICB9XG4gIH1cbn1cblxuLy9yZXR1cm4geCoqKC0xKSBtb2QgbiwgZm9yIGludGVnZXJzIHggYW5kIG4uICBSZXR1cm4gMCBpZiB0aGVyZSBpcyBubyBpbnZlcnNlXG5mdW5jdGlvbiBpbnZlcnNlTW9kSW50KHgsbikge1xuICB2YXIgYT0xLGI9MCx0O1xuICBmb3IgKDs7KSB7XG4gICAgaWYgKHg9PTEpIHJldHVybiBhO1xuICAgIGlmICh4PT0wKSByZXR1cm4gMDtcbiAgICBiLT1hKk1hdGguZmxvb3Iobi94KTtcbiAgICBuJT14O1xuXG4gICAgaWYgKG49PTEpIHJldHVybiBiOyAvL3RvIGF2b2lkIG5lZ2F0aXZlcywgY2hhbmdlIHRoaXMgYiB0byBuLWIsIGFuZCBlYWNoIC09IHRvICs9XG4gICAgaWYgKG49PTApIHJldHVybiAwO1xuICAgIGEtPWIqTWF0aC5mbG9vcih4L24pO1xuICAgIHglPW47XG4gIH1cbn1cblxuLy90aGlzIGRlcHJlY2F0ZWQgZnVuY3Rpb24gaXMgZm9yIGJhY2t3YXJkIGNvbXBhdGliaWxpdHkgb25seS5cbmZ1bmN0aW9uIGludmVyc2VNb2RJbnRfKHgsbikge1xuICAgcmV0dXJuIGludmVyc2VNb2RJbnQoeCxuKTtcbn1cblxuXG4vL0dpdmVuIHBvc2l0aXZlIGJpZ0ludHMgeCBhbmQgeSwgY2hhbmdlIHRoZSBiaWdpbnRzIHYsIGEsIGFuZCBiIHRvIHBvc2l0aXZlIGJpZ0ludHMgc3VjaCB0aGF0OlxuLy8gICAgIHYgPSBHQ0RfKHgseSkgPSBhKngtYip5XG4vL1RoZSBiaWdJbnRzIHYsIGEsIGIsIG11c3QgaGF2ZSBleGFjdGx5IGFzIG1hbnkgZWxlbWVudHMgYXMgdGhlIGxhcmdlciBvZiB4IGFuZCB5LlxuZnVuY3Rpb24gZUdDRF8oeCx5LHYsYSxiKSB7XG4gIHZhciBnPTA7XG4gIHZhciBrPU1hdGgubWF4KHgubGVuZ3RoLHkubGVuZ3RoKTtcbiAgaWYgKGVnX3UubGVuZ3RoIT1rKSB7XG4gICAgZWdfdT1uZXcgQXJyYXkoayk7XG4gICAgZWdfQT1uZXcgQXJyYXkoayk7XG4gICAgZWdfQj1uZXcgQXJyYXkoayk7XG4gICAgZWdfQz1uZXcgQXJyYXkoayk7XG4gICAgZWdfRD1uZXcgQXJyYXkoayk7XG4gIH1cbiAgd2hpbGUoISh4WzBdJjEpICAmJiAhKHlbMF0mMSkpIHsgIC8vd2hpbGUgeCBhbmQgeSBib3RoIGV2ZW5cbiAgICBoYWx2ZV8oeCk7XG4gICAgaGFsdmVfKHkpO1xuICAgIGcrKztcbiAgfVxuICBjb3B5XyhlZ191LHgpO1xuICBjb3B5Xyh2LHkpO1xuICBjb3B5SW50XyhlZ19BLDEpO1xuICBjb3B5SW50XyhlZ19CLDApO1xuICBjb3B5SW50XyhlZ19DLDApO1xuICBjb3B5SW50XyhlZ19ELDEpO1xuICBmb3IgKDs7KSB7XG4gICAgd2hpbGUoIShlZ191WzBdJjEpKSB7ICAvL3doaWxlIHUgaXMgZXZlblxuICAgICAgaGFsdmVfKGVnX3UpO1xuICAgICAgaWYgKCEoZWdfQVswXSYxKSAmJiAhKGVnX0JbMF0mMSkpIHsgLy9pZiBBPT1CPT0wIG1vZCAyXG4gICAgICAgIGhhbHZlXyhlZ19BKTtcbiAgICAgICAgaGFsdmVfKGVnX0IpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYWRkXyhlZ19BLHkpOyAgaGFsdmVfKGVnX0EpO1xuICAgICAgICBzdWJfKGVnX0IseCk7ICBoYWx2ZV8oZWdfQik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgd2hpbGUgKCEodlswXSYxKSkgeyAgLy93aGlsZSB2IGlzIGV2ZW5cbiAgICAgIGhhbHZlXyh2KTtcbiAgICAgIGlmICghKGVnX0NbMF0mMSkgJiYgIShlZ19EWzBdJjEpKSB7IC8vaWYgQz09RD09MCBtb2QgMlxuICAgICAgICBoYWx2ZV8oZWdfQyk7XG4gICAgICAgIGhhbHZlXyhlZ19EKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFkZF8oZWdfQyx5KTsgIGhhbHZlXyhlZ19DKTtcbiAgICAgICAgc3ViXyhlZ19ELHgpOyAgaGFsdmVfKGVnX0QpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICghZ3JlYXRlcih2LGVnX3UpKSB7IC8vdjw9dVxuICAgICAgc3ViXyhlZ191LHYpO1xuICAgICAgc3ViXyhlZ19BLGVnX0MpO1xuICAgICAgc3ViXyhlZ19CLGVnX0QpO1xuICAgIH0gZWxzZSB7ICAgICAgICAgICAgICAgIC8vdj51XG4gICAgICBzdWJfKHYsZWdfdSk7XG4gICAgICBzdWJfKGVnX0MsZWdfQSk7XG4gICAgICBzdWJfKGVnX0QsZWdfQik7XG4gICAgfVxuICAgIGlmIChlcXVhbHNJbnQoZWdfdSwwKSkge1xuICAgICAgd2hpbGUgKG5lZ2F0aXZlKGVnX0MpKSB7ICAgLy9tYWtlIHN1cmUgYSAoQykgaXMgbm9ubmVnYXRpdmVcbiAgICAgICAgYWRkXyhlZ19DLHkpO1xuICAgICAgICBzdWJfKGVnX0QseCk7XG4gICAgICB9XG4gICAgICBtdWx0SW50XyhlZ19ELC0xKTsgIC8vL21ha2Ugc3VyZSBiIChEKSBpcyBub25uZWdhdGl2ZVxuICAgICAgY29weV8oYSxlZ19DKTtcbiAgICAgIGNvcHlfKGIsZWdfRCk7XG4gICAgICBsZWZ0U2hpZnRfKHYsZyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICB9XG59XG5cblxuLy9pcyBiaWdJbnQgeCBuZWdhdGl2ZT9cbmZ1bmN0aW9uIG5lZ2F0aXZlKHgpIHtcbiAgcmV0dXJuICgoeFt4Lmxlbmd0aC0xXT4+KGJwZS0xKSkmMSk7XG59XG5cblxuLy9pcyAoeCA8PCAoc2hpZnQqYnBlKSkgPiB5P1xuLy94IGFuZCB5IGFyZSBub25uZWdhdGl2ZSBiaWdJbnRzXG4vL3NoaWZ0IGlzIGEgbm9ubmVnYXRpdmUgaW50ZWdlclxuZnVuY3Rpb24gZ3JlYXRlclNoaWZ0KHgseSxzaGlmdCkge1xuICB2YXIgaSwga3g9eC5sZW5ndGgsIGt5PXkubGVuZ3RoO1xuICBrPSgoa3grc2hpZnQpPGt5KSA/IChreCtzaGlmdCkgOiBreTtcbiAgZm9yIChpPWt5LTEtc2hpZnQ7IGk8a3ggJiYgaT49MDsgaSsrKVxuICAgIGlmICh4W2ldPjApXG4gICAgICByZXR1cm4gMTsgLy9pZiB0aGVyZSBhcmUgbm9uemVyb3MgaW4geCB0byB0aGUgbGVmdCBvZiB0aGUgZmlyc3QgY29sdW1uIG9mIHksIHRoZW4geCBpcyBiaWdnZXJcbiAgZm9yIChpPWt4LTErc2hpZnQ7IGk8a3k7IGkrKylcbiAgICBpZiAoeVtpXT4wKVxuICAgICAgcmV0dXJuIDA7IC8vaWYgdGhlcmUgYXJlIG5vbnplcm9zIGluIHkgdG8gdGhlIGxlZnQgb2YgdGhlIGZpcnN0IGNvbHVtbiBvZiB4LCB0aGVuIHggaXMgbm90IGJpZ2dlclxuICBmb3IgKGk9ay0xOyBpPj1zaGlmdDsgaS0tKVxuICAgIGlmICAgICAgKHhbaS1zaGlmdF0+eVtpXSkgcmV0dXJuIDE7XG4gICAgZWxzZSBpZiAoeFtpLXNoaWZ0XTx5W2ldKSByZXR1cm4gMDtcbiAgcmV0dXJuIDA7XG59XG5cbi8vaXMgeCA+IHk/ICh4IGFuZCB5IGJvdGggbm9ubmVnYXRpdmUpXG5mdW5jdGlvbiBncmVhdGVyKHgseSkge1xuICB2YXIgaTtcbiAgdmFyIGs9KHgubGVuZ3RoPHkubGVuZ3RoKSA/IHgubGVuZ3RoIDogeS5sZW5ndGg7XG5cbiAgZm9yIChpPXgubGVuZ3RoO2k8eS5sZW5ndGg7aSsrKVxuICAgIGlmICh5W2ldKVxuICAgICAgcmV0dXJuIDA7ICAvL3kgaGFzIG1vcmUgZGlnaXRzXG5cbiAgZm9yIChpPXkubGVuZ3RoO2k8eC5sZW5ndGg7aSsrKVxuICAgIGlmICh4W2ldKVxuICAgICAgcmV0dXJuIDE7ICAvL3ggaGFzIG1vcmUgZGlnaXRzXG5cbiAgZm9yIChpPWstMTtpPj0wO2ktLSlcbiAgICBpZiAoeFtpXT55W2ldKVxuICAgICAgcmV0dXJuIDE7XG4gICAgZWxzZSBpZiAoeFtpXTx5W2ldKVxuICAgICAgcmV0dXJuIDA7XG4gIHJldHVybiAwO1xufVxuXG4vL2RpdmlkZSB4IGJ5IHkgZ2l2aW5nIHF1b3RpZW50IHEgYW5kIHJlbWFpbmRlciByLiAgKHE9Zmxvb3IoeC95KSwgIHI9eCBtb2QgeSkuICBBbGwgNCBhcmUgYmlnaW50cy5cbi8veCBtdXN0IGhhdmUgYXQgbGVhc3Qgb25lIGxlYWRpbmcgemVybyBlbGVtZW50LlxuLy95IG11c3QgYmUgbm9uemVyby5cbi8vcSBhbmQgciBtdXN0IGJlIGFycmF5cyB0aGF0IGFyZSBleGFjdGx5IHRoZSBzYW1lIGxlbmd0aCBhcyB4LiAoT3IgcSBjYW4gaGF2ZSBtb3JlKS5cbi8vTXVzdCBoYXZlIHgubGVuZ3RoID49IHkubGVuZ3RoID49IDIuXG5mdW5jdGlvbiBkaXZpZGVfKHgseSxxLHIpIHtcbiAgdmFyIGt4LCBreTtcbiAgdmFyIGksaix5MSx5MixjLGEsYjtcbiAgY29weV8ocix4KTtcbiAgZm9yIChreT15Lmxlbmd0aDt5W2t5LTFdPT0wO2t5LS0pOyAvL2t5IGlzIG51bWJlciBvZiBlbGVtZW50cyBpbiB5LCBub3QgaW5jbHVkaW5nIGxlYWRpbmcgemVyb3NcblxuICAvL25vcm1hbGl6ZTogZW5zdXJlIHRoZSBtb3N0IHNpZ25pZmljYW50IGVsZW1lbnQgb2YgeSBoYXMgaXRzIGhpZ2hlc3QgYml0IHNldFxuICBiPXlba3ktMV07XG4gIGZvciAoYT0wOyBiOyBhKyspXG4gICAgYj4+PTE7XG4gIGE9YnBlLWE7ICAvL2EgaXMgaG93IG1hbnkgYml0cyB0byBzaGlmdCBzbyB0aGF0IHRoZSBoaWdoIG9yZGVyIGJpdCBvZiB5IGlzIGxlZnRtb3N0IGluIGl0cyBhcnJheSBlbGVtZW50XG4gIGxlZnRTaGlmdF8oeSxhKTsgIC8vbXVsdGlwbHkgYm90aCBieSAxPDxhIG5vdywgdGhlbiBkaXZpZGUgYm90aCBieSB0aGF0IGF0IHRoZSBlbmRcbiAgbGVmdFNoaWZ0XyhyLGEpO1xuXG4gIC8vUm9iIFZpc3NlciBkaXNjb3ZlcmVkIGEgYnVnOiB0aGUgZm9sbG93aW5nIGxpbmUgd2FzIG9yaWdpbmFsbHkganVzdCBiZWZvcmUgdGhlIG5vcm1hbGl6YXRpb24uXG4gIGZvciAoa3g9ci5sZW5ndGg7cltreC0xXT09MCAmJiBreD5reTtreC0tKTsgLy9reCBpcyBudW1iZXIgb2YgZWxlbWVudHMgaW4gbm9ybWFsaXplZCB4LCBub3QgaW5jbHVkaW5nIGxlYWRpbmcgemVyb3NcblxuICBjb3B5SW50XyhxLDApOyAgICAgICAgICAgICAgICAgICAgICAvLyBxPTBcbiAgd2hpbGUgKCFncmVhdGVyU2hpZnQoeSxyLGt4LWt5KSkgeyAgLy8gd2hpbGUgKGxlZnRTaGlmdF8oeSxreC1reSkgPD0gcikge1xuICAgIHN1YlNoaWZ0XyhyLHksa3gta3kpOyAgICAgICAgICAgICAvLyAgIHI9ci1sZWZ0U2hpZnRfKHksa3gta3kpXG4gICAgcVtreC1reV0rKzsgICAgICAgICAgICAgICAgICAgICAgIC8vICAgcVtreC1reV0rKztcbiAgfSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gfVxuXG4gIGZvciAoaT1reC0xOyBpPj1reTsgaS0tKSB7XG4gICAgaWYgKHJbaV09PXlba3ktMV0pXG4gICAgICBxW2kta3ldPW1hc2s7XG4gICAgZWxzZVxuICAgICAgcVtpLWt5XT1NYXRoLmZsb29yKChyW2ldKnJhZGl4K3JbaS0xXSkveVtreS0xXSk7XG5cbiAgICAvL1RoZSBmb2xsb3dpbmcgZm9yKDs7KSBsb29wIGlzIGVxdWl2YWxlbnQgdG8gdGhlIGNvbW1lbnRlZCB3aGlsZSBsb29wLFxuICAgIC8vZXhjZXB0IHRoYXQgdGhlIHVuY29tbWVudGVkIHZlcnNpb24gYXZvaWRzIG92ZXJmbG93LlxuICAgIC8vVGhlIGNvbW1lbnRlZCBsb29wIGNvbWVzIGZyb20gSEFDLCB3aGljaCBhc3N1bWVzIHJbLTFdPT15Wy0xXT09MFxuICAgIC8vICB3aGlsZSAocVtpLWt5XSooeVtreS0xXSpyYWRpeCt5W2t5LTJdKSA+IHJbaV0qcmFkaXgqcmFkaXgrcltpLTFdKnJhZGl4K3JbaS0yXSlcbiAgICAvLyAgICBxW2kta3ldLS07XG4gICAgZm9yICg7Oykge1xuICAgICAgeTI9KGt5PjEgPyB5W2t5LTJdIDogMCkqcVtpLWt5XTtcbiAgICAgIGM9eTI+PmJwZTtcbiAgICAgIHkyPXkyICYgbWFzaztcbiAgICAgIHkxPWMrcVtpLWt5XSp5W2t5LTFdO1xuICAgICAgYz15MT4+YnBlO1xuICAgICAgeTE9eTEgJiBtYXNrO1xuXG4gICAgICBpZiAoYz09cltpXSA/IHkxPT1yW2ktMV0gPyB5Mj4oaT4xID8gcltpLTJdIDogMCkgOiB5MT5yW2ktMV0gOiBjPnJbaV0pXG4gICAgICAgIHFbaS1reV0tLTtcbiAgICAgIGVsc2VcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgbGluQ29tYlNoaWZ0XyhyLHksLXFbaS1reV0saS1reSk7ICAgIC8vcj1yLXFbaS1reV0qbGVmdFNoaWZ0Xyh5LGkta3kpXG4gICAgaWYgKG5lZ2F0aXZlKHIpKSB7XG4gICAgICBhZGRTaGlmdF8ocix5LGkta3kpOyAgICAgICAgIC8vcj1yK2xlZnRTaGlmdF8oeSxpLWt5KVxuICAgICAgcVtpLWt5XS0tO1xuICAgIH1cbiAgfVxuXG4gIHJpZ2h0U2hpZnRfKHksYSk7ICAvL3VuZG8gdGhlIG5vcm1hbGl6YXRpb24gc3RlcFxuICByaWdodFNoaWZ0XyhyLGEpOyAgLy91bmRvIHRoZSBub3JtYWxpemF0aW9uIHN0ZXBcbn1cblxuLy9kbyBjYXJyaWVzIGFuZCBib3Jyb3dzIHNvIGVhY2ggZWxlbWVudCBvZiB0aGUgYmlnSW50IHggZml0cyBpbiBicGUgYml0cy5cbmZ1bmN0aW9uIGNhcnJ5Xyh4KSB7XG4gIHZhciBpLGssYyxiO1xuICBrPXgubGVuZ3RoO1xuICBjPTA7XG4gIGZvciAoaT0wO2k8aztpKyspIHtcbiAgICBjKz14W2ldO1xuICAgIGI9MDtcbiAgICBpZiAoYzwwKSB7XG4gICAgICBiPS0oYz4+YnBlKTtcbiAgICAgIGMrPWIqcmFkaXg7XG4gICAgfVxuICAgIHhbaV09YyAmIG1hc2s7XG4gICAgYz0oYz4+YnBlKS1iO1xuICB9XG59XG5cbi8vcmV0dXJuIHggbW9kIG4gZm9yIGJpZ0ludCB4IGFuZCBpbnRlZ2VyIG4uXG5mdW5jdGlvbiBtb2RJbnQoeCxuKSB7XG4gIHZhciBpLGM9MDtcbiAgZm9yIChpPXgubGVuZ3RoLTE7IGk+PTA7IGktLSlcbiAgICBjPShjKnJhZGl4K3hbaV0pJW47XG4gIHJldHVybiBjO1xufVxuXG4vL2NvbnZlcnQgdGhlIGludGVnZXIgdCBpbnRvIGEgYmlnSW50IHdpdGggYXQgbGVhc3QgdGhlIGdpdmVuIG51bWJlciBvZiBiaXRzLlxuLy90aGUgcmV0dXJuZWQgYXJyYXkgc3RvcmVzIHRoZSBiaWdJbnQgaW4gYnBlLWJpdCBjaHVua3MsIGxpdHRsZSBlbmRpYW4gKGJ1ZmZbMF0gaXMgbGVhc3Qgc2lnbmlmaWNhbnQgd29yZClcbi8vUGFkIHRoZSBhcnJheSB3aXRoIGxlYWRpbmcgemVyb3Mgc28gdGhhdCBpdCBoYXMgYXQgbGVhc3QgbWluU2l6ZSBlbGVtZW50cy5cbi8vVGhlcmUgd2lsbCBhbHdheXMgYmUgYXQgbGVhc3Qgb25lIGxlYWRpbmcgMCBlbGVtZW50LlxuZnVuY3Rpb24gaW50MmJpZ0ludCh0LGJpdHMsbWluU2l6ZSkge1xuICB2YXIgaSxrO1xuICBrPU1hdGguY2VpbChiaXRzL2JwZSkrMTtcbiAgaz1taW5TaXplPmsgPyBtaW5TaXplIDogaztcbiAgYnVmZj1uZXcgQXJyYXkoayk7XG4gIGNvcHlJbnRfKGJ1ZmYsdCk7XG4gIHJldHVybiBidWZmO1xufVxuXG4vL3JldHVybiB0aGUgYmlnSW50IGdpdmVuIGEgc3RyaW5nIHJlcHJlc2VudGF0aW9uIGluIGEgZ2l2ZW4gYmFzZS5cbi8vUGFkIHRoZSBhcnJheSB3aXRoIGxlYWRpbmcgemVyb3Mgc28gdGhhdCBpdCBoYXMgYXQgbGVhc3QgbWluU2l6ZSBlbGVtZW50cy5cbi8vSWYgYmFzZT0tMSwgdGhlbiBpdCByZWFkcyBpbiBhIHNwYWNlLXNlcGFyYXRlZCBsaXN0IG9mIGFycmF5IGVsZW1lbnRzIGluIGRlY2ltYWwuXG4vL1RoZSBhcnJheSB3aWxsIGFsd2F5cyBoYXZlIGF0IGxlYXN0IG9uZSBsZWFkaW5nIHplcm8sIHVubGVzcyBiYXNlPS0xLlxuZnVuY3Rpb24gc3RyMmJpZ0ludChzLGJhc2UsbWluU2l6ZSkge1xuICB2YXIgZCwgaSwgaiwgeCwgeSwga2s7XG4gIHZhciBrPXMubGVuZ3RoO1xuICBpZiAoYmFzZT09LTEpIHsgLy9jb21tYS1zZXBhcmF0ZWQgbGlzdCBvZiBhcnJheSBlbGVtZW50cyBpbiBkZWNpbWFsXG4gICAgeD1uZXcgQXJyYXkoMCk7XG4gICAgZm9yICg7Oykge1xuICAgICAgeT1uZXcgQXJyYXkoeC5sZW5ndGgrMSk7XG4gICAgICBmb3IgKGk9MDtpPHgubGVuZ3RoO2krKylcbiAgICAgICAgeVtpKzFdPXhbaV07XG4gICAgICB5WzBdPXBhcnNlSW50KHMsMTApO1xuICAgICAgeD15O1xuICAgICAgZD1zLmluZGV4T2YoJywnLDApO1xuICAgICAgaWYgKGQ8MSlcbiAgICAgICAgYnJlYWs7XG4gICAgICBzPXMuc3Vic3RyaW5nKGQrMSk7XG4gICAgICBpZiAocy5sZW5ndGg9PTApXG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBpZiAoeC5sZW5ndGg8bWluU2l6ZSkge1xuICAgICAgeT1uZXcgQXJyYXkobWluU2l6ZSk7XG4gICAgICBjb3B5Xyh5LHgpO1xuICAgICAgcmV0dXJuIHk7XG4gICAgfVxuICAgIHJldHVybiB4O1xuICB9XG5cbiAgeD1pbnQyYmlnSW50KDAsYmFzZSprLDApO1xuICBmb3IgKGk9MDtpPGs7aSsrKSB7XG4gICAgZD1kaWdpdHNTdHIuaW5kZXhPZihzLnN1YnN0cmluZyhpLGkrMSksMCk7XG4gICAgaWYgKGJhc2U8PTM2ICYmIGQ+PTM2KSAgLy9jb252ZXJ0IGxvd2VyY2FzZSB0byB1cHBlcmNhc2UgaWYgYmFzZTw9MzZcbiAgICAgIGQtPTI2O1xuICAgIGlmIChkPj1iYXNlIHx8IGQ8MCkgeyAgIC8vc3RvcCBhdCBmaXJzdCBpbGxlZ2FsIGNoYXJhY3RlclxuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIG11bHRJbnRfKHgsYmFzZSk7XG4gICAgYWRkSW50Xyh4LGQpO1xuICB9XG5cbiAgZm9yIChrPXgubGVuZ3RoO2s+MCAmJiAheFtrLTFdO2stLSk7IC8vc3RyaXAgb2ZmIGxlYWRpbmcgemVyb3NcbiAgaz1taW5TaXplPmsrMSA/IG1pblNpemUgOiBrKzE7XG4gIHk9bmV3IEFycmF5KGspO1xuICBraz1rPHgubGVuZ3RoID8gayA6IHgubGVuZ3RoO1xuICBmb3IgKGk9MDtpPGtrO2krKylcbiAgICB5W2ldPXhbaV07XG4gIGZvciAoO2k8aztpKyspXG4gICAgeVtpXT0wO1xuICByZXR1cm4geTtcbn1cblxuLy9pcyBiaWdpbnQgeCBlcXVhbCB0byBpbnRlZ2VyIHk/XG4vL3kgbXVzdCBoYXZlIGxlc3MgdGhhbiBicGUgYml0c1xuZnVuY3Rpb24gZXF1YWxzSW50KHgseSkge1xuICB2YXIgaTtcbiAgaWYgKHhbMF0hPXkpXG4gICAgcmV0dXJuIDA7XG4gIGZvciAoaT0xO2k8eC5sZW5ndGg7aSsrKVxuICAgIGlmICh4W2ldKVxuICAgICAgcmV0dXJuIDA7XG4gIHJldHVybiAxO1xufVxuXG4vL2FyZSBiaWdpbnRzIHggYW5kIHkgZXF1YWw/XG4vL3RoaXMgd29ya3MgZXZlbiBpZiB4IGFuZCB5IGFyZSBkaWZmZXJlbnQgbGVuZ3RocyBhbmQgaGF2ZSBhcmJpdHJhcmlseSBtYW55IGxlYWRpbmcgemVyb3NcbmZ1bmN0aW9uIGVxdWFscyh4LHkpIHtcbiAgdmFyIGk7XG4gIHZhciBrPXgubGVuZ3RoPHkubGVuZ3RoID8geC5sZW5ndGggOiB5Lmxlbmd0aDtcbiAgZm9yIChpPTA7aTxrO2krKylcbiAgICBpZiAoeFtpXSE9eVtpXSlcbiAgICAgIHJldHVybiAwO1xuICBpZiAoeC5sZW5ndGg+eS5sZW5ndGgpIHtcbiAgICBmb3IgKDtpPHgubGVuZ3RoO2krKylcbiAgICAgIGlmICh4W2ldKVxuICAgICAgICByZXR1cm4gMDtcbiAgfSBlbHNlIHtcbiAgICBmb3IgKDtpPHkubGVuZ3RoO2krKylcbiAgICAgIGlmICh5W2ldKVxuICAgICAgICByZXR1cm4gMDtcbiAgfVxuICByZXR1cm4gMTtcbn1cblxuLy9pcyB0aGUgYmlnSW50IHggZXF1YWwgdG8gemVybz9cbmZ1bmN0aW9uIGlzWmVybyh4KSB7XG4gIHZhciBpO1xuICBmb3IgKGk9MDtpPHgubGVuZ3RoO2krKylcbiAgICBpZiAoeFtpXSlcbiAgICAgIHJldHVybiAwO1xuICByZXR1cm4gMTtcbn1cblxuLy9jb252ZXJ0IGEgYmlnSW50IGludG8gYSBzdHJpbmcgaW4gYSBnaXZlbiBiYXNlLCBmcm9tIGJhc2UgMiB1cCB0byBiYXNlIDk1LlxuLy9CYXNlIC0xIHByaW50cyB0aGUgY29udGVudHMgb2YgdGhlIGFycmF5IHJlcHJlc2VudGluZyB0aGUgbnVtYmVyLlxuZnVuY3Rpb24gYmlnSW50MnN0cih4LGJhc2UpIHtcbiAgdmFyIGksdCxzPVwiXCI7XG5cbiAgaWYgKHM2Lmxlbmd0aCE9eC5sZW5ndGgpXG4gICAgczY9ZHVwKHgpO1xuICBlbHNlXG4gICAgY29weV8oczYseCk7XG5cbiAgaWYgKGJhc2U9PS0xKSB7IC8vcmV0dXJuIHRoZSBsaXN0IG9mIGFycmF5IGNvbnRlbnRzXG4gICAgZm9yIChpPXgubGVuZ3RoLTE7aT4wO2ktLSlcbiAgICAgIHMrPXhbaV0rJywnO1xuICAgIHMrPXhbMF07XG4gIH1cbiAgZWxzZSB7IC8vcmV0dXJuIGl0IGluIHRoZSBnaXZlbiBiYXNlXG4gICAgd2hpbGUgKCFpc1plcm8oczYpKSB7XG4gICAgICB0PWRpdkludF8oczYsYmFzZSk7ICAvL3Q9czYgJSBiYXNlOyBzNj1mbG9vcihzNi9iYXNlKTtcbiAgICAgIHM9ZGlnaXRzU3RyLnN1YnN0cmluZyh0LHQrMSkrcztcbiAgICB9XG4gIH1cbiAgaWYgKHMubGVuZ3RoPT0wKVxuICAgIHM9XCIwXCI7XG4gIHJldHVybiBzO1xufVxuXG4vL3JldHVybnMgYSBkdXBsaWNhdGUgb2YgYmlnSW50IHhcbmZ1bmN0aW9uIGR1cCh4KSB7XG4gIHZhciBpO1xuICBidWZmPW5ldyBBcnJheSh4Lmxlbmd0aCk7XG4gIGNvcHlfKGJ1ZmYseCk7XG4gIHJldHVybiBidWZmO1xufVxuXG4vL2RvIHg9eSBvbiBiaWdJbnRzIHggYW5kIHkuICB4IG11c3QgYmUgYW4gYXJyYXkgYXQgbGVhc3QgYXMgYmlnIGFzIHkgKG5vdCBjb3VudGluZyB0aGUgbGVhZGluZyB6ZXJvcyBpbiB5KS5cbmZ1bmN0aW9uIGNvcHlfKHgseSkge1xuICB2YXIgaTtcbiAgdmFyIGs9eC5sZW5ndGg8eS5sZW5ndGggPyB4Lmxlbmd0aCA6IHkubGVuZ3RoO1xuICBmb3IgKGk9MDtpPGs7aSsrKVxuICAgIHhbaV09eVtpXTtcbiAgZm9yIChpPWs7aTx4Lmxlbmd0aDtpKyspXG4gICAgeFtpXT0wO1xufVxuXG4vL2RvIHg9eSBvbiBiaWdJbnQgeCBhbmQgaW50ZWdlciB5LlxuZnVuY3Rpb24gY29weUludF8oeCxuKSB7XG4gIHZhciBpLGM7XG4gIGZvciAoYz1uLGk9MDtpPHgubGVuZ3RoO2krKykge1xuICAgIHhbaV09YyAmIG1hc2s7XG4gICAgYz4+PWJwZTtcbiAgfVxufVxuXG4vL2RvIHg9eCtuIHdoZXJlIHggaXMgYSBiaWdJbnQgYW5kIG4gaXMgYW4gaW50ZWdlci5cbi8veCBtdXN0IGJlIGxhcmdlIGVub3VnaCB0byBob2xkIHRoZSByZXN1bHQuXG5mdW5jdGlvbiBhZGRJbnRfKHgsbikge1xuICB2YXIgaSxrLGMsYjtcbiAgeFswXSs9bjtcbiAgaz14Lmxlbmd0aDtcbiAgYz0wO1xuICBmb3IgKGk9MDtpPGs7aSsrKSB7XG4gICAgYys9eFtpXTtcbiAgICBiPTA7XG4gICAgaWYgKGM8MCkge1xuICAgICAgYj0tKGM+PmJwZSk7XG4gICAgICBjKz1iKnJhZGl4O1xuICAgIH1cbiAgICB4W2ldPWMgJiBtYXNrO1xuICAgIGM9KGM+PmJwZSktYjtcbiAgICBpZiAoIWMpIHJldHVybjsgLy9zdG9wIGNhcnJ5aW5nIGFzIHNvb24gYXMgdGhlIGNhcnJ5IGlzIHplcm9cbiAgfVxufVxuXG4vL3JpZ2h0IHNoaWZ0IGJpZ0ludCB4IGJ5IG4gYml0cy4gIDAgPD0gbiA8IGJwZS5cbmZ1bmN0aW9uIHJpZ2h0U2hpZnRfKHgsbikge1xuICB2YXIgaTtcbiAgdmFyIGs9TWF0aC5mbG9vcihuL2JwZSk7XG4gIGlmIChrKSB7XG4gICAgZm9yIChpPTA7aTx4Lmxlbmd0aC1rO2krKykgLy9yaWdodCBzaGlmdCB4IGJ5IGsgZWxlbWVudHNcbiAgICAgIHhbaV09eFtpK2tdO1xuICAgIGZvciAoO2k8eC5sZW5ndGg7aSsrKVxuICAgICAgeFtpXT0wO1xuICAgIG4lPWJwZTtcbiAgfVxuICBmb3IgKGk9MDtpPHgubGVuZ3RoLTE7aSsrKSB7XG4gICAgeFtpXT1tYXNrICYgKCh4W2krMV08PChicGUtbikpIHwgKHhbaV0+Pm4pKTtcbiAgfVxuICB4W2ldPj49bjtcbn1cblxuLy9kbyB4PWZsb29yKHx4fC8yKSpzZ24oeCkgZm9yIGJpZ0ludCB4IGluIDIncyBjb21wbGVtZW50XG5mdW5jdGlvbiBoYWx2ZV8oeCkge1xuICB2YXIgaTtcbiAgZm9yIChpPTA7aTx4Lmxlbmd0aC0xO2krKykge1xuICAgIHhbaV09bWFzayAmICgoeFtpKzFdPDwoYnBlLTEpKSB8ICh4W2ldPj4xKSk7XG4gIH1cbiAgeFtpXT0oeFtpXT4+MSkgfCAoeFtpXSAmIChyYWRpeD4+MSkpOyAgLy9tb3N0IHNpZ25pZmljYW50IGJpdCBzdGF5cyB0aGUgc2FtZVxufVxuXG4vL2xlZnQgc2hpZnQgYmlnSW50IHggYnkgbiBiaXRzLlxuZnVuY3Rpb24gbGVmdFNoaWZ0Xyh4LG4pIHtcbiAgdmFyIGk7XG4gIHZhciBrPU1hdGguZmxvb3Iobi9icGUpO1xuICBpZiAoaykge1xuICAgIGZvciAoaT14Lmxlbmd0aDsgaT49azsgaS0tKSAvL2xlZnQgc2hpZnQgeCBieSBrIGVsZW1lbnRzXG4gICAgICB4W2ldPXhbaS1rXTtcbiAgICBmb3IgKDtpPj0wO2ktLSlcbiAgICAgIHhbaV09MDtcbiAgICBuJT1icGU7XG4gIH1cbiAgaWYgKCFuKVxuICAgIHJldHVybjtcbiAgZm9yIChpPXgubGVuZ3RoLTE7aT4wO2ktLSkge1xuICAgIHhbaV09bWFzayAmICgoeFtpXTw8bikgfCAoeFtpLTFdPj4oYnBlLW4pKSk7XG4gIH1cbiAgeFtpXT1tYXNrICYgKHhbaV08PG4pO1xufVxuXG4vL2RvIHg9eCpuIHdoZXJlIHggaXMgYSBiaWdJbnQgYW5kIG4gaXMgYW4gaW50ZWdlci5cbi8veCBtdXN0IGJlIGxhcmdlIGVub3VnaCB0byBob2xkIHRoZSByZXN1bHQuXG5mdW5jdGlvbiBtdWx0SW50Xyh4LG4pIHtcbiAgdmFyIGksayxjLGI7XG4gIGlmICghbilcbiAgICByZXR1cm47XG4gIGs9eC5sZW5ndGg7XG4gIGM9MDtcbiAgZm9yIChpPTA7aTxrO2krKykge1xuICAgIGMrPXhbaV0qbjtcbiAgICBiPTA7XG4gICAgaWYgKGM8MCkge1xuICAgICAgYj0tKGM+PmJwZSk7XG4gICAgICBjKz1iKnJhZGl4O1xuICAgIH1cbiAgICB4W2ldPWMgJiBtYXNrO1xuICAgIGM9KGM+PmJwZSktYjtcbiAgfVxufVxuXG4vL2RvIHg9Zmxvb3IoeC9uKSBmb3IgYmlnSW50IHggYW5kIGludGVnZXIgbiwgYW5kIHJldHVybiB0aGUgcmVtYWluZGVyXG5mdW5jdGlvbiBkaXZJbnRfKHgsbikge1xuICB2YXIgaSxyPTAscztcbiAgZm9yIChpPXgubGVuZ3RoLTE7aT49MDtpLS0pIHtcbiAgICBzPXIqcmFkaXgreFtpXTtcbiAgICB4W2ldPU1hdGguZmxvb3Iocy9uKTtcbiAgICByPXMlbjtcbiAgfVxuICByZXR1cm4gcjtcbn1cblxuLy9kbyB0aGUgbGluZWFyIGNvbWJpbmF0aW9uIHg9YSp4K2IqeSBmb3IgYmlnSW50cyB4IGFuZCB5LCBhbmQgaW50ZWdlcnMgYSBhbmQgYi5cbi8veCBtdXN0IGJlIGxhcmdlIGVub3VnaCB0byBob2xkIHRoZSBhbnN3ZXIuXG5mdW5jdGlvbiBsaW5Db21iXyh4LHksYSxiKSB7XG4gIHZhciBpLGMsayxraztcbiAgaz14Lmxlbmd0aDx5Lmxlbmd0aCA/IHgubGVuZ3RoIDogeS5sZW5ndGg7XG4gIGtrPXgubGVuZ3RoO1xuICBmb3IgKGM9MCxpPTA7aTxrO2krKykge1xuICAgIGMrPWEqeFtpXStiKnlbaV07XG4gICAgeFtpXT1jICYgbWFzaztcbiAgICBjPj49YnBlO1xuICB9XG4gIGZvciAoaT1rO2k8a2s7aSsrKSB7XG4gICAgYys9YSp4W2ldO1xuICAgIHhbaV09YyAmIG1hc2s7XG4gICAgYz4+PWJwZTtcbiAgfVxufVxuXG4vL2RvIHRoZSBsaW5lYXIgY29tYmluYXRpb24geD1hKngrYiooeTw8KHlzKmJwZSkpIGZvciBiaWdJbnRzIHggYW5kIHksIGFuZCBpbnRlZ2VycyBhLCBiIGFuZCB5cy5cbi8veCBtdXN0IGJlIGxhcmdlIGVub3VnaCB0byBob2xkIHRoZSBhbnN3ZXIuXG5mdW5jdGlvbiBsaW5Db21iU2hpZnRfKHgseSxiLHlzKSB7XG4gIHZhciBpLGMsayxraztcbiAgaz14Lmxlbmd0aDx5cyt5Lmxlbmd0aCA/IHgubGVuZ3RoIDogeXMreS5sZW5ndGg7XG4gIGtrPXgubGVuZ3RoO1xuICBmb3IgKGM9MCxpPXlzO2k8aztpKyspIHtcbiAgICBjKz14W2ldK2IqeVtpLXlzXTtcbiAgICB4W2ldPWMgJiBtYXNrO1xuICAgIGM+Pj1icGU7XG4gIH1cbiAgZm9yIChpPWs7YyAmJiBpPGtrO2krKykge1xuICAgIGMrPXhbaV07XG4gICAgeFtpXT1jICYgbWFzaztcbiAgICBjPj49YnBlO1xuICB9XG59XG5cbi8vZG8geD14Kyh5PDwoeXMqYnBlKSkgZm9yIGJpZ0ludHMgeCBhbmQgeSwgYW5kIGludGVnZXJzIGEsYiBhbmQgeXMuXG4vL3ggbXVzdCBiZSBsYXJnZSBlbm91Z2ggdG8gaG9sZCB0aGUgYW5zd2VyLlxuZnVuY3Rpb24gYWRkU2hpZnRfKHgseSx5cykge1xuICB2YXIgaSxjLGssa2s7XG4gIGs9eC5sZW5ndGg8eXMreS5sZW5ndGggPyB4Lmxlbmd0aCA6IHlzK3kubGVuZ3RoO1xuICBraz14Lmxlbmd0aDtcbiAgZm9yIChjPTAsaT15cztpPGs7aSsrKSB7XG4gICAgYys9eFtpXSt5W2kteXNdO1xuICAgIHhbaV09YyAmIG1hc2s7XG4gICAgYz4+PWJwZTtcbiAgfVxuICBmb3IgKGk9aztjICYmIGk8a2s7aSsrKSB7XG4gICAgYys9eFtpXTtcbiAgICB4W2ldPWMgJiBtYXNrO1xuICAgIGM+Pj1icGU7XG4gIH1cbn1cblxuLy9kbyB4PXgtKHk8PCh5cypicGUpKSBmb3IgYmlnSW50cyB4IGFuZCB5LCBhbmQgaW50ZWdlcnMgYSxiIGFuZCB5cy5cbi8veCBtdXN0IGJlIGxhcmdlIGVub3VnaCB0byBob2xkIHRoZSBhbnN3ZXIuXG5mdW5jdGlvbiBzdWJTaGlmdF8oeCx5LHlzKSB7XG4gIHZhciBpLGMsayxraztcbiAgaz14Lmxlbmd0aDx5cyt5Lmxlbmd0aCA/IHgubGVuZ3RoIDogeXMreS5sZW5ndGg7XG4gIGtrPXgubGVuZ3RoO1xuICBmb3IgKGM9MCxpPXlzO2k8aztpKyspIHtcbiAgICBjKz14W2ldLXlbaS15c107XG4gICAgeFtpXT1jICYgbWFzaztcbiAgICBjPj49YnBlO1xuICB9XG4gIGZvciAoaT1rO2MgJiYgaTxraztpKyspIHtcbiAgICBjKz14W2ldO1xuICAgIHhbaV09YyAmIG1hc2s7XG4gICAgYz4+PWJwZTtcbiAgfVxufVxuXG4vL2RvIHg9eC15IGZvciBiaWdJbnRzIHggYW5kIHkuXG4vL3ggbXVzdCBiZSBsYXJnZSBlbm91Z2ggdG8gaG9sZCB0aGUgYW5zd2VyLlxuLy9uZWdhdGl2ZSBhbnN3ZXJzIHdpbGwgYmUgMnMgY29tcGxlbWVudFxuZnVuY3Rpb24gc3ViXyh4LHkpIHtcbiAgdmFyIGksYyxrLGtrO1xuICBrPXgubGVuZ3RoPHkubGVuZ3RoID8geC5sZW5ndGggOiB5Lmxlbmd0aDtcbiAgZm9yIChjPTAsaT0wO2k8aztpKyspIHtcbiAgICBjKz14W2ldLXlbaV07XG4gICAgeFtpXT1jICYgbWFzaztcbiAgICBjPj49YnBlO1xuICB9XG4gIGZvciAoaT1rO2MgJiYgaTx4Lmxlbmd0aDtpKyspIHtcbiAgICBjKz14W2ldO1xuICAgIHhbaV09YyAmIG1hc2s7XG4gICAgYz4+PWJwZTtcbiAgfVxufVxuXG4vL2RvIHg9eCt5IGZvciBiaWdJbnRzIHggYW5kIHkuXG4vL3ggbXVzdCBiZSBsYXJnZSBlbm91Z2ggdG8gaG9sZCB0aGUgYW5zd2VyLlxuZnVuY3Rpb24gYWRkXyh4LHkpIHtcbiAgdmFyIGksYyxrLGtrO1xuICBrPXgubGVuZ3RoPHkubGVuZ3RoID8geC5sZW5ndGggOiB5Lmxlbmd0aDtcbiAgZm9yIChjPTAsaT0wO2k8aztpKyspIHtcbiAgICBjKz14W2ldK3lbaV07XG4gICAgeFtpXT1jICYgbWFzaztcbiAgICBjPj49YnBlO1xuICB9XG4gIGZvciAoaT1rO2MgJiYgaTx4Lmxlbmd0aDtpKyspIHtcbiAgICBjKz14W2ldO1xuICAgIHhbaV09YyAmIG1hc2s7XG4gICAgYz4+PWJwZTtcbiAgfVxufVxuXG4vL2RvIHg9eCp5IGZvciBiaWdJbnRzIHggYW5kIHkuICBUaGlzIGlzIGZhc3RlciB3aGVuIHk8eC5cbmZ1bmN0aW9uIG11bHRfKHgseSkge1xuICB2YXIgaTtcbiAgaWYgKHNzLmxlbmd0aCE9Mip4Lmxlbmd0aClcbiAgICBzcz1uZXcgQXJyYXkoMip4Lmxlbmd0aCk7XG4gIGNvcHlJbnRfKHNzLDApO1xuICBmb3IgKGk9MDtpPHkubGVuZ3RoO2krKylcbiAgICBpZiAoeVtpXSlcbiAgICAgIGxpbkNvbWJTaGlmdF8oc3MseCx5W2ldLGkpOyAgIC8vc3M9MSpzcyt5W2ldKih4PDwoaSpicGUpKVxuICBjb3B5Xyh4LHNzKTtcbn1cblxuLy9kbyB4PXggbW9kIG4gZm9yIGJpZ0ludHMgeCBhbmQgbi5cbmZ1bmN0aW9uIG1vZF8oeCxuKSB7XG4gIGlmIChzNC5sZW5ndGghPXgubGVuZ3RoKVxuICAgIHM0PWR1cCh4KTtcbiAgZWxzZVxuICAgIGNvcHlfKHM0LHgpO1xuICBpZiAoczUubGVuZ3RoIT14Lmxlbmd0aClcbiAgICBzNT1kdXAoeCk7XG4gIGRpdmlkZV8oczQsbixzNSx4KTsgIC8veCA9IHJlbWFpbmRlciBvZiBzNCAvIG5cbn1cblxuLy9kbyB4PXgqeSBtb2QgbiBmb3IgYmlnSW50cyB4LHksbi5cbi8vZm9yIGdyZWF0ZXIgc3BlZWQsIGxldCB5PHguXG5mdW5jdGlvbiBtdWx0TW9kXyh4LHksbikge1xuICB2YXIgaTtcbiAgaWYgKHMwLmxlbmd0aCE9Mip4Lmxlbmd0aClcbiAgICBzMD1uZXcgQXJyYXkoMip4Lmxlbmd0aCk7XG4gIGNvcHlJbnRfKHMwLDApO1xuICBmb3IgKGk9MDtpPHkubGVuZ3RoO2krKylcbiAgICBpZiAoeVtpXSlcbiAgICAgIGxpbkNvbWJTaGlmdF8oczAseCx5W2ldLGkpOyAgIC8vczA9MSpzMCt5W2ldKih4PDwoaSpicGUpKVxuICBtb2RfKHMwLG4pO1xuICBjb3B5Xyh4LHMwKTtcbn1cblxuLy9kbyB4PXgqeCBtb2QgbiBmb3IgYmlnSW50cyB4LG4uXG5mdW5jdGlvbiBzcXVhcmVNb2RfKHgsbikge1xuICB2YXIgaSxqLGQsYyxreCxrbixrO1xuICBmb3IgKGt4PXgubGVuZ3RoOyBreD4wICYmICF4W2t4LTFdOyBreC0tKTsgIC8vaWdub3JlIGxlYWRpbmcgemVyb3MgaW4geFxuICBrPWt4Pm4ubGVuZ3RoID8gMipreCA6IDIqbi5sZW5ndGg7IC8vaz0jIGVsZW1lbnRzIGluIHRoZSBwcm9kdWN0LCB3aGljaCBpcyB0d2ljZSB0aGUgZWxlbWVudHMgaW4gdGhlIGxhcmdlciBvZiB4IGFuZCBuXG4gIGlmIChzMC5sZW5ndGghPWspXG4gICAgczA9bmV3IEFycmF5KGspO1xuICBjb3B5SW50XyhzMCwwKTtcbiAgZm9yIChpPTA7aTxreDtpKyspIHtcbiAgICBjPXMwWzIqaV0reFtpXSp4W2ldO1xuICAgIHMwWzIqaV09YyAmIG1hc2s7XG4gICAgYz4+PWJwZTtcbiAgICBmb3IgKGo9aSsxO2o8a3g7aisrKSB7XG4gICAgICBjPXMwW2kral0rMip4W2ldKnhbal0rYztcbiAgICAgIHMwW2kral09KGMgJiBtYXNrKTtcbiAgICAgIGM+Pj1icGU7XG4gICAgfVxuICAgIHMwW2kra3hdPWM7XG4gIH1cbiAgbW9kXyhzMCxuKTtcbiAgY29weV8oeCxzMCk7XG59XG5cbi8vcmV0dXJuIHggd2l0aCBleGFjdGx5IGsgbGVhZGluZyB6ZXJvIGVsZW1lbnRzXG5mdW5jdGlvbiB0cmltKHgsaykge1xuICB2YXIgaSx5O1xuICBmb3IgKGk9eC5sZW5ndGg7IGk+MCAmJiAheFtpLTFdOyBpLS0pO1xuICB5PW5ldyBBcnJheShpK2spO1xuICBjb3B5Xyh5LHgpO1xuICByZXR1cm4geTtcbn1cblxuLy9kbyB4PXgqKnkgbW9kIG4sIHdoZXJlIHgseSxuIGFyZSBiaWdJbnRzIGFuZCAqKiBpcyBleHBvbmVudGlhdGlvbi4gIDAqKjA9MS5cbi8vdGhpcyBpcyBmYXN0ZXIgd2hlbiBuIGlzIG9kZC4gIHggdXN1YWxseSBuZWVkcyB0byBoYXZlIGFzIG1hbnkgZWxlbWVudHMgYXMgbi5cbmZ1bmN0aW9uIHBvd01vZF8oeCx5LG4pIHtcbiAgdmFyIGsxLGsyLGtuLG5wO1xuICBpZihzNy5sZW5ndGghPW4ubGVuZ3RoKVxuICAgIHM3PWR1cChuKTtcblxuICAvL2ZvciBldmVuIG1vZHVsdXMsIHVzZSBhIHNpbXBsZSBzcXVhcmUtYW5kLW11bHRpcGx5IGFsZ29yaXRobSxcbiAgLy9yYXRoZXIgdGhhbiB1c2luZyB0aGUgbW9yZSBjb21wbGV4IE1vbnRnb21lcnkgYWxnb3JpdGhtLlxuICBpZiAoKG5bMF0mMSk9PTApIHtcbiAgICBjb3B5XyhzNyx4KTtcbiAgICBjb3B5SW50Xyh4LDEpO1xuICAgIHdoaWxlKCFlcXVhbHNJbnQoeSwwKSkge1xuICAgICAgaWYgKHlbMF0mMSlcbiAgICAgICAgbXVsdE1vZF8oeCxzNyxuKTtcbiAgICAgIGRpdkludF8oeSwyKTtcbiAgICAgIHNxdWFyZU1vZF8oczcsbik7XG4gICAgfVxuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vY2FsY3VsYXRlIG5wIGZyb20gbiBmb3IgdGhlIE1vbnRnb21lcnkgbXVsdGlwbGljYXRpb25zXG4gIGNvcHlJbnRfKHM3LDApO1xuICBmb3IgKGtuPW4ubGVuZ3RoO2tuPjAgJiYgIW5ba24tMV07a24tLSk7XG4gIG5wPXJhZGl4LWludmVyc2VNb2RJbnQobW9kSW50KG4scmFkaXgpLHJhZGl4KTtcbiAgczdba25dPTE7XG4gIG11bHRNb2RfKHggLHM3LG4pOyAgIC8vIHggPSB4ICogMioqKGtuKmJwKSBtb2QgblxuXG4gIGlmIChzMy5sZW5ndGghPXgubGVuZ3RoKVxuICAgIHMzPWR1cCh4KTtcbiAgZWxzZVxuICAgIGNvcHlfKHMzLHgpO1xuXG4gIGZvciAoazE9eS5sZW5ndGgtMTtrMT4wICYgIXlbazFdOyBrMS0tKTsgIC8vazE9Zmlyc3Qgbm9uemVybyBlbGVtZW50IG9mIHlcbiAgaWYgKHlbazFdPT0wKSB7ICAvL2FueXRoaW5nIHRvIHRoZSAwdGggcG93ZXIgaXMgMVxuICAgIGNvcHlJbnRfKHgsMSk7XG4gICAgcmV0dXJuO1xuICB9XG4gIGZvciAoazI9MTw8KGJwZS0xKTtrMiAmJiAhKHlbazFdICYgazIpOyBrMj4+PTEpOyAgLy9rMj1wb3NpdGlvbiBvZiBmaXJzdCAxIGJpdCBpbiB5W2sxXVxuICBmb3IgKDs7KSB7XG4gICAgaWYgKCEoazI+Pj0xKSkgeyAgLy9sb29rIGF0IG5leHQgYml0IG9mIHlcbiAgICAgIGsxLS07XG4gICAgICBpZiAoazE8MCkge1xuICAgICAgICBtb250Xyh4LG9uZSxuLG5wKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgazI9MTw8KGJwZS0xKTtcbiAgICB9XG4gICAgbW9udF8oeCx4LG4sbnApO1xuXG4gICAgaWYgKGsyICYgeVtrMV0pIC8vaWYgbmV4dCBiaXQgaXMgYSAxXG4gICAgICBtb250Xyh4LHMzLG4sbnApO1xuICB9XG59XG5cblxuLy9kbyB4PXgqeSpSaSBtb2QgbiBmb3IgYmlnSW50cyB4LHksbixcbi8vICB3aGVyZSBSaSA9IDIqKigta24qYnBlKSBtb2QgbiwgYW5kIGtuIGlzIHRoZVxuLy8gIG51bWJlciBvZiBlbGVtZW50cyBpbiB0aGUgbiBhcnJheSwgbm90XG4vLyAgY291bnRpbmcgbGVhZGluZyB6ZXJvcy5cbi8veCBhcnJheSBtdXN0IGhhdmUgYXQgbGVhc3QgYXMgbWFueSBlbGVtbnRzIGFzIHRoZSBuIGFycmF5XG4vL0l0J3MgT0sgaWYgeCBhbmQgeSBhcmUgdGhlIHNhbWUgdmFyaWFibGUuXG4vL211c3QgaGF2ZTpcbi8vICB4LHkgPCBuXG4vLyAgbiBpcyBvZGRcbi8vICBucCA9IC0obl4oLTEpKSBtb2QgcmFkaXhcbmZ1bmN0aW9uIG1vbnRfKHgseSxuLG5wKSB7XG4gIHZhciBpLGosYyx1aSx0LGtzO1xuICB2YXIga249bi5sZW5ndGg7XG4gIHZhciBreT15Lmxlbmd0aDtcblxuICBpZiAoc2EubGVuZ3RoIT1rbilcbiAgICBzYT1uZXcgQXJyYXkoa24pO1xuXG4gIGNvcHlJbnRfKHNhLDApO1xuXG4gIGZvciAoO2tuPjAgJiYgbltrbi0xXT09MDtrbi0tKTsgLy9pZ25vcmUgbGVhZGluZyB6ZXJvcyBvZiBuXG4gIGZvciAoO2t5PjAgJiYgeVtreS0xXT09MDtreS0tKTsgLy9pZ25vcmUgbGVhZGluZyB6ZXJvcyBvZiB5XG4gIGtzPXNhLmxlbmd0aC0xOyAvL3NhIHdpbGwgbmV2ZXIgaGF2ZSBtb3JlIHRoYW4gdGhpcyBtYW55IG5vbnplcm8gZWxlbWVudHMuXG5cbiAgLy90aGUgZm9sbG93aW5nIGxvb3AgY29uc3VtZXMgOTUlIG9mIHRoZSBydW50aW1lIGZvciByYW5kVHJ1ZVByaW1lXygpIGFuZCBwb3dNb2RfKCkgZm9yIGxhcmdlIG51bWJlcnNcbiAgZm9yIChpPTA7IGk8a247IGkrKykge1xuICAgIHQ9c2FbMF0reFtpXSp5WzBdO1xuICAgIHVpPSgodCAmIG1hc2spICogbnApICYgbWFzazsgIC8vdGhlIGlubmVyIFwiJiBtYXNrXCIgd2FzIG5lZWRlZCBvbiBTYWZhcmkgKGJ1dCBub3QgTVNJRSkgYXQgb25lIHRpbWVcbiAgICBjPSh0K3VpKm5bMF0pID4+IGJwZTtcbiAgICB0PXhbaV07XG5cbiAgICAvL2RvIHNhPShzYSt4W2ldKnkrdWkqbikvYiAgIHdoZXJlIGI9MioqYnBlLiAgTG9vcCBpcyB1bnJvbGxlZCA1LWZvbGQgZm9yIHNwZWVkXG4gICAgaj0xO1xuICAgIGZvciAoO2o8a3ktNDspIHsgYys9c2Fbal0rdWkqbltqXSt0Knlbal07ICAgc2Fbai0xXT1jICYgbWFzazsgICBjPj49YnBlOyAgIGorKztcbiAgICAgICAgICAgICAgICAgICAgIGMrPXNhW2pdK3VpKm5bal0rdCp5W2pdOyAgIHNhW2otMV09YyAmIG1hc2s7ICAgYz4+PWJwZTsgICBqKys7XG4gICAgICAgICAgICAgICAgICAgICBjKz1zYVtqXSt1aSpuW2pdK3QqeVtqXTsgICBzYVtqLTFdPWMgJiBtYXNrOyAgIGM+Pj1icGU7ICAgaisrO1xuICAgICAgICAgICAgICAgICAgICAgYys9c2Fbal0rdWkqbltqXSt0Knlbal07ICAgc2Fbai0xXT1jICYgbWFzazsgICBjPj49YnBlOyAgIGorKztcbiAgICAgICAgICAgICAgICAgICAgIGMrPXNhW2pdK3VpKm5bal0rdCp5W2pdOyAgIHNhW2otMV09YyAmIG1hc2s7ICAgYz4+PWJwZTsgICBqKys7IH1cbiAgICBmb3IgKDtqPGt5OykgICB7IGMrPXNhW2pdK3VpKm5bal0rdCp5W2pdOyAgIHNhW2otMV09YyAmIG1hc2s7ICAgYz4+PWJwZTsgICBqKys7IH1cbiAgICBmb3IgKDtqPGtuLTQ7KSB7IGMrPXNhW2pdK3VpKm5bal07ICAgICAgICAgIHNhW2otMV09YyAmIG1hc2s7ICAgYz4+PWJwZTsgICBqKys7XG4gICAgICAgICAgICAgICAgICAgICBjKz1zYVtqXSt1aSpuW2pdOyAgICAgICAgICBzYVtqLTFdPWMgJiBtYXNrOyAgIGM+Pj1icGU7ICAgaisrO1xuICAgICAgICAgICAgICAgICAgICAgYys9c2Fbal0rdWkqbltqXTsgICAgICAgICAgc2Fbai0xXT1jICYgbWFzazsgICBjPj49YnBlOyAgIGorKztcbiAgICAgICAgICAgICAgICAgICAgIGMrPXNhW2pdK3VpKm5bal07ICAgICAgICAgIHNhW2otMV09YyAmIG1hc2s7ICAgYz4+PWJwZTsgICBqKys7XG4gICAgICAgICAgICAgICAgICAgICBjKz1zYVtqXSt1aSpuW2pdOyAgICAgICAgICBzYVtqLTFdPWMgJiBtYXNrOyAgIGM+Pj1icGU7ICAgaisrOyB9XG4gICAgZm9yICg7ajxrbjspICAgeyBjKz1zYVtqXSt1aSpuW2pdOyAgICAgICAgICBzYVtqLTFdPWMgJiBtYXNrOyAgIGM+Pj1icGU7ICAgaisrOyB9XG4gICAgZm9yICg7ajxrczspICAgeyBjKz1zYVtqXTsgICAgICAgICAgICAgICAgICBzYVtqLTFdPWMgJiBtYXNrOyAgIGM+Pj1icGU7ICAgaisrOyB9XG4gICAgc2Fbai0xXT1jICYgbWFzaztcbiAgfVxuXG4gIGlmICghZ3JlYXRlcihuLHNhKSlcbiAgICBzdWJfKHNhLG4pO1xuICBjb3B5Xyh4LHNhKTtcbn1cblxuIiwiLy9VVElMU1xudmFyIGVuY29kaW5nX3RhYmxlID0gJ0FCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5Ky8nO1xudmFyIGRlY29kaW5nX3RhYmxlID0gWywsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCw2MiwsLCw2Myw1Miw1Myw1NCw1NSw1NixcbiAgICAgICAgICAgNTcsNTgsNTksNjAsNjEsLCwsLCwsLDAsMSwyLDMsNCw1LDYsNyw4LDksMTAsMTEsMTIsMTMsMTQsMTUsMTYsMTcsMTgsXG4gICAgICAgICAgIDE5LDIwLDIxLDIyLDIzLDI0LDI1LCwsLCwsLDI2LDI3LDI4LDI5LDMwLDMxLDMyLDMzLDM0LDM1LDM2LDM3LDM4LDM5LFxuICAgICAgICAgICA0MCw0MSw0Miw0Myw0NCw0NSw0Niw0Nyw0OCw0OSw1MCw1MV07XG52YXIgZW5jb2RpbmdfdGFibGVfaGV4ID0gJzAxMjM0NTY3ODlhYmNkZWYnO1xudmFyIGRlY29kaW5nX3RhYmxlX2hleCA9IFssLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwwLDEsMiwzLDQsNSw2LDcsOCw5LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwxMCwxMSwxMiwxMywxNCwxNV07XG52YXIgbW9kX3RhYmxlID0gWzAsIDIsIDFdO1xuXG4vLyBSZXR1cm5zIGJhc2U2NCBlbmNvZGVkIHN0cmluZywgZXhwZWN0cyBVaW50OEFycmF5XG5leHBvcnQgZnVuY3Rpb24gYmFzZTY0X2VuY29kZShkYXRhKSB7XG4gICAgaWYgKCFkYXRhLmJ1ZmZlcikge1xuICAgICAgICBkYXRhID0gbmV3IFVpbnQ4QXJyYXkoZGF0YSk7XG4gICAgfVxuICAgIHZhciBpbnB1dF9sZW5ndGggPSBkYXRhLmJ5dGVMZW5ndGg7XG4gICAgdmFyIG91dHB1dF9sZW5ndGggPSA0ICogKE1hdGguZmxvb3IoKGlucHV0X2xlbmd0aCArIDIpIC8gMykpO1xuXG4gICAgdmFyIGVuY29kZWRfZGF0YSA9IG5ldyBBcnJheShvdXRwdXRfbGVuZ3RoKTtcblxuICAgIGZvciAodmFyIGkgPSAwLCBqID0gMDsgaSA8IGlucHV0X2xlbmd0aDspIHtcbiAgICAgICAgdmFyIG9jdGV0X2EgPSBpIDwgaW5wdXRfbGVuZ3RoID8gZGF0YVtpKytdIDogMDtcbiAgICAgICAgdmFyIG9jdGV0X2IgPSBpIDwgaW5wdXRfbGVuZ3RoID8gZGF0YVtpKytdIDogMDtcbiAgICAgICAgdmFyIG9jdGV0X2MgPSBpIDwgaW5wdXRfbGVuZ3RoID8gZGF0YVtpKytdIDogMDtcblxuICAgICAgICB2YXIgdHJpcGxlID0gKG9jdGV0X2EgPDwgMHgxMCkgKyAob2N0ZXRfYiA8PCAweDA4KSArIG9jdGV0X2M7XG5cbiAgICAgICAgZW5jb2RlZF9kYXRhW2orK10gPSBlbmNvZGluZ190YWJsZVsodHJpcGxlID4+IDMgKiA2KSAmIDB4M0ZdO1xuICAgICAgICBlbmNvZGVkX2RhdGFbaisrXSA9IGVuY29kaW5nX3RhYmxlWyh0cmlwbGUgPj4gMiAqIDYpICYgMHgzRl07XG4gICAgICAgIGVuY29kZWRfZGF0YVtqKytdID0gZW5jb2RpbmdfdGFibGVbKHRyaXBsZSA+PiAxICogNikgJiAweDNGXTtcbiAgICAgICAgZW5jb2RlZF9kYXRhW2orK10gPSBlbmNvZGluZ190YWJsZVsodHJpcGxlID4+IDAgKiA2KSAmIDB4M0ZdO1xuICAgIH1cblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbW9kX3RhYmxlW2lucHV0X2xlbmd0aCAlIDNdOyBpKyspXG4gICAgICAgIGVuY29kZWRfZGF0YVtvdXRwdXRfbGVuZ3RoIC0gMSAtIGldID0gJz0nO1xuXG4gICAgcmV0dXJuIGVuY29kZWRfZGF0YS5qb2luKCcnKTtcbn1cblxuLy9SZXR1cm5zIFVpbnQ4QXJyYXksIGV4cGVjdHMgYmFzZTY0IGVuY29kZWQgc3RyaW5nXG5leHBvcnQgZnVuY3Rpb24gYmFzZTY0X2RlY29kZShkYXRhKSB7XG4gICAgdmFyIGlucHV0X2xlbmd0aCA9IGRhdGEubGVuZ3RoO1xuICAgIGlmIChpbnB1dF9sZW5ndGggJSA0ICE9PSAwKSByZXR1cm47XG5cbiAgICB2YXIgb3V0cHV0X2xlbmd0aCA9IE1hdGguZmxvb3IoaW5wdXRfbGVuZ3RoIC8gNCkgKiAzO1xuICAgIGlmIChkYXRhW2lucHV0X2xlbmd0aCAtIDFdID09PSAnPScpIG91dHB1dF9sZW5ndGgtLTtcbiAgICBpZiAoZGF0YVtpbnB1dF9sZW5ndGggLSAyXSA9PT0gJz0nKSBvdXRwdXRfbGVuZ3RoLS07XG5cbiAgICB2YXIgZGVjb2RlZF9kYXRhID0gbmV3IFVpbnQ4QXJyYXkob3V0cHV0X2xlbmd0aCk7XG4gICAgZm9yICh2YXIgaSA9IDAsIGogPSAwOyBpIDwgaW5wdXRfbGVuZ3RoOykge1xuICAgICAgICB2YXIgc2V4dGV0X2EgPSBkYXRhW2ldID09PSAnPScgPyAwICYgaSsrIDogZGVjb2RpbmdfdGFibGVbZGF0YVtpKytdLmNoYXJDb2RlQXQoKV07IC8vIFRPRE86IGNoZWNrIGFjY2Vzc2VzIGFyZSBjb3JyZWN0XG4gICAgICAgIHZhciBzZXh0ZXRfYiA9IGRhdGFbaV0gPT09ICc9JyA/IDAgJiBpKysgOiBkZWNvZGluZ190YWJsZVtkYXRhW2krK10uY2hhckNvZGVBdCgpXTtcbiAgICAgICAgdmFyIHNleHRldF9jID0gZGF0YVtpXSA9PT0gJz0nID8gMCAmIGkrKyA6IGRlY29kaW5nX3RhYmxlW2RhdGFbaSsrXS5jaGFyQ29kZUF0KCldO1xuICAgICAgICB2YXIgc2V4dGV0X2QgPSBkYXRhW2ldID09PSAnPScgPyAwICYgaSsrIDogZGVjb2RpbmdfdGFibGVbZGF0YVtpKytdLmNoYXJDb2RlQXQoKV07XG5cbiAgICAgICAgdmFyIHRyaXBsZSA9IChzZXh0ZXRfYSA8PCAzICogNilcbiAgICAgICAgKyAoc2V4dGV0X2IgPDwgMiAqIDYpXG4gICAgICAgICsgKHNleHRldF9jIDw8IDEgKiA2KVxuICAgICAgICArIChzZXh0ZXRfZCA8PCAwICogNik7XG4gICAgICAgIGlmIChqIDwgb3V0cHV0X2xlbmd0aCkgZGVjb2RlZF9kYXRhW2orK10gPSAodHJpcGxlID4+IDIgKiA4KSAmIDB4RkY7XG4gICAgICAgIGlmIChqIDwgb3V0cHV0X2xlbmd0aCkgZGVjb2RlZF9kYXRhW2orK10gPSAodHJpcGxlID4+IDEgKiA4KSAmIDB4RkY7XG4gICAgICAgIGlmIChqIDwgb3V0cHV0X2xlbmd0aCkgZGVjb2RlZF9kYXRhW2orK10gPSAodHJpcGxlID4+IDAgKiA4KSAmIDB4RkY7XG4gICAgfVxuICAgIHJldHVybiBkZWNvZGVkX2RhdGE7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBieXRlQXJyYXlUb0hleFN0cmluZyhieXRlQXJyYXkpIHtcbiAgICB2YXIgaGV4U3RyaW5nID0gJyc7XG4gICAgdmFyIG5leHRIZXhCeXRlO1xuICAgIGZvciAodmFyIGk9MDsgaTxieXRlQXJyYXkuYnl0ZUxlbmd0aDsgaSsrKSB7XG4gICAgICAgIG5leHRIZXhCeXRlID0gYnl0ZUFycmF5W2ldLnRvU3RyaW5nKDE2KTsgICAgLy8gSW50ZWdlciB0byBiYXNlIDE2XG4gICAgICAgIGlmIChuZXh0SGV4Qnl0ZS5sZW5ndGggPCAyKSB7XG4gICAgICAgICAgICBuZXh0SGV4Qnl0ZSA9IFwiMFwiICsgbmV4dEhleEJ5dGU7ICAgICAgICAvLyBPdGhlcndpc2UgMTAgYmVjb21lcyBqdXN0IGEgaW5zdGVhZCBvZiAwYVxuICAgICAgICB9XG4gICAgICAgIGhleFN0cmluZyArPSBuZXh0SGV4Qnl0ZTtcbiAgICB9XG4gICAgcmV0dXJuIGhleFN0cmluZztcbn1cbmV4cG9ydCBmdW5jdGlvbiBoZXhTdHJpbmdUb0J5dGVBcnJheShoZXhTdHJpbmcpIHtcbiAgICBpZiAoaGV4U3RyaW5nLmxlbmd0aCAlIDIgIT09IDApIHtcbiAgICAgICAgdGhyb3cgXCJNdXN0IGhhdmUgYW4gZXZlbiBudW1iZXIgb2YgaGV4IGRpZ2l0cyB0byBjb252ZXJ0IHRvIGJ5dGVzXCI7XG4gICAgfVxuICAgIHZhciBudW1CeXRlcyA9IGhleFN0cmluZy5sZW5ndGggLyAyO1xuICAgIHZhciBieXRlQXJyYXkgPSBuZXcgVWludDhBcnJheShudW1CeXRlcyk7XG4gICAgZm9yICh2YXIgaT0wOyBpPG51bUJ5dGVzOyBpKyspIHtcbiAgICAgICAgYnl0ZUFycmF5W2ldID0gcGFyc2VJbnQoaGV4U3RyaW5nLnN1YnN0cihpKjIsIDIpLCAxNik7XG4gICAgfVxuICAgIHJldHVybiBieXRlQXJyYXk7XG59XG5leHBvcnQgZnVuY3Rpb24gc3RyaW5nVG9CeXRlQXJyYXkocyl7XG4gICAgaWYgKHR5cGVvZihUZXh0RW5jb2RlcikgIT0gJ3VuZGVmaW5lZCcpe1xuICAgICAgIHZhciBlbmNvZGVyID0gbmV3IFRleHRFbmNvZGVyO1xuICAgICAgIHJldHVybiBlbmNvZGVyLmVuY29kZShzKTtcbiAgICB9XG5cbiAgICAvLyBPdGhlcndpc2UsIGZhbGwgYmFjayB0byA3LWJpdCBBU0NJSSBvbmx5XG4gICAgdmFyIHJlc3VsdCA9IG5ldyBVaW50OEFycmF5KHMubGVuZ3RoKTtcbiAgICBmb3IgKHZhciBpPTA7IGk8cy5sZW5ndGg7IGkrKyl7XG4gICAgICAgIHJlc3VsdFtpXSA9IHMuY2hhckNvZGVBdChpKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cbmV4cG9ydCBmdW5jdGlvbiBieXRlQXJyYXlUb1N0cmluZyhieXRlQXJyYXkpe1xuICAgIGlmKHR5cGVvZihUZXh0RW5jb2RlcikgIT0gJ3VuZGVmaW5lZCcpe1xuICAgICAgICB2YXIgZGVjb2RlciA9IG5ldyBUZXh0RGVjb2RlcjtcbiAgICAgICAgcmV0dXJuIGRlY29kZXIuZGVjb2RlKGJ5dGVBcnJheSk7XG4gICAgfVxuXG4gICAgLy8gT3RoZXJ3aXNlLCBmYWxsIGJhY2sgdG8gNy1iaXQgQVNDSUkgb25seVxuICAgIHZhciByZXN1bHQgPSBcIlwiO1xuICAgIGZvciAodmFyIGk9MDsgaTxieXRlQXJyYXkuYnl0ZUxlbmd0aDsgaSsrKXtcbiAgICAgICAgcmVzdWx0ICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYnl0ZUFycmF5W2ldKVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuLyogVGhpcyBtZXRob2Qgd2lsbCBlbnN1cmUgdGhhdCB3ZSBoYXZlIHRoZSBzYW1lIGxlbmd0aCBmb3IgYWxsIHRoZSBtZXNhZ2VzXG4qL1xuZXhwb3J0IGZ1bmN0aW9uIHBhZE1lc3NhZ2UobXNnKXtcblx0Y29uc3QgbXhMZW4gPSAxNDAwMDtcblx0dmFyIHBhZExlbiA9IChteExlbiAtIG1zZy5sZW5ndGgpICsgMTtcblx0aWYgKHBhZExlbiA8IDApIHtcblx0XHR0aHJvdyAnbXNndG9vYmlnJztcblx0fVxuXHRyZXR1cm4gbXNnICsgbmV3IEFycmF5KHBhZExlbikuam9pbihcIlxcblwiKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzSnNvbihzdHIpIHtcbi8vIElmIGNhbiBiZSBwYXJzZWQgdGhhdCBtZWFucyBpdCdzIGEgc3RyLlxuLy8gSWYgY2Fubm90IGJlIHBhcnNlZCBhbmQgaXMgYW4gb2JqZWN0IHRoZW4gaXQncyBhIEpTT04uXG4gIHRyeSB7XG4gICAgICBKU09OLnBhcnNlKHN0cik7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgXHRpZih0eXBlb2Ygc3RyID09J29iamVjdCcpXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBoZXhUb0JpbmFyeShzKSB7XG4gICAgdmFyIGksIGssIHBhcnQsIHJldCA9ICcnO1xuICAgIC8vIGxvb2t1cCB0YWJsZSBmb3IgZWFzaWVyIGNvbnZlcnNpb24uICcwJyBjaGFyYWN0ZXJzIGFyZSBwYWRkZWQgZm9yICcxJyB0byAnNydcbiAgICB2YXIgbG9va3VwVGFibGUgPSB7XG4gICAgICAgICcwJzogJzAwMDAnLCAnMSc6ICcwMDAxJywgJzInOiAnMDAxMCcsICczJzogJzAwMTEnLCAnNCc6ICcwMTAwJyxcbiAgICAgICAgJzUnOiAnMDEwMScsICc2JzogJzAxMTAnLCAnNyc6ICcwMTExJywgJzgnOiAnMTAwMCcsICc5JzogJzEwMDEnLFxuICAgICAgICAnYSc6ICcxMDEwJywgJ2InOiAnMTAxMScsICdjJzogJzExMDAnLCAnZCc6ICcxMTAxJyxcbiAgICAgICAgJ2UnOiAnMTExMCcsICdmJzogJzExMTEnLFxuICAgICAgICAnQSc6ICcxMDEwJywgJ0InOiAnMTAxMScsICdDJzogJzExMDAnLCAnRCc6ICcxMTAxJyxcbiAgICAgICAgJ0UnOiAnMTExMCcsICdGJzogJzExMTEnXG4gICAgfTtcbiAgICBmb3IgKGkgPSAwOyBpIDwgcy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBpZiAobG9va3VwVGFibGUuaGFzT3duUHJvcGVydHkoc1tpXSkpIHtcbiAgICAgICAgICAgIHJldCArPSBsb29rdXBUYWJsZVtzW2ldXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB7IHZhbGlkOiBmYWxzZSB9O1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB7IHZhbGlkOiB0cnVlLCByZXN1bHQ6IHJldCB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYmFzZTY0VG9CeXRlQXJyYXkoYmFzZTY0U3RyaW5nKXtcbiAgICB2YXIgYmluYXJ5U3RyaW5nID0gYXRvYihiYXNlNjRTdHJpbmcpO1xuICAgIHZhciBieXRlQXJyYXkgPSBuZXcgVWludDhBcnJheShiaW5hcnlTdHJpbmcubGVuZ3RoKTtcbiAgICBmb3IgKHZhciBpPTA7IGk8YmluYXJ5U3RyaW5nLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgYnl0ZUFycmF5W2ldICs9IGJpbmFyeVN0cmluZy5jaGFyQ29kZUF0KGkpO1xuICAgIH1cbiAgICByZXR1cm4gYnl0ZUFycmF5O1xufVxuXG5mdW5jdGlvbiBieXRlQXJyYXlUb0Jhc2U2NChieXRlQXJyYXkpe1xuICAgIHZhciBiaW5hcnlTdHJpbmcgPSBcIlwiO1xuICAgIGZvciAodmFyIGk9MDsgaTxieXRlQXJyYXkuYnl0ZUxlbmd0aDsgaSsrKXtcbiAgICAgICAgYmluYXJ5U3RyaW5nICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYnl0ZUFycmF5W2ldKTtcbiAgICB9XG4gICAgdmFyIGJhc2U2NFN0cmluZyA9IGJ0b2EoYmluYXJ5U3RyaW5nKTtcbiAgICByZXR1cm4gYmFzZTY0U3RyaW5nO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYmFzZTY0VXJsRGVjb2RlKHN0cikge1xuICBzdHIgPSBhdG9iKHN0ci5yZXBsYWNlKC8tL2csICcrJykucmVwbGFjZSgvXy9nLCAnLycpKTtcbiAgdmFyIGJ1ZmZlciA9IG5ldyBVaW50OEFycmF5KHN0ci5sZW5ndGgpO1xuICBmb3IodmFyIGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgKytpKSB7XG4gICAgYnVmZmVyW2ldID0gc3RyLmNoYXJDb2RlQXQoaSk7XG4gIH1cbiAgcmV0dXJuIGJ1ZmZlcjtcbn1cbmV4cG9ydCBmdW5jdGlvbiBoMmQocykge1xuXG4gICAgZnVuY3Rpb24gYWRkKHgsIHkpIHtcbiAgICAgICAgdmFyIGMgPSAwLCByID0gW107XG4gICAgICAgIHZhciB4ID0geC5zcGxpdCgnJykubWFwKE51bWJlcik7XG4gICAgICAgIHZhciB5ID0geS5zcGxpdCgnJykubWFwKE51bWJlcik7XG4gICAgICAgIHdoaWxlKHgubGVuZ3RoIHx8IHkubGVuZ3RoKSB7XG4gICAgICAgICAgICB2YXIgcyA9ICh4LnBvcCgpIHx8IDApICsgKHkucG9wKCkgfHwgMCkgKyBjO1xuICAgICAgICAgICAgci51bnNoaWZ0KHMgPCAxMCA/IHMgOiBzIC0gMTApO1xuICAgICAgICAgICAgYyA9IHMgPCAxMCA/IDAgOiAxO1xuICAgICAgICB9XG4gICAgICAgIGlmKGMpIHIudW5zaGlmdChjKTtcbiAgICAgICAgcmV0dXJuIHIuam9pbignJyk7XG4gICAgfVxuXG4gICAgdmFyIGRlYyA9ICcwJztcbiAgICBzLnNwbGl0KCcnKS5mb3JFYWNoKGZ1bmN0aW9uKGNocikge1xuICAgICAgICB2YXIgbiA9IHBhcnNlSW50KGNociwgMTYpO1xuICAgICAgICBmb3IodmFyIHQgPSA4OyB0OyB0ID4+PSAxKSB7XG4gICAgICAgICAgICBkZWMgPSBhZGQoZGVjLCBkZWMpO1xuICAgICAgICAgICAgaWYobiAmIHQpIGRlYyA9IGFkZChkZWMsICcxJyk7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gZGVjO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2hhMShtc2cpIHtcbiAgICBsZXQgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCl7XG4gICAgICBjcnlwdG8uc3VidGxlLmRpZ2VzdChcIlNIQS0xXCIsIHN0cmluZ1RvQnl0ZUFycmF5KG1zZykpLnRoZW4oIGhhc2ggPT4ge1xuICAgICAgICByZXNvbHZlKGJ5dGVBcnJheVRvSGV4U3RyaW5nKG5ldyBVaW50OEFycmF5KGhhc2gpKSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICByZXR1cm4gcHJvbWlzZTtcbn1cblxuZnVuY3Rpb24gc2hhMjU2KG1zZykge1xuICAgIGxldCBwcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KXtcbiAgICAgIGNyeXB0by5zdWJ0bGUuZGlnZXN0KFwiU0hBLTI1NlwiLCBzdHJpbmdUb0J5dGVBcnJheShtc2cpKS50aGVuKCBoYXNoID0+IHtcbiAgICAgICAgcmVzb2x2ZShieXRlQXJyYXlUb0hleFN0cmluZyhuZXcgVWludDhBcnJheShoYXNoKSkpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHByb21pc2U7XG59XG4iLCJpbXBvcnQgeyByYW5kQmlnSW50IH0gZnJvbSAnYmlnaW50JztcbmltcG9ydCBDbGlxelNlY3VyZU1lc3NhZ2UgZnJvbSAnLi9pbmRleCc7XG5pbXBvcnQge1xuICBiYXNlNjRfZGVjb2RlLFxuICBiYXNlNjRVcmxEZWNvZGUsXG4gIGJ5dGVBcnJheVRvSGV4U3RyaW5nLFxuICBzdHJpbmdUb0J5dGVBcnJheSxcbiAgaDJkXG59IGZyb20gJy4vY3J5cHRvLXV0aWxzJztcblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlRFNLZXkoKXtcbiAgICAvLyBQYXJzZSBrZXkgY29udGVudHMuXG4gICAgdmFyIF90aGlzID0gdGhpcztcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KXtcbiAgICAgICAgY3J5cHRvLnN1YnRsZS5pbXBvcnRLZXkoXG4gICAgICAgICAnc3BraScsXG4gICAgICAgICAgYmFzZTY0X2RlY29kZShDbGlxelNlY3VyZU1lc3NhZ2UuZHNQSy5wdWJLZXlCNjQpLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6ICdSU0EtT0FFUCcsXG4gICAgICAgICAgICBoYXNoOiB7IG5hbWU6ICdTSEEtMScgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgdHJ1ZSxcbiAgICAgICAgICBbJ2VuY3J5cHQnXVxuICAgICAgICApLnRoZW4oIGtleT0+IHtcbiAgICAgICAgICBjcnlwdG8uc3VidGxlLmV4cG9ydEtleShcImp3a1wiLCBrZXkpLnRoZW4oXG4gICAgICAgICAgICAgIGZ1bmN0aW9uKGtleSkge1xuICAgICAgICAgICAgICAgIC8vIGJhc2U2NHVybC1kZWNvZGUgbW9kdWx1c1xuICAgICAgICAgICAgICAgIHZhciBtb2R1bHVzID0gYmFzZTY0VXJsRGVjb2RlKGtleS5uKTtcbiAgICAgICAgICAgICAgICBDbGlxelNlY3VyZU1lc3NhZ2UuZHNQS1tcIm5cIl0gPSBoMmQoYnl0ZUFycmF5VG9IZXhTdHJpbmcobW9kdWx1cykpO1xuICAgICAgICAgICAgICAgIC8vIGJhc2U2NHVybC1kZWNvZGUgZXhwb25lbnRcbiAgICAgICAgICAgICAgICB2YXIgZXhwb25lbnQgPSBiYXNlNjRVcmxEZWNvZGUoa2V5LmUpO1xuICAgICAgICAgICAgICAgIENsaXF6U2VjdXJlTWVzc2FnZS5kc1BLW1wiZVwiXSA9ICcnICsgaDJkKGJ5dGVBcnJheVRvSGV4U3RyaW5nKGV4cG9uZW50KSk7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgIC8vIG1vZHVsdXMgYW5kIGV4cG9uZW50IGFyZSBub3cgVWludDhBcnJheXNcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdW5CbGluZE1lc3NhZ2UoYmxpbmRTaWduZWRNZXNzYWdlLCB1bkJsaW5kZXIpe1xuICAvLyBVbmJsaW5kIHRoZSBtZXNzYWdlIGJlZm9yZSBzZW5kaW5nIGl0IGZvciB2ZXJpZmljYXRpb24uXG4gIC8vIHMgPSB1KihicykgbW9kIG5cbiAgdmFyIF91cyA9IG11bHRNb2QodW5CbGluZGVyLCBzdHIyYmlnSW50KGJsaW5kU2lnbmVkTWVzc2FnZSwgMTYpLCBzdHIyYmlnSW50KENsaXF6U2VjdXJlTWVzc2FnZS5kc1BLLm4sIDEwKSk7XG4gIHZhciB1cyA9IGJpZ0ludDJzdHIoX3VzLDEwLCAwKTtcbiAgcmV0dXJuIHVzO1xufVxuXG5mdW5jdGlvbiB2ZXJpZnlCbGluZFNpZ25hdHVyZShzaWduZWRNZXNzYWdlLCBoYXNoZWRPcmlnaW5hbE1lc3NhZ2Upe1xuICAgIC8vIFZlcmlmeSB0aGUgbWVzc2FnZSB0byBzZWUsIHRoZSBzaWduZXIgaXMgbm90IHRoZSBwcm9ibGVtLlxuICAgIC8vIG0gPSBzXmUgbW9kIG5cblxuICAgIHZhciBtZXNzYWdlX3NpZ25lZCA9IGJpZ0ludDJzdHIocG93TW9kKHN0cjJiaWdJbnQoc2lnbmVkTWVzc2FnZSwxMCwwKSwgc3RyMmJpZ0ludChDbGlxelNlY3VyZU1lc3NhZ2UuZHNQSy5lLCAxMCksIHN0cjJiaWdJbnQoQ2xpcXpTZWN1cmVNZXNzYWdlLmRzUEsubiwgMTApKSwxMCk7XG4gICAgdmFyIG9yaWdpbmFsX21lc3NhZ2UgPSBiaWdJbnQyc3RyKHN0cjJiaWdJbnQoaGFzaGVkT3JpZ2luYWxNZXNzYWdlLDE2KSwxMCk7XG5cbiAgICBpZihvcmlnaW5hbF9tZXNzYWdlID09PSBtZXNzYWdlX3NpZ25lZC50b0xvd2VyQ2FzZSgpKXtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGVsc2V7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG59XG4vLyBTZXQgdGhlIGNvbnRleHQgZm9yIGJsaW5kIHNpZ25hdHVyZXMgcmlnaHQuXG5leHBvcnQgbGV0IGJsaW5kU2lnbkNvbnRleHQgPSBmdW5jdGlvbiAobXNnKSB7XG4gICAgLypcbiAgICBJbml0aWFsaXplIGl0IHdpdGggdGhlIGZvbGxvd2luZzpcbiAgICAxLiBTaWduZXIgUHVibGljIEtleVxuICAgIDIuIFNpZ25lciBQdWJsaWMgRXhwb25lbnRcbiAgICAzLiBTaWduZXIgUHVibGljIE1vZHVsb3VzXG4gICAgKi9cblxuICAgIC8vIHRoaXMua2V5T2JqID0gbmV3IEpTRW5jcnlwdCgpO1xuICAgIHRoaXMucmFuZG9tTnVtYmVyID0gbnVsbDtcbiAgICB0aGlzLmJsaW5kaW5nTm9uY2UgPSBudWxsO1xuICAgIHRoaXMuYmxpbmRlciA9IG51bGw7XG4gICAgdGhpcy51bmJsaW5kZXIgPSBudWxsO1xuICAgIHRoaXMua2V5U2l6ZSA9IDQwOTY7XG4gICAgdGhpcy5oYXNoZWRNZXNzYWdlID0gXCJcIjtcbiAgICB0aGlzLmJtID0gXCJcIjtcbiAgICB0aGlzLnNpZ25lZE1lc3NhZ2UgPSBcIlwiO1xuICAgIHRoaXMubXNnID0gbXNnO1xufVxuXG5ibGluZFNpZ25Db250ZXh0LnByb3RvdHlwZS5leHBvbmVudCA9IGZ1bmN0aW9uKCl7XG4gICAgLy8gUmV0dXJuIHRoZSBwdWJsaWMgZXhwb25lbnRcbiAgICByZXR1cm4gdGhpcy5lO1xufVxuXG5ibGluZFNpZ25Db250ZXh0LnByb3RvdHlwZS5tb2R1bHVzID0gZnVuY3Rpb24oKXtcbiAgICAvLyBSZXR1cm4gdGhlIHB1YmxpYyBtb2R1bG91c1xuICAgIHJldHVybiB0aGlzLm47XG59XG5cbmJsaW5kU2lnbkNvbnRleHQucHJvdG90eXBlLmxvZyA9ICBmdW5jdGlvbihtc2cpe1xuICBjb25zb2xlLmxvZyhtc2csIFwiQmxpbmQgU2lnbmF0dXJlXCIpO1xuXG59XG5cbmJsaW5kU2lnbkNvbnRleHQucHJvdG90eXBlLmhhc2hNZXNzYWdlID0gZnVuY3Rpb24oKXtcbiAgICAvLyBOZWVkIHNoYTI1NiBkaWdlc3QgdGhlIG1lc3NhZ2UuXG4gICAgbGV0IF90aGlzID0gdGhpcztcbiAgICBsZXQgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCl7XG4gICAgICBjcnlwdG8uc3VidGxlLmRpZ2VzdChcIlNIQS0yNTZcIiwgc3RyaW5nVG9CeXRlQXJyYXkoX3RoaXMubXNnKSkudGhlbiggaGFzaCA9PiB7XG4gICAgICAgIHJlc29sdmUoYnl0ZUFycmF5VG9IZXhTdHJpbmcobmV3IFVpbnQ4QXJyYXkoaGFzaCkpKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIHJldHVybiBwcm9taXNlO1xuICAgIC8qXG4gICAgdmFyIG1zZyA9IHRoaXMubXNnO1xuICAgIHRoaXMuaGFzaGVkTWVzc2FnZSA9IHNoYTI1Nl9kaWdlc3QobXNnKTtcbiAgICByZXR1cm4gdGhpcy5oYXNoZWRNZXNzYWdlO1xuICAgICovXG59XG5cbmJsaW5kU2lnbkNvbnRleHQucHJvdG90eXBlLmdldEJsaW5kaW5nTm9uY2UgPSBmdW5jdGlvbigpe1xuICAgIC8vIENyZWF0ZSBhIHJhbmRvbSB2YWx1ZS5cblxuICAgIHZhciByYW5kb21OdW1iZXIgPSByYW5kQmlnSW50KHRoaXMua2V5U2l6ZSwxKTtcbiAgICB0aGlzLmJsaW5kaW5nTm9uY2UgPSByYW5kb21OdW1iZXI7XG4gICAgcmV0dXJuIHJhbmRvbU51bWJlcjtcbn1cblxuYmxpbmRTaWduQ29udGV4dC5wcm90b3R5cGUuZ2V0QmxpbmRlciA9IGZ1bmN0aW9uKCl7XG4gICAgLy8gQ2FsY3VsYXRlIGJsaW5kZXIuXG4gICAgLy8gYiA9IHIgXiBlIG1vZCBuXG4gICAgdmFyIGIgPSBwb3dNb2QodGhpcy5ibGluZGluZ05vbmNlLCBzdHIyYmlnSW50KENsaXF6U2VjdXJlTWVzc2FnZS5kc1BLLmUsIDEwKSwgc3RyMmJpZ0ludChDbGlxelNlY3VyZU1lc3NhZ2UuZHNQSy5uLCAxMCkpO1xuICAgIHRoaXMuYmxpbmRlciA9IGI7XG4gICAgcmV0dXJuIGI7XG59XG5cbmJsaW5kU2lnbkNvbnRleHQucHJvdG90eXBlLmdldFVuQmxpbmRlciA9IGZ1bmN0aW9uKCl7XG4gICAgLy8gQ2FsY3VsYXRlIGJsaW5kZXIuXG4gICAgLy8gYiA9IHIgXiBlIG1vZCBuXG4gICAgdmFyIHUgPSBpbnZlcnNlTW9kKHRoaXMuYmxpbmRpbmdOb25jZSwgc3RyMmJpZ0ludChDbGlxelNlY3VyZU1lc3NhZ2UuZHNQSy5uLCAxMCkpO1xuICAgIHRoaXMudW5ibGluZGVyID0gdTtcbiAgICByZXR1cm4gdTtcbn1cblxuYmxpbmRTaWduQ29udGV4dC5wcm90b3R5cGUuYmxpbmRNZXNzYWdlID0gZnVuY3Rpb24oKXtcbiAgICAvLyBCbGluZCB0aGUgbWVzc2FnZSBiZWZvcmUgc2VuZGluZyBpdCBmb3Igc2lnbmluZy5cbiAgICAvLyBibSA9IGIqbSBtb2QgblxuICAgIGxldCBfdGhpcyA9IHRoaXM7XG4gICAgbGV0IHByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xuICAgICAgX3RoaXMuaGFzaE1lc3NhZ2UoKS50aGVuKCBoYXNoTWVzc2FnZSA9PiB7XG4gICAgICAgIC8vIHZhciBybmQgPSB0aGlzLmdldEJsaW5kaW5nTm9uY2UoKTtcbiAgICAgICAgdmFyIGJsaW5kZXIgPSBfdGhpcy5nZXRCbGluZGVyKCk7XG4gICAgICAgIHZhciBibSA9IG11bHRNb2QoYmxpbmRlciwgc3RyMmJpZ0ludChoYXNoTWVzc2FnZSwgMTYpLCBzdHIyYmlnSW50KENsaXF6U2VjdXJlTWVzc2FnZS5kc1BLLm4sIDEwKSk7XG4gICAgICAgIF90aGlzLmJtID0gYmlnSW50MnN0cihibSwgMTApO1xuICAgICAgICByZXNvbHZlKF90aGlzLmJtKTtcbiAgICAgIH0pO1xuICAgIH0pXG4gICAgcmV0dXJuIHByb21pc2U7XG59XG5cblxuYmxpbmRTaWduQ29udGV4dC5wcm90b3R5cGUudW5CbGluZE1lc3NhZ2UgPSBmdW5jdGlvbihibGluZFNpZ25lZE1lc3NhZ2Upe1xuICAgIC8vIFVuYmxpbmQgdGhlIG1lc3NhZ2UgYmVmb3JlIHNlbmRpbmcgaXQgZm9yIHZlcmlmaWNhdGlvbi5cbiAgICAvLyBzID0gdSooYnMpIG1vZCBuXG5cbiAgICB2YXIgYnMgPSBibGluZFNpZ25lZE1lc3NhZ2U7XG4gICAgdmFyIHVzID0gbXVsdE1vZCh0aGlzLnVuYmxpbmRlciwgc3RyMmJpZ0ludChicywgMTYpLCBzdHIyYmlnSW50KENsaXF6U2VjdXJlTWVzc2FnZS5kc1BLLm4sIDEwKSk7XG4gICAgdmFyIHVzID0gYmlnSW50MnN0cihfdXMsMTAsIDApXG4gICAgdGhpcy5zaWduZWRNZXNzYWdlID0gdXM7XG4gICAgcmV0dXJuIHVzO1xufVxuXG5ibGluZFNpZ25Db250ZXh0LnByb3RvdHlwZS52ZXJpZnkgPSBmdW5jdGlvbigpe1xuICAgIC8vIFZlcmlmeSB0aGUgbWVzc2FnZSB0byBzZWUsIHRoZSBzaWduZXIgaXMgbm90IHRoZSBwcm9ibGVtLlxuICAgIC8vIG0gPSBzXmUgbW9kIG5cbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xuICAgICAgICB2YXIgbWVzc2FnZV9zaWduZWQgPSBiaWdJbnQyc3RyKHBvd01vZChzdHIyYmlnSW50KF90aGlzLnNpZ25lZE1lc3NhZ2UsMTAsMCksIHN0cjJiaWdJbnQoX3RoaXMuZSwgMTApLCBzdHIyYmlnSW50KF90aGlzLm4sIDEwKSksMTApO1xuICAgICAgICB2YXIgb3JpZ2luYWxfbWVzc2FnZSA9IGJpZ0ludDJzdHIoc3RyMmJpZ0ludChfdGhpcy5oYXNoZWRNZXNzYWdlLDE2KSwxMCk7XG4gICAgICAgIC8vIHZhciBvcmlnaW5hbF9tZXNzYWdlID0gX3RoaXMuaGFzaGVkTWVzc2FnZTtcbiAgICAgICAgX3RoaXMubG9nKFwiT3JnIG1lc3NhZ2U6XCIgKyBvcmlnaW5hbF9tZXNzYWdlKTtcbiAgICAgICAgX3RoaXMubG9nKFwiU2lnbiBtZXNzYWdlOlwiICsgbWVzc2FnZV9zaWduZWQpO1xuICAgICAgICBpZihvcmlnaW5hbF9tZXNzYWdlID09PSBtZXNzYWdlX3NpZ25lZC50b0xvd2VyQ2FzZSgpKXtcbiAgICAgICAgICAgIHJlc29sdmUodHJ1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZXtcbiAgICAgICAgICAgIC8vIE5lZWQgdG8gcmVwbGFjZSB0aGlzIHdpdGggcmVqZWN0LlxuICAgICAgICAgICAgcmVzb2x2ZShmYWxzZSk7XG4gICAgICAgIH1cblxuICAgIH0pXG5cbn1cbiIsImV4cG9ydCBkZWZhdWx0IHtcbiAgXCJwbGF0Zm9ybVwiOiBcImNocm9taXVtXCIsXG4gIFwiYnJvY2ZpbGVcIjogXCJCcm9jZmlsZS53ZWJleHRlbnNpb25ody5qc1wiLFxuICBcImJhc2VVUkxcIjogXCIvbW9kdWxlcy9cIixcbiAgXCJ0ZXN0c0Jhc2VQYXRoXCI6IFwiXCIsXG4gIFwic2V0dGluZ3NcIjoge1xuICAgIFwiQ09ORklHX1BST1ZJREVSXCI6IFwiaHR0cHM6Ly9zYWZlLWJyb3dzaW5nLmdob3N0ZXJ5LmNvbS9jb25maWdcIixcbiAgICBcIkVORFBPSU5UX0JMSU5EX1NJR05FUlwiOiBcImh0dHBzOi8vZ2hvc3Rlcnktc2lnbi5naG9zdGVyeS5jb20vc2lnblwiLFxuICAgIFwiRU5EUE9JTlRfVVNFUl9SRUdcIjogXCJodHRwczovL2dob3N0ZXJ5LXNpZ24uZ2hvc3RlcnkuY29tL3JlZ2lzdGVyXCIsXG4gICAgXCJFTkRQT0lOVF9TT1VSQ0VfTUFQX1BST1ZJREVSXCI6IFwiaHR0cHM6Ly9naG9zdGVyeS1jb2xsZWN0b3IuZ2hvc3RlcnkuY29tL3NvdXJjZW1hcGpzb25cIixcbiAgICBcIkVORFBPSU5UX0xPT0tVUF9UQUJMRV9QUk9WSURFUlwiOiBcImh0dHBzOi8vZ2hvc3RlcnktY29sbGVjdG9yLmdob3N0ZXJ5LmNvbS9sb29rdXB0YWJsZVwiLFxuICAgIFwiRU5EUE9JTlRfS0VZU19QUk9WSURFUlwiOiBcImh0dHBzOi8vZ2hvc3RlcnktY29sbGVjdG9yLmdob3N0ZXJ5LmNvbS9zaWduZXJLZXlcIixcbiAgICBcIkVORFBPSU5UX1BST1hZX0xJU1RfUFJPVklERVJcIjogXCJodHRwczovL2dob3N0ZXJ5LWNvbGxlY3Rvci5naG9zdGVyeS5jb20vcHJveHlMaXN0XCIsXG4gICAgXCJFTkRQT0lOVF9QQVRURVJOU1VSTFwiOiBcImh0dHBzOi8vc2FmZS1icm93c2luZy5naG9zdGVyeS5jb20vcGF0dGVybnNcIixcbiAgICBcIkVORFBPSU5UX0FOT05QQVRURVJOU1VSTFwiOiBcImh0dHBzOi8vc2FmZS1icm93c2luZy5naG9zdGVyeS5jb20vcGF0dGVybnMtYW5vblwiLFxuICAgIFwiRU5EUE9JTlRfQ09ORklHVVJMXCI6IFwiaHR0cHM6Ly9zYWZlLWJyb3dzaW5nLmdob3N0ZXJ5LmNvbS90cy1jb25maWdcIixcbiAgICBcIkVORFBPSU5UX1NBRkVfUVVPUlVNX0VORFBPSU5UXCI6IFwiaHR0cHM6Ly9zYWZlLWJyb3dzaW5nLXF1b3J1bS5naG9zdGVyeS5jb20vXCIsXG4gICAgXCJFTkRQT0lOVF9TQUZFX1FVT1JVTV9QUk9WSURFUlwiOiBcImh0dHBzOi8vc2FmZS1icm93c2luZy1xdW9ydW0uZ2hvc3RlcnkuY29tL2NvbmZpZ1wiLFxuICAgIFwiTVNHQ0hBTk5FTFwiOiBcIndlYi1leHRlbnNpb25cIixcbiAgICBcIktFWV9EU19QVUJLRVlcIjogXCJNSUlCSWpBTkJna3Foa2lHOXcwQkFRRUZBQU9DQVE4QU1JSUJDZ0tDQVFFQXdYbzRoWHZib0tIQ2dnTkowVU5GdlpRZkRXaTBqTmNGMWtCSHRoeGlsTXU2TEIvaEZyU01RKy9GZ1RxVkUzNmNDZXpXRTBLMVVjd21ZR1ZzdXF4Y3ZxbDgyUmZDbVlVVkJyb0ozVUZHOHFuZXRZZlU1Rk9rNDNDNTU1cDVsNUh6bEY4UWlsY0NVQkNPNFNDajlsRVozLzhGSmJvQ3VwVHF4RVVxN253VWdhTlpPaUdLTWREVUJaSk8xdFc0TFNINGxqOUlBWmNjRUo1SEtWbUpLb3BRM2hteldnRHFvd3huaTROUXorMERuc1NmQ0dBdXBLYUpEeGpmYWpKb3NYNWk2NzRyZ2RIYlpHdGdIQjNNOWpoYzZIRk5QY210VWdMd2d0VXRSd01oU255YTZxL08wNmV1b3VOaTFoMG01ZVJyV2VNUmxKU2RVbmVsTFNVOFFOeTdMUUlEQVFBQlwiLFxuICAgIFwiS0VZX1NFQ1VSRV9MT0dHRVJfUFVCS0VZXCI6IFwiTUlJQ0lqQU5CZ2txaGtpRzl3MEJBUUVGQUFPQ0FnOEFNSUlDQ2dLQ0FnRUFoNUhoY1JBbjYrNndvWFFYbC9OdForZk9vb05nbFpjdC9IU3BZdXFrY21yUGF1SFc3RXVPU3E1YnZwQlpSVERST2pSL2tVUG9tcVZaSXpxaGRDRlBBOEJ3WFNDejdoQWVsMlExNTd2dEJ2aDlzbmdNTUxYYjVGZ3plZjVONEV1S084cEw1S3JTK0k5dGZaYWM0MXZGSlNkcGdBaXJaWWhoK3RkY1FRMXowUXYvUncwek9YamZ2ZGRDejNnRXYyZ0I5S3NMTVZuVFMxSjRZT09nZnphMmFkZzlFYnoxejk5RGlGNHZ0Q3duMElVd0gvM1RvVEJ3SkxiTW5DM09sNDN5Qk5rOHJnSzJta2dDaTYxNHZPU0QzaG5WbWlvK2lXNitBVWtsTThWUGw2bDdoRUs5Y2xqSlkrOVVzTVZtVHJ2YUZiTVB3UzZBZFpDWEtUbU5kYU1KY3kzelNPWHU1enZ6aWhvUUx3QXU5TE0zbDJlVmswTXcwSzdKWE9QMjBmYzhCdHpXQ09MWVZQMzJyNFIwQk51aFR0dkdxakhOWkhQSk41T3dheGtMcG4yZHVqTDl1RFdHalJpT0l0S01WcS9uT3FtTkdnaHJiZjhJT2FLVDdWUWhxT1U0Y1hSa0IvdUYxVWpZRVRCYXZ3VVpBeHg5V2QvY01jQUdtS2lEeGlnaHh4UTI5akR1ZmwrMldHMDY1dG1Keit6Q3htZ3JQaDZaYjNLRlV4UFRlNnlrc0FoV0pobUdTaEE5djIwdDg0TTVjNk5wWlhvVXNGY1ZqYTZYeHpIZVNCOGRXcTlVdTVRY1o4M0d6L3JvbndkRWpUMk9HVHRCZ09GZVREcUxZVWdwaEMxZ2NVRUhPQ25UTlhSTVFPWHFHd0JmWkhwK01xNjFRY01xMnJOUzd4RUNBd0VBQVE9PVwiLFxuICAgIFwiZnJhbWVTY3JpcHRXaGl0ZWxpc3RcIjogW1xuICAgICAgXCJodHRwOi8vbG9jYWxob3N0OjMwMDAvXCJcbiAgICBdXG4gIH0sXG4gIFwicHJpb3JpdHlcIjogW10sXG4gIFwibW9kdWxlc1wiOiBbXG4gICAgXCJjb3JlXCIsXG4gICAgXCJocG5cIlxuICBdLFxuICBcInN1YnByb2plY3RzXCI6IFtdLFxuICBcImVudmlyb25tZW50XCI6IFwiZGV2ZWxvcG1lbnRcIixcbiAgXCJzb3VyY2VNYXBzXCI6IHRydWUsXG4gIFwiRVhURU5TSU9OX1ZFUlNJT05cIjogXCIxLjE2LjBcIlxufSIsImltcG9ydCBtZXNzYWdlQ29udGV4dCBmcm9tICcuL21lc3NhZ2UtY29udGV4dCc7XG5pbXBvcnQgeyBzaGExIH0gZnJvbSAnLi9jcnlwdG8tdXRpbHMnO1xuaW1wb3J0IHVzZXJQSyBmcm9tICcuL3VzZXItcGsnO1xuaW1wb3J0IHsgcGFyc2VEU0tleSB9IGZyb20gJy4vYmxpbmQtc2lnbmF0dXJlJztcbmltcG9ydCBjb25maWcgZnJvbSAnLi4vLi4vY29yZS9jb25maWcnO1xuXG4vLyBHbG9iYWwgdmFyaWFibGVzXG5jb25zdCBDbGlxelNlY3VyZU1lc3NhZ2UgPSB7fTtcbmV4cG9ydCBsZXQgbG9jYWxUZW1wb3JhbFVuaXEgPSB7fTtcbkNsaXF6U2VjdXJlTWVzc2FnZS5CTElORF9TSUdORVIgPSBjb25maWcuc2V0dGluZ3MuRU5EUE9JTlRfQkxJTkRfU0lHTkVSO1xuQ2xpcXpTZWN1cmVNZXNzYWdlLlVTRVJfUkVHID0gY29uZmlnLnNldHRpbmdzLkVORFBPSU5UX1VTRVJfUkVHO1xuXG5zZWxmLm9ubWVzc2FnZSA9IGZ1bmN0aW9uKGUpIHtcbiAgY29uc3QgbXNnVHlwZSA9IGUuZGF0YS50eXBlO1xuXG4gIGlmKCBtc2dUeXBlID09PSAnaW5zdGFudCcgKSB7XG4gICAgY29uc3QgbXNnID0gZS5kYXRhLm1zZztcbiAgICBjb25zdCB1aWQgPSAgZS5kYXRhLnVpZDtcbiAgICBjb25zdCByZXNwb25zZSA9IHt9O1xuICAgIENsaXF6U2VjdXJlTWVzc2FnZS5zb3VyY2VNYXAgPSBlLmRhdGEuc291cmNlbWFwO1xuICAgIENsaXF6U2VjdXJlTWVzc2FnZS51UEsgPSBlLmRhdGEudXBrO1xuICAgIENsaXF6U2VjdXJlTWVzc2FnZS5xdWVyeVByb3h5SVAgPSBlLmRhdGEucXVlcnlwcm94eWlwO1xuICAgIENsaXF6U2VjdXJlTWVzc2FnZS5kc1BLID0gZS5kYXRhLmRzcGs7XG4gICAgQ2xpcXpTZWN1cmVNZXNzYWdlLnNlY3VyZUxvZ2dlciA9IGUuZGF0YS5zc3BrO1xuXG4gICAgY29uc3QgbWMgPSBuZXcgbWVzc2FnZUNvbnRleHQobXNnKTtcbiAgICBtYy5xdWVyeSgpLnRoZW4oIHJlc3VsdCA9PiB7XG4gICAgICByZXNwb25zZS5yZXMgPSByZXN1bHQ7XG4gICAgICByZXNwb25zZS51aWQgPSB1aWQ7XG4gICAgICByZXNwb25zZS50eXBlID0gJ2luc3RhbnQnO1xuICAgICAgcG9zdE1lc3NhZ2UocmVzcG9uc2UpO1xuICAgIH0pO1xuICB9XG5cbiAgaWYgKG1zZ1R5cGUgPT09ICd0ZWxlbWV0cnknKSB7XG4gICAgY29uc3QgbXNnID0gZS5kYXRhLm1zZztcbiAgICBjb25zdCByZXNwb25zZSA9IHt9O1xuICAgIHJlc3BvbnNlLnR5cGUgPSAndGVsZW1ldHJ5JztcbiAgICBsZXQgbWMgPSBudWxsO1xuICAgIENsaXF6U2VjdXJlTWVzc2FnZS5zb3VyY2VNYXAgPSBlLmRhdGEuc291cmNlbWFwO1xuICAgIENsaXF6U2VjdXJlTWVzc2FnZS51UEsgPSBlLmRhdGEudXBrO1xuICAgIENsaXF6U2VjdXJlTWVzc2FnZS5kc1BLID0gZS5kYXRhLmRzcGs7XG4gICAgQ2xpcXpTZWN1cmVNZXNzYWdlLnNlY3VyZUxvZ2dlciA9IGUuZGF0YS5zc3BrO1xuICAgIENsaXF6U2VjdXJlTWVzc2FnZS5yb3V0ZVRhYmxlID0gZS5kYXRhLnJvdXRldGFibGU7XG4gICAgbG9jYWxUZW1wb3JhbFVuaXEgPSBlLmRhdGEubG9jYWxUZW1wb3JhbFVuaXE7XG5cbiAgICB0cnkge1xuICAgICAgbWMgPSBuZXcgbWVzc2FnZUNvbnRleHQobXNnKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgcmVzcG9uc2UubG9jYWxUZW1wb3JhbFVuaXEgPSBsb2NhbFRlbXBvcmFsVW5pcTtcbiAgICAgICAgcG9zdE1lc3NhZ2UocmVzcG9uc2UpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgcGFyc2VEU0tleSgpLnRoZW4oIGUgPT4ge1xuICAgICAgbWMuZW5jcnlwdGVkVGVsZW1ldHJ5KCkudGhlbiggcmVzdWx0ID0+IHtcbiAgICAgICAgcmVzcG9uc2UubG9jYWxUZW1wb3JhbFVuaXEgPSBsb2NhbFRlbXBvcmFsVW5pcTtcbiAgICAgICAgcG9zdE1lc3NhZ2UocmVzcG9uc2UpO1xuICAgICAgfSkuY2F0Y2goIGVyciA9PiB7XG4gICAgICAgIHJlc3BvbnNlLmxvY2FsVGVtcG9yYWxVbmlxID0gbG9jYWxUZW1wb3JhbFVuaXE7XG4gICAgICAgIHBvc3RNZXNzYWdlKHJlc3BvbnNlKTtcbiAgICAgIH0pO1xuICAgIH0pXG4gIH1cblxuICBpZiAobXNnVHlwZSA9PT0gJ3VzZXIta2V5Jykge1xuICAgIGNvbnN0IHVwayA9IG5ldyB1c2VyUEsoKTtcbiAgICB1cGsuZ2VuZXJhdGVLZXkoKS50aGVuKCBlID0+IHtcbiAgICAgIHBvc3RNZXNzYWdlKGUpO1xuICAgIH0pLmNhdGNoKCBlID0+IHBvc3RNZXNzYWdlKGUpKTtcbiAgfVxuXG4gIGlmIChtc2dUeXBlID09PSAndGVzdCcpIHtcbiAgICBjb25zdCBtc2cgPSBlLmRhdGEubXNnO1xuICAgIGNvbnN0IHJlc3BvbnNlID0ge307XG4gICAgcmVzcG9uc2UudHlwZSA9ICd0ZXN0JztcbiAgICBDbGlxelNlY3VyZU1lc3NhZ2Uuc291cmNlTWFwID0gZS5kYXRhLnNvdXJjZW1hcDtcbiAgICBDbGlxelNlY3VyZU1lc3NhZ2UudVBLID0gZS5kYXRhLnVwaztcbiAgICBDbGlxelNlY3VyZU1lc3NhZ2UuZHNQSyA9IGUuZGF0YS5kc3BrO1xuICAgIENsaXF6U2VjdXJlTWVzc2FnZS5yb3V0ZVRhYmxlID0gZS5kYXRhLnJvdXRldGFibGU7XG4gICAgbG9jYWxUZW1wb3JhbFVuaXEgPSBlLmRhdGEubG9jYWxUZW1wb3JhbFVuaXE7XG5cbiAgICBjb25zdCBtYyA9IG5ldyBtZXNzYWdlQ29udGV4dChtc2cpO1xuICAgIG1jLmdldHByb3h5Q29vcmRpbmF0b3IoKVxuICAgICAgLnRoZW4oIGUgPT4ge1xuICAgICAgICByZXNwb25zZS5tYyA9IG1jO1xuICAgICAgICBwb3N0TWVzc2FnZShyZXNwb25zZSk7XG4gICAgICB9KTtcbiAgfVxuXG4gIGlmIChtc2dUeXBlID09PSAndGVzdC1zaGExJyB8fCBtc2dUeXBlID09PSAnaHctc2hhMScpIHtcbiAgICBzaGExKGUuZGF0YS5tc2cpXG4gICAgICAudGhlbiggcmVzdWx0ID0+IHtcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSB7fTtcbiAgICAgICAgcmVzcG9uc2UucmVzdWx0ID0gcmVzdWx0O1xuICAgICAgICBwb3N0TWVzc2FnZShyZXNwb25zZSk7XG4gICAgICB9KTtcbiAgfVxuXG4gIGlmIChtc2dUeXBlID09PSAndGVzdC1yc2Etc2lnbicpIHtcbiAgICBjb25zdCBtc2cgPSBlLmRhdGEubXNnO1xuICAgIGNvbnN0IHJlc3BvbnNlID0ge307XG4gICAgQ2xpcXpTZWN1cmVNZXNzYWdlLnVQSyA9IHsncHJpdmF0ZUtleScgOiBlLmRhdGEudXBrfTtcbiAgICBjb25zdCB1UEsgPSBuZXcgdXNlclBLKG1zZyk7XG5cbiAgICB1UEsuc2lnbihtc2cpXG4gICAgICAudGhlbiggcmVzdWx0ID0+IHtcbiAgICAgICAgcmVzcG9uc2UucmVzdWx0ID0gcmVzdWx0O1xuICAgICAgICBwb3N0TWVzc2FnZShyZXNwb25zZSk7XG4gICAgICB9KVxuICAgICAgLmNhdGNoKCBlcnIgPT4ge1xuICAgICAgICByZXNwb25zZS5yZXN1bHQgPSBmYWxzZTtcbiAgICAgICAgcG9zdE1lc3NhZ2UocmVzcG9uc2UpO1xuICAgICAgfSk7XG4gIH1cblxuICBpZiAoIG1zZ1R5cGUgPT09ICd0ZXN0LXJzYS12ZXJpZnknICl7XG4gICAgY29uc3Qgc2lnbmF0dXJlID0gZS5kYXRhLnNpZztcbiAgICBjb25zdCBtc2cgPSBlLmRhdGEubXNnO1xuICAgIGNvbnN0IHJlc3BvbnNlID0ge307XG5cbiAgICBDbGlxelNlY3VyZU1lc3NhZ2UudVBLID0geydwcml2YXRlS2V5JyA6IGUuZGF0YS51cGt9O1xuICAgIGNvbnN0IHVQSyA9IG5ldyB1c2VyUEsobXNnKTtcblxuICAgIHVQSy52ZXJpZnkoc2lnbmF0dXJlLCBtc2cpXG4gICAgICAudGhlbiggcmVzdWx0ID0+IHtcbiAgICAgICAgcmVzcG9uc2UucmVzdWx0ID0gcmVzdWx0O1xuICAgICAgICBwb3N0TWVzc2FnZShyZXNwb25zZSk7XG4gICAgICB9KVxuICAgICAgLmNhdGNoKCBlcnIgPT4ge1xuICAgICAgICByZXNwb25zZS5yZXN1bHQgPSBmYWxzZTtcbiAgICAgICAgcG9zdE1lc3NhZ2UocmVzcG9uc2UpO1xuICAgICAgfSk7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IENsaXF6U2VjdXJlTWVzc2FnZTtcbiJdfQ==