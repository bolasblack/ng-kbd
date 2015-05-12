
'use strict'

describe '$kbd spec', ->
  spy$kbd = null
  firstScope            = secondScope   =
  firstCtrlKbd          = secondCtrlKbd =
  firstCtrlSpy          = secondCtrlSpy = null

  init = ->
    firstScope            = secondScope   =
    firstCtrlKbd          = secondCtrlKbd =
    firstCtrlSpy          = secondCtrlSpy = null

  initScope = ($rootScope) ->
    firstScope = $rootScope.$new()
    secondScope = $rootScope.$new()

  before ->
    angular.module('ng').config(['$provide', ($provide) ->
      $provide.decorator('$kbd', ['$delegate', ($kbd) ->
        spy$kbd = sinon.spy $kbd
      ])
    ])

    angular.module('test', ['ng'])
      .controller('EmptyController', ->)
      .controller('FirstTestController', ['$kbd', ($kbd) ->
        firstCtrlKbd = $kbd
        firstCtrlSpy = sinon.spy()
        $kbd.bind 'test', firstCtrlSpy
      ])
      .controller('SecondTestController', ['$kbd', ($kbd) ->
        secondCtrlKbd = $kbd
        secondCtrlSpy = sinon.spy()
        $kbd.bind 'test', secondCtrlSpy
      ])

  beforeEach ->
    init()
    module 'test'

  it 'is different for every controller', inject ($controller, $rootScope) ->
    initScope $rootScope
    $controller 'FirstTestController' , $scope: firstScope
    $controller 'SecondTestController', $scope: secondScope
    expect(firstCtrlKbd).to.not.equal secondCtrlKbd

  it 'will unregister all event after scope destroyed', inject ($controller, $rootScope) ->
    initScope $rootScope
    $controller 'FirstTestController' , $scope: firstScope
    $controller 'SecondTestController', $scope: secondScope
    firstScope.$broadcast '$destroy'
    firstCtrlKbd.trigger 'test'
    secondCtrlKbd.trigger 'test'
    expect(firstCtrlSpy).to.not.been.called
    expect(secondCtrlSpy).to.have.been.called

  it 'only create Mousetrap instance for controller which need it', inject ($controller, $rootScope, $kbd) ->
    originCount = spy$kbd.callCount
    $controller 'EmptyController', $scope: $rootScope.$new()
    expect(spy$kbd.callCount).to.eql originCount
    initScope $rootScope
    $controller 'FirstTestController', $scope: firstScope
    expect(spy$kbd.callCount).to.eql originCount + 1
