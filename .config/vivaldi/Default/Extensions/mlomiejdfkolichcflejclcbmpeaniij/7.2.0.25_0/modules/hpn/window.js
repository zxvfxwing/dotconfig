System.register(['../core/utils', './background'], function (_export) {
  'use strict';

  var utils, background, _default;

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  return {
    setters: [function (_coreUtils) {
      utils = _coreUtils['default'];
    }, function (_background) {
      background = _background['default'];
    }],
    execute: function () {
      _default = (function () {
        function _default(settings) {
          _classCallCheck(this, _default);

          this.window = settings.window;
        }

        _createClass(_default, [{
          key: 'init',
          value: function init() {
            if (background.CliqzSecureMessage) {
              background.CliqzSecureMessage.initAtWindow(this.window);
            }
          }
        }, {
          key: 'unload',
          value: function unload() {}
        }, {
          key: 'status',
          value: function status() {
            if (background.CliqzSecureMessage && !utils.getPref('cliqz_core_disabled', false)) {
              return {
                visible: true,
                state: utils.getPref('hpn-query')
              };
            }
          }
        }]);

        return _default;
      })();

      _export('default', _default);
    }
  };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImhwbi93aW5kb3cuZXMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFLYSwwQkFBQyxRQUFRLEVBQUU7OztBQUNwQixjQUFJLENBQUMsTUFBTSxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUM7U0FDL0I7Ozs7aUJBRUcsZ0JBQUc7QUFDTCxnQkFBSSxVQUFVLENBQUMsa0JBQWtCLEVBQUU7QUFDakMsd0JBQVUsQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2FBQ3pEO1dBQ0Y7OztpQkFFSyxrQkFBRyxFQUNSOzs7aUJBRUssa0JBQUc7QUFDUCxnQkFBSSxVQUFVLENBQUMsa0JBQWtCLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLHFCQUFxQixFQUFFLEtBQUssQ0FBQyxFQUFFO0FBQ2pGLHFCQUFPO0FBQ0wsdUJBQU8sRUFBRSxJQUFJO0FBQ2IscUJBQUssRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQztlQUNsQyxDQUFDO2FBQ0g7V0FDRiIsImZpbGUiOiJocG4vd2luZG93LmVzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHV0aWxzIGZyb20gJy4uL2NvcmUvdXRpbHMnO1xuaW1wb3J0IGJhY2tncm91bmQgZnJvbSAnLi9iYWNrZ3JvdW5kJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3Mge1xuXG4gIGNvbnN0cnVjdG9yKHNldHRpbmdzKSB7XG4gICAgdGhpcy53aW5kb3cgPSBzZXR0aW5ncy53aW5kb3c7XG4gIH1cblxuICBpbml0KCkge1xuICAgIGlmIChiYWNrZ3JvdW5kLkNsaXF6U2VjdXJlTWVzc2FnZSkge1xuICAgICAgYmFja2dyb3VuZC5DbGlxelNlY3VyZU1lc3NhZ2UuaW5pdEF0V2luZG93KHRoaXMud2luZG93KTtcbiAgICB9XG4gIH1cblxuICB1bmxvYWQoKSB7XG4gIH1cblxuICBzdGF0dXMoKSB7XG4gICAgaWYgKGJhY2tncm91bmQuQ2xpcXpTZWN1cmVNZXNzYWdlICYmICF1dGlscy5nZXRQcmVmKCdjbGlxel9jb3JlX2Rpc2FibGVkJywgZmFsc2UpKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB2aXNpYmxlOiB0cnVlLFxuICAgICAgICBzdGF0ZTogdXRpbHMuZ2V0UHJlZignaHBuLXF1ZXJ5JyksXG4gICAgICB9O1xuICAgIH1cbiAgfVxufVxuIl19