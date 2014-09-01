var profileViewController = angular.module('ProfileViewController', []);


profileViewController.controller('ProfileViewController', ['$scope', '$http', 'restService', function($scope, $http, restService){
    $scope.loading = false;
    $scope.isEditing = false;
    $scope.profile = {};
    $scope.passwordConfirm = '';
    
    // orders table
    $scope.visibleOrders = new Array();
    $scope.pages = new Array();
    
    $scope.init = function() {
    	console.log('ProfileController: INIT');
    	restService.checkLoggedIn(function(response) {
    		if (response.hasOwnProperty('error'))
    			alert(response.error);
    		
    		if (response.hasOwnProperty('profile')){
    			$scope.profile = response['profile'];
    			fetchProfileOrders();
    		}
    		
    		if (response.hasOwnProperty('message')) // user not logged in.
    			alert(response.message);

    	});
    }
    
    $scope.toggleEditingMode = function(){
    	console.log('TOGGLE EDITING MODE');
    	$scope.isEditing = !$scope.isEditing;
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
            var results = data['results'];
            var confirmation = results['confirmation'];
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
    
    function fetchProfileOrders() {
    	if ($scope.profile.orders != null)
    		return;
    	
    	console.log('FETCH PROFILE ORDERS');
    	$scope.loading = true;
    	
    	
    	restService.getResource('deliveryorders', null, {'profile':$scope.profile.id}, function(response) {
        	$scope.loading = false;
        	
        	console.log('RESPONSE: '+JSON.stringify(response));
        	
    		if (response.hasOwnProperty('error'))
    			alert(response.error);
    		
    		if (response.hasOwnProperty('deliveryorders')){
    			$scope.profile.orders = response['deliveryorders'];
    			
    			var d = $scope.profile.orders.length / 10;
    			var numPages = parseInt(d, 10);
    			if ($scope.profile.orders % 10 != 0)
    				numPages++;
    			
    			for (var i=0; i<numPages; i++)
    				$scope.pages.push(i);
    			
    			
    			var max = ($scope.profile.orders.length < 10) ? $scope.profile.orders.length : 10;
    			
				for (var i=0; i<max; i++){
					var order = $scope.profile.orders[i];
					$scope.visibleOrders.push(order);
				}
    		}
    		
    		if (response.hasOwnProperty('message')) // user not logged in.
    			alert(response.message);
    	});
    }
    
    $scope.viewPage = function(index){
    	console.log('VIEW PAGE: '+index);
    	
    	var start = 10*index;
    	var ceiling = start+10;
		var max = (ceiling >= $scope.profile.orders.length) ? $scope.profile.orders.length : ceiling;
		$scope.visibleOrders = new Array();
		for (var i=start; i<max; i++){
			var order = $scope.profile.orders[i];
			$scope.visibleOrders.push(order);
		}
    }

    $scope.getUploadString = function() {
    	console.log('Get Upload String');
        $scope.loading = true;

        var url = '/api/upload?resource=profile&id='+$scope.profile.id;
        $http.get(url).success(function(data, status, headers, config) {
            var results = data['results'];
            var confirmation = results['confirmation'];
            if (confirmation=='success'){
            	var uploadString = results['upload'];
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
    
    
    $scope.truncatedText = function(string, max) {
    	if (string.length > max)
    		return string.substring(0, max)+'...';
    	
    	return string;
    
    }


    $scope.capitalize = function(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    $scope.formattedDate = function(dateStr) {
    	date = moment(new Date(dateStr)).format('MM/DD/YYYY');
    	return date;
    }
    


}]);

