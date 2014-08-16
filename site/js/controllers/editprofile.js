var app = angular.module('Profile', []);

app.directive('Spinner', function() {
    return {
        restrict: 'A',
        replace: true,
        transclude: true,
        scope: {
            loading: '=spinner'
        },
        template: '<div><div ng-show="loading" class="my-loading-spinner-container"></div><div ng-hide="loading" ng-transclude></div></div>',
        link: function(scope, element, attrs) {
            var spinner = new Spinner().spin();
            var loadingContainer = element.find('.my-loading-spinner-container')[0];
            loadingContainer.appendChild(spinner.el);
        }
    }
});

app.controller('ProfileController', function($scope, $http){
    $scope.profile = {'email':'', 'password':'', 'username':'', 'loggedIn':'no'};
    $scope.newProject = {'name':'', 'description':''};
    $scope.overlay = false;
    $scope.loading = false;
    $scope.viewLoading = true;

    $scope.init = function() {
    	console.log('ProfileController: INIT');
    	fetchProfile();
    }


    $scope.updateProfile = function() {
        $scope.loading = true;
        $scope.overlay = true;
        // var opts = {
        //   lines: 13, // The number of lines to draw
        //   length: 20, // The length of each line
        //   width: 10, // The line thickness
        //   radius: 30, // The radius of the inner circle
        //   corners: 1, // Corner roundness (0..1)
        //   rotate: 0, // The rotation offset
        //   direction: 1, // 1: clockwise, -1: counterclockwise
        //   color: '#000', // #rgb or #rrggbb or array of colors
        //   speed: 1, // Rounds per second
        //   trail: 60, // Afterglow percentage
        //   shadow: false, // Whether to render a shadow
        //   hwaccel: false, // Whether to use hardware acceleration
        //   className: 'spinner', // The CSS class to assign to the spinner
        //   zIndex: 2e9, // The z-index (defaults to 2000000000)
        //   top: 'auto', // Top position relative to parent in px
        //   left: 'auto' // Left position relative to parent in px
        // };
        // var target = document.getElementById('foo'); // this is not going to work in Angular
        // var spinner = new Spinner(opts).spin(target);

    	console.log('ProfileController: updateProfile');

    	if ($scope.profile.username.length==0){
    		alert('Please Enter a Username.');
    		return;
    	}

		json = JSON.stringify($scope.profile);
		console.log(json);

        var url = '/api/profile';
        $http.put(url, json).success(function(data, status, headers, config) {
            results = data['results'];
            confirmation = results['confirmation'];
            if (confirmation=='success'){
            	projects = $scope.profile.projects;
            	posts = $scope.profile.posts;

                $scope.profile = results['profile'];
            	$scope.profile.projects = projects;
            	$scope.profile.posts = posts;

                alert('Profile Updated!');
                $scope.overlay = false;
                $scope.loading = true;
                // spinner.stop();
            }
            else {
                alert(results['message']);
            }
        }).error(function(data, status, headers, config) {
            console.log("error", data, status, headers, config);
        });

    }

    function fetchProfile(){
        var url = '/api/profile';
        $http.get(url).success(function(data, status, headers, config) {
            results = data['results'];
            confirmation = results['confirmation'];
            if (confirmation=='success'){
            	$scope.profile = results['profile'];
                console.log(JSON.stringify($scope.profile));
            	$scope.newProject['profile'] = $scope.profile.id;
            	fetchProfilePosts();
            }
            else {
                alert(results['message']);
            }
        }).error(function(data, status, headers, config) {
            console.log("error", data, status, headers, config);
        });
    }

    function fetchProfilePosts(){
        var url = '/api/posts?source='+$scope.profile.id;
        $http.get(url).success(function(data, status, headers, config) {
            results = data['results'];
            confirmation = results['confirmation'];
            if (confirmation=='success'){
            	$scope.profile.posts = results['posts'];
//                console.log(JSON.stringify($scope.posts));

                fetchProfileProjects();
            }
            else {
                alert(results['message']);
            }
        }).error(function(data, status, headers, config) {
            console.log("error", data, status, headers, config);
        });

    }

    function fetchProfileProjects(){
        var url = '/api/projects?profile='+$scope.profile.id;
        $http.get(url).success(function(data, status, headers, config) {
            results = data['results'];
            confirmation = results['confirmation'];
            if (confirmation=='success'){
            	$scope.profile.projects = results['projects'];
//                console.log(JSON.stringify($scope.projects));
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

    $scope.addProject = function() {
    	console.log('Add Project: '+JSON.stringify($scope.newProject));

    	if ($scope.newProject.name.length==0){
    		alert('Please Enter a Project Name.');
    		return;
    	}

//    	$scope.newProject['profile'] = $scope.profile.id;
		json = JSON.stringify($scope.newProject);
		console.log(json);


        var url = '/api/projects';
        $http.post(url, json).success(function(data, status, headers, config) {
            results = data['results'];
            confirmation = results['confirmation'];
            if (confirmation=='success'){
                project = results['project'];
                console.log(JSON.stringify(project));
                window.location.href = '/site/projects/'+project.id+'?page=edit';
            }
            else {
                alert(results['message']);
            }
        }).error(function(data, status, headers, config) {
            console.log("error", data, status, headers, config);
        });
    }


    $scope.truncatedString = function(string, max) {
    	if (string.length < max)
    		return string;

    	max = max-2;
    	truncatedString = string.substring(0, max);
    	truncatedString = truncatedString+'...';

    	return truncatedString;
    }



    $scope.capitalize = function(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    $scope.formattedDate = function(dateStr) {
    	date = moment(new Date(dateStr)).format('MMM D, YYYY');
    	return date;
    }


});