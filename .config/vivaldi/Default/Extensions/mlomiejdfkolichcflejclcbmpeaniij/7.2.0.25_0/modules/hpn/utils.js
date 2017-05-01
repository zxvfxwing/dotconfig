System.register(['./main', '../core/console'], function (_export) {

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImhwbi91dGlscy5lcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBTU8sV0FBUyxhQUFhLENBQUMsSUFBSSxFQUFFO0FBQ2xDLFdBQU8sU0FBUyxHQUFHLElBQUksR0FBRyxTQUFTLENBQUM7R0FDckM7O0FBS00sV0FBUyxNQUFNLENBQUMsSUFBSSxFQUFFO0FBQzNCLFFBQU0sR0FBRyxHQUFHLElBQUksQ0FBQztBQUNqQixRQUFJLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUNiLFdBQU87QUFDTCxVQUFJLEVBQUUsZ0JBQVc7QUFDZixXQUFHLElBQUksQ0FBQyxDQUFDO0FBQ1QsWUFBSSxHQUFHLEdBQUcsR0FBRyxDQUFDLE1BQU0sRUFBRTtBQUNwQixpQkFBTztBQUNMLGlCQUFLLEVBQUUsR0FBRztBQUNWLGdCQUFJLEVBQUUsS0FBSztXQUNaLENBQUM7U0FDSCxNQUFNO0FBQ0wsaUJBQU87QUFDTCxpQkFBSyxFQUFFLFNBQVM7QUFDaEIsZ0JBQUksRUFBRSxJQUFJO1dBQ1gsQ0FBQztTQUNIO09BQ0Y7S0FDRixDQUFDO0dBQ0g7O0FBR00sV0FBUyxzQkFBc0IsR0FBRztBQUN2QyxRQUFJLGtCQUFrQixDQUFDLGlCQUFpQixJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFOztBQUN4RyxZQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDNUIsWUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQ1gsY0FBTSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLE9BQU8sQ0FBRSxVQUFBLENBQUMsRUFBSTtBQUM5RCxjQUFNLENBQUMsR0FBRyxrQkFBa0IsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7QUFDckQsY0FBTSxJQUFJLEdBQUksUUFBUSxHQUFHLENBQUMsQUFBQyxDQUFDO0FBQzVCLGNBQUksSUFBSSxJQUFLLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLElBQUksQUFBQyxFQUFFO0FBQ2pDLG1CQUFPLGtCQUFrQixDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQy9DLGNBQUUsSUFBSSxDQUFDLENBQUM7V0FDVDtTQUNGLENBQUMsQ0FBQzs7S0FPSjtHQUNGOztBQUVNLFdBQVMscUJBQXFCLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRTtBQUM5QyxPQUFHLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNyQixPQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUN0QixXQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFBLEFBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztHQUMxRCIsImZpbGUiOiJocG4vdXRpbHMuZXMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQ2xpcXpTZWN1cmVNZXNzYWdlIGZyb20gJy4vbWFpbic7XG5pbXBvcnQgY29uc29sZSBmcm9tICcuLi9jb3JlL2NvbnNvbGUnO1xuXG4vKlxuRnVuY3Rpb24gdG8gY3JlYXRlIGh0dHAgdXJsXG4qL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUh0dHBVcmwoaG9zdCkge1xuICByZXR1cm4gJ2h0dHA6Ly8nICsgaG9zdCArICcvdmVyaWZ5Jztcbn1cblxuLypcbkNvbnZlcnRzIGdpdmVuIGFycmF5IHRvIGdlbmVyYXRvciBsaWtlIG9iamVjdC5cbiovXG5leHBvcnQgZnVuY3Rpb24gdHJrR2VuKF90cmspIHtcbiAgY29uc3QgdHJrID0gX3RyaztcbiAgbGV0IGlkeCA9IC0xO1xuICByZXR1cm4ge1xuICAgIG5leHQ6IGZ1bmN0aW9uKCkge1xuICAgICAgaWR4ICs9IDE7XG4gICAgICBpZiAoaWR4IDwgdHJrLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHZhbHVlOiBpZHgsIC8vIFJldHVybiB0aGUgZmlyc3QgeWllbGRlZCB2YWx1ZS5cbiAgICAgICAgICBkb25lOiBmYWxzZSxcbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgdmFsdWU6IHVuZGVmaW5lZCwgLy8gUmV0dXJuIHVuZGVmaW5lZC5cbiAgICAgICAgICBkb25lOiB0cnVlLFxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH0sXG4gIH07XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIHBydW5lbG9jYWxUZW1wb3JhbFVuaXEoKSB7XG4gIGlmIChDbGlxelNlY3VyZU1lc3NhZ2UubG9jYWxUZW1wb3JhbFVuaXEgJiYgT2JqZWN0LmtleXMoQ2xpcXpTZWN1cmVNZXNzYWdlLmxvY2FsVGVtcG9yYWxVbmlxKS5sZW5ndGggPiAwKSB7XG4gICAgY29uc3QgY3VyclRpbWUgPSBEYXRlLm5vdygpO1xuICAgIGxldCBwaSA9IDA7XG4gICAgT2JqZWN0LmtleXMoQ2xpcXpTZWN1cmVNZXNzYWdlLmxvY2FsVGVtcG9yYWxVbmlxKS5mb3JFYWNoKCBlID0+IHtcbiAgICAgIGNvbnN0IGQgPSBDbGlxelNlY3VyZU1lc3NhZ2UubG9jYWxUZW1wb3JhbFVuaXFbZV0udHM7XG4gICAgICBjb25zdCBkaWZmID0gKGN1cnJUaW1lIC0gZCk7XG4gICAgICBpZiAoZGlmZiA+PSAoMjQgKiA2MCAqIDYwICogMTAwMCkpIHtcbiAgICAgICAgZGVsZXRlIENsaXF6U2VjdXJlTWVzc2FnZS5sb2NhbFRlbXBvcmFsVW5pcVtlXTtcbiAgICAgICAgcGkgKz0gMTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICAvKlxuICAgIGlmKENsaXF6SHVtYW5XZWIuYWN0aW9uU3RhdHMpIHtcbiAgICAgICAgY29uc3QgaXRlbXNMb2NhbFZhbGlkYXRpb24gPSBPYmplY3Qua2V5cyhDbGlxelNlY3VyZU1lc3NhZ2UubG9jYWxUZW1wb3JhbFVuaXEpLmxlbmd0aDtcbiAgICAgICAgQ2xpcXpIdW1hbldlYi5hY3Rpb25TdGF0cy5pdGVtc0xvY2FsVmFsaWRhdGlvbiA9IGl0ZW1zTG9jYWxWYWxpZGF0aW9uO1xuICAgIH1cbiAgICAqL1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRSYW5kb21JbnRJbmNsdXNpdmUobWluLCBtYXgpIHtcbiAgbWluID0gTWF0aC5jZWlsKG1pbik7XG4gIG1heCA9IE1hdGguZmxvb3IobWF4KTtcbiAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4gKyAxKSkgKyBtaW47XG59XG4iXX0=