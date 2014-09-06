var listingsViewController = angular.module('ListingsViewController', ['angularFileUpload']);


listingsViewController.controller('ListingsViewController', ['$scope', '$http', 'restService', '$upload', function($scope, $http, restService, $upload){
    $scope.loading = false;
    $scope.profile = {};
    
    
    $scope.init = function() {
    	console.log('ListingsController: INIT');
    	
    	restService.checkLoggedIn(function(response) {
    		if (response.hasOwnProperty('error'))
    			alert(response.error);
    		
    		if (response.hasOwnProperty('profile')){
//    			$scope.profile = response['profile'];
//    			fetchProfileOrders();
    		}
    		
//    		if (response.hasOwnProperty('message')) // user not logged in.
//    			alert(response.message);

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
    
    

    
	$scope.onFileSelect = function($files) {
	    $scope.loading = true;
    	console.log('SELECT IMAGE: ');
        var url = '/api/upload';
    	
    	
        $http.get(url).success(function(data, status, headers, config) {
            var results = data['results'];
            if (results['confirmation']=='success'){
            	var uploadString = results['upload'];
                console.log('UPLOAD STRING: '+uploadString);
                
            	
                //$files: an array of files selected, each file has name, size, and type.
                for (var i = 0; i < $files.length; i++) {
                  var file = $files[i];
                  $scope.upload = $upload.upload({
                    url: uploadString, //upload.php script, node.js route, or servlet url
                    method: 'POST',
                    // headers: {'header-key': 'header-value'},
                    // withCredentials: true,
                    data: {myObj: $scope.myModelObj},
                    file: file // or list of files: $files for html5 only
                    /* set the file formData name ('Content-Desposition'). Default is 'file' */
                    //fileFormDataName: myFile, //or a list of names for multiple files (html5).
                    /* customize how data is added to formData. See #40#issuecomment-28612000 for sample code */
                    //formDataAppender: function(formData, key, val){}
                  }).progress(function(evt) {
                    console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
                  }).success(function(data, status, headers, config) { // file is uploaded successfully
                    console.log(data);
                    var results = data['results'];
                    
					$scope.loading = false;
                    var confirmation = results['confirmation'];
                    if (confirmation=='success'){
                    	console.log(JSON.stringify(results));
                    	var image = results['image'];
                    	$scope.profile.image = image['id'];
                    	
                    }
                    else{
                    	alert(results['message']);
                    }
                  });
                  //.error(...)
                  //.then(success, error, progress); 
                  //.xhr(function(xhr){xhr.upload.addEventListener(...)})// access and attach any event listener to XMLHttpRequest.
                }
                
                /* alternative way of uploading, send the file binary with the file's content-type.
                   Could be used to upload files to CouchDB, imgur, etc... html5 FileReader is needed. 
                   It could also be used to monitor the progress of a normal http post/put request with large data*/
                // $scope.upload = $upload.http({...})  see 88#issuecomment-31366487 for sample code.
            }
            else {
        	    $scope.loading = false;
                alert(results['message']);
            }
        }).error(function(data, status, headers, config) {
    	    $scope.loading = false;
            console.log("error", data, status, headers, config);
        });
      };
    
    


}]);

