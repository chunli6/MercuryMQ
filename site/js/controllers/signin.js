var signinController = angular.module('SigninViewController', []);


signinController.controller('SigninController', ['$scope', '$http', 'restService', function($scope, $http, restService){
	$scope.loading = false;
    $scope.profile = {'email':'', 'password':'', 'name':'', 'loggedIn':'no', 'number':''};
    
    
    $scope.init = function() {
    	console.log('SigninController: INIT');
    	
    	restService.checkLoggedIn(function(response) {
    		if (response.hasOwnProperty('error'))
    			alert(response.error);
    		
    		if (response.hasOwnProperty('profile'))
    			$scope.profile = response['profile'];
    	});
    }
    
    $scope.login = function(){
    	$scope.loading = true;

		restService.login($scope.profile, function(response){
	    	$scope.loading = false;
    		if (response.hasOwnProperty('error')) // network fail
    			alert(response.error);

    		if (response.hasOwnProperty('message')) // login fail
    			alert(response.message);

    		if (response.hasOwnProperty('profile')) // login success
                window.location.href = '/site/profile';
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


		var json = JSON.stringify($scope.profile);
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
    
    

    $scope.capitalize = function(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

}]);




