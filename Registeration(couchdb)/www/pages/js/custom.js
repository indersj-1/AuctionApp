var app = angular.module('myApp', ['ui.router']);



app.run(
  [          '$rootScope', '$state', '$stateParams',
    function ($rootScope,   $state,   $stateParams) {

    // It's very handy to add references to $state and $stateParams to the $rootScope
    // so that you can access them from any scope within your applications.For example,
    // <li ng-class="{ active: $state.includes('contacts.list') }"> will set the <li>
    // to active whenever 'contacts.list' or one of its decendents is active.
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    }
  ]
)

          app.config(function($stateProvider, $urlRouterProvider) {
    
            $urlRouterProvider.otherwise('/');
            
            $stateProvider
                
                // HOME STATES AND NESTED VIEWS ========================================
                .state('welcome', {
                    url: '/',
                    templateUrl: 'pages/welcome.html',
                    controller : "welcome"
                })

                  .state('register', {
                    url: '/register',
                    templateUrl: 'pages/register.html',
                    controller : "registerUser"
                })
              
               .state('login', {
                    url: '/login',
                    templateUrl: 'pages/login.html',
                    controller : "loginController"
                })  
      });


        // app.config(function($routeProvider){
        // 	$routeProvider

        // 	.when('/',{
        // 		templateUrl : "pages/welcome.html",
        // 		controller :"welcome"
        // 	})

        // 	.when('/register',{
        // 		templateUrl : "pages/register.html",
        // 		controller : "registerUser"
        // 	})

        // 	.when('/login',{
        // 		templateUrl : "pages/login.html",
        // 		controller : "registerUser"
        // 	})

        // 	.when('/about',{
        // 		templateUrl : "register.html",
        // 		controller : "registerUser"
        // 	})
        //  .otherwise({redirectTo:'/'});

        // })

        app.controller("mainController", function($scope,$rootScope) {

        });

        app.controller("welcome", function($scope, $rootScope) {

        });

        app.controller("loginController", function($scope, $rootScope) {

        });


        app.controller("registerUser",function($scope, $rootScope){
           $rootScope.message = "my view is regets";    
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