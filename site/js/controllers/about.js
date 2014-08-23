var aboutController = angular.module('AboutViewController', []);


aboutController.controller('AboutViewController', ['$scope', '$http', function($scope, $http){
	$scope.loading = false;
    $scope.profile = {'email':'', 'password':'', 'name':'', 'loggedIn':'no', 'number':''};
    
    
    $scope.init = function() {
    	console.log('AboutController: INIT');
    	checkLoggedIn();
    }
    
    function checkLoggedIn(){
        var url = '/api/profile';
        $http.get(url).success(function(data, status, headers, config) {
            var results = data['results'];
            var confirmation = results['confirmation'];
            if (confirmation=='success'){
                $scope.profile = results['profile'];
                console.log(JSON.stringify($scope.profile));
            }
            else {
//                alert(results['message']);
            }
        }).error(function(data, status, headers, config) {
            console.log("error", data, status, headers, config);
        });
    }
    
    
    $scope.register = function() {
    	$scope.profile.email = document.getElementById('email').value;
    	
    	if ($scope.profile.email.length==0){
    		alert('Please Enter an Email Address.');
    		return;
    	}

    	if ($scope.profile.name.length==0){
    		alert('Please Enter a Username.');
    		return;
    	}

    	if ($scope.profile.number.length < 10){
    		alert('Please Enter a Valid Phone Number.');
    		return;
    	}

    	if ($scope.profile.password.length==0){
    		alert('Please Enter a Password.');
    		return;
    	}


		json = JSON.stringify($scope.profile);
		console.log(json);

        var url = '/api/profile';
        $http.post(url, json).success(function(data, status, headers, config) {
            var results = data['results'];
            var confirmation = results['confirmation'];
            if (confirmation=='success'){
                $scope.profile = results['profile'];
                window.location.href = '/site/profile';
            }
            else {
                alert(results['message']);
            }
        }).error(function(data, status, headers, config) {
            console.log("error", data, status, headers, config);
        });

    }
    
    $scope.login = function(){
    	if ($scope.profile.number.length < 10){
    		alert('Please Enter a Valid Phone Number.');
    		return;
    	}

    	if ($scope.profile.password.length==0){
    		alert('Please Enter a Password.');
    		return;
    	}
    	
    	self.loading = true;

		var json = JSON.stringify($scope.profile);
		console.log(json);

        var url = '/api/login';
        $http.post(url, json).success(function(data, status, headers, config) {
        	self.loading = false;
            var results = data['results'];
            var confirmation = results['confirmation'];
            if (confirmation=='success'){
//            	console.log(JSON.stringify(results));
                window.location.href = '/site/profile';
            }
            else {
                alert(results['message']);
            }
        }).error(function(data, status, headers, config) {
            console.log("error", data, status, headers, config);
        });
    	
    	
    }
    

    $scope.capitalize = function(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

}]);




