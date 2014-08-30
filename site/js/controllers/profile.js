var profileViewController = angular.module('ProfileViewController', []);


profileViewController.controller('ProfileViewController', ['$scope', '$http', 'restService', function($scope, $http, restService){
    $scope.loading = false;
    $scope.profile = {};
    $scope.passwordConfirm = '';
    
    $scope.init = function() {
    	console.log('ProfileController: INIT');
    	restService.checkLoggedIn(function(response) {
    		if (response.hasOwnProperty('error'))
    			alert(response.error);
    		
    		if (response.hasOwnProperty('profile'))
    			$scope.profile = response['profile'];
    		
    		if (response.hasOwnProperty('message')) // user not logged in.
    			alert(response.message);

    	});
    }
    
    


    $scope.capitalize = function(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    $scope.formattedDate = function(dateStr) {
    	date = moment(new Date(dateStr)).format('MM/DD/YYYY');
    	return date;
    }
    
    $scope.update = function() {
    	if ($scope.profile.number.length < 10){
    		alert('Please Enter a Valid Phone Number');
    		return;
    	}

    	if ($scope.profile.name.length < 2){
    		alert('Please Enter a Valid Username (at least 2 characters)');
    		return;
    	}
    	
    	updateProfile();
    }


    function updateProfile() {
        
    	if ($scope.profile.password != null){
            if ($scope.profile.password != $scope.passwordConfirm){
            	alert('The Passwords do not match. Please try again.');
            	return;
            }
    	}

        $scope.loading = true;

        
        var json = JSON.stringify($scope.profile);
        var url = '/api/profile/';
        $http.put(url, json).success(function(data, status, headers, config) {
            results = data['results'];
            confirmation = results['confirmation'];
            if (confirmation=='success'){
            	$scope.profile = results['profile'];
            	$scope.passwordConfirm = '';
                alert('Profile Updated');
            }
            else {
                alert(results['message']);
            }
            $scope.loading = false;
        }).error(function(data, status, headers, config) {
            console.log("error", data, status, headers, config);
        });
    }
    
    $scope.fetchProfileOrders = function() {
    	if ($scope.profile.orders != null)
    		return;
    	
    	console.log('FETCH PROFILE ORDERS');
    	$scope.loading = true;
    	
    	
    	restService.getResource('deliveryorders', null, {'profile':$scope.profile.id}, function(response) {
        	$scope.loading = false;
        	
        	console.log('RESPONSE: '+JSON.stringify(response));
        	
    		if (response.hasOwnProperty('error'))
    			alert(response.error);
    		
    		if (response.hasOwnProperty('deliveryorders'))
    			$scope.profile.orders = response['deliveryorders'];
    		
    		if (response.hasOwnProperty('message')) // user not logged in.
    			alert(response.message);

    	});
    	
    	
    }

    $scope.getUploadString = function() {
    	console.log('Get Upload String');
        $scope.loading = true;

        var url = '/api/upload?resource=profile&id='+$scope.profile.id;
        $http.get(url).success(function(data, status, headers, config) {
            results = data['results'];
            confirmation = results['confirmation'];
            if (confirmation=='success'){
            	uploadString = results['upload'];
                console.log(uploadString);

                document.getElementById('image-form').action = uploadString;
                document.getElementById('image-form').submit();
            }
            else {
                alert(results['message']);
            }
        }).error(function(data, status, headers, config) {
            console.log("error", data, status, headers, config);
        });
    }


}]);

