var app = angular.module('myApp', ['ui.router']);

app.config(function($stateProvider, $urlRouterProvider) {
    /*using angualr ui router for templating*/
    $urlRouterProvider.otherwise('/');
    $stateProvider
        .state('register', {
            url: '/register',
            templateUrl: 'pages/template/register.html',
            controller: "registerUser"
        })

    .state('login', {
        url: '/',
        templateUrl: 'pages/template/login.html',
        controller: "loginController"
    })

    .state('welcome', {
        url: '/welcome',
        templateUrl: 'pages/template/welcome.html',
        controller: "welcome"
    })
});





