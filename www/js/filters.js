myDictionaryModule.filter('DateWithFullMonth', function($filter){
	return function(input){
		var newDate =  new Date(input);
		return $filter('date')(newDate, 'dd MMM yyyy');
	};
});