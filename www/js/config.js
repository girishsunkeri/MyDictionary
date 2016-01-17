angular.module('MyDictionary.config', [])

.constant('DB_CONFIG', {
	name: "DictionaryDB",
	tables: [
		{
			name: 'Word',
			columns: [
				{ name: 'Id', type: 'integer primary key' },
				{ name: 'Name', type: 'text'},
				{ name: 'Meaning', type: 'text'},
				{ name: 'Sentence', type: 'text'},
				{ name: 'LanguageId', type: 'integer'},
				{ name: 'DateCreated', type: 'text'},
				{ name: 'DateUpdated', type: 'text'}
			]
		},
		{
			name: 'Language',
			columns: [
				{ name: 'Id', type: 'integer primary key' },
				{ name: 'Name', type: 'text'},
				{ name: 'DateCreated', type: 'text'},
				{ name: 'DateUpdated', type: 'text'}
			]
		},
		{
			name: 'Setting',
			columns: [
				{ name: 'Id', type: 'integer primary key' },
				{ name: 'SettingName', type: 'text'},
				{ name: 'SettingValue', type: 'text'},
				{ name: 'DateCreated', type: 'text'},
				{ name: 'DateUpdated', type: 'text'}
			]
		}
	]
});