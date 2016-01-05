// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var myDictionaryModule = angular.module('MyDictionary', ['ionic', 'ngCordova', 'MyDictionary.services']);


myDictionaryModule.run(function($ionicPlatform, DB) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    DB.init();
  });
})

.config(function($stateProvider, $urlRouterProvider){
  $stateProvider

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.words', {
    url: '/words/:languageId',
    views: {
      'menuContent' : {
        templateUrl: 'Words/words_list.html',
        controller: 'WordCtrl'
      }
    }
  })

  .state('app.languages', {
    url: '/languages',
    views: {
      'menuContent' : {
        templateUrl: 'Language/language_list.html',
        controller: 'LanguageCtrl'
      }
    }
  })

  .state('app.importFile', {
    url: '/importFile',
    views: {
      'menuContent' : {
        templateUrl: 'Import/import_file.html',
        controller: 'ImportFileCtrl'
      }
    }
  });

  $urlRouterProvider.otherwise('/app/words/1');
})

.controller('AppCtrl', function($scope, $ionicModal, $timeout){

  
});
