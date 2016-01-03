appService.factory('DictionaryDate', function($filter){
	var self = this;

	self.getCurrentDate = function(){
		/*var from = new Date(1900, 0, 1).getTime();
		var to = new Date(2100, 0, 1).getTime();
		var newDate = new Date(from + Math.random() * (to - from));*/

		
		var newDate = new Date();
		return newDate = $filter('date')(newDate, 'MM/dd/yyyy');
	};

	return self;
});