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
				{ name: 'Sentence', type: 'text'}
			]
		}
	]
});