System.register(['../core/utils', '../core/console', '../platform/proxy-filter', './utils', './main'], function (_export) {
  /*
  Picked up from unblock proxy.es
  */

  'use strict';

  var CliqzUtils, console, ProxyFilter, getRandomIntInclusive, CliqzSecureMessage, _default;

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

  return {
    setters: [function (_coreUtils) {
      CliqzUtils = _coreUtils['default'];
    }, function (_coreConsole) {
      console = _coreConsole['default'];
    }, function (_platformProxyFilter) {
      ProxyFilter = _platformProxyFilter['default'];
    }, function (_utils) {
      getRandomIntInclusive = _utils.getRandomIntInclusive;
    }, function (_main) {
      CliqzSecureMessage = _main['default'];
    }],
    execute: function () {
      _default = (function (_ProxyFilter) {
        _inherits(_default, _ProxyFilter);

        /**
        * Wrapper for rule-based url proxying: implementation for Firefox
        * @class Proxy
        * @namespace unblock
        * @constructor
        */

        function _default() {
          _classCallCheck(this, _default);

          _get(Object.getPrototypeOf(_default.prototype), 'constructor', this).call(this);
          this.method = "socks";
          this.port = 9004;
        }

        _createClass(_default, [{
          key: 'shouldProxy',
          value: function shouldProxy(url) {
            var window = CliqzUtils.getWindow();
            return url.scheme === "https" && CliqzSecureMessage.servicesToProxy.indexOf(url.host) > -1 && (CliqzUtils.getPref('hpn-query', false) || CliqzUtils.isOnPrivateTab(window));
          }
        }, {
          key: 'proxy',
          value: function proxy() {
            if (!CliqzSecureMessage.proxyList) {
              return;
            }
            var proxyIdx = getRandomIntInclusive(0, 3);
            var proxyIP = CliqzSecureMessage.proxyList[proxyIdx];
            console.log("Proxying Query: " + proxyIP);

            if (CliqzSecureMessage.proxyInfoObj[proxyIP]) {
              return CliqzSecureMessage.proxyInfoObj[proxyIP];
            } else {
              var ob = this.newProxy(this.method, proxyIP, this.port, null, 1000, null);
              CliqzSecureMessage.proxyInfoObj[proxyIP] = ob;
              return ob;
            }
          }
        }]);

        return _default;
      })(ProxyFilter);

      _export('default', _default);

      ;
    }
  };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImhwbi9wcm94eS1maWx0ZXIuZXMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztxQ0FHUyxxQkFBcUI7Ozs7Ozs7Ozs7Ozs7OztBQWFqQiw0QkFBRzs7O0FBQ1osMEZBQVE7QUFDUixjQUFJLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQztBQUN0QixjQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztTQUNsQjs7OztpQkFFVSxxQkFBQyxHQUFHLEVBQUU7QUFDZixnQkFBTSxNQUFNLEdBQUcsVUFBVSxDQUFDLFNBQVMsRUFBRSxDQUFDO0FBQ3RDLG1CQUFPLEFBQUMsR0FBRyxDQUFDLE1BQU0sS0FBSyxPQUFPLElBQzNCLGtCQUFrQixDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxBQUFDLEtBRXpELFVBQVUsQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLEtBQUssQ0FBQyxJQUN0QyxVQUFVLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFBLEFBQ2xDLENBQUM7V0FDTDs7O2lCQUVJLGlCQUFHO0FBQ04sZ0JBQUksQ0FBQyxrQkFBa0IsQ0FBQyxTQUFTLEVBQUU7QUFDakMscUJBQU87YUFDUjtBQUNELGdCQUFNLFFBQVEsR0FBRyxxQkFBcUIsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUM7QUFDNUMsZ0JBQU0sT0FBTyxHQUFHLGtCQUFrQixDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUN2RCxtQkFBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsR0FBRyxPQUFPLENBQUMsQ0FBQzs7QUFFMUMsZ0JBQUksa0JBQWtCLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxFQUFFO0FBQzVDLHFCQUFPLGtCQUFrQixDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQzthQUNqRCxNQUFNO0FBQ0wsa0JBQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQzVFLGdDQUFrQixDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDOUMscUJBQU8sRUFBRSxDQUFDO2FBQ1g7V0FDRjs7OztTQXRDMEIsV0FBVzs7OztBQXVDdkMsT0FBQyIsImZpbGUiOiJocG4vcHJveHktZmlsdGVyLmVzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IENsaXF6VXRpbHMgZnJvbSAnLi4vY29yZS91dGlscyc7XG5pbXBvcnQgY29uc29sZSBmcm9tICcuLi9jb3JlL2NvbnNvbGUnO1xuaW1wb3J0IFByb3h5RmlsdGVyIGZyb20gJy4uL3BsYXRmb3JtL3Byb3h5LWZpbHRlcic7XG5pbXBvcnQgeyBnZXRSYW5kb21JbnRJbmNsdXNpdmUgfWZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IENsaXF6U2VjdXJlTWVzc2FnZSBmcm9tICcuL21haW4nO1xuLypcblBpY2tlZCB1cCBmcm9tIHVuYmxvY2sgcHJveHkuZXNcbiovXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIGV4dGVuZHMgUHJveHlGaWx0ZXIge1xuICAvKipcbiAgKiBXcmFwcGVyIGZvciBydWxlLWJhc2VkIHVybCBwcm94eWluZzogaW1wbGVtZW50YXRpb24gZm9yIEZpcmVmb3hcbiAgKiBAY2xhc3MgUHJveHlcbiAgKiBAbmFtZXNwYWNlIHVuYmxvY2tcbiAgKiBAY29uc3RydWN0b3JcbiAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLm1ldGhvZCA9IFwic29ja3NcIjtcbiAgICB0aGlzLnBvcnQgPSA5MDA0O1xuICB9XG5cbiAgc2hvdWxkUHJveHkodXJsKSB7XG4gICAgY29uc3Qgd2luZG93ID0gQ2xpcXpVdGlscy5nZXRXaW5kb3coKTtcbiAgICByZXR1cm4gKHVybC5zY2hlbWUgPT09IFwiaHR0cHNcIikgJiZcbiAgICAgIChDbGlxelNlY3VyZU1lc3NhZ2Uuc2VydmljZXNUb1Byb3h5LmluZGV4T2YodXJsLmhvc3QpID4gLTEpICYmXG4gICAgICAoXG4gICAgICAgIENsaXF6VXRpbHMuZ2V0UHJlZignaHBuLXF1ZXJ5JywgZmFsc2UpIHx8XG4gICAgICAgIENsaXF6VXRpbHMuaXNPblByaXZhdGVUYWIod2luZG93KVxuICAgICAgKTtcbiAgfVxuXG4gIHByb3h5KCkge1xuICAgIGlmICghQ2xpcXpTZWN1cmVNZXNzYWdlLnByb3h5TGlzdCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBwcm94eUlkeCA9IGdldFJhbmRvbUludEluY2x1c2l2ZSgwLDMpO1xuICAgIGNvbnN0IHByb3h5SVAgPSBDbGlxelNlY3VyZU1lc3NhZ2UucHJveHlMaXN0W3Byb3h5SWR4XTtcbiAgICBjb25zb2xlLmxvZyhcIlByb3h5aW5nIFF1ZXJ5OiBcIiArIHByb3h5SVApO1xuXG4gICAgaWYgKENsaXF6U2VjdXJlTWVzc2FnZS5wcm94eUluZm9PYmpbcHJveHlJUF0pIHtcbiAgICAgIHJldHVybiBDbGlxelNlY3VyZU1lc3NhZ2UucHJveHlJbmZvT2JqW3Byb3h5SVBdO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBvYiA9IHRoaXMubmV3UHJveHkodGhpcy5tZXRob2QsIHByb3h5SVAsIHRoaXMucG9ydCwgbnVsbCwgMTAwMCwgbnVsbCk7XG4gICAgICBDbGlxelNlY3VyZU1lc3NhZ2UucHJveHlJbmZvT2JqW3Byb3h5SVBdID0gb2I7XG4gICAgICByZXR1cm4gb2I7XG4gICAgfVxuICB9XG59O1xuIl19