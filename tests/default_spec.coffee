
'use strict'

describe '$kbd spec', ->
  firstScope            = secondScope   =
  firstCtrlKbd          = secondCtrlKbd =
  firstCtrlSpy          = secondCtrlSpy =
  firstCtrlEventHandler = secondCtrlEventHandler = null

  init = ->
    firstScope            = secondScope   =
    firstCtrlKbd          = secondCtrlKbd =
    firstCtrlSpy          = secondCtrlSpy =
    firstCtrlEventHandler = secondCtrlEventHandler = null

  initScope = ($rootScope) ->
    firstScope = $rootScope.$new()
    secondScope = $rootScope.$new()

  before ->
    angular.module('test', ['ng'])
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
