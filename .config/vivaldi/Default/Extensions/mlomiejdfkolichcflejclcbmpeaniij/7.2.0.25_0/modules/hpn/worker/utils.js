System.register(['./index'], function (_export) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImhwbi93b3JrZXIvdXRpbHMuZXMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7MEJBTUksV0FBVyxFQUNYLEtBQUs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ1QsV0FBUyxRQUFRLENBQUMsQ0FBQyxFQUFDOzs7OztBQUtsQixLQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQzs7Ozs7QUFLWCxRQUFHO0FBQ0QsT0FBQyxHQUFHLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQzNCLENBQUEsT0FBTSxDQUFDLEVBQUMsRUFBRSxDQUFDOztBQUdaLEtBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBQyxFQUFFLENBQUMsQ0FBQzs7O0FBR3pCLEtBQUMsR0FBRyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUM7OztBQUdwQixLQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDOzs7QUFHYixLQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDaEMsS0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsYUFBYSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQ2pDLEtBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBQyxFQUFFLENBQUMsQ0FBQzs7O0FBSTNCLEtBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBQyxFQUFFLENBQUMsQ0FBQzs7QUFFeEIsV0FBTyxDQUFDLENBQUM7R0FFVjs7QUFFRCxXQUFTLFFBQVEsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFO0FBQzNCLFdBQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQyxNQUFNLENBQUMsVUFBQSxDQUFDO2FBQUksQ0FBQztLQUFBLENBQUMsQ0FBQyxNQUFNLENBQUMsVUFBQyxDQUFDLEVBQUUsQ0FBQzthQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FB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LENBQUM7QUFDckIsV0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBQztBQUNyQixXQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxDQUFDO0FBQ3JCLFdBQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLENBQUM7QUFDckIsV0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBQztBQUNyQixXQUFPLE9BQU8sQ0FBQztHQUNqQjs7QUFjSyxXQUFTLGtCQUFrQixDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUM7QUFDdEUsUUFBSSxPQUFPLEdBQUcsRUFBRSxDQUFDO0FBQ2pCLFdBQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLENBQUM7QUFDckIsV0FBTyxDQUFDLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQztBQUN2QixXQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQ25CLFdBQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLENBQUM7QUFDckIsV0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBQztBQUNyQixXQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxDQUFDO0FBQ3JCLFdBQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLENBQUM7QUFDckIsV0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBQztBQUNyQixXQUFPLE9BQU8sQ0FBQztHQUNsQjs7Ozs7OztBQTVKRyxpQkFBVyxHQUFHLGlDQUFpQztBQUMvQyxXQUFLLEdBQUksSUFBSSxNQUFNLENBQUMsR0FBRyxHQUFHLFdBQVcsR0FBRyxHQUFHLEVBQUMsR0FBRyxDQUFDIiwiZmlsZSI6Imhwbi93b3JrZXIvdXRpbHMuZXMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBGSVhNRTogcmVtb3ZlIGNpcnR1bGFyIGRlcGVuZGVuY3lcbmltcG9ydCBDbGlxelNlY3VyZU1lc3NhZ2UgZnJvbSAnLi9pbmRleCc7XG5cbi8qXG5GdW5jdGlvbiB0byBjbGVhbiBzdHJpbmcgZm9yIGNhbGN1bGF0aW5nIHJvdXRlIGhhc2hcbiovXG52YXIgcHVuY3R1YXRpb24gPSAnIVwiXFwnKCkqLC0uLzo7P1tcXFxcXV5fYHt8fX4lJD0mKyMnXG52YXIgcmVnZXggPSAgbmV3IFJlZ0V4cChcIltcIiArIHB1bmN0dWF0aW9uICsgXCJdXCIsXCJnXCIpO1xuZnVuY3Rpb24gY2xlYW5TdHIocyl7XG4gIC8vIFJlcGxhY2UgYWxsIHNwYWNlc1xuXG4gIC8vIEJlY2F1c2UgaW4gc29tZSB0ZWxlbWV0cnkgbWVzc2FnZSB3ZSBvbmx5IGNyZWF0ZSB1bmlxdSBiYXNlZCBvbiBhbnRpLWR1cGxpY2F0ZS5cbiAgLy8gQW50aS1kdXBsaWNhdGUgaXMgbm90IGEgc3RyaW5nLCBoZW5jZSBjb252ZXJ0aW5nIGl0IHRvIHN0cmluZy5cbiAgcyA9ICcnICsgcztcblxuICAvLyBEZWNvZGUgdXJpIGNvbXBvbmVudFxuICAvLyBOZWVkIHRvIGZpbmQgbHVhIGVxdWl2YWxlbnRcblxuICB0cnl7XG4gICAgcyA9IGRlY29kZVVSSUNvbXBvbmVudChzKTtcbiAgfWNhdGNoKGUpe307XG5cblxuICBzID0gcy5yZXBsYWNlKC9cXHMrL2csJycpO1xuXG4gIC8vIENvbnZlcnQgdG8gbG93ZXJcbiAgcyA9IHMudG9Mb3dlckNhc2UoKTtcblxuICAvLyBUcmltXG4gIHMgPSBzLnRyaW0oKTtcblxuICAvLyBDbGVhbiB0aGUgVVJMXG4gIHMgPSBzLnJlcGxhY2UoL15odHRwOlxcL1xcLy8sIFwiXCIpO1xuICBzID0gcy5yZXBsYWNlKC9eaHR0cHM6XFwvXFwvLywgXCJcIik7XG4gIHMgPSBzLnJlcGxhY2UoL153d3dcXC4vLCcnKTtcblxuXG4gIC8vIFJlbW92ZSBhbGwgcHVuY3R1YXRpb24gbWFya3NcbiAgcyA9IHMucmVwbGFjZShyZWdleCwnJyk7XG5cbiAgcmV0dXJuIHM7XG5cbn1cblxuZnVuY3Rpb24gZ2V0RmllbGQob2JqLCBwYXRoKSB7XG4gIHJldHVybiBwYXRoLnNwbGl0KC9bXFwuXFxbXFxdXSsvKS5maWx0ZXIoeCA9PiB4KS5yZWR1Y2UoKG8sIGkpID0+IG9baV0sIG9iaik7XG59XG5cbmZ1bmN0aW9uIG9yZGVyZWRTdHJpbmdpZnkodCwgcmVzLCBvbmx5S2V5cykge1xuICBpZiAoIXQgfHwgdHlwZW9mIHQgIT09ICdvYmplY3QnKSB7XG4gICAgaWYgKHQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgJ0ZvdW5kIHVuZGVmaW5lZCBmaWVsZCB3aGVuIHRyeWluZyB0byBjYWxjdWxhdGUgbXNnIHJvdXRlaGFzaCc7XG4gICAgfVxuICAgIHJlcy5wdXNoKGNsZWFuU3RyKHQpKTtcbiAgfSBlbHNlIHtcbiAgICBsZXQga2V5cyA9IE9iamVjdC5rZXlzKHQpO1xuICAgIGtleXMuc29ydCgpO1xuICAgIGxldCBpc0FycmF5ID0gQXJyYXkuaXNBcnJheSh0KTtcbiAgICBrZXlzLmZvckVhY2goayA9PiB7XG4gICAgICBpZiAoIWlzQXJyYXkpIHtcbiAgICAgICAgcmVzLnB1c2goY2xlYW5TdHIoaykpO1xuICAgICAgfVxuICAgICAgaWYgKCFvbmx5S2V5cykge1xuICAgICAgICBvcmRlcmVkU3RyaW5naWZ5KHRba10sIHJlcyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0Um91dGVIYXNoU3RyKG9iaiwgc291cmNlTWFwKSB7XG4gIGxldCBhY3Rpb24gPSBvYmouYWN0aW9uO1xuICBsZXQga2V5cyA9IHNvdXJjZU1hcFthY3Rpb25dLmtleXM7XG4gIGxldCBzdGF0aWNLZXlzID0gc291cmNlTWFwW2FjdGlvbl0uc3RhdGljfHxbXTtcbiAgbGV0IHJlcyA9IFtdO1xuICBrZXlzLmZvckVhY2goayA9PiBvcmRlcmVkU3RyaW5naWZ5KGdldEZpZWxkKG9iaiwgayksIHJlcywgc3RhdGljS2V5cy5zb21lKHNrID0+IGsuZW5kc1dpdGgoc2spKSkpO1xuICByZXR1cm4gcmVzLmpvaW4oJycpO1xufVxuXG5cbi8vIFRPRE86IHJlbW92ZSB0aGlzIGZ1bmN0aW9uIC0gaXQgaGFzIGFsbW9zdCBub3QgdmFsdWUgYW5kIGEgbWlzbGVhZGluZyBuYW1lXG4vKlxuRnVuY3Rpb24gdG8gY3JlYXRlIGh0dHAgdXJsXG4qL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUh0dHBVcmwoaG9zdCl7XG5cdHJldHVybiBcImh0dHA6Ly9cIiArIGhvc3QgKyBcIi92ZXJpZnlcIjtcbn1cblxuLyogVGhpcyBtZXRob2Qgd2lsbCByZXR1cm4gdGhlIHN0cmluZyBiYXNlZCBvbiBtYXBwaW5nIG9mIHdoaWNoIGtleXMgdG8gdXNlIHRvIGhhc2ggZm9yIHJvdXRpbmcuXG4qL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFJvdXRlSGFzaChtc2cpe1xuXHRyZXR1cm4gZ2V0Um91dGVIYXNoU3RyKG1zZywgQ2xpcXpTZWN1cmVNZXNzYWdlLnNvdXJjZU1hcCk7XG59XG5cbi8qXG5Db252ZXJ0cyBnaXZlbiBhcnJheSB0byBnZW5lcmF0b3IgbGlrZSBvYmplY3QuXG4qL1xuZnVuY3Rpb24gdHJrR2VuKHRyaykge1xuICB2YXIgdHJrID0gdHJrO1xuICB2YXIgaWR4ID0gLTE7XG4gIHJldHVybiB7XG4gICAgbmV4dDogZnVuY3Rpb24oKSB7XG4gICAgICBpZHggKz0gMVxuICAgICAgaWYoaWR4IDwgdHJrLmxlbmd0aCl7XG4gICAgICAgIHJldHVybntcbiAgICAgICAgICB2YWx1ZTogaWR4LCAvLyBSZXR1cm4gdGhlIGZpcnN0IHlpZWxkZWQgdmFsdWUuXG4gICAgICAgICAgZG9uZTogZmFsc2VcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZWxzZXtcbiAgICAgICAgcmV0dXJue1xuICAgICAgICAgdmFsdWU6IHVuZGVmaW5lZCwgLy8gUmV0dXJuIHVuZGVmaW5lZC5cbiAgICAgICAgIGRvbmU6IHRydWVcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIE1ldGhvZCB0byBjcmVhdGUgcGF5bG9hZCB0byBzZW5kIGZvciBibGluZCBzaWduYXR1cmUuXG4gKiBUaGUgcGF5bG9hZCBuZWVkcyB0byBjb25zaXN0IG9mIDx1UEssXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7bVB9KnIxLCAvLyBCTTFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHttUCwgdVBLfSpyMiwgLy8gQk0yXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7RG1DLCB1UEt9ICogcjMsIC8vIEJNM1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgU0lHKHVQSztibTE7Ym0yO2JtMylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID5cbiAqIEByZXR1cm5zIHN0cmluZyB3aXRoIHBheWxvYWQgY3JlYXRlZC5cbiovXG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVQYXlsb2FkQmxpbmRTaWduYXR1cmUodVBLLCBibTEsIGJtMiwgYm0zLCBzaWcpe1xuICAgIHZhciBwYXlsb2FkID0ge307XG4gICAgcGF5bG9hZFtcInVQS1wiXSA9IHVQSztcbiAgICBwYXlsb2FkW1wiYm0xXCJdID0gYm0xO1xuICAgIHBheWxvYWRbXCJibTJcIl0gPSBibTI7XG4gICAgcGF5bG9hZFtcImJtM1wiXSA9IGJtMztcbiAgICBwYXlsb2FkW1wic2lnXCJdID0gc2lnO1xuICAgIHJldHVybiBwYXlsb2FkO1xuIH1cblxuLyoqXG4gKiBNZXRob2QgdG8gY3JlYXRlIHBheWxvYWQgdG8gc2VuZCB0byBwcm94eS5cbiAqIFRoZSBwYXlsb2FkIG5lZWRzIHRvIGNvbnNpc3Qgb2YgPHVQSyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRtQyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtIe21QfSpyMX1Ec2ssIC8vIEJsaW5kU2lnbmVkMVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge0gobVAsIHVQSyl9RHNrLCAvLyBCbGluZFNpZ25lZDJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtIKG1QLCBkbUMpfURzaywgLy8gQmxpbmRTaWduZWQzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBTSUcodVBLO2RtQzticzE7YnMyO2JzMylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID5cbiAqIEByZXR1cm5zIHN0cmluZyB3aXRoIHBheWxvYWQgY3JlYXRlZC5cbiAqL1xuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlUGF5bG9hZFByb3h5KHVQSywgc3VQSywgbVAsIGRtQywgYnMxLCBiczIsIGJzMywgc2lnKXtcbiAgICB2YXIgcGF5bG9hZCA9IHt9O1xuICAgIHBheWxvYWRbXCJ1UEtcIl0gPSB1UEs7XG4gICAgcGF5bG9hZFtcInN1UEtcIl0gPSBzdVBLO1xuICAgIHBheWxvYWRbXCJtUFwiXSA9IG1QO1xuICAgIHBheWxvYWRbXCJkbUNcIl0gPSBkbUM7XG4gICAgcGF5bG9hZFtcImJzMVwiXSA9IGJzMTtcbiAgICBwYXlsb2FkW1wiYnMyXCJdID0gYnMyO1xuICAgIHBheWxvYWRbXCJiczNcIl0gPSBiczM7XG4gICAgcGF5bG9hZFtcInNpZ1wiXSA9IHNpZztcbiAgICByZXR1cm4gcGF5bG9hZDtcbn1cblxuIl19