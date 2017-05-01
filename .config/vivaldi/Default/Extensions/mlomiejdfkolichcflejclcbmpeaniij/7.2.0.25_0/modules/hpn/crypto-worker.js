System.register(['../core/config'], function (_export) {
  'use strict';

  var config, CryptoWorker;

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  return {
    setters: [function (_coreConfig) {
      config = _coreConfig['default'];
    }],
    execute: function () {
      CryptoWorker = (function () {
        function CryptoWorker() {
          _classCallCheck(this, CryptoWorker);

          this.worker = new Worker(config.baseURL + 'hpn/worker.bundle.js');
        }

        _createClass(CryptoWorker, [{
          key: 'postMessage',
          value: function postMessage() {
            var _worker;

            (_worker = this.worker).postMessage.apply(_worker, arguments);
          }
        }, {
          key: 'terminate',
          value: function terminate() {
            this.worker.terminate();
          }
        }, {
          key: 'onmessage',
          set: function set(fn) {
            this.worker.onmessage = fn;
          }
        }]);

        return CryptoWorker;
      })();

      _export('default', CryptoWorker);
    }
  };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImhwbi9jcnlwdG8td29ya2VyLmVzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztjQUVNLFlBQVk7Ozs7Ozs7Ozs7O0FBQVosa0JBQVk7QUFDTCxpQkFEUCxZQUFZLEdBQ0Y7Z0NBRFYsWUFBWTs7QUFFZCxjQUFJLENBQUMsTUFBTSxHQUFHLElBQUksTUFBTSxDQUFJLE1BQU0sQ0FBQyxPQUFPLDBCQUF1QixDQUFDO1NBQ25FOztxQkFIRyxZQUFZOztpQkFTTCx1QkFBVTs7O0FBQ25CLHVCQUFBLElBQUksQ0FBQyxNQUFNLEVBQUMsV0FBVyxNQUFBLG9CQUFTLENBQUM7V0FDbEM7OztpQkFFUSxxQkFBRztBQUNWLGdCQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDO1dBQ3pCOzs7ZUFWWSxhQUFDLEVBQUUsRUFBRTtBQUNoQixnQkFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDO1dBQzVCOzs7ZUFQRyxZQUFZOzs7eUJBa0JILFlBQVkiLCJmaWxlIjoiaHBuL2NyeXB0by13b3JrZXIuZXMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY29uZmlnIGZyb20gJy4uL2NvcmUvY29uZmlnJztcblxuY2xhc3MgQ3J5cHRvV29ya2VyIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy53b3JrZXIgPSBuZXcgV29ya2VyKGAke2NvbmZpZy5iYXNlVVJMfWhwbi93b3JrZXIuYnVuZGxlLmpzYCk7XG4gIH1cblxuICBzZXQgb25tZXNzYWdlKGZuKSB7XG4gICAgdGhpcy53b3JrZXIub25tZXNzYWdlID0gZm47XG4gIH1cblxuICBwb3N0TWVzc2FnZSguLi5hcmdzKSB7XG4gICAgdGhpcy53b3JrZXIucG9zdE1lc3NhZ2UoLi4uYXJncyk7XG4gIH1cblxuICB0ZXJtaW5hdGUoKSB7XG4gICAgdGhpcy53b3JrZXIudGVybWluYXRlKCk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ3J5cHRvV29ya2VyO1xuIl19