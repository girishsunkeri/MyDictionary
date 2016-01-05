myDictionaryModule.controller('ImportFileCtrl', function($scope, $http, Word, $ionicPlatform, $cordovaFile, Language, $ionicModal){
	var isJsonFile = true;
	var importedWordsCount = 0;

	$scope.progressPercent = 0;
	$scope.showProgressbar = false;
	$scope.totalWordsImported = 0;
	$scope.serverUrl = "";
	$scope.selectedLanguageId = 0;
	$scope.selectedLanguage = "--Select Language--";
	$scope.languages = [];

	$scope.updateLanguages = function() {
		Language.all().then(function(languages){
			console.log(languages);
			$scope.languages = languages;
		});
	};

	$scope.updateLanguages();

	function insertTextData(rawData){
		var lines = rawData.split('\n');
		var words = [];
		console.log(lines);

		for(var line = 0; line < lines.length; line += 3){
	      if((lines[line]).length <= 1){
	      	line++;
	      }
	      words.push({ "Name": lines[line], "Meaning": lines[line+1], "Sentence": lines[line+2], "LanguageId": $scope.selectedLanguageId});
	    }
	    console.log(words);
		insertData(words);
	}

	function insertData(words){
		var count = 0, totalWords = words.length;

		angular.forEach(words, function(word){
			Word.getByName(word.Name).then(function(result){
				if(!result){
					word.LanguageId = $scope.selectedLanguageId;
					Word.add(word).then(function(result){
						count++;

						$scope.progressPercent = count/totalWords * 100;
						console.log($scope.progressPercent);
						if(count == totalWords){
							$scope.totalWordsImported = totalWords;
						}
					});
				}else{
					console.log(word.Name + " already present.")
				}
			});
		});
	}

	$scope.importWordsServer = function(jsonFile){
		$scope.showProgressbar = true;
		$scope.progressPercent = 0;
		$scope.totalWordsImported = 0;

		isJsonFile = jsonFile;

		if(isJsonFile){
			$http.get($scope.serverUrl).success(function(words){
				insertJSONData(words);
			});
		}else{
			$http.get($scope.serverUrl).success(function(rawData){
				console.log(rawData);
				insertData(rawData);
			});
		}
	}

	$scope.importWordsLocal = function(jsonFile){
		$scope.showProgressbar = true;
		$scope.progressPercent = 0;
		$scope.totalWordsImported = 0;

		isJsonFile = jsonFile;
		var textFileName = "word_data.txt", jsonFileName = "word_data.json",
			rootDirectory = cordova.file.externalRootDirectory,
			appDirectory = "MyDictionary",
			directoryPath = "";

		if(isJsonFile){
			directoryPath = rootDirectory + appDirectory + "/" + jsonFileName;
		}else{
			directoryPath = rootDirectory + appDirectory + "/" + textFileName;
		}

		console.log(directoryPath);

		window.resolveLocalFileSystemURL(directoryPath, fileFound, fileNotFound);
	};

	function fileFound(fileEntry){
		fileEntry.file(function(file){
			var reader = new FileReader();

			reader.onloadend = function(e) {
				if(isJsonFile){
					var jsonData = JSON.parse(this.result);
					insertData(jsonData);
				}else{
					insertTextData(this.result);
				}
			};

			reader.readAsText(file);
		});
	}

	function fileNotFound(error){
		console.log("FileSystem Error");
		console.log(error);
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
      $scope.selectedLanguageId = language.Id;
      $scope.selectedLanguage = language.Name;
      $scope.closeLanguagesModal();
    }

});