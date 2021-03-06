var appService = angular.module('MyDictionary.services', ['MyDictionary.config', 'ngCordova']);

appService.factory('DB', function($q, DB_CONFIG, $cordovaSQLite, $ionicPlatform, DictionaryDate){
	var self = this;
	self.db = null;

	self.init = function(){
		try{
			if(window.cordova){
				self.db = $cordovaSQLite.openDB(DB_CONFIG.name + ".db");
			}else{
				self.db = window.openDatabase(DB_CONFIG.name, '1.0', 'database', -1);
			}

			angular.forEach(DB_CONFIG.tables, function(table){
				var columns = [];

				angular.forEach(table.columns, function(column){
					columns.push(column.name + ' ' + column.type);
				});

				var query = 'CREATE TABLE IF NOT EXISTS ' + table.name + ' (' + columns.join(',') + ')';
				self.query(query);
			});

			// Insert first language as English
			var dateCreated = DictionaryDate.getCurrentDate(),
				dateUpdated = dateCreated,
				parameterValues = ['English', dateCreated, dateUpdated, 'English'];

			self.query("INSERT INTO Language (Name, DateCreated, DateUpdated) SELECT (?),(?),(?) WHERE NOT EXISTS(SELECT 1 FROM Language WHERE Name = (?))", parameterValues).then(function(){
				parameterValues = ['English'];
				self.query("SELECT * FROM Language WHERE Name = (?)", parameterValues).then(function(result){
					var resultJson = self.getById(result),
						defaultLanguageId = resultJson.Id;

					console.log("defaultLanguageId");
					console.log(defaultLanguageId);
					parameterValues = ['DefaultLanguage', defaultLanguageId, dateCreated, dateUpdated, 'DefaultLanguage'];
					self.query("INSERT INTO Setting (SettingName, SettingValue, DateCreated, DateUpdated) SELECT (?),(?),(?),(?) WHERE NOT EXISTS(SELECT 1 FROM Setting WHERE SettingName = (?))", parameterValues);
					
				});
			});

			parameterValues = ['DefaultUrl', 'www.google.com', dateCreated, dateUpdated, 'DefaultUrl'];
			self.query("INSERT INTO Setting (SettingName, SettingValue, DateCreated, DateUpdated) SELECT (?),(?),(?),(?) WHERE NOT EXISTS(SELECT 1 FROM Setting WHERE SettingName = (?))", parameterValues);

		}catch(e){
			alert(e);
		}
	};

	self.query = function(query, parameters){
		try{
			parameters = parameters || [];
			var q = $q.defer();

			console.log(query);
			console.log(parameters);

			$ionicPlatform.ready(function () {
				$cordovaSQLite.execute(self.db, query, parameters)
				.then(function(result){
					q.resolve(result);
				}, function(error){
					console.log(error);
					q.reject(error);
				});
			});

			return q.promise;

		}catch(e){
			alert(e);
		}
	};

	self.getAll = function(result){
		var output = [];

		for(var i = 0; i < result.rows.length; i++){
			output.push(result.rows.item(i));
		}
		return output;
	};

	// Proces a single result
	self.getById = function(result) {
		console.log("inside getById");
		console.log(result);
		var output = null;

		if(result.rows.length <= 0)
			return output;

	    output = angular.copy(result.rows.item(0));
	    console.log(output);
	    return output;
	};

	String.prototype.repeat = function(times) {
	   return (new Array(times + 1)).join(this);
	};

	self.getInsertString = function(tableName, columns){
		return "INSERT INTO " + tableName +  " (" +  columns.join() + ") values (?" + ",?".repeat(columns.length - 1) + ")";
	};

	self.getDeleteString = function(tableName, column){
		return "DELETE FROM " + tableName + " WHERE " + column + " = (?)";
	};

	self.getUpdateString = function(tableName, columns, baseParameter){
		return "UPDATE " + tableName + " SET " + columns.join(" = (?),") + " = (?) WHERE " + baseParameter + " = (?)";
	};

	self.getSelectString = function(tableName, columns, baseParameter){

		var selectString = "SELECT ";
		if(columns != "*"){
			selectString += columns.join();
		}else{
			selectString += "*";
		}

		selectString += " FROM " + tableName;

		if(baseParameter){
			selectString += " WHERE " + baseParameter + " = (?)";
		}

		return selectString;
	};

	return self;
});