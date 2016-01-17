myDictionaryModule.controller('SettingCtrl', function($scope, Language, $ionicModal, Setting, $state, $ionicHistory){
	
	$scope.settings = [];
	$scope.defaultLanguage = { Id: 0, SettingValue: "", SettingValueText: "" };
	$scope.defaultUrl = { Id: 0, SettingValue: "" };

	$scope.languages = [];

	/*------- Basic Crud operations --------*/

	// Will fetch languages from DB and update the view.
	$scope.updateLanguages = function() {
		Language.all().then(function(languages){
			console.log(languages);
			$scope.languages = languages;
		});
	};

	$scope.$on('$ionicView.enter', function(e) {
		$scope.updateSettings();
		$scope.updateLanguages();
	});

	// Will fetch settings from DB and update the view.
	$scope.updateSettings = function() {
		Setting.all().then(function(settings){
			console.log(settings);
			$scope.settings = settings;
			initializeSettings();
		});
	};

	$scope.saveSettings = function(){
		Setting.update($scope.defaultLanguage);
		Setting.update($scope.defaultUrl).then(function(){
			$ionicHistory.nextViewOptions({
		    	disableBack: true
		  	});
			$state.go('app.words');
		});
	};


	function initializeSettings(){
		angular.forEach($scope.settings, function(setting){
			console.log("looping");
			console.log(setting.SettingName);
			if(setting.SettingName == "DefaultLanguage"){
				updateDefaultLanguage(setting);
			}else if(setting.SettingName == "DefaultUrl"){
				updateDefaultUrl(setting);
			}
    	});
	}

	function updateDefaultUrl(setting){
		$scope.defaultUrl = { Id: setting.Id, SettingValue: setting.SettingValue }
	}

	function updateDefaultLanguage(setting){
		console.log("updateDefaultLanguage");
		console.log(setting)

		Language.getById(parseInt(setting.SettingValue)).then(function(result){
			console.log(result);
			$scope.defaultLanguage = { Id: setting.Id, SettingValue: result.Id, SettingValueText: result.Name  }
			console.log($scope.defaultLanguage);
		})
		
	}

	$ionicModal.fromTemplateUrl('Language/language_list_modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.languagesModal = modal;
    });

    $scope.openLanguagesModal = function() {
      $scope.languagesModal.show();
    };

    $scope.closeLanguagesModal = function() {
      $scope.languagesModal.hide();
    };

    $scope.$on('$destroy', function() {
      $scope.languagesModal.remove();
    });
    
    $scope.selectLanguage= function(language) {
      $scope.defaultLanguage = { Id: $scope.defaultLanguage.Id, SettingValue: language.Id, SettingValueText: language.Name };
      $scope.closeLanguagesModal();
    }

});