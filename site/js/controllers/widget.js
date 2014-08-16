var app = angular.module('Widget', []);


app.controller('WidgetController', function($scope, $http){
    $scope.profile = {
        queue: []
    };

    $scope.order = {'number':'', 'message':'', 'timestamp': new Date(), 'notes':'', 'name':''};

    
    $scope.initWithProfile = function(profileId) {
    	console.log('WidgetController: '+profileId);
    	$scope.order.profile = profileId;
    }
    
    $scope.placeOrder = function() {
    	$scope.order.timestamp = new Date();
    	$scope.order.table = 13;

    	json = JSON.stringify($scope.order);
    	console.log('PLACE ORDER: '+json);
    	
    	
        var url = '/api/order/';
        $http.post(url, json).success(function(data, status, headers, config) {
            results = data['results'];
            confirmation = results['confirmation'];
            if (confirmation=='success'){
            	alert('Your order has been placed. You will receive a text message when it is ready.');
                $scope.order = {'number':'', 'message':'', 'timestamp': new Date(), 'notes':'', 'name':''};
                console.log(JSON.stringify(results));
            }
            else {
                alert(results['message']);
            }
            $scope.loading = false;
        }).error(function(data, status, headers, config) {
            console.log("error", data, status, headers, config);
        });

    	
    }

    function fetchProfile(){
        $scope.loading = true;
        var url = '/api/profile/';
        $http.get(url).success(function(data, status, headers, config) {
            results = data['results'];
            confirmation = results['confirmation'];
            if (confirmation=='success'){
            	$scope.profile = results['profile'];
                console.log(JSON.stringify($scope.profile));
            }
            else {
                alert(results['message']);
            }
            $scope.loading = false;
        }).error(function(data, status, headers, config) {
            console.log("error", data, status, headers, config);
        });
    }

    $scope.capitalize = function(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    $scope.formattedDate = function(dateStr) {
    	date = moment(new Date(dateStr)).format('MMMM Do, h:mm a');
    	return date;
    }
    
    

});


