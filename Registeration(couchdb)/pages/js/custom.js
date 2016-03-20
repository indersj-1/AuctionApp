var app = angular.module('myApp', ['ngRoute']);

app.config(function($routeProvider){
	$routeProvider

	.when('/',{
		templateUrl : "welcome.html",
		controller :"test"
	})

	.when('/register',{
		templateUrl : "pages/register.html",
		controller : "registerUser"
	})

	.when('/login',{
		templateUrl : "pages/login.html",
		controller : "registerUser"
	})

	.when('/about',{
		templateUrl : "register.html",
		controller : "registerUser"
	})


})

app.controller("mainController", function($scope) {
	$scope.message = "my view is ready";
});

app.controller("test", function($scope) {
	$scope.message = "my view is test";
});



app.controller("registerUser",function($scope){
   $scope.message = "my view is regets";    
       $scope.registerUser = {
       		firstName : "Inder",
       		lastName : "Singh",
       		address : "bangalre",
       		city : "bangalore",
       		state : "karnataka",
       		zip : 549009,
       		title : "Nodejs MongoDB and Angularjs",
       		company : "Indersj",
       		phoneNo : 94084876551,
       		email : "indersi1@gmail.com",
       		website : "www.indersj.com"
       }



       $scope.completeRegister = function(){
       		
       		if(!$scope.form.$invalid){
       			alert("form submit");
       		}else{
       			alert("check all the filed")
       		}	
       };

});