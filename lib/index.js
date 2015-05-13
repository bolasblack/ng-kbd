
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
      // https://github.com/angular/angular.js/blob/35498d7045ba9138016464a344e2c145ce5264c1/src/ng/controller.js#L6
      var CNTRL_REG = /^(\S+)(\s+as\s+(\w+))?$/,
          controllers = {},
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
              injectList,
              match

          if (angular.isString(expression)) {
            match = expression.match(CNTRL_REG)
            injectList = match ? controllers[match[1]] : undefined
          } else {
            injectList = expression
          }

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
