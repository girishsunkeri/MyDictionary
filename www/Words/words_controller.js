myDictionaryModule.controller('WordCtrl', function($scope, Word, $ionicModal, $timeout, $ionicActionSheet, $ionicPopup, $stateParams, Setting){

	$scope.words = [];
	$scope.currentLanguageId = 1;


	/*------- Basic Crud operations --------*/

	// Will fetch words from DB and update the view.

	function getWordsByLanguageId(LanguageId){
		Word.getWordsByLanguage(LanguageId).then(function(words){
			$scope.words = words;
		});
	}


	$scope.updateWords = function() {

		if(parseInt($stateParams.languageId)){
			$scope.currentLanguageId = $stateParams.languageId
			getWordsByLanguageId($scope.currentLanguageId);
		}else{
			Setting.getByName('DefaultLanguage').then(function(result){
				console.log("Fetching words for " + result.SettingValue);
				$scope.currentLanguageId = parseInt(result.SettingValue);
				getWordsByLanguageId($scope.currentLanguageId);
			});
		}
	};

	// Will perform add or edit based on $scope.addAction parameter
	$scope.addOrEditWord = function(){
		console.log("Adding/Editing word")
		
		$scope.word.LanguageId = $scope.currentLanguageId;
		if($scope.addAction){
			Word.add($scope.word).then(function(){
				console.log("Word added");
				$scope.updateWords();
			});
		}else{
			Word.updateWord($scope.word).then(function(){
				console.log("Word updated");
				$scope.updateWords();
			});
		}

		$timeout(function(){
	      $scope.closeAddWordScreen();
	      $scope.word = {};
	    }, 0);
	};

	$scope.deleteWord = function(wordId){
		var deleteConfirmPopup = $ionicPopup.confirm({
			title: 'Confirm delete',
			template: 'Delete this word?'
		});

		deleteConfirmPopup.then(function(result){
			if(result){
				Word.deleteWord(wordId).then(function(){
					alert("Word deleted!");
					$scope.updateWords();
				});
			}
		});
	};

	// ionic modal operations
	$ionicModal.fromTemplateUrl('Words/add_word.html', {
		scope: $scope
	}).then(function(modal) {
		$scope.modal = modal;
	});

	$scope.closeAddWordScreen = function() {
		$scope.modal.hide();
	};

	$scope.showAddWordScreen = function(selectedWord) {

		if(selectedWord){
			$scope.addAction = false;
			$scope.word = angular.copy(selectedWord);
		}else{
			$scope.addAction = true;
			resetInputs();
		}

		$scope.modal.show();
	};

	function resetInputs(){
		$scope.word = {
			Id: 0,
			Name: "",
			Meaning: "",
			Sentence: "",
			LanguageId: 0
		};
	}

	$scope.showActionsheet = function(selectedWord) {
    
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
		    	$scope.showAddWordScreen(selectedWord);
		    }else{
		    	$scope.deleteWord(selectedWord.Id);
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
		$scope.updateWords();
	})
});