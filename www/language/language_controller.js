myDictionaryModule.controller('LanguageCtrl', function($scope, Language, $ionicModal, $timeout, $ionicActionSheet, $ionicPopup){

	$scope.languages = [];

	/*------- Basic Crud operations --------*/

	// Will fetch languages from DB and update the view.
	$scope.updateLanguages = function() {
		Language.all().then(function(languages){
			console.log(languages);
			$scope.languages = languages;
		});
	};

	// Will perform add or edit based on $scope.addAction parameter
	$scope.addOrEditLanguage = function(){
		console.log("Adding/Editing language")
		
		if($scope.addAction){
			Language.add($scope.language).then(function(){
				console.log("Language added");
				$scope.updateLanguages();
			});
		}else{
			Language.updateLanguage($scope.language).then(function(){
				console.log("Language updated");
				$scope.updateLanguages();
			});
		}

		$timeout(function(){
	      $scope.closeAddLanguageScreen();
	      $scope.Language = {};
	    }, 0);
	};

	$scope.deleteLanguage = function(languageId){
		var deleteConfirmPopup = $ionicPopup.confirm({
			title: 'Confirm delete',
			template: 'Delete this language?'
		});

		deleteConfirmPopup.then(function(result){
			if(result){
				Language.deleteLanguage(languageId).then(function(){
					alert("Language deleted!");
					$scope.updateLanguages();
				});
			}
		});
	};

	// ionic modal operations
	$ionicModal.fromTemplateUrl('Language/add_language.html', {
		scope: $scope
	}).then(function(modal) {
		$scope.modal = modal;
	});

	$scope.closeAddLanguageScreen = function() {
		$scope.modal.hide();
	};

	$scope.showAddLanguageScreen = function(selectedLanguage) {

		if(selectedLanguage){
			$scope.addAction = false;
			$scope.language = angular.copy(selectedLanguage);
		}else{
			$scope.addAction = true;
			resetInputs();
		}

		$scope.modal.show();
	};

	function resetInputs(){
		$scope.language = {
			Id: 0,
			Name: ""
		};
	}

	$scope.showActionsheet = function(selectedLanguage) {
    
		$ionicActionSheet.show({
		  buttons: [
		    { text: '<i class="icon ion-edit"></i> Edit' },
		    { text: '<i class="icon ion-android-close"></i> Delete' }
		  ],
		  cancelText: 'Cancel',
		  cancel: function() {
		    console.log('CANCELLED');
		  },
		  buttonClicked: function(index) {
		    console.log('BUTTON CLICKED', index);
		    if(index == 0){
		    	$scope.showAddLanguageScreen(selectedLanguage);
		    }else{
		    	$scope.deleteLanguage(selectedLanguage.Id);
		    }
		    return true;
		  },
		  destructiveButtonClicked: function() {
		    console.log('DESTRUCT');
		    return true;
		  }
		});
	};

	$scope.$on('$ionicView.enter', function(e) {
		$scope.updateLanguages();
	});
});