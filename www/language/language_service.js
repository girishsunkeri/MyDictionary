appService.factory('Language', function(DB, DictionaryDate){
	var self = this;

	self.all = function(){
		return DB.query("SELECT * FROM Language")
			   .then(function(result){
			   		console.log(result);
			   		return DB.getAll(result);
			   });
	};

	self.add = function(language){
		var dateCreated = DictionaryDate.getCurrentDate(),
			dateUpdated = dateCreated

		var parameterValues = [language.Name, dateCreated, dateUpdated],
			parameterNames = ['Name', 'DateCreated','DateUpdated'];

		return DB.query(DB.getInsertString('Language', parameterNames), parameterValues);
	};

	self.updateLanguage = function(language){
		var parameterValues = [language.Name, language.Id],
			parameterNames = ['Name'],
			baseParameter = 'Id';

		return DB.query(DB.getUpdateString('Language', parameterNames, baseParameter), parameterValues);
	};

	self.deleteLanguage = function(languageId){
		var parameterValues = [languageId];

		return DB.query(DB.getDeleteString('LanguageId', 'Id'), parameterValues);
	};

	self.getByName = function(name){
		var parameters = [name];

		return DB.query("SELECT Id FROM Language WHERE Name = (?)", parameters)
			.then(function(result){
				return DB.getById(result);
			});
	};

	return self;
});