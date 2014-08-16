var app = angular.module('Home', []);


app.controller('HomeController', function($scope, $http){
	$scope.loading = false;
    $scope.profile = {'email':'', 'password':'', 'name':'', 'loggedIn':'no', 'number':''};
    $scope.leaders = null;
    $scope.newOrder = {'from':'', 'order':'', 'promo':'', 'address':''};
    $scope.selectedVenue = null;
    $scope.featuredVenues = [{'name':'Wasabi', 'city':'Ridgewood', 'state':'NJ', 'description':'For the best sushi and Japanese cuisine in Bergen county, order from Wasabi Japanese Restaurant. Wasabi offers full lunch and dinner seven days a week.', 'image':'wasabi.png'},
                             {'name':'Blue Moon', 'city':'Woodcliff Lake', 'state':'NJ', 'description':'If you\'re looking for authentic Mexican cuisine, Blue Moon Mexican Cafe is the place. With a menu featuring guacamole, tacos and burritos, everyone will be able to find something that they will love.', 'image':'bluemoon.png'},
                             {'name':'CVS', 'city':'Montvale', 'state':'NJ', 'description':'CVS offers a wide range of products from paper towels to sunscreen. Feeling sick and need some Dayquil? No need to get up, just order from Mercury MQ. Need drinks and chips for a party? We\'ve got you covered.', 'image':'cvs.png'},
                             {'name':'Chipotle', 'city':'Ramsey', 'state':'NJ', 'description':'Chipotle\'s menu consists of five items: burritos, fajita burritos, burritos bowls, tacos and salads. Chipotle elevates basic raw ingredients into food that\'s richer through their recipes and cooking techniques.', 'image':'chipotle.png'},
                             {'name':'Whole Foods', 'city':'Ridgewood', 'state':'NJ', 'description':'Whole Foods seeks out the finest natural and organic foods avaiable. They maintain the strictest quality standards in the industry. Order healthy organic food for breakfast, lunch and dinner! ', 'image':'wholefoods.png'},
                             {'name':'Panera Bread', 'city':'Woodcliff Lake', 'state':'NJ', 'description':'Panera offers a variety on their menu of sandwiches, soups and salads. Treat your taste buds to freshly baked flatbread, layered with fresh, bold ingredients. Have Panera delivered to your door and enjoy!', 'image':'panera.png'}];
    
    
    
    $scope.init = function() {
    	console.log('HomeController: INIT');
    	fetchContestLeaders();
    }

    
    
    function fetchContestLeaders() {
        var url = '/api/profiles?sort=points';
        $http.get(url).success(function(data, status, headers, config) {
            var results = data['results'];
            var confirmation = results['confirmation'];
            if (confirmation=='success'){
            	$scope.leaders = results.profiles;
            }
            else {
                alert(results['message']);
            }
        }).error(function(data, status, headers, config) {
            console.log("error", data, status, headers, config);
        });
    }
    
    $scope.prizeValue = function(index){
    	if (index==0)
    		return '$50';
    	else if (index==1)
    		return '$20';
    	else
    		return '';
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

		var json = JSON.stringify($scope.profile);
		console.log(json);

        var url = '/api/login';
        $http.post(url, json).success(function(data, status, headers, config) {
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
    
    $scope.order = function() {
    	console.log('ORDER');
    	
    	if ($scope.newOrder.from.length < 10){
    		alert('Error: Please enter a valid phone number, like this: 201-555-1234');
    		return false;
    	}

    	if ($scope.newOrder.order.length == 0){
    		alert('Error: Please enter a valid order.');
    		return false;
    	}
    	
    	if ($scope.newOrder.address.length == 0){
    		alert('Error: Please enter a valid address.');
    		return false;
    	}
    	
    	$scope.newOrder['venue'] = $scope.selectedVenue.name;
    	var json = JSON.stringify($scope.newOrder);
    	console.log(json);
    	
    	$scope.loading = true;
    	
        var url = '/api/deliveryorders';
        $http.post(url, json).success(function(data, status, headers, config) {
            var results = data['results'];
            var confirmation = results['confirmation'];
            if (confirmation=='success'){
            	$scope.loading = false;
            	alert('Your Order has been received. Thank you!');
                $scope.newOrder = {'phone':'', 'order':'', 'promo':'', 'address':''};
            }
            else {
                alert(results['message']);
            }
        }).error(function(data, status, headers, config) {
            console.log("error", data, status, headers, config);
        });

    }
    
    $scope.selectVenue = function(index){
    	$scope.selectedVenue = $scope.featuredVenues[index];
    	console.log('selectVenue: '+index);
    	
    }

    $scope.capitalize = function(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
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
                } 
                else {
                    spinner.stop();
                }
            });
        }
    }
});



