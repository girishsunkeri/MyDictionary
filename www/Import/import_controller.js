myDictionaryModule.controller('ImportFileCtrl', function($scope, $http, Word){
	$scope.importWords = function(){
		$http.get('Import/word_data.json').success(function(words){
			console.log(words);
			var count = 0;
			angular.forEach(words, function(word){
				Word.add(word).then(function(){
					count++;
				});
			});
		});
	}
});