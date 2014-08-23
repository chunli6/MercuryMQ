
var restService = angular.module('restService', []);

restService.factory('restService', ['$http',
                                    function($http) {
	
                                              return {
                                                  checkLoggedIn: function(callback) {
                                                      var url = '/api/profile';

                                                      $http.get(url).success(function(data, status, headers, config) {
                                                          var results = data['results'];
                                                          console.log('RESULTS: '+JSON.stringify(results));
                                                          var confirmation = results['confirmation'];
                                                          if (confirmation=='success'){
                                                        	  callback({'profile':results['profile']});
                                                          }
                                                          else {
                                                        	  callback({'message':results['message']});
                                                          }
                                                      }).error(function(data, status, headers, config) {
                                                          console.log("error", data, status, headers, config);
                                                    	  callback({'error':data});
                                                      });
                                                  },
                                            	  
                                                  getResource: function(resource, id, params) {
                                                	  var endpoint = '/api/'+resource;
                                                	  if (id != null)
                                                		  endpoint = endpoint+'/'+id;
                                                	  
                                                	  if (params != null){
                                                		  endpoint = endpoint+'?';
                                                		  
                                                		  for (var key in params) {
                                                			    if (params.hasOwnProperty(key)) 
                                                            		  endpoint = endpoint+key+'='+params[key];
                                                			}                                                		  
                                                	  }
                                                	  
                                                	  console.log('GET RESOURCE: '+endpoint);
                                                      return $http.get(endpoint); 
                                                  },
                                                  
                                                  postResource: function(resource, object, params) {
                                                	  var endpoint = '/api/'+resource;
                                                	  
                                                	  if (object == null) // must have an object
                                                		  return;
                                                	  
                                                	  if (params != null){
                                                		  endpoint = endpoint+'?';
                                                		  
                                                		  for (var key in params) {
                                                			    if (params.hasOwnProperty(key)) 
                                                            		  endpoint = endpoint+key+'='+params[key];
                                                			    
                                                			}                                                		  
                                                	  }
                                                	  
                                                	  console.log('POST RESOURCE: '+endpoint);
                                                	  
                                                      var json = JSON.stringify(object);
                                                      return $http.post(endpoint, json); 
                                                  },

                                                  
                                                  

                                                  putResource: function(resource, object, params) {
                                                	  var endpoint = '/api/'+resource;
                                                	  
                                                	  if (object == null) // must have an object
                                                		  return;
                                                	  
                                            		  endpoint = endpoint+'/'+object.id; // PUTs can only be called on specific entities
                                                	  if (params != null){
                                                		  endpoint = endpoint+'?';
                                                		  
                                                		  for (var key in params) {
                                                			    if (params.hasOwnProperty(key)) 
                                                            		  endpoint = endpoint+key+'='+params[key];
                                                			    
                                                			}                                                		  
                                                	  }
                                                	  
                                                	  console.log('PUT RESOURCE: '+endpoint);
                                                	  
                                                      var json = JSON.stringify(object);
                                                      return $http.put(endpoint, json); 
                                                  },

                                                  
                                                  deleteResource: function(resource, object, params) {
                                                	  var endpoint = '/api/'+resource;
                                                	  
                                                	  if (object == null) // must have an object
                                                		  return;
                                                	  
                                            		  endpoint = endpoint+'/'+object.id; // DELETEs can only be called on specific entities
                                                	  if (params != null){
                                                		  endpoint = endpoint+'?';
                                                		  
                                                		  for (var key in params) {
                                                			    if (params.hasOwnProperty(key)) 
                                                            		  endpoint = endpoint+key+'='+params[key];
                                                			    
                                                			}                                                		  
                                                	  }
                                                	  
                                                	  console.log('DELETE RESOURCE: '+endpoint);
                                                      
                                                      return $http.delete(endpoint); 
                                                  }

                                                  

                                              }
                                          }
                                      ]);