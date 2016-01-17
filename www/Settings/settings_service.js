appService.factory('Setting', function(DB, DictionaryDate){
	var self = this;

	self.get = function(id){
		var parameters = [settingName, id],
			baseParameter = "Id";

		return DB.query(DB.getSelectString("Setting", "*", baseParameter), parameters)
			   .then(function(result){
			   		return DB.getById(result);
			   });
	};

	self.getByName = function(settingName){
		var parameters = [settingName],
			baseParameter = "SettingName";

		return DB.query(DB.getSelectString("Setting", "*", baseParameter), parameters)
			   .then(function(result){
			   		return DB.getById(result);
			   });
	};

	self.all = function(){
		return DB.query(DB.getSelectString("Setting", "*"))
			   .then(function(result){
			   		return DB.getAll(result);
			   });
	};

	self.add = function(setting){
		var dateCreated = DictionaryDate.getCurrentDate(),
			dateUpdated = dateCreated;
			parameterValues = [setting.SettingName, setting.SettingValue, dateCreated, dateUpdated],
			parameterNames = ['SettingName', 'SettingValue','DateCreated','DateUpdated'];

		return DB.query(DB.getInsertString('Setting', parameterNames), parameterValues);
	};

	self.update = function(setting){
		var dateUpdated = DictionaryDate.getCurrentDate(),
			parameterValues = [setting.SettingValue, dateUpdated, setting.Id],
			parameterNames = ['SettingValue', 'DateUpdated'],
			baseParameter = "Id";


		return DB.query(DB.getUpdateString("Setting", parameterNames, baseParameter), parameterValues);
	}

	return self;

});