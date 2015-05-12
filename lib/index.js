
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

    .config(['$provide', '$controllerProvider', function($provide, $controllerProvider) {
      var controllers = {},
          originRegister = $controllerProvider.register

      $controllerProvider.register = function(name, constructor) {
        if (angular.isObject(name)) {
          angular.extend(controllers, name)
        } else {
          controllers[name] = constructor
        }
        return originRegister.apply(this, arguments)
      }

      $provide.decorator('$controller', ['$delegate', '$kbd', function($controller, $kbd) {
        return function(expression, locals, later, ident) {
          var $scope,
              $injectKbd,
              injector = angular.injector(),
              injectList = angular.isString(expression) ? controllers[expression] : expression

          if (angular.isFunction(injectList)) {
            injectList = injector.annotate(injectList)
          } else {
            injectList = (injectList || [])
          }

          if (locals && injectList.indexOf('$kbd') !== -1) {
            $scope = locals.$scope
            $injectKbd = $kbd($scope)
            locals['$kbd'] = $injectKbd
            $scope.$on('$destroy', function(){ $injectKbd.destroy() })
          }

          return $controller(expression, locals, later, ident)
        }
      }])
    }])

})();
