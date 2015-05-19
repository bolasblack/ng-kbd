# ng-kbd

[Mousetrap](https://craig.is/killing/mice) wrapper for [angular.js](https://www.angularjs.org/) to handling keyboard shortcuts in scope.

## Install

```bash
bower install bolasblack/ng-kbd --save
# Or
npm install bolasblack/ng-kbd --save
```

## Usage

```javascript
angular.module('app', [])

// You can inject `$kbd` in controller
.controller('TestController', ['$kbd', ($kbd) ->
  // Call all method of Mousetrap instance
  $kbd.bind
  $kbd.trigger

  // When scope destroyed, the event listener will be removed
])
```

## Running Tests

```bash
npm install
npm test
```
