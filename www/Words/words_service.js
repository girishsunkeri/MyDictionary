appService.factory('Word', function(DB){
	var self = this;

	self.all = function(){
		return DB.query("SELECT * FROM Word")
			   .then(function(result){
			   		return DB.getAll(result);
			   });
	};

	self.add = function(word){
		var parameterValues = [word.Name, word.Meaning, word.Sentence],
			parameterNames = ['Name', 'Meaning', 'Sentence'];

		return DB.query(DB.getInsertString('Word', parameterNames), parameterValues);
	};

	self.deleteWord = function(wordId){
		var parameterValues = [wordId];

		return DB.query(DB.getDeleteString('Word', 'Id'), parameterValues);
	};

	self.updateWord = function(word){
		var parameterValues = [word.Name, word.Meaning, word.Sentence, word.Id],
			parameterNames = ['Name', 'Meaning', 'Sentence'],
			baseParameter = 'Id';

		return DB.query(DB.getUpdateString('Word', parameterNames, baseParameter), parameterValues);
	};

	return self;
});