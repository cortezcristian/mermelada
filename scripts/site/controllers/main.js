'use strict';

/**
 * @ngdoc function
 * @name anyandgoApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the anyandgoApp
 */
angular.module('anyandgoApp')
  .controller('MainCtrl', function ($scope, $rootScope, $http, $log, MermeladaService, toastr) {
    $scope.anyandgoversion = 'v0.1';
    $scope.mermeladacode = '';
    $scope.template = '';
    $scope.resultjs = '';
    $http.get($rootScope.config.app_domain+'/scripts/site/views/mermelada-code.hbs').then(function(res){
        $scope.mermeladacode = res.data || '';
    });

    $http.get($rootScope.config.app_domain+'/scripts/site/views/mongoose-model.js.hbs').then(function(res){
        var source = res.data || '';
        $scope.template = Handlebars.compile(source);
        $scope.processMermelada();
    });


    $scope.processMermelada = function(){
      var res = MermeladaService.parse($scope.mermeladacode);

      if ($scope.template !== '') {
        $scope.resultjs = $scope.template(res);
      }
    }

    $scope.sourceCopied = function(){
       toastr.info('Generated source code copied to your clipboard', 'Copied!', {
           iconClass : 'toast-mermelada'
       });
    }

    $scope.mermeladaLoaded = function(_editor) {
      // Options
      //_editor.setReadOnly(true);
      $log.log("mermelada loaded");
    };

    $scope.mermeladaChanged = function(e) {
      //
      $log.log("mermelada changed", $scope.mermeladacode);
      /*
      var res = MermeladaService.parseClass($scope.mermeladacode);
      if ($scope.template !== '') {
        $scope.resultjs = $scope.template(res);
      }
      */
      $scope.processMermelada();
    };

    $scope.resultjsLoaded = function(_editor) {
      // Options
      _editor.setReadOnly(true);
      $log.log("js result loaded");
    };

    $scope.resultjsChanged = function(e) {
      //
      $log.log("js result changed");
    };
      
    /*
    $timeout(function(){
      $scope.processMermelada();
    }, 500);
    */

  });
