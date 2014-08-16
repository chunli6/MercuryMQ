var app = angular.module('Profile', []);


app.controller('ProfileController', function($scope, $http){
    $scope.loading = false;
    $scope.profile = {};
    $scope.orders = null;
    $scope.passwordConfirm = '';
    $scope.periods = ['period1'];
    $scope.weeks = {'period1':'July 6 - July 12'};
    
    $scope.init = function() {
    	console.log('ProfileController: INIT');
    	fetchProfile();
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



    function fetchProfile(){
        var url = '/api/profile/';
        $http.get(url).success(function(data, status, headers, config) {
            results = data['results'];
            confirmation = results['confirmation'];
            if (confirmation=='success'){
            	$scope.profile = results['profile'];
                console.log(JSON.stringify($scope.profile));
                fetchProfileOrders();
            }
            else {
                alert(results['message']);
            }

        }).error(function(data, status, headers, config) {
            console.log("error", data, status, headers, config);
        });
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
    
    function fetchProfileOrders(){
        var url = '/api/deliveryorders?profile='+$scope.profile.id;
        $http.get(url).success(function(data, status, headers, config) {
            results = data['results'];
            confirmation = results['confirmation'];
            if (confirmation=='success'){
            	$scope.orders = results['orders'];
                console.log(JSON.stringify($scope.orders));
            }
            else {
                alert(results['message']);
            }

        }).error(function(data, status, headers, config) {
            console.log("error", data, status, headers, config);
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


});

app.directive('knob', function() {
    return {
        restrict: 'A',
        replace: false,
        scope: {
            knobValue: '=time'
        },
        link: function (scope, element, attrs) {
            scope.$watch('knobValue', function (knobValue) {
                element.knob({
                    'format': function (v) {
                        return v + " min";
                    }
                });
                element.val(knobValue).trigger('change');
            });
        }
    }
});

app.directive('spinner', function() {
    return {
        restrict: 'A',
        replace: true,
        scope: {
            startSpinner: '=spin'
        },
        template: '<div></div>',
        link: function (scope, element, attrs) {
            var opts = {
              lines: 13,
              length: 20,
              width: 10,
              radius: 30,
              corners: 1,
              rotate: 0,
              direction: 1,
              color: '#000',
              speed: 1,
              trail: 60,
              shadow: false,
              hwaccel: false,
              className: 'spinner',
              zIndex: 2e9
            };
            var spinner = new Spinner(opts);
            scope.$watch('startSpinner', function (startSpinner) {
                if (startSpinner) {
                    spinner.spin(element[0]);
                } else {
                    spinner.stop();
                }
            });
        }
    }
});