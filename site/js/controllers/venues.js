var app = angular.module('Venues', []);


app.controller('VenuesController', function($scope, $http){
    $scope.venues = new Array();
    $scope.currentCity = "all";
    var offset = 0;

    $scope.init = function() {
    	console.log('VenuesController: INIT');
    	fetchVenues();
    }

    function fetchVenues(){
        var url = '';
    	if ($scope.currentCity=='all')
    		url = '/api/venues?offset='+offset;
    	else
    		url = '/api/venues?city='+$scope.currentCity;
    	
    	
        $http.get(url).success(function(data, status, headers, config) {
            results = data['results'];
            confirmation = results['confirmation'];
            if (confirmation=='success'){
            	$scope.venues = results['venues'];
            	console.log('VENUES: '+JSON.stringify($scope.venues));
            	
            	offset += $scope.venues.length;
            }
            else {
                alert(results['message']);
            }

        }).error(function(data, status, headers, config) {
            console.log("error", data, status, headers, config);
        });
    }
    
    $scope.loadNext = function() {
    	fetchVenues();
    }


    $scope.updateVenue = function(index) {
    	venue = $scope.venues[index];
        var json = JSON.stringify(venue);
        
    	console.log('Update Venue: '+json);
    	
    	
    	
        var url = '/api/venues/'+venue.id;
        $http.put(url, json).success(function(data, status, headers, config) {
            results = data['results'];
            confirmation = results['confirmation'];
            if (confirmation=='success'){
                console.log("VENUE UPDATED: "+JSON.stringify(results));
                alert("VENUE UPDATED");
//            	$scope.profile = results['profile'];
            }
            else {
                alert(results['message']);
            }
            $scope.loading = false;
        }).error(function(data, status, headers, config) {
            console.log("error", data, status, headers, config);
        });
    }
    
    $scope.changeCity = function() {
        offset = 0;
    	console.log('CHANGE CITY: '+$scope.currentCity);
    	fetchVenues();

    	
    }
    

    $scope.capitalize = function(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    $scope.formattedDate = function(dateStr) {
    	date = moment(new Date(dateStr)).format('MMM D, h:mm a');
    	return date;
    }




});


