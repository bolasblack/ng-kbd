
;(function() {

  angular.module('ng')

    .factory('$kbd', ['$window', function($window) {
      var Mousetrap = $window.Mousetrap
      var bind = function(keys, callback, action) {
        var self = this
        var wrappedCallback = function() {
          self._scope.$apply(function() {
            callback.apply(self, arguments)
          })
        }
        return Mousetrap.prototype.bind.apply(self, arguments)
      }

      return function(scope) {
        var mousetrap = new Mousetrap
        mousetrap._scope = scope
        mousetrap.bind = bind
        return mousetrap
      }
    }])

    .config(['$provide', function($provide) {
      $provide.decorator('$controller', ['$delegate', '$kbd', function($controller, $kbd) {
        return function(expression, locals, later, ident) {
          var $scope = locals.$scope,
              $injectKbd = new $kbd($scope)

          locals['$kbd'] = $injectKbd
          $scope.$on('$destroy', function() { $injectKbd.destroy() })
          return $controller(expression, locals, later, ident)
        }
      }])
    }])

})();
