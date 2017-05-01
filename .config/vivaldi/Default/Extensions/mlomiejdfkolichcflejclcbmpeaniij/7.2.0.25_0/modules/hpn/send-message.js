System.register(['./main', './crypto-worker'], function (_export) {

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImhwbi9zZW5kLW1lc3NhZ2UuZXMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7d0NBSU0sV0FBVzs7Ozs7Ozs7Ozs7O0FBdUJWLFdBQVMsS0FBSyxDQUFDLENBQUMsRUFBYTtRQUFYLElBQUkseURBQUcsRUFBRTs7QUFDaEMsUUFBTSxrQkFBa0IsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO0FBQzlDLGVBQVcsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLENBQUMsQ0FBQzs7QUFFbkMsc0JBQWtCLENBQUMsU0FBUyxHQUFHLFVBQUMsQ0FBQyxFQUFLO0FBQ3BDLFVBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssV0FBVyxFQUFFO0FBQy9CLDBCQUFrQixDQUFDLGlCQUFpQixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUM7QUFDaEUsMEJBQWtCLENBQUMsT0FBTyxDQUFDLG1CQUFtQixFQUFFLENBQUM7T0FDbEQ7O0FBRUQsVUFBTSxPQUFPLEdBQUcsa0JBQWtCLENBQUMsV0FBVyxFQUFFLENBQUM7QUFDakQsVUFBSSxPQUFPLEVBQUU7QUFDWCxtQkFBVyxDQUFDLGtCQUFrQixFQUFFLE9BQU8sQ0FBQyxDQUFDO09BQzFDLE1BQU07O0FBRUwsMEJBQWtCLENBQUMsT0FBTyxDQUFDLG1CQUFtQixFQUFFLENBQUM7QUFDakQsMEJBQWtCLENBQUMsU0FBUyxFQUFFLENBQUM7QUFDL0IsZUFBTyxJQUFJLENBQUM7T0FDYjtLQUNGLENBQUM7R0FDSDs7Ozs7Ozs7O0FBM0NLLGlCQUFXLEdBQUcsU0FBZCxXQUFXLENBQWEsRUFBRSxFQUFFLENBQUMsRUFBRTtBQUNuQyxZQUFJO0FBQ0YsWUFBRSxDQUFDLFdBQVcsQ0FBQztBQUNiLGVBQUcsRUFBRSxDQUFDO0FBQ04sZ0JBQUksRUFBRSxXQUFXO0FBQ2pCLHFCQUFTLEVBQUUsa0JBQWtCLENBQUMsU0FBUztBQUN2QyxlQUFHLEVBQUUsa0JBQWtCLENBQUMsR0FBRztBQUMzQixnQkFBSSxFQUFFLGtCQUFrQixDQUFDLElBQUk7QUFDN0IsZ0JBQUksRUFBRSxrQkFBa0IsQ0FBQyxZQUFZO0FBQ3JDLHNCQUFVLEVBQUUsa0JBQWtCLENBQUMsVUFBVTtBQUN6Qyw2QkFBaUIsRUFBRSxrQkFBa0IsQ0FBQyxpQkFBaUI7V0FDeEQsQ0FBQyxDQUFDO1NBQ0osQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUNYO09BQ0Y7O0FBNkJBLE9BQUMiLCJmaWxlIjoiaHBuL3NlbmQtbWVzc2FnZS5lcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBDbGlxelNlY3VyZU1lc3NhZ2UgZnJvbSAnLi9tYWluJztcbmltcG9ydCBDcnlwdG9Xb3JrZXIgZnJvbSAnLi9jcnlwdG8td29ya2VyJztcblxuLy8gVXNpbmcgdGhpcyBmdW5jdGlvbiBpdCBpcyBlYXNpZXIgdG8gc2VlIGlmIHRoZSBwdXNoIG9mIG1lc3NhZ2UgZmFpbGVkLlxuY29uc3Qgc2VuZE1lc3NhZ2UgPSBmdW5jdGlvbiAod3csIG0pIHtcbiAgdHJ5IHtcbiAgICB3dy5wb3N0TWVzc2FnZSh7XG4gICAgICBtc2c6IG0sXG4gICAgICB0eXBlOiAndGVsZW1ldHJ5JyxcbiAgICAgIHNvdXJjZW1hcDogQ2xpcXpTZWN1cmVNZXNzYWdlLnNvdXJjZU1hcCxcbiAgICAgIHVwazogQ2xpcXpTZWN1cmVNZXNzYWdlLnVQSyxcbiAgICAgIGRzcGs6IENsaXF6U2VjdXJlTWVzc2FnZS5kc1BLLFxuICAgICAgc3NwazogQ2xpcXpTZWN1cmVNZXNzYWdlLnNlY3VyZUxvZ2dlcixcbiAgICAgIHJvdXRldGFibGU6IENsaXF6U2VjdXJlTWVzc2FnZS5yb3V0ZVRhYmxlLFxuICAgICAgbG9jYWxUZW1wb3JhbFVuaXE6IENsaXF6U2VjdXJlTWVzc2FnZS5sb2NhbFRlbXBvcmFsVW5pcSxcbiAgICB9KTtcbiAgfSBjYXRjaCAoZSkge1xuICB9XG59O1xuXG4vKlxuVGhpcyB3aWxsIHNlbmQgdGhlIG1lc3NhZ2VzIGluc2lkZSB0aGUgdHJrIG9uZSBhdCBhIHRpbWUuIFRoaXMgdXNlcyBhIGdlbmVyYXRvciBleHByZXNzaW9uLlxuXG5XaWxsIHJldHVybiBhIFByb21pc2Ugd2hpY2ggcmVzb2x2ZXMgdG8gYW4gYXJyYXksIG9uZSBmb3IgZWFjaCBzZW50IG1lc3NhZ2U6XG5pdHMgdmFsdWUgd2lsbCBiZSBudWxsIGlmIGV2ZXJ5dGhpbmcgd2FzIG9rLFxuYW5kIGEgc3RyaW5nIGluZGljYXRpbmcgdGhlIGVycm9yIG1lc3NhZ2Ugb3RoZXJ3aXNlICh1c2VmdWwgZm9yIHRlc3RpbmcpXG4qL1xuZXhwb3J0IGZ1bmN0aW9uIHNlbmRNKG0sIHNlbnQgPSBbXSkge1xuICBjb25zdCBzZW5kTWVzc2FnZVdDcnlwdG8gPSBuZXcgQ3J5cHRvV29ya2VyKCk7XG4gIHNlbmRNZXNzYWdlKHNlbmRNZXNzYWdlV0NyeXB0bywgbSk7XG5cbiAgc2VuZE1lc3NhZ2VXQ3J5cHRvLm9ubWVzc2FnZSA9IChlKSA9PiB7XG4gICAgaWYgKGUuZGF0YS50eXBlID09PSAndGVsZW1ldHJ5Jykge1xuICAgICAgQ2xpcXpTZWN1cmVNZXNzYWdlLmxvY2FsVGVtcG9yYWxVbmlxID0gZS5kYXRhLmxvY2FsVGVtcG9yYWxVbmlxO1xuICAgICAgQ2xpcXpTZWN1cmVNZXNzYWdlLnN0b3JhZ2Uuc2F2ZUxvY2FsQ2hlY2tUYWJsZSgpO1xuICAgIH1cblxuICAgIGNvbnN0IG5leHRNc2cgPSBDbGlxelNlY3VyZU1lc3NhZ2UubmV4dE1lc3NhZ2UoKTtcbiAgICBpZiAobmV4dE1zZykge1xuICAgICAgc2VuZE1lc3NhZ2Uoc2VuZE1lc3NhZ2VXQ3J5cHRvLCBuZXh0TXNnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gUXVldWUgaXMgZW1wdHkgaGVuY2UgZHVtcCB0aGUgbG9jYWwgdGVtcCBxdWV1ZSB0byBkaXNrLlxuICAgICAgQ2xpcXpTZWN1cmVNZXNzYWdlLnN0b3JhZ2Uuc2F2ZUxvY2FsQ2hlY2tUYWJsZSgpO1xuICAgICAgc2VuZE1lc3NhZ2VXQ3J5cHRvLnRlcm1pbmF0ZSgpO1xuICAgICAgcmV0dXJuIHNlbnQ7XG4gICAgfVxuICB9O1xufTtcbiJdfQ==